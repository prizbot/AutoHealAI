"""
Natural language explanation generator.
Converts ML confidence + root causes + raw metrics → human-readable sentence.
"""
from typing import List


def generate_explanation(metrics: dict, causes: List[str], confidence: float) -> str:
    pct = f"{confidence:.0%}"

    if not causes or causes == ["Normal Operation"]:
        return (
            f"All system metrics are within normal operating parameters. "
            f"Ensemble confidence score: {pct} (below 60% failure threshold). "
            f"No remediation required at this time."
        )

    cpu  = float(metrics.get("cpu",      0))
    mem  = float(metrics.get("memory",   0))
    lat  = float(metrics.get("latency",  0))
    req  = float(metrics.get("requests", 0))
    rst  = int(metrics.get("restarts",   0))

    signals: List[str] = []

    if "CPU Saturation" in causes or "Elevated CPU Load" in causes:
        signals.append(f"CPU utilisation at {cpu:.0f}%")
    if "Memory Critical" in causes or "Memory Pressure" in causes:
        signals.append(f"memory usage at {mem:.0f}%")
    if "Traffic Overload" in causes or "High Request Volume" in causes:
        signals.append(f"request rate {req:.0f} req/s")
    if "Latency Degradation" in causes or "Traffic Overload" in causes:
        signals.append(f"response latency {lat:.0f} ms")
    if "Crash Loop Detected" in causes:
        signals.append(f"{rst} pod restart(s) in monitoring window")
    if "Combined System Stress" in causes:
        signals.append("simultaneous multi-resource exhaustion detected")

    primary  = causes[0]
    sig_str  = ", ".join(signals) if signals else "anomalous metric pattern"

    parts = [
        f"Failure predicted with {pct} confidence.",
        f"Primary driver: {primary}.",
        f"Key signals: {sig_str}.",
    ]

    if len(causes) > 1:
        secondary = ", ".join(causes[1:])
        parts.append(f"Contributing factors: {secondary}.")

    parts.append("Automated remediation actions have been queued for execution.")
    return " ".join(parts)
