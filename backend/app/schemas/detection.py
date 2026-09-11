"""Pydantic schemas for the detection API."""
from pydantic import BaseModel
from typing import Literal


class BubbleResult(BaseModel):
    x: int
    y: int
    radius: float
    size: Literal["small", "medium", "large"]
    confidence: float


class CountSummary(BaseModel):
    total: int
    small: int
    medium: int
    large: int


class AnalysisResponse(BaseModel):
    success: bool
    count: CountSummary
    bubbles: list[BubbleResult]


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
