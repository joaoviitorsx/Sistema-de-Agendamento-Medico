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

    async downloadBackup(nomeArquivo: string) {
        const response = await api.get(`/backup/download/${nomeArquivo}`, {
            responseType: 'blob',
        });
        
        // Cria um link temporário para download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', nomeArquivo);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },

    getDownloadUrl(nomeArquivo: string) {
        return `${api.defaults.baseURL}/backup/download/${nomeArquivo}`;
    },
};
