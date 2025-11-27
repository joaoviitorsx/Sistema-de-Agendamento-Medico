import { api } from "./axios";
import type { Paciente } from "../types/Paciente"

export const PacientesAPI = {
  listar: async (): Promise<Paciente[]> => {
    const { data } = await api.get("/pacientes");
    return data;
  },

  criar: async (payload: Omit<Paciente, "id">): Promise<Paciente> => {
    const { data } = await api.post("/pacientes", payload);
    return data;
  },

  atualizar: async (id: string, payload: Partial<Paciente>): Promise<Paciente> => {
    const { data } = await api.put(`/pacientes/${id}`, payload);
    return data;
  },

  deletar: async (id: string): Promise<void> => {
    await api.delete(`/pacientes/${id}`);
  }
};
