from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app import models
from app.routers import clubs, events, registrations

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Club Chef API",
    description="Backend services for the Club Event Management Platform",
    version="1.0.0"
)

# configuring CORS (cross origin resouce-sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Next.js local development port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(clubs.router)
app.include_router(events.router)
app.include_router(registrations.router)

@app.get("/", tags=["Health"]) #tags is for grouping the end points together in Swagger ui
async def health_check():
    return {
        "status": "healthy",
        "message": "Welcome to the Club Chef API Platform"
    }