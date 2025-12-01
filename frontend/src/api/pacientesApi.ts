import api from './axios';
import { Paciente, PacienteCreate, PacienteUpdate } from '@/types';

export const pacientesApi = {
  getAll: async (): Promise<Paciente[]> => {
    const response = await api.get('/pacientes');
    return response.data;
  },

  getById: async (id: string): Promise<Paciente> => {
    const response = await api.get(`/pacientes/${id}`);
    return response.data;
  },

  create: async (data: PacienteCreate): Promise<Paciente> => {
    const response = await api.post('/pacientes', data);
    return response.data;
  },

  update: async (id: string, data: PacienteUpdate): Promise<Paciente> => {
    const response = await api.put(`/pacientes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/pacientes/${id}`);
  },
};
