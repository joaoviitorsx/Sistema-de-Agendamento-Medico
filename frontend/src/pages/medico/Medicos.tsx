import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { useMedicoStore } from '@/store/useMedicoStore';
import { Medico } from '@/types';

export const Medicos = () => {
    const navigate = useNavigate();
    const { medicos, fetchMedicos, deleteMedico, loading } = useMedicoStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModal, setDeleteModal] = useState<Medico | null>(null);

    useEffect(() => {
        fetchMedicos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredMedicos = medicos.filter(
        (m) =>
            m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.crm?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.especialidade.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async () => {
        if (deleteModal) {
            await deleteMedico(deleteModal.id);
            setDeleteModal(null);
        }
    };

    const columns = [
        { key: 'nome', label: 'Nome', dataIndex: 'nome' },
        { key: 'crm', label: 'CRM', dataIndex: 'crm' },
        { key: 'especialidade', label: 'Especialidade', dataIndex: 'especialidade' },
        { key: 'email', label: 'E-mail', dataIndex: 'email' },
        {
            key: 'actions',
            label: 'Ações',
            dataIndex: 'id',
            render: (_: any, record: Medico) => (
                <div className="table-actions">
                    <button
                        className="action-btn edit"
                        onClick={() => navigate(`/medico/medicos/editar/${record.id}`)}
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
                <h1>Gerenciar Médicos</h1>
                <Button onClick={() => navigate('/medico/medicos/novo')} icon={<Plus size={20} />}>
                    Novo Médico
                </Button>
            </div>

            <Card>
                <div className="search-bar">
                    <div className="search-input-wrapper">
                        <Search className="search-icon" size={20} />
                        <Input
                            placeholder="Buscar por nome, CRM ou especialidade..."
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">Carregando...</div>
                ) : (
                    <Table
                        data={filteredMedicos}
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
                    <p>
                        Tem certeza que deseja excluir o médico <strong>{deleteModal.nome}</strong>?
                    </p>
                    <p className="warning-text">
                        Esta ação não pode ser desfeita e removerá todos os horários associados.
                    </p>
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
