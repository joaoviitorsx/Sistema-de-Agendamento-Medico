
import { api } from "./axios";
import type { Medico } from "../types/Medico";

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

export const getHorariosByMedico = async (medicoId: string): Promise<Horario[]> => {
  const { data } = await api.get(`/horarios/medico/${medicoId}`);
  return data;
};

export const createHorario = async (medicoId: string, horario: HorarioCreate): Promise<Horario> => {
  const { data } = await api.post(`/horarios/medico/${medicoId}`, horario);
  return data;
};

export const updateHorario = async (horarioId: string, horario: Partial<HorarioCreate>): Promise<Horario> => {
  const { data } = await api.put(`/horarios/${horarioId}`, horario);
  return data;
};

export const deleteHorario = async (horarioId: string): Promise<void> => {
  await api.delete(`/horarios/${horarioId}`);
};
