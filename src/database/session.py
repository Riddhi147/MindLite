"""Database engine and session setup."""

import os

from sqlalchemy import create_engine
try:
    from sqlalchemy.orm import sessionmaker
except Exception:
    # Fallback import for environments where sqlalchemy.orm is not directly resolvable
    from sqlalchemy import orm as _orm
    sessionmaker = _orm.sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is not set")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

__all__ = ["DATABASE_URL", "SessionLocal", "engine"]