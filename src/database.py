from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Railway environment variables (SAFE WAY)
DB_HOST = os.getenv("mysql.railway.internal")
DB_PORT = os.getenv("MYSQLPORT", "3306")
DB_USER = os.getenv("root")
DB_PASSWORD = os.getenv("tMAHBlJdovEIpswVWHmEaeeOfMxuwJXe")
DB_NAME = os.getenv("railway")

# Fallback (only if Railway vars are missing)
if not DB_HOST:
    DB_HOST = "localhost"
    DB_USER = "root"
    DB_PASSWORD = "yourpassword"
    DB_NAME = "mind_lite"

DATABASE_URL = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()