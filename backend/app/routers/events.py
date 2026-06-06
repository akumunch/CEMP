from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas

router = APIRouter(prefix="/api/events", tags=["Events"])

@router.post("/", response_model=schemas.EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    club = db.query(models.Club).filter(models.Club.id == event.club_id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Hosting club not found.")
    
    new_event = models.Event(
        title=event.title,
        description=event.description,
        date=event.date,
        location=event.location,
        club_id=event.club_id
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

@router.get("/", response_model=List[schemas.EventResponse])
def get_all_events(db: Session = Depends(get_db)):
    return db.query(models.Event).all()