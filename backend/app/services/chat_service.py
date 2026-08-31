# FloraFarm — Chat Service (Local HuggingFace Model + Gemini Fallback)
import asyncio
import json
import logging
import os
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv

from app.schemas.chat import ChatContext, ChatHistoryEntry, ChatResponse

load_dotenv()

logger = logging.getLogger("florafarm.chat")

# ---------------------------------------------------------------------------
# System prompt — FloraFarm Agri-Advisor persona
# ---------------------------------------------------------------------------
_SYSTEM_PROMPT = """You are FloraFarm Agri-Advisor, an expert agronomist and agricultural consultant embedded inside the FloraFarm AI platform.

Your role is to provide **actionable, safe, and science-backed farming advice** to farmers, gardeners, and agri-enthusiasts. You have deep expertise in:
- Crop disease identification, symptoms, and management (chemical & organic treatments)
- Fertilizer selection, NPK ratios, dosage instructions, and application timing
- Soil health, pH management, irrigation scheduling, and drainage
- Integrated Pest Management (IPM) and organic farming practices
- Seasonal crop planning and harvest timing

**Communication style:**
- Be warm, practical, and farmer-friendly — avoid overly academic jargon.
- Use **bold headings**, bullet points, and numbered steps for clarity.
- Always specify dosage units (e.g., "2 kg/acre", "500 mL per 100 L water").
- Include a brief safety note when recommending chemical inputs.
- If you're uncertain, say so honestly and recommend consulting a local agronomist.

**Safety guardrails:**
- Never recommend banned pesticides or harmful chemicals.
- Always mention PPE (gloves, mask) when handling agrochemicals.
- Remind users that AI advice supplements, not replaces, professional field diagnosis.

Keep responses concise (3–5 paragraphs max) unless the user asks for a detailed breakdown.
"""

_FALLBACK_REPLY = (
    "I'm sorry, I'm having trouble connecting to the AI service right now. "
    "Please ensure either the local HuggingFace model in `hmodel/` or `GEMINI_API_KEY` "
    "is configured, then try again. In the meantime, feel free to browse the FloraFarm "
    "disease and fertilizer analysis tools for immediate insights."
)


def _build_context_block(context: Optional[ChatContext]) -> str:
    """Convert optional UI context into a structured prompt injection."""
    if context is None:
        return ""

    parts: List[str] = []

    if context.disease_result:
        dr = context.disease_result
        parts.append(
            f"[CURRENT SCAN — Disease Analysis]\n"
            f"Crop: {dr.get('crop', 'Unknown')}\n"
            f"Detected Condition: {dr.get('disease', 'Unknown')}\n"
            f"Severity: {dr.get('severity', 'Unknown')}\n"
            f"Confidence: {dr.get('confidence', 0):.1f}%\n"
            f"The user is currently viewing this disease prediction. "
            f"Tailor your advice to this specific condition if relevant."
        )

    if context.fertilizer_result:
        fr = context.fertilizer_result
        parts.append(
            f"[CURRENT SCAN — Fertilizer Recommendation]\n"
            f"Recommended Fertilizer: {fr.get('fertilizer', 'Unknown')}\n"
            f"Type: {fr.get('type', 'Unknown')}\n"
            f"Confidence: {fr.get('confidence', 0):.1f}%\n"
            f"The user is currently viewing this fertilizer recommendation. "
            f"Tailor your advice to this specific recommendation if relevant."
        )

    if context.soil_data:
        sd = context.soil_data
        soil_summary = ", ".join(f"{k}: {v}" for k, v in sd.items() if v is not None)
        if soil_summary:
            parts.append(f"[SOIL / CROP DATA]\n{soil_summary}")

    if not parts:
        return ""

    return "\n\n---\n**Context from the user's current FloraFarm session:**\n" + "\n\n".join(parts) + "\n---\n\n"


class ChatService:
    """
    FloraFarm Agri-Advisor Chat Service.
    Supports:
    1. Local HuggingFace Transformer Model (e.g. Qwen3-0.6B uploaded in `hmodel/`)
    2. Google Gemini API (Fallback if local model is unavailable)
    """

    def __init__(self):
        self.active_backend: str = "none"  # "local_hf", "gemini", or "none"
        self._hf_tokenizer = None
        self._hf_model = None
        self._hf_device = "cpu"
        self._gemini_client = None
        self._gemini_model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        
        # Path to local model (default: hmodel in workspace root)
        workspace_root = Path(__file__).resolve().parents[3]
        default_hmodel_path = workspace_root / "hmodel"
        self.model_path = os.getenv("LOCAL_MODEL_PATH", str(default_hmodel_path))

    def load_model(self):
        """Initialise backends (called at app startup). Try Local HF first, then Gemini."""
        if self._try_load_local_hf():
            return
        self._try_load_gemini()

    def _try_load_local_hf(self) -> bool:
        """Attempt to load local HuggingFace model from hmodel directory."""
        if not os.path.exists(self.model_path):
            logger.info("Local model path '%s' does not exist.", self.model_path)
            return False

        config_file = os.path.join(self.model_path, "config.json")
        if not os.path.exists(config_file):
            logger.info("No config.json found in '%s'.", self.model_path)
            return False

        try:
            import torch
            from transformers import AutoModelForCausalLM, AutoTokenizer

            logger.info("🤗 Loading local HuggingFace model from '%s'...", self.model_path)
            
            self._hf_tokenizer = AutoTokenizer.from_pretrained(self.model_path, trust_remote_code=True)
            
            # Determine torch device & dtype
            if torch.cuda.is_available():
                self._hf_device = "cuda"
                dtype = torch.float16
            else:
                self._hf_device = "cpu"
                dtype = torch.float32

            self._hf_model = AutoModelForCausalLM.from_pretrained(
                self.model_path,
                torch_dtype=dtype,
                device_map=self._hf_device,
                trust_remote_code=True,
            )
            self._hf_model.eval()

            self.active_backend = "local_hf"
            logger.info("✅ Local HuggingFace model loaded successfully on device '%s'.", self._hf_device)
            return True
        except ImportError:
            logger.warning(
                "transformers or torch not available for local model. "
                "Install with: pip install torch transformers accelerate"
            )
            return False
        except Exception as exc:
            logger.error("Failed to load local HuggingFace model: %s", exc)
            return False

    def _try_load_gemini(self) -> bool:
        """Attempt to load Google Gemini API client."""
        api_key = os.getenv("GEMINI_API_KEY", "").strip()
        if not api_key:
            logger.warning("GEMINI_API_KEY is not set. Gemini fallback disabled.")
            return False
        try:
            import google.generativeai as genai

            genai.configure(api_key=api_key)
            self._gemini_client = genai
            self.active_backend = "gemini"
            logger.info("✅ Gemini chat client initialised (model: %s).", self._gemini_model_name)
            return True
        except Exception as exc:
            logger.error("Failed to initialise Gemini client: %s", exc)
            return False

    @property
    def is_ready(self) -> bool:
        return self.active_backend != "none"

    async def chat(
        self,
        message: str,
        history: List[ChatHistoryEntry],
        context: Optional[ChatContext] = None,
    ) -> ChatResponse:
        """Send a user message and return the assistant reply."""
        # If model hasn't been loaded yet, try loading
        if self.active_backend == "none":
            self.load_model()

        if self.active_backend == "local_hf":
            return await self._chat_local_hf(message, history, context)
        elif self.active_backend == "gemini":
            return await self._chat_gemini(message, history, context)
        else:
            return ChatResponse(reply=_FALLBACK_REPLY, error=True)

    async def _chat_local_hf(
        self,
        message: str,
        history: List[ChatHistoryEntry],
        context: Optional[ChatContext] = None,
    ) -> ChatResponse:
        """Generate response using local HuggingFace model in an executor thread."""
        loop = asyncio.get_running_loop()
        try:
            reply_text = await loop.run_in_executor(
                None, self._sync_generate_local_hf, message, history, context
            )
            return ChatResponse(reply=reply_text, error=False)
        except Exception as exc:
            logger.error("Local HF generation error: %s", exc)
            # Try falling back to Gemini if available
            if self._try_load_gemini():
                return await self._chat_gemini(message, history, context)
            return ChatResponse(
                reply="An error occurred while generating advice from the local AI model.",
                error=True,
            )

    def _sync_generate_local_hf(
        self,
        message: str,
        history: List[ChatHistoryEntry],
        context: Optional[ChatContext] = None,
    ) -> str:
        """Synchronous generation using PyTorch + HuggingFace."""
        import torch

        context_block = _build_context_block(context)
        system_content = _SYSTEM_PROMPT + context_block

        # Build message structure
        messages = [{"role": "system", "content": system_content}]
        for turn in history:
            role = "user" if turn.role == "user" else "assistant"
            messages.append({"role": role, "content": turn.content})
        messages.append({"role": "user", "content": message})

        # Apply chat template if supported
        if hasattr(self._hf_tokenizer, "apply_chat_template"):
            try:
                prompt = self._hf_tokenizer.apply_chat_template(
                    messages,
                    tokenize=False,
                    add_generation_prompt=True,
                )
            except Exception:
                prompt = self._format_manual_chat_prompt(system_content, history, message)
        else:
            prompt = self._format_manual_chat_prompt(system_content, history, message)

        inputs = self._hf_tokenizer(prompt, return_tensors="pt").to(self._hf_device)

        # Ensure PyTorch uses multiple CPU threads for speed
        if self._hf_device == "cpu":
            try:
                num_threads = max(1, (os.cpu_count() or 4) - 1)
                torch.set_num_threads(num_threads)
            except Exception:
                pass

        # Identify all EOS / end-of-turn tokens for Qwen3
        eos_ids = [self._hf_tokenizer.eos_token_id]
        for special in ["<|im_end|>", "<|endoftext|>"]:
            try:
                tid = self._hf_tokenizer.convert_tokens_to_ids(special)
                if tid is not None and tid not in eos_ids:
                    eos_ids.append(tid)
            except Exception:
                pass

        with torch.no_grad():
            outputs = self._hf_model.generate(
                **inputs,
                max_new_tokens=256,
                temperature=0.6,
                top_p=0.9,
                repetition_penalty=1.1,
                do_sample=True,
                eos_token_id=eos_ids,
                pad_token_id=self._hf_tokenizer.eos_token_id or eos_ids[0],
            )

        # Extract newly generated tokens (slice off input prompt)
        input_length = inputs.input_ids.shape[1]
        generated_tokens = outputs[0][input_length:]
        response_text = self._hf_tokenizer.decode(generated_tokens, skip_special_tokens=True).strip()

        # Clean up <think>...</think> tags if produced (e.g. Qwen thinking mode)
        if "<think>" in response_text and "</think>" in response_text:
            response_text = response_text.split("</think>")[-1].strip()
        elif "<think>" in response_text:
            response_text = response_text.split("<think>")[0].strip()

        return response_text

    def _format_manual_chat_prompt(
        self,
        system_content: str,
        history: List[ChatHistoryEntry],
        message: str,
    ) -> str:
        """Fallback chat prompt builder using ChatML standard format."""
        prompt = f"<|im_start|>system\n{system_content}<|im_end|>\n"
        for turn in history:
            role = "user" if turn.role == "user" else "assistant"
            prompt += f"<|im_start|>{role}\n{turn.content}<|im_end|>\n"
        prompt += f"<|im_start|>user\n{message}<|im_end|>\n<|im_start|>assistant\n"
        return prompt

    async def _chat_gemini(
        self,
        message: str,
        history: List[ChatHistoryEntry],
        context: Optional[ChatContext] = None,
    ) -> ChatResponse:
        """Generate response using Google Gemini API."""
        try:
            context_block = _build_context_block(context)
            system_instruction = _SYSTEM_PROMPT + context_block

            contents = []
            for turn in history:
                role = "user" if turn.role == "user" else "model"
                contents.append({"role": role, "parts": [{"text": turn.content}]})

            contents.append({"role": "user", "parts": [{"text": message}]})

            model = self._gemini_client.GenerativeModel(
                model_name=self._gemini_model_name,
                system_instruction=system_instruction,
            )
            response = model.generate_content(contents)
            reply_text = response.text.strip()
            return ChatResponse(reply=reply_text, error=False)

        except Exception as exc:
            logger.error("Gemini chat error: %s", exc)
            return ChatResponse(
                reply="I encountered an error while generating advice from the AI service.",
                error=True,
            )


# Singleton instance
chat_service = ChatService()
