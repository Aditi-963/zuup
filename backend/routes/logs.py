from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database.connection import get_db
from ..models.models import AuditLog, Train, Platform
from ..schemas.schemas import AuditLogBase, ActionRequest

router = APIRouter(prefix="/audit-logs", tags=["Audit Logs"])

@router.get("", response_model=List[AuditLogBase])
def get_logs(db: Session = Depends(get_db)):
    return db.query(AuditLog).order_by(AuditLog.id.desc()).all()

@router.post("/{id}/action", response_model=AuditLogBase)
def respond_to_log(id: int, payload: ActionRequest, db: Session = Depends(get_db)):
    log = db.query(AuditLog).filter(AuditLog.id == id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Audit log entry not found")

    log.status = "APPROVED" if payload.approved else "REJECTED"

    # If approved and there is a platform swap recommended, update the active state
    if payload.approved and log.recommended_action:
        action = log.recommended_action
        train_num = action.get("move_train")
        old_plat_num = action.get("old_platform")
        new_plat_num = action.get("new_platform")

        # 1. Update the train's assigned platform
        train = db.query(Train).filter(Train.train_number == train_num).first()
        if train:
            train.platform = new_plat_num
            train.status = "WARNING"  # Status downgraded from DELAYED to WARNING due to reroute fix

        # 2. Vacate the old platform
        old_plat = db.query(Platform).filter(Platform.platform_number == old_plat_num).first()
        if old_plat and old_plat.assigned_train_number == train_num:
            old_plat.assigned_train_number = None
            old_plat.occupancy_status = "VACANT"

        # 3. Occupy the new platform
        new_plat = db.query(Platform).filter(Platform.platform_number == new_plat_num).first()
        if new_plat:
            new_plat.assigned_train_number = train_num
            new_plat.occupancy_status = "OCCUPIED"

    db.commit()
    db.refresh(log)
    return log
