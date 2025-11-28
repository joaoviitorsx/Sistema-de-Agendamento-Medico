from dataclasses import dataclass
from typing import Optional

@dataclass
class Horario:
    id: str
    medico_id: str
    dia_semana: str
    hora_inicio: str
    hora_fim: str
