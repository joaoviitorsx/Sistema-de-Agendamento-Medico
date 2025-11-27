import { api } from "./axios";
import type { Consulta } from "../types/Consulta";

export const ConsultasAPI = {
  listar: async (): Promise<Consulta[]> => {
    const { data } = await api.get("/consultas");
    return data;
  },

  criar: async (payload: Omit<Consulta, "id">): Promise<Consulta> => {
    const { data } = await api.post("/consultas", payload);
    return data;
  },

  atualizar: async (id: string, payload: Partial<Consulta>): Promise<Consulta> => {
    const { data } = await api.put(`/consultas/${id}`, payload);
    return data;
  },

  deletar: async (id: string): Promise<void> => {
    await api.delete(`/consultas/${id}`);
  },

  // 🧡 Agendamento real (USA FILA)
  agendar: async (payload: import("../types/Consulta").Consulta) => {
    const { data } = await api.post("/consultas/agendar", payload);
    return data; // status pendente e slot
  }
};
