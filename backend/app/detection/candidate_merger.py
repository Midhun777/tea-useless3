"""
NMS-style candidate merger.
Suppresses duplicate detections from different sources that overlap too much.
"""
import math
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
        smaller_area = math.pi * min(r1, r2) ** 2
        return smaller_area / (math.pi * min(r1, r2) ** 2)

    # Partial overlap — lens-shaped intersection approximation
    a1 = r1 ** 2 * math.acos((dist ** 2 + r1 ** 2 - r2 ** 2) / (2 * dist * r1 + 1e-9))
    a2 = r2 ** 2 * math.acos((dist ** 2 + r2 ** 2 - r1 ** 2) / (2 * dist * r2 + 1e-9))
    d1 = 0.5 * math.sqrt((-dist + r1 + r2) * (dist + r1 - r2) *
                          (dist - r1 + r2) * (dist + r1 + r2))
    intersection = a1 + a2 - d1
    smaller_area = math.pi * min(r1, r2) ** 2
    return intersection / (smaller_area + 1e-9)


def merge_candidates(
    candidates: list[CircleCandidate],
    cfg: DetectionConfig,
) -> list[CircleCandidate]:
    """
    Sort by confidence (desc), then greedily suppress any candidate whose
    overlap with an already-kept candidate exceeds merge_overlap_ratio.
    """
    if not candidates:
        return []

    sorted_cands = sorted(candidates, key=lambda c: c.confidence, reverse=True)
    kept: list[CircleCandidate] = []

    for candidate in sorted_cands:
        suppressed = False
        for keeper in kept:
            if _overlap_ratio(candidate, keeper) > cfg.merge_overlap_ratio:
                suppressed = True
                break
        if not suppressed:
            kept.append(candidate)

    return kept
