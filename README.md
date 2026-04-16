# 🎓 Personalized Learning Platform with Machine Learning

An AI-powered adaptive learning platform that personalizes education through machine learning algorithms.

## 🚀 Features

- **AI-Powered Recommendations**: Collaborative & content-based filtering
- **Adaptive Learning**: Real-time difficulty adjustment based on performance
- **Knowledge Tracing**: Bayesian models to predict skill mastery
- **Spaced Repetition**: Optimized review scheduling (SM-2 algorithm)
- **Struggle Detection**: Real-time intervention when students struggle
- **Learning Path Generation**: Personalized curriculum paths

## 🏗️ Architecture

```
personalized-learning-platform/
├── backend/           # FastAPI + PostgreSQL
├── frontend/          # React + TypeScript + Tailwind
└── docker-compose.yml # Orchestration
```

## 🛠️ Tech Stack

**Backend:**
- FastAPI (Python)
- PostgreSQL + SQLAlchemy
- Redis + Celery
- scikit-learn, TensorFlow, Transformers
- Sentence Transformers for embeddings

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Zustand (state management)
- React Query

**ML/AI:**
- Collaborative Filtering (NMF)
- Content-Based Filtering (Sentence-BERT)
- Bayesian Knowledge Tracing
- Spaced Repetition (SM-2)

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local dev)
- Python 3.11+ (for local dev)

### Running with Docker

```bash
# Clone and enter directory
cd personalized-learning-platform

# Start all services
docker-compose up -d

# Initialize database
docker-compose exec api alembic upgrade head

# Access:
# - Frontend: http://localhost:3000
# - API Docs: http://localhost:8000/docs
```

### Local Development

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📊 ML Features

| Feature | Algorithm | Purpose |
|---------|-----------|---------|
| Course Recommendations | Collaborative + Content-Based | Personalized suggestions |
| Knowledge Tracing | Bayesian Knowledge Tracing | Predict mastery |
| Adaptive Difficulty | Performance-based | Dynamic content leveling |
| Spaced Repetition | SM-2 Algorithm | Optimize review timing |
| Struggle Detection | Rule-based + ML | Real-time intervention |

## 🔧 Environment Variables

Create `.env` files:

**backend/.env:**
```
DATABASE_URL=postgresql://user:pass@localhost/db
SECRET_KEY=your-secret-key
REDIS_URL=redis://localhost:6379/0
```

**frontend/.env:**
```
VITE_API_URL=http://localhost:8000/api/v1
```

## 📈 API Endpoints

- `GET /api/v1/recommendations/personalized` - Get AI recommendations
- `GET /api/v1/learning-path/{skill}` - Generate learning path
- `GET /api/v1/mastery/{module_id}` - Knowledge tracing prediction
- `WS /api/v1/learning/ws/{user_id}` - Real-time adaptive learning

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📝 License

MIT License - feel free to use for educational purposes!
