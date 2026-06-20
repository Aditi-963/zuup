#  _RAILSAARTHI_
### Autonomous AI Co-Pilot for Railway Operations Intelligence

> Built for **FAR AWAY 2026** — India's Biggest International Hackathon
> Themes: **Railways · Agentic & Autonomous Systems**

---

##  What is RailSaarthi?

RailSaarthi is an autonomous AI-powered operational intelligence system for modern railway infrastructure. It acts as a real-time co-pilot for station masters and operational control rooms — enabling faster, safer, and smarter decisions during disruptions like train delays, platform conflicts, crowd congestion, and emergencies.

Unlike your traditional railway software that simply displays information, RailSaarthi **actively detects disruptions, predicts cascading failures, recommends recovery strategies, generates multilingual announcements, and coordinates staff responses — all within 90 seconds.**

> **RailSaarthi is not a passenger app.**
> It is infrastructure intelligence software for one of the world's largest transportation systems.

---

##  The Problem

Indian Railways handles **23+ million passengers daily** across **8,700+ stations**. When operational disruptions occur, the current workflow is almost entirely manual:

```
Train delayed
→ Station master manually checks schedule dependencies
→ Operator identifies affected trains
→ Platform conflicts assessed manually
→ Crowd risk increases while decisions are delayed
→ Announcements coordinated by hand
→ Staff across departments communicate manually
→ Recovery takes 18–30 minutes
```

This manual process leads to:

- **Cascading failures** — one delayed train disrupts several downstream trains
- **Platform congestion** — dangerous crowd buildup from unexpected delays
- **Human error** — manual decisions made under time pressure
- **Delayed communication** — passengers receive announcements too late
- **Multilingual gaps** — critical information not reaching passengers in their regional language

Existing software (ticket booking, train tracking, scheduling dashboards) answers *"Where is my train?"* — not *"Which trains are affected downstream, what do I reassign, and what do I announce right now?"*

**That operational gap is what RailSaarthi fills.**

---

##  Our Solution

When a disruption is detected, RailSaarthi automatically:

1. **Detects** the disruption in real time
2. **Identifies** all downstream trains affected via dependency graph analysis
3. **Predicts** platform conflicts and congestion risks
4. **Recommends** optimal platform reallocation strategies
5. **Generates** multilingual passenger announcements and staff alerts
6. **Logs** every AI decision for audit and accountability
7. **Requests human approval** before executing — operators remain in control at all times

All within approximately **90 seconds**, down from the current 18–30 minute manual process.

---

##  Why This Is Truly Agentic

Most AI projects built at hackathons are reactive — a user asks a question, the AI responds. RailSaarthi is fundamentally different:

| Reactive AI | RailSaarthi |
|---|---|
| Waits for user input | Detects events autonomously |
| Responds to questions | Predicts downstream consequences |
| Generates output | Recommends and executes recovery plans |
| Single model call | Multi-agent orchestration pipeline |
| Answers "what happened?" | Answers "what should we do next?" |

The system acts **proactively before the operator asks**. This is genuine agentic behavior, and it directly aligns with the *Agentic & Autonomous Systems* hackathon theme.

---

##  Multi-Agent Architecture

RailSaarthi is built around five specialized autonomous agents, each owning a distinct part of the operational recovery pipeline:

| Agent | Purpose | Output |
|---|---|---|
| **Delay Detection Agent** | Detects disruptions in real time from train ETA data | Delay severity classification |
| **Cascade Analysis Agent** | Maps downstream train dependencies via graph analysis | List of affected trains |
| **Platform Optimization Agent** | Recommends optimal platform reassignment | Platform swap recommendations |
| **Crowd Risk Agent** | Estimates passenger congestion from delay + occupancy data | Risk classification |
| **Communication Agent** | Generates announcements and staff alerts in 6 languages | Multilingual operational comms |

### Autonomous Pipeline

```
Disruption detected
    ↓
Delay Detection Agent activates
    ↓
Cascade Analysis Agent identifies affected trains
    ↓
Platform Optimization Agent calculates recovery strategy
    ↓
Crowd Risk Agent predicts congestion impact
    ↓
Communication Agent generates multilingual announcements
    ↓
Station Master reviews → approves or overrides
    ↓
Decision logged in audit system
```

---

##  Key Features

- **Real-Time Operations Dashboard** — Monitor active trains, live delays, platform status, and station alerts
- **Delay Cascade Detector** — Automatically surfaces all trains affected by a single disruption
- **Platform Optimization Engine** — AI-recommended reallocation to minimize delay propagation and passenger impact
- **Multilingual Announcement Generator** — Passenger announcements in English, Hindi, Marathi, Tamil, Gujarati, and Telugu
- **Emergency AI Assistant** — Coordinated response handling for medical emergencies, crowd surge, smoke detection, and track incidents
- **Disruption Simulation Engine** — Interactive sandbox to simulate and stress-test operational scenarios
- **Audit Log** — Immutable decision history for post-incident review and regulatory accountability
- **Human Override System** — Every AI recommendation requires operator approval; humans stay in final control

---

##  Tech Stack

### Frontend
- Next.js 15, React 19, TypeScript
- Tailwind CSS, shadcn/ui, Framer Motion
- Zustand (state management), Recharts (data visualization)

### Backend
- Python, FastAPI, Pydantic
- SQLAlchemy, SQLite (dev) / PostgreSQL (production-ready)

### AI Layer
- **Claude (Anthropic)** — Powers multi-agent reasoning, cascade analysis, optimization logic, and multilingual communication generation
- Multi-agent orchestration pipeline with specialized, isolated agent roles
- Structured output parsing for deterministic operational recommendations

### Infrastructure
- REST APIs, Docker, modular service architecture, environment-based configuration

---

##  Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Docker (optional)

### 1. Clone the repository
```bash
git clone https://github.com/<your-org>/railsaarthi.git
cd railsaarthi
```

### 2. Configure environment variables
```bash
cp .env.example .env
```

Fill in `.env`:
```env
ANTHROPIC_API_KEY=your_key_here
DATABASE_URL=sqlite:///./railsaarthi.db   # or your PostgreSQL URL
```

### 3. Start the backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 4. Start the frontend
```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`.

---

##  Project Structure

```
railsaarthi/
├── frontend/                   # Next.js 15 application
│   ├── app/                    # App router pages
│   ├── components/             # Reusable UI components (shadcn/ui)
│   └── store/                  # Zustand state management
├── backend/                    # FastAPI application
│   ├── agents/                 # Autonomous AI agents
│   │   ├── delay_detection.py
│   │   ├── cascade_analysis.py
│   │   ├── platform_optimization.py
│   │   ├── crowd_risk.py
│   │   └── communication.py
│   ├── models/                 # SQLAlchemy database models
│   ├── api/                    # REST API route handlers
│   └── main.py
├── docker-compose.yml
├── .env.example
└── README.md
```

---

##  Impact at Scale

| Metric | Current State | With RailSaarthi |
|---|---|---|
| Disruption recovery time | 18–30 minutes | ~90 seconds |
| Announcement languages | Varies by station | 6 Indian languages |
| Decision audit trail | Manual / incomplete | Fully automated |
| Deployment potential | — | 8,700+ stations |
| Passengers impacted daily | 23M+ | 23M+ |

---

##  Future Scope

- **IoT Platform Sensors** — Real-time crowd density detection via hardware nodes
- **Edge Devices** — ESP32-based station hardware for offline operational resilience
- **Smart PA Integration** — AI-triggered autonomous physical announcement systems
- **National Pilot** — Deployment across major junction stations
- **Broader Sectors** — Metro systems (Delhi, Mumbai, Bengaluru), airports, large-scale logistics hubs

The architecture is not railway-specific — it is a generalized operational intelligence framework that can be adapted for any large-scale transportation or logistics system.

---

##  Team Elaris

Built by five engineering students from **Parul University, Vadodara**, who approached this hackathon as a product engineering team rather than as a student submission — with clear domain ownership, parallel workstreams, and production-level thinking throughout.

| Name | Role | Focus |
|---|---|---|
| **Aditi Rajput** | Product Lead · AI Systems Architect | Problem framing, multi-agent architecture design, product strategy, technical documentation |
| **Pranjal Gupta** | AI Engineering Lead | Simulation engine, delay detection logic, cascade analysis, decision pipeline |
| **Vaidehi Wate** | Frontend Engineering Lead · UI/UX | Next.js application, dashboard design, component system, Framer Motion animations |
| **Hiranya Raut** | Backend Systems Engineer | FastAPI architecture, REST APIs, database schema, JWT authentication |
| **Katyayni Sharma** | Research Engineer · Documentation Lead | Railway domain research, competitor analysis, IoT roadmap, hardware architecture planning |

---

##  Vision

Most railway technology today informs operators. RailSaarthi thinks alongside them.

We deliberately chose not to build another ticket booking app, another chatbot wrapper, or another passenger-facing product. We chose one of the hardest engineering problems available within these hackathon themes: bringing genuine autonomous decision intelligence into the operational layer of one of the world's largest transportation networks.

RailSaarthi is designed to be deployable — not just demonstrable. The architecture is modular, the backend is scalable, and the human-in-the-loop approval system ensures safety at every step.

> *We are not building software for passengers. We are building the operational brain for future railway systems.*

---

##  A Note on Current Data

The railway data used in this build — train numbers, platform assignments, delay timings, passenger counts — is **simulated for demonstration purposes**. We're actively working on integrating real operational data sources and will be updating this soon. The architecture is designed to plug real data right in with minimal changes.

---

##  Where We're Headed

Right now we're submitting from Vadodara, running on way too much chai and a shared conviction that we built something genuinely different here.

**Next stop: Delhi 🇮🇳** — We're looking forward to presenting RailSaarthi in person at the next round and showing what this system can really do when it's live in front of an audience.

**And then, fingers crossed — Japan 🇯🇵** — Because bringing an Indian Railways intelligence system to the country that invented the Shinkansen would honestly be the most full-circle moment we could ask for. We're not taking it for granted, but we're absolutely building toward it.

One round at a time. Let's go. 🚀

---

*Team Elaris · FAR AWAY 2026 · Parul University, Vadodara*
