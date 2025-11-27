from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class ConsultaBase(BaseModel):
    paciente_id: str
    medico_id: str
    inicio: datetime = Field(..., description="Data/hora início da consulta")
    fim: datetime = Field(..., description="Data/hora fim da consulta")
    observacoes: Optional[str] = None


class ConsultaCreate(ConsultaBase):
    pass


class ConsultaUpdate(BaseModel):
    inicio: Optional[datetime] = None
    fim: Optional[datetime] = None
    status: Optional[str] = None
    observacoes: Optional[str] = None


class ConsultaOut(ConsultaBase):
    id: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
