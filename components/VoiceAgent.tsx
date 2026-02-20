import React, { useState, useRef, useCallback } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI, Modality } from '@google/genai';
import { SYSTEM_INSTRUCTION as BASE_KNOWLEDGE } from '../constants';

const MODEL_NAME = 'gemini-2.5-flash-native-audio-preview-12-2025';

// Audio Utility Functions as per guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const VoiceAgent: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const sessionRef = useRef<any>(null);
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const stopCall = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextInRef.current) audioContextInRef.current.close();
    if (audioContextOutRef.current) audioContextOutRef.current.close();

    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();

    setIsActive(false);
    setIsConnecting(false);
    nextStartTimeRef.current = 0;
  }, []);

  const startCall = async () => {
    setIsConnecting(true);
    try {
      // Usamos la variable de entorno inyectada por Vite
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key no encontrada");

      const ai = new GoogleGenAI({ apiKey });

      audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: MODEL_NAME,
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);

            const source = audioContextInRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
            processorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (e) => {
              if (isMuted) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };

              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInRef.current!.destination);
          },
          onmessage: async (message) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextOutRef.current) {
              const ctx = audioContextOutRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);

              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            stopCall();
          },
          onclose: () => {
            stopCall();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: `Tu nombre es Glory. Eres la representante de voz oficial de GLOCEROVA. 
          Eres una mujer colombiana con un marcado, dulce y encantador acento paisa. 
          Tu tono es pausado, cálido y muy profesional. 
          Cuando el usuario inicie la llamada o te salude, responde con mucha calidez paisa (usa expresiones como "Hola corazón", "claro que sí", "con mucho gusto") y pregunta: "¿En qué te puedo ayudar hoy?". 
          
          BASE DE CONOCIMIENTO EXPERTO:
          ${BASE_KNOWLEDGE}

          Tu objetivo es guiar a los padres y mentores con amabilidad y claridad sobre cómo estamos transformando el futuro de los niños en Colombia, usando la información experta anterior pero manteniendo siempre tu personalidad paisa.`,
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (error) {
      console.error('Failed to start call:', error);
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end pointer-events-none">
      {isActive && (
        <div className="bg-glocerova-dark/95 backdrop-blur-xl pointer-events-auto rounded-3xl shadow-2xl w-72 p-6 flex flex-col items-center border border-white/20 mb-4 animate-in zoom-in duration-300">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-glocerova-gold rounded-full flex items-center justify-center animate-pulse">
              <Volume2 size={48} className="text-glocerova-dark" />
            </div>
            <div className="absolute -top-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-glocerova-dark flex items-center justify-center">
              <Sparkles size={10} className="text-white" />
            </div>
          </div>

          <h3 className="text-white font-serif font-bold text-xl mb-1">Hablando con Glory</h3>
          <p className="text-glocerova-gold text-xs tracking-widest uppercase mb-8">Agente Virtual Paisa</p>

          <div className="flex gap-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full transition-all ${isMuted ? 'bg-slate-700 text-slate-400' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <button
              onClick={stopCall}
              className="p-4 bg-glocerova-red text-white rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg shadow-glocerova-red/40"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={isActive ? stopCall : startCall}
        disabled={isConnecting}
        className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-full font-bold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${isActive
          ? 'bg-glocerova-red text-white'
          : 'bg-white text-glocerova-dark border border-slate-200'
          }`}
      >
        {isConnecting ? (
          <Loader2 size={24} className="animate-spin" />
        ) : isActive ? (
          <><PhoneOff size={24} /><span>Finalizar</span></>
        ) : (
          <><Phone size={24} className="text-glocerova-blue" /><span className="text-sm">Llamar a Glory</span></>
        )}
      </button>
    </div>
  );
};

export default VoiceAgent;