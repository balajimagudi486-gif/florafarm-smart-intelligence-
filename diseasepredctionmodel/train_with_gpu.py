"""
FloraFarm — Disease Detection Model Training Script
====================================================
Trains a MobileNetV2-based crop disease classifier on the PlantVillage dataset.
Automatically uses NVIDIA GPU (CUDA) if available for fast training.

Requirements:
  pip install tensorflow pillow numpy

Usage:
  python train_with_gpu.py --data_dir /path/to/PlantVillage --epochs 20 --batch 32

PlantVillage dataset: https://www.kaggle.com/datasets/emmarex/plantdisease
"""

import argparse
import json
import logging
import os
from pathlib import Path

import numpy as np

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger("florafarm.train")

# ── Paths ─────────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
OUTPUT_MODEL = SCRIPT_DIR / "CROPORA_disease_model.keras"
OUTPUT_CLASSES = SCRIPT_DIR / "CROPORA_disease_classes.json"

# ── Hyper-parameters (overridable via CLI) ────────────────────────────────────
IMAGE_SIZE = (224, 224)
DEFAULT_EPOCHS = 20
DEFAULT_BATCH = 32
DEFAULT_LR = 1e-4
VALIDATION_SPLIT = 0.15
FINE_TUNE_AT = 100          # Unfreeze MobileNetV2 layers from this index onward
FINE_TUNE_EPOCHS = 10


def configure_gpu() -> None:
    """Enable NVIDIA GPU with memory growth to avoid OOM errors."""
    import tensorflow as tf

    gpus = tf.config.list_physical_devices("GPU")
    if gpus:
        try:
            for gpu in gpus:
                tf.config.experimental.set_memory_growth(gpu, True)
            logger.info(
                f"✅ NVIDIA GPU detected: {[g.name for g in gpus]}. "
                f"GPU memory growth enabled."
            )
        except RuntimeError as e:
            logger.warning(f"GPU configuration warning: {e}")
    else:
        logger.warning(
            "⚠️  No NVIDIA GPU detected. Training will run on CPU (slower). "
            "Install CUDA + cuDNN and tensorflow-gpu for GPU acceleration."
        )


def build_model(num_classes: int):
    """
    Build a MobileNetV2 transfer-learning model.
    Base is frozen initially; fine-tuning unlocks upper layers.
    """
    import tensorflow as tf
    from tensorflow.keras import layers, Model
    from tensorflow.keras.applications import MobileNetV2
    from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

    base = MobileNetV2(
        input_shape=(*IMAGE_SIZE, 3),
        include_top=False,
        weights="imagenet",
    )
    base.trainable = False  # Freeze base for warm-up phase

    inputs = tf.keras.Input(shape=(*IMAGE_SIZE, 3))
    x = preprocess_input(inputs)
    x = base(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.4)(x)
    x = layers.Dense(256, activation="relu")(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    model = Model(inputs, outputs, name="FloraFarm_DiseaseNet")
    return model, base


def build_data_generators(data_dir: str, batch_size: int):
    """Create train/validation data generators with augmentation."""
    from tensorflow.keras.preprocessing.image import ImageDataGenerator

    train_gen = ImageDataGenerator(
        rotation_range=30,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.15,
        zoom_range=0.2,
        horizontal_flip=True,
        brightness_range=[0.7, 1.3],
        fill_mode="nearest",
        validation_split=VALIDATION_SPLIT,
    )

    val_gen = ImageDataGenerator(validation_split=VALIDATION_SPLIT)

    train_ds = train_gen.flow_from_directory(
        data_dir,
        target_size=IMAGE_SIZE,
        batch_size=batch_size,
        class_mode="categorical",
        subset="training",
        shuffle=True,
    )

    val_ds = val_gen.flow_from_directory(
        data_dir,
        target_size=IMAGE_SIZE,
        batch_size=batch_size,
        class_mode="categorical",
        subset="validation",
        shuffle=False,
    )

    return train_ds, val_ds


def train(args: argparse.Namespace) -> None:
    import tensorflow as tf

    configure_gpu()

    logger.info(f"📂 Loading dataset from: {args.data_dir}")
    train_ds, val_ds = build_data_generators(args.data_dir, args.batch)

    num_classes = len(train_ds.class_indices)
    class_names = [k for k, v in sorted(train_ds.class_indices.items(), key=lambda x: x[1])]
    logger.info(f"🌿 Found {num_classes} disease classes.")

    # ── Phase 1: Warm-up (frozen base) ───────────────────────────────────────
    logger.info("🔥 Phase 1: Warm-up training (base frozen)…")
    model, base_model = build_model(num_classes)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=args.lr),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.summary()

    callbacks = [
        tf.keras.callbacks.EarlyStopping(
            patience=5, restore_best_weights=True, monitor="val_accuracy"
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            factor=0.5, patience=3, min_lr=1e-7, monitor="val_loss"
        ),
        tf.keras.callbacks.ModelCheckpoint(
            str(OUTPUT_MODEL),
            save_best_only=True,
            monitor="val_accuracy",
            verbose=1,
        ),
    ]

    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=args.epochs,
        callbacks=callbacks,
    )

    # ── Phase 2: Fine-tuning (unfreeze upper layers) ──────────────────────────
    logger.info(
        f"🔧 Phase 2: Fine-tuning from layer {FINE_TUNE_AT} of MobileNetV2…"
    )
    base_model.trainable = True
    for layer in base_model.layers[:FINE_TUNE_AT]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=args.lr / 10),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=FINE_TUNE_EPOCHS,
        callbacks=callbacks,
    )

    # ── Save outputs ──────────────────────────────────────────────────────────
    model.save(str(OUTPUT_MODEL))
    logger.info(f"✅ Model saved → {OUTPUT_MODEL}")

    with open(OUTPUT_CLASSES, "w") as f:
        json.dump(class_names, f, indent=2)
    logger.info(f"✅ Classes saved → {OUTPUT_CLASSES}")

    # ── Final evaluation ──────────────────────────────────────────────────────
    logger.info("📊 Running final validation evaluation…")
    loss, acc = model.evaluate(val_ds, verbose=1)
    logger.info(f"🎯 Final val accuracy: {acc * 100:.2f}%  |  Loss: {loss:.4f}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="FloraFarm — Train disease detection model with NVIDIA GPU"
    )
    parser.add_argument(
        "--data_dir",
        type=str,
        required=True,
        help="Path to PlantVillage dataset root (contains one folder per class).",
    )
    parser.add_argument("--epochs", type=int, default=DEFAULT_EPOCHS, help="Warm-up epochs")
    parser.add_argument("--batch", type=int, default=DEFAULT_BATCH, help="Batch size")
    parser.add_argument("--lr", type=float, default=DEFAULT_LR, help="Initial learning rate")

    args = parser.parse_args()

    if not Path(args.data_dir).is_dir():
        logger.error(f"❌ Dataset directory not found: {args.data_dir}")
        raise SystemExit(1)

    train(args)


if __name__ == "__main__":
    main()
