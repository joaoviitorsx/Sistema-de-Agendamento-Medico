import contextlib
import platform
import threading
from pathlib import Path
from typing import Iterator


# Lock global em memória para Windows (por processo)
_windows_lock = threading.RLock()


@contextlib.contextmanager
def file_lock(path: Path) -> Iterator[None]:
    """
    Lock transparente entre SOs:

    - Windows:
        Usa apenas RLock (lock em memória).
        File locking real causa PermissionError em escrita simultânea,
        principalmente em pastas sincronizadas como OneDrive.
    
    - Linux/macOS:
        Usa fcntl.flock EXCLUSIVO (file lock real).
    
    Isso garante concorrência segura sem travar arquivos no Windows.
    """

    system = platform.system().lower()

    # --- WINDOWS ---
    if system == "windows":
        with _windows_lock:
            yield
        return

    # --- UNIX (Linux, macOS) ---
    try:
        import fcntl  # type: ignore
    except ImportError:
        # fallback (p.ex. cygwin)
        yield
        return

    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a+") as f:
        # Lock exclusivo
        fcntl.flock(f.fileno(), fcntl.LOCK_EX)
        try:
            yield
        finally:
            fcntl.flock(f.fileno(), fcntl.LOCK_UN)