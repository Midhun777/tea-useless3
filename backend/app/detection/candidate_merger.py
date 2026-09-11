"""
Candidate Merger and Anti-Clustering Engine.

Functions:
  1. Anti-clustering: Prevents groups of small bubbles from being misclassified as a single large bubble.
  2. Spatial-grid NMS Candidate Merger: Fast duplicate removal across multi-scale detectors.
"""
import cv2
import numpy as np
import math
from collections import defaultdict
from app.core.config import DetectionConfig
from app.detection.hough_detector import CircleCandidate


def _overlap_ratio(a: CircleCandidate, b: CircleCandidate) -> float:
    """Intersection area over the smaller circle's area (IoSA)."""
    dx = a.x - b.x
    dy = a.y - b.y
    dist = math.hypot(dx, dy)
    r1, r2 = a.radius, b.radius

    if dist >= r1 + r2:
        return 0.0  # no overlap

    if dist <= abs(r1 - r2):
        # One circle fully inside the other
        return 1.0

    # Partial overlap — lens-shaped intersection area
    a1 = (r1 ** 2) * math.acos(min(1.0, max(-1.0, (dist ** 2 + r1 ** 2 - r2 ** 2) / (2 * dist * r1 + 1e-9))))
    a2 = (r2 ** 2) * math.acos(min(1.0, max(-1.0, (dist ** 2 + r2 ** 2 - r1 ** 2) / (2 * dist * r2 + 1e-9))))
    d1 = 0.5 * math.sqrt(
        max(0.0, (-dist + r1 + r2) * (dist + r1 - r2) * (dist - r1 + r2) * (dist + r1 + r2))
    )
    intersection = a1 + a2 - d1
    smaller_area = math.pi * (min(r1, r2) ** 2)
    return intersection / (smaller_area + 1e-9)


def filter_cluster_false_positives(
    candidates: list[CircleCandidate],
    gray: np.ndarray,
    cfg: DetectionConfig,
) -> list[CircleCandidate]:
    """
    Prevents clusters of small bubbles from merging into single false large bubbles.
    Spatial grid indexed for sub-millisecond execution.
    """
    if not candidates:
        return []

    h, w = gray.shape
    edges = cv2.Canny(gray, 30, 90)

    min_dim = min(h, w)
    ref_scale = min_dim / 500.0
    large_min = cfg.large_min_radius * ref_scale

    small_cands = [c for c in candidates if c.radius < cfg.small_max_radius * ref_scale * 1.2]
    large_cands = [c for c in candidates if c.radius >= large_min]
    other_cands = [c for c in candidates if c not in small_cands and c not in large_cands]

    # Index small candidates in a spatial grid
    cell_size = 40.0
    small_grid = defaultdict(list)
    for sm in small_cands:
        gx = int(sm.x / cell_size)
        gy = int(sm.y / cell_size)
        small_grid[(gx, gy)].append(sm)

    filtered_large: list[CircleCandidate] = []

    for lg in large_cands:
        sub_count = 0
        cx_cell = int(lg.x / cell_size)
        cy_cell = int(lg.y / cell_size)
        r_cells = int(math.ceil(lg.radius / cell_size)) + 1

        for gx in range(cx_cell - r_cells, cx_cell + r_cells + 1):
            for gy in range(cy_cell - r_cells, cy_cell + r_cells + 1):
                for sm in small_grid[(gx, gy)]:
                    dist = math.hypot(lg.x - sm.x, lg.y - sm.y)
                    if dist < lg.radius * 0.80:
                        sub_count += 1

        # If 3 or more small candidates lie inside this large circle, check internal edges
        if sub_count >= cfg.anti_cluster_min_sub_cands + 1:
            cx, cy, r = int(lg.x), int(lg.y), int(lg.radius)
            x1, y1 = max(0, cx - r), max(0, cy - r)
            x2, y2 = min(w, cx + r + 1), min(h, cy + r + 1)

            if x2 - x1 > 4 and y2 - y1 > 4:
                sub_edges = edges[y1:y2, x1:x2]
                mask = np.zeros(sub_edges.shape, dtype=np.uint8)
                cv2.circle(mask, (cx - x1, cy - y1), int(r * 0.7), 255, -1)
                
                inner_edge_pixels = np.count_nonzero(cv2.bitwise_and(sub_edges, sub_edges, mask=mask))
                inner_area = math.pi * ((r * 0.7) ** 2) + 1e-6
                edge_ratio = inner_edge_pixels / inner_area

                if edge_ratio > cfg.anti_cluster_edge_ratio:
                    # High internal edges indicate a cluster of small foam bubbles
                    continue

        filtered_large.append(lg)

    return small_cands + other_cands + filtered_large


def merge_candidates(
    candidates: list[CircleCandidate],
    cfg: DetectionConfig,
) -> list[CircleCandidate]:
    """
    Spatial-grid accelerated NMS candidate merger.
    Sorts candidates by confidence (descending) and greedily suppresses duplicates.
    Differentiates between duplicates of similar size vs nested multi-scale bubbles.
    """
    if not candidates:
        return []

    sorted_cands = sorted(candidates, key=lambda c: c.confidence, reverse=True)
    kept: list[CircleCandidate] = []

    cell_size = 40.0
    grid = defaultdict(list)

    for candidate in sorted_cands:
        cx_cell = int(candidate.x / cell_size)
        cy_cell = int(candidate.y / cell_size)

        suppressed = False

        # Search neighboring 3x3 grid cells
        for gx in range(cx_cell - 2, cx_cell + 3):
            for gy in range(cy_cell - 2, cy_cell + 3):
                for keeper in grid[(gx, gy)]:
                    overlap = _overlap_ratio(candidate, keeper)
                    r_ratio = min(candidate.radius, keeper.radius) / max(candidate.radius, keeper.radius)

                    # Only suppress if radii are reasonably similar (duplicates of same scale object)
                    if r_ratio >= 0.45:
                        if overlap > cfg.merge_overlap_ratio:
                            suppressed = True
                            break
                        dist = math.hypot(candidate.x - keeper.x, candidate.y - keeper.y)
                        if dist < min(candidate.radius, keeper.radius) * 0.6 and overlap > 0.6:
                            suppressed = True
                            break

                if suppressed:
                    break
            if suppressed:
                break

        if not suppressed:
            kept.append(candidate)
            grid[(cx_cell, cy_cell)].append(candidate)

    return kept
