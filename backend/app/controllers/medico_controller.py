from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
import logging

from ..schemas.medico_schema import MedicoCreate, MedicoUpdate, MedicoOut
from ..services.medico_service import MedicoService

logger = logging.getLogger("medico_controller")

router = APIRouter()


def get_service() -> MedicoService:
    return MedicoService()


@router.get("/", response_model=List[MedicoOut])
async def listar_medicos(service: MedicoService = Depends(get_service)):
    logger.info("👨‍⚕️ Listando todos os médicos")
    result = await service.listar_medicos()
    logger.info(f"✅ {len(result)} médicos encontrados")
    return result


@router.get("/{medico_id}", response_model=MedicoOut)
async def obter_medico(medico_id: str, service: MedicoService = Depends(get_service)):
    medico = await service.obter_medico(medico_id)
    if not medico:
        raise HTTPException(status_code=404, detail="Médico não encontrado")
    return medico


@router.post("/", response_model=MedicoOut, status_code=status.HTTP_201_CREATED)
async def criar_medico(payload: MedicoCreate, service: MedicoService = Depends(get_service)):
    logger.info(f"➕ Criando novo médico: Nome={payload.nome}, CRM={payload.crm}, Especialidade={payload.especialidade}")
    result = await service.criar_medico(payload)
    logger.info(f"✅ Médico criado com sucesso: ID={result.id}")
    return result


@router.put("/{medico_id}", response_model=MedicoOut)
async def atualizar_medico(medico_id: str, payload: MedicoUpdate, service: MedicoService = Depends(get_service)):
    medico = await service.atualizar_medico(medico_id, payload)
    if not medico:
        raise HTTPException(status_code=404, detail="Médico não encontrado")
    return medico


@router.delete("/{medico_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_medico( medico_id: str, service: MedicoService = Depends(get_service)):
    logger.info(f"🗑️ Deletando médico: ID={medico_id}")
    ok = await service.deletar_medico(medico_id)
    if not ok:
        logger.warning(f"❌ Médico não encontrado para deletar: ID={medico_id}")
        raise HTTPException(status_code=404, detail="Médico não encontrado")
    logger.info(f"✅ Médico deletado com sucesso: ID={medico_id}")
