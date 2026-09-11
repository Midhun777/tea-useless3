"""
Pipeline orchestrator — runs the multi-scale detection sequence and returns results.

Multi-Scale Pipeline:
  image → preprocess & ROI
        → [ Small Detector | Medium Detector | Preserved Large Detector ]
        → Anti-clustering (suppresses false large bubble clusters)
        → Candidate merging (NMS duplicate removal)
        → Multi-criteria validation & transparent bubble scoring
        → Size classification
        → Count & Statistics calculation
"""
import cv2
import numpy as np
from app.core.config import DetectionConfig
from app.detection.preprocessing import preprocess
from app.detection.roi import detect_roi
from app.detection.small_detector import detect_small_bubbles
from app.detection.medium_detector import detect_medium_bubbles
from app.detection.large_detector import detect_large_bubbles
from app.detection.candidate_merger import merge_candidates, filter_cluster_false_positives
from app.detection.validator import validate
from app.detection.classifier import classify


def run_pipeline(
    image_bytes: bytes,
    sensitivity: int = 5,
    debug: bool = False,
    cfg: DetectionConfig | None = None,
) -> dict:
    """
    Args:
        image_bytes: raw bytes of the uploaded image
        sensitivity: 1 (conservative) – 10 (aggressive), default 5
        debug: bool, whether to include debug candidate details
        cfg: optional override config (uses singleton if None)

    Returns:
        {
          "success": bool,
          "count": {"total": int, "small": int, "medium": int, "large": int},
          "bubbles": [{"x", "y", "radius", "size", "confidence"}, ...],
          "stats": {
            "small_candidates": int,
            "medium_candidates": int,
            "large_candidates": int,
            "merged_candidates": int,
            "final_bubbles": int
          },
          "debug_candidates": dict (optional)
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
    enhanced_roi = cv2.bitwise_and(enhanced, enhanced, mask=roi_mask)

    # ── Stage 3: Multi-Scale Candidate Generation ────────────────────────────
    small_cands = detect_small_bubbles(image_bgr, roi_mask, cfg, sensitivity)
    medium_cands = detect_medium_bubbles(enhanced_roi, cfg, sensitivity)
    large_cands = detect_large_bubbles(enhanced_roi, cfg, sensitivity)

    small_count = len(small_cands)
    medium_count = len(medium_cands)
    large_count = len(large_cands)

    raw_candidates = small_cands + medium_cands + large_cands

    # ── Stage 4: Anti-Clustering Filter ──────────────────────────────────────
    declustered = filter_cluster_false_positives(raw_candidates, gray, cfg)

    # ── Stage 5: Merge Duplicates (NMS) ──────────────────────────────────────
    merged = merge_candidates(declustered, cfg)
    merged_count = len(merged)

    # ── Stage 6: Multi-Criteria Candidate Validation ─────────────────────────
    validated, rejected = validate(merged, gray, roi_mask, cfg)

    # ── Stage 7: Size Classification ─────────────────────────────────────────
    bubbles = classify(validated, (h, w), cfg)

    # ── Stage 8: Count & Statistics Summary ──────────────────────────────────
    total = len(bubbles)
    small = sum(1 for b in bubbles if b["size"] == "small")
    medium = sum(1 for b in bubbles if b["size"] == "medium")
    large = sum(1 for b in bubbles if b["size"] == "large")

    stats = {
        "small_candidates": small_count,
        "medium_candidates": medium_count,
        "large_candidates": large_count,
        "merged_candidates": merged_count,
        "final_bubbles": total,
    }

    result = {
        "success": True,
        "count": {
            "total": total,
            "small": small,
            "medium": medium,
            "large": large,
        },
        "bubbles": bubbles,
        "stats": stats,
    }

    if debug:
        result["debug_candidates"] = {
            "small": [{"x": round(c.x), "y": round(c.y), "radius": round(c.radius, 1), "confidence": round(c.confidence, 3), "source": c.source} for c in small_cands],
            "medium": [{"x": round(c.x), "y": round(c.y), "radius": round(c.radius, 1), "confidence": round(c.confidence, 3), "source": c.source} for c in medium_cands],
            "large": [{"x": round(c.x), "y": round(c.y), "radius": round(c.radius, 1), "confidence": round(c.confidence, 3), "source": c.source} for c in large_cands],
            "rejected": [{"x": round(c.x), "y": round(c.y), "radius": round(c.radius, 1), "confidence": round(c.confidence, 3), "source": c.source} for c in rejected],
            "final": bubbles,
        }

    return result
