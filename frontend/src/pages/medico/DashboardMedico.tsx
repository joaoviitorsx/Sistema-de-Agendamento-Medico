import { useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { useConsultaStore } from '@/store/useConsultaStore';
import { usePacienteStore } from '@/store/usePacienteStore';
import { useMedicoStore } from '@/store/useMedicoStore';
import { CalendarOutlined, UserOutlined, MedicineBoxOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Table } from '@/components/ui/Table';
import './CrudPages.css';

export const DashboardMedico = () => {
  const { consultas, fetchConsultas } = useConsultaStore();
  const { pacientes, fetchPacientes } = usePacienteStore();
  const { medicos, fetchMedicos } = useMedicoStore();

  useEffect(() => {
    fetchConsultas();
    fetchPacientes();
    fetchMedicos();
  }, []);

  const consultasHoje = consultas.filter((c) => {
    const hoje = new Date().toDateString();
    return new Date(c.inicio).toDateString() === hoje;
  });

  const consultasPendentes = consultas.filter(c => c.status === 'pendente');
  const consultasConfirmadas = consultas.filter(c => c.status === 'confirmada');

  const columns = [
    {
      key: 'horario',
      label: 'Horário',
      render: (consulta: any) => {
        if (!consulta?.inicio) return 'N/A';
        return new Date(consulta.inicio).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      },
    },
    {
      key: 'paciente',
      label: 'Paciente',
      render: (consulta: any) => {
        if (!consulta || !consulta.paciente_id) return 'N/A';
        const paciente = pacientes.find((p) => p.id === consulta.paciente_id);
        return paciente?.nome || 'N/A';
      },
    },
    {
      key: 'medico',
      label: 'Médico',
      render: (consulta: any) => {
        if (!consulta || !consulta.medico_id) return 'N/A';
        const medico = medicos.find((m) => m.id === consulta.medico_id);
        return medico?.nome || 'N/A';
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (consulta: any) => {
        if (!consulta?.status) return 'N/A';
        const badges: Record<string, { class: string; label: string }> = {
          pendente: { class: 'warning', label: 'Pendente' },
          confirmada: { class: 'success', label: 'Confirmada' },
          cancelada: { class: 'danger', label: 'Cancelada' },
          concluida: { class: 'info', label: 'Concluída' },
        };
        const badge = badges[consulta.status] || { class: 'info', label: consulta.status };
        return <span className={`badge ${badge.class}`}>{badge.label}</span>;
      },
    },
  ];

  return (
    <div className="crud-page animate-fadeIn">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="text-neutral-medium mt-1">Visão geral do sistema médico</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserOutlined className="text-2xl text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-medium mb-1">Pacientes Cadastrados</p>
                <h3 className="text-3xl font-bold text-neutral-black">{pacientes.length}</h3>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <MedicineBoxOutlined className="text-2xl text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-medium mb-1">Médicos Cadastrados</p>
                <h3 className="text-3xl font-bold text-neutral-black">{medicos.length}</h3>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center">
                <CalendarOutlined className="text-2xl" style={{ color: '#0288D1' }} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-medium mb-1">Consultas Hoje</p>
                <h3 className="text-3xl font-bold text-neutral-black">{consultasHoje.length}</h3>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <ClockCircleOutlined className="text-2xl text-warning" />
              <h3 className="text-lg font-semibold text-neutral-black">Consultas Pendentes</h3>
            </div>
            <p className="text-4xl font-bold text-warning">{consultasPendentes.length}</p>
            <p className="text-sm text-neutral-medium mt-2">Aguardando confirmação</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircleOutlined className="text-2xl text-success" />
              <h3 className="text-lg font-semibold text-neutral-black">Consultas Confirmadas</h3>
            </div>
            <p className="text-4xl font-bold text-success">{consultasConfirmadas.length}</p>
            <p className="text-sm text-neutral-medium mt-2">Agendadas e confirmadas</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CalendarOutlined className="text-2xl text-primary" />
            <h2 className="text-xl font-bold text-neutral-black">Consultas de Hoje</h2>
          </div>
          
          {consultasHoje.length === 0 ? (
            <div className="text-center py-8">
              <CalendarOutlined className="text-5xl text-neutral-light mb-3" />
              <p className="text-neutral-medium">Nenhuma consulta agendada para hoje.</p>
            </div>
          ) : (
            <Table columns={columns} data={consultasHoje} loading={false} />
          )}
        </div>
      </Card>
    </div>
  );
};
