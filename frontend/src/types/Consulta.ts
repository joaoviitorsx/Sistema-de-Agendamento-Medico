export interface Consulta {
  id: string;
  paciente_id: string;
  medico_id: string;
  inicio: string; // ISO string
  fim: string;    // ISO string
}
