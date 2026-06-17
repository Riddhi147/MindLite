# src/database/db.py

import os
import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host=os.getenv("MYSQLHOST"),
        user=os.getenv("MYSQLUSER"),
        password=os.getenv("MYSQLPASSWORD"),
        database=os.getenv("MYSQLDATABASE"),
        port=int(os.getenv("MYSQLPORT", 3306))
    )

def get_user_data(id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT game, score 
    FROM scores
    WHERE id = %s
    """

    cursor.execute(query, (id,))
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    if not rows:
        return None

    data = {
        "age": 65,  # placeholder (not in DB)
        "memory_score": 0,
        "attention_score": 0,
        "language_score": 0,
        "sleep_hours": 6,
        "activity_level": 5
    }

    for row in rows:
        if row["game"] == "memory":
            data["memory_score"] = row["score"]
        elif row["game"] == "attention":
            data["attention_score"] = row["score"]
        elif row["game"] == "language":
            data["language_score"] = row["score"]

    return data