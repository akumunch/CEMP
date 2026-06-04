from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# --- LEAD SCHEMAS ---
class LeadBase(BaseModel):
    name: str
    department: str  # Matches column name in models.py

class LeadCreate(LeadBase):
    pass

class LeadResponse(LeadBase):
    id: int
    club_id: int

    class Config:
        from_attributes = True


# --- REGISTRATION SCHEMAS ---
class RegistrationBase(BaseModel):
    student_name: str
    student_email: EmailStr
    student_reg: str  # Handles university registration tracking
    event_id: int

class RegistrationCreate(RegistrationBase):
    pass

class RegistrationResponse(RegistrationBase):
    id: int
    registered_at: datetime

    class Config:
        from_attributes = True


# --- EVENT SCHEMAS ---
class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    date: datetime
    location: str

class EventCreate(EventBase):
    club_id: int

class EventResponse(EventBase):
    id: int
    club_id: int

    class Config:
        from_attributes = True


# --- CLUB SCHEMAS ---
class ClubBase(BaseModel):
    name: str
    description: Optional[str] = None
    president_name: str
    vp_name: str
    gen_sec_name: str
    contact_email: EmailStr

class ClubCreate(ClubBase):
    leads: List[LeadCreate] = []  # Allows nested core lead objects on setup

class ClubResponse(ClubBase):
    id: int
    leads: List[LeadResponse] = []
    events: List[EventResponse] = []

    class Config:
        from_attributes = True