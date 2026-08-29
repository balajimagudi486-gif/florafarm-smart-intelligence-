# FloraFarm — Image utility helpers
import io
from PIL import Image

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/jpg", "image/png"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


def validate_image_bytes(data: bytes, content_type: str) -> None:
    """Raise ValueError with a user-friendly message if validation fails."""
    if len(data) > MAX_FILE_SIZE_BYTES:
        raise ValueError("Image size must be below 10 MB.")

    if content_type.lower() not in ALLOWED_CONTENT_TYPES:
        raise ValueError("Please upload a valid JPG, JPEG or PNG image.")

    # Try to open with Pillow to confirm it is a real image
    try:
        img = Image.open(io.BytesIO(data))
        img.verify()
    except Exception:
        raise ValueError("Please upload a valid JPG, JPEG or PNG image.")

    # Check if it's a crop/plant image by analyzing colors
    try:
        # Re-open image since verify() closes the file pointer
        img = Image.open(io.BytesIO(data)).convert("RGB")
        img_small = img.resize((32, 32))
        
        plant_pixels = 0
        total_pixels = 32 * 32
        
        for x in range(32):
            for y in range(32):
                r, g, b = img_small.getpixel((x, y))
                
                # Check for green hues
                if g > r * 0.9 and g > b * 0.9:
                    plant_pixels += 1
                # Check for yellow/brown/orange hues (soil or diseased leaves)
                elif r > b * 1.1 and g > b * 1.1 and abs(r - g) < 60:
                    plant_pixels += 1
                # Check for red/purplish plant pigment or lesions
                elif r > g * 1.1 and r > b * 1.1 and (g + b) > 30:
                    plant_pixels += 1
                # Check for general warm plant colors
                elif (g > 35 and r > 35 and b < 110 and (g + r) > b * 1.4):
                    plant_pixels += 1

        plant_ratio = plant_pixels / total_pixels
        # If plant/crop-like color pixels are less than 8%, reject as non-crop image
        if plant_ratio < 0.08:
            raise ValueError(
                "Please upload a crop image. "
                "The uploaded image does not appear to be a crop or plant. "
                "Non-crop images are not supported."
            )
    except ValueError as e:
        raise e
    except Exception:
        raise ValueError("Please upload a valid JPG, JPEG or PNG image.")


def load_image_for_model(data: bytes) -> "np.ndarray":
    """Load image bytes, convert to RGB, resize to 224×224."""
    import numpy as np
    img = Image.open(io.BytesIO(data)).convert("RGB")
    img = img.resize((224, 224), Image.LANCZOS)
    arr = np.array(img, dtype=np.float32)
    return arr

