import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { useHorarioStore } from '../../store/useHorarioStore';
import { useMedicoStore } from '../../store/useMedicoStore';
import { Horario } from '../../types';
import './CrudPages.css';

export { NovoHorario, EditarHorario } from './HorarioForm';

export const Horarios = () => {
  const navigate = useNavigate();
  const { horarios, fetchHorarios, deleteHorario, loading } = useHorarioStore();
  const { medicos, fetchMedicos } = useMedicoStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<Horario | null>(null);

  const diasSemanaMap: Record<string, string> = {
    segunda: 'Segunda-feira',
    terca: 'Terça-feira',
    quarta: 'Quarta-feira',
    quinta: 'Quinta-feira',
    sexta: 'Sexta-feira',
    sabado: 'Sábado',
    domingo: 'Domingo',
  };

  useEffect(() => {
    fetchHorarios();
    fetchMedicos();
  }, []);

  const filteredHorarios = horarios.filter((h: Horario) => {
    if (!h) return false;
    const medico = medicos.find((m) => m.id === h.medico_id);
    const searchLower = searchTerm.toLowerCase();
    return medico?.nome?.toLowerCase().includes(searchLower);
  });

  const handleDelete = async () => {
    if (deleteModal) {
      await deleteHorario(deleteModal.id);
      setDeleteModal(null);
    }
  };

  const columns = [
    {
      key: 'medico',
      label: 'Médico',
      dataIndex: 'medico_id',
      render: (_: any, record: Horario) => {
        if (!record || !record.medico_id) return 'N/A';
        const medico = medicos.find((m) => m.id === record.medico_id);
        return medico?.nome || 'N/A';
      },
    },
    {
      key: 'especialidade',
      label: 'Especialidade',
      dataIndex: 'medico_id',
      render: (_: any, record: Horario) => {
        if (!record || !record.medico_id) return 'N/A';
        const medico = medicos.find((m) => m.id === record.medico_id);
        return medico?.especialidade || 'N/A';
      },
    },
    {
      key: 'dia_semana',
      label: 'Dia da Semana',
      dataIndex: 'dia_semana',
      render: (_: any, record: Horario) => {
        if (!record || !record.dia_semana) return 'N/A';
        return diasSemanaMap[record.dia_semana] || record.dia_semana;
      },
    },
    {
      key: 'horario',
      label: 'Horário',
      dataIndex: 'hora_inicio',
      render: (_: any, record: Horario) => {
        if (!record || !record.hora_inicio) return 'N/A';
        return `${record.hora_inicio} - ${record.hora_fim}`;
      },
    },
    {
      key: 'actions',
      label: 'Ações',
      dataIndex: 'id',
      render: (_: any, record: Horario) => (
        <div className="table-actions">
          <button
            className="action-btn edit"
            onClick={() => navigate(`/medico/horarios/editar/${record.id}`)}
            title="Editar"
          >
            <Edit size={16} />
          </button>
          <button
            className="action-btn delete"
            onClick={() => setDeleteModal(record)}
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="crud-page animate-fadeIn">
      <div className="page-header">
        <h1>Gerenciar Horários</h1>
        <Button onClick={() => navigate('/medico/horarios/novo')} icon={<Plus size={20} />}>
          Novo Horário
        </Button>
      </div>

      <Card>
        <div className="search-bar">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <Input
              placeholder="Buscar por médico..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Carregando...</div>
        ) : (
          <Table
            data={filteredHorarios}
            columns={columns}
          />
        )}
      </Card>

      {deleteModal && (
        <Modal
          title="Confirmar Exclusão"
          isOpen={!!deleteModal}
          onClose={() => setDeleteModal(null)}
        >
          <p>Tem certeza que deseja excluir este horário?</p>
          <p className="warning-text">Esta ação não pode ser desfeita.</p>
          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setDeleteModal(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Excluir
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
