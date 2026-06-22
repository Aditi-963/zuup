from pydantic import BaseModel
from typing import List, Dict, Optional

class DelayEvent(BaseModel):
    train_id: str
    delay_mins: int
    location: str = "En route"

class ChatMessage(BaseModel):
    message: str
    language: str = "en"

class AcceptDecision(BaseModel):
    decision_id: str
    accepted: bool
    override_reason: str = ""

class CrowdAlertEvent(BaseModel):
    platform: int
    capacity_percent: int = 340

class MultiDelayEvent(BaseModel):
    delays: List[Dict]
