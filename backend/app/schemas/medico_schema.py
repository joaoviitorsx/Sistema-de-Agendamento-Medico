from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


class MedicoBase(BaseModel):
    nome: str
    crm: str
    especialidade: str
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None


class MedicoCreate(MedicoBase):
    pass


class MedicoUpdate(BaseModel):
    nome: Optional[str] = None
    especialidade: Optional[str] = None
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None


class MedicoOut(MedicoBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
