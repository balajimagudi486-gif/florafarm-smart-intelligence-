"""
FloraFarm — Fertilizer Model Trainer
=====================================
Extracted from notebooks/Untitled24.ipynb

Downloads the fertilizer dataset from Kaggle and trains a
RandomForest pipeline, then saves the .pkl to:
  backend/models/fertilizer/CROPORA_fertilizer_model.pkl

Requirements:
  pip install kagglehub scikit-learn pandas joblib

Usage:
  python train_fertilizer.py
"""

import json
import os
import sys
from pathlib import Path

# ── Output paths ───────────────────────────────────────────────────────────────
SCRIPT_DIR  = Path(__file__).parent
OUTPUT_DIR  = SCRIPT_DIR.parent / "backend" / "models" / "fertilizer"
MODEL_PATH    = OUTPUT_DIR / "CROPORA_fertilizer_model.pkl"
CLASSES_PATH  = OUTPUT_DIR / "CROPORA_fertilizer_classes.json"
METADATA_PATH = OUTPUT_DIR / "CROPORA_fertilizer_metadata.json"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ── Check if model already exists ─────────────────────────────────────────────
if MODEL_PATH.exists():
    size_mb = MODEL_PATH.stat().st_size / (1024 ** 2)
    print(f"[OK] Model already exists at: {MODEL_PATH}  ({size_mb:.2f} MB)")
    print("   Delete the file and re-run if you want to retrain.")
    sys.exit(0)

print("=" * 60)
print("  FloraFarm — Fertilizer Model Training")
print("=" * 60)

# ── Step 1: Install / Import dependencies ─────────────────────────────────────
print("\n[Step 1/6] Importing libraries...")
try:
    import pandas as pd
    import numpy as np
    from sklearn.model_selection import train_test_split
    from sklearn.compose import ColumnTransformer
    from sklearn.preprocessing import OneHotEncoder
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.pipeline import Pipeline
    from sklearn.metrics import classification_report
    import joblib
except ImportError as e:
    print(f"[ERROR] Missing dependency: {e}")
    print("Run:  pip install scikit-learn pandas joblib")
    sys.exit(1)

# ── Step 2: Download dataset from Kaggle ──────────────────────────────────────
print("\n[Step 2/6] Downloading fertilizer dataset from Kaggle...")
try:
    # pyrefly: ignore [missing-import]
    import kagglehub
    fertilizer_path = kagglehub.dataset_download(
        "miadul/fertilizer-recommendation-dataset"
    )
    print(f"   Dataset path: {fertilizer_path}")
except Exception as e:
    print(f"[ERROR] Failed to download dataset: {e}")
    print("   Make sure kagglehub is installed: pip install kagglehub")
    print("   Or set up Kaggle API credentials.")
    sys.exit(1)

# ── Step 3: Load CSV ───────────────────────────────────────────────────────────
print("\n[Step 3/6] Loading dataset...")
csv_files = list(Path(fertilizer_path).rglob("*.csv"))
if not csv_files:
    print("[ERROR] No CSV found in downloaded dataset.")
    sys.exit(1)

csv_path = csv_files[0]
print(f"   Using: {csv_path}")

fertilizer_df = pd.read_csv(csv_path)
print(f"   Shape: {fertilizer_df.shape}")
print(f"   Columns: {fertilizer_df.columns.tolist()}")

# ── Step 4: Prepare features ──────────────────────────────────────────────────
TARGET = "Recommended_Fertilizer"

X = fertilizer_df.drop(columns=[TARGET])
y = fertilizer_df[TARGET]

categorical_features = X.select_dtypes(include=["object", "category"]).columns.tolist()
numerical_features   = X.select_dtypes(include=["int64", "float64"]).columns.tolist()

print(f"\n   Categorical features: {categorical_features}")
print(f"   Numerical features:   {numerical_features}")
print(f"   Target classes:       {sorted(y.unique())}")

# ── Step 5: Train/test split ──────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42, stratify=y
)
print(f"\n   Training samples: {len(X_train)}")
print(f"   Testing samples:  {len(X_test)}")

# ── Step 6: Build and train pipeline ──────────────────────────────────────────
print("\n[Step 4/6] Building Random Forest pipeline...")

preprocessor = ColumnTransformer(
    transformers=[
        ("categorical", OneHotEncoder(handle_unknown="ignore"), categorical_features),
        ("numerical",   "passthrough",                          numerical_features),
    ]
)

rf_model = RandomForestClassifier(
    n_estimators=300,
    max_depth=None,
    min_samples_split=2,
    min_samples_leaf=1,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1,
)

fertilizer_pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier",   rf_model),
])

print("\n[Step 5/6] Training Fertilizer AI...  (may take 1-3 minutes)")
fertilizer_pipeline.fit(X_train, y_train)

# ── Step 7: Evaluate ──────────────────────────────────────────────────────────
train_acc = fertilizer_pipeline.score(X_train, y_train)
test_acc  = fertilizer_pipeline.score(X_test,  y_test)
print(f"\n   Train accuracy: {train_acc * 100:.2f}%")
print(f"   Test  accuracy: {test_acc  * 100:.2f}%")

y_pred = fertilizer_pipeline.predict(X_test)
print("\n" + classification_report(y_test, y_pred, digits=4))

# ── Step 8: Save model + artifacts ────────────────────────────────────────────
print("\n[Step 6/6] Saving model to backend/models/fertilizer/ ...")

joblib.dump(fertilizer_pipeline, str(MODEL_PATH))

fertilizer_classes = sorted(fertilizer_df[TARGET].unique().tolist())
with open(CLASSES_PATH, "w") as f:
    json.dump(fertilizer_classes, f, indent=4)

metadata = {
    "model": "RandomForestClassifier",
    "task": "Multiclass Fertilizer Recommendation",
    "target": TARGET,
    "num_classes": len(fertilizer_classes),
    "classes": fertilizer_classes,
    "organic_fertilizers": ["Compost"],
    "inorganic_fertilizers": ["MOP", "Urea", "Zinc Sulphate", "NPK", "DAP", "SSP"],
    "training_samples": len(X_train),
    "testing_samples": len(X_test),
    "train_accuracy": round(train_acc * 100, 2),
    "test_accuracy": round(test_acc * 100, 2),
}
with open(METADATA_PATH, "w") as f:
    json.dump(metadata, f, indent=4)

size_mb = MODEL_PATH.stat().st_size / (1024 ** 2)

print("\n" + "=" * 60)
print("  [OK] FERTILIZER MODEL SAVED SUCCESSFULLY")
print("=" * 60)
print(f"  Model:    {MODEL_PATH}  ({size_mb:.2f} MB)")
print(f"  Classes:  {CLASSES_PATH}")
print(f"  Metadata: {METADATA_PATH}")
print(f"\n  Test Accuracy: {test_acc * 100:.2f}%")
print("\n  Restart the FloraFarm backend to load the new model.")
print("=" * 60)
