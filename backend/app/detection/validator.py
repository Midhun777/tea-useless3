"""
Bubble Candidate Validator.

Multi-criteria confidence scoring based on:
  - Boundary gradient strength
  - Local interior vs. perimeter contrast (for transparent/colorless bubbles)
  - Boundary ring completeness (fraction of circle perimeter with distinct edges)
  - ROI membership and image border proximity
"""
import cv2
import numpy as np
import math
from app.core.config import DetectionConfig
from app.detection.hough_detector import CircleCandidate


def _boundary_gradient(
    gray: np.ndarray,
    cx: float, cy: float, radius: float,
    n_samples: int = 32,
) -> tuple[float, float]:
    """
    Samples gradient magnitude around the circle perimeter.
    Returns: (mean_gradient_magnitude, completeness_ratio)
    """
    h, w = gray.shape
    mags = []
    strong_edge_count = 0

    for i in range(n_samples):
        angle = 2 * math.pi * i / n_samples
        px = int(round(cx + radius * math.cos(angle)))
        py = int(round(cy + radius * math.sin(angle)))

        if 1 <= px < w - 1 and 1 <= py < h - 1:
            gx = int(gray[py, px + 1]) - int(gray[py, px - 1])
            gy = int(gray[py + 1, px]) - int(gray[py - 1, px])
            mag = math.hypot(gx, gy) / 2.0
            mags.append(mag)
            if mag >= 12.0:
                strong_edge_count += 1

    mean_mag = float(np.mean(mags)) if mags else 0.0
    completeness = strong_edge_count / float(n_samples) if mags else 0.0
    return mean_mag, completeness


def _local_contrast(
    gray: np.ndarray,
    cx: float, cy: float, radius: float,
) -> float:
    """
    Calculates contrast difference between the bubble interior and the surrounding ring.
    Crucial for transparent/colorless bubbles with subtle rim highlights.
    """
    h, w = gray.shape
    r_int = max(1, int(radius * 0.4))
    r_ext = max(r_int + 1, int(radius * 1.2))

    y_min = max(0, int(cy - r_ext))
    y_max = min(h, int(cy + r_ext + 1))
    x_min = max(0, int(cx - r_ext))
    x_max = min(w, int(cx + r_ext + 1))

    if y_max - y_min < 3 or x_max - x_min < 3:
        return 0.0

    sub_img = gray[y_min:y_max, x_min:x_max]
    sub_h, sub_w = sub_img.shape
    local_cx = cx - x_min
    local_cy = cy - y_min

    y_idx, x_idx = np.ogrid[:sub_h, :sub_w]
    dist_sq = (x_idx - local_cx) ** 2 + (y_idx - local_cy) ** 2

    interior_mask = dist_sq <= (r_int ** 2)
    ring_mask = (dist_sq >= (radius * 0.8) ** 2) & (dist_sq <= (r_ext ** 2))

    if not np.any(interior_mask) or not np.any(ring_mask):
        return 0.0

    mean_int = float(np.mean(sub_img[interior_mask]))
    mean_ring = float(np.mean(sub_img[ring_mask]))

    return abs(mean_int - mean_ring)


def validate(
    candidates: list[CircleCandidate],
    gray: np.ndarray,
    roi_mask: np.ndarray | None,
    cfg: DetectionConfig,
) -> tuple[list[CircleCandidate], list[CircleCandidate]]:
    """
    Validates candidates and returns (valid_candidates, rejected_candidates).
    """
    h, w = gray.shape
    valid: list[CircleCandidate] = []
    rejected: list[CircleCandidate] = []

    for c in candidates:
        # Check ROI membership
        if roi_mask is not None:
            cx_i, cy_i = int(round(c.x)), int(round(c.y))
            if 0 <= cx_i < w and 0 <= cy_i < h:
                if roi_mask[cy_i, cx_i] == 0:
                    c.confidence *= 0.3

        # Border proximity check
        if (c.x - c.radius < cfg.border_margin or
                c.y - c.radius < cfg.border_margin or
                c.x + c.radius > w - cfg.border_margin or
                c.y + c.radius > h - cfg.border_margin):
            c.confidence *= 0.7

        # 1. Boundary gradient & completeness
        grad_mag, completeness = _boundary_gradient(gray, c.x, c.y, c.radius)
        grad_score = min(1.0, grad_mag / 45.0)

        # 2. Local contrast score
        contrast = _local_contrast(gray, c.x, c.y, c.radius)
        contrast_score = min(1.0, contrast / 25.0)

        # 3. Composite score calculation
        composite = (
            0.35 * c.confidence +
            0.35 * grad_score +
            0.15 * completeness +
            0.15 * contrast_score
        )

        c.confidence = round(min(0.99, max(0.01, composite)), 3)

        if c.confidence >= cfg.min_confidence:
            valid.append(c)
        else:
            rejected.append(c)

    return valid, rejected
