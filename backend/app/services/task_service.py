from uuid import uuid4
from typing import Any, Dict
from ..infra.task_queue import Task, task_queue, TaskType
import logging

logger = logging.getLogger("task_service")


class TaskService:
    def enqueue_task(self, tipo: TaskType, payload: Dict[str, Any]) -> str:
        task_id = str(uuid4())
        task = Task(id=task_id, tipo=tipo, payload=payload)
        task_queue.enqueue(task)
        return task_id

    def enqueue_backup(self, motivo: str) -> str:
        return self.enqueue_task("backup", {"motivo": motivo})

    def enqueue_relatorio(self, filtros: Dict[str, Any]) -> str:
        return self.enqueue_task("gerar_relatorio", filtros)

    def enqueue_agendamento_consulta(self, dados: Dict[str, Any]) -> str:
        logger.info("Enfileirando agendamento: %s", dados)
        return self.enqueue_task("agendar_consulta", dados)
