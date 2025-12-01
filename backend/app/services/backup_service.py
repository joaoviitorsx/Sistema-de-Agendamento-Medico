import shutil
from datetime import datetime
from pathlib import Path
from ..core.config import settings
import logging

logger = logging.getLogger("backup_service")


class BackupService:
    def __init__(self):
        self.backup_dir = settings.BASE_DIR / "backups"
        self.backup_dir.mkdir(exist_ok=True, parents=True)

    def executar_backup(self, motivo: str = "automatico"):
        """Cria um backup ZIP de todos os arquivos JSON do banco de dados"""
        origem = settings.data_dir
        destino_dir = self.backup_dir

        timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
        nome_base = f"backup_{timestamp}"
        arquivo_zip = destino_dir / f"{nome_base}.zip"

        # Cria o arquivo ZIP diretamente do diretório banco
        shutil.make_archive(
            base_name=str(destino_dir / nome_base),
            format="zip",
            root_dir=str(origem.parent),  # Pasta pai do banco
            base_dir=origem.name,  # Nome da pasta 'banco'
        )

        logger.info("Backup criado: %s (motivo: %s)", arquivo_zip, motivo)
        return str(arquivo_zip)
    
    def listar(self):
        """Lista todos os arquivos de backup (.zip)"""
        return [f.name for f in self.backup_dir.iterdir() if f.suffix == ".zip"]
    
    def caminho_backup(self, nome: str) -> Path:
        """Retorna o caminho completo de um arquivo de backup"""
        return self.backup_dir / nome
