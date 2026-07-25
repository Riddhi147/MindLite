# 🧠 MindLite — Cognitive Health Monitoring System


**MindLite** is a comprehensive health-tech platform designed for the early detection and continuous monitoring of cognitive decline, specifically focusing on Alzheimer's disease. Using engaging, clinically-inspired games, MindLite tracks memory, attention, and cognitive performance over time.

## 🌟 Key Features

### 🎮 Cognitive Assessment Games
- **Family Recognition**: Identify known faces and relationships (Visual Memory).
- **Pattern Recognition**: Predict sequences and logical patterns (Logical Memory).
- **Memory Match**: Speed-based symbol matching (Recall & Processing Speed).
- **Word Recall**: Short-term and delayed verbal recall.
- **Reaction Time**: Interactive tests for neuro-motor responses.

### 📊 Advanced Analytics
- **ML Predictions**: Uses Scikit-learn models to generate cognitive risk scores.
- **Trend Analysis**: Tracks performance over a minimum of 10 days to detect subtle declines.
- **Smart Alerts**: Automatically notifies healthcare professionals and guardians if sudden drops in performance are detected.


## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: Tailwind CSS & Modern Glassmorphism UI
- **Components**: Lucide Icons, Recharts for health telemetry

### Backend (Architecture Refresh)
- **FastAPI**: Python API and ML inference service, deployed as a Vercel function.
- **Prisma ORM**: Modern database access layer.
- **Neon PostgreSQL**: Persistent relational storage for user profiles and health data.
- **Python**: Specialized service for Machine Learning inference.


## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A Neon PostgreSQL database
- Python 3.9+ (for ML modules)

Copy `.env.example` to `.env` and add your Neon connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
NEXT_PUBLIC_API_URL="http://127.0.0.1:8000"
```


### 3. Installation

**Frontend:**
npm install

**Backend:**
```bash
pip install -r requirements.txt
```

### 4. Running the Application

uvicorn main:app --reload
npm run dev

## Deploying to Vercel and Neon

1. Create a Neon project and copy its **pooled** PostgreSQL connection string.
2. In Vercel, import this repository and add `DATABASE_URL` with that connection string.
3. Run the schema creation once from a machine with `DATABASE_URL` configured:

   ```bash
   python -c "from src.database import Base, engine; import src.models; Base.metadata.create_all(bind=engine)"
   ```

4. In Vercel, set `NEXT_PUBLIC_API_URL` to `https://YOUR-DEPLOYMENT.vercel.app/api` and set `CORS_ORIGINS` to `https://YOUR-DEPLOYMENT.vercel.app`.
5. Redeploy. The FastAPI API is served under `/api`; the Next.js site remains at `/`.

`/upload-family-member` currently stores files in the server's temporary filesystem. On Vercel, those files are not durable between function invocations; move uploads to Vercel Blob or another object store before relying on that feature in production.
