import { useEffect } from "react";

export function useSSE(url: string, onMessage: (data: unknown) => void) {
  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        onMessage(payload);
      } catch {
        // Ignorar erros de parse
      }
    };

    return () => eventSource.close();
  }, [url, onMessage]);
}
