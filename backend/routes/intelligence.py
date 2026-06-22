from fastapi import APIRouter
from ..schemas.schemas import EmergencyChatRequest

router = APIRouter(tags=["Intelligence"])

@router.post("/emergency-chat")
def emergency_chat(payload: EmergencyChatRequest):
    msg = payload.message.lower()

    if "fainted" in msg or "medical" in msg or "heart" in msg:
        response = (
            "**[AI Operational Directive - Medical Emergency]**\n\n"
            "1. **Staff Deployment**: Alerting RPF (Railway Protection Force) and the on-duty medical officer to proceed to Platform 3 immediately with a stretcher and emergency kit.\n"
            "2. **Crowd Routing**: Directing platform staff to clear a 10-meter perimeter around the passenger to allow air flow.\n"
            "3. **Rerouting Directive**: Move incoming Train 12952 (Rajdhani Express) to Platform 5 instead of Platform 3 to prevent congestion."
        )
    elif "smoke" in msg or "fire" in msg:
        response = (
            "**[AI Command Alert - FIRE / SMOKE DETECTED]**\n\n"
            "1. **Emergency Call**: Dispatching fire emergency services and initiating local hydrant systems near Track 2.\n"
            "2. **Train Control**: Instructing signaling room to hold Jhelum Express (11077) at home signal. Diverting all incoming traffic from tracks 2 and 3.\n"
            "3. **Evacuation protocol**: Commencing public announcements to evacuate Platform 2 and 3 using overhead bridges towards Exit Gate 1."
        )
    elif "surge" in msg or "crowd" in msg or "congestion" in msg:
        response = (
            "**[AI Tactical Plan - CROWD SURGE RISK]**\n\n"
            "1. **Access Controls**: Close platform escalators and ticketing gates for Platform 5 temporarily to throttle inflow.\n"
            "2. **Staff Alert**: Deploying 8 additional RPF personnel to manage passenger flow lines at stairwells.\n"
            "3. **Announcement**: Broadside multilingual audio alerts requesting passengers to distribute evenly across the platform length."
        )
    else:
        response = (
            f"**[AI Assistant Response]**\n\n"
            f"Received operation request: \"{payload.message}\".\n\n"
            f"*Operational Checklist:*\n"
            f"- Operational logs reviewed.\n"
            f"- System monitoring healthy.\n"
            f"- Recommended course of action: Alert platform staff and monitor telemetry parameters. Please verify if track obstruction is present."
        )

    return {"response": response}
