import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SlotSelector } from '@/components/domain/SlotSelector';
import { useMedicoStore } from '@/store/useMedicoStore';
import { usePacienteStore } from '@/store/usePacienteStore';
import { useConsultaStore } from '@/store/useConsultaStore';
import { useAgendaStore } from '@/store/useAgendaStore';

export const AgendarConsulta = () => {
    const navigate = useNavigate();
    const { pacienteId } = useParams<{ pacienteId: string }>();
    const { medicos, fetchMedicos } = useMedicoStore();
    const { pacientes, fetchPacientes } = usePacienteStore();
    const { agendarConsulta } = useConsultaStore();
    const { reservarSlot, liberarSlot, selectedSlot, setSelectedSlot, clearSelectedSlot, connectSSE, disconnectSSE } = useAgendaStore();

    const [step, setStep] = useState(1);
    const [selectedMedico, setSelectedMedico] = useState('');
    const [selectedPaciente, setSelectedPaciente] = useState(pacienteId || '');
    const [observacoes, setObservacoes] = useState('');
    const [loading, setLoading] = useState(false);

    // Valida se o pacienteId existe
    useEffect(() => {
        if (!pacienteId) {
            toast.error('ID do paciente não encontrado');
            navigate('/');
        }
    }, [pacienteId, navigate]);

    useEffect(() => {
        fetchMedicos();
        fetchPacientes();
        // Conecta ao SSE para atualizações em tempo real
        connectSSE();
        
        return () => {
            disconnectSSE();
        };
    }, [fetchMedicos, fetchPacientes, connectSSE, disconnectSSE]);

    useEffect(() => {
        if (pacienteId) {
            setSelectedPaciente(pacienteId);
        }
    }, [pacienteId]);

    // Monitora se o slot selecionado foi limpo (ocupado por outro paciente)
    // e volta para o step de seleção de horário
    useEffect(() => {
        if (step === 3 && !selectedSlot) {
            // Se estava no step 3 (confirmação) e perdeu o slot, volta para step 2
            setStep(2);
        }
    }, [selectedSlot, step]);

    // Cleanup: libera slot quando o componente é desmontado
    useEffect(() => {
        return () => {
            if (selectedSlot && selectedSlot.medicoId) {
                liberarSlot(selectedSlot.medicoId, selectedSlot.datetime);
                clearSelectedSlot();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Libera slot quando troca de step (voltando)
    const handleVoltar = async (novoStep: number) => {
        if (selectedSlot && novoStep < step) {
            await liberarSlot(selectedSlot.medicoId, selectedSlot.datetime);
            clearSelectedSlot();
        }
        setStep(novoStep);
    };

    // Libera slot ao cancelar
    const handleCancelar = async () => {
        if (selectedSlot) {
            await liberarSlot(selectedSlot.medicoId, selectedSlot.datetime);
            clearSelectedSlot();
        }
        navigate(`/paciente/${pacienteId}/home`);
    };

    // Mostrar todos os médicos em vez de filtrar por especialidade
    const medicosFiltrados = medicos;

    const handleSelectSlot = async (datetime: string) => {
        if (!selectedMedico) return;
        
        // Verifica se o slot está realmente disponível
        const slotStatus = useAgendaStore.getState().getSlotStatus(selectedMedico, datetime);
        
        // Se estiver ocupado ou reservado, não permite selecionar
        if (slotStatus === 'ocupado') {
            toast.error('Este horário já foi ocupado por outro paciente');
            return;
        }
        
        if (slotStatus === 'reservado') {
            toast.error('Este horário está sendo agendado por outro paciente. Aguarde...');
            return;
        }
        
        // Libera o slot anterior se houver
        if (selectedSlot) {
            await liberarSlot(selectedMedico, selectedSlot.datetime);
        }
        
        // Tenta reservar o novo slot
        const success = await reservarSlot(selectedMedico, datetime);
        if (success) {
            setSelectedSlot(selectedMedico, datetime);
        }
    };

    const handleConfirmar = async () => {
        if (!selectedPaciente || !selectedMedico || !selectedSlot) return;
        
        // Verifica se o slot ainda está reservado/disponível antes de confirmar
        const currentStatus = useAgendaStore.getState().getSlotStatus(selectedMedico, selectedSlot.datetime);
        if (currentStatus === 'ocupado') {
            toast.error('Este horário foi ocupado por outro paciente. Por favor, escolha outro horário.');
            clearSelectedSlot();
            setStep(2); // Volta para seleção de horário
            return;
        }
        
        setLoading(true);
        try {
            // Calcula a data de fim (1 hora depois)
            const inicioDate = new Date(selectedSlot.datetime);
            const fimDate = new Date(inicioDate.getTime() + 60 * 60 * 1000);
            
            // Formata as datas sem timezone (naive datetime)
            const inicioStr = selectedSlot.datetime; // já está no formato correto
            const fimStr = format(fimDate, "yyyy-MM-dd'T'HH:mm:ss");
            
            const result = await agendarConsulta({
                paciente_id: selectedPaciente,
                medico_id: selectedMedico,
                inicio: inicioStr,
                fim: fimStr,
                observacoes,
            });
            if (result) {
                // Não libera o slot, pois ele foi confirmado no backend
                clearSelectedSlot();
                
                // Aguarda 1 segundo para o worker processar
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Redireciona para a lista de consultas
                navigate(`/paciente/${pacienteId}/consultas`);
            } else {
                // Em caso de falha, libera a reserva
                await liberarSlot(selectedMedico, selectedSlot.datetime);
                clearSelectedSlot();
            }
        } catch (error) {
            // Em caso de erro, libera a reserva
            if (selectedSlot) {
                await liberarSlot(selectedMedico, selectedSlot.datetime);
                clearSelectedSlot();
            }
        } finally {
            setLoading(false);
        }
    };

    const canGoNext = () => {
        if (step === 1) return selectedMedico;
        if (step === 2) return selectedSlot;
        return false;
    };

    return (
        <div className="flex flex-col items-center py-8 px-2">
            <div className="w-full max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-blue-900 mb-2 text-center">Agendar Nova Consulta</h1>
                    <div className="flex items-center justify-center gap-2">
                        <div className={`flex items-center gap-1`}>
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step >= 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-300'} font-bold`}>1</span>
                            <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-700' : 'text-blue-400'}`}>Médico</span>
                        </div>
                        <ChevronRight size={20} className="text-blue-400" />
                        <div className={`flex items-center gap-1`}>
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step >= 2 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-300'} font-bold`}>2</span>
                            <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-700' : 'text-blue-400'}`}>Horário</span>
                        </div>
                        <ChevronRight size={20} className="text-blue-400" />
                        <div className={`flex items-center gap-1`}>
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step >= 3 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-300'} font-bold`}>3</span>
                            <span className={`text-sm font-medium ${step >= 3 ? 'text-blue-700' : 'text-blue-400'}`}>Confirmação</span>
                        </div>
                    </div>
                </div>

                {/* Step 1: Médico */}
                {step === 1 && (
                    <div className="bg-white rounded-xl shadow-lg p-8 animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-6 text-blue-800">Escolha o Médico</h2>
                        {medicosFiltrados.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 mb-2">Nenhum médico disponível no momento.</p>
                                <p className="text-gray-400 text-sm">Por favor, tente novamente mais tarde.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {medicosFiltrados.map((medico) => (
                                <button
                                    key={medico.id}
                                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-150 w-full
                                        ${selectedMedico === medico.id
                                            ? 'border-blue-600 bg-blue-50 shadow-md'
                                            : 'border-blue-200 bg-white hover:border-blue-400 hover:bg-blue-100'}
                                    `}
                                    onClick={() => setSelectedMedico(medico.id)}
                                    aria-pressed={selectedMedico === medico.id}
                                >
                                    <User size={32} className="text-blue-600" />
                                    <div>
                                        <div className="font-bold text-blue-900">{medico.nome}</div>
                                        <div className="text-xs text-blue-700">CRM: {medico.crm}</div>
                                        <div className="text-xs text-blue-500">{medico.especialidade}</div>
                                    </div>
                                </button>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-between">
                            <Button onClick={handleCancelar} variant="secondary">
                                Cancelar
                            </Button>
                            <Button onClick={() => setStep(2)} disabled={!canGoNext()}>
                                Próximo
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Horário */}
                {step === 2 && selectedMedico && (
                    <div className="bg-white rounded-xl shadow-lg p-8 animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-6 text-blue-800">Escolha o Horário</h2>
                        <div className="mb-8">
                            <SlotSelector
                                medicoId={selectedMedico}
                                onSelectSlot={handleSelectSlot}
                                selectedSlot={selectedSlot?.datetime}
                            />
                        </div>
                        <div className="flex justify-between">
                            <Button onClick={() => handleVoltar(1)} variant="secondary">
                                Voltar
                            </Button>
                            <Button onClick={() => setStep(3)} disabled={!canGoNext()}>
                                Próximo
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Confirmação */}
                {step === 3 && (
                    <div className="bg-white rounded-xl shadow-lg p-8 animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-6 text-blue-800">Confirmar Agendamento</h2>
                        <div className="space-y-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">Paciente</label>
                                <select
                                    value={selectedPaciente}
                                    onChange={(e) => setSelectedPaciente(e.target.value)}
                                    className="w-full border border-blue-200 rounded-lg px-3 py-2 bg-gray-100 text-blue-900"
                                    disabled={true}
                                >
                                    <option value="">Selecione...</option>
                                    {pacientes.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nome} - CPF: {p.cpf}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Input
                                label="Observações (opcional)"
                                value={observacoes}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setObservacoes(e.target.value)}
                                placeholder="Digite observações sobre a consulta..."
                            />
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <h3 className="font-semibold text-blue-800 mb-2">Resumo do Agendamento</h3>
                                <ul className="text-blue-900 space-y-1 text-sm">
                                    <li>
                                        <strong>Médico:</strong> {medicos.find((m) => m.id === selectedMedico)?.nome}
                                    </li>
                                    <li>
                                        <strong>Horário:</strong> {selectedSlot && new Date(selectedSlot.datetime).toLocaleString('pt-BR')}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <Button onClick={() => handleVoltar(2)} variant="secondary">
                                Voltar
                            </Button>
                            <Button
                                onClick={handleConfirmar}
                                variant="success"
                                disabled={!selectedPaciente}
                                loading={loading}
                            >
                                Confirmar Agendamento
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
