import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useConsultaStore } from '@/store/useConsultaStore';
import { usePacienteStore } from '@/store/usePacienteStore';
import { useMedicoStore } from '@/store/useMedicoStore';
import './HomePaciente.css';

export const HomePaciente = () => {
  const navigate = useNavigate();
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const { consultas, fetchConsultas } = useConsultaStore();
  const { getPaciente } = usePacienteStore();
  const { medicos, fetchMedicos } = useMedicoStore();
  const [nomePaciente, setNomePaciente] = useState<string>('');

  useEffect(() => {
    fetchConsultas();
    fetchMedicos();
  }, [fetchConsultas, fetchMedicos]);

  useEffect(() => {
    const carregarPaciente = async () => {
      if (pacienteId) {
        const paciente = await getPaciente(pacienteId);
        if (paciente) {
          setNomePaciente(paciente.nome);
        } else {
          setNomePaciente('Paciente');
          // Se o paciente não existe, redireciona para seleção após 2 segundos
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      }
    };
    carregarPaciente();
  }, [pacienteId, getPaciente, navigate]);

  const proximasConsultas = consultas
    .filter((c) => c.paciente_id === pacienteId && new Date(c.inicio) > new Date() && c.status === 'agendada')
    .sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime())
    .slice(0, 3);

  return (
    <div className="home-paciente animate-fadeIn">
      <div className="home-header">
        <h1>Bem-vindo {nomePaciente}</h1>
        <p>Gerencie suas consultas médicas de forma simples e rápida</p>
      </div>

      <div className="home-content">
        <Card title="Agende sua Consulta">
          <p>
            Escolha a especialidade médica, selecione o profissional de sua preferência e
            escolha o melhor horário para você.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <Button
              icon={<Plus size={24} />}
              onClick={() => navigate(`/paciente/${pacienteId}/agendar`)}
              className="btn-chamativo px-10 py-4 text-xl font-semibold rounded-full bg-blue-500 text-white shadow-lg transition-transform duration-100 hover:scale-105 hover:shadow-2xl"
            >
              Marcar Nova Consulta
            </Button>
          </div>
        </Card>

        {proximasConsultas.length > 0 && (
          <Card title="Próximas Consultas">
            <div className="consultas-list">
              {proximasConsultas.map((consulta) => {
                const medico = medicos.find((m) => m.id === consulta.medico_id);
                return (
                  <div key={consulta.id} className="consulta-item">
                    <Calendar size={20} />
                    <div className="consulta-info">
                      <strong>{new Date(consulta.inicio).toLocaleString('pt-BR')}</strong>
                      <span>
                        {medico ? `Dr(a). ${medico.nome} - ${medico.especialidade}` : 'Médico não encontrado'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate(`/paciente/${pacienteId}/consultas`)}
            >
              Ver Todas as Consultas
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};
