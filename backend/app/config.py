from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "Personalized Learning Platform"
    DEBUG: bool = False
    SECRET_KEY: str = "your-secret-key-change-in-production"
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/learning_platform"
    REDIS_URL: str = "redis://localhost:6379/0"
    ML_SERVICE_URL: str = "http://localhost:8001"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
