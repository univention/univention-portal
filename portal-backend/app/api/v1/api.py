from fastapi import APIRouter

from .portal import router as portal_router

router = APIRouter()
router.include_router(portal_router, prefix="/portal")
