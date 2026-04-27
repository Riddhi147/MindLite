from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from src.database.base import Base


class User(Base):
    __tablename__ = "users"

    SNo = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True)
    password = Column(String(200))
    role = Column(String(50))

    scores = relationship("Score", back_populates="user")


class Score(Base):
    __tablename__ = "scores"

    SNo = Column(Integer, primary_key=True, autoincrement=True)
    id = Column(Integer, ForeignKey("users.SNo"), nullable=False)
    game = Column(String(50))
    score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="scores")


class FamilyMember(Base):
    __tablename__ = "family_members"

    SNo = Column(Integer, primary_key=True, index=True)
    id = Column(Integer, ForeignKey("users.SNo"))
    name = Column(String(100))
    relation = Column(String(100))
    image_path = Column(String(255))


class DoctorPatient(Base):
    __tablename__ = "doctor_patients"

    SNo = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("users.SNo"))
    patient_id = Column(Integer, ForeignKey("users.SNo"))
    __table_args__ = (UniqueConstraint("doctor_id", "patient_id", name="uq_doctor_patient"),)


class PatientCaregiver(Base):
    __tablename__ = "patient_caregivers"

    SNo = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.SNo"))
    name = Column(String(100))
    email = Column(String(100))

class MLPredictionData(Base):
    __tablename__ = "ml_predictions"

    SNo = Column(Integer, primary_key=True, index=True)
    id = Column(Integer, ForeignKey("users.SNo"))
    cognitive_score = Column(Float)
    risk = Column(String(50))
    timestamp = Column(String(100))  # ISO string from frontend
    inputs_json = Column(String(500))  # JSON string of the 5 game inputs


class DeclineAlertData(Base):
    __tablename__ = "decline_alerts"

    SNo = Column(Integer, primary_key=True, index=True)
    alert_id = Column(String(100))
    id = Column(Integer, ForeignKey("users.SNo"))
    type = Column(String(50))
    message = Column(String(500))
    drop_amount = Column(Float)
    current_score = Column(Float)
    timestamp = Column(String(100))
    dismissed = Column(Integer, default=0)


class DailyCheckin(Base):
    __tablename__ = "daily_checkins"

    SNo = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.SNo"), nullable=False)
    date = Column(Date, nullable=False)           # YYYY-MM-DD, one row per patient per day
    q1 = Column(Integer, nullable=False)          # 1 = Yes, 0 = No
    q2 = Column(Integer, nullable=False)
    q3 = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("patient_id", "date", name="uq_patient_date"),)