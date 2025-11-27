import { useEffect, useState, useCallback } from "react";
import { useSSE } from "./useSSE";
import { AgendaAPI } from "../api/agenda";

export function useAgenda(medico_id: string) {
  const [slots, setSlots] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const carregarSlots = useCallback(async () => {
    setLoading(true);
    try {
      const data = await AgendaAPI.listarSlots();
      setSlots(data[medico_id] || {});
    } finally {
      setLoading(false);
    }
  }, [medico_id]);

  const atualizarSlot = useCallback((slot: string, estado: string) => {
    setSlots((prev) => ({
      ...prev,
      [slot]: estado,
    }));
  }, []);

  useSSE("http://localhost:8000/sistema/agenda/stream", (msg: unknown) => {
    // msg.tipo: horario_reservado / horario_disponivel / horario_ocupado
    // msg.dados: { medico_id, slot }
    if (
      typeof msg === "object" &&
      msg !== null &&
      "tipo" in msg &&
      typeof (msg as { tipo: unknown }).tipo === "string" &&
      (msg as { tipo: string }).tipo.startsWith("horario_") &&
      "dados" in msg &&
      typeof (msg as { dados: unknown }).dados === "object" &&
      (msg as { dados: unknown }).dados !== null &&
      "medico_id" in (msg as { dados: { medico_id: unknown } }).dados &&
      "slot" in (msg as { dados: { slot: unknown } }).dados
    ) {
      const tipo = (msg as { tipo: string }).tipo;
      const dados = (msg as { dados: { medico_id: string; slot: string } }).dados;
      if (dados.medico_id !== medico_id) return;
      const estado = tipo.replace("horario_", "");
      atualizarSlot(dados.slot, estado);
    }
  });

  useEffect(() => {
    carregarSlots();
  }, [medico_id, carregarSlots]);

  return {
    slots,
    loading,
    reservarSlot: AgendaAPI.reservarSlot
  };
}
