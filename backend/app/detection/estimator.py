"""
Pipeline orchestrator — runs the full detection sequence and returns results.

Pipeline:
    image → preprocess → ROI → hough + contour + edge
          → merge → validate → classify → count
"""
import cv2
import numpy as np
from app.core.config import DetectionConfig
from app.detection.preprocessing import preprocess
from app.detection.roi import detect_roi
from app.detection.hough_detector import detect_hough
from app.detection.contour_detector import detect_contours
from app.detection.edge_detector import detect_edges
from app.detection.candidate_merger import merge_candidates
from app.detection.validator import validate
from app.detection.classifier import classify


def run_pipeline(
    image_bytes: bytes,
    sensitivity: int = 5,
    cfg: DetectionConfig | None = None,
) -> dict:
    """
    Args:
        image_bytes: raw bytes of the uploaded image
        sensitivity: 1 (conservative) – 10 (aggressive), default 5
        cfg: optional override config (uses singleton if None)

    Returns:
        {
          "success": bool,
          "count": {"total": int, "small": int, "medium": int, "large": int},
          "bubbles": [{"x", "y", "radius", "size", "confidence"}, ...]
        }
    """
    if cfg is None:
        cfg = DetectionConfig()

    sensitivity = max(1, min(10, sensitivity))

    # ── Decode image ────────────────────────────────────────────────────────
    arr = np.frombuffer(image_bytes, np.uint8)
    image_bgr = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if image_bgr is None:
        return {"success": False, "error": "Could not decode image."}

    h, w = image_bgr.shape[:2]

    # ── Stage 1: Preprocess ─────────────────────────────────────────────────
    gray, enhanced = preprocess(image_bgr, cfg)

    # ── Stage 2: ROI ────────────────────────────────────────────────────────
    roi_mask = detect_roi(image_bgr, cfg)
    # Apply ROI mask to enhanced image
    enhanced_roi = cv2.bitwise_and(enhanced, enhanced, mask=roi_mask)

    # ── Stage 3–5: Multi-source detection ───────────────────────────────────
    hough_cands = detect_hough(enhanced_roi, cfg, sensitivity)
    contour_cands = detect_contours(enhanced_roi, cfg, sensitivity)
    edge_cands = detect_edges(enhanced_roi, cfg, sensitivity)

    all_candidates = hough_cands + contour_cands + edge_cands

    # ── Stage 6: Merge duplicates ────────────────────────────────────────────
    merged = merge_candidates(all_candidates, cfg)

    # ── Stage 7: Validate ────────────────────────────────────────────────────
    validated = validate(merged, gray, cfg)

    # ── Stage 8: Classify sizes ──────────────────────────────────────────────
    bubbles = classify(validated, (h, w), cfg)

    # ── Stage 9: Count ───────────────────────────────────────────────────────
    total = len(bubbles)
    small = sum(1 for b in bubbles if b["size"] == "small")
    medium = sum(1 for b in bubbles if b["size"] == "medium")
    large = sum(1 for b in bubbles if b["size"] == "large")

    return {
        "success": True,
        "count": {
            "total": total,
            "small": small,
            "medium": medium,
            "large": large,
        },
        "bubbles": bubbles,
    }
