"""
Maps root causes to priority-ranked recovery actions.
Each action includes: action text, priority, automated flag, owning cause.
"""
from typing import List, Dict

# Cause → list of actions (ordered by priority within each cause)
ACTION_MAP: Dict[str, List[Dict]] = {
    "CPU Saturation": [
        {"action": "Scale horizontal replicas to 3",         "priority": "high",     "automated": True},
        {"action": "Throttle non-critical background jobs",   "priority": "medium",   "automated": True},
        {"action": "Alert on-call engineer via PagerDuty",    "priority": "high",     "automated": True},
    ],
    "Elevated CPU Load": [
        {"action": "Monitor CPU trend — 2-minute watch",      "priority": "low",      "automated": True},
        {"action": "Log elevated CPU event to incident log",   "priority": "low",      "automated": True},
    ],
    "Memory Critical": [
        {"action": "Trigger heap dump collection",            "priority": "critical", "automated": True},
        {"action": "Restart application pod immediately",     "priority": "critical", "automated": True},
        {"action": "Double memory limit in pod spec",         "priority": "high",     "automated": False},
        {"action": "Page DevOps team — P1 memory critical",  "priority": "critical", "automated": True},
    ],
    "Memory Pressure": [
        {"action": "Flush in-memory caches (Redis FLUSHDB)",  "priority": "medium",   "automated": True},
        {"action": "Monitor memory growth rate",              "priority": "low",      "automated": True},
    ],
    "Traffic Overload": [
        {"action": "Enable rate limiting — 500 rps cap",      "priority": "high",     "automated": True},
        {"action": "Scale load balancer replicas +2",         "priority": "high",     "automated": True},
        {"action": "Activate CDN edge caching rules",         "priority": "medium",   "automated": False},
        {"action": "Enable request queue with backpressure",  "priority": "medium",   "automated": True},
    ],
    "Crash Loop Detected": [
        {"action": "Cordon failing node from cluster",        "priority": "critical", "automated": True},
        {"action": "Collect crash dump and stack trace",      "priority": "high",     "automated": True},
        {"action": "Restart pod on healthy node",             "priority": "critical", "automated": True},
        {"action": "Open P0 incident bridge — page SRE",     "priority": "critical", "automated": True},
    ],
    "Latency Degradation": [
        {"action": "Increase DB connection pool size",        "priority": "medium",   "automated": True},
        {"action": "Check downstream service health",         "priority": "medium",   "automated": True},
        {"action": "Enable circuit breaker on slow routes",   "priority": "medium",   "automated": True},
    ],
    "High Request Volume": [
        {"action": "Pre-warm auto-scaling group",             "priority": "medium",   "automated": True},
        {"action": "Alert capacity planning team",            "priority": "low",      "automated": True},
    ],
    "Combined System Stress": [
        {"action": "Initiate failover to DR region",          "priority": "critical", "automated": False},
        {"action": "Open P0 war-room bridge",                 "priority": "critical", "automated": True},
        {"action": "Engage incident commander (L3)",          "priority": "critical", "automated": True},
    ],
    "Normal Operation": [
        {"action": "No action required — system healthy",     "priority": "none",     "automated": True},
    ],
}

_PRIORITY_ORDER = {"critical": 0, "high": 1, "medium": 2, "low": 3, "none": 4}


def recommend_actions(causes: List[str]) -> List[Dict]:
    seen:    set  = set()
    actions: List = []

    for cause in causes:
        for a in ACTION_MAP.get(cause, []):
            key = a["action"]
            if key not in seen:
                seen.add(key)
                actions.append({**a, "cause": cause})

    # Sort: critical first, then high, medium, low, none
    actions.sort(key=lambda x: _PRIORITY_ORDER.get(x["priority"], 5))
    return actions
