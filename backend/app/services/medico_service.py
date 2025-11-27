import asyncio
import logging
from datetime import datetime
from typing import List, Optional
from uuid import uuid4

from ..models.medico_model import Medico
from ..repositories.medico_repository import MedicoRepository
from ..schemas.medico_schema import MedicoCreate, MedicoUpdate

logger = logging.getLogger("medico_service")


class MedicoService:
    def __init__(self, repo: Optional[MedicoRepository] = None):
        self.repo = repo or MedicoRepository()

    async def listar_medicos(self) -> List[Medico]:
        logger.info("Listando médicos")
        return await asyncio.to_thread(self.repo.list_all)

    async def obter_medico(self, medico_id: str) -> Optional[Medico]:
        logger.info("Obtendo médico %s", medico_id)
        return await asyncio.to_thread(self.repo.get_by_id, medico_id)

    async def criar_medico(self, payload: MedicoCreate) -> Medico:
        now = datetime.utcnow()
        medico = Medico(
            id=str(uuid4()),
            nome=payload.nome,
            crm=payload.crm,
            especialidade=payload.especialidade,
            email=payload.email,
            telefone=payload.telefone,
            created_at=now,
            updated_at=now,
        )
        logger.info("Criando médico %s (%s)", medico.nome, medico.id)
        return await asyncio.to_thread(self.repo.save, medico)

    async def atualizar_medico(
        self, medico_id: str, payload: MedicoUpdate
    ) -> Optional[Medico]:
        existente = await asyncio.to_thread(self.repo.get_by_id, medico_id)

        if not existente:
            logger.warning("Médico %s não encontrado para atualização", medico_id)
            return None

        if payload.nome is not None:
            existente.nome = payload.nome
        if payload.especialidade is not None:
            existente.especialidade = payload.especialidade
        if payload.email is not None:
            existente.email = payload.email
        if payload.telefone is not None:
            existente.telefone = payload.telefone

        existente.updated_at = datetime.utcnow()
        return await asyncio.to_thread(self.repo.save, existente)

    async def deletar_medico(self, medico_id: str) -> bool:
        logger.info("Deletando médico %s", medico_id)
        return await asyncio.to_thread(self.repo.delete, medico_id)
