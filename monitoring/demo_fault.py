"""
Isolated demo fault state.
Affects ONLY the AI prediction overlay — stored metrics in the DB and
the ring buffer are NEVER touched. Real monitoring is completely unaffected.
"""
import random
from threading import Lock
from typing import Optional


class DemoFaultState:
    VALID = ["cpu_spike", "memory_leak", "traffic_burst", "crash_loop", "combined"]

    def __init__(self):
        self._lock      = Lock()
        self._type:     Optional[str] = None
        self._intensity: float        = 0.85

    def inject(self, fault_type: str, intensity: float = 0.85) -> None:
        with self._lock:
            self._type      = fault_type
            self._intensity = max(0.1, min(1.0, intensity))

    def clear(self) -> None:
        with self._lock:
            self._type = None

    @property
    def active(self) -> bool:
        with self._lock:
            return self._type is not None

    @property
    def fault_type(self) -> Optional[str]:
        with self._lock:
            return self._type

    @property
    def intensity(self) -> float:
        with self._lock:
            return self._intensity

    def apply_overlay(self, metrics: dict) -> dict:
        """
        Returns a shallow COPY of metrics with fault overlay applied.
        The original dict (stored in DB / buffer) is NEVER modified.
        """
        with self._lock:
            if self._type is None:
                return dict(metrics)

            m   = dict(metrics)   # copy — never touch the original
            p   = self._intensity
            ft  = self._type
            rng = random.gauss

            if ft == "cpu_spike":
                m["cpu"]     = min(100.0, m["cpu"]     + 35 + 28 * p + rng(0, 3))
                m["latency"] = min(2500., m["latency"] + 220 + 200 * p + rng(0, 20))

            elif ft == "memory_leak":
                m["memory"]  = min(99.5, max(m["memory"], 60 + 35 * p + rng(0, 2)))

            elif ft == "traffic_burst":
                m["requests"] = min(900., m["requests"] + 190 + 160 * p + rng(0, 15))
                m["latency"]  = min(2500., m["latency"] + 260 + 220 * p + rng(0, 25))

            elif ft == "crash_loop":
                m["restarts"] = 3 + int(2 * p)
                m["cpu"]      = min(100.0, m["cpu"] + 22 + 18 * p + rng(0, 4))

            elif ft == "combined":
                m["cpu"]      = min(100.0, m["cpu"]      + 32 + 22 * p)
                m["memory"]   = min(99.5,  max(m["memory"], 68 + 22 * p))
                m["latency"]  = min(2500., m["latency"]  + 300 + 160 * p)
                m["requests"] = min(900.,  m["requests"] + 160 + 110 * p)
                m["restarts"] = 2

            m["demo_fault_active"] = True
            m["demo_fault_type"]   = ft
            return m


# Module-level singleton
demo_fault = DemoFaultState()
