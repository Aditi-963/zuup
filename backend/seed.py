import sys
import os

# Append project root to path for backend module resolution
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database.connection import engine, SessionLocal
from backend.database.base import Base
from backend.models.models import Train, Platform, AuditLog, User
from backend.services.auth import hash_password
from datetime import datetime, timezone

def seed_db():
    print("Purging database and creating new tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Default Users
        users = [
            User(
                full_name="SM R. K. Sharma",
                email="stationmaster@rail.gov.in",
                hashed_password=hash_password("password123"),
                organization="Northern Railway Division",
                role="STATION_MASTER"
            ),
            User(
                full_name="Operator Amit Patel",
                email="operator@rail.gov.in",
                hashed_password=hash_password("password123"),
                organization="Delhi Control Command HQ",
                role="CONTROL_OPERATOR"
            ),
            User(
                full_name="Admin Neha Singh",
                email="admin@rail.gov.in",
                hashed_password=hash_password("password123"),
                organization="Indian Railways Head Office",
                role="ADMIN"
            ),
        ]

        # Default Trains
        trains = [
            Train(train_number="12123", train_name="Deccan Express", platform=2, scheduled_time="14:30", delay_minutes=0, status="ON_TIME"),
            Train(train_number="12952", train_name="Rajdhani Express", platform=3, scheduled_time="14:45", delay_minutes=0, status="ON_TIME"),
            Train(train_number="12043", train_name="Shatabdi Express", platform=4, scheduled_time="15:00", delay_minutes=0, status="ON_TIME"),
            Train(train_number="11077", train_name="Jhelum Express", platform=1, scheduled_time="15:15", delay_minutes=0, status="ON_TIME"),
            Train(train_number="12261", train_name="Duronto Express", platform=6, scheduled_time="15:30", delay_minutes=0, status="ON_TIME"),
            Train(train_number="12925", train_name="Paschim Express", platform=5, scheduled_time="16:00", delay_minutes=0, status="ON_TIME"),
            Train(train_number="12626", train_name="Kerala Express", platform=7, scheduled_time="16:15", delay_minutes=0, status="ON_TIME"),
            Train(train_number="12301", train_name="Howrah Duronto", platform=8, scheduled_time="16:40", delay_minutes=0, status="ON_TIME"),
        ]

        # Default Platforms
        platforms = [
            Platform(platform_number=1, occupancy_status="OCCUPIED", assigned_train_number="11077", crowd_status="LOW"),
            Platform(platform_number=2, occupancy_status="OCCUPIED", assigned_train_number="12123", crowd_status="MEDIUM"),
            Platform(platform_number=3, occupancy_status="OCCUPIED", assigned_train_number="12952", crowd_status="LOW"),
            Platform(platform_number=4, occupancy_status="OCCUPIED", assigned_train_number="12043", crowd_status="LOW"),
            Platform(platform_number=5, occupancy_status="VACANT", assigned_train_number=None, crowd_status="LOW"),
            Platform(platform_number=6, occupancy_status="OCCUPIED", assigned_train_number="12261", crowd_status="LOW"),
            Platform(platform_number=7, occupancy_status="OCCUPIED", assigned_train_number="12626", crowd_status="LOW"),
            Platform(platform_number=8, occupancy_status="OCCUPIED", assigned_train_number="12301", crowd_status="LOW"),
        ]

        # Startup Log
        logs = [
            AuditLog(
                timestamp=datetime.now(timezone.utc),
                event_type="System Startup",
                description="RailSaarthi Autonomous Operations Intelligence initialized for New Delhi (NDLS) command room.",
                recommended_action=None,
                status="APPROVED",
                operator_name="SYSTEM",
                recovery_time_saved="0 mins"
            )
        ]

        print("Adding seed data to database...")
        db.add_all(users)
        db.add_all(trains)
        db.add_all(platforms)
        db.add_all(logs)
        db.commit()
        print("Database seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
