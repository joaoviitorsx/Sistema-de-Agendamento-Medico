import asyncio
from typing import List

# Broker simples para gerenciar assinantes SSE.
# Controllers adicionam filas;
# Services enviam eventos para todos assinantes.
class SSEBroker:

    def __init__(self):
        self.subscribers: List[asyncio.Queue] = []

    def add_subscriber(self) -> asyncio.Queue:
        queue = asyncio.Queue()
        self.subscribers.append(queue)
        return queue

    def remove_subscriber(self, queue: asyncio.Queue):
        if queue in self.subscribers:
            self.subscribers.remove(queue)

    async def publish(self, message: str):
        # envia para todos assinantes conectados
        for queue in list(self.subscribers):
            await queue.put(message)


# Singleton global
sse_broker = SSEBroker()
