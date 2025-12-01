from fastapi import APIRouter
from fastapi.responses import StreamingResponse
import asyncio

from ..services.log_service import LogService
from ..infra.sse import sse_broker

router = APIRouter(tags=["Sistema"])

log_service = LogService()


@router.get("/logs")
async def obter_logs():
    linhas = await log_service.ler_arquivo()
    return {"logs": linhas}


@router.get("/logs/stream")
async def stream_logs():
    async def event_stream():
        queue = sse_broker.add_subscriber()
        try:
            while True:
                msg = await queue.get()
                yield f"data: {msg}\n\n"
        except asyncio.CancelledError:
            pass
        finally:
            sse_broker.remove_subscriber(queue)

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.get("/agenda/stream")
async def stream_agenda():
    async def event_stream():
        queue = sse_broker.add_subscriber()
        try:
            while True:
                msg = await queue.get()
                yield f"data: {msg}\n\n"
        except asyncio.CancelledError:
            pass
        finally:
            sse_broker.remove_subscriber(queue)

    return StreamingResponse(event_stream(), media_type="text/event-stream")
