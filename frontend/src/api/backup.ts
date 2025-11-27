import { api } from "./axios";

export const BackupAPI = {
  executar: async () => {
    const { data } = await api.post("/backup/execuar");
    return data;
  },

  listar: async () => {
    const { data } = await api.get("/backup");
    return data.arquivos;
  },

  downloadUrl: (nome: string) =>
    `${import.meta.env.VITE_API_URL}/backup/download/${nome}`,
};
