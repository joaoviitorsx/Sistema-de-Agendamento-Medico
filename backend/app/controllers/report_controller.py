from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from ..services.task_service import TaskService
from ..services.relatorio_service import RelatorioService

router = APIRouter(prefix="/relatorios", tags=["Relatórios"])

task_service = TaskService()
relatorio_service = RelatorioService()


@router.post("/gerar")
async def gerar(payload: dict):
    task_id = task_service.enqueue_relatorio(payload)
    return {"status": "processando", "task_id": task_id}


@router.get("/")
async def listar():
    return {"arquivos": relatorio_service.listar()}


@router.get("/download/{nome}")
async def download(nome: str):
    caminho = relatorio_service.obter_caminho(nome)

    if not caminho.exists():
        raise HTTPException(404, "Arquivo não encontrado")

    return FileResponse(
        caminho,
        media_type="application/pdf",
        filename=nome
    )
