import os
import pymysql

conn = pymysql.connect(
    host=os.getenv("MYSQLHOST"),
    user=os.getenv("MYSQLUSER"),
    password=os.getenv("MYSQLPASSWORD"),
    database=os.getenv("MYSQLDATABASE"),
    port=int(os.getenv("MYSQLPORT", 3306))
)

cursor = conn.cursor()

email = 'riddhikhurana04@gmail.com'

cursor.execute("SELECT SNo, email, role FROM users WHERE email = %s", (email,))
user = cursor.fetchone()
print(f"User found: {user}")

if user:
    user_id = user[0]

    cursor.execute("SELECT SNo, game, score, created_at FROM scores WHERE id = %s", (user_id,))
    scores = cursor.fetchall()
    print(f"\nScores for id={user_id}: {len(scores)}")

    for s in scores:
        print(f"  SNo={s[0]}, game={s[1]}, score={s[2]}, created_at={s[3]}")

    cursor.execute("SELECT SNo, cognitive_score, risk, timestamp, inputs_json FROM ml_predictions WHERE id = %s", (user_id,))
    preds = cursor.fetchall()
    print(f"\nPredictions for id={user_id}: {len(preds)}")

    for p in preds:
        print(f"  SNo={p[0]}, score={p[1]}, risk={p[2]}, inputs_json={p[4]}")

    cursor.execute("SELECT * FROM decline_alerts WHERE id = %s", (user_id,))
    alerts = cursor.fetchall()
    print(f"\nAlerts for id={user_id}: {len(alerts)}")

conn.close()