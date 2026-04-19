from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.learning import Recommendation
from app.schemas import RecommendationOut
from app.services.auth import decode_access_token

router = APIRouter(tags=["recommendations"])


def get_current_user(token: str, db: Session = Depends(get_db)) -> User:
    try:
        payload = decode_access_token(token)
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.get("/recommendations", response_model=list[RecommendationOut])
def get_user_recommendations(current_user: User = Depends(get_current_user)):
    # For now, return mock recommendations since we don't have the ML engine running
    # In production, this would call the recommendation engine
    mock_recs = [
        {
            "course_id": 1,
            "confidence_score": 0.92,
            "reason": "Based on your strong performance in Python and Data Structures"
        },
        {
            "course_id": 2,
            "confidence_score": 0.87,
            "reason": "Complements your current learning path in backend development"
        },
        {
            "course_id": 3,
            "confidence_score": 0.84,
            "reason": "Visual learners like you excel in this type of content"
        }
    ]
    return mock_recs
