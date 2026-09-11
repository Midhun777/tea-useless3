# കുമിള 🎯

An AI-powered real-time computer vision system that detects and tracks tea-foam bubbles.

## Basic Details

### Team Name: Real Fighters

### Team Members
- Team Lead: Midhun Mathew - College Of Engineering Chengannur
- Member 2: Zen Varghese - College Of Engineering Chengannur

### Project Description
An over-engineered AI & computer vision web application that scans tea cups via webcam or image upload, detects and tracks micro-bubbles in real-time using OpenCV contour algorithms, and provides an interactive bubble-popping session with acoustic feedback while tracking wasted time down to the millisecond.

### The Problem (that doesn't exist)
Millions of chai drinkers waste precious seconds staring aimlessly at foam bubbles floating on top of their freshly poured tea without knowing the exact bubble count, micro-foam density, or volume loss.

### The Solution (that nobody asked for)
An over-engineered AI & computer vision web application that scans tea cups via webcam or image upload, detects and tracks micro-bubbles in real-time using OpenCV contour algorithms, and provides an interactive bubble-popping session with acoustic feedback while tracking wasted time down to the millisecond.

---

## Technical Details

### Software Stack
- **Frontend:** React 19, Vite, TailwindCSS, Zustand, GSAP (Animations), Canvas API, Web Audio API
- **Backend:** Python 3.11/3.14, FastAPI, OpenCV (`opencv-python`), NumPy, Pillow, Uvicorn
- **AI/CV Pipeline:** Adaptive Thresholding, CLAHE Preprocessing, Canny Edge Fusion, Hough Circle Transforms, Boundary Gradient Validation

### Hardware Stack
- Standard Webcam / Smartphone Camera for Live Video & Specimen Capture

---

## Implementation

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)

### Installation & Run Commands

```bash
# 1. Backend Setup
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

```bash
# 2. Frontend Setup
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Detection Pipeline Architecture

```
Image Input
 ↓  Grayscale + CLAHE + Gaussian Blur
 ↓  ROI Detection (Foam region isolation)
 ↓  Hough Circle Transform
 ↓  Adaptive Threshold + Contour Analysis
 ↓  Canny Edge + Connected Components
 ↓  NMS-style Candidate Merging
 ↓  Boundary Gradient Validation
 ↓  Image-relative Size Classification (Small / Medium / Large)
 ↓  Final Bubble Count & Interactive Canvas Overlay
```

---

## Project Documentation & Links

- **Live Demo:** [Insert Link Here]
- **Video Demo:** [Insert Link Here]

---
Made with ☕ for TinkerHub Useless Projects
