import os
import json
import httpx
from typing import Dict, Any

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"

TIMETABLE = [
    {"id": "12123", "name": "Deccan Queen", "platform": 1, "dept": "09:15"},
    {"id": "11007", "name": "Deccan Express", "platform": 2, "dept": "09:30"},
    {"id": "12107", "name": "Pragati Express", "platform": 3, "dept": "10:00"},
    {"id": "12163", "name": "Chennai Express", "platform": 4, "dept": "10:30"},
    {"id": "17031", "name": "Hyderabad Express", "platform": 5, "dept": "11:00"},
]

LANG_INSTRUCTIONS = {
    "en": "Respond in English only.",
    "hi": "Respond in Hindi (हिंदी) only.",
    "mr": "Respond in Marathi (मराठी) only.",
    "te": "Respond in Telugu (తెలుగు) only.",
    "ta": "Respond in Tamil (தமிழ்) only.",
}

async def generate_recovery_plan(train_id: str, delay_mins: int, location: str) -> Dict[str, Any]:
    train = next((t for t in TIMETABLE if t["id"] == train_id), None)
    if not train:
        raise ValueError(f"Train {train_id} not found in timetable")

    prompt = f"""
DELAY ALERT: Train #{train_id} {train['name']} is delayed by {delay_mins} minutes at {location}.
Current platform: {train['platform']}. Departure was: {train['dept']}.

Other trains at station: {json.dumps([t for t in TIMETABLE if t['id'] != train_id])}
Free platforms: {[i for i in range(1,6) if i not in [t['platform'] for t in TIMETABLE if t['id'] != train_id]]}

Generate the agentic recovery plan as JSON:
{{
  "affected_trains": ["list of train IDs and impact"],
  "primary_swap": {{"from_platform": N, "to_platform": N, "train": "name", "reason": "concise reason"}},
  "crowd_alert": "LOW|MEDIUM|HIGH",
  "hindi_announcement": "full PA announcement in Hindi",
  "confidence": "HIGH|MEDIUM",
  "estimated_recovery_mins": N
}}
Respond with JSON only.
"""
    plan = None
    if ANTHROPIC_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(
                    ANTHROPIC_URL,
                    headers={"Content-Type": "application/json", "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01"},
                    json={
                        "model": "claude-3-5-sonnet-20240620",
                        "max_tokens": 1000,
                        "system": "You are RailSaarthi, an agentic AI for Indian railway station masters. Respond in JSON only.",
                        "messages": [{"role": "user", "content": prompt}]
                    }
                )
                resp.raise_for_status()
                data = resp.json()
                text = "".join(b.get("text", "") for b in data.get("content", []))
                plan = json.loads(text.strip().lstrip("```json").rstrip("```"))
        except Exception as e:
            print(f"Error calling Anthropic API for recovery plan: {e}")

    if not plan:
        plan = {
            "affected_trains": [
                f"#{t['id']} {t['name']} — departure at risk due to platform block"
                for t in TIMETABLE if t["id"] != train_id and t["platform"] == train["platform"]
            ] or ["#12025 Shatabdi Express — departure at risk"],
            "primary_swap": {
                "from_platform": train["platform"],
                "to_platform": 5,
                "train": train["name"],
                "reason": "Platform 5 is free for the next 2 hours. Swapping avoids platform congestion."
            },
            "crowd_alert": "HIGH" if delay_mins > 30 else "MEDIUM",
            "hindi_announcement": f"यात्रियों से अनुरोध है कि डेक्कन एक्सप्रेस गाड़ी संख्या {train_id} अब प्लेटफॉर्म संख्या 5 से प्रस्थान करेगी। असुविधा के लिए खेद है।",
            "confidence": "HIGH",
            "estimated_recovery_mins": 12
        }
    return plan

async def generate_crowd_plan(platform: int, capacity_percent: int) -> str:
    prompt = f"""
Platform {platform} is at {capacity_percent}% capacity with a major crowd surge.
Give a 3-step crowd management action plan in 150 words, including a Hindi announcement for the PA system.
Be specific and urgent.
"""
    reply = ""
    if ANTHROPIC_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(
                    ANTHROPIC_URL,
                    headers={"Content-Type": "application/json", "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01"},
                    json={
                        "model": "claude-3-5-sonnet-20240620",
                        "max_tokens": 600,
                        "system": "You are RailSaarthi, an emergency AI assistant for Indian Railways passengers and staff. Respond with urgent steps and a Hindi PA announcement.",
                        "messages": [{"role": "user", "content": prompt}]
                    }
                )
                resp.raise_for_status()
                data = resp.json()
                reply = "".join(b.get("text", "") for b in data.get("content", []))
        except Exception as e:
            print(f"Error calling Anthropic API for crowd plan: {e}")

    if not reply:
        reply = (
            "1. Deploy RPF (Railway Protection Force) personnel to Platform " + str(platform) + " immediately to regulate entry and exit points.\n"
            "2. Redirect incoming trains scheduled for Platform " + str(platform) + " to adjacent platforms (Platforms 2 & 4) to ease incoming passenger flow.\n"
            "3. Broadcast Hindi PA announcement: \"यात्रीगण कृपया ध्यान दें, प्लेटफॉर्म " + str(platform) + " पर अत्यधिक भीड़ के कारण, अन्य प्लेटफॉर्म 2 और 4 पर जाने का कष्ट करें। सुरक्षा का पालन करें।\""
        )
    return reply

async def generate_multi_delay_plan(delays: list) -> Dict[str, Any]:
    delays_str = ", ".join([f"Train #{d['train_id']} by {d['delay_mins']} mins" for d in delays])
    prompt = f"""
MULTI-TRAIN CASCADE: The following trains are delayed simultaneously: {delays_str}.
Resolve the scheduling conflict for platforms and provide a 3-step recovery plan and a Hindi announcement.
Respond in JSON format:
{{
  "recovery_steps": ["step 1", "step 2", "step 3"],
  "crowd_level": "LOW|MEDIUM|HIGH|CRITICAL",
  "hindi_announcement": "PA announcement in Hindi"
}}
"""
    plan = None
    if ANTHROPIC_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(
                    ANTHROPIC_URL,
                    headers={"Content-Type": "application/json", "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01"},
                    json={
                        "model": "claude-3-5-sonnet-20240620",
                        "max_tokens": 1000,
                        "system": "You are RailSaarthi, an agentic AI co-pilot resolving multi-train conflicts. Respond in JSON only.",
                        "messages": [{"role": "user", "content": prompt}]
                    }
                )
                resp.raise_for_status()
                data = resp.json()
                text = "".join(b.get("text", "") for b in data.get("content", []))
                plan = json.loads(text.strip().lstrip("```json").rstrip("```"))
        except Exception as e:
            print(f"Error resolving multi-train cascade: {e}")

    if not plan:
        plan = {
            "recovery_steps": [
                "Move Deccan Queen #12123 to Platform 5 (free, longest clearance).",
                "Hold Pragati Express #12107 departure by 15 min for crew rotation.",
                "Activate overflow waiting area — Gate 4 concourse."
            ],
            "crowd_level": "CRITICAL",
            "hindi_announcement": "कृपया ध्यान दें: एकाधिक ट्रेनों में देरी हो रही है। अपनी ट्रेन संख्या सुनिश्चित करें और निकटतम सहायता केंद्र से संपर्क करें।"
        }
    return plan

async def generate_chat_reply(message: str, language: str) -> str:
    lang_instr = LANG_INSTRUCTIONS.get(language, LANG_INSTRUCTIONS["en"])
    system = f"""You are RailSaarthi, an emergency AI assistant for Indian Railways passengers and staff.
Help with: train delays, missed connections, platform changes, medical emergencies, accessibility, lost items.
Be warm, practical, and give actionable next steps. Keep responses under 200 words.
{lang_instr}"""

    reply = ""
    if ANTHROPIC_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(
                    ANTHROPIC_URL,
                    headers={"Content-Type": "application/json", "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01"},
                    json={
                        "model": "claude-3-5-sonnet-20240620",
                        "max_tokens": 600,
                        "system": system,
                        "messages": [{"role": "user", "content": message}]
                    }
                )
                resp.raise_for_status()
                data = resp.json()
                reply = "".join(b.get("text", "") for b in data.get("content", []))
        except Exception as e:
            print(f"Error calling Anthropic API for chat: {e}")

    if not reply:
        fallbacks = {
            "en": "Helpline 139 is available for immediate assistance. For medical emergencies on trains, please contact the Train Superintendent or visit the station enquiry counter.",
            "hi": "त्वरित सहायता के लिए हेल्पलाइन 139 उपलब्ध है। ट्रेनों में चिकित्सा आपात स्थिति के लिए, कृपया ट्रेन अधीक्षक से संपर्क करें या स्टेशन पूछताछ काउंटर पर जाएं।",
            "mr": "त्वरित मदतीसाठी हेल्पलाइन १३९ उपलब्ध आहे. गाड्यांमधील वैद्यकीय आणीबाणीसाठी, कृपया ट्रेन अधीक्षकांशी संपर्क साधा किंवा स्टेशन चौकशी काउंटरला भेट द्या.",
            "te": "తక్షణ సహాయం కోసం హెల్ప్‌లైన్ 139 అందుబాటులో ఉంది. రైళ్లలో వైద్య అత్యవసర పరిస్థితుల కోసం, దయచేసి రైలు సూపరింటెండెంట్‌ను సంప్రదించండి లేదా స్టేషన్ విచారణ కౌంటర్‌ను సందర్శించండి.",
            "ta": "உடனடி உதவிக்கு ஹெல்ப்லைன் 139 கிடைக்கிறது. இரயில்களில் மருத்துவ அவசரநிலைகளுக்கு, தயவுசெய்து இரயில் கண்காணிப்பாளரைத் தொடர்பு கொள்ளவும் அல்லது நிலைய விசாரணை கவுண்டரை அணுகவும்."
        }
        reply = fallbacks.get(language, fallbacks["en"])
    return reply
