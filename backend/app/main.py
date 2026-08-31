# FloraFarm Backend — FastAPI Application Entry Point
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import chat, disease, fertilizer
from app.services.chat_service import chat_service
from app.services.disease_service import disease_service
from app.services.fertilizer_service import fertilizer_service

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger("florafarm")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load AI models once at startup."""
    logger.info("🌿 FloraFarm — Starting up...")
    disease_service.load_model()
    fertilizer_service.load_model()
    chat_service.load_model()
    logger.info("✅ All models initialised. FloraFarm is ready.")
    yield
    logger.info("🌿 FloraFarm — Shutting down.")


app = FastAPI(
    title="FloraFarm API",
    description="Smart Intelligence for Healthier Crops — Crop Disease & Fertilizer Recommendation API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(disease.router, prefix="/api/disease", tags=["Disease AI"])
app.include_router(fertilizer.router, prefix="/api/fertilizer", tags=["Fertilizer AI"])
app.include_router(chat.router, prefix="/api/chat", tags=["Agri-Advisor Chat"])


@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check endpoint — reports model availability."""
    return {
        "status": "ok",
        "disease_model": disease_service.model_loaded,
        "fertilizer_model": fertilizer_service.model_loaded,
        "chat_model": chat_service.is_ready,
        "chat_backend": chat_service.active_backend,
        "disease_demo": disease_service.demo_mode,
        "fertilizer_demo": fertilizer_service.demo_mode,
        "version": "1.0.0",
        "name": "FloraFarm",
    }


@app.get("/", tags=["Root"])
async def root():
    return {"message": "🌿 FloraFarm API — Smart Intelligence for Healthier Crops."}
