import asyncio
import logging
from datetime import datetime
from typing import List, Optional
from uuid import uuid4

from ..models.consulta_model import Consulta
from ..repositories.consulta_repository import ConsultaRepository
from ..repositories.paciente_repository import PacienteRepository
from ..repositories.medico_repository import MedicoRepository
from ..schemas.consulta_schema import ConsultaCreate, ConsultaUpdate

logger = logging.getLogger("consulta_service")


class ConsultaService:
    def __init__(
        self,
        repo: Optional[ConsultaRepository] = None,
        paciente_repo: Optional[PacienteRepository] = None,
        medico_repo: Optional[MedicoRepository] = None,
    ):
        self.repo = repo or ConsultaRepository()
        self.paciente_repo = paciente_repo or PacienteRepository()
        self.medico_repo = medico_repo or MedicoRepository()

    # LISTAR / OBTER
    async def listar_consultas(self) -> List[Consulta]:
        logger.info("Listando consultas")
        return await asyncio.to_thread(self.repo.list_all)

    async def obter_consulta(self, consulta_id: str) -> Optional[Consulta]:
        logger.info("Consultando consulta %s", consulta_id)
        return await asyncio.to_thread(self.repo.get_by_id, consulta_id)

    # CRUD
    async def criar_consulta(self, payload: ConsultaCreate) -> Consulta:
        # valida existencia dos IDs
        paciente = await asyncio.to_thread(self.paciente_repo.get_by_id, payload.paciente_id)
        if not paciente:
            raise ValueError("Paciente não encontrado")

        medico = await asyncio.to_thread(self.medico_repo.get_by_id, payload.medico_id)
        if not medico:
            raise ValueError("Médico não encontrado")

        if payload.inicio >= payload.fim:
            raise ValueError("Horário inválido: início deve ser antes do fim.")

        # validar conflito
        await self._validar_conflito(payload.medico_id, payload.inicio, payload.fim)

        now = datetime.utcnow()
        consulta = Consulta(
            id=str(uuid4()),
            paciente_id=payload.paciente_id,
            medico_id=payload.medico_id,
            inicio=payload.inicio,
            fim=payload.fim,
            status="agendada",
            observacoes=payload.observacoes,
            created_at=now,
            updated_at=now,
        )

        logger.info("Criando consulta %s para médico %s", consulta.id, consulta.medico_id)
        return await asyncio.to_thread(self.repo.save, consulta)

    async def atualizar_consulta(self, consulta_id: str, payload: ConsultaUpdate) -> Optional[Consulta]:
        consulta = await asyncio.to_thread(self.repo.get_by_id, consulta_id)
        if not consulta:
            return None

        inicio = payload.inicio or consulta.inicio
        fim = payload.fim or consulta.fim

        if inicio >= fim:
            raise ValueError("Horário inválido: início deve ser antes do fim.")

        # validar conflito caso o horário mudou
        await self._validar_conflito(consulta.medico_id, inicio, fim, ignore_id=consulta_id)

        if payload.status is not None:
            consulta.status = payload.status
        if payload.observacoes is not None:
            consulta.observacoes = payload.observacoes

        consulta.inicio = inicio
        consulta.fim = fim
        consulta.updated_at = datetime.utcnow()

        logger.info("Atualizando consulta %s", consulta_id)
        return await asyncio.to_thread(self.repo.save, consulta)

    async def deletar_consulta(self, consulta_id: str) -> bool:
        logger.info("Deletando consulta %s", consulta_id)
        return await asyncio.to_thread(self.repo.delete, consulta_id)

    # LÓGICA DE CONFLITO
    async def _validar_conflito(
        self,
        medico_id: str,
        inicio: datetime,
        fim: datetime,
        ignore_id: Optional[str] = None,
    ):
        consultas = await asyncio.to_thread(self.repo.list_all)

        for c in consultas:
            # ignorar a própria consulta ao editar
            if ignore_id and c.id == ignore_id:
                continue

            if c.medico_id != medico_id:
                continue

            # Checagem de sobreposição
            if inicio < c.fim and fim > c.inicio:
                raise ValueError(
                    f"Conflito de agenda: Médico já possui consulta entre "
                    f"{c.inicio} e {c.fim}"
                )
