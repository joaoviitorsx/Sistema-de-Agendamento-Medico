import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useHorarioStore } from '@/store/useHorarioStore';
import { useMedicoStore } from '@/store/useMedicoStore';
import './CrudPages.css';

export const NovoHorario = () => <HorarioForm />;
export const EditarHorario = () => <HorarioForm />;

function HorarioForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { horarios, fetchHorarios, createHorario, updateHorario, loading } = useHorarioStore();
  const { medicos, fetchMedicos } = useMedicoStore();

  const [formData, setFormData] = useState({
    medico_id: '',
    dia_semana: '',
    hora_inicio: '',
    hora_fim: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchMedicos();
    if (id) {
      fetchHorarios();
    }
  }, [id]);

  useEffect(() => {
    if (id && horarios.length > 0) {
      const horario = horarios.find((h) => h.id === id);
      if (horario) {
        setFormData({
          medico_id: horario.medico_id,
          dia_semana: horario.dia_semana,
          hora_inicio: horario.hora_inicio,
          hora_fim: horario.hora_fim,
        });
      }
    }
  }, [id, horarios]);

  const diasSemana = [
    { value: 'segunda', label: 'Segunda-feira' },
    { value: 'terca', label: 'Terça-feira' },
    { value: 'quarta', label: 'Quarta-feira' },
    { value: 'quinta', label: 'Quinta-feira' },
    { value: 'sexta', label: 'Sexta-feira' },
    { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.medico_id) {
      newErrors.medico_id = 'Médico é obrigatório';
    }

    if (!formData.dia_semana) {
      newErrors.dia_semana = 'Dia da semana é obrigatório';
    }

    if (!formData.hora_inicio) {
      newErrors.hora_inicio = 'Hora de início é obrigatória';
    }

    if (!formData.hora_fim) {
      newErrors.hora_fim = 'Hora de fim é obrigatória';
    }

    if (formData.hora_inicio && formData.hora_fim && formData.hora_inicio >= formData.hora_fim) {
      newErrors.hora_fim = 'Hora de fim deve ser maior que hora de início';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const horarioData = {
      dia_semana: formData.dia_semana,
      hora_inicio: formData.hora_inicio,
      hora_fim: formData.hora_fim,
    };

    const success = id
      ? await updateHorario(id, horarioData)
      : await createHorario(formData.medico_id, horarioData);

    if (success) {
      navigate('/medico/horarios');
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
          onClick={() => navigate('/medico/horarios')}
        >
          Voltar
        </Button>
        <h1>{id ? 'Editar Horário' : 'Novo Horário'}</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-row">
            <div className="form-group">
              <label>Médico *</label>
              <select
                className="form-select"
                value={formData.medico_id}
                onChange={(e) => handleChange('medico_id', e.target.value)}
                disabled={!!id}
              >
                <option value="">Selecione...</option>
                {medicos.map((medico) => (
                  <option key={medico.id} value={medico.id}>
                    {medico.nome} - {medico.especialidade}
                  </option>
                ))}
              </select>
              {errors.medico_id && <span className="error-message">{errors.medico_id}</span>}
            </div>

            <div className="form-group">
              <label>Dia da Semana *</label>
              <select
                className="form-select"
                value={formData.dia_semana}
                onChange={(e) => handleChange('dia_semana', e.target.value)}
              >
                <option value="">Selecione...</option>
                {diasSemana.map((dia) => (
                  <option key={dia.value} value={dia.value}>
                    {dia.label}
                  </option>
                ))}
              </select>
              {errors.dia_semana && <span className="error-message">{errors.dia_semana}</span>}
            </div>
          </div>

          <div className="form-row">
            <Input
              label="Hora de Início *"
              type="time"
              value={formData.hora_inicio}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('hora_inicio', e.target.value)}
              error={errors.hora_inicio}
            />
            <Input
              label="Hora de Fim *"
              type="time"
              value={formData.hora_fim}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('hora_fim', e.target.value)}
              error={errors.hora_fim}
            />
          </div>

          <div className="form-actions">
            <Button variant="secondary" type="button" onClick={() => navigate('/medico/horarios')}>
              Cancelar
            </Button>
            <Button variant="success" htmlType="submit" loading={loading}>
              {id ? 'Salvar Alterações' : 'Cadastrar Horário'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
