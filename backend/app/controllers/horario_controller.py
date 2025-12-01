from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from ..schemas.horario_schema import HorarioCreate, HorarioUpdate, HorarioOut
from ..services.horario_service import HorarioService

router = APIRouter()

def get_service() -> HorarioService:
	return HorarioService()

# Listar todos os horários
@router.get("/", response_model=List[HorarioOut])
async def listar_horarios(service: HorarioService = Depends(get_service)):
	return await service.listar_todos_horarios()

# Listar todos os horários de um médico
@router.get("/medico/{medico_id}", response_model=List[HorarioOut])
async def listar_horarios_medico(medico_id: str, service: HorarioService = Depends(get_service)):
	return await service.listar_horarios_medico(medico_id)

# Obter um horário específico
@router.get("/{horario_id}", response_model=HorarioOut)
async def obter_horario(horario_id: str, service: HorarioService = Depends(get_service)):
	horario = await service.obter_horario(horario_id)
	if not horario:
		raise HTTPException(status_code=404, detail="Horário não encontrado")
	return horario

# Criar um novo horário para um médico
@router.post("/medico/{medico_id}", response_model=HorarioOut, status_code=status.HTTP_201_CREATED)
async def criar_horario(medico_id: str, payload: HorarioCreate, service: HorarioService = Depends(get_service)):
	return await service.criar_horario(medico_id, payload)

# Atualizar um horário
@router.put("/{horario_id}", response_model=HorarioOut)
async def atualizar_horario(horario_id: str, payload: HorarioUpdate, service: HorarioService = Depends(get_service)):
	horario = await service.atualizar_horario(horario_id, payload)
	if not horario:
		raise HTTPException(status_code=404, detail="Horário não encontrado")
	return horario

# Deletar um horário
@router.delete("/{horario_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_horario(horario_id: str, service: HorarioService = Depends(get_service)):
	ok = await service.deletar_horario(horario_id)
	if not ok:
		raise HTTPException(status_code=404, detail="Horário não encontrado")
