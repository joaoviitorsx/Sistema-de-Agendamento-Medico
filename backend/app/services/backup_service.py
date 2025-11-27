import shutil
from datetime import datetime
from pathlib import Path
from ..core.config import settings
import logging

logger = logging.getLogger("backup_service")


class BackupService:
    def executar_backup(self, motivo: str = "automatico"):
        origem = settings.data_dir
        destino_dir = settings.base_dir / "backups"
        destino_dir.mkdir(exist_ok=True)

        nome = f"backup_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.zip"
        destino = destino_dir / nome

        shutil.make_archive(
            base_name=str(destino.with_suffix("")),
            format="zip",
            root_dir=origem,
        )

        logger.info("Backup criado: %s", destino)
        return str(destino)
