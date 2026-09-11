"""
Dedicated Medium Bubble Detector.

Techniques:
  - CLAHE contrast enhancement
  - Moderate Gaussian blurring
  - Hough Circles tuned for medium radius bounds
  - Contour circularity and adaptive thresholding for mid-size foam structures
  - Edge component analysis for transparent medium bubbles
"""
import cv2
import numpy as np
import math
from app.core.config import DetectionConfig
from app.detection.hough_detector import CircleCandidate


def detect_medium_bubbles(
    enhanced_roi: np.ndarray,
    cfg: DetectionConfig,
    sensitivity: int = 5,
) -> list[CircleCandidate]:
    """
    Run dedicated medium bubble detection path.
    """
    h, w = enhanced_roi.shape[:2]
    min_dim = min(h, w)
    ref_scale = min_dim / 500.0

    med_min_r = int(cfg.small_max_radius * ref_scale * 0.8)
    med_max_r = int(cfg.large_min_radius * ref_scale * 1.1)

    candidates: list[CircleCandidate] = []

    # ── Path A: Medium Hough Circles ─────────────────────────────────────────
    sens_scale = (11 - sensitivity) / 5.0
    param2 = max(10, int(cfg.medium_hough_param2 * sens_scale))
    param1 = cfg.medium_hough_param1

    min_dist = max(8, int(med_min_r * 1.2))

    circles = cv2.HoughCircles(
        enhanced_roi,
        cv2.HOUGH_GRADIENT,
        dp=cfg.hough_dp,
        minDist=min_dist,
        param1=param1,
        param2=param2,
        minRadius=med_min_r,
        maxRadius=med_max_r,
    )

    if circles is not None:
        for x, y, r in circles[0]:
            candidates.append(
                CircleCandidate(
                    x=float(x),
                    y=float(y),
                    radius=float(r),
                    source="medium_hough",
                    confidence=0.75,
                )
            )

    # ── Path B: Medium Contours ───────────────────────────────────────────────
    c_val = max(1, cfg.adaptive_c - (sensitivity - 5) // 2)
    block = cfg.adaptive_block_size
    if block % 2 == 0:
        block += 1

    thresh = cv2.adaptiveThreshold(
        enhanced_roi, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        block, c_val,
    )

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=1)

    contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    for cnt in contours:
        area = cv2.contourArea(cnt)
        min_area = math.pi * (med_min_r ** 2) * 0.6
        max_area = math.pi * (med_max_r ** 2) * 1.4
        
        if area < min_area or area > max_area:
            continue

        perimeter = cv2.arcLength(cnt, True)
        if perimeter == 0:
            continue

        circularity = 4 * math.pi * area / (perimeter ** 2)
        if circularity < cfg.min_circularity:
            continue

        (cx, cy), radius = cv2.minEnclosingCircle(cnt)
        if radius < med_min_r or radius > med_max_r:
            continue

        confidence = min(0.88, 0.45 + 0.45 * circularity)
        candidates.append(
            CircleCandidate(
                x=float(cx),
                y=float(cy),
                radius=float(radius),
                source="medium_contour",
                confidence=confidence,
            )
        )

    return candidates
