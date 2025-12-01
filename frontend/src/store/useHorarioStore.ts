import { create } from 'zustand';
import { Horario } from '@/types';
import { horariosApi } from '@/api/horariosApi';
import toast from 'react-hot-toast';

interface HorarioStore {
  horarios: Horario[];
  loading: boolean;
  error: string | null;
  fetchHorarios: () => Promise<void>;
  fetchHorariosByMedico: (medicoId: string) => Promise<void>;
  createHorario: (medicoId: string, data: any) => Promise<boolean>;
  updateHorario: (id: string, data: any) => Promise<boolean>;
  deleteHorario: (id: string) => Promise<boolean>;
}

export const useHorarioStore = create<HorarioStore>((set) => ({
  horarios: [],
  loading: false,
  error: null,

  fetchHorarios: async () => {
    set({ loading: true, error: null });
    try {
      const horarios = await horariosApi.getAll();
      set({ horarios, loading: false });
    } catch (error) {
      const message = 'Erro ao carregar horários';
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  fetchHorariosByMedico: async (medicoId: string) => {
    set({ loading: true, error: null });
    try {
      const horarios = await horariosApi.getByMedico(medicoId);
      set({ horarios, loading: false });
    } catch (error) {
      const message = 'Erro ao carregar horários do médico';
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  createHorario: async (medicoId: string, data: any) => {
    set({ loading: true, error: null });
    try {
      await horariosApi.create(medicoId, data);
      toast.success('Horário cadastrado com sucesso!');
      set({ loading: false });
      return true;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Erro ao cadastrar horário';
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },

  updateHorario: async (id: string, data: any) => {
    set({ loading: true, error: null });
    try {
      await horariosApi.update(id, data);
      toast.success('Horário atualizado com sucesso!');
      set({ loading: false });
      return true;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Erro ao atualizar horário';
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },

  deleteHorario: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await horariosApi.delete(id);
      set((state) => ({
        horarios: state.horarios.filter((h) => h.id !== id),
        loading: false,
      }));
      toast.success('Horário excluído com sucesso!');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Erro ao excluir horário';
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },
}));
