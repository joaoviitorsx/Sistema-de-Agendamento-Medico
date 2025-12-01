from fastapi import APIRouter, HTTPException, status
from datetime import date, datetime, timedelta
from typing import Dict
import logging

from ..repositories.horario_repository import HorarioRepository
from ..repositories.consulta_repository import ConsultaRepository
from ..infra.schedule_state import schedule_state
from ..services.event_service import enviar_evento_sse

router = APIRouter(tags=["Agenda"])
logger = logging.getLogger("agenda_controller")

# mapeamento simples de nomes para weekday()
_DIA_MAP = {
    "segunda": 0,
    "terca": 1,
    "quarta": 2,
    "quinta": 3,
    "sexta": 4,
    "sabado": 5,
    "domingo": 6,
}


def _next_days(n: int = 7):
    today = date.today()
    for i in range(n):
        yield today + timedelta(days=i)


@router.get("/slots")
async def listar_slots(days: int = 7):
    """Retorna um mapeamento de slots por `medico_id`.

    Estrutura: { medico_id: { slot_iso: status } }
    Gera slots para os próximos `days` dias com base nos `horarios` do médico.
    """
    logger.info(f"📅 Listando slots para os próximos {days} dias")
    hr_repo = HorarioRepository()
    c_repo = ConsultaRepository()

    medicos_horarios = {}
    # carrega todas consultas para identificar ocupados
    consultas = c_repo.list_all()

    for h in hr_repo.list_all():
        medicos_horarios.setdefault(h.medico_id, []).append(h)

    result: Dict[str, Dict[str, str]] = {}

    for medico_id, horarios in medicos_horarios.items():
        slots: Dict[str, str] = {}
        # para cada dia no range
        for d in _next_days(days):
            wd = d.weekday()
            # para cada horario do medico
            for h in horarios:
                target_wd = _DIA_MAP.get(h.dia_semana.lower())
                if target_wd is None:
                    continue
                if target_wd != wd:
                    continue

                # Gera slots de 30 em 30 minutos entre hora_inicio e hora_fim
                try:
                    # Parse hora_inicio e hora_fim (formato HH:MM)
                    hora_ini_parts = h.hora_inicio.split(":")
                    hora_fim_parts = h.hora_fim.split(":")
                    
                    hora_ini = int(hora_ini_parts[0])
                    min_ini = int(hora_ini_parts[1])
                    hora_fim = int(hora_fim_parts[0])
                    min_fim = int(hora_fim_parts[1])
                    
                    # Cria datetime inicial
                    current = datetime(d.year, d.month, d.day, hora_ini, min_ini)
                    fim_datetime = datetime(d.year, d.month, d.day, hora_fim, min_fim)
                    
                    # Gera slots de 30 em 30 minutos
                    while current < fim_datetime:
                        slot_iso = current.isoformat()
                        key = f"{medico_id}:{slot_iso}"

                        # estado inicial: verificar state, depois consultas
                        estado = schedule_state.get_status(key)

                        # se ainda disponível, verificar consultas já gravadas
                        if estado == "disponivel":
                            # marca como ocupado se existir consulta com mesmo medico e início
                            for c in consultas:
                                if c.medico_id == medico_id and c.inicio.isoformat() == slot_iso and c.status == "agendada":
                                    estado = "ocupado"
                                    break

                        slots[slot_iso] = estado
                        
                        # Avança 30 minutos
                        current = current + timedelta(minutes=30)
                        
                except Exception as e:
                    # fallback: ignore horário inválido
                    logger.warning(f"Erro ao processar horário {h.hora_inicio}-{h.hora_fim}: {e}")
                    continue

        result[medico_id] = slots

    total_slots = sum(len(slots) for slots in result.values())
    logger.info(f"✅ Gerados {total_slots} slots para {len(result)} médicos")
    return result


@router.post("/reservar")
async def reservar_slot(payload: dict):
    """Reserva (bloqueia) um slot para um médico.

    Payload: { medico_id: str, slot: str (ISO datetime) }
    """
    medico_id = payload.get("medico_id")
    slot = payload.get("slot")
    logger.info(f"🔒 Tentando reservar slot: médico={medico_id}, horário={slot}")
    if not medico_id or not slot:
        logger.error(f"❌ Reserva falhou: dados incompletos (medico_id={medico_id}, slot={slot})")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="medico_id e slot são obrigatórios")

    key = f"{medico_id}:{slot}"
    if schedule_state.get_status(key) != "disponivel":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Horário reservado ou ocupado")

    schedule_state.set_status(key, "reservado")

    # publica evento SSE para notificar subscribers (slot sem prefixo)
    await enviar_evento_sse("horario_reservado", {"slot": slot, "medico_id": medico_id})
    logger.info(f"✅ Slot reservado com sucesso: {slot} - Médico: {medico_id}")

    return {"status": "reservado", "slot": slot, "medico_id": medico_id}


@router.post("/liberar")
async def liberar_slot(payload: dict):
    """Libera um slot reservado, tornando-o disponível novamente.

    Payload: { medico_id: str, slot: str (ISO datetime) }
    """
    medico_id = payload.get("medico_id")
    slot = payload.get("slot")
    logger.info(f"🔓 Tentando liberar slot: médico={medico_id}, horário={slot}")
    if not medico_id or not slot:
        logger.error(f"❌ Liberação falhou: dados incompletos")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="medico_id e slot são obrigatórios")

    key = f"{medico_id}:{slot}"
    current_status = schedule_state.get_status(key)
    
    # Só libera se estiver reservado (não libera se já está ocupado com consulta confirmada)
    if current_status == "reservado":
        schedule_state.set_status(key, "disponivel")
        # publica evento SSE para notificar subscribers
        await enviar_evento_sse("horario_liberado", {"slot": slot, "medico_id": medico_id})
        logger.info(f"✅ Slot liberado com sucesso: {slot}")
        return {"status": "liberado", "slot": slot, "medico_id": medico_id}
    elif current_status == "ocupado":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Horário já está ocupado com consulta confirmada")
    else:
        # Já está disponível, retorna sucesso
        return {"status": "disponivel", "slot": slot, "medico_id": medico_id}

