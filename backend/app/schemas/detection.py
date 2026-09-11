"""Pydantic schemas for the detection API."""
from pydantic import BaseModel
from typing import Literal, Optional, Any


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


class DetectionStats(BaseModel):
    small_candidates: int
    medium_candidates: int
    large_candidates: int
    merged_candidates: int
    final_bubbles: int


class CandidateDebugInfo(BaseModel):
    x: int
    y: int
    radius: float
    confidence: float
    source: str


class DebugCandidatesDict(BaseModel):
    small: list[CandidateDebugInfo] = []
    medium: list[CandidateDebugInfo] = []
    large: list[CandidateDebugInfo] = []
    rejected: list[CandidateDebugInfo] = []
    final: list[BubbleResult] = []


class AnalysisResponse(BaseModel):
    success: bool
    count: CountSummary
    bubbles: list[BubbleResult]
    stats: Optional[DetectionStats] = None
    debug_candidates: Optional[DebugCandidatesDict] = None


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
