"""Size classifier — small / medium / large based on image-relative radius."""
from app.core.config import DetectionConfig
from app.detection.hough_detector import CircleCandidate


def classify(
    candidates: list[CircleCandidate],
    image_shape: tuple[int, int],  # (height, width)
    cfg: DetectionConfig,
) -> list[dict]:
    """
    Returns a list of dicts with x, y, radius, size, confidence.
    Thresholds scale proportionally with image size so the same config
    works on tiny thumbnails and high-res photos alike.
    """
    h, w = image_shape
    min_dim = min(h, w)
    ref_dim = 500.0

    scale = min_dim / ref_dim
    small_max = cfg.small_max_radius * scale
    large_min = cfg.large_min_radius * scale

    results = []
    for c in candidates:
        if c.radius <= small_max:
            size = "small"
        elif c.radius >= large_min:
            size = "large"
        else:
            size = "medium"

        results.append({
            "x": round(c.x),
            "y": round(c.y),
            "radius": round(c.radius, 1),
            "size": size,
            "confidence": round(c.confidence, 3),
        })

    return results
