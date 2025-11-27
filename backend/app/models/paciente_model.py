from dataclasses import dataclass
from datetime import date, datetime
from typing import Optional


@dataclass
class Paciente:
    id: str
    nome: str
    cpf: str
    data_nascimento: date
    email: Optional[str]
    telefone: Optional[str]
    created_at: datetime
    updated_at: datetime