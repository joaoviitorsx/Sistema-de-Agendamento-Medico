from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from ..services.task_service import TaskService
from ..services.relatorio_service import RelatorioService
import logging

logger = logging.getLogger("report_controller")

router = APIRouter(tags=["Relatórios"])

task_service = TaskService()
relatorio_service = RelatorioService()


@router.post("/gerar")
async def gerar(payload: dict):
    # Espera: { medico_id: str, periodo_inicio: str, periodo_fim: str }
    logger.info(f"📄 Recebida solicitação de geração de relatório: Médico={payload.get('medico_id', 'Todos')}, Período={payload.get('periodo_inicio')} até {payload.get('periodo_fim')}")
    task_id = task_service.enqueue_relatorio(payload)
    logger.info(f"✅ Relatório enfileirado para geração: task_id={task_id}")
    return {"status": "processando", "task_id": task_id}


@router.get("/")
async def listar():
    logger.info("📋 Listando relatórios disponíveis")
    arquivos = relatorio_service.listar()
    logger.info(f"✅ {len(arquivos)} relatórios encontrados")
    return {"arquivos": arquivos}


@router.get("/download/{nome}")
async def download(nome: str):
    logger.info(f"📥 Solicitação de download de relatório: {nome}")
    caminho = relatorio_service.obter_caminho(nome)

    if not caminho.exists():
        logger.warning(f"❌ Relatório não encontrado: {nome}")
        raise HTTPException(404, "Arquivo não encontrado")

    logger.info(f"✅ Enviando relatório para download: {nome} ({caminho.stat().st_size} bytes)")
    return FileResponse(
        caminho,
        media_type="application/pdf",
        filename=nome
    )
