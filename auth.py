import hashlib
from src.database import get_conn

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def register(email, password, role):
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("INSERT INTO users VALUES(NULL,%s,%s,%s)",
                (email, hash_password(password), role))

    conn.commit()
    conn.close()

    # cur.execute("""
    # CREATE TABLE IF NOT EXISTS users(
    #     id INTEGER PRIMARY KEY,
    #     email TEXT UNIQUE,
    #     password TEXT,
    #     role TEXT
    # )
    # """)

def login(email, password):
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT role FROM users WHERE email=%s AND password=%s",
                (email, hash_password(password)))

    result = cur.fetchone()
    conn.close()

    return result[0] if result else None