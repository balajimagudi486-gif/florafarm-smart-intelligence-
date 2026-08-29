# FloraFarm — Pydantic schemas for Disease API
from typing import List, Optional
from pydantic import BaseModel


class TopPrediction(BaseModel):
    label: str
    crop: str
    disease: str
    confidence: float


class DiseaseResponse(BaseModel):
    crop: str
    disease: str
    confidence: float
    severity: str
    top_predictions: List[TopPrediction]
    is_demo: bool = False
    model_version: str = "MobileNetV2 / PlantVillage"
