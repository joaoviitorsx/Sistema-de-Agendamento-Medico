import json
import logging
from ..infra.sse import sse_broker

logger = logging.getLogger("event_service")

async def enviar_evento_sse(tipo: str, dados: dict):
    msg = json.dumps({"tipo": tipo, "dados": dados})
    logger.info(f"📡 Enviando evento SSE: tipo={tipo}, dados={dados}")
    await sse_broker.publish(msg)
    logger.info(f"✅ Evento SSE enviado com sucesso: {msg}")