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

@router.get("/{club_id}", response_model=schemas.ClubResponse)
def get_club(club_id: int, db: Session = Depends(get_db)):
    club = db.query(models.Club).filter(models.Club.id == club_id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found.")
    return club

@router.put("/{club_id}", response_model=schemas.ClubResponse)
def update_club(club_id: int, club: schemas.ClubCreate, db: Session = Depends(get_db)):
    db_club = db.query(models.Club).filter(models.Club.id == club_id).first()
    if not db_club:
        raise HTTPException(status_code=404, detail="Club not found.")
    for key, value in club.model_dump(exclude={"leads"}).items():
        setattr(db_club, key, value)
    db.commit()
    db.refresh(db_club)
    return db_club

@router.delete("/{club_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_club(club_id: int, db: Session = Depends(get_db)):
    db_club = db.query(models.Club).filter(models.Club.id == club_id).first()
    if not db_club:
        raise HTTPException(status_code=404, detail="Club not found.")
    db.delete(db_club)
    db.commit()