# FloraFarm — Disease prediction service (MobileNetV2 / PlantVillage)
import json
import logging
import os
from pathlib import Path
from typing import List, Tuple

import numpy as np

logger = logging.getLogger("florafarm.disease")

MODELS_DIR = Path(__file__).parent.parent.parent / "models" / "disease"
MODEL_PATH = MODELS_DIR / "CROPORA_disease_model.keras"
CLASSES_PATH = MODELS_DIR / "CROPORA_disease_classes.json"

ORGANIC_KEYWORDS = {"healthy"}


def _severity_from_confidence(confidence: float, is_healthy: bool) -> str:
    if is_healthy:
        return "Healthy"
    if confidence >= 90:
        return "High"
    if confidence >= 70:
        return "Moderate"
    return "Low"


def _parse_label(raw_label: str) -> Tuple[str, str]:
    """Split 'Tomato___Early_blight' → ('Tomato', 'Early Blight')."""
    parts = raw_label.split("___", 1)
    crop = parts[0].replace("_", " ").strip()
    disease = parts[1].replace("_", " ").strip() if len(parts) > 1 else "Unknown"
    return crop, disease


class DiseaseService:
    def __init__(self):
        self.model = None
        self.classes: List[str] = []
        self.model_loaded = False
        self.demo_mode = True

    def load_model(self):
        """Load Keras model at startup. Falls back to demo mode if unavailable."""
        # Load class labels
        if CLASSES_PATH.exists():
            with open(CLASSES_PATH, "r") as f:
                self.classes = json.load(f)
            logger.info(f"Loaded {len(self.classes)} disease classes.")
        else:
            logger.warning("Disease classes file not found. Using built-in defaults.")
            self.classes = ["Tomato___Early_blight"]

        if not MODEL_PATH.exists():
            logger.warning(f"Disease model not found at {MODEL_PATH}. Running in DEMO MODE.")
            self.demo_mode = True
            return

        try:
            import tensorflow as tf

            # ── NVIDIA GPU configuration ──────────────────────────────────────
            gpus = tf.config.list_physical_devices('GPU')
            if gpus:
                try:
                    for gpu in gpus:
                        tf.config.experimental.set_memory_growth(gpu, True)
                    logger.info(f"✅ NVIDIA GPU detected: {[g.name for g in gpus]}. Using GPU for inference.")
                except RuntimeError as gpu_err:
                    logger.warning(f"GPU configuration warning: {gpu_err}")
            else:
                logger.info("⚠️ No NVIDIA GPU found. Running on CPU.")
            # ──────────────────────────────────────────────────────────────────

            logger.info("Loading FloraFarm disease model (MobileNetV2)…")
            self.model = tf.keras.models.load_model(str(MODEL_PATH))
            self.model_loaded = True
            self.demo_mode = False
            logger.info("✅ Disease model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load disease model: {e}")
            self.demo_mode = True

    def predict(self, image_data: bytes) -> dict:
        """Run inference and return structured prediction dict."""
        if self.demo_mode or self.model is None:
            logger.warning(
                "⚠️  DiseaseService.predict() called in DEMO MODE — "
                "returning hardcoded Tomato demo result. "
                "Check that the model loaded correctly at startup."
            )
            return self._demo_prediction()

        try:
            import traceback
            from app.utils.image_utils import load_image_for_model
            from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

            arr = load_image_for_model(image_data)
            # Apply MobileNetV2 preprocessing: scales pixels to [-1, 1]
            arr = preprocess_input(arr)
            batch = np.expand_dims(arr, axis=0)

            preds = self.model.predict(batch, verbose=0)[0]
            top3_idx = np.argsort(preds)[::-1][:3]

            top_predictions = []
            for idx in top3_idx:
                label = self.classes[idx] if idx < len(self.classes) else "Unknown"
                crop, disease = _parse_label(label)
                conf = round(float(preds[idx]) * 100, 2)
                top_predictions.append({
                    "label": label,
                    "crop": crop,
                    "disease": disease,
                    "confidence": conf,
                })

            # Log top predictions for debugging
            logger.info(
                "🔍 Top predictions: " +
                " | ".join(f"{p['crop']} / {p['disease']} ({p['confidence']}%)" for p in top_predictions)
            )

            best = top_predictions[0]
            is_healthy = "healthy" in best["disease"].lower()
            severity = _severity_from_confidence(best["confidence"], is_healthy)

            return {
                "crop": best["crop"],
                "disease": best["disease"],
                "confidence": best["confidence"],
                "severity": severity,
                "top_predictions": top_predictions,
                "is_demo": False,
            }
        except Exception as e:
            import traceback as tb
            logger.error(f"❌ Disease prediction error: {e}\n{tb.format_exc()}")
            logger.error(
                "⚠️  Falling back to DEMO prediction (Tomato). "
                "Fix the error above to get real predictions."
            )
            return self._demo_prediction()

    def _demo_prediction(self) -> dict:
        return {
            "crop": "Tomato",
            "disease": "Early Blight",
            "confidence": 96.4,
            "severity": "Moderate",
            "top_predictions": [
                {"label": "Tomato___Early_blight", "crop": "Tomato", "disease": "Early Blight", "confidence": 96.4},
                {"label": "Tomato___Late_blight", "crop": "Tomato", "disease": "Late Blight", "confidence": 2.1},
                {"label": "Tomato___Leaf_Mold", "crop": "Tomato", "disease": "Leaf Mold", "confidence": 0.8},
            ],
            "is_demo": True,
        }


disease_service = DiseaseService()
