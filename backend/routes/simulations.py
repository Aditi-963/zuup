from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.connection import get_db
from ..models.models import Train, Platform, AuditLog
from ..schemas.schemas import SimulationDelayRequest, AIRecommendationSchema
from ..agents.orchestrator import orchestrator
from datetime import datetime, timezone

router = APIRouter(tags=["Simulations"])

@router.post("/simulate-delay")
def simulate_delay(payload: SimulationDelayRequest, db: Session = Depends(get_db)):
    train = db.query(Train).filter(Train.train_number == payload.train_number).first()
    if not train:
        raise HTTPException(status_code=404, detail="Train not found")

    # Update delay details
    train.delay_minutes = payload.delay_minutes
    train.status = "DELAYED" if payload.delay_minutes > 30 else "WARNING"

    # Run AI multi-agent pipeline
    recommendation = orchestrator.run_pipeline(payload.train_number, payload.delay_minutes, db)

    # Log the decision recommendation as pending
    new_log = AuditLog(
        timestamp=datetime.now(timezone.utc),
        event_type="Delay Event",
        description=f"Train {train.train_number} ({train.train_name}) delayed by {payload.delay_minutes} mins. Downstream conflict on Platform {recommendation['recommended_action']['old_platform']}.",
        recommended_action=recommendation["recommended_action"],
        status="PENDING",
        operator_name="SM R. K. Sharma",
        recovery_time_saved=recommendation["estimated_recovery"]
    )

    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    return {
        "recommendation": recommendation,
        "log_id": new_log.id
    }

@router.post("/simulate-cascade")
def simulate_cascade(db: Session = Depends(get_db)):
    # Simulates multiple delays cascading
    trains_to_update = {
        "12123": (60, "DELAYED"),
        "12952": (25, "WARNING"),
        "12043": (15, "WARNING")
    }

    for t_num, (delay, status) in trains_to_update.items():
        t = db.query(Train).filter(Train.train_number == t_num).first()
        if t:
            t.delay_minutes = delay
            t.status = status

    recommendation = {
        "event_type": "cascade_delay",
        "affected_trains": ["12952 Rajdhani Express", "12043 Shatabdi Express"],
        "recommended_action": {
            "move_train": "12123",
            "old_platform": 2,
            "new_platform": 5
        },
        "crowd_risk": "HIGH",
        "announcement": "May I have your attention please. Train 12123, Deccan Express, is delayed by 60 minutes. Connecting trains 12952 Rajdhani Express and 12043 Shatabdi Express are now rescheduled. Train 12123 will arrive on Platform 5 instead of Platform 2.",
        "confidence": "89%",
        "estimated_recovery": "18 mins"
    }

    new_log = AuditLog(
        timestamp=datetime.now(timezone.utc),
        event_type="Cascading Delays",
        description="Primary delay of Deccan Express (12123) triggered secondary cascading delays on Rajdhani Express and Shatabdi Express.",
        recommended_action=recommendation["recommended_action"],
        status="PENDING",
        operator_name="SM R. K. Sharma",
        recovery_time_saved="18 mins"
    )

    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    return {
        "recommendation": recommendation,
        "log_id": new_log.id
    }

@router.post("/simulate-crowd")
def simulate_crowd(db: Session = Depends(get_db)):
    platform3 = db.query(Platform).filter(Platform.platform_number == 3).first()
    if platform3:
        platform3.crowd_status = "HIGH"

    recommendation = {
        "event_type": "crowd_surge",
        "affected_trains": ["12952 Rajdhani Express"],
        "recommended_action": {
            "move_train": "12952",
            "old_platform": 3,
            "new_platform": 5
        },
        "crowd_risk": "HIGH",
        "announcement": "Attention passengers on Platform 3. Due to platform congestion, Train 12952 Rajdhani Express will now arrive on Platform 5. Please use the central overhead bridge to proceed to Platform 5 safely.",
        "confidence": "92%",
        "estimated_recovery": "6 mins"
    }

    new_log = AuditLog(
        timestamp=datetime.now(timezone.utc),
        event_type="Crowd Emergency",
        description="Crowd surge detected on Platform 3. Recommendation: swap Rajdhani Express to Platform 5 to avoid choke-points.",
        recommended_action=recommendation["recommended_action"],
        status="PENDING",
        operator_name="SM R. K. Sharma",
        recovery_time_saved="6 mins"
    )

    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    return {
        "recommendation": recommendation,
        "log_id": new_log.id
    }

@router.post("/simulate-emergency")
def simulate_emergency(db: Session = Depends(get_db)):
    platform3 = db.query(Platform).filter(Platform.platform_number == 3).first()
    if platform3:
        platform3.occupancy_status = "BLOCKED"

    recommendation = {
        "event_type": "medical_emergency",
        "affected_trains": ["12952 Rajdhani Express"],
        "recommended_action": {
            "move_train": "12952",
            "old_platform": 3,
            "new_platform": 5
        },
        "crowd_risk": "HIGH",
        "announcement": "Operational Alert: Platform 3 is temporarily closed for emergency medical services. Passengers are requested not to gather near the area. Train 12952, Rajdhani Express, is reassigned to Platform 5.",
        "confidence": "98%",
        "estimated_recovery": "14 mins"
    }

    new_log = AuditLog(
        timestamp=datetime.now(timezone.utc),
        event_type="Medical Emergency",
        description="Passenger cardiac arrest reported on Platform 3. Platform blocked for medical responders. Rajdhani Express rerouted to Platform 5.",
        recommended_action=recommendation["recommended_action"],
        status="PENDING",
        operator_name="SM R. K. Sharma",
        recovery_time_saved="14 mins"
    )

    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    return {
        "recommendation": recommendation,
        "log_id": new_log.id
    }
