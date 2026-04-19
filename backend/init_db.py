"""
Script to initialize the database tables.
Run this once before starting the server.
"""

from app.database import Base, engine
from app.models import User, Course, Module, Enrollment, Progress, Recommendation

def init_db():
    """Create all database tables."""
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")

if __name__ == "__main__":
    init_db()
