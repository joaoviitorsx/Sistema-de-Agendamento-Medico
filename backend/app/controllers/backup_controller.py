from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path

from ..services.task_service import TaskService
from ..services.backup_service import BackupService

router = APIRouter(prefix="/backup", tags=["Backup"])

task_service = TaskService()
backup_service = BackupService()


@router.post("/executar")
async def executar_backup():
    """
    Envia para a fila um backup manual.
    """
    task_id = task_service.enqueue_backup("manual")
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
    caminho: Path = backup_service.caminho_backup(nome)

    if not caminho.exists():
        raise HTTPException(
            status_code=404, detail="Arquivo de backup não encontrado"
        )

    return FileResponse(
        caminho,
        filename=nome,
        media_type="application/zip"
    )
