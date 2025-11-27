from __future__ import annotations

from dataclasses import asdict
from datetime import datetime
from pathlib import Path
from typing import List, Optional

from ..core.config import settings
from ..infra.file_storage import JsonFileStorage
from ..models.medico_model import Medico


class MedicoRepository:
    def __init__(self):
        file_path = settings.data_dir / "medicos.json"
        self.storage = JsonFileStorage(file_path)

        # garante JSON válido
        if not file_path.exists() or file_path.stat().st_size == 0:
            file_path.write_text("[]", encoding="utf-8")

    def _deserialize(self, raw: dict) -> Medico:
        return Medico(
            id=raw["id"],
            nome=raw["nome"],
            crm=raw["crm"],
            especialidade=raw["especialidade"],
            email=raw.get("email"),
            telefone=raw.get("telefone"),
            created_at=datetime.fromisoformat(raw["created_at"]),
            updated_at=datetime.fromisoformat(raw["updated_at"]),
        )

    def _serialize(self, medico: Medico) -> dict:
        d = asdict(medico)
        d["created_at"] = medico.created_at.isoformat()
        d["updated_at"] = medico.updated_at.isoformat()
        return d

    def list_all(self) -> List[Medico]:
        return [self._deserialize(r) for r in self.storage.list_all()]

    def get_by_id(self, medico_id: str) -> Optional[Medico]:
        for r in self.storage.list_all():
            if r["id"] == medico_id:
                return self._deserialize(r)
        return None

    def save(self, medico: Medico) -> Medico:
        registros = self.storage.list_all()
        registros = [r for r in registros if r["id"] != medico.id]
        registros.append(self._serialize(medico))
        self.storage.save_all(registros)
        return medico

    def delete(self, medico_id: str) -> bool:
        registros = self.storage.list_all()
        new_registros = [r for r in registros if r["id"] != medico_id]
        if len(registros) == len(new_registros):
            return False
        self.storage.save_all(new_registros)
        return True
