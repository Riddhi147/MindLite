from sqlalchemy import text

from src.database import SessionLocal


def get_user_data(user_id: int):
    """Return model features derived from a user's stored game scores."""
    with SessionLocal() as session:
        rows = session.execute(
            text("SELECT game, score FROM scores WHERE id = :user_id"),
            {"user_id": user_id},
        ).mappings().all()

    if not rows:
        return None

    data = {
        "age": 65,
        "memory_score": 0,
        "attention_score": 0,
        "language_score": 0,
        "sleep_hours": 6,
        "activity_level": 5,
    }
    for row in rows:
        if row["game"] == "memory":
            data["memory_score"] = row["score"]
        elif row["game"] == "attention":
            data["attention_score"] = row["score"]
        elif row["game"] == "language":
            data["language_score"] = row["score"]
    return data
