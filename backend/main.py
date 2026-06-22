from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import trains, platforms, logs, simulations, intelligence, auth

app = FastAPI(
    title="RailSaarthi Operations Intelligence System API",
    description="Autonomous AI operations co-pilot for Indian Railways. Built for FAR AWAY 2026.",
    version="1.0.0"
)

# Configure CORS for Next.js frontend local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(trains.router)
app.include_router(platforms.router)
app.include_router(logs.router)
app.include_router(simulations.router)
app.include_router(intelligence.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "RailSaarthi Autonomous Operations Intelligence",
        "hackathon": "FAR AWAY 2026"
    }
