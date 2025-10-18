# File: main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import query_router
from config import get_settings
from services.keyword_extractor import KeywordExtractor
from services.grounding_service import GroundingService
from services.chronos_service import ChronosService

# --- Application Initialization ---
settings = get_settings()

app = FastAPI(
    title="Project Chronos RAG Backend",
    description="Cost-optimized RAG API using single Gemini call.",
    version="1.0.0"
)

# --- CORS Configuration ---
# ✅ FIX: Allow requests from common localhost origins for frontend development
origins = [
    "http://localhost",
    "http://localhost:8080",  # Common dev port
    "http://localhost:5173",  # Common dev port
    "http://127.0.0.1",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "X-API-Key"],
)

# --- Dependency Injection Container Setup ---

# Instantiate singletons for services that will be injected
extractor_instance = KeywordExtractor()
grounding_instance = GroundingService(settings)
chronos_service_instance = ChronosService(
    settings=settings,
    extractor=extractor_instance,
    grounding_service=grounding_instance
)

# ✅ FIX: Configure router dependency with the Chronos service singleton
query_router.set_chronos_service(chronos_service_instance)

# --- Routing ---
app.include_router(
    query_router.router,
    tags=["Chronos Reconstruction"],  # ✅ FIX: Added descriptive OpenAPI tag
    prefix="/api/v1"
)

# --- Execution Block ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
