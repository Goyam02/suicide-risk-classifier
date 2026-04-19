import uvicorn
from .config import API_HOST, API_PORT, API_RELOAD

if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app",
        host=API_HOST,
        port=API_PORT,
        reload=API_RELOAD
    )