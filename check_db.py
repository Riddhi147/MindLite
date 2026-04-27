import pymysql

conn = pymysql.connect(host='localhost', user='root', password='yourpassword', database='mind_lite')
cursor = conn.cursor()

# Simulate what get_patient_profile does for email 'riddhikhurana04@gmail.com'
email = 'riddhikhurana04@gmail.com'

# Step 1: Find user by email
cursor.execute("SELECT SNo, email, role FROM users WHERE email = %s", (email,))
user = cursor.fetchone()
print(f"User found: {user}")

if user:
    id = user[0]
    
    # Step 2: Get scores
    cursor.execute("SELECT SNo, game, score, created_at FROM scores WHERE id = %s", (id,))
    scores = cursor.fetchall()
    print(f"\nScores for id={id}: {len(scores)}")
    for s in scores:
        print(f"  SNo={s[0]}, game={s[1]}, score={s[2]}, created_at={s[3]}")
    
    # Step 3: Get predictions
    cursor.execute("SELECT SNo, cognitive_score, risk, timestamp, inputs_json FROM ml_predictions WHERE id = %s", (id,))
    preds = cursor.fetchall()
    print(f"\nPredictions for id={id}: {len(preds)}")
    for p in preds:
        print(f"  SNo={p[0]}, score={p[1]}, risk={p[2]}, inputs_json={p[4]}")
    
    # Step 4: Get alerts
    cursor.execute("SELECT * FROM decline_alerts WHERE id = %s", (id,))
    alerts = cursor.fetchall()
    print(f"\nAlerts for id={id}: {len(alerts)}")

conn.close()
