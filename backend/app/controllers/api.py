from fastapi import APIRouter, HTTPException
from app.models.schemas import DelayEvent, ChatMessage, AcceptDecision, CrowdAlertEvent, MultiDelayEvent
from app.services import ai_service, db_service
from datetime import datetime
import json

router = APIRouter(prefix="/api")

@router.get("/timetable")
def get_timetable():
    return {
        "trains": ai_service.TIMETABLE,
        "station": "Pune Junction",
        "timestamp": datetime.now().isoformat()
    }

@router.post("/simulate-delay")
async def simulate_delay(event: DelayEvent):
    try:
        plan = await ai_service.generate_recovery_plan(event.train_id, event.delay_mins, event.location)
        db_service.log_decision("delay_cascade", event.train_id, plan)
        return {"status": "plan_generated", "delay_event": event.dict(), "recovery_plan": plan}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/crowd-alert")
async def crowd_alert(event: CrowdAlertEvent):
    try:
        plan = await ai_service.generate_crowd_plan(event.platform, event.capacity_percent)
        db_service.log_decision("crowd_alert", f"Plat {event.platform}", {"plan": plan})
        return {"plan": plan}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/simulate-multi-delay")
async def simulate_multi_delay(event: MultiDelayEvent):
    try:
        plan = await ai_service.generate_multi_delay_plan(event.delays)
        db_service.log_decision("multi_cascade", "multi_train", plan)
        return {"status": "multi_plan_generated", "recovery_plan": plan}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/decision-action")
async def decision_action(action: AcceptDecision):
    try:
        outcome = db_service.log_action(action.decision_id, action.accepted)
        return {"status": "action_logged", "outcome": outcome}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/emergency-chat")
async def emergency_chat(msg: ChatMessage):
    try:
        reply = await ai_service.generate_chat_reply(msg.message, msg.language)
        return {"reply": reply, "language": msg.language}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/audit-log")
def get_audit_log():
    try:
        logs = db_service.get_audit_logs()
        return {"decisions": logs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
