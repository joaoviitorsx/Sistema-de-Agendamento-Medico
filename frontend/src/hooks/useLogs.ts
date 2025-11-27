import { useSSE } from "./useSSE";
import { useState } from "react";

export function useLogs() {
  const [logs, setLogs] = useState<string[]>([]);

  useSSE("http://localhost:8000/sistema/logs/stream", (msg) => {
    setLogs((prev) => [...prev, JSON.stringify(msg)]);
  });

  return logs;
}
