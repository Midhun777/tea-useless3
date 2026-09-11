"""
Preserved Large Bubble Detector.

Contains and preserves the exact existing detection parameters and logic that
were performing well for large bubble detection.
"""
import cv2
import numpy as np
import math
from app.core.config import DetectionConfig
from app.detection.hough_detector import CircleCandidate, detect_hough
from app.detection.contour_detector import detect_contours
from app.detection.edge_detector import detect_edges


def detect_large_bubbles(
    enhanced_roi: np.ndarray,
    cfg: DetectionConfig,
    sensitivity: int = 5,
) -> list[CircleCandidate]:
    """
    Runs the existing working detector logic (Hough + Contour + Edge)
    and preserves large bubble candidates.
    """
    h, w = enhanced_roi.shape[:2]
    min_dim = min(h, w)
    ref_scale = min_dim / 500.0

    large_threshold = cfg.large_min_radius * ref_scale * 0.85

    # Run original detectors with preserved parameters
    hough_cands = detect_hough(enhanced_roi, cfg, sensitivity)
    contour_cands = detect_contours(enhanced_roi, cfg, sensitivity)
    edge_cands = detect_edges(enhanced_roi, cfg, sensitivity)

    all_preserved = hough_cands + contour_cands + edge_cands

    # Filter to candidates that meet the large bubble radius scope or general preserved scope
    large_candidates: list[CircleCandidate] = []
    for cand in all_preserved:
        if cand.radius >= large_threshold:
            # Tag source as large_detector while preserving candidate attributes
            large_candidates.append(
                CircleCandidate(
                    x=cand.x,
                    y=cand.y,
                    radius=cand.radius,
                    source=f"large_{cand.source}",
                    confidence=max(cand.confidence, 0.80),
                )
            )

    return large_candidates
