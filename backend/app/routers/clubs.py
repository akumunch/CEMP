#handles registering new student clubs, allocating their domain leads, and pulling 
# club profiles
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/api/clubs", tags=["Clubs"])

@router.post("/", response_model=schemas.ClubResponse, status_code=status.HTTP_201_CREATED)
def create_club(club: schemas.ClubCreate, db: Session = Depends(get_db)):
    db_club = db.query(models.Club).filter(models.Club.name == club.name).first()
    if db_club:
        raise HTTPException(status_code=400, detail="Club name already registered.")
    
    new_club = models.Club(
        name=club.name,
        description=club.description,
        president_name=club.president_name,
        vp_name=club.vp_name,
        gen_sec_name=club.gen_sec_name,
        contact_email=club.contact_email
    )
    db.add(new_club)
    db.commit()
    db.refresh(new_club)

    # Automatically map and attach domain leads if provided
    for lead_data in club.leads:
        new_lead = models.Lead(
            name=lead_data.name,
            department=lead_data.department,
            club_id=new_club.id
        )
        db.add(new_lead)
    
    db.commit()
    db.refresh(new_club)
    return new_club

@router.get("/", response_model=List[schemas.ClubResponse])
def get_all_clubs(db: Session = Depends(get_db)):
    return db.query(models.Club).all()
