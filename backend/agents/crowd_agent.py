class CrowdRiskAgent:
    def __init__(self):
        pass

    def assess_risk(self, platform_number: int, severity: str) -> dict:
        # Higher delay severity leads to higher crowd risk
        risk = "MEDIUM"
        if severity == "HIGH":
            risk = "HIGH"
        elif severity == "LOW":
            risk = "LOW"

        return {
            "agent_name": "Crowd Risk Agent",
            "crowd_risk": risk
        }
