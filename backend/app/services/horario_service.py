from typing import List, Optional
from ..schemas.horario_schema import HorarioCreate, HorarioUpdate, HorarioOut
from ..repositories.horario_repository import HorarioRepository

class HorarioService:
    def __init__(self):
        self.repo = HorarioRepository()

    async def listar_horarios_medico(self, medico_id: str) -> List[HorarioOut]:
        horarios = await self.repo.listar_horarios_medico(medico_id)
        return [HorarioOut(**h) for h in horarios]

    async def obter_horario(self, horario_id: str) -> Optional[HorarioOut]:
        h = await self.repo.obter_horario(horario_id)
        return HorarioOut(**h) if h else None

    async def criar_horario(self, medico_id: str, payload: HorarioCreate) -> HorarioOut:
        h = await self.repo.criar_horario(medico_id, payload.dict())
        return HorarioOut(**h)

    async def atualizar_horario(self, horario_id: str, payload: HorarioUpdate) -> Optional[HorarioOut]:
        h = await self.repo.atualizar_horario(horario_id, payload.dict(exclude_unset=True))
        return HorarioOut(**h) if h else None

    async def deletar_horario(self, horario_id: str) -> bool:
        return await self.repo.deletar_horario(horario_id)
