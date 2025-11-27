from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Consulta:
    id: str
    paciente_id: str
    medico_id: str
    inicio: datetime
    fim: datetime
    status: str
    observacoes: Optional[str]
    created_at: datetime
    updated_at: datetime
