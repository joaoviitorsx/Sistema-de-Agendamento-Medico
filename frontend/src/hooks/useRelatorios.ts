import { useEffect, useState } from "react";
import { RelatoriosAPI } from "../api/relatorio";
import { message } from "antd";

export function useRelatorios() {
  const [arquivos, setArquivos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function carregar() {
    setLoading(true);
    try {
      const list = await RelatoriosAPI.listar();
      setArquivos(list);
    } finally {
      setLoading(false);
    }
  }

  async function gerarRelatorio(filtros: Record<string, unknown>) {
    await RelatoriosAPI.gerar(filtros);
    message.info("Relatório enviado para geração...");
  }

  // SSE → atualiza quando relatório ficar pronto
  useEffect(() => {
    const evt = new EventSource("http://localhost:8000/sistema/logs/stream");

    evt.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.tipo === "relatorio_pronto") {
          message.success("Relatório PDF finalizado!");
          carregar();
        }
      } catch {
        // Ignorar erro
      }
    };

    return () => evt.close();
  }, []);

  useEffect(() => {
    carregar();
  }, []);

  return {
    arquivos,
    loading,
    gerarRelatorio,
    carregar,
  };
}
