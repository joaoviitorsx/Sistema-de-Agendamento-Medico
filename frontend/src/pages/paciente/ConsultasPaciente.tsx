import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { useConsultaStore } from '@/store/useConsultaStore';
import { useMedicoStore } from '@/store/useMedicoStore';
import { Consulta } from '@/types';

export const ConsultasPaciente = () => {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const { consultas, fetchConsultas, loading } = useConsultaStore();
  const { medicos, fetchMedicos } = useMedicoStore();

  useEffect(() => {
    fetchConsultas();
    fetchMedicos();
  }, []);

  // Filtrar consultas do paciente atual
  const minhasConsultas = consultas
    .filter((c) => c.paciente_id === pacienteId)
    .sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());

  const columns = [
    {
      key: 'inicio',
      label: 'Data/Hora',
      render: (consulta: Consulta) =>
        format(new Date(consulta.inicio), 'dd/MM/yyyy HH:mm'),
    },
    {
      key: 'medico_id',
      label: 'Médico',
      render: (consulta: Consulta) => {
        const medico = medicos.find((m) => m.id === consulta.medico_id);
        return medico ? `${medico.nome} - ${medico.especialidade}` : consulta.medico_id;
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (consulta: Consulta) => (
        <span
          style={{
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.875rem',
            backgroundColor:
              consulta.status === 'agendada'
                ? 'var(--color-success-light)'
                : consulta.status === 'cancelada'
                ? 'var(--color-danger-light)'
                : 'var(--color-gray)',
            color: 'white',
          }}
        >
          {consulta.status}
        </span>
      ),
    },
    {
      key: 'observacoes',
      label: 'Observações',
    },
  ];

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="animate-fadeIn">
      <h1>Minhas Consultas</h1>
      <Card>
        <Table data={minhasConsultas} columns={columns} />
      </Card>
    </div>
  );
};
