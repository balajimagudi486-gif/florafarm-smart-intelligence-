# FloraFarm — Pydantic schemas for Fertilizer API
from typing import List, Optional
from pydantic import BaseModel, Field


class FertilizerRequest(BaseModel):
    Soil_Type: str = Field(..., example="Clay")
    Soil_pH: float = Field(..., ge=0, le=14, example=6.07)
    Soil_Moisture: float = Field(..., ge=0, le=100, example=34.98)
    Organic_Carbon: float = Field(..., ge=0, example=0.32)
    Electrical_Conductivity: float = Field(..., ge=0, example=1.87)
    Nitrogen_Level: float = Field(..., ge=0, example=61.0)
    Phosphorus_Level: float = Field(..., ge=0, example=45.0)
    Potassium_Level: float = Field(..., ge=0, example=52.0)
    Crop_Type: str = Field(..., example="Tomato")
    Crop_Growth_Stage: str = Field(..., example="Vegetative")
    Season: str = Field(..., example="Kharif")
    Irrigation_Type: str = Field(..., example="Drip")
    Previous_Crop: str = Field(..., example="Potato")
    Region: str = Field(..., example="South")


class FertilizerTopOption(BaseModel):
    fertilizer: str
    confidence: float
    type: str  # "Organic" | "Inorganic"


class FertilizerResponse(BaseModel):
    fertilizer: str
    type: str  # "Organic" | "Inorganic"
    confidence: float
    top_options: List[FertilizerTopOption]
    is_demo: bool = False
    model_version: str = "Random Forest / Fertilizer Dataset"
