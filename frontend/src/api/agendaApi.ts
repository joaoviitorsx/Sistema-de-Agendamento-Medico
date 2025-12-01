import api from './axios';
import { SlotsMap, AgendaReserva } from '@/types';

export const agendaApi = {
  getSlots: async (days: number = 7): Promise<SlotsMap> => {
    const response = await api.get(`/agenda/slots?days=${days}`);
    return response.data;
  },

  reservar: async (data: AgendaReserva): Promise<{ status: string; mensagem: string }> => {
    const response = await api.post('/agenda/reservar', data);
    return response.data;
  },

  liberar: async (data: AgendaReserva): Promise<{ status: string; mensagem: string }> => {
    const response = await api.post('/agenda/liberar', data);
    return response.data;
  },
};
