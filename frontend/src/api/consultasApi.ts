import api from './axios';
import { Consulta, ConsultaCreate, ConsultaUpdate, TaskResponse } from '@/types';

export const consultasApi = {
  getAll: async (): Promise<Consulta[]> => {
    const response = await api.get('/consultas');
    return response.data;
  },

  getById: async (id: string): Promise<Consulta> => {
    const response = await api.get(`/consultas/${id}`);
    return response.data;
  },

  create: async (data: ConsultaCreate): Promise<Consulta> => {
    const response = await api.post('/consultas', data);
    return response.data;
  },

  update: async (id: string, data: ConsultaUpdate): Promise<Consulta> => {
    const response = await api.put(`/consultas/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/consultas/${id}`);
  },

  agendar: async (data: ConsultaCreate): Promise<TaskResponse> => {
    const response = await api.post('/consultas/agendar', data);
    return response.data;
  },
};
