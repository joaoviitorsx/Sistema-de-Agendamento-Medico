import { useEffect, useState } from "react";
import type { Paciente } from "../types/Paciente";
import { PacientesAPI } from "../api/pacientes";
import { message } from "antd";

export function usePacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);

  async function carregar() {
    setLoading(true);
    try {
      const data = await PacientesAPI.listar();
      setPacientes(data);
    } catch {
      message.error("Erro ao carregar pacientes");
    }
    setLoading(false);
  }

  async function criar(paciente: Omit<Paciente, "id">) {
    try {
      const novo = await PacientesAPI.criar(paciente);
      setPacientes((prev) => [...prev, novo]);
      message.success("Paciente criado com sucesso");
    } catch {
      message.error("Erro ao criar paciente");
    }
  }

  async function atualizar(id: string, paciente: Partial<Paciente>) {
    try {
      const att = await PacientesAPI.atualizar(id, paciente);
      setPacientes((prev) =>
        prev.map((p) => (p.id === id ? att : p))
      );
      message.success("Paciente atualizado");
    } catch {
      message.error("Erro ao atualizar paciente");
    }
  }

  async function deletar(id: string) {
    try {
      await PacientesAPI.deletar(id);
      setPacientes((prev) => prev.filter((p) => p.id !== id));
      message.success("Paciente removido");
    } catch {
      message.error("Erro ao remover paciente");
    }
  }

  useEffect(() => {
    setTimeout(carregar, 0);
  }, []);

  return {
    pacientes,
    loading,
    criar,
    atualizar,
    deletar,
  };
}
