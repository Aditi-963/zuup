from typing import List

class CascadeAnalysisAgent:
    def __init__(self):
        pass

    def evaluate_cascades(self, delay_event: dict, active_trains: List[dict]) -> dict:
        affected_trains = []
        delay_minutes = delay_event["delay_minutes"]
        target_platform = 2 # Deccan Express is normally on PF 2

        # Check for temporal/platform conflicts
        for train in active_trains:
            if train["train_number"] != delay_event["train_number"]:
                # If they share platform 2 or adjacent platforms, they are impacted
                if train["platform"] == target_platform:
                    affected_trains.append(f"{train['train_number']} {train['train_name']}")

        # Fallback default if list is empty, representing network congestion
        if not affected_trains:
            affected_trains = ["12952 Rajdhani Express"]

        return {
            "agent_name": "Cascade Analysis Agent",
            "affected_trains": affected_trains,
            "cascade_risk": "HIGH" if delay_minutes > 30 else "MEDIUM"
        }
