# MindLite

MindLite is a cognitive-health monitoring application that combines short memory and attention games with progress tracking, caregiver support, and machine-learning-assisted cognitive score estimates.

## Features

- Interactive memory, recall, pattern-recognition, reaction-time, and family-recognition games
- Patient, doctor, and caregiver workflows
- Cognitive-score predictions and decline alerts
- Progress charts and daily wellbeing check-ins
- Email communication from doctors to caregivers

## Technology

| Area | Technology |
| --- | --- |
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| API and ML | FastAPI, SQLAlchemy, scikit-learn |
| Database | Neon PostgreSQL |
| Hosting | Vercel |

## Run locally

### Requirements

- Node.js 20 or later
- Python 3.10 or later
- A Neon PostgreSQL database, or another PostgreSQL instance

### 1. Configure environment variables

Copy `.env.example` to `.env` and supply your values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
NEXT_PUBLIC_API_URL="http://127.0.0.1:8000"
CORS_ORIGINS="http://localhost:3000"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASSWORD=""
```

### 2. Install dependencies

```bash
pnpm install
pip install -r requirements.txt
```

### 3. Create the database tables

```bash
python -c "from src.database import Base, engine; import src.models; Base.metadata.create_all(bind=engine)"
```

### 4. Start the application

Use two terminals:

```bash
uvicorn main:app --reload
```

```bash
pnpm dev
```

The website is available at `http://localhost:3000`; the API is available at `http://127.0.0.1:8000`.

## Deploy to Vercel and Neon

1. Create a Neon project and copy its **pooled** PostgreSQL connection string.
2. Import this repository into Vercel as a Next.js project.
3. Add the following Vercel environment variables:

   ```env
   DATABASE_URL=<your Neon pooled PostgreSQL URL>
   NEXT_PUBLIC_API_URL=https://YOUR-VERCEL-DOMAIN.vercel.app/api
   CORS_ORIGINS=https://YOUR-VERCEL-DOMAIN.vercel.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=<your SMTP user>
   SMTP_PASSWORD=<your SMTP password or app password>
   ```

4. Initialize the database tables using the command in the local setup section.
5. Deploy and verify `https://YOUR-VERCEL-DOMAIN.vercel.app/api/` returns the API status message.

Every subsequent push to the connected production branch triggers a new Vercel deployment.

## Notes

- Use a Neon pooled connection string for `DATABASE_URL`; it is designed for serverless connections.
- Never commit `.env` files or credentials.
- Family-member uploads use Vercel's temporary filesystem in the current implementation. Store uploads in Vercel Blob or another object store before relying on them in production.
- MindLite supports monitoring and does not provide a medical diagnosis.
