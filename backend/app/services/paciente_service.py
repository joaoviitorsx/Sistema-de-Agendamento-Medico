import asyncio
import logging
from datetime import datetime
from typing import List, Optional
from uuid import uuid4

from ..models.paciente_model import Paciente
from ..repositories.paciente_repository import PacienteRepository
from ..schemas.paciente_schema import PacienteCreate, PacienteUpdate

logger = logging.getLogger("paciente_service")


class PacienteService:
    def __init__(self, repository: Optional[PacienteRepository] = None) -> None:
        self.repository = repository or PacienteRepository()

    async def listar_pacientes(self) -> List[Paciente]:
        logger.info("Listando pacientes")
        return await asyncio.to_thread(self.repository.list_all)

    async def obter_paciente(self, paciente_id: str) -> Optional[Paciente]:
        logger.info("Obtendo paciente %s", paciente_id)
        return await asyncio.to_thread(self.repository.get_by_id, paciente_id)

    async def criar_paciente(self, payload: PacienteCreate) -> Paciente:
        now = datetime.utcnow()
        
        # Gera ID auto-incremental
        pacientes_existentes = await asyncio.to_thread(self.repository.list_all)
        max_id = 0
        for p in pacientes_existentes:
            try:
                pid = int(p.id)
                if pid > max_id:
                    max_id = pid
            except ValueError:
                continue
        novo_id = str(max_id + 1)
        
        paciente = Paciente(
            id=novo_id,
            nome=payload.nome,
            cpf=payload.cpf,
            data_nascimento=payload.data_nascimento,
            email=payload.email,
            telefone=payload.telefone,
            created_at=now,
            updated_at=now,
        )
        logger.info("Criando paciente %s (%s)", paciente.nome, paciente.id)
        return await asyncio.to_thread(self.repository.save, paciente)

    async def atualizar_paciente(
        self, paciente_id: str, payload: PacienteUpdate
    ) -> Optional[Paciente]:
        logger.info("Atualizando paciente %s", paciente_id)
        existente = await asyncio.to_thread(self.repository.get_by_id, paciente_id)
        if not existente:
            logger.warning("Paciente %s não encontrado para atualização", paciente_id)
            return None

        # atualiza apenas campos enviados
        if payload.nome is not None:
            existente.nome = payload.nome
        if payload.email is not None:
            existente.email = payload.email
        if payload.telefone is not None:
            existente.telefone = payload.telefone

        existente.updated_at = datetime.utcnow()
        return await asyncio.to_thread(self.repository.save, existente)

    async def deletar_paciente(self, paciente_id: str) -> bool:
        logger.info("Deletando paciente %s", paciente_id)
        return await asyncio.to_thread(self.repository.delete, paciente_id)