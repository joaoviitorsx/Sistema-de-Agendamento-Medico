from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
import logging

from ..services.task_service import TaskService
from ..services.backup_service import BackupService

router = APIRouter(tags=["Backup"])
logger = logging.getLogger("backup_controller")

task_service = TaskService()
backup_service = BackupService()


@router.post("/executar")
async def executar_backup():
    """
    Envia para a fila um backup manual.
    """
    logger.info("💾 Solicitação de backup manual recebida")
    task_id = task_service.enqueue_backup("manual")
    logger.info(f"✅ Backup enfileirado - Task ID: {task_id}")
    return {"status": "enfileirado", "task_id": task_id}


@router.get("/")
async def listar_backups():
    """
    Retorna a lista de arquivos de backup (.zip)
    """
    return {"arquivos": backup_service.listar()}


@router.get("/download/{nome}")
async def download_backup(nome: str):
    """
    Permite baixar um backup
    """
    logger.info(f"📥 Solicitação de download do backup: {nome}")
    caminho: Path = backup_service.caminho_backup(nome)

    if not caminho.exists():
        logger.error(f"❌ Backup não encontrado: {nome}")
        raise HTTPException(
            status_code=404, detail="Arquivo de backup não encontrado"
        )

    logger.info(f"✅ Download iniciado: {nome} ({caminho.stat().st_size} bytes)")
    return FileResponse(
        caminho,
        filename=nome,
        media_type="application/zip"
    )
