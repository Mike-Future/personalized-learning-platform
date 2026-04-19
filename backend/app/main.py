from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, recommendations

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="AI-Powered Personalized Learning Platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(recommendations.router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "ml_models_loaded": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
