import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { usePacienteStore } from '@/store/usePacienteStore';
import './CrudPages.css';

export const NovoPaciente = () => <PacienteForm />;
export const EditarPaciente = () => <PacienteForm />;

function PacienteForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { pacientes, fetchPacientes, createPaciente, updatePaciente, loading } = usePacienteStore();

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    data_nascimento: '',
    email: '',
    telefone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchPacientes();
    }
  }, [id]);

  useEffect(() => {
    if (id && pacientes.length > 0) {
      const paciente = pacientes.find((p) => p.id === id);
      if (paciente) {
        setFormData({
          nome: paciente.nome,
          cpf: paciente.cpf || '',
          data_nascimento: paciente.data_nascimento || '',
          email: paciente.email || '',
          telefone: paciente.telefone || '',
        });
      }
    }
  }, [id, pacientes]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{11}$/.test(formData.cpf.replace(/\D/g, ''))) {
      newErrors.cpf = 'CPF deve ter 11 dígitos';
    }

    if (!formData.data_nascimento) {
      newErrors.data_nascimento = 'Data de nascimento é obrigatória';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    let success;
    if (id) {
      // Para edição, enviar apenas campos editáveis
      const updateData = {
        nome: formData.nome,
        email: formData.email || undefined,
        telefone: formData.telefone || undefined,
      };
      success = await updatePaciente(id, updateData);
    } else {
      // Para criação, enviar todos os campos
      success = await createPaciente(formData);
    }

    if (success) {
      navigate('/medico/pacientes');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="crud-page animate-fadeIn">
      <div className="page-header">
        <Button
          variant="secondary"
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate('/medico/pacientes')}
        >
          Voltar
        </Button>
        <h1>{id ? 'Editar Paciente' : 'Novo Paciente'}</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-row full">
            <Input
              label="Nome Completo *"
              value={formData.nome}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('nome', e.target.value)}
              error={errors.nome}
              placeholder="Digite o nome completo do paciente"
            />
          </div>

          <div className="form-row">
            <Input
              label="CPF *"
              value={formData.cpf}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('cpf', e.target.value.replace(/\D/g, ''))}
              error={errors.cpf}
              placeholder="00000000000"
              maxLength={11}
              disabled={!!id}
            />
            <Input
              label="Data de Nascimento *"
              type="date"
              value={formData.data_nascimento}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('data_nascimento', e.target.value)}
              error={errors.data_nascimento}
              disabled={!!id}
            />
          </div>

          <div className="form-row">
            <Input
              label="E-mail"
              type="email"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
              error={errors.email}
              placeholder="exemplo@email.com"
            />
            <Input
              label="Telefone"
              value={formData.telefone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('telefone', e.target.value)}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
          </div>

          <div className="form-actions">
            <Button variant="secondary" onClick={() => navigate('/medico/pacientes')} htmlType="button">
              Cancelar
            </Button>
            <Button variant="success" loading={loading} htmlType="submit">
              {id ? 'Salvar Alterações' : 'Cadastrar Paciente'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
