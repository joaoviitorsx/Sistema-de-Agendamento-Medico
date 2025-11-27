import asyncio
from pathlib import Path
from typing import List

from ..core.log import LOG_QUEUE
from ..core.config import settings


class LogService:
    def __init__(self):
        self.log_file: Path = settings.logs_dir / "app.log"

    #Lê todas as linhas do arquivo de log atual.
    async def ler_arquivo(self) -> List[str]:
        if not self.log_file.exists():
            return []
        return self.log_file.read_text(encoding="utf-8").splitlines()
    
    #Stream de logs em tempo real (Server-Sent Events).
    async def stream_logs(self):
        while True:
            msg = LOG_QUEUE.get()
            yield msg
            await asyncio.sleep(0)  # cooperativo
