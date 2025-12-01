import api from './axios';
import { Medico, MedicoCreate, MedicoUpdate } from '@/types';

export const medicosApi = {
  getAll: async (): Promise<Medico[]> => {
    const response = await api.get('/medicos');
    return response.data;
  },

  getById: async (id: string): Promise<Medico> => {
    const response = await api.get(`/medicos/${id}`);
    return response.data;
  },

  create: async (data: MedicoCreate): Promise<Medico> => {
    const response = await api.post('/medicos', data);
    return response.data;
  },

  update: async (id: string, data: MedicoUpdate): Promise<Medico> => {
    const response = await api.put(`/medicos/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/medicos/${id}`);
  },
};
