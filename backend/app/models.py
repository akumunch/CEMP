# backend/app/models.py
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from .database import Base

class Club(Base):
    __tablename__ = "clubs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    president_name = Column(String, nullable=False)
    vp_name = Column(String, nullable=False)
    gen_sec_name = Column(String, nullable=False)
    contact_email = Column(String, nullable=False)

    # Relationships
    leads = relationship("Lead", back_populates="club", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="club", cascade="all, delete-orphan")


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    department = Column(String, nullable=False)  # e.g., "Technical", "Design", "Marketing"
    club_id = Column(Integer, ForeignKey("clubs.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    club = relationship("Club", back_populates="leads")


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    date = Column(DateTime, nullable=False)
    location = Column(String, nullable=False)
    club_id = Column(Integer, ForeignKey("clubs.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    club = relationship("Club", back_populates="events")
    registrations = relationship("Registration", back_populates="event", cascade="all, delete-orphan")


class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String, nullable=False)
    student_email = Column(String, nullable=False)
    student_reg = Column(String, nullable=False, index=True)
    
    registered_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    event = relationship("Event", back_populates="registrations")

    # Composite Unique Constraint: Stops a student from registering for the SAME event twice
    __table_args__ = (
        UniqueConstraint('student_reg', 'event_id', name='_student_event_uc'),
    )