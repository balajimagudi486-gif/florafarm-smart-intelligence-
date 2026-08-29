# FloraFarm — Fertilizer recommendation service (Random Forest / Fertilizer Dataset)
import json
import logging
from pathlib import Path
from typing import List

import numpy as np

logger = logging.getLogger("florafarm.fertilizer")

MODELS_DIR    = Path(__file__).parent.parent.parent / "models" / "fertilizer"
MODEL_PATH    = MODELS_DIR / "CROPORA_fertilizer_model.pkl"
CLASSES_PATH  = MODELS_DIR / "CROPORA_fertilizer_classes.json"
METADATA_PATH = MODELS_DIR / "CROPORA_fertilizer_metadata.json"

ORGANIC_FERTILIZERS = {"Compost"}

# Column order must match the training DataFrame exactly
MODEL_COLUMNS = [
    "Soil_Type", "Soil_pH", "Soil_Moisture", "Organic_Carbon",
    "Electrical_Conductivity", "Nitrogen_Level", "Phosphorus_Level",
    "Potassium_Level", "Temperature", "Humidity", "Rainfall",
    "Crop_Type", "Crop_Growth_Stage", "Season", "Irrigation_Type",
    "Previous_Crop", "Region", "Fertilizer_Used_Last_Season", "Yield_Last_Season",
]

# Sensible defaults for fields not exposed in the API
FIELD_DEFAULTS = {
    "Temperature": 25.0,
    "Humidity": 60.0,
    "Rainfall": 100.0,
    "Fertilizer_Used_Last_Season": 120.0,
    "Yield_Last_Season": 3.5,
}


def _build_dataframe(request_data: dict):
    """
    Build a single-row pandas DataFrame from the API request dict.
    Missing columns are filled with FIELD_DEFAULTS so the trained
    ColumnTransformer/OneHotEncoder pipeline receives the correct schema.
    """
    import pandas as pd
    row = {col: request_data.get(col, FIELD_DEFAULTS.get(col, 0)) for col in MODEL_COLUMNS}
    return pd.DataFrame([row])


class FertilizerService:
    def __init__(self):
        self.model = None
        self.classes: List[str] = []
        self.model_loaded = False
        self.demo_mode = True

    def load_model(self):
        """Load sklearn pipeline at startup. Falls back to demo mode."""
        if CLASSES_PATH.exists():
            with open(CLASSES_PATH, "r") as f:
                self.classes = json.load(f)
            logger.info(f"Loaded {len(self.classes)} fertilizer classes.")

        if not MODEL_PATH.exists():
            logger.warning(f"Fertilizer model not found at {MODEL_PATH}. Running in DEMO MODE.")
            self.demo_mode = True
            return

        try:
            import joblib
            logger.info("Loading FloraFarm fertilizer model (Random Forest)...")
            self.model = joblib.load(str(MODEL_PATH))
            self.model_loaded = True
            self.demo_mode = False
            logger.info("✅ Fertilizer model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load fertilizer model: {e}")
            self.demo_mode = True

    def recommend(self, request_data: dict) -> dict:
        """Return fertilizer recommendation with top-3 options."""
        if self.demo_mode or self.model is None:
            logger.warning(
                "⚠️  FertilizerService.recommend() called in DEMO MODE — "
                "returning hardcoded Urea demo result."
            )
            return self._demo_recommendation()

        try:
            import traceback as tb
            df = _build_dataframe(request_data)
            proba = self.model.predict_proba(df)[0]
            classes = self.model.classes_

            top3_idx = np.argsort(proba)[::-1][:3]
            top_options = []
            for idx in top3_idx:
                name = str(classes[idx])
                ftype = "Organic" if name in ORGANIC_FERTILIZERS else "Inorganic"
                top_options.append({
                    "fertilizer": name,
                    "confidence": round(float(proba[idx]) * 100, 2),
                    "type": ftype,
                })

            logger.info(
                "🌱 Fertilizer top-3: " +
                " | ".join(f"{o['fertilizer']} ({o['confidence']}%)" for o in top_options)
            )

            best = top_options[0]
            return {
                "fertilizer": best["fertilizer"],
                "type": best["type"],
                "confidence": best["confidence"],
                "top_options": top_options,
                "is_demo": False,
            }
        except Exception as e:
            import traceback as tb_mod
            logger.error(f"❌ Fertilizer recommendation error: {e}\n{tb_mod.format_exc()}")
            return self._demo_recommendation()

    def _demo_recommendation(self) -> dict:
        return {
            "fertilizer": "Urea",
            "type": "Inorganic",
            "confidence": 82.45,
            "top_options": [
                {"fertilizer": "Urea",    "confidence": 82.45, "type": "Inorganic"},
                {"fertilizer": "NPK",     "confidence": 10.31, "type": "Inorganic"},
                {"fertilizer": "Compost", "confidence":  4.27, "type": "Organic"},
            ],
            "is_demo": True,
        }


fertilizer_service = FertilizerService()
