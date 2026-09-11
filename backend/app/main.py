"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.bubbles import router as bubbles_router

app = FastAPI(
    title="Chai Bubble Detector API",
    description="Classical OpenCV bubble detection for chai foam images.",
    version="1.0.0",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(bubbles_router)


@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok"}
