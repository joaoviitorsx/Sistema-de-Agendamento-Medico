import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { useConsultaStore } from '@/store/useConsultaStore';
import { useMedicoStore } from '@/store/useMedicoStore';
import { usePacienteStore } from '@/store/usePacienteStore';
import { Consulta } from '@/types';
import './CrudPages.css';

export const Consultas = () => {
  const { consultas, fetchConsultas, loading } = useConsultaStore();
  const { medicos, fetchMedicos } = useMedicoStore();
  const { pacientes, fetchPacientes } = usePacienteStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConsultas();
    fetchMedicos();
    fetchPacientes();
  }, []);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { class: string; label: string }> = {
      pendente: { class: 'warning', label: 'Pendente' },
      confirmada: { class: 'success', label: 'Confirmada' },
      cancelada: { class: 'danger', label: 'Cancelada' },
      concluida: { class: 'info', label: 'Concluída' },
    };
    const badge = badges[status] || { class: 'info', label: status };
    return <span className={`badge ${badge.class}`}>{badge.label}</span>;
  };

  const filteredConsultas = consultas.filter((c) => {
    if (!c) return false;
    
    const medico = medicos.find((m) => m.id === c.medico_id);
    const paciente = pacientes.find((p) => p.id === c.paciente_id);
    const searchLower = searchTerm.toLowerCase();
    
    return (
      medico?.nome?.toLowerCase().includes(searchLower) ||
      paciente?.nome?.toLowerCase().includes(searchLower) ||
      c.status?.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      key: 'paciente',
      label: 'Paciente',
      render: (consulta: Consulta) => {
        if (!consulta || !consulta.paciente_id) return 'N/A';
        const paciente = pacientes.find((p) => p.id === consulta.paciente_id);
        return paciente?.nome || 'N/A';
      },
    },
    {
      key: 'medico',
      label: 'Médico',
      render: (consulta: Consulta) => {
        if (!consulta || !consulta.medico_id) return 'N/A';
        const medico = medicos.find((m) => m.id === consulta.medico_id);
        return medico?.nome || 'N/A';
      },
    },
    {
      key: 'especialidade',
      label: 'Especialidade',
      render: (consulta: Consulta) => {
        if (!consulta || !consulta.medico_id) return 'N/A';
        const medico = medicos.find((m) => m.id === consulta.medico_id);
        return medico?.especialidade || 'N/A';
      },
    },
    {
      key: 'inicio',
      label: 'Data/Hora',
      render: (consulta: Consulta) => {
        if (!consulta || !consulta.inicio) return 'N/A';
        return new Date(consulta.inicio).toLocaleString('pt-BR');
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (consulta: Consulta) => {
        if (!consulta || !consulta.status) return 'N/A';
        return getStatusBadge(consulta.status);
      },
    },
  ];

  return (
    <div className="crud-page animate-fadeIn">
      <div className="page-header">
        <h1>Consultas Agendadas</h1>
      </div>

      <Card>
        <div className="search-bar">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <Input
              placeholder="Buscar por paciente, médico ou status..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Carregando...</div>
        ) : (
          <Table
            data={filteredConsultas}
            columns={columns}
          />
        )}
      </Card>
    </div>
  );
};
