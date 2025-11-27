import json
from pathlib import Path
from threading import RLock
from typing import Any, Dict, List

from .file_locks import file_lock


class JsonFileStorage:
    """
    Armazenamento seguro em JSON:
    - Se o arquivo não existir → cria com []
    - Se o arquivo estiver vazio → reescreve []
    - Se der erro ao ler (arquivo quebrado) → corrige e retorna []
    """

    def __init__(self, file_path: Path) -> None:
        self.file_path = file_path
        self._lock = RLock()

        # garante diretório
        file_path.parent.mkdir(parents=True, exist_ok=True)

        # garante arquivo com conteúdo válido
        if not file_path.exists() or file_path.stat().st_size == 0:
            file_path.write_text("[]", encoding="utf-8")

    def _read_json(self) -> List[Dict[str, Any]]:
        with file_lock(self.file_path), self._lock:
            try:
                with self.file_path.open("r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        return data
                    # Corrige caso o JSON não seja uma lista
                    return []
            except Exception:
                # corrige arquivo inválido
                self._write_json([])
                return []

    def _write_json(self, data: List[Dict[str, Any]]) -> None:
        with file_lock(self.file_path), self._lock:
            with self.file_path.open("w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

    def list_all(self) -> List[Dict[str, Any]]:
        return self._read_json()

    def save_all(self, records: List[Dict[str, Any]]) -> None:
        self._write_json(records)
