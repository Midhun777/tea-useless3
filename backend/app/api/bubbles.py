"""POST /api/bubbles/analyze endpoint."""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.schemas.detection import AnalysisResponse, ErrorResponse
from app.detection.estimator import run_pipeline

router = APIRouter(prefix="/api/bubbles", tags=["bubbles"])


@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    summary="Analyse a chai foam image for bubble detection",
)
async def analyze(
    file: UploadFile = File(..., description="Chai foam image (JPEG/PNG/WebP)"),
    sensitivity: int = Form(default=5, ge=1, le=10,
                             description="Detection sensitivity 1–10"),
    debug: bool = Form(default=True,
                       description="Include debug candidate details"),
):
    # Validate content type
    content_type = file.content_type or ""
    if not content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty file.")

    result = run_pipeline(image_bytes, sensitivity=sensitivity, debug=debug)

    if not result.get("success"):
        raise HTTPException(status_code=422, detail=result.get("error", "Detection failed."))

    return AnalysisResponse(**result)
