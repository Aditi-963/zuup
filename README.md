# 🚂 RailSaarthi — Agentic Co-Pilot for Indian Railways

> **FAR AWAY Hackathon 2026** · Themes: Railways + Agentic AI Systems

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20App-orange?style=for-the-badge)](./index.html)
[![Theme](https://img.shields.io/badge/Theme-Railways%20%2B%20Agentic%20AI-blue?style=for-the-badge)]()
[![Language](https://img.shields.io/badge/Languages-11%20Indian%20Languages-green?style=for-the-badge)]()

---

## 🎯 The Problem

Indian Railways moves **23 million passengers daily** across **8,702 stations**. When one train is delayed, station masters must manually:
- Calculate which other trains are affected
- Decide platform reallocations (currently done by intuition)
- Generate multilingual announcements
- Coordinate staff across departments

**This takes 18–30 minutes. A single wrong decision ripples across 10 trains.**

No existing technology solves this. Google Maps, IRCTC, and railway apps handle information retrieval — none handle autonomous decision-making during disruptions.

---

## 🤖 The Solution: RailSaarthi

An **agentic AI co-pilot** that detects delay cascades, plans platform reallocations, and sends multilingual staff alerts — all within 90 seconds of detection, without waiting to be asked.

### Three Core Capabilities

| Capability | What it does | Tech |
|---|---|---|
| 🔍 **Cascade Detector** | Automatically identifies all downstream trains affected by a delay | Claude API + Timetable data |
| 🏛️ **Platform Reallocator** | Generates optimal swap plans with ranked reasoning | Constraint solving + LLM reasoning |
| 📢 **Multilingual Alerts** | PA announcements in Hindi, Marathi, Telugu + 8 more languages | Google Translate + Twilio |

### Why This Is Genuinely Agentic

The system **does not wait to be asked**. When a delay is detected:
1. Agent fires automatically
2. Calculates cascade impact
3. Proposes a recovery plan
4. Generates Hindi/regional announcements
5. Logs decision to audit trail

The station master sees a plan and accepts or overrides it. **That's autonomy.**

---

## 🎬 Demo Scenarios

### Demo 1: Single Train Delay
Click "Fire Delay: Deccan Express +47 min" → Watch the AI agent detect the cascade, propose a platform swap (Platform 2 → 5), generate a Hindi announcement, and log the decision.

### Demo 2: Crowd Emergency
Click "Crowd Alert: Platform 3" → Agent generates a crowd management plan with RPF deployment instructions and PA broadcast text.

### Demo 3: Multi-Train Cascade
Click "Multi-Train Cascade" → Agent handles 2 simultaneous delays and generates a prioritized multi-platform recovery plan.

### Demo 4: Emergency Chat
Go to Emergency AI → Type any emergency in any language → Get AI-powered, context-aware railway assistance.

---

## 🛠️ Tech Stack

```
Frontend:    HTML5 + Vanilla JS (zero dependencies — runs anywhere)
AI Engine:   Claude claude-sonnet-4-6 (Anthropic API)
Languages:   Hindi, Marathi, Telugu, Tamil, Bengali, Gujarati + 5 more
Backend:     FastAPI (Python) — see /backend
Database:    SQLite (audit log)
Alerts:      Twilio WhatsApp API (production)
Data:        IRCTC API mock (production: live IRCTC integration)
```

### The Core AI Prompt

```python
SYSTEM_PROMPT = """
You are RailSaarthi, an agentic AI assistant for Indian railway station masters.
You receive live train delay data and must:
1. Identify all downstream trains affected by the delay cascade
2. Suggest optimal platform reallocations with specific reasoning
3. Estimate crowd flow impact
4. Generate a staff alert in Hindi

Respond only in JSON format:
{
  "affected_trains": [...],
  "suggested_swaps": [{"train": "", "from_platform": N, "to_platform": N, "reason": ""}],
  "crowd_alert_level": "LOW|MEDIUM|HIGH",
  "hindi_announcement": "...",
  "confidence": "HIGH|MEDIUM",
  "estimated_recovery_mins": N
}
"""
```

---

## 🚀 Running Locally

### Option A: Just open index.html
The frontend is a single HTML file with no dependencies. Open `index.html` in any browser. The AI features require the Anthropic API key (automatically handled in the deployed version).

### Option B: Full Backend
```bash
# Install dependencies
pip install fastapi uvicorn httpx

# Set API key
export ANTHROPIC_API_KEY=your_key_here

# Run backend
cd backend
python main.py

# Open frontend
open index.html
```

---

## 📊 Impact Numbers

- **90 seconds** — delay detection to recovery plan (vs 18–30 min manual)
- **₹18,000 Crore** — annual railway delay cost addressable
- **23 million** — daily passengers impacted by delays
- **11 languages** — regional language support
- **8,702 stations** — potential deployment scale

---

## 🗺️ Roadmap

| Phase | Timeline | Milestone |
|---|---|---|
| **MVP** | Hackathon | Simulated data, AI cascade detection, Hindi alerts |
| **Pilot** | 3 months | Live IRCTC API, WhatsApp alerts, 5 pilot stations |
| **National** | 12 months | 100 major junctions, Ministry partnership |
| **BRICS** | 2 years | China, Russia, Brazil rail networks |

---

## 👥 Team

Built for FAR AWAY — India's Biggest International Hackathon 2026.

**Themes covered:** Railways · Agentic & Autonomous Systems

---

## 📄 License

MIT License — free to use, fork, and deploy.
