from fastapi import APIRouter
from app.models.notification import NotificationCreate

router = APIRouter()


@router.get("/")
def say_hello():
    return {"message": "Hello, world!"}


@router.post("/notifications")
def create_notification(data: NotificationCreate):
    return data
