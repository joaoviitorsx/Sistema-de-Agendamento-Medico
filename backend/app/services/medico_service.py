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
        logger.info("👨‍⚕️ Buscando lista de médicos no repositório")
        result = await asyncio.to_thread(self.repo.list_all)
        logger.info(f"✅ {len(result)} médicos carregados")
        return result

    async def obter_medico(self, medico_id: str) -> Optional[Medico]:
        logger.info(f"🔍 Buscando médico: ID={medico_id}")
        result = await asyncio.to_thread(self.repo.get_by_id, medico_id)
        if result:
            logger.info(f"✅ Médico encontrado: {result.nome} (ID={medico_id})")
        else:
            logger.warning(f"❌ Médico não encontrado: ID={medico_id}")
        return result

    async def criar_medico(self, payload: MedicoCreate) -> Medico:
        now = datetime.utcnow()
        
        # Gera ID auto-incremental
        medicos_existentes = await asyncio.to_thread(self.repo.list_all)
        max_id = 0
        for m in medicos_existentes:
            try:
                mid = int(m.id)
                if mid > max_id:
                    max_id = mid
            except ValueError:
                continue
        novo_id = str(max_id + 1)
        
        medico = Medico(
            id=novo_id,
            nome=payload.nome,
            crm=payload.crm,
            especialidade=payload.especialidade,
            email=payload.email,
            telefone=payload.telefone,
            created_at=now,
            updated_at=now,
        )
        logger.info(f"💾 Salvando médico no banco: Nome={medico.nome}, CRM={medico.crm}, ID={medico.id}")
        result = await asyncio.to_thread(self.repo.save, medico)
        logger.info(f"✅ Médico criado com sucesso: ID={medico.id}")
        return result

    async def atualizar_medico(
        self, medico_id: str, payload: MedicoUpdate
    ) -> Optional[Medico]:
        logger.info(f"✏️ Atualizando médico: ID={medico_id}")
        existente = await asyncio.to_thread(self.repo.get_by_id, medico_id)

        if not existente:
            logger.warning(f"❌ Médico não encontrado para atualização: ID={medico_id}")
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
        logger.info(f"💾 Salvando atualizações do médico: ID={medico_id}")
        result = await asyncio.to_thread(self.repo.save, existente)
        logger.info(f"✅ Médico atualizado com sucesso: ID={medico_id}")
        return result

    async def deletar_medico(self, medico_id: str) -> bool:
        logger.info(f"🗑️ Deletando médico do banco: ID={medico_id}")
        result = await asyncio.to_thread(self.repo.delete, medico_id)
        if result:
            logger.info(f"✅ Médico deletado com sucesso: ID={medico_id}")
        else:
            logger.warning(f"❌ Falha ao deletar médico: ID={medico_id}")
        return result
