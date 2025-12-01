import { create } from 'zustand';
import { Consulta, ConsultaCreate, ConsultaUpdate } from '@/types';
import { consultasApi } from '@/api/consultasApi';
import toast from 'react-hot-toast';

interface ConsultaStore {
  consultas: Consulta[];
  loading: boolean;
  error: string | null;
  fetchConsultas: () => Promise<void>;
  getConsulta: (id: string) => Promise<Consulta | null>;
  createConsulta: (data: ConsultaCreate) => Promise<Consulta | null>;
  updateConsulta: (id: string, data: ConsultaUpdate) => Promise<Consulta | null>;
  deleteConsulta: (id: string) => Promise<boolean>;
  agendarConsulta: (data: ConsultaCreate) => Promise<{ task_id: string; slot: string } | null>;
}

export const useConsultaStore = create<ConsultaStore>((set) => ({
  consultas: [],
  loading: false,
  error: null,

  fetchConsultas: async () => {
    set({ loading: true, error: null });
    try {
      const consultas = await consultasApi.getAll();
      set({ consultas, loading: false });
    } catch (error) {
      const message = 'Erro ao carregar consultas';
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  getConsulta: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const consulta = await consultasApi.getById(id);
      set({ loading: false });
      return consulta;
    } catch (error) {
      const message = 'Erro ao carregar consulta';
      set({ error: message, loading: false });
      toast.error(message);
      return null;
    }
  },

  createConsulta: async (data: ConsultaCreate) => {
    set({ loading: true, error: null });
    try {
      const consulta = await consultasApi.create(data);
      set((state) => ({
        consultas: [...state.consultas, consulta],
        loading: false,
      }));
      toast.success('Consulta criada com sucesso!');
      return consulta;
    } catch (error) {
      const message = 'Erro ao criar consulta';
      set({ error: message, loading: false });
      toast.error(message);
      return null;
    }
  },

  updateConsulta: async (id: string, data: ConsultaUpdate) => {
    set({ loading: true, error: null });
    try {
      const consulta = await consultasApi.update(id, data);
      set((state) => ({
        consultas: state.consultas.map((c) => (c.id === id ? consulta : c)),
        loading: false,
      }));
      toast.success('Consulta atualizada com sucesso!');
      return consulta;
    } catch (error) {
      const message = 'Erro ao atualizar consulta';
      set({ error: message, loading: false });
      toast.error(message);
      return null;
    }
  },

  deleteConsulta: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await consultasApi.delete(id);
      set((state) => ({
        consultas: state.consultas.filter((c) => c.id !== id),
        loading: false,
      }));
      toast.success('Consulta excluída com sucesso!');
      return true;
    } catch (error) {
      const message = 'Erro ao excluir consulta';
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },

  agendarConsulta: async (data: ConsultaCreate) => {
    set({ loading: true, error: null });
    try {
      const response = await consultasApi.agendar(data);
      set({ loading: false });
      toast.success('Consulta agendada! Processando...');
      return { task_id: response.task_id, slot: response.slot };
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Erro ao agendar consulta';
      set({ error: message, loading: false });
      toast.error(message);
      return null;
    }
  },
}));
