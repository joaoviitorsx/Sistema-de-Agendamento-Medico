from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "AgendamentoMedico"

    # Diretório base DO BACKEND (não o home do usuário)
    BASE_DIR: Path = Path(__file__).resolve().parents[1]

    @property
    def data_dir(self) -> Path:
        path = self.BASE_DIR / "banco"
        path.mkdir(parents=True, exist_ok=True)
        return path

    @property
    def logs_dir(self) -> Path:
        path = self.BASE_DIR / "logs"
        path.mkdir(parents=True, exist_ok=True)
        return path

    @property
    def reports_dir(self) -> Path:
        path = self.BASE_DIR / "reports"
        path.mkdir(parents=True, exist_ok=True)
        return path

    @property
    def temp_dir(self) -> Path:
        path = self.BASE_DIR / "temp"
        path.mkdir(parents=True, exist_ok=True)
        return path


settings = Settings()
