from pydantic import BaseModel
from typing import Optional

class HorarioCreate(BaseModel):
    dia_semana: str  # Ex: 'segunda', 'terca', ...
    hora_inicio: str  # Ex: '08:00'
    hora_fim: str    # Ex: '12:00'

class HorarioUpdate(BaseModel):
    dia_semana: Optional[str] = None
    hora_inicio: Optional[str] = None
    hora_fim: Optional[str] = None

class HorarioOut(BaseModel):
    id: str
    medico_id: str
    dia_semana: str
    hora_inicio: str
    hora_fim: str
