import api from './axios';
import { Horario, HorarioCreate, HorarioUpdate } from '@/types';

export const horariosApi = {
  getAll: async (): Promise<Horario[]> => {
    const response = await api.get('/horarios');
    return response.data;
  },

  getByMedico: async (medicoId: string): Promise<Horario[]> => {
    const response = await api.get(`/horarios/medico/${medicoId}`);
    return response.data;
  },

  getById: async (id: string): Promise<Horario> => {
    const response = await api.get(`/horarios/${id}`);
    return response.data;
  },

  create: async (medicoId: string, data: HorarioCreate): Promise<Horario> => {
    const response = await api.post(`/horarios/${medicoId}`, data);
    return response.data;
  },

  update: async (id: string, data: HorarioUpdate): Promise<Horario> => {
    const response = await api.put(`/horarios/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/horarios/${id}`);
  },
};
