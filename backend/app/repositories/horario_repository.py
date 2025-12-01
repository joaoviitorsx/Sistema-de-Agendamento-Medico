
from pathlib import Path
from ..core.config import settings
from ..infra.file_storage import JsonFileStorage
from ..models.horario_model import Horario
from typing import Optional, List
from dataclasses import asdict
import uuid

class HorarioRepository:
    def __init__(self):
        file_path = settings.data_dir / "horarios.json"
        self.storage = JsonFileStorage(file_path)
        if not file_path.exists():
            file_path.write_text("[]", encoding="utf-8")

    async def listar_todos_horarios(self):
        from asyncio import to_thread
        def _list():
            return [self._serialize(h) for h in self.list_all()]
        return await to_thread(_list)

    async def listar_horarios_medico(self, medico_id: str):
        from asyncio import to_thread
        def _list():
            return [self._serialize(h) for h in self.list_by_medico(medico_id)]
        return await to_thread(_list)

    async def obter_horario(self, horario_id: str):
        from asyncio import to_thread
        def _get():
            h = self.get_by_id(horario_id)
            return self._serialize(h) if h else None
        return await to_thread(_get)

    async def criar_horario(self, medico_id: str, data: dict):
        from asyncio import to_thread
        def _create():
            new_id = str(uuid.uuid4())
            horario = Horario(
                id=new_id,
                medico_id=medico_id,
                dia_semana=data["dia_semana"],
                hora_inicio=data["hora_inicio"],
                hora_fim=data["hora_fim"]
            )
            self.save(horario)
            return self._serialize(horario)
        return await to_thread(_create)

    async def atualizar_horario(self, horario_id: str, data: dict):
        from asyncio import to_thread
        def _update():
            horario = self.get_by_id(horario_id)
            if not horario:
                return None
            for k, v in data.items():
                if hasattr(horario, k) and v is not None:
                    setattr(horario, k, v)
            self.save(horario)
            return self._serialize(horario)
        return await to_thread(_update)

    async def deletar_horario(self, horario_id: str):
        from asyncio import to_thread
        def _delete():
            return self.delete(horario_id)
        return await to_thread(_delete)


    def _deserialize(self, raw: dict) -> Horario:
        return Horario(
            id=raw["id"],
            medico_id=raw["medico_id"],
            dia_semana=raw["dia_semana"],
            hora_inicio=raw["hora_inicio"],
            hora_fim=raw["hora_fim"]
        )

    def _serialize(self, horario: Horario) -> dict:
        return asdict(horario)

    def list_all(self) -> List[Horario]:
        return [self._deserialize(r) for r in self.storage.list_all()]

    def list_by_medico(self, medico_id: str) -> List[Horario]:
        return [h for h in self.list_all() if h.medico_id == medico_id]

    def get_by_id(self, horario_id: str) -> Optional[Horario]:
        for r in self.storage.list_all():
            if r["id"] == horario_id:
                return self._deserialize(r)
        return None

    def save(self, horario: Horario) -> Horario:
        registros = self.storage.list_all()
        registros = [r for r in registros if r["id"] != horario.id]
        registros.append(self._serialize(horario))
        self.storage.save_all(registros)
        return horario

    def delete(self, horario_id: str) -> bool:
        registros = self.storage.list_all()
        new_registros = [r for r in registros if r["id"] != horario_id]
        if len(new_registros) == len(registros):
            return False
        self.storage.save_all(new_registros)
        return True
