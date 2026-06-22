from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional, Dict, Any

class TrainBase(BaseModel):
    train_number: str
    train_name: str
    platform: Optional[int] = None
    scheduled_time: str
    delay_minutes: int
    status: str

    class Config:
        from_attributes = True

class PlatformBase(BaseModel):
    platform_number: int
    occupancy_status: str
    assigned_train_number: Optional[str] = None
    crowd_status: str

    class Config:
        from_attributes = True

class AuditLogBase(BaseModel):
    id: int
    timestamp: datetime
    event_type: str
    description: str
    recommended_action: Optional[Dict[str, Any]] = None
    status: str
    operator_name: str
    recovery_time_saved: str

    class Config:
        from_attributes = True

class SimulationDelayRequest(BaseModel):
    train_number: str
    delay_minutes: int

class EmergencyChatRequest(BaseModel):
    message: str

class ActionRequest(BaseModel):
    approved: bool

class RecommendedActionSchema(BaseModel):
    move_train: str
    old_platform: int
    new_platform: int

class AIRecommendationSchema(BaseModel):
    event_type: str
    affected_trains: List[str]
    recommended_action: RecommendedActionSchema
    crowd_risk: str
    announcement: str
    confidence: str
    estimated_recovery: str

# New Authentication Schemas
class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    organization: str
    role: str  # "STATION_MASTER", "CONTROL_OPERATOR", "ADMIN"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    organization: str
    role: str

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
