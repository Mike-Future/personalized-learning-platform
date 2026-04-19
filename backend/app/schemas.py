from __future__ import annotations
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: str

class UserBase(BaseModel):
    email: EmailStr
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

    class Config:
        orm_mode = True

class RecommendationOut(BaseModel):
    course_id: int
    confidence_score: float
    reason: str

    class Config:
        orm_mode = True
