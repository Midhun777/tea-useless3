"""
Centralised detection configuration.
All thresholds are here — no magic numbers scattered through the codebase.
"""
from pydantic_settings import BaseSettings
from typing import Tuple


class DetectionConfig(BaseSettings):
    # ── Preprocessing ───────────────────────────────────────────────────────
    clahe_clip_limit: float = 2.0
    clahe_tile_size: Tuple[int, int] = (8, 8)
    blur_kernel: int = 5          # must be odd
    blur_sigma: float = 1.0

    # ── Hough Circles ───────────────────────────────────────────────────────
    hough_dp: float = 1.2         # inverse ratio of accumulator resolution
    hough_min_dist_factor: float = 0.02   # fraction of image min-dim
    hough_param1: int = 80        # Canny high threshold inside HoughCircles
    hough_param2: int = 22        # accumulator threshold (lower → more circles)
    hough_min_radius: int = 4     # pixels
    hough_max_radius_factor: float = 0.15  # fraction of image min-dim

    # ── Contour Detection ───────────────────────────────────────────────────
    adaptive_block_size: int = 15  # must be odd
    adaptive_c: int = 3
    morph_kernel_size: int = 2
    min_contour_area: float = 30.0
    min_circularity: float = 0.45  # 1.0 = perfect circle

    # ── Edge / Canny ────────────────────────────────────────────────────────
    canny_low: int = 30
    canny_high: int = 90
    min_edge_circle_area: float = 50.0

    # ── Candidate Merging (NMS) ──────────────────────────────────────────────
    merge_overlap_ratio: float = 0.5   # suppress if overlap > this

    # ── Validation ──────────────────────────────────────────────────────────
    min_confidence: float = 0.25
    border_margin: int = 3             # px — skip bubbles too close to edge

    # ── Size Classification ──────────────────────────────────────────────────
    # Thresholds are multiplied by (image_min_dim / 500) to be size-relative
    small_max_radius: float = 12.0     # px at reference 500-px image
    large_min_radius: float = 25.0     # px at reference 500-px image

    # ── Sensitivity (1–10) adjustments ───────────────────────────────────────
    # Applied at runtime in estimator.py; stored here for reference.
    sensitivity_default: int = 5

    class Config:
        env_file = ".env"
        env_prefix = "DETECT_"


# Singleton
config = DetectionConfig()
