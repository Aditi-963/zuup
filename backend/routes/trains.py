from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database.connection import get_db
from ..models.models import Train
from ..schemas.schemas import TrainBase

router = APIRouter(prefix="/trains", tags=["Trains"])

@router.get("", response_model=List[TrainBase])
def get_trains(db: Session = Depends(get_db)):
    return db.query(Train).all()
