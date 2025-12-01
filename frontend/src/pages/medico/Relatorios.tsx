import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileSearchOutlined, DownloadOutlined, CalendarOutlined, ReloadOutlined } from '@ant-design/icons';
import { gerarRelatorio, listarRelatorios, downloadRelatorio } from '@/api/relatoriosApi';
import { useMedicoStore } from '@/store/useMedicoStore';
import toast from 'react-hot-toast';
import './CrudPages.css';

export const Relatorios = () => {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [relatoriosGerados, setRelatoriosGerados] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { medicos, fetchMedicos } = useMedicoStore();

  useEffect(() => {
    fetchMedicos();
    carregarRelatorios();
  }, []);

  const carregarRelatorios = async () => {
    try {
      const response = await listarRelatorios();
      setRelatoriosGerados(response.arquivos);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    }
  };

  const handleGerarRelatorio = async () => {
    if (!dataInicio || !dataFim) {
      toast.error('Por favor, selecione o período inicial e final');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        medico_id: medicoId || undefined,
        periodo_inicio: `${dataInicio}T00:00:00`,
        periodo_fim: `${dataFim}T23:59:59`,
      };

      const response = await gerarRelatorio(payload);
      toast.success('Relatório está sendo gerado! Aguarde alguns segundos e atualize a lista.');
      
      // Aguarda 3 segundos e recarrega a lista
      setTimeout(() => {
        carregarRelatorios();
      }, 3000);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (nomeArquivo: string) => {
    try {
      await downloadRelatorio(nomeArquivo);
      toast.success('Download iniciado!');
    } catch (error) {
      console.error('Erro ao baixar relatório:', error);
      toast.error('Erro ao baixar relatório');
    }
  };

  return (
    <div className="crud-page animate-fadeIn">
      <div className="page-header">
        <div>
          <h1>📊 Relatórios de Consultas</h1>
          <p className="text-neutral-medium mt-1">Gere relatórios detalhados em PDF das consultas médicas</p>
        </div>
      </div>

      {/* Card de Geração de Relatório */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
              <CalendarOutlined className="text-2xl text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-neutral-black">Gerar Relatório de Consultas</h2>
              <p className="text-neutral-medium">Configure os filtros de período e médico</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Médico (Opcional)
              </label>
              <select 
                className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={medicoId}
                onChange={(e) => setMedicoId(e.target.value)}
              >
                <option value="">Todos os médicos</option>
                {medicos.map((medico) => (
                  <option key={medico.id} value={medico.id}>
                    {medico.nome} - {medico.especialidade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Data Inicial *
              </label>
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Data Final *
              </label>
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              variant="primary" 
              className="flex-1"
              onClick={handleGerarRelatorio}
              disabled={loading}
            >
              <FileSearchOutlined className="mr-2" />
              {loading ? 'Gerando...' : 'Gerar Relatório PDF'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Card de Relatórios Gerados */}
      <Card className="mt-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-success to-green-700 flex items-center justify-center shadow-lg">
                <DownloadOutlined className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-neutral-black">Relatórios Gerados</h2>
                <p className="text-neutral-medium">Baixe os relatórios já criados</p>
              </div>
            </div>
            <Button variant="primary" onClick={carregarRelatorios}>
              <ReloadOutlined className="mr-2" />
              Atualizar
            </Button>
          </div>

          {relatoriosGerados.length === 0 ? (
            <div className="text-center py-8 text-neutral-medium">
              <FileSearchOutlined className="text-4xl mb-2" />
              <p>Nenhum relatório gerado ainda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatoriosGerados.map((arquivo) => (
                <div
                  key={arquivo}
                  className="p-4 border border-neutral-light rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <FileSearchOutlined className="text-2xl text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-black truncate">
                        {arquivo}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => handleDownload(arquivo)}
                  >
                    <DownloadOutlined className="mr-2" />
                    Baixar PDF
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
