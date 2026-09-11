"""
Dedicated Small Bubble Detector.

Techniques:
  - Image upscaling (2x) for high-resolution micro-structure inspection
  - High-detail CLAHE + unsharp mask local contrast enhancement
  - Edge-preserving bilateral filtering
  - Fine-grained Hough Circles with small radius ranges
  - Adaptive thresholding + morphology + circularity for micro-bubbles
"""
import cv2
import numpy as np
import math
from app.core.config import DetectionConfig
from app.detection.hough_detector import CircleCandidate


def detect_small_bubbles(
    image_bgr: np.ndarray,
    roi_mask: np.ndarray,
    cfg: DetectionConfig,
    sensitivity: int = 5,
) -> list[CircleCandidate]:
    """
    Run dedicated small bubble detection pipeline.
    """
    h, w = image_bgr.shape[:2]
    min_dim = min(h, w)
    sf = cfg.small_upscale_factor

    # 1. Upscale image and ROI mask
    scaled_w, scaled_h = int(w * sf), int(h * sf)
    scaled_bgr = cv2.resize(image_bgr, (scaled_w, scaled_h), interpolation=cv2.INTER_CUBIC)
    scaled_roi = cv2.resize(roi_mask, (scaled_w, scaled_h), interpolation=cv2.INTER_NEAREST)

    # 2. Grayscale conversion & ROI masking
    gray = cv2.cvtColor(scaled_bgr, cv2.COLOR_BGR2GRAY)
    masked_gray = cv2.bitwise_and(gray, gray, mask=scaled_roi)

    # 3. High-detail CLAHE
    clahe = cv2.createCLAHE(
        clipLimit=cfg.small_clahe_clip_limit,
        tileGridSize=cfg.small_clahe_tile_size,
    )
    enhanced = clahe.apply(masked_gray)

    # 4. Unsharp Masking for local contrast enhancement
    gaussian = cv2.GaussianBlur(enhanced, (0, 0), sigmaX=1.5)
    unsharp = cv2.addWeighted(enhanced, 1.4, gaussian, -0.4, 0)

    # 5. Light bilateral filter to reduce noise
    filtered = cv2.bilateralFilter(unsharp, d=5, sigmaColor=15, sigmaSpace=15)

    ref_scale = min_dim / 500.0
    scaled_small_max = cfg.small_max_radius * ref_scale * sf
    scaled_small_min = max(4.0, cfg.small_min_radius * sf * 1.5)

    candidates: list[CircleCandidate] = []

    # ── Path A: Small Hough Circles ──────────────────────────────────────────
    sens_scale = (11 - sensitivity) / 5.0
    param2 = max(16, int(cfg.small_hough_param2 * sens_scale * 1.2))
    param1 = cfg.small_hough_param1

    min_dist = max(8, int(scaled_small_min * 1.8))

    circles = cv2.HoughCircles(
        filtered,
        cv2.HOUGH_GRADIENT,
        dp=1.0,
        minDist=min_dist,
        param1=param1,
        param2=param2,
        minRadius=int(scaled_small_min),
        maxRadius=int(scaled_small_max),
    )

    if circles is not None:
        for x, y, r in circles[0]:
            candidates.append(
                CircleCandidate(
                    x=float(x) / sf,
                    y=float(y) / sf,
                    radius=float(r) / sf,
                    source="small_hough",
                    confidence=0.78,
                )
            )

    # ── Path B: Micro-Contour Rings (Adaptive + Morphological Filtering) ─────
    c_val = max(3, cfg.adaptive_c - (sensitivity - 5) // 2)

    thresh = cv2.adaptiveThreshold(
        filtered, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        15, c_val,
    )
    thresh = cv2.bitwise_and(thresh, thresh, mask=scaled_roi)

    # Morphological opening to eliminate noise specks
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    cleaned = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)
    cleaned = cv2.morphologyEx(cleaned, cv2.MORPH_CLOSE, kernel, iterations=1)

    contours, _ = cv2.findContours(cleaned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    scaled_min_area = math.pi * (scaled_small_min ** 2)
    scaled_max_area = math.pi * (scaled_small_max ** 2) * 1.05

    for cnt in contours:
        if len(cnt) < 5:
            continue

        area = cv2.contourArea(cnt)
        if area < scaled_min_area or area > scaled_max_area:
            continue

        perimeter = cv2.arcLength(cnt, True)
        if perimeter == 0:
            continue

        circularity = 4 * math.pi * area / (perimeter ** 2)
        if circularity < 0.55:  # Require high circularity for micro-bubbles
            continue

        (cx, cy), radius = cv2.minEnclosingCircle(cnt)
        if radius < scaled_small_min or radius > scaled_small_max * 1.05:
            continue

        confidence = min(0.88, 0.48 + 0.42 * circularity)
        candidates.append(
            CircleCandidate(
                x=float(cx) / sf,
                y=float(cy) / sf,
                radius=float(radius) / sf,
                source="small_contour",
                confidence=confidence,
            )
        )

    return candidates
