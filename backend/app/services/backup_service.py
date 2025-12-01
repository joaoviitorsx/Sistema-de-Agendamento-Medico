import shutil
from datetime import datetime
from pathlib import Path
from ..core.config import settings
import logging

logger = logging.getLogger("backup_service")


class BackupService:
    def __init__(self):
        self.backup_dir = settings.BASE_DIR / "backups"
        self.backup_dir.mkdir(exist_ok=True)

    def executar_backup(self, motivo: str = "automatico"):
        origem = settings.data_dir
        destino_dir = self.backup_dir

        nome = f"backup_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.zip"
        destino = destino_dir / nome

        shutil.make_archive(
            base_name=str(destino.with_suffix("")),
            format="zip",
            root_dir=origem,
        )

        logger.info("Backup criado: %s (motivo: %s)", destino, motivo)
        return str(destino)
    
    def listar(self):
        """Lista todos os arquivos de backup (.zip)"""
        return [f.name for f in self.backup_dir.iterdir() if f.suffix == ".zip"]
    
    def caminho_backup(self, nome: str) -> Path:
        """Retorna o caminho completo de um arquivo de backup"""
        return self.backup_dir / nome
