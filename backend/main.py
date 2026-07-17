import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path) # loads .env file if present

from database.store import init_db
from monitoring.collector import start_collector
from ml_models.ensemble import ensemble
from backend.routes import metrics, predictions, alerts
from backend.routes import chat, demo
from backend.routes.prometheus_route import router as prom_router
from utils.logger import get_logger

logger = get_logger("main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("=" * 52)
    logger.info("  AutoHealAI v2  —  AIOps Platform")
    logger.info("=" * 52)
    init_db()
    loaded = ensemble.load()
    if not loaded:
        logger.warning("Model not ready — run: python ml_models/train.py")
    start_collector()
    groq_key = os.getenv("GROQ_API_KEY", "")
    if groq_key:
        logger.info("Groq API key detected — AI chat enabled")
    else:
        logger.warning("GROQ_API_KEY not set — AI chat will show setup instructions")
    logger.info("API → http://localhost:8000  |  Docs → http://localhost:8000/docs")
    logger.info("Prometheus → http://localhost:8000/metrics")
    yield
    logger.info("AutoHealAI v2 shutting down.")


app = FastAPI(
    title="AutoHealAI v2",
    description="Enterprise AIOps self-healing cloud platform",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(metrics.router)
app.include_router(predictions.router)
app.include_router(alerts.router)
app.include_router(chat.router)
app.include_router(demo.router)
app.include_router(prom_router)


@app.get("/api/health", tags=["Health"])
async def health():
    from monitoring.buffer import metrics_buffer
    from monitoring.demo_fault import demo_fault
    return {
        "status":            "ok",
        "model_ready":       ensemble.is_ready,
        "metrics_collected": len(metrics_buffer),
        "groq_configured":   bool(os.getenv("GROQ_API_KEY")),
        "demo_fault_active": demo_fault.active,
        "version":           "2.0.0",
    }
