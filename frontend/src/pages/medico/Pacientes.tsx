import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { usePacienteStore } from '@/store/usePacienteStore';
import { Paciente } from '@/types';
import './CrudPages.css';

export { NovoPaciente, EditarPaciente } from './PacienteForm';

export const Pacientes = () => {
  const navigate = useNavigate();
  const { pacientes, fetchPacientes, deletePaciente, loading } = usePacienteStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<Paciente | null>(null);

  useEffect(() => {
    fetchPacientes();
  }, []);

  const filteredPacientes = pacientes.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cpf?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (deleteModal) {
      await deletePaciente(deleteModal.id);
      setDeleteModal(null);
    }
  };

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'cpf', label: 'CPF' },
    { key: 'email', label: 'E-mail' },
    { key: 'telefone', label: 'Telefone' },
    {
      key: 'actions',
      label: 'Ações',
      render: (paciente: Paciente) => (
        <div className="table-actions">
          <button
            className="action-btn edit"
            onClick={() => paciente?.id && navigate(`/medico/pacientes/editar/${paciente.id}`)}
            title="Editar"
          >
            <Edit size={16} />
          </button>
          <button
            className="action-btn delete"
            onClick={() => paciente && setDeleteModal(paciente)}
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
        <h1>Gerenciar Pacientes</h1>
        <Button onClick={() => navigate('/medico/pacientes/novo')} icon={<Plus size={20} />}>
          Novo Paciente
        </Button>
      </div>

      <Card>
        <div className="search-bar">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <Input
              placeholder="Buscar por nome, CPF ou e-mail..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Carregando...</div>
        ) : (
          <Table
            data={filteredPacientes}
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
          <p>Tem certeza que deseja excluir o paciente <strong>{deleteModal.nome}</strong>?</p>
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
