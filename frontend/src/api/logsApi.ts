import api from './axios';
import { LogEntry } from '@/types';

export const logsApi = {
  getLogs: async (): Promise<{ logs: string[] }> => {
    const response = await api.get('/sistema/logs');
    return response.data;
  },

  getLogsStream: () => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return new EventSource(`${baseURL}/sistema/logs/stream`);
  },

  getAgendaStream: () => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return new EventSource(`${baseURL}/sistema/agenda/stream`);
  },
};

export const parseLogLine = (line: string): LogEntry | null => {
  // Formato esperado: [TIMESTAMP] [LEVEL] message
  const match = line.match(/\[(.*?)\]\s*\[(.*?)\]\s*(.*)/);
  if (match) {
    return {
      timestamp: match[1],
      level: match[2],
      message: match[3],
    };
  }
  return null;
};
