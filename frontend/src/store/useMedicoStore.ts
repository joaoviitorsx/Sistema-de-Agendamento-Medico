import { create } from 'zustand';
import { Medico, MedicoCreate, MedicoUpdate } from '@/types';
import { medicosApi } from '@/api/medicosApi';
import toast from 'react-hot-toast';

interface MedicoStore {
  medicos: Medico[];
  loading: boolean;
  error: string | null;
  fetchMedicos: () => Promise<void>;
  getMedico: (id: string) => Promise<Medico | null>;
  createMedico: (data: MedicoCreate) => Promise<Medico | null>;
  updateMedico: (id: string, data: MedicoUpdate) => Promise<Medico | null>;
  deleteMedico: (id: string) => Promise<boolean>;
}

export const useMedicoStore = create<MedicoStore>((set) => ({
  medicos: [],
  loading: false,
  error: null,

  fetchMedicos: async () => {
    set({ loading: true, error: null });
    try {
      const medicos = await medicosApi.getAll();
      set({ medicos, loading: false });
    } catch (error) {
      const message = 'Erro ao carregar médicos';
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  getMedico: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const medico = await medicosApi.getById(id);
      set({ loading: false });
      return medico;
    } catch (error) {
      const message = 'Erro ao carregar médico';
      set({ error: message, loading: false });
      toast.error(message);
      return null;
    }
  },

  createMedico: async (data: MedicoCreate) => {
    set({ loading: true, error: null });
    try {
      const medico = await medicosApi.create(data);
      set((state) => ({
        medicos: [...state.medicos, medico],
        loading: false,
      }));
      toast.success('Médico cadastrado com sucesso!');
      return medico;
    } catch (error) {
      const message = 'Erro ao cadastrar médico';
      set({ error: message, loading: false });
      toast.error(message);
      return null;
    }
  },

  updateMedico: async (id: string, data: MedicoUpdate) => {
    set({ loading: true, error: null });
    try {
      const medico = await medicosApi.update(id, data);
      set((state) => ({
        medicos: state.medicos.map((m) => (m.id === id ? medico : m)),
        loading: false,
      }));
      toast.success('Médico atualizado com sucesso!');
      return medico;
    } catch (error) {
      const message = 'Erro ao atualizar médico';
      set({ error: message, loading: false });
      toast.error(message);
      return null;
    }
  },

  deleteMedico: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await medicosApi.delete(id);
      set((state) => ({
        medicos: state.medicos.filter((m) => m.id !== id),
        loading: false,
      }));
      toast.success('Médico excluído com sucesso!');
      return true;
    } catch (error) {
      const message = 'Erro ao excluir médico';
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },
}));
