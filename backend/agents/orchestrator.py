from .delay_agent import DelayDetectionAgent
from .cascade_agent import CascadeAnalysisAgent
from .platform_agent import PlatformOptimizationAgent
from .crowd_agent import CrowdRiskAgent
from .comms_agent import CommunicationAgent
from sqlalchemy.orm import Session
from ..models.models import Train, Platform

class AgentOrchestrator:
    def __init__(self):
        self.delay_agent = DelayDetectionAgent()
        self.cascade_agent = CascadeAnalysisAgent()
        self.platform_agent = PlatformOptimizationAgent()
        self.crowd_agent = CrowdRiskAgent()
        self.comms_agent = CommunicationAgent()

    def run_pipeline(self, train_number: str, delay_minutes: int, db: Session) -> dict:
        # 1. Fetch live telemetry from DB
        train_record = db.query(Train).filter(Train.train_number == train_number).first()
        train_name = train_record.train_name if train_record else "Unknown Train"
        
        all_trains = db.query(Train).all()
        active_trains_data = [
            {"train_number": t.train_number, "train_name": t.train_name, "platform": t.platform}
            for t in all_trains
        ]

        all_platforms = db.query(Platform).all()
        platform_states_data = [
            {"platform_number": p.platform_number, "occupancy_status": p.occupancy_status}
            for p in all_platforms
        ]

        # 2. Run sequential pipeline
        delay_event = self.delay_agent.analyze_delay(train_number, delay_minutes, train_name)
        
        cascade_event = self.cascade_agent.evaluate_cascades(delay_event, active_trains_data)
        
        platform_event = self.platform_agent.optimize_platforms(delay_event, platform_states_data)
        
        crowd_event = self.crowd_agent.assess_risk(
            platform_event["recommended_action"]["old_platform"], 
            delay_event["severity"]
        )
        
        comms_event = self.comms_agent.generate_announcement(
            train_number,
            train_name,
            delay_minutes,
            platform_event["recommended_action"]["old_platform"],
            platform_event["recommended_action"]["new_platform"]
        )

        # 3. Assemble and return standard output structure
        return {
            "event_type": "delay",
            "affected_trains": cascade_event["affected_trains"],
            "recommended_action": platform_event["recommended_action"],
            "crowd_risk": crowd_event["crowd_risk"],
            "announcement": comms_event["announcement"],
            "confidence": platform_event["confidence"],
            "estimated_recovery": platform_event["estimated_recovery"]
        }

orchestrator = AgentOrchestrator()
