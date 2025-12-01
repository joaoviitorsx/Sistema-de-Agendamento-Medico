from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import datetime
from queue import Queue, Empty
from threading import Event, Thread
from typing import Any, Dict, Literal, Optional
import asyncio

from ..services.event_service import enviar_evento_sse
from ..services.backup_service import BackupService
from ..services.relatorio_service import RelatorioService
from ..services.consulta_service import ConsultaService
from ..schemas.consulta_schema import ConsultaCreate
from ..infra.schedule_state import schedule_state
from ..schemas.task_schema import Task

logger = logging.getLogger("task_queue")

TaskType = Literal["backup", "gerar_relatorio", "agendar_consulta"]

class TaskQueue:
    def __init__(self) -> None:
        self._queue: "Queue[Task]" = Queue()
        self._stop_event = Event()
        self._worker_thread: Optional[Thread] = None

    def start(self) -> None:
        if self._worker_thread and self._worker_thread.is_alive():
            return
        logger.info("Iniciando worker de tarefas")
        self._stop_event.clear()
        self._worker_thread = Thread(target=self._worker_loop, daemon=True)
        self._worker_thread.start()

    def stop(self) -> None:
        logger.info("Parando worker de tarefas")
        self._stop_event.set()
        self._queue.put(Task(id="__shutdown__", tipo="backup"))
        if self._worker_thread:
            self._worker_thread.join(timeout=5)

    def enqueue(self, task: Task) -> None:
        logger.info(f"📥 Enfileirando tarefa: ID={task.id}, Tipo={task.tipo}")
        self._queue.put(task)
        logger.info(f"✅ Tarefa adicionada à fila: ID={task.id}")

    def _worker_loop(self) -> None:
        logger.info("Worker iniciado")
        while not self._stop_event.is_set():
            try:
                task = self._queue.get(timeout=1)
            except Empty:
                continue

            if task.id == "__shutdown__":
                logger.info("Worker recebeu shutdown")
                break

            try:
                asyncio.run(self._process_task(task))
            except Exception as exc:
                logger.exception("Erro ao processar tarefa %s: %s", task.id, exc)

            finally:
                self._queue.task_done()

        logger.info("Worker finalizado")

    async def _process_task(self, task: Task) -> None:
        logger.info(f"⏳ Processando tarefa: ID={task.id}, Tipo={task.tipo}")

        if task.tipo == "backup":
            logger.info(f"💾 Iniciando execução de backup: Motivo={task.payload.get('motivo', 'manual')}")
            BackupService().executar_backup(task.payload.get("motivo", "manual"))
            logger.info("✅ Backup executado com sucesso")

        elif task.tipo == "gerar_relatorio":
            logger.info(f"📄 Iniciando geração de relatório: Filtros={task.payload}")
            caminho = RelatorioService().gerar_relatorio(task.payload)
            logger.info(f"✅ Relatório gerado com sucesso: {caminho}")
            await enviar_evento_sse("relatorio_pronto", {"arquivo": caminho})

        elif task.tipo == "agendar_consulta":
            dados = task.payload
            slot_key = f"{dados['medico_id']}:{dados['inicio']}"
            slot_iso = dados.get("inicio")
            logger.info(f"📅 Iniciando agendamento de consulta: Médico={dados['medico_id']}, Paciente={dados.get('paciente_id')}, Slot={slot_iso}")
            try:
                logger.info(f"📝 Validando e criando consulta com payload: {dados}")
                consulta = await ConsultaService().criar_consulta(ConsultaCreate(**dados))
                logger.info(f"✅ Consulta criada com sucesso: ID={consulta.id}")
                schedule_state.set_status(slot_key, "ocupado")
                logger.info(f"🔒 Slot marcado como ocupado: {slot_key}")
                await enviar_evento_sse("horario_ocupado", 
                {
                    "slot": slot_iso,
                    "consulta": consulta.id,
                    "medico_id": dados["medico_id"]
                })
                logger.info(f"📡 Evento SSE enviado: horario_ocupado para slot {slot_iso}")
            except Exception as exc:
                logger.error(f"❌ Erro ao agendar consulta: {exc}", exc_info=True)
                schedule_state.set_status(slot_key, "disponivel")
                logger.info(f"🔓 Slot liberado após erro: {slot_key}")
                await enviar_evento_sse("horario_disponivel", 
                {
                    "slot": slot_iso,
                    "medico_id": dados["medico_id"]
                })
                logger.error("Erro ao agendar consulta via fila: %s", exc)


task_queue = TaskQueue()
