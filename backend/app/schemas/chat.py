# FloraFarm — Pydantic schemas for Chat API
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ChatHistoryEntry(BaseModel):
    """A single turn in the conversation history."""
    role: str = Field(..., description="'user' or 'model'")
    content: str = Field(..., description="The message text")


class ChatContext(BaseModel):
    """Optional domain context injected from the current UI view."""
    disease_result: Optional[Dict[str, Any]] = None   # DiseaseResponse dict
    soil_data: Optional[Dict[str, Any]] = None        # FertilizerRequest + FertilizerResponse dict
    fertilizer_result: Optional[Dict[str, Any]] = None


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4096, description="User's message")
    history: List[ChatHistoryEntry] = Field(default_factory=list, description="Prior conversation turns")
    context: Optional[ChatContext] = None


class ChatResponse(BaseModel):
    reply: str
    error: bool = False
