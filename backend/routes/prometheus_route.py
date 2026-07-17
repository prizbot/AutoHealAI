"""
Prometheus-compatible /metrics scrape endpoint.
Compatible with any Prometheus server, Grafana agent, or VictoriaMetrics.
No prometheus-client library needed — plain text format is trivial to produce.
"""
import time
from fastapi import APIRouter
from fastapi.responses import PlainTextResponse

from monitoring.buffer import metrics_buffer
from utils.logger import get_logger

logger = get_logger("prometheus")
router = APIRouter(tags=["Observability"])

_HELP = {
    "autoheal_up":                       ("gauge", "AutoHealAI service health (1=up)"),
    "autoheal_buffer_size":              ("gauge", "Metrics currently in ring buffer"),
    "system_cpu_percent":                ("gauge", "Host CPU utilisation percent"),
    "system_memory_percent":             ("gauge", "Host memory utilisation percent"),
    "system_disk_percent":               ("gauge", "Host disk utilisation percent"),
    "system_process_count":              ("gauge", "Number of running OS processes"),
    "system_network_receive_mb_total":   ("counter", "Cumulative network bytes received (MB)"),
    "system_network_transmit_mb_total":  ("counter", "Cumulative network bytes sent (MB)"),
    "app_requests_per_second":           ("gauge", "Application request rate"),
    "app_latency_milliseconds":          ("gauge", "Application response latency in ms"),
    "app_pod_restarts_total":            ("gauge", "Pod restart count"),
    "autoheal_failure_confidence":       ("gauge", "ML failure prediction confidence 0-1"),
    "autoheal_failure_predicted":        ("gauge", "Binary failure prediction (0 or 1)"),
    "autoheal_severity_level":           ("gauge", "Severity level: 0=info 1=warning 2=critical"),
    "autoheal_scrape_timestamp_seconds": ("gauge", "Unix timestamp of last scrape"),
}


def _metric(name: str, value: float, labels: dict | None = None) -> str:
    typ, help_txt = _HELP.get(name, ("gauge", "AutoHealAI metric"))
    label_str = ""
    if labels:
        label_str = "{" + ",".join(f'{k}="{v}"' for k, v in labels.items()) + "}"
    return (
        f"# HELP {name} {help_txt}\n"
        f"# TYPE {name} {typ}\n"
        f"{name}{label_str} {value:.6f}\n"
    )


@router.get("/metrics", response_class=PlainTextResponse, include_in_schema=False)
async def prometheus_scrape():
    """Prometheus scrape endpoint — add http://localhost:8000/metrics to prometheus.yml"""
    lines = []
    lines.append(_metric("autoheal_up", 1.0, {"version": "2.0.0"}))
    lines.append(_metric("autoheal_buffer_size", float(len(metrics_buffer))))

    m = metrics_buffer.latest()
    if m:
        lines.append(_metric("system_cpu_percent",               m.get("cpu",           0)))
        lines.append(_metric("system_memory_percent",            m.get("memory",        0)))
        lines.append(_metric("system_disk_percent",              m.get("disk",          0)))
        lines.append(_metric("system_process_count",    float(m.get("process_count",    0))))
        lines.append(_metric("system_network_receive_mb_total",  m.get("network_in",    0)))
        lines.append(_metric("system_network_transmit_mb_total", m.get("network_out",   0)))
        lines.append(_metric("app_requests_per_second",          m.get("requests",      0)))
        lines.append(_metric("app_latency_milliseconds",         m.get("latency",       0)))
        lines.append(_metric("app_pod_restarts_total",           m.get("restarts",      0)))

        # Run prediction inline (cached via shared state — cheap call)
        try:
            from monitoring.demo_fault import demo_fault
            from ai_engine.predictor import run_prediction
            pred = run_prediction(demo_fault.apply_overlay(m))
            lines.append(_metric("autoheal_failure_confidence", pred["confidence_raw"]))
            lines.append(_metric("autoheal_failure_predicted",  float(pred["failure"])))
            sev = {"critical": 2.0, "warning": 1.0, "info": 0.0}.get(pred.get("severity", "info"), 0.0)
            lines.append(_metric("autoheal_severity_level", sev))
        except Exception as exc:
            logger.debug("Prometheus prediction skip: %s", exc)

    lines.append(_metric("autoheal_scrape_timestamp_seconds", time.time()))
    return "\n".join(lines)
