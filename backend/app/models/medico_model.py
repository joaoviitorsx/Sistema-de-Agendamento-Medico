from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Medico:
    id: str
    nome: str
    crm: str
    especialidade: str
    email: Optional[str]
    telefone: Optional[str]
    created_at: datetime
    updated_at: datetime
