# backend/app/routers/registrations.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/registrations", tags=["Registrations"])

@router.post("/", response_model=schemas.RegistrationResponse, status_code=status.HTTP_201_CREATED)
def register_for_event(registration: schemas.RegistrationCreate, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == registration.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Target event not found.")
    
    # Enforce unique registration per event
    duplicate = db.query(models.Registration).filter(
        models.Registration.student_reg == registration.student_reg,
        models.Registration.event_id == registration.event_id
    ).first()
    
    if duplicate:
        raise HTTPException(
            status_code=400, 
            detail=f"Registration {registration.student_reg} is already signed up for this event."
        )

    new_reg = models.Registration(
        student_name=registration.student_name,
        student_email=registration.student_email,
        student_reg=registration.student_reg,
        event_id=registration.event_id
    )
    db.add(new_reg)
    db.commit()
    db.refresh(new_reg)
    return new_reg
