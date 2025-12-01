import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SaveOutlined, DownloadOutlined, UploadOutlined, CheckCircleOutlined, ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { backupApi } from '@/api/backupApi';
import toast from 'react-hot-toast';
import './CrudPages.css';

export const Backup = () => {
  const [backups, setBackups] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBackups, setLoadingBackups] = useState(true);

  useEffect(() => {
    carregarBackups();
  }, []);

  const carregarBackups = async () => {
    try {
      setLoadingBackups(true);
      const response = await backupApi.listarBackups();
      setBackups(response.arquivos || []);
    } catch (error) {
      console.error('Erro ao carregar backups:', error);
      toast.error('Erro ao carregar lista de backups');
    } finally {
      setLoadingBackups(false);
    }
  };

  const executarBackup = async () => {
    try {
      setLoading(true);
      toast.loading('Criando backup...', { id: 'backup' });
      await backupApi.executarBackup();
      toast.success('Backup criado com sucesso!', { id: 'backup' });
      // Aguarda 2 segundos para o arquivo ser criado
      setTimeout(() => {
        carregarBackups();
      }, 2000);
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      toast.error('Erro ao criar backup', { id: 'backup' });
    } finally {
      setLoading(false);
    }
  };

  const baixarBackup = async (nomeArquivo: string) => {
    try {
      toast.loading('Baixando backup...', { id: 'download' });
      await backupApi.downloadBackup(nomeArquivo);
      toast.success('Backup baixado com sucesso!', { id: 'download' });
    } catch (error) {
      console.error('Erro ao baixar backup:', error);
      toast.error('Erro ao baixar backup', { id: 'download' });
    }
  };

  const lastBackup = backups.length > 0 ? backups[0] : null;

  return (
    <div className="crud-page animate-fadeIn">
      <div className="page-header">
        <div>
          <h1>Backup & Restauração</h1>
          <p className="text-neutral-medium mt-1">Gerencie backups do sistema médico</p>
        </div>
      </div>

      {/* Status do Último Backup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircleOutlined className="text-2xl text-success" />
              <h3 className="text-lg font-semibold text-neutral-black">Último Backup</h3>
            </div>
            <p className="text-2xl font-bold text-primary">
              {lastBackup ? lastBackup.replace('backup_', '').replace('.zip', '').replace(/_/g, ' ') : 'Nenhum backup'}
            </p>
            <p className="text-sm text-neutral-medium mt-1">
              {lastBackup ? 'Último backup disponível' : 'Nenhum backup criado'}
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <ClockCircleOutlined className="text-2xl text-warning" />
              <h3 className="text-lg font-semibold text-neutral-black">Próximo Backup</h3>
            </div>
            <p className="text-2xl font-bold text-warning">Hoje às 23:59</p>
            <p className="text-sm text-neutral-medium mt-1">Backup automático agendado</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <SaveOutlined className="text-2xl text-info" />
              <h3 className="text-lg font-semibold text-neutral-black">Total de Backups</h3>
            </div>
            <p className="text-2xl font-bold" style={{ color: '#0288D1' }}>{backups.length} arquivos</p>
            <p className="text-sm text-neutral-medium mt-1">Armazenados no servidor</p>
          </div>
        </Card>
      </div>

      {/* Criar Novo Backup */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
              <SaveOutlined className="text-2xl text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-neutral-black">Criar Novo Backup</h2>
              <p className="text-neutral-medium">Gere um backup manual de todos os dados do sistema</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <SaveOutlined className="text-primary text-xl mt-0.5" />
              <div>
                <h4 className="font-semibold text-neutral-black mb-1">O backup incluirá:</h4>
                <ul className="text-sm text-neutral-dark space-y-1">
                  <li>• Todos os dados de pacientes cadastrados</li>
                  <li>• Informações de médicos e especialidades</li>
                  <li>• Histórico completo de consultas</li>
                  <li>• Horários e agenda médica</li>
                  <li>• Logs do sistema</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="primary" className="flex-1" onClick={executarBackup} disabled={loading}>
              <SaveOutlined className="mr-2" />
              {loading ? 'Criando Backup...' : 'Criar Backup Completo'}
            </Button>
            <Button 
              variant="secondary" 
              className="flex-1" 
              onClick={() => lastBackup && baixarBackup(lastBackup)}
              disabled={!lastBackup}
            >
              <DownloadOutlined className="mr-2" />
              Baixar Último Backup
            </Button>
          </div>
        </div>
      </Card>

      {/* Restaurar Backup */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-warning to-orange-500 flex items-center justify-center shadow-lg">
              <UploadOutlined className="text-2xl text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-neutral-black">Restaurar Backup</h2>
              <p className="text-neutral-medium">Restaure dados de um backup anterior</p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-semibold text-neutral-black mb-1">Atenção!</h4>
                <p className="text-sm text-neutral-dark">
                  Restaurar um backup substituirá todos os dados atuais do sistema. 
                  Esta ação não pode ser desfeita. Certifique-se de criar um backup 
                  dos dados atuais antes de prosseguir.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Selecionar Arquivo de Backup
              </label>
              <input
                type="file"
                accept=".json,.zip"
                className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-warning cursor-pointer"
              />
            </div>

            <Button variant="warning" className="w-full">
              <UploadOutlined className="mr-2" />
              Restaurar Dados do Backup
            </Button>
          </div>
        </div>
      </Card>

      {/* Lista de Backups Recentes */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-neutral-black mb-4">Backups Recentes</h2>
          
          {loadingBackups ? (
            <div className="text-center py-8">
              <p className="text-neutral-medium">Carregando backups...</p>
            </div>
          ) : backups.length === 0 ? (
            <div className="text-center py-8">
              <SaveOutlined className="text-5xl text-neutral-light mb-3" />
              <p className="text-neutral-medium">Nenhum backup disponível.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {backups.map((backup) => (
                <div
                  key={backup}
                  className="flex items-center justify-between p-4 border border-neutral-light rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <SaveOutlined className="text-xl text-primary" />
                    <div>
                      <h4 className="font-semibold text-neutral-black">{backup}</h4>
                      <p className="text-sm text-neutral-medium">
                        {backup.replace('backup_', '').replace('.zip', '').replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" title="Baixar" onClick={() => baixarBackup(backup)}>
                      <DownloadOutlined />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
