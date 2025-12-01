import api from './axios';

export const backupApi = {
    async executarBackup() {
        const response = await api.post('/backup/executar');
        return response.data;
    },

    async listarBackups() {
        const response = await api.get('/backup/');
        return response.data;
    },

    getDownloadUrl(nomeArquivo: string) {
        return `${api.defaults.baseURL}/backup/download/${nomeArquivo}`;
    },
};
