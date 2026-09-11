"""ROI (Region of Interest) detection — isolates the foam area."""
import cv2
import numpy as np
from app.core.config import DetectionConfig


def detect_roi(image_bgr: np.ndarray, _cfg: DetectionConfig) -> np.ndarray:
    """
    Returns a binary mask (uint8, 0/255) indicating the foam region.
    Falls back to the full image if no clear foam region is found.
    """
    h, w = image_bgr.shape[:2]
    gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)

    # Try Otsu threshold to separate foam (lighter) from background
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Find the largest contour as foam candidate
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return np.ones((h, w), dtype=np.uint8) * 255

    largest = max(contours, key=cv2.contourArea)
    area = cv2.contourArea(largest)

    # If the largest region covers < 10% or > 98%, just use the full image
    if area < 0.10 * h * w or area > 0.98 * h * w:
        return np.ones((h, w), dtype=np.uint8) * 255

    mask = np.zeros((h, w), dtype=np.uint8)
    cv2.drawContours(mask, [largest], -1, 255, thickness=cv2.FILLED)

    # Slight dilation so we don't clip partial edge bubbles
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
    mask = cv2.dilate(mask, kernel, iterations=2)
    return mask
