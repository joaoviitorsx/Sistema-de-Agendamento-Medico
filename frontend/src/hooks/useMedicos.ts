import { useEffect, useState } from "react";
import type { Medico } from "../types/Medico";
import { MedicosAPI } from "../api/medicos";
import { message } from "antd";

export function useMedicos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(false);

  async function carregar() {
    setLoading(true);
    try {
      const data = await MedicosAPI.listar();
      setMedicos(data);
    } catch {
      message.error("Erro ao carregar médicos");
    }
    setLoading(false);
  }

  async function criar(payload: Omit<Medico, "id">) {
    try {
      const novo = await MedicosAPI.criar(payload);
      setMedicos((prev) => [...prev, novo]);
      message.success("Médico criado com sucesso");
    } catch {
      message.error("Erro ao criar médico");
    }
  }

  async function atualizar(id: string, payload: Partial<Medico>) {
    try {
      const med = await MedicosAPI.atualizar(id, payload);
      setMedicos((prev) => prev.map((m) => (m.id === id ? med : m)));
      message.success("Médico atualizado");
    } catch {
      message.error("Erro ao atualizar médico");
    }
  }

  async function deletar(id: string) {
    try {
      await MedicosAPI.deletar(id);
      setMedicos((prev) => prev.filter((m) => m.id !== id));
      message.success("Médico removido");
    } catch {
      message.error("Erro ao remover médico");
    }
  }

  useEffect(() => {
    setTimeout(carregar, 0);
  }, []);

  return {
    medicos,
    loading,
    criar,
    atualizar,
    deletar,
  };
}
