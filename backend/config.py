import os

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")

API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))
API_RELOAD = os.getenv("API_RELOAD", "False").lower() == "true"

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

MAX_TEXT_LENGTH = 50000
MAX_BATCH_SIZE = 1000