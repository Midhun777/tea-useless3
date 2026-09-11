"""Hough Circle Transform detector."""
import cv2
import numpy as np
from dataclasses import dataclass
from app.core.config import DetectionConfig


@dataclass
class CircleCandidate:
    x: float
    y: float
    radius: float
    source: str = "hough"
    confidence: float = 0.0


def detect_hough(
    enhanced: np.ndarray,
    cfg: DetectionConfig,
    sensitivity: int = 5,
) -> list[CircleCandidate]:
    """
    Run HoughCircles on the enhanced grayscale image.
    Sensitivity (1–10) adjusts param2 (accumulator threshold) and min_dist.
    """
    h, w = enhanced.shape[:2]
    min_dim = min(h, w)

    # Scale sensitivity: higher sensitivity → lower param2 (finds more circles)
    sens_scale = (11 - sensitivity) / 5.0   # 1→2.0, 5→1.2, 10→0.2
    param2 = max(8, int(cfg.hough_param2 * sens_scale))

    min_dist = max(6, int(min_dim * cfg.hough_min_dist_factor))
    min_r = cfg.hough_min_radius
    max_r = max(min_r + 1, int(min_dim * cfg.hough_max_radius_factor))

    circles = cv2.HoughCircles(
        enhanced,
        cv2.HOUGH_GRADIENT,
        dp=cfg.hough_dp,
        minDist=min_dist,
        param1=cfg.hough_param1,
        param2=param2,
        minRadius=min_r,
        maxRadius=max_r,
    )

    candidates: list[CircleCandidate] = []
    if circles is not None:
        for x, y, r in circles[0]:
            candidates.append(
                CircleCandidate(x=float(x), y=float(y), radius=float(r),
                                source="hough", confidence=0.75)
            )

    return candidates
