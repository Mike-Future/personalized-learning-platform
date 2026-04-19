from __future__ import annotations
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: str

class UserBase(BaseModel):
    email: str
    full_name: str

class UserCreate(UserBase):
    password: str

class UserPublic(UserBase):
    id: int
    role: str
    learning_style: Optional[str] = None
    current_level: str
    interests: List[str] = []
    weak_areas: List[str] = []
    strong_areas: List[str] = []
    total_learning_time: int
    completed_courses: int
    average_score: float
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class RecommendationOut(BaseModel):
    course_id: int
    confidence_score: float
    reason: str

    model_config = ConfigDict(from_attributes=True)
