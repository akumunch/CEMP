# backend/app/database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# Uses local PostgreSQL defaults unless an overriding environment variable is active
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@localhost:5432/club_chef_db"
)

# Instantiating the database communications engine
engine = create_engine(DATABASE_URL)

# Thread-isolated transactional session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base class for structural tracking
Base = declarative_base()

# Request lifecycle dependency injection container
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()