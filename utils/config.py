from pathlib import Path

BASE_DIR          = Path(__file__).resolve().parent.parent
MODEL_STORE       = BASE_DIR / "ml_models" / "model_store"
DB_PATH           = BASE_DIR / "database" / "autoheal.db"
DATA_PATH         = BASE_DIR / "data" / "synthetic_metrics.csv"
LOG_DIR           = BASE_DIR / "logs"

COLLECTION_INTERVAL = 3       # seconds between metric snapshots
BUFFER_SIZE         = 200     # rolling in-memory ring buffer size
FAILURE_THRESHOLD   = 0.60    # ensemble probability threshold
ROLLING_WINDOW      = 5       # samples used for rolling-mean features

FEATURE_NAMES = ["cpu", "memory", "requests", "latency", "restarts"]
