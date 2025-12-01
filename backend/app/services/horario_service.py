from typing import List, Optional
import logging
from ..schemas.horario_schema import HorarioCreate, HorarioUpdate, HorarioOut
from ..repositories.horario_repository import HorarioRepository
from ..services.event_service import enviar_evento_sse

logger = logging.getLogger("horario_service")

class HorarioService:
    def __init__(self):
        self.repo = HorarioRepository()

    async def listar_todos_horarios(self) -> List[HorarioOut]:
        horarios = await self.repo.listar_todos_horarios()
        return [HorarioOut(**h) for h in horarios]

    async def listar_horarios_medico(self, medico_id: str) -> List[HorarioOut]:
        horarios = await self.repo.listar_horarios_medico(medico_id)
        return [HorarioOut(**h) for h in horarios]

    async def obter_horario(self, horario_id: str) -> Optional[HorarioOut]:
        h = await self.repo.obter_horario(horario_id)
        return HorarioOut(**h) if h else None

    async def criar_horario(self, medico_id: str, payload: HorarioCreate) -> HorarioOut:
        logger.info(f"🕐 Criando horário para médico {medico_id}: {payload.dia_semana} {payload.hora_inicio}-{payload.hora_fim}")
        h = await self.repo.criar_horario(medico_id, payload.dict())
        # notifica clients que os horários do médico foram alterados
        try:
            await enviar_evento_sse("horario_atualizado", {"medico_id": medico_id})
            logger.info(f"✅ Horário criado e evento SSE enviado")
        except Exception as e:
            logger.warning(f"⚠️ Horário criado mas falha no SSE: {e}")
        return HorarioOut(**h)

    async def atualizar_horario(self, horario_id: str, payload: HorarioUpdate) -> Optional[HorarioOut]:
        h = await self.repo.atualizar_horario(horario_id, payload.dict(exclude_unset=True))
        if h:
            try:
                await enviar_evento_sse("horario_atualizado", {"medico_id": h.get("medico_id")})
            except Exception:
                pass
            return HorarioOut(**h)
        return None

    async def deletar_horario(self, horario_id: str) -> bool:
        # ao deletar, notifica também
        horario = await self.repo.obter_horario(horario_id)
        ok = await self.repo.deletar_horario(horario_id)
        if ok and horario:
            try:
                await enviar_evento_sse("horario_atualizado", {"medico_id": horario.medico_id})
            except Exception:
                pass
        return ok
