class CommunicationAgent:
    def __init__(self):
        pass

    def generate_announcement(self, train_number: str, train_name: str, delay_minutes: int, old_platform: int, new_platform: int) -> dict:
        script = f"May I have your attention please. Train {train_number}, {train_name}, scheduled to arrive on Platform {old_platform}, is running delayed by {delay_minutes} minutes. It will now arrive on Platform {new_platform} instead of Platform {old_platform}. The inconvenience caused is deeply regretted."
        return {
            "agent_name": "Communication Agent",
            "announcement": script
        }
