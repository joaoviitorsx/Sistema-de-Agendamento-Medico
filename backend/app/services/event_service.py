import json
from ..infra.sse import sse_broker

async def enviar_evento_sse(tipo: str, dados: dict):
    msg = json.dumps({"tipo": tipo, "dados": dados})
    await sse_broker.publish(msg)