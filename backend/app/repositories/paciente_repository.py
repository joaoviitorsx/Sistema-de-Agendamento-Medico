from pathlib import Path
from ..core.config import settings
from ..infra.file_storage import JsonFileStorage
from ..models.paciente_model import Paciente
from datetime import datetime, date
from typing import Optional, List
from dataclasses import asdict


class PacienteRepository:
    def __init__(self):
        file_path = settings.data_dir / "pacientes.json"
        self.storage = JsonFileStorage(file_path)

        # garante que o arquivo exista
        if not file_path.exists():
            file_path.write_text("[]", encoding="utf-8")

    def _deserialize(self, raw: dict) -> Paciente:
        return Paciente(
            id=raw["id"],
            nome=raw["nome"],
            cpf=raw["cpf"],
            data_nascimento=date.fromisoformat(raw["data_nascimento"]),
            email=raw.get("email"),
            telefone=raw.get("telefone"),
            created_at=datetime.fromisoformat(raw["created_at"]),
            updated_at=datetime.fromisoformat(raw["updated_at"]),
        )

    def _serialize(self, paciente: Paciente) -> dict:
        d = asdict(paciente)
        d["data_nascimento"] = paciente.data_nascimento.isoformat()
        d["created_at"] = paciente.created_at.isoformat()
        d["updated_at"] = paciente.updated_at.isoformat()
        return d

    def list_all(self) -> List[Paciente]:
        return [self._deserialize(r) for r in self.storage.list_all()]

    def get_by_id(self, paciente_id: str) -> Optional[Paciente]:
        for r in self.storage.list_all():
            if r["id"] == paciente_id:
                return self._deserialize(r)
        return None

    def save(self, paciente: Paciente) -> Paciente:
        registros = self.storage.list_all()
        registros = [r for r in registros if r["id"] != paciente.id]
        registros.append(self._serialize(paciente))
        self.storage.save_all(registros)
        return paciente

    def delete(self, paciente_id: str) -> bool:
        registros = self.storage.list_all()
        new_registros = [r for r in registros if r["id"] != paciente_id]
        if len(new_registros) == len(registros):
            return False
        self.storage.save_all(new_registros)
        return True
