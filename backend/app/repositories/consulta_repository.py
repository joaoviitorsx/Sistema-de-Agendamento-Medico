from dataclasses import asdict
from datetime import datetime
from pathlib import Path
from typing import List, Optional

from ..core.config import settings
from ..infra.file_storage import JsonFileStorage
from ..models.consulta_model import Consulta


class ConsultaRepository:
    def __init__(self):
        file_path = settings.data_dir / "consultas.json"
        self.storage = JsonFileStorage(file_path)

        if not file_path.exists() or file_path.stat().st_size == 0:
            file_path.write_text("[]", encoding="utf-8")

    def _deserialize(self, raw: dict) -> Consulta:
        return Consulta(
            id=raw["id"],
            paciente_id=raw["paciente_id"],
            medico_id=raw["medico_id"],
            inicio=datetime.fromisoformat(raw["inicio"]),
            fim=datetime.fromisoformat(raw["fim"]),
            status=raw["status"],
            observacoes=raw.get("observacoes"),
            created_at=datetime.fromisoformat(raw["created_at"]),
            updated_at=datetime.fromisoformat(raw["updated_at"]),
        )

    def _serialize(self, consulta: Consulta) -> dict:
        data = asdict(consulta)
        data["inicio"] = consulta.inicio.isoformat()
        data["fim"] = consulta.fim.isoformat()
        data["created_at"] = consulta.created_at.isoformat()
        data["updated_at"] = consulta.updated_at.isoformat()
        return data

    def list_all(self) -> List[Consulta]:
        return [self._deserialize(r) for r in self.storage.list_all()]

    def get_by_id(self, consulta_id: str) -> Optional[Consulta]:
        for r in self.storage.list_all():
            if r["id"] == consulta_id:
                return self._deserialize(r)
        return None

    def save(self, consulta: Consulta) -> Consulta:
        registros = self.storage.list_all()
        registros = [r for r in registros if r["id"] != consulta.id]
        registros.append(self._serialize(consulta))
        self.storage.save_all(registros)
        return consulta

    def delete(self, consulta_id: str) -> bool:
        registros = self.storage.list_all()
        novos = [r for r in registros if r["id"] != consulta_id]
        if len(novos) == len(registros):
            return False
        self.storage.save_all(novos)
        return True
