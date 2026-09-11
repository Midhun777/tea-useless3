"""Edge/gradient-based bubble detector using Canny + connected components."""
import cv2
import numpy as np
import math
from app.core.config import DetectionConfig
from app.detection.hough_detector import CircleCandidate


def detect_edges(
    enhanced: np.ndarray,
    cfg: DetectionConfig,
    sensitivity: int = 5,
) -> list[CircleCandidate]:
    """
    Canny edge map → connected components → fit enclosing circles.
    Useful for picking up low-contrast bubbles that Hough/contour miss.
    """
    # Sensitivity adjusts Canny thresholds
    scale = 1.0 - (sensitivity - 5) * 0.08  # sens=10 → 0.60, sens=1 → 1.32
    lo = max(10, int(cfg.canny_low * scale))
    hi = max(20, int(cfg.canny_high * scale))

    edges = cv2.Canny(enhanced, lo, hi)

    # Dilate edges slightly to close near-circular rings
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    dilated = cv2.dilate(edges, kernel, iterations=1)

    # Label connected components of the edge map
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(
        dilated, connectivity=8
    )

    candidates: list[CircleCandidate] = []
    for i in range(1, num_labels):  # skip background label 0
        area = stats[i, cv2.CC_STAT_AREA]
        if area < cfg.min_edge_circle_area:
            continue

        # Fit minimum enclosing circle to the component pixels
        component_mask = (labels == i).astype(np.uint8)
        pts = cv2.findNonZero(component_mask)
        if pts is None:
            continue

        (cx, cy), radius = cv2.minEnclosingCircle(pts)

        # Sanity-check circularity via pixel fill ratio
        circle_area = math.pi * radius ** 2
        fill_ratio = area / (circle_area + 1e-6)
        if fill_ratio < 0.05 or fill_ratio > 0.85:
            # Edge-only ring: fill should be low; filled blob too high
            continue

        confidence = 0.35 + 0.25 * min(1.0, fill_ratio / 0.3)
        candidates.append(
            CircleCandidate(x=cx, y=cy, radius=radius,
                            source="edge", confidence=confidence)
        )

    return candidates
