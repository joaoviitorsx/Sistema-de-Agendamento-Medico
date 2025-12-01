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
      dataIndex: 'inicio',
      render: (_: any, record: Consulta) => {
        if (!record || !record.inicio) return 'N/A';
        try {
          return format(new Date(record.inicio), 'dd/MM/yyyy HH:mm');
        } catch {
          return 'Data inválida';
        }
      },
    },
    {
      key: 'medico_id',
      label: 'Médico',
      dataIndex: 'medico_id',
      render: (_: any, record: Consulta) => {
        if (!record || !record.medico_id) return 'N/A';
        const medico = medicos.find((m) => m.id === record.medico_id);
        return medico ? `${medico.nome} - ${medico.especialidade}` : 'Médico não encontrado';
      },
    },
    {
      key: 'status',
      label: 'Status',
      dataIndex: 'status',
      render: (_: any, record: Consulta) => {
        if (!record || !record.status) return 'N/A';
        return (
          <span
            style={{
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '0.875rem',
              backgroundColor:
                record.status === 'agendada'
                  ? 'var(--color-success-light)'
                  : record.status === 'cancelada'
                  ? 'var(--color-danger-light)'
                  : 'var(--color-gray)',
              color: 'white',
            }}
          >
            {record.status}
          </span>
        );
      },
    },
    {
      key: 'observacoes',
      label: 'Observações',
      dataIndex: 'observacoes',
      render: (_: any, record: Consulta) => record?.observacoes || '-',
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
