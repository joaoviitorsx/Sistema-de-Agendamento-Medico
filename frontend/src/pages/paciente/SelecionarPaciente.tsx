import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { usePacienteStore } from '@/store/usePacienteStore';

export const SelecionarPaciente = () => {
  const navigate = useNavigate();
  const { pacientes, fetchPacientes, loading } = usePacienteStore();

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleSelectPaciente = (pacienteId: string) => {
    navigate(`/paciente/${pacienteId}/home`);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Sistema de Agendamento Médico</h1>
          <p className="text-blue-700">Selecione seu perfil de paciente para continuar</p>
        </div>

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {pacientes.map((paciente) => (
              <button
                key={paciente.id}
                className="flex items-center gap-4 p-6 rounded-lg border-2 border-blue-200 bg-white hover:border-blue-600 hover:bg-blue-50 transition-all duration-150 text-left"
                onClick={() => handleSelectPaciente(paciente.id)}
              >
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={32} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg text-blue-900">{paciente.nome}</div>
                  <div className="text-sm text-blue-700">CPF: {paciente.cpf}</div>
                  {paciente.email && (
                    <div className="text-sm text-blue-600">{paciente.email}</div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {pacientes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum paciente cadastrado no sistema.</p>
              <p className="text-gray-400 text-sm mt-2">
                Entre em contato com a recepção para cadastro.
              </p>
            </div>
          )}
        </Card>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/medico')}
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Acesso Administrativo / Médico
          </button>
        </div>
      </div>
    </div>
  );
};
