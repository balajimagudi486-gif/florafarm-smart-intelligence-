# FloraFarm — Fertilizer API router
import logging
from fastapi import APIRouter, HTTPException

from app.schemas.fertilizer import FertilizerRequest, FertilizerResponse
from app.services.fertilizer_service import fertilizer_service

logger = logging.getLogger("FloraFarm.api.fertilizer")
router = APIRouter()


@router.post("/recommend", response_model=FertilizerResponse, summary="Get fertilizer recommendation")
async def recommend_fertilizer(request: FertilizerRequest):
    """
    Provide soil and crop information to receive:
    - Recommended fertilizer name
    - Organic / Inorganic classification
    - Confidence score (%)
    - Top 3 fertilizer options
    
    Note: AI-generated decision support. Actual application should follow
    soil-test results, crop requirements, and local agricultural guidance.
    """
    try:
        result = fertilizer_service.recommend(request.model_dump())
        return FertilizerResponse(**result)
    except Exception as e:
        logger.error(f"Fertilizer API error: {e}")
        raise HTTPException(status_code=500, detail="FloraFarm AI service is temporarily unavailable. Please try again.")
