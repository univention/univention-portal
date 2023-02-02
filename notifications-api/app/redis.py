import logging
# TODO: Should probably take advantage of the asyncio client
# import redis.asyncio as redis
import redis
import redis.asyncio

from app.core.config import settings


log = logging.getLogger(__name__)

_redis = None
_async_redis = None


def get_redis():
    if not _redis:
        _connect_redis()
    return _redis

def _connect_redis():
    global _redis

    log.info("Connecting to redis server")
    _redis = redis.Redis.from_url(settings.redis_url)

def get_async_redis():
    if not _async_redis:
        _connect_async_redis()
    return _async_redis

def _connect_async_redis():
    global _async_redis

    log.info("Connecting to redis server async")
    _async_redis = redis.asyncio.Redis.from_url(settings.redis_url)
