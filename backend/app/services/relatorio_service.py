from fpdf import FPDF # type: ignore
from datetime import datetime
from pathlib import Path
from ..core.config import settings
from ..repositories.consulta_repository import ConsultaRepository
from ..repositories.medico_repository import MedicoRepository
import logging
import os

logger = logging.getLogger("relatorio_service")


class PDFRelatorio(FPDF):
    def header(self):
        self.set_font("Arial", "B", 16)
        self.set_text_color(30, 30, 30)
        self.cell(0, 10, "Relatório de Consultas Médicas", ln=True, align="C")
        self.ln(2)
        self.set_draw_color(200, 0, 0)
        self.line(10, 22, 200, 22)
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", "I", 10)
        self.set_text_color(100, 100, 100)
        self.cell(
            0,
            10,
            f"Gerado em {datetime.utcnow().strftime('%d/%m/%Y %H:%M:%S')} | Página {self.page_no()}",
            align="C",
        )

    def add_consulta_row(self, consulta):
        self.set_font("Arial", "", 12)

        inicio = consulta.inicio.strftime("%d/%m/%Y %H:%M")
        fim = consulta.fim.strftime("%d/%m/%Y %H:%M")

        self.cell(40, 8, inicio)
        self.cell(40, 8, fim)
        self.cell(40, 8, str(consulta.medico_id))
        self.cell(60, 8, str(consulta.paciente_id))
        self.ln(8)


class RelatorioService:
    def __init__(self):
        self.reports_dir = settings.reports_dir
        os.makedirs(self.reports_dir, exist_ok=True)

    def gerar_relatorio(self, filtros: dict) -> str:
        repo = ConsultaRepository()
        medico_repo = MedicoRepository()
        consultas = repo.list_all()

        medico_id = filtros.get("medico_id")
        periodo_inicio = filtros.get("periodo_inicio")
        periodo_fim = filtros.get("periodo_fim")

        medico_nome = "Todos"
        if medico_id:
            consultas = [c for c in consultas if c.medico_id == medico_id]
            medico = medico_repo.get_by_id(medico_id)
            if medico:
                medico_nome = medico.nome

        if periodo_inicio and periodo_fim:
            try:
                dt_inicio = datetime.fromisoformat(periodo_inicio)
                dt_fim = datetime.fromisoformat(periodo_fim)
                consultas = [c for c in consultas if c.inicio >= dt_inicio and c.fim <= dt_fim]
            except Exception as e:
                logger.warning(f"Período inválido: {e}")

        pdf = PDFRelatorio()
        pdf.add_page()

        # Cabeçalho customizado
        pdf.set_font("Arial", "B", 14)
        pdf.cell(0, 10, f"Médico: {medico_nome}", ln=True)
        if periodo_inicio and periodo_fim:
            pdf.set_font("Arial", "", 12)
            pdf.cell(0, 8, f"Período: {periodo_inicio[:10]} até {periodo_fim[:10]}", ln=True)
        pdf.ln(4)

        # Cabeçalho da tabela
        pdf.set_font("Arial", "B", 12)
        pdf.set_fill_color(230, 230, 230)
        pdf.cell(40, 10, "Início", fill=True)
        pdf.cell(40, 10, "Fim", fill=True)
        pdf.cell(60, 10, "Paciente", fill=True)
        pdf.cell(40, 10, "Status", fill=True)
        pdf.ln(12)

        # Linhas da tabela
        for c in consultas:
            pdf.set_font("Arial", "", 12)
            inicio = c.inicio.strftime("%d/%m/%Y %H:%M")
            fim = c.fim.strftime("%d/%m/%Y %H:%M")
            pdf.cell(40, 8, inicio)
            pdf.cell(40, 8, fim)
            pdf.cell(60, 8, str(c.paciente_id))
            pdf.cell(40, 8, c.status)
            pdf.ln(8)

        destino = self.reports_dir / f"relatorio_{datetime.utcnow().timestamp()}.pdf"
        pdf.output(str(destino))

        logger.info(f"Relatório criado em {destino}")

        return str(destino)

    def listar(self):
        return [
            f.name for f in self.reports_dir.iterdir()
            if f.suffix == ".pdf"
        ]

    def obter_caminho(self, nome: str) -> Path:
        return self.reports_dir / nome
