from dataclasses import dataclass, field
from typing import Any, Dict, Literal
from datetime import datetime  # <-- use este import

TaskType = Literal["backup", "gerar_relatorio", "agendar_consulta"]

@dataclass
class Task:
    id: str
    tipo: TaskType
    payload: Dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=datetime.utcnow)