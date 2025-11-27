import { useEffect, useState } from "react";
import { message } from "antd";
import type { Consulta } from "../types/Consulta";
import { ConsultasAPI } from "../api/consulta";

export function useConsultas() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(false);

  async function carregar() {
    setLoading(true);
    try {
      const data = await ConsultasAPI.listar();
      setConsultas(data);
    } catch {
      message.error("Erro ao carregar consultas");
    }
    setLoading(false);
  }

  async function criar(payload: Omit<Consulta, "id">) {
    try {
      const nova = await ConsultasAPI.criar(payload);
      setConsultas((prev) => [...prev, nova]);
      message.success("Consulta criada com sucesso");
    } catch {
      message.error("Erro ao criar consulta");
    }
  }

  async function atualizar(id: string, payload: Partial<Consulta>) {
    try {
      const att = await ConsultasAPI.atualizar(id, payload);
      setConsultas((prev) =>
        prev.map((c) => (c.id === id ? att : c))
      );
      message.success("Consulta atualizada");
    } catch {
      message.error("Erro ao atualizar consulta");
    }
  }

  async function deletar(id: string) {
    try {
      await ConsultasAPI.deletar(id);
      setConsultas((prev) => prev.filter((c) => c.id !== id));
      message.success("Consulta removida");
    } catch {
      message.error("Erro ao remover consulta");
    }
  }

  async function agendar(payload: import("../types/Consulta").Consulta) {
    try {
      const res = await ConsultasAPI.agendar(payload);
      message.info("Consulta enviada para agendamento (processamento assíncrono)");
      return res;
    } catch {
      message.error("Erro ao agendar consulta");
    }
  }

  useEffect(() => {
    setTimeout(carregar, 0);
  }, []);

  return {
    consultas,
    loading,
    criar,
    atualizar,
    deletar,
    agendar
  };
}