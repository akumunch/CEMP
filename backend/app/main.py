from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from . import models

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

@app.get("/", tags=["Health"]) #tags is for grouping the end points together in Swagger ui
async def health_check():
    return {
        "status": "healthy",
        "message": "Welcome to the Club Chef API Platform"
    }