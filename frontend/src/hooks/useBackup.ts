import { useEffect, useState } from "react";
import { BackupAPI } from "../api/backup";
import { message } from "antd";

export function useBackup() {
  const [arquivos, setArquivos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function carregar() {
    setLoading(true);
    const lista = await BackupAPI.listar();
    setArquivos(lista);
    setLoading(false);
  }

  async function executar() {
    await BackupAPI.executar();
    message.info("Backup enviado para execução...");
  }

  // Escuta SSE para detectar quando backup terminar
  useEffect(() => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_URL}/sistema/logs/stream`
    );

    eventSource.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);

        if (msg.tipo === "backup_finalizado") {
          message.success("Backup finalizado!");
          carregar();
        }
      } catch {
        // Ignorar erro
      }
    };

    return () => eventSource.close();
  }, []);

  useEffect(() => {
    setTimeout(carregar, 0);
  }, []);

  return { arquivos, loading, executar };
}
