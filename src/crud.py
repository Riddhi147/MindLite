from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from passlib.hash import bcrypt
from . import models
import bcrypt
import json
from datetime import datetime

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8")[:72], bcrypt.gensalt()).decode("utf-8")

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8")[:72], hashed.encode("utf-8"))
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


def save_score(db: Session, id: int, game: str, score: float):
    new_score = models.Score(id=id, game=game, score=score)
    db.add(new_score)
    db.commit()
    db.refresh(new_score)
    return new_score


def get_scores(db: Session, id: int):
    return db.query(models.Score).filter(models.Score.id == id).all()


def get_family_members(db: Session, id: int):
    return db.query(models.FamilyMember).filter(models.FamilyMember.id == id).all()


def create_family_member(db: Session, id: int, name: str, relation: str, image_path: str):
    member = models.FamilyMember(id=id, name=name, relation=relation, image_path=image_path)
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
    # Get all registered patients (not just linked ones)
    # This ensures caregivers/doctors can always see all patients
    all_patients = db.query(models.User).filter(models.User.role == "patient").all()

    result = []
    for patient in all_patients:
        scores = db.query(models.Score).filter(models.Score.id == patient.SNo).all()
        last_played = max((s.created_at for s in scores), default=None)
        result.append({
            "patient_id": patient.SNo,
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


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email.lower().strip()).first()


def get_patient_caregivers(db: Session, patient_email: str):
    """Get caregivers added by the patient."""
    patient = get_user_by_email(db, patient_email)
    if not patient:
        return []
    caregivers = db.query(models.PatientCaregiver).filter(
        models.PatientCaregiver.patient_id == patient.SNo
    ).all()
    result = []
    for cg in caregivers:
        result.append({
            "id": cg.SNo,
            "name": cg.name,
            "email": cg.email,
        })
    return result


def create_patient_caregiver(db: Session, patient_id: int, name: str, email: str):
    cg = models.PatientCaregiver(patient_id=patient_id, name=name, email=email.lower().strip())
    db.add(cg)
    db.commit()
    db.refresh(cg)
    return cg


def sync_patient_data(db: Session, email: str, scores, predictions, alerts):
    user = get_user_by_email(db, email)
    if not user:
        return False
        
    db.query(models.Score).filter(models.Score.id == user.SNo).delete()
    db.query(models.MLPredictionData).filter(models.MLPredictionData.id == user.SNo).delete()
    db.query(models.DeclineAlertData).filter(models.DeclineAlertData.id == user.SNo).delete()

    for s in scores:
        from dateutil import parser
        try:
            dt = parser.parse(s.created_at) if s.created_at else datetime.utcnow()
        except Exception:
            dt = datetime.utcnow()
            
        db.add(models.Score(
            id=user.SNo,
            game=s.game,
            score=s.score,
            created_at=dt
        ))
        
    for p in predictions:
        db.add(models.MLPredictionData(
            id=user.SNo,
            cognitive_score=p.cognitive_score,
            risk=p.risk,
            timestamp=p.timestamp,
            inputs_json=json.dumps(p.inputs.dict()) if hasattr(p.inputs, 'dict') else "{}"
        ))
        
    for a in alerts:
        db.add(models.DeclineAlertData(
            alert_id=a.id,
            id=user.SNo,
            type=a.type,
            message=a.message,
            drop_amount=a.drop_amount,
            current_score=a.current_score,
            timestamp=a.timestamp,
            dismissed=int(a.dismissed)
        ))
        
    db.commit()
    return True


def get_patient_profile(db: Session, email: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
        
    scores = db.query(models.Score).filter(models.Score.id == user.SNo).all()
    predictions = db.query(models.MLPredictionData).filter(models.MLPredictionData.id == user.SNo).all()
    alerts = db.query(models.DeclineAlertData).filter(models.DeclineAlertData.id == user.SNo).all()
    
    return {
        "scores": [
            {
                "id": s.SNo, 
                "game": s.game, 
                "score": s.score, 
                "created_at": s.created_at.isoformat() if s.created_at else None
            }
            for s in scores
        ],
        "predictions": [
            {
                "cognitive_score": p.cognitive_score, 
                "risk": p.risk, 
                "timestamp": p.timestamp, 
                "inputs": json.loads(p.inputs_json) if p.inputs_json else {}
            }
            for p in predictions
        ],
        "alerts": [
            {
                "id": a.alert_id, 
                "type": a.type, 
                "message": a.message,
                "drop_amount": a.drop_amount, 
                "current_score": a.current_score,
                "timestamp": a.timestamp, 
                "dismissed": bool(a.dismissed)
            }
            for a in alerts
        ]
    }


# ── Daily Check-in ────────────────────────────────────────────────────────────

def upsert_daily_checkin(db: Session, patient_id: int, q1: bool, q2: bool, q3: bool):
    from datetime import date
    today = date.today()
    existing = db.query(models.DailyCheckin).filter(
        models.DailyCheckin.patient_id == patient_id,
        models.DailyCheckin.date == today
    ).first()
    if existing:
        existing.q1 = int(q1)
        existing.q2 = int(q2)
        existing.q3 = int(q3)
        db.commit()
        db.refresh(existing)
        return existing
    checkin = models.DailyCheckin(
        patient_id=patient_id,
        date=today,
        q1=int(q1),
        q2=int(q2),
        q3=int(q3),
    )
    db.add(checkin)
    db.commit()
    db.refresh(checkin)
    return checkin


def get_today_checkin(db: Session, patient_id: int):
    from datetime import date
    today = date.today()
    return db.query(models.DailyCheckin).filter(
        models.DailyCheckin.patient_id == patient_id,
        models.DailyCheckin.date == today
    ).first()
