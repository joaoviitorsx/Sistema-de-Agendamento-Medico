from uuid import uuid4
from typing import Any, Dict
from ..infra.task_queue import Task, task_queue, TaskType
import logging

logger = logging.getLogger("task_service")


class TaskService:
    def enqueue_task(self, tipo: TaskType, payload: Dict[str, Any]) -> str:
        task_id = str(uuid4())
        logger.info(f"🎫 Gerando nova tarefa: ID={task_id}, Tipo={tipo}")
        task = Task(id=task_id, tipo=tipo, payload=payload)
        task_queue.enqueue(task)
        logger.info(f"✅ Tarefa criada e enfileirada: ID={task_id}")
        return task_id

    def enqueue_backup(self, motivo: str) -> str:
        logger.info(f"💾 Solicitando backup: Motivo={motivo}")
        return self.enqueue_task("backup", {"motivo": motivo})

    def enqueue_relatorio(self, filtros: Dict[str, Any]) -> str:
        logger.info(f"📄 Solicitando geração de relatório: Filtros={filtros}")
        return self.enqueue_task("gerar_relatorio", filtros)

    def enqueue_agendamento_consulta(self, dados: Dict[str, Any]) -> str:
        logger.info(f"📅 Solicitando agendamento de consulta: Médico={dados.get('medico_id')}, Início={dados.get('inicio')}")
        return self.enqueue_task("agendar_consulta", dados)
