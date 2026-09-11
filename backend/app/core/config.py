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

    # ── Small Bubble Detector ───────────────────────────────────────────────
    small_upscale_factor: float = 2.0  # Image upscaling for detecting micro-bubbles
    small_clahe_clip_limit: float = 3.0
    small_clahe_tile_size: Tuple[int, int] = (4, 4)
    small_hough_param1: int = 70
    small_hough_param2: int = 14       # Sensitive accumulator for tiny circles
    small_min_radius: float = 2.0      # min radius in orig px
    
    # ── Medium Bubble Detector ──────────────────────────────────────────────
    medium_clahe_clip_limit: float = 2.0
    medium_clahe_tile_size: Tuple[int, int] = (8, 8)
    medium_hough_param1: int = 75
    medium_hough_param2: int = 18

    # ── Existing Large Bubble Detector (Preserved parameters) ───────────────
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
    min_contour_area: float = 12.0 # lowered to catch smaller contours
    min_circularity: float = 0.40  # 1.0 = perfect circle

    # ── Edge / Canny ────────────────────────────────────────────────────────
    canny_low: int = 30
    canny_high: int = 90
    min_edge_circle_area: float = 15.0 # lowered to catch smaller edge circles

    # ── Candidate Merging & Anti-Clustering ────────────────────────────────
    merge_overlap_ratio: float = 0.5   # suppress if overlap > this
    anti_cluster_edge_ratio: float = 0.10 # ratio of internal edges to mark false large candidate
    anti_cluster_min_sub_cands: int = 2 # if >= this many small cands inside large, suppress false large

    # ── Validation ──────────────────────────────────────────────────────────
    min_confidence: float = 0.22
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
