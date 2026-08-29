# FloraFarm — Disease API router
import logging
from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.disease import DiseaseResponse
from app.services.disease_service import disease_service
from app.utils.image_utils import validate_image_bytes

logger = logging.getLogger("florafarm.api.disease")
router = APIRouter()


@router.post("/predict", response_model=DiseaseResponse, summary="Predict crop disease from image")
async def predict_disease(image: UploadFile = File(..., description="Crop leaf image (JPG/JPEG/PNG, max 10 MB)")):
    """
    Upload a crop image and receive:
    - Detected crop and disease name
    - Confidence score (%)
    - Severity level
    - Top 3 predictions
    """
    try:
        data = await image.read()
        content_type = image.content_type or "image/jpeg"
        validate_image_bytes(data, content_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=400, detail="Please upload a valid JPG, JPEG or PNG image.")

    result = disease_service.predict(data)
    return DiseaseResponse(**result)
