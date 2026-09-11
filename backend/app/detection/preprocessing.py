"""Preprocessing pipeline: grayscale → CLAHE → Gaussian blur."""
import cv2
import numpy as np
from app.core.config import DetectionConfig


def preprocess(image_bgr: np.ndarray, cfg: DetectionConfig) -> tuple[np.ndarray, np.ndarray]:
    """
    Returns:
        gray    – raw grayscale (uint8)
        enhanced – CLAHE + blurred grayscale (uint8)
    """
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)

    clahe = cv2.createCLAHE(
        clipLimit=cfg.clahe_clip_limit,
        tileGridSize=cfg.clahe_tile_size,
    )
    enhanced = clahe.apply(gray)

    kernel = cfg.blur_kernel
    if kernel % 2 == 0:
        kernel += 1
    blurred = cv2.GaussianBlur(enhanced, (kernel, kernel), cfg.blur_sigma)

    return gray, blurred
