from sqlalchemy import Column, String, Integer, DateTime, JSON
from datetime import datetime, timezone
from ..database.base import Base

class Train(Base):
    __tablename__ = "trains"

    train_number = Column(String, primary_key=True, index=True)
    train_name = Column(String, nullable=False)
    platform = Column(Integer, nullable=True)
    scheduled_time = Column(String, nullable=False)
    delay_minutes = Column(Integer, default=0)
    status = Column(String, default="ON_TIME")  # "ON_TIME", "WARNING", "DELAYED"

class Platform(Base):
    __tablename__ = "platforms"

    platform_number = Column(Integer, primary_key=True, index=True)
    occupancy_status = Column(String, default="VACANT")  # "VACANT", "OCCUPIED", "BLOCKED"
    assigned_train_number = Column(String, nullable=True)
    crowd_status = Column(String, default="LOW")  # "LOW", "MEDIUM", "HIGH"

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    event_type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    recommended_action = Column(JSON, nullable=True)  # { "move_train": "12123", "old_platform": 2, "new_platform": 5 }
    status = Column(String, default="PENDING")  # "PENDING", "APPROVED", "REJECTED"
    operator_name = Column(String, default="SM R. K. Sharma")
    recovery_time_saved = Column(String, default="0 mins")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    organization = Column(String, nullable=False)
    role = Column(String, default="CONTROL_OPERATOR")  # "STATION_MASTER", "CONTROL_OPERATOR", "ADMIN"
