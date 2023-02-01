import logging
import redis.asyncio as redis

from app.core.config import settings


log = logging.getLogger(__name__)

_redis = None

def get_redis():
    if not _redis:
        _connect_redis()
    return _redis

def _connect_redis():
    global _redis

    log.info("Connecting to redis server")
    _redis = redis.Redis.from_url(settings.redis_url)
