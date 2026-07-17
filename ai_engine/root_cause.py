"""
Rule-based root cause analyser.
Evaluates raw metric values against thresholds and returns
structured cause list with per-cause severity.
"""
from typing import Dict, List

THRESHOLDS = {
    "cpu_crit":  85.0,   "cpu_high":   72.0,
    "mem_crit":  90.0,   "mem_high":   78.0,
    "lat_crit": 700.0,   "lat_high":  480.0,
    "req_high": 370.0,
    "rst_crit":   2,
}

CAUSE_SEVERITY: Dict[str, str] = {
    "Crash Loop Detected":    "critical",
    "CPU Saturation":         "critical",
    "Memory Critical":        "critical",
    "Combined System Stress": "critical",
    "Memory Pressure":        "warning",
    "Traffic Overload":       "warning",
    "Elevated CPU Load":      "warning",
    "Latency Degradation":    "warning",
    "High Request Volume":    "info",
    "Normal Operation":       "info",
}


def detect_root_cause(m: dict) -> Dict:
    """
    Args:
        m: raw metrics dict with keys cpu, memory, latency, requests, restarts
    Returns:
        {causes, severities, overall_severity}
    """
    cpu  = float(m.get("cpu",      0))
    mem  = float(m.get("memory",   0))
    lat  = float(m.get("latency",  0))
    req  = float(m.get("requests", 0))
    rst  = float(m.get("restarts", 0))

    causes: List[str] = []

    # Crash loop has highest priority
    if rst > THRESHOLDS["rst_crit"]:
        causes.append("Crash Loop Detected")

    # CPU
    if cpu >= THRESHOLDS["cpu_crit"]:
        causes.append("CPU Saturation")
    elif cpu >= THRESHOLDS["cpu_high"]:
        causes.append("Elevated CPU Load")

    # Memory
    if mem >= THRESHOLDS["mem_crit"]:
        causes.append("Memory Critical")
    elif mem >= THRESHOLDS["mem_high"]:
        causes.append("Memory Pressure")

    # Traffic / latency
    if lat >= THRESHOLDS["lat_crit"] and req >= THRESHOLDS["req_high"]:
        causes.append("Traffic Overload")
    elif lat >= THRESHOLDS["lat_high"]:
        causes.append("Latency Degradation")
    elif req >= THRESHOLDS["req_high"]:
        causes.append("High Request Volume")

    # Combined multi-resource stress
    if (cpu >= THRESHOLDS["cpu_high"]
            and mem >= THRESHOLDS["mem_high"]
            and lat >= THRESHOLDS["lat_high"]
            and "Combined System Stress" not in causes):
        causes.append("Combined System Stress")

    if not causes:
        causes.append("Normal Operation")

    sev_map  = {c: CAUSE_SEVERITY.get(c, "info") for c in causes}
    vals     = list(sev_map.values())
    overall  = (
        "critical" if "critical" in vals else
        "warning"  if "warning"  in vals else
        "info"
    )

    return {
        "causes":           causes,
        "severities":       sev_map,
        "overall_severity": overall,
    }
