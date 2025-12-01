import { create } from 'zustand';
import { Paciente, PacienteCreate, PacienteUpdate } from '@/types';
import { pacientesApi } from '@/api/pacientesApi';
import toast from 'react-hot-toast';

interface PacienteStore {
  pacientes: Paciente[];
  loading: boolean;
  error: string | null;
  fetchPacientes: () => Promise<void>;
  getPaciente: (id: string) => Promise<Paciente | null>;
  createPaciente: (data: PacienteCreate) => Promise<Paciente | null>;
  updatePaciente: (id: string, data: PacienteUpdate) => Promise<Paciente | null>;
  deletePaciente: (id: string) => Promise<boolean>;
}

export const usePacienteStore = create<PacienteStore>((set) => ({
  pacientes: [],
  loading: false,
  error: null,

  fetchPacientes: async () => {
    set({ loading: true, error: null });
    try {
      const pacientes = await pacientesApi.getAll();
      set({ pacientes, loading: false });
    } catch (error) {
      const message = 'Erro ao carregar pacientes';
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  getPaciente: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const paciente = await pacientesApi.getById(id);
      set({ loading: false });
      return paciente;
    } catch (error) {
      const message = 'Erro ao carregar paciente';
      set({ error: message, loading: false });
      toast.error(message);
      return null;
    }
  },

  createPaciente: async (data: PacienteCreate) => {
    set({ loading: true, error: null });
    try {
      const paciente = await pacientesApi.create(data);
      set((state) => ({
        pacientes: [...state.pacientes, paciente],
        loading: false,
      }));
      toast.success('Paciente cadastrado com sucesso!');
      return paciente;
    } catch (error) {
      const message = 'Erro ao cadastrar paciente';
      set({ error: message, loading: false });
      toast.error(message);
      return null;
    }
  },

  updatePaciente: async (id: string, data: PacienteUpdate) => {
    set({ loading: true, error: null });
    try {
      const paciente = await pacientesApi.update(id, data);
      set((state) => ({
        pacientes: state.pacientes.map((p) => (p.id === id ? paciente : p)),
        loading: false,
      }));
      toast.success('Paciente atualizado com sucesso!');
      return paciente;
    } catch (error) {
      const message = 'Erro ao atualizar paciente';
      set({ error: message, loading: false });
      toast.error(message);
      return null;
    }
  },

  deletePaciente: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await pacientesApi.delete(id);
      set((state) => ({
        pacientes: state.pacientes.filter((p) => p.id !== id),
        loading: false,
      }));
      toast.success('Paciente excluído com sucesso!');
      return true;
    } catch (error) {
      const message = 'Erro ao excluir paciente';
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },
}));
