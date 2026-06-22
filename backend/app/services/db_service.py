import sqlite3
import json
from datetime import datetime
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "railsaarthi_audit.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""CREATE TABLE IF NOT EXISTS decisions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT, event_type TEXT, train_id TEXT,
        decision_json TEXT, accepted_by TEXT, outcome TEXT
    )""")
    conn.commit()
    return conn

def log_decision(event_type: str, train_id: str, plan_data: dict) -> int:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO decisions (timestamp, event_type, train_id, decision_json) VALUES (?,?,?,?)",
        (datetime.now().isoformat(), event_type, train_id, json.dumps(plan_data))
    )
    conn.commit()
    inserted_id = cursor.lastrowid
    conn.close()
    return inserted_id

def log_action(train_id: str, accepted: bool, override_reason: str = "") -> str:
    conn = get_db()
    outcome = "ACCEPTED" if accepted else "OVERRIDDEN"
    conn.execute(
        "UPDATE decisions SET accepted_by = ?, outcome = ? WHERE id = (SELECT max(id) FROM decisions WHERE train_id = ?)",
        ("Station Master", outcome, train_id)
    )
    conn.commit()
    conn.close()
    return outcome

def get_audit_logs() -> list:
    conn = get_db()
    rows = conn.execute("SELECT id, timestamp, event_type, train_id, accepted_by, outcome FROM decisions ORDER BY id DESC LIMIT 50").fetchall()
    conn.close()
    return [
        {
            "id": r[0],
            "timestamp": r[1],
            "type": r[2],
            "train": r[3],
            "accepted_by": r[4],
            "outcome": r[5]
        }
        for r in rows
    ]
