export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  data_nascimento: string;
  email?: string;
  telefone?: string;
  created_at: string;
  updated_at: string;
}

export interface PacienteCreate {
  nome: string;
  cpf: string;
  data_nascimento: string;
  email?: string;
  telefone?: string;
}

export interface PacienteUpdate {
  nome?: string;
  email?: string;
  telefone?: string;
}

export interface Medico {
  id: string;
  nome: string;
  crm: string;
  especialidade: string;
  email?: string;
  telefone?: string;
  created_at: string;
  updated_at: string;
}

export interface MedicoCreate {
  nome: string;
  crm: string;
  especialidade: string;
  email?: string;
  telefone?: string;
}

export interface MedicoUpdate {
  nome?: string;
  especialidade?: string;
  email?: string;
  telefone?: string;
}

export interface Consulta {
  id: string;
  paciente_id: string;
  medico_id: string;
  inicio: string;
  fim: string;
  status: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface ConsultaCreate {
  paciente_id: string;
  medico_id: string;
  inicio: string;
  fim: string;
  observacoes?: string;
}

export interface ConsultaUpdate {
  inicio?: string;
  fim?: string;
  status?: string;
  observacoes?: string;
}

export interface Horario {
  id: string;
  medico_id: string;
  dia_semana: string;
  hora_inicio: string;
  hora_fim: string;
}

export interface HorarioCreate {
  dia_semana: string;
  hora_inicio: string;
  hora_fim: string;
}

export interface HorarioUpdate {
  dia_semana?: string;
  hora_inicio?: string;
  hora_fim?: string;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

export type SlotStatus = 'disponivel' | 'reservado' | 'ocupado';

export interface Slot {
  datetime: string;
  status: SlotStatus;
}

export interface SlotsMap {
  [medicoId: string]: {
    [datetime: string]: SlotStatus;
  };
}

export interface AgendaReserva {
  medico_id: string;
  slot: string;
}

export interface TaskResponse {
  status: string;
  task_id: string;
  slot: string;
  mensagem: string;
}
