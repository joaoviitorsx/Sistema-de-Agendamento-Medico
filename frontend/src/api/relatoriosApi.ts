import api from './axios';

export interface GerarRelatorioPayload {
  medico_id?: string;
  periodo_inicio?: string;
  periodo_fim?: string;
}

export interface RelatorioResponse {
  status: string;
  task_id: string;
}

export interface ListarRelatoriosResponse {
  arquivos: string[];
}

export const gerarRelatorio = async (payload: GerarRelatorioPayload): Promise<RelatorioResponse> => {
  const response = await api.post<RelatorioResponse>('/relatorios/gerar', payload);
  return response.data;
};

export const listarRelatorios = async (): Promise<ListarRelatoriosResponse> => {
  const response = await api.get<ListarRelatoriosResponse>('/relatorios/');
  return response.data;
};

export const downloadRelatorio = async (nome: string): Promise<void> => {
  const response = await api.get(`/relatorios/download/${nome}`, {
    responseType: 'blob',
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', nome);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
