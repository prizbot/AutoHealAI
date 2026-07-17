from collections import deque
from threading import Lock
from typing import Optional, List
from utils.config import BUFFER_SIZE


class MetricsBuffer:
    """Thread-safe circular ring-buffer for live metric snapshots."""

    def __init__(self, maxlen: int = BUFFER_SIZE):
        self._buf:  deque = deque(maxlen=maxlen)
        self._lock: Lock  = Lock()

    def push(self, metrics: dict) -> None:
        with self._lock:
            self._buf.append(metrics)

    def latest(self) -> Optional[dict]:
        with self._lock:
            return dict(self._buf[-1]) if self._buf else None

    def last_n(self, n: int) -> List[dict]:
        with self._lock:
            items = list(self._buf)
            return [dict(x) for x in (items[-n:] if len(items) >= n else items)]

    def __len__(self) -> int:
        with self._lock:
            return len(self._buf)


# Singleton — imported everywhere
metrics_buffer = MetricsBuffer()
