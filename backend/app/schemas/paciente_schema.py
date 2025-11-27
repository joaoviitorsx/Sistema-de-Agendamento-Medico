from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict

class PacienteBase(BaseModel):
    nome: str
    cpf: str
    data_nascimento: date
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None


class PacienteCreate(PacienteBase):
    pass

class PacienteUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None


class PacienteOut(PacienteBase):
    id: str
    created_at: datetime
    updated_at: datetime

    # permite mapear a partir de objetos de domínio (dataclass Paciente)
    model_config = ConfigDict(from_attributes=True)