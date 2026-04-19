from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.user import User
from app.schemas import UserCreate, UserPublic, Token
from app.services.auth import create_access_token, get_password_hash, verify_password

router = APIRouter(tags=["auth"])

class LoginRequest(BaseModel):
    email: str
    password: str


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


@router.post("/auth/register", response_model=UserPublic)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered",
        )

    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/auth/login", response_model=Token)
def login_user(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, credentials.email)
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token({"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
