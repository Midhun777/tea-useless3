"""Contour-based bubble detector."""
import cv2
import numpy as np
import math
from app.core.config import DetectionConfig
from app.detection.hough_detector import CircleCandidate


def detect_contours(
    enhanced: np.ndarray,
    cfg: DetectionConfig,
    sensitivity: int = 5,
) -> list[CircleCandidate]:
    """
    Adaptive threshold → morphology → contour filtering by circularity.
    """
    # Sensitivity adjusts C parameter (lower C → more blobs detected)
    c_val = max(1, cfg.adaptive_c - (sensitivity - 5) // 2)

    block = cfg.adaptive_block_size
    if block % 2 == 0:
        block += 1

    thresh = cv2.adaptiveThreshold(
        enhanced, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        block, c_val,
    )

    # Morphological closing to fill small holes inside bubbles
    k = cfg.morph_kernel_size
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k))
    closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=2)

    contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    candidates: list[CircleCandidate] = []
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < cfg.min_contour_area:
            continue

        perimeter = cv2.arcLength(cnt, True)
        if perimeter == 0:
            continue

        circularity = 4 * math.pi * area / (perimeter ** 2)
        if circularity < cfg.min_circularity:
            continue

        (cx, cy), radius = cv2.minEnclosingCircle(cnt)
        confidence = min(0.9, 0.4 + 0.5 * circularity)
        candidates.append(
            CircleCandidate(x=cx, y=cy, radius=radius,
                            source="contour", confidence=confidence)
        )

    return candidates
