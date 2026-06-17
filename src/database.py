import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

def build_db_url():
    host = os.getenv("MYSQLHOST")
    port = os.getenv("MYSQLPORT", "3306")
    user = os.getenv("MYSQLUSER")
    password = os.getenv("MYSQLPASSWORD")
    db = os.getenv("MYSQLDATABASE")

    if not all([host, user, password, db]):
        raise Exception("Missing DB environment variables")

    return f"mysql+pymysql://{user}:{password}@{host}:{port}/{db}"

DATABASE_URL = build_db_url()

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()