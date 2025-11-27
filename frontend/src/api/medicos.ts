import { api } from "./axios";
import type { Medico } from "../types/Medico";

export const MedicosAPI = {
  listar: async (): Promise<Medico[]> => {
    const { data } = await api.get("/medicos");
    return data;
  },

  criar: async (payload: Omit<Medico, "id">): Promise<Medico> => {
    const { data } = await api.post("/medicos", payload);
    return data;
  },

  atualizar: async (id: string, payload: Partial<Medico>): Promise<Medico> => {
    const { data } = await api.put(`/medicos/${id}`, payload);
    return data;
  },

  deletar: async (id: string): Promise<void> => {
    await api.delete(`/medicos/${id}`);
  }
};
