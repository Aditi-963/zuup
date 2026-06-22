from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database.connection import get_db
from ..models.models import Platform
from ..schemas.schemas import PlatformBase

router = APIRouter(prefix="/platforms", tags=["Platforms"])

@router.get("", response_model=List[PlatformBase])
def get_platforms(db: Session = Depends(get_db)):
    return db.query(Platform).all()
