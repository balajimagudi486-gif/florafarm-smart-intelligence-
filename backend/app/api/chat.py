# FloraFarm — Chat API router
import logging

from fastapi import APIRouter, HTTPException

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import chat_service

logger = logging.getLogger("florafarm.api.chat")
router = APIRouter()


@router.post(
    "",
    response_model=ChatResponse,
    summary="FloraFarm Agri-Advisor — conversational AI endpoint",
)
@router.post(
    "/",
    response_model=ChatResponse,
    summary="FloraFarm Agri-Advisor — conversational AI endpoint (with slash)",
)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Send a message to the FloraFarm Agri-Advisor chatbot.

    - **message**: The user's current question or message.
    - **history**: Prior conversation turns for multi-turn context.
    - **context**: Optional domain context (disease scan result, soil data, fertilizer result).
    - **language**: 'en' for English or 'ta' for Tamil.

    Returns the assistant's reply as a Markdown-formatted string.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    logger.info(
        "Chat request | lang=%s | history_turns=%d | has_context=%s",
        request.language,
        len(request.history),
        request.context is not None,
    )

    response = await chat_service.chat(
        message=request.message,
        history=request.history,
        context=request.context,
        language=request.language or "en",
    )
    return response
