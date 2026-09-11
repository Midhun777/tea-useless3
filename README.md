# 🫧 Chai Bubble Detector

Classical OpenCV bubble detection for chai foam images — no ML, no YOLO, no training required.

## Features

- 📸 Drag & drop image upload
- 🔬 9-stage OpenCV detection pipeline
- 🎯 Hough Circles + Contour + Canny Edge fusion
- 📊 Small / Medium / Large classification
- 🎛️ Sensitivity slider (1–10)
- 🖼️ Live canvas overlay with colour-coded circles
- ⚡ FastAPI backend · React + Tailwind frontend

## Quick Start

### Backend

```bash
cd backend
python -m venv venv

# Python 3.14 needs --pre for numpy/opencv wheels
venv\Scripts\python.exe -m pip install --pre -r requirements.txt --prefer-binary

venv\Scripts\uvicorn.exe app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

## Detection Pipeline

```
Image
 ↓  Grayscale + CLAHE + Gaussian Blur
 ↓  ROI Detection (foam region isolation)
 ↓  Hough Circle Transform
 ↓  Adaptive Threshold + Contour Analysis
 ↓  Canny Edge + Connected Components
 ↓  NMS-style Candidate Merging
 ↓  Boundary Gradient Validation
 ↓  Image-relative Size Classification
 ↓  Final Count + JSON Response
```

## API

### `POST /api/bubbles/analyze`

**Form data:**
| Field | Type | Description |
|-------|------|-------------|
| `file` | File | JPEG/PNG/WebP image |
| `sensitivity` | int (1–10) | Detection aggressiveness |

**Response:**
```json
{
  "success": true,
  "count": { "total": 47, "small": 29, "medium": 13, "large": 5 },
  "bubbles": [
    { "x": 120, "y": 84, "radius": 7.0, "size": "small", "confidence": 0.81 }
  ]
}
```

## Configuration

All detection thresholds are in [`backend/app/core/config.py`](backend/app/core/config.py).
Copy `.env.example` → `.env` and override any `DETECT_*` variable.

| Parameter | Default | Effect |
|-----------|---------|--------|
| `DETECT_HOUGH_PARAM2` | 22 | Lower = more Hough circles |
| `DETECT_MIN_CIRCULARITY` | 0.45 | Higher = stricter circle shape |
| `DETECT_MERGE_OVERLAP_RATIO` | 0.5 | NMS overlap threshold |
| `DETECT_SMALL_MAX_RADIUS` | 12px | At 500px reference image |
| `DETECT_LARGE_MIN_RADIUS` | 25px | At 500px reference image |
| `DETECT_MIN_CONFIDENCE` | 0.25 | Discard below this score |

## Project Structure

```
chai-bubble-detector/
├── backend/
│   ├── app/
│   │   ├── core/config.py          ← All configurable params
│   │   ├── detection/
│   │   │   ├── preprocessing.py    ← Grayscale + CLAHE + blur
│   │   │   ├── roi.py              ← Foam region isolation
│   │   │   ├── hough_detector.py   ← HoughCircles
│   │   │   ├── contour_detector.py ← Adaptive thresh + contours
│   │   │   ├── edge_detector.py    ← Canny + connected components
│   │   │   ├── candidate_merger.py ← NMS deduplication
│   │   │   ├── validator.py        ← Gradient-based confidence
│   │   │   ├── classifier.py       ← small/medium/large
│   │   │   └── estimator.py        ← Pipeline orchestrator
│   │   ├── api/bubbles.py          ← POST /api/bubbles/analyze
│   │   ├── schemas/detection.py    ← Pydantic models
│   │   └── main.py                 ← FastAPI app + CORS
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── store/useBubbleStore.js  ← Zustand state
        ├── services/api.js          ← Backend fetch calls
        ├── components/
        │   ├── DropZone.jsx         ← Drag & drop upload
        │   ├── BubbleCanvas.jsx     ← Canvas overlay
        │   ├── CountPanel.jsx       ← Result counts
        │   ├── SensitivitySlider.jsx
        │   ├── StatusBar.jsx
        │   └── Legend.jsx
        └── pages/HomePage.jsx
```
