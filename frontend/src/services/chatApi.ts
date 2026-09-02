// FloraFarm — Chat API service
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ChatHistoryEntry {
  role: 'user' | 'model';
  content: string;
}

export interface ChatContext {
  disease_result?: Record<string, unknown> | null;
  soil_data?: Record<string, unknown> | null;
  fertilizer_result?: Record<string, unknown> | null;
}

export interface ChatResponse {
  reply: string;
  error: boolean;
}

export async function sendChatMessage(
  message: string,
  history: ChatHistoryEntry[],
  context?: ChatContext | null,
  language: string = 'en'
): Promise<ChatResponse> {
  const response = await axios.post<ChatResponse>(
    `${API_BASE}/api/chat/`,
    { message, history, context: context ?? null, language },
    { headers: { 'Content-Type': 'application/json' }, timeout: 180000 }
  );
  return response.data;
}
