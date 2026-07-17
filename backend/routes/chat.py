# """
# AI Chat endpoint — Groq free tier (no credit card needed).
# Get your key at: https://console.groq.com

# Troubleshooting 401 errors:
#   1. Make sure autoheal_ai_v2/.env contains:  GROQ_API_KEY=gsk_xxxx
#   2. Or set it as a system environment variable before starting the backend
#   3. The key must start with "gsk_"
# """
# import os
# from typing import List, Dict
# from fastapi import APIRouter
# from pydantic import BaseModel

# from monitoring.buffer import metrics_buffer
# from monitoring.demo_fault import demo_fault
# from ai_engine.predictor import run_prediction
# from utils.logger import get_logger

# logger = get_logger("chat")
# router = APIRouter(prefix="/api/chat", tags=["AI Chat"])

# # Free-tier models — tried in order until one works
# GROQ_MODELS = [
#     "llama-3.3-70b-versatile",
#     "llama3-70b-8192",
#     "llama3-8b-8192",
#     "llama-3.1-8b-instant",
#     "gemma2-9b-it",
# ]

# SYSTEM_PROMPT = """You are AutoHealAI's embedded SRE (Site Reliability Engineer) AI assistant.
# You have real-time access to live system metrics and ML predictions from the AutoHealAI monitoring platform.

# Your role:
# - Analyse system health and explain what is happening in plain, clear English
# - Explain root causes, their implications, and correlations between metrics
# - Guide the user through specific remediation steps
# - Answer technical questions about the metrics, ML ensemble model, and architecture
# - Be concise, specific, and actionable

# Always reference the actual numbers when explaining issues.
# Keep responses under 220 words unless the user asks for more detail.
# Use bullet points for action steps."""


# def _load_api_key() -> str:
#     """
#     Try multiple sources for the Groq API key:
#     1. Already-loaded env var (set before process start)
#     2. Read .env file manually (handles cases where dotenv didn't load)
#     """
#     # 1. Check environment (loaded by dotenv in main.py, or set by user)
#     key = os.environ.get("GROQ_API_KEY", "").strip()
#     if key:
#         return key

#     # 2. Try reading .env file manually from project root
#     import pathlib
#     for candidate in [
#         pathlib.Path(__file__).resolve().parents[2] / ".env",   # autoheal_ai_v2/.env
#         pathlib.Path(__file__).resolve().parents[3] / ".env",   # one level up
#         pathlib.Path.cwd() / ".env",                            # current working dir
#     ]:
#         if candidate.exists():
#             try:
#                 for line in candidate.read_text(encoding="utf-8").splitlines():
#                     line = line.strip()
#                     if line.startswith("GROQ_API_KEY="):
#                         k = line.split("=", 1)[1].strip().strip('"').strip("'")
#                         if k:
#                             logger.info("Loaded GROQ_API_KEY from %s", candidate)
#                             os.environ["GROQ_API_KEY"] = k   # cache for next call
#                             return k
#             except Exception as e:
#                 logger.warning("Could not read %s: %s", candidate, e)

#     return ""


# def _build_context(m: dict, pred: dict) -> str:
#     if not m:
#         return "No live metrics available yet."
#     lines = [
#         "=== LIVE SYSTEM STATE ===",
#         f"CPU: {m.get('cpu',0):.1f}%  Memory: {m.get('memory',0):.1f}%  Disk: {m.get('disk',0):.1f}%",
#         f"Requests/s: {m.get('requests',0):.0f}  Latency: {m.get('latency',0):.0f}ms  Restarts: {m.get('restarts',0):.0f}",
#     ]
#     if m.get("demo_fault_active"):
#         lines.append(f"DEMO FAULT ACTIVE: {m.get('demo_fault_type')} (simulated, not real)")
#     if pred:
#         lines += [
#             "",
#             "=== AI PREDICTION ===",
#             f"Status: {pred.get('status')}  Confidence: {pred.get('confidence',0):.1f}%  Severity: {pred.get('severity')}",
#             f"Root causes: {', '.join(pred.get('root_causes', []))}",
#             f"Explanation: {pred.get('explanation','')}",
#         ]
#         shap = pred.get("shap", {})
#         if shap.get("available") and shap.get("values"):
#             top3 = shap["values"][:3]
#             lines.append("Top SHAP drivers: " + ", ".join(
#                 f"{s['feature']}={s['value']:+.4f}" for s in top3
#             ))
#     return "\n".join(lines)


# class ChatRequest(BaseModel):
#     message: str
#     history: List[Dict[str, str]] = []


# @router.post("")
# async def chat(body: ChatRequest):
#     api_key = _load_api_key()

#     if not api_key:
#         return {
#             "reply": (
#                 "**GROQ_API_KEY not found.**\n\n"
#                 "Create the file  autoheal_ai_v2/.env  with this content:\n\n"
#                 "GROQ_API_KEY=gsk_your_actual_key_here\n\n"
#                 "Get a free key (no credit card) at https://console.groq.com\n\n"
#                 "Then restart the backend."
#             ),
#             "error": "no_api_key",
#         }

#     if not api_key.startswith("gsk_"):
#         return {
#             "reply": (
#                 f"API key looks wrong — Groq keys start with 'gsk_' but yours starts with '{api_key[:6]}…'\n\n"
#                 "Check your .env file and make sure you copied the full key from https://console.groq.com"
#             ),
#             "error": "bad_key_format",
#         }

#     m    = metrics_buffer.latest()
#     eff  = demo_fault.apply_overlay(m) if m else None
#     pred = run_prediction(eff) if eff else None
#     ctx  = _build_context(eff or m, pred)

#     try:
#         from groq import Groq
#         client = Groq(api_key=api_key)

#         messages = [{"role": "system", "content": f"{SYSTEM_PROMPT}\n\n{ctx}"}]
#         for msg in body.history[-8:]:
#             messages.append(msg)
#         messages.append({"role": "user", "content": body.message})

#         # Try models in order until one succeeds
#         last_error = None
#         for model in GROQ_MODELS:
#             try:
#                 resp = client.chat.completions.create(
#                     model=model,
#                     messages=messages,
#                     max_tokens=512,
#                     temperature=0.65,
#                 )
#                 logger.info("Chat response via model: %s", model)
#                 return {"reply": resp.choices[0].message.content, "model": model}
#             except Exception as e:
#                 err_str = str(e)
#                 # 401 = bad key — no point trying other models
#                 if "401" in err_str or "invalid_api_key" in err_str.lower():
#                     return {
#                         "reply": (
#                             "**Invalid API Key (401)**\n\n"
#                             "Your GROQ_API_KEY is being read but Groq says it is invalid.\n\n"
#                             "Steps to fix:\n"
#                             "1. Go to https://console.groq.com → API Keys\n"
#                             "2. Delete the old key and create a new one\n"
#                             "3. Update autoheal_ai_v2/.env with the new key\n"
#                             "4. Restart the backend\n\n"
#                             f"Key prefix being sent: {api_key[:12]}…"
#                         ),
#                         "error": "invalid_key_401",
#                     }
#                 last_error = e
#                 logger.warning("Model %s failed: %s — trying next", model, e)
#                 continue

#         return {
#             "reply": f"All Groq models failed. Last error: {last_error}",
#             "error": "all_models_failed",
#         }

#     except ImportError:
#         return {
#             "reply": "Run `pip install groq` then restart the backend.",
#             "error": "import_error",
#         }
#     except Exception as exc:
#         logger.error("Chat unexpected error: %s", exc)
#         return {"reply": f"Unexpected error: {exc}", "error": "unexpected"}
import os
from pathlib import Path
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from utils.logger import get_logger

logger = get_logger("chat")
router = APIRouter(prefix="/api/chat", tags=["Chat"])

# ── Fallback model chain ───────────────────────────────────────────────────
MODELS = [
    "llama-3.3-70b-versatile",
    "llama3-70b-8192",
    "llama3-8b-8192",
    "llama-3.1-8b-instant",
    "gemma2-9b-it",
]

# ── Pydantic models ────────────────────────────────────────────────────────
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

# ── Key loader — called at REQUEST time, never at import time ──────────────
def _get_key() -> Optional[str]:
    """
    Read GROQ_API_KEY fresh on every call so it picks up the value
    that load_dotenv() injected into os.environ during lifespan startup.
    Falls back to searching .env files manually in case of edge cases.
    """
    key = os.getenv("GROQ_API_KEY", "").strip()
    if key:
        return key

    # Manual .env search — 3 candidate locations
    candidates = [
        Path(__file__).resolve().parent.parent.parent / ".env",  # autoheal_ai_v2/.env
        Path(__file__).resolve().parent.parent / ".env",         # backend/.env
        Path(os.getcwd()) / ".env",                              # wherever uvicorn was launched
    ]
    for p in candidates:
        if p.exists():
            for line in p.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if line.startswith("GROQ_API_KEY"):
                    parts = line.split("=", 1)
                    if len(parts) == 2:
                        found = parts[1].strip().strip('"').strip("'")
                        if found:
                            logger.info("Groq key loaded from %s", p)
                            os.environ["GROQ_API_KEY"] = found  # cache it
                            return found
    return None

# ── System prompt builder ──────────────────────────────────────────────────
def _build_system_prompt() -> str:
    try:
        from monitoring.buffer  import metrics_buffer
        from ai_engine.predictor import run_prediction
        from monitoring.demo_fault import demo_fault

        m = metrics_buffer.latest()
        if not m:
            return _base_system()

        overlay = demo_fault.apply_overlay(m) if demo_fault.active else m
        pred    = run_prediction(overlay)

        return (
            "You are ARIA (Autonomous Response Intelligence Assistant), "
            "an expert AI Site Reliability Engineer embedded in AutoHealAI v2.0. "
            "You have real-time access to the following live system state:\n\n"
            f"LIVE METRICS:\n"
            f"  CPU: {overlay.get('cpu', 0):.1f}%\n"
            f"  Memory: {overlay.get('memory', 0):.1f}%\n"
            f"  Disk: {overlay.get('disk', 0):.1f}%\n"
            f"  Requests/s: {overlay.get('requests', 0):.0f}\n"
            f"  Latency: {overlay.get('latency', 0):.0f}ms\n"
            f"  Pod Restarts: {overlay.get('restarts', 0):.0f}\n"
            f"  Net In: {overlay.get('network_in', 0):.2f} MB\n"
            f"  Net Out: {overlay.get('network_out', 0):.2f} MB\n\n"
            f"ML PREDICTION:\n"
            f"  Status: {pred.get('status', 'unknown')}\n"
            f"  Failure: {pred.get('failure', False)}\n"
            f"  Confidence: {pred.get('confidence', 0):.1f}%\n"
            f"  Severity: {pred.get('severity', 'info')}\n"
            f"  Root Causes: {', '.join(pred.get('root_causes', ['None'])) or 'None'}\n\n"
            f"TOP 3 SHAP DRIVERS:\n"
            + (
                "\n".join(
                    f"  {v['feature']}: {'+' if v['direction']=='positive' else ''}{v['value']*100:.2f}%"
                    for v in (pred.get("shap", {}) or {}).get("values", [])[:3]
                ) or "  Not available"
            )
            + "\n\n"
            "Answer questions about this live system concisely and accurately. "
            "Reference the actual metric values in your answers. "
            "Recommend specific, actionable SRE responses when appropriate. "
            "Keep replies under 200 words unless the user asks for detail."
        )
    except Exception as exc:
        logger.warning("Could not build live context for ARIA: %s", exc)
        return _base_system()

def _base_system() -> str:
    return (
        "You are ARIA (Autonomous Response Intelligence Assistant), "
        "an expert AI SRE embedded in AutoHealAI v2.0. "
        "You specialise in cloud infrastructure reliability, AIOps, "
        "and ML-driven failure prediction. Answer questions concisely and helpfully."
    )

# ── Route ──────────────────────────────────────────────────────────────────
@router.post("")
async def chat(req: ChatRequest):
    key = _get_key()

    if not key:
        logger.warning("GROQ_API_KEY not found — returning setup instructions")
        return {
            "reply": (
                "I'm not connected yet. To activate me:\n\n"
                "1. Get a FREE Groq key at https://console.groq.com\n"
                "2. Create autoheal_ai_v2/.env with:\n"
                "   GROQ_API_KEY=gsk_your_key_here\n"
                "3. Restart the backend (Ctrl+C → uvicorn backend.main:app ...)\n\n"
                "No credit card required — Groq's free tier is very generous."
            ),
            "model": None,
            "groq_ready": False,
        }

    # Diagnose key format issues upfront
    if not key.startswith("gsk_"):
        logger.error("Groq key prefix invalid: '%s...'", key[:8])
        return {
            "reply": (
                f"Your API key doesn't start with 'gsk_' (got: {key[:8]}...). "
                "Please copy the key directly from https://console.groq.com — "
                "do not include quotes or spaces."
            ),
            "model": None,
            "groq_ready": False,
        }

    # Build messages for Groq
    system_prompt = _build_system_prompt()
    messages = [{"role": "system", "content": system_prompt}]
    for h in (req.history or [])[-8:]:
        messages.append({"role": h.role, "content": h.content})
    messages.append({"role": "user", "content": req.message})

    # Try each model in the fallback chain
    last_error = ""
    for model in MODELS:
        try:
            import httpx
            resp = httpx.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model":       model,
                    "messages":    messages,
                    "max_tokens":  512,
                    "temperature": 0.55,
                },
                timeout=20.0,
            )

            if resp.status_code == 200:
                data  = resp.json()
                reply = data["choices"][0]["message"]["content"].strip()
                logger.info("ARIA replied via model=%s (%d chars)", model, len(reply))
                return {"reply": reply, "model": model, "groq_ready": True}

            elif resp.status_code == 401:
                detail = resp.json().get("error", {}).get("message", "")
                logger.error("Groq 401 with key prefix '%s...': %s", key[:12], detail)
                return {
                    "reply": (
                        "Authentication failed (401). Your key prefix is "
                        f"'{key[:12]}...' — please verify it matches "
                        "https://console.groq.com exactly.\n\n"
                        f"Groq message: {detail}"
                    ),
                    "model": None,
                    "groq_ready": False,
                }

            elif resp.status_code == 429:
                # Rate limited on this model — try next
                last_error = f"rate_limited:{model}"
                logger.warning("Rate limited on %s, trying next model", model)
                continue

            else:
                last_error = f"HTTP {resp.status_code} on {model}"
                logger.warning("%s", last_error)
                continue

        except Exception as exc:
            last_error = str(exc)
            logger.warning("Model %s failed: %s", model, exc)
            continue

    # All models exhausted
    logger.error("All Groq models failed. Last error: %s", last_error)
    return {
        "reply": (
            "I'm having trouble reaching the Groq API right now. "
            f"Last error: {last_error}\n\n"
            "Please check your internet connection and try again in a moment."
        ),
        "model": None,
        "groq_ready": False,
    }