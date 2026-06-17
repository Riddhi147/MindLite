



import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


print("MYSQLHOST:", os.getenv("MYSQLHOST"))
print("MYSQLUSER:", os.getenv("MYSQLUSER"))
print("MYSQLDATABASE:", os.getenv("MYSQLDATABASE"))

host = os.getenv("MYSQLHOST")
port = os.getenv("MYSQLPORT")
user = os.getenv("MYSQLUSER")
password = os.getenv("MYSQLPASSWORD")
db = os.getenv("MYSQLDATABASE")

if not all([host, user, password, db]):
    raise Exception("Missing Railway MySQL environment variables")

DATABASE_URL = f"mysql+pymysql://{user}:{password}@{host}:{port}/{db}"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()