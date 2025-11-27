from typing import Dict, Literal
from threading import RLock

Status = Literal["disponivel", "reservado", "ocupado"]

class ScheduleState:
    def __init__(self):
        self._slots: Dict[str, Status] = {}
        self._lock = RLock()

    def set_status(self, key: str, status: Status):
        with self._lock:
            self._slots[key] = status

    def get_status(self, key: str) -> Status:
        with self._lock:
            return self._slots.get(key, "disponivel")

    def all(self):
        with self._lock:
            return dict(self._slots)


schedule_state = ScheduleState()
