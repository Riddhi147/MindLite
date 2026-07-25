"""Inspect a user's records in the configured Neon PostgreSQL database."""

from sqlalchemy import text

from src.database import engine


email = "riddhikhurana04@gmail.com"

with engine.connect() as connection:
    user = connection.execute(
        text("SELECT \"SNo\", email, role FROM users WHERE email = :email"),
        {"email": email},
    ).mappings().first()
    print(f"User found: {user}")

    if user:
        user_id = user["SNo"]
        for table, columns in [
            ("scores", '\"SNo\", game, score, created_at'),
            ("ml_predictions", '\"SNo\", cognitive_score, risk, timestamp, inputs_json'),
            ("decline_alerts", "*"),
        ]:
            rows = connection.execute(
                text(f"SELECT {columns} FROM {table} WHERE id = :user_id"),
                {"user_id": user_id},
            ).mappings().all()
            print(f"{table}: {len(rows)} record(s)")
            for row in rows:
                print(f"  {dict(row)}")
