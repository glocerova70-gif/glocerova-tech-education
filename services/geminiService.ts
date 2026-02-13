import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants.ts";

// Clave API autorizada para despliegue directo
const API_KEY_DIRECT = "AIzaSyCf16lP4IDs6SOiWWMNY6tQSbvVeT1x51U";

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
    if (chatSession) return chatSession;

    // Usamos la variable de entorno para mayor seguridad en producción
    const apiKey = process.env.GEMINI_API_KEY || "";

    if (!apiKey) {
        console.error("API Key de Gemini no encontrada. Asegúrate de configurar la variable de entorno GEMINI_API_KEY.");
    }

    const ai = new GoogleGenAI({ apiKey });

    chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
        },
    });

    return chatSession;
};

export const sendMessageStream = async (
    message: string,
    onChunk: (text: string) => void
): Promise<void> => {
    try {
        const chat = initializeChat();
        const result = await chat.sendMessageStream({ message });

        for await (const chunk of result) {
            const c = chunk as GenerateContentResponse;
            if (c.text) {
                onChunk(c.text);
            }
        }
    } catch (error) {
        console.error("Error communicating with Gemini:", error);
        onChunk("Lo siento, tuve un problema de conexión con el asistente de GLOCEROVA. Por favor intenta de nuevo.");
    }
};