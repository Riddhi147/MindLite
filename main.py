from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File, Form
import shutil
import os

from src.database import SessionLocal, engine, Base
from src import crud
from src import schemas


UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

Base.metadata.create_all(bind=engine)

# allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "MindLite backend running"}


@app.post("/register")
def register(user: schemas.RegisterRequest, db: Session = Depends(get_db)):
    return crud.create_user(
        db,
        user.email,
        user.password,
        user.role
    )


@app.post("/login")
def login(user: schemas.LoginRequest, db: Session = Depends(get_db)):

    db_user = crud.login_user(
        db,
        user.email,
        user.password
    )

    if not db_user:
        return {"error": "Invalid credentials"}

    return {
        "user_id": db_user.id,
        "email": db_user.email,
        "role": db_user.role
    }


@app.post("/score")
def add_score(score: schemas.ScoreRequest, db: Session = Depends(get_db)):

    return crud.save_score(
        db,
        score.user_id,
        score.game,
        score.score
    )


@app.get("/scores/{user_id}")
def get_scores(user_id: int, db: Session = Depends(get_db)):

    return crud.get_scores(db, user_id)


@app.get("/family-members/{user_id}")
def get_family_members(user_id: int, db: Session = Depends(get_db)):

    members = crud.get_family_members(db, user_id)

    return [
        {
            "name": m.name,
            "image": f"http://127.0.0.1:8000/{m.image_path}"
        }
        for m in members
    ]
    

@app.post("/upload-family-member")
def upload_family_member(
    user_id: int = Form(...),
    name: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    import uuid

    filename = f"{uuid.uuid4()}_{image.filename}"
    file_path = f"{UPLOAD_FOLDER}/{filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    crud.create_family_member(
        db=db,
        user_id=user_id,
        name=name,
        image_path=file_path
    )

    return {"message": "Family member uploaded successfully"}