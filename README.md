# 🧠 MindLite — Cognitive Health Monitoring System
### Developed and Re-architected by Riddhi

**MindLite** is a comprehensive health-tech platform designed for the early detection and continuous monitoring of cognitive decline, specifically focusing on Alzheimer's disease. Using engaging, clinically-inspired games, MindLite tracks memory, attention, and cognitive performance over time.

---

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

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: Tailwind CSS & Modern Glassmorphism UI
- **Components**: Lucide Icons, Recharts for health telemetry

### Backend (Architecture Refresh)
- **Node.js**: Express.js server for robust data management.
- **Prisma ORM**: Modern database access layer.
- **MySQL**: Persistent relational storage for user profiles and health data.
- **Python**: Specialized service for Machine Learning inference.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MySQL
- Python 3.9+ (for ML modules)

### 2. Database Configuration
Create a `.env` file in the `backend/` directory:
```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/mind_lite"
```

### 3. Installation

**Frontend:**
```bash
cd Mindlite
npm install
```

**Backend:**
```bash
cd backend
npm install
npx prisma generate
```

### 4. Running the Application

**Run Backend (Node.js/Port 8000):**
```bash
cd backend
npm run dev
```

**Run Frontend (Next.js/Port 3000):**
```bash
cd Mindlite
npm run dev
```

---

## 🛡️ Medical Disclaimer
MindLite is a monitoring tool and not a replacement for clinical diagnosis. It is designed to assist healthcare professionals by providing continuous data for more informed assessments.



