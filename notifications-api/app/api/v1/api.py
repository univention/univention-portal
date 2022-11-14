from fastapi import APIRouter
from app.models.notification import NotificationCreate
from uuid import uuid4

router = APIRouter()


@router.get("/")
def say_hello():
    return {"message": "Hello, world!"}


@router.post("/notifications", status_code=201)
def create_notification(data: NotificationCreate):
    data.id = uuid4()
    return data
