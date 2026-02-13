import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types.ts';
import { INITIAL_CHAT_MESSAGE } from '../constants.ts';
import { sendMessageStream } from '../services/geminiService.ts';

const ChatAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'init', role: 'model', text: INITIAL_CHAT_MESSAGE }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim() || isThinking) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: inputValue
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsThinking(true);

        const modelMsgId = (Date.now() + 1).toString();
        
        setMessages(prev => [...prev, {
            id: modelMsgId,
            role: 'model',
            text: '',
            isLoading: true
        }]);

        let accumulatedText = "";

        await sendMessageStream(userMsg.text, (chunk) => {
            accumulatedText += chunk;
            setMessages(prev => prev.map(msg => 
                msg.id === modelMsgId 
                    ? { ...msg, text: accumulatedText, isLoading: false } 
                    : msg
            ));
        });

        setIsThinking(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {isOpen && (
                <div className="bg-white pointer-events-auto rounded-2xl shadow-2xl w-[90vw] md:w-96 h-[500px] flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-10 fade-in duration-300 mb-4">
                    <div className="bg-glocerova-blue p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Asistente GLOCEROVA</h3>
                                <p className="text-xs text-blue-200">Impulsado por Gemini AI</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scrollbar-hide">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-glocerova-dark text-white' : 'bg-glocerova-gold text-glocerova-dark'}`}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-white text-slate-800 rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none'}`}>
                                    {msg.text}
                                    {msg.isLoading && <span className="inline-block w-1.5 h-4 ml-1 bg-slate-400 animate-pulse align-middle"></span>}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 bg-white border-t border-slate-100">
                        <div className="flex gap-2 relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Pregunta sobre nuestros programas..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-glocerova-blue/50 transition-all"
                                disabled={isThinking}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim() || isThinking}
                                className="absolute right-1.5 top-1.5 p-1.5 bg-glocerova-blue text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {isThinking ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="pointer-events-auto bg-glocerova-gold text-glocerova-dark hover:scale-105 transition-all shadow-xl rounded-full p-4 flex items-center gap-2 group">
                {isOpen ? <X size={28} /> : <><MessageSquare size={28} /><span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-bold text-sm">¿Preguntas?</span></>}
            </button>
        </div>
    );
};

export default ChatAssistant;