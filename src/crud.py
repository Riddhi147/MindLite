from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from passlib.hash import bcrypt
from . import models
import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8")[:72], bcrypt.gensalt()).decode("utf-8")

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8")[:72], hashed.encode("utf-8"))
# def hash_password(password: str):
#     return bcrypt.hash(password)


# def verify_password(password: str, hashed: str):
#     return bcrypt.verify(password, hashed)


def create_user(db: Session, email: str, password: str, role: str):
    user = models.User(
        email=email.lower().strip(),
        password=hash_password(password),
        role=role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def login_user(db: Session, email: str, password: str):
    user = db.query(models.User).filter(models.User.email == email.lower().strip()).first()
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user


def save_score(db: Session, user_id: int, game: str, score: float):
    new_score = models.Score(user_id=user_id, game=game, score=score)
    db.add(new_score)
    db.commit()
    db.refresh(new_score)
    return new_score


def get_scores(db: Session, user_id: int):
    return db.query(models.Score).filter(models.Score.user_id == user_id).all()


def get_family_members(db: Session, user_id: int):
    return db.query(models.FamilyMember).filter(models.FamilyMember.user_id == user_id).all()


def create_family_member(db: Session, user_id: int, name: str, relation: str, image_path: str):
    member = models.FamilyMember(user_id=user_id, name=name, relation=relation, image_path=image_path)
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


# ── Doctor–Patient ────────────────────────────────────────────────────────────

def link_doctor_patient(db: Session, doctor_id: int, patient_id: int):
    link = models.DoctorPatient(doctor_id=doctor_id, patient_id=patient_id)
    db.add(link)
    try:
        db.commit()
        db.refresh(link)
        return link
    except IntegrityError:
        db.rollback()
        return None  # already linked


def get_doctor_patients(db: Session, doctor_id: int):
    links = db.query(models.DoctorPatient).filter(models.DoctorPatient.doctor_id == doctor_id).all()
    result = []
    for link in links:
        patient = db.query(models.User).filter(models.User.id == link.patient_id).first()
        if patient:
            scores = db.query(models.Score).filter(models.Score.user_id == patient.id).all()
            last_played = max((s.created_at for s in scores), default=None)
            result.append({
                "patient_id": patient.id,
                "email": patient.email,
                "total_games": len(scores),
                "last_played": last_played.isoformat() if last_played else None,
            })
    return result


def unlink_doctor_patient(db: Session, doctor_id: int, patient_id: int):
    db.query(models.DoctorPatient).filter(
        models.DoctorPatient.doctor_id == doctor_id,
        models.DoctorPatient.patient_id == patient_id
    ).delete()
    db.commit()