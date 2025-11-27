from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from ..schemas.consulta_schema import ConsultaCreate, ConsultaOut, ConsultaUpdate
from ..services.consulta_service import ConsultaService
from ..services.task_service import TaskService
from ..infra.schedule_state import schedule_state

router = APIRouter()


def get_service() -> ConsultaService:
    return ConsultaService()

#crudzin dos manos
@router.get("/", response_model=List[ConsultaOut])
async def listar_consultas(service: ConsultaService = Depends(get_service)):
    return await service.listar_consultas()


@router.get("/{consulta_id}", response_model=ConsultaOut)
async def obter_consulta(consulta_id: str, service: ConsultaService = Depends(get_service)):
    consulta = await service.obter_consulta(consulta_id)
    if not consulta:
        raise HTTPException(status_code=404, detail="Consulta não encontrada")
    return consulta


@router.post("/", response_model=ConsultaOut, status_code=status.HTTP_201_CREATED)
async def criar_consulta(payload: ConsultaCreate, service: ConsultaService = Depends(get_service)):
    try:
        return await service.criar_consulta(payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{consulta_id}", response_model=ConsultaOut)
async def atualizar_consulta( consulta_id: str, payload: ConsultaUpdate, service: ConsultaService = Depends(get_service)):
    try:
        consulta = await service.atualizar_consulta(consulta_id, payload)
        if not consulta:
            raise HTTPException(status_code=404, detail="Consulta não encontrada")
        return consulta
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{consulta_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_consulta(consulta_id: str, service: ConsultaService = Depends(get_service)):
    ok = await service.deletar_consulta(consulta_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Consulta não encontrada")


# 
# Este endpoint NÃO agenda diretamente.
# Ele:
# 1. Verifica se o horário está disponível
# 2. Marca como "reservado"
# 3. Enfileira a tarefa para o worker processar o agendamento real
# 4. Retorna imediatamente para o frontend
# 

@router.post("/agendar")
async def agendar_async(payload: ConsultaCreate):
    slot_key = f"{payload.medico_id}:{payload.inicio.isoformat()}"

    # Se reservado ou ocupado → erro
    if schedule_state.get_status(slot_key) != "disponivel":
        raise HTTPException(409, detail="Horário reservado ou ocupado.")

    # Marcar como reservado (bloquear para os outros)
    schedule_state.set_status(slot_key, "reservado")

    # Enfileirar a tarefa
    task_id = TaskService().enqueue_agendamento_consulta(payload.dict())

    return {
        "status": "pendente",
        "task_id": task_id,
        "slot": slot_key,
        "mensagem": "Consulta em processamento."
    }
