"""
Reset database schema to match new column names (SNo, id instead of id, user_id)
Run this once to rebuild tables with the new schema
"""

from src.database import engine, Base
from src import models

print("Dropping all existing tables...")
Base.metadata.drop_all(bind=engine)

print("Creating new tables with updated schema...")
Base.metadata.create_all(bind=engine)

print("✅ Database schema reset complete!")
print("\nNew schema:")
print("- users: SNo (PK), email, password, role")
print("- scores: SNo (PK), id (FK→users.SNo), game, score, created_at")
print("- family_members: SNo (PK), id (FK→users.SNo), name, relation, image_path")
print("- doctor_patients: SNo (PK), doctor_id, patient_id")
print("- patient_caregivers: SNo (PK), patient_id (FK→users.SNo), name, email")
print("- ml_predictions: SNo (PK), id (FK→users.SNo), cognitive_score, risk, timestamp, inputs_json")
print("- decline_alerts: SNo (PK), alert_id, id (FK→users.SNo), type, message, drop_amount, current_score, timestamp, dismissed")
