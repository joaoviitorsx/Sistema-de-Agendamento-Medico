import { api } from "./axios";

export const RelatoriosAPI = {
  gerar: async (filtros: Record<string, unknown>) => {
    const { data } = await api.post("/tasks/relatorio", filtros);
    return data;
  },

  listar: async () => {
    const { data } = await api.get("/relatorios");
    return data.arquivos as string[];
  },

  downloadUrl: (nome: string) =>
    `http://localhost:8000/relatorios/download/${nome}`,
};
