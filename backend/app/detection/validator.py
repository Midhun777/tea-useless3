"""
Bubble validator — scores and filters candidates.
Confidence is based on:
  - gradient strength at the circle boundary
  - how circular the local region looks
  - distance from image border
"""
import cv2
import numpy as np
import math
from app.core.config import DetectionConfig
from app.detection.hough_detector import CircleCandidate


def _boundary_gradient_strength(
    gray: np.ndarray,
    cx: float, cy: float, radius: float,
    n_samples: int = 32,
) -> float:
    """
    Sample gradient magnitude at n evenly-spaced points on the circle perimeter.
    Returns mean gradient (0–255 scale).
    """
    h, w = gray.shape
    mags = []
    for i in range(n_samples):
        angle = 2 * math.pi * i / n_samples
        px = int(round(cx + radius * math.cos(angle)))
        py = int(round(cy + radius * math.sin(angle)))
        if 1 <= px < w - 1 and 1 <= py < h - 1:
            gx = int(gray[py, px + 1]) - int(gray[py, px - 1])
            gy = int(gray[py + 1, px]) - int(gray[py - 1, px])
            mags.append(math.hypot(gx, gy) / 2.0)
    return float(np.mean(mags)) if mags else 0.0


def validate(
    candidates: list[CircleCandidate],
    gray: np.ndarray,
    cfg: DetectionConfig,
) -> list[CircleCandidate]:
    """
    Re-score each candidate using boundary gradient strength and border proximity.
    Discard anything below min_confidence.
    """
    h, w = gray.shape
    valid: list[CircleCandidate] = []

    for c in candidates:
        # 1. Skip bubbles too close to image border
        if (c.x - c.radius < cfg.border_margin or
                c.y - c.radius < cfg.border_margin or
                c.x + c.radius > w - cfg.border_margin or
                c.y + c.radius > h - cfg.border_margin):
            # Still allow partially visible — just penalise confidence
            c.confidence *= 0.6

        # 2. Gradient score (normalised to 0–1, assuming max useful grad ~60)
        grad = _boundary_gradient_strength(gray, c.x, c.y, c.radius)
        grad_score = min(1.0, grad / 60.0)

        # 3. Combine with existing confidence (weighted)
        c.confidence = 0.5 * c.confidence + 0.5 * grad_score

        if c.confidence >= cfg.min_confidence:
            valid.append(c)

    return valid
