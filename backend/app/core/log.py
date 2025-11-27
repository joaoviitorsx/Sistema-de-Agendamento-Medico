import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path
from queue import Queue
from typing import Optional

from ..core.config import settings

# FILA GLOBAL DE LOG PARA STREAMING NO FRONTEND
LOG_QUEUE: "Queue[str]" = Queue(maxsize=5000)


class QueueLogHandler(logging.Handler):
    """
    Handler customizado que envia mensagens de log para a fila,
    permitindo streaming ao frontend.
    """
    def emit(self, record: logging.LogRecord) -> None:
        try:
            msg = self.format(record)
            LOG_QUEUE.put(msg)
        except Exception:
            pass  # nunca quebra o sistema


def configure_logging() -> None:
    log_file: Path = settings.logs_dir / "app.log"

    formatter = logging.Formatter(
        fmt="%(asctime)s [%(levelname)s] %(name)s → %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # ---------------------------------
    # HANDLER 1 — Arquivo com rotação
    # ---------------------------------
    file_handler = RotatingFileHandler(
        filename=log_file,
        maxBytes=1_000_000,     # 1MB por arquivo
        backupCount=5,          # mantém 5 arquivos antigos
        encoding="utf-8",
    )
    file_handler.setFormatter(formatter)

    # ---------------------------------
    # HANDLER 2 — Console
    # ---------------------------------
    console = logging.StreamHandler()
    console.setFormatter(formatter)

    # ---------------------------------
    # HANDLER 3 — Fila para streaming
    # ---------------------------------
    queue_handler = QueueLogHandler()
    queue_handler.setFormatter(formatter)

    # ---------------------------------
    # Configura logger raiz
    # ---------------------------------
    root = logging.getLogger()
    root.setLevel(logging.INFO)
    root.addHandler(file_handler)
    root.addHandler(console)
    root.addHandler(queue_handler)
