import { api } from "./axios";

export const AgendaAPI = {
  listarSlots: async () => {
    const { data } = await api.get("/agenda/slots");
    return data;
  },

  reservarSlot: async (payload: { medico_id: string; slot: string }) => {
    const { data } = await api.post("/agenda/reservar", payload);
    return data;
  }
};
