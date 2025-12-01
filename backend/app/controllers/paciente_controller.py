from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
import logging

from ..schemas.paciente_schema import PacienteCreate, PacienteOut, PacienteUpdate
from ..services.paciente_service import PacienteService

logger = logging.getLogger("paciente_controller")

router = APIRouter()


def get_paciente_service() -> PacienteService:
    # ponto único para injeção de dependência (poderia ser mais elaborado depois)
    return PacienteService()


@router.get("/", response_model=List[PacienteOut])
async def listar_pacientes(service: PacienteService = Depends(get_paciente_service)):
    logger.info("👥 Listando todos os pacientes")
    pacientes = await service.listar_pacientes()
    logger.info(f"✅ {len(pacientes)} pacientes encontrados")
    return pacientes  # Pydantic converte a partir do dataclass


@router.get("/{paciente_id}", response_model=PacienteOut)
async def obter_paciente(paciente_id: str, service: PacienteService = Depends(get_paciente_service)):
    paciente = await service.obter_paciente(paciente_id)
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    return paciente


@router.post("/", response_model=PacienteOut, status_code=status.HTTP_201_CREATED)
async def criar_paciente(payload: PacienteCreate, service: PacienteService = Depends(get_paciente_service)):
    logger.info(f"➕ Criando novo paciente: Nome={payload.nome}, CPF={payload.cpf}")
    result = await service.criar_paciente(payload)
    logger.info(f"✅ Paciente criado com sucesso: ID={result.id}")
    return result


@router.put("/{paciente_id}", response_model=PacienteOut)
async def atualizar_paciente( paciente_id: str, payload: PacienteUpdate, service: PacienteService = Depends(get_paciente_service),):
    paciente = await service.atualizar_paciente(paciente_id, payload)
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    return paciente


@router.delete("/{paciente_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_paciente( paciente_id: str, service: PacienteService = Depends(get_paciente_service)):
    logger.info(f"🗑️ Deletando paciente: ID={paciente_id}")
    ok = await service.deletar_paciente(paciente_id)
    if not ok:
        logger.warning(f"❌ Paciente não encontrado para deletar: ID={paciente_id}")
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    logger.info(f"✅ Paciente deletado com sucesso: ID={paciente_id}")
