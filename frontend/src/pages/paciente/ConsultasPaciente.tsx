import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { useConsultaStore } from '@/store/useConsultaStore';
import { useMedicoStore } from '@/store/useMedicoStore';
import { Consulta } from '@/types';

export const ConsultasPaciente = () => {
  const { pacienteId } = useParams<{ pacienteId: string }>();
  const navigate = useNavigate();
  const { consultas, fetchConsultas, loading } = useConsultaStore();
  const { medicos, fetchMedicos } = useMedicoStore();

  useEffect(() => {
    if (!pacienteId) {
      toast.error('ID do paciente não encontrado');
      navigate('/');
      return;
    }
    fetchConsultas();
    fetchMedicos();
  }, [pacienteId, navigate, fetchConsultas, fetchMedicos]);

  // Filtrar consultas do paciente atual
  const minhasConsultas = consultas
    .filter((c) => c.paciente_id === pacienteId)
    .sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());

  const columns = [
    {
      key: 'inicio',
      label: 'Data/Hora',
      dataIndex: 'inicio',
      render: (_: unknown, record: Consulta) => {
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
      render: (_: unknown, record: Consulta) => {
        if (!record || !record.medico_id) return 'N/A';
        const medico = medicos.find((m) => m.id === record.medico_id);
        return medico ? `${medico.nome} - ${medico.especialidade}` : 'Médico não encontrado';
      },
    },
    {
      key: 'status',
      label: 'Status',
      dataIndex: 'status',
      render: (_: unknown, record: Consulta) => {
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
      render: (_: unknown, record: Consulta) => record?.observacoes || '-',
    },
  ];

  if (loading) {
    return (
      <div className="animate-fadeIn flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando consultas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <h1>Minhas Consultas</h1>
      <Card>
        {minhasConsultas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">Você ainda não possui consultas agendadas.</p>
            <p className="text-gray-400 text-sm">Clique em "Agendar" no menu para marcar uma nova consulta.</p>
          </div>
        ) : (
          <Table data={minhasConsultas} columns={columns} />
        )}
      </Card>
    </div>
  );
};
