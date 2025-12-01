import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useMedicoStore } from '@/store/useMedicoStore';
import './CrudPages.css';

export const NovoMedico = () => <MedicoForm />;
export const EditarMedico = () => <MedicoForm />;

function MedicoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { medicos, fetchMedicos, createMedico, updateMedico, loading } = useMedicoStore();

  const [formData, setFormData] = useState({
    nome: '',
    crm: '',
    especialidade: '',
    email: '',
    telefone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      fetchMedicos();
    }
  }, [id]);

  useEffect(() => {
    if (id && medicos.length > 0) {
      const medico = medicos.find((m) => m.id === id);
      if (medico) {
        setFormData({
          nome: medico.nome,
          crm: medico.crm || '',
          especialidade: medico.especialidade,
          email: medico.email || '',
          telefone: medico.telefone || '',
        });
      }
    }
  }, [id, medicos]);

  const especialidadesComuns = [
    'Cardiologia',
    'Dermatologia',
    'Endocrinologia',
    'Ginecologia',
    'Neurologia',
    'Ortopedia',
    'Pediatria',
    'Psiquiatria',
    'Urologia',
    'Clínico Geral',
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.crm.trim()) {
      newErrors.crm = 'CRM é obrigatório';
    }

    if (!formData.especialidade.trim()) {
      newErrors.especialidade = 'Especialidade é obrigatória';
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
        especialidade: formData.especialidade,
        email: formData.email || undefined,
        telefone: formData.telefone || undefined,
      };
      success = await updateMedico(id, updateData);
    } else {
      // Para criação, enviar todos os campos
      success = await createMedico(formData);
    }

    if (success) {
      navigate('/medico/medicos');
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
          onClick={() => navigate('/medico/medicos')}
        >
          Voltar
        </Button>
        <h1>{id ? 'Editar Médico' : 'Novo Médico'}</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-row full">
            <Input
              label="Nome Completo do Médico *"
              value={formData.nome}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('nome', e.target.value)}
              error={errors.nome}
              placeholder="Digite o nome completo"
            />
          </div>

          <div className="form-row">
            <Input
              label="CRM *"
              value={formData.crm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('crm', e.target.value)}
              error={errors.crm}
              placeholder="12345-SP"
              disabled={!!id}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Especialidade *</label>
              <select
                className="form-select"
                value={formData.especialidade}
                onChange={(e) => handleChange('especialidade', e.target.value)}
              >
                <option value="">Selecione...</option>
                {especialidadesComuns.map((esp) => (
                  <option key={esp} value={esp}>
                    {esp}
                  </option>
                ))}
              </select>
              {errors.especialidade && (
                <span className="error-message">{errors.especialidade}</span>
              )}
            </div>

            <Input
              label="Telefone"
              value={formData.telefone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('telefone', e.target.value)}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
          </div>

          <div className="form-row full">
            <Input
              label="E-mail"
              type="email"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('email', e.target.value)}
              error={errors.email}
              placeholder="exemplo@email.com"
            />
          </div>

          <div className="form-actions">
            <Button variant="secondary" onClick={() => navigate('/medico/medicos')} htmlType="button">
              Cancelar
            </Button>
            <Button variant="success" loading={loading} htmlType="submit">
              {id ? 'Salvar Alterações' : 'Cadastrar Médico'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
