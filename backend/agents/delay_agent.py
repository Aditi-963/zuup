class DelayDetectionAgent:
    def __init__(self):
        pass

    def analyze_delay(self, train_number: str, delay_minutes: int, train_name: str) -> dict:
        severity = "LOW"
        if delay_minutes > 30:
            severity = "HIGH"
        elif delay_minutes > 15:
            severity = "MEDIUM"

        return {
            "agent_name": "Delay Detection Agent",
            "status": "triggered",
            "train_number": train_number,
            "train_name": train_name,
            "delay_minutes": delay_minutes,
            "severity": severity,
            "timestamp": "2026-06-15 02:18:00"
        }
