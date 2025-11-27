from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from ..schemas.paciente_schema import PacienteCreate, PacienteOut, PacienteUpdate
from ..services.paciente_service import PacienteService

router = APIRouter()


def get_paciente_service() -> PacienteService:
    # ponto único para injeção de dependência (poderia ser mais elaborado depois)
    return PacienteService()


@router.get("/paciente", response_model=List[PacienteOut])
async def listar_pacientes(service: PacienteService = Depends(get_paciente_service)):
    pacientes = await service.listar_pacientes()
    return pacientes  # Pydantic converte a partir do dataclass


@router.get("/paciente/{paciente_id}", response_model=PacienteOut)
async def obter_paciente( paciente_id: str, service: PacienteService = Depends(get_paciente_service)):
    paciente = await service.obter_paciente(paciente_id)
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    return paciente


@router.post("/paciente/create", response_model=PacienteOut, status_code=status.HTTP_201_CREATED)
async def criar_paciente(
    payload: PacienteCreate, service: PacienteService = Depends(get_paciente_service)
):
    return await service.criar_paciente(payload)


@router.put("/{paciente_id}", response_model=PacienteOut)
async def atualizar_paciente( paciente_id: str, payload: PacienteUpdate, service: PacienteService = Depends(get_paciente_service),):
    paciente = await service.atualizar_paciente(paciente_id, payload)
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    return paciente


@router.delete("/{paciente_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_paciente( paciente_id: str, service: PacienteService = Depends(get_paciente_service)):
    ok = await service.deletar_paciente(paciente_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
