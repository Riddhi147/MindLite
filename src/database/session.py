 
import os
 
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
 
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set")
 
# Force the psycopg3 driver (installed via psycopg[binary] in requirements.txt).
# Plain "postgresql://" URLs make SQLAlchemy default to psycopg2, which isn't installed.
_engine_url = DATABASE_URL
if _engine_url.startswith("postgresql://"):
    _engine_url = _engine_url.replace("postgresql://", "postgresql+psycopg://", 1)
 
engine = create_engine(_engine_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
 
__all__ = ["DATABASE_URL", "SessionLocal", "engine"]
 