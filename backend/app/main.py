from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import ASCENDING

from app.api.v1.api import api_router
from app.core.config import settings
from app.db.session import database
from app.middleware.auth_middleware import AuthTokenMiddleware
from logger import get_logger


logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    await database["users"].create_index([("email", ASCENDING)], unique=True)
    await database["refresh_tokens"].create_index([("token_jti", ASCENDING)], unique=True)
    await database["refresh_tokens"].create_index([("user_id", ASCENDING)])
    logger.info("MongoDB indexes initialized and app started")
    yield


app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(AuthTokenMiddleware)


@app.get("/")
def root():
    return {"message": "DAWN API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(api_router, prefix=settings.API_PREFIX)
