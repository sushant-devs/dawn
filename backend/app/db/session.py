from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings


mongo_client = AsyncIOMotorClient(settings.MONGODB_URI)
database = mongo_client[settings.MONGODB_DB_NAME]


def get_db() -> AsyncIOMotorDatabase:
    return database
