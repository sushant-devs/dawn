from datetime import datetime

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    token_expiry,
    token_hash,
    verify_password,
)
from app.db.session import get_db
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest, UserResponse


router = APIRouter(prefix="/auth", tags=["auth"])


def _to_object_id(value: str) -> ObjectId | None:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        return None


def _set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        domain=settings.COOKIE_DOMAIN,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        domain=settings.COOKIE_DOMAIN,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/",
    )


def _clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(key="access_token", path="/", domain=settings.COOKIE_DOMAIN)
    response.delete_cookie(key="refresh_token", path="/", domain=settings.COOKIE_DOMAIN)


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, response: Response, db: AsyncIOMotorDatabase = Depends(get_db)):
    users = db["users"]
    refresh_tokens = db["refresh_tokens"]

    existing = await users.find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user_doc = {
        "email": payload.email.lower(),
        "full_name": payload.full_name.strip(),
        "hashed_password": hash_password(payload.password),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    insert_result = await users.insert_one(user_doc)
    user_id = str(insert_result.inserted_id)

    access_token = create_access_token(subject=user_id)
    refresh_token, jti = create_refresh_token(subject=user_id)
    await refresh_tokens.insert_one(
        {
            "user_id": user_id,
            "token_jti": jti,
            "token_hash": token_hash(refresh_token),
            "expires_at": token_expiry(settings.REFRESH_TOKEN_EXPIRE_DAYS),
            "revoked": False,
            "created_at": datetime.utcnow(),
        }
    )

    _set_auth_cookies(response, access_token, refresh_token)
    return {
        "message": "Registration successful",
        "user": {"id": user_id, "email": user_doc["email"], "full_name": user_doc["full_name"]},
    }


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest, response: Response, db: AsyncIOMotorDatabase = Depends(get_db)):
    users = db["users"]
    refresh_tokens = db["refresh_tokens"]

    user = await users.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    user_id = str(user["_id"])
    access_token = create_access_token(subject=user_id)
    refresh_token, jti = create_refresh_token(subject=user_id)

    await refresh_tokens.insert_one(
        {
            "user_id": user_id,
            "token_jti": jti,
            "token_hash": token_hash(refresh_token),
            "expires_at": token_expiry(settings.REFRESH_TOKEN_EXPIRE_DAYS),
            "revoked": False,
            "created_at": datetime.utcnow(),
        }
    )

    _set_auth_cookies(response, access_token, refresh_token)
    return {
        "message": "Login successful",
        "user": {"id": user_id, "email": user["email"], "full_name": user["full_name"]},
    }


@router.post("/refresh", response_model=AuthResponse)
async def refresh_token(request: Request, response: Response, db: AsyncIOMotorDatabase = Depends(get_db)):
    users = db["users"]
    refresh_tokens = db["refresh_tokens"]

    current_refresh_token = request.cookies.get("refresh_token")
    if not current_refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token missing")

    try:
        payload = decode_token(current_refresh_token)
    except Exception as exc:
        _clear_auth_cookies(response)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc

    if payload.get("type") != "refresh":
        _clear_auth_cookies(response)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token type")

    jti = payload.get("jti")
    user_id = payload.get("sub")
    object_id = _to_object_id(user_id) if user_id else None
    token_row = await refresh_tokens.find_one({"token_jti": jti, "revoked": False})
    user = await users.find_one({"_id": object_id}) if object_id else None
    if not token_row or not user:
        _clear_auth_cookies(response)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token not recognized")

    if token_row["expires_at"] < datetime.utcnow():
        await refresh_tokens.update_one({"_id": token_row["_id"]}, {"$set": {"revoked": True}})
        _clear_auth_cookies(response)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

    if token_row["token_hash"] != token_hash(current_refresh_token):
        await refresh_tokens.update_one({"_id": token_row["_id"]}, {"$set": {"revoked": True}})
        _clear_auth_cookies(response)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token mismatch")

    await refresh_tokens.update_one({"_id": token_row["_id"]}, {"$set": {"revoked": True}})
    fresh_user_id = str(user["_id"])
    new_refresh_token, new_jti = create_refresh_token(subject=fresh_user_id)
    await refresh_tokens.insert_one(
        {
            "user_id": fresh_user_id,
            "token_jti": new_jti,
            "token_hash": token_hash(new_refresh_token),
            "expires_at": token_expiry(settings.REFRESH_TOKEN_EXPIRE_DAYS),
            "revoked": False,
            "created_at": datetime.utcnow(),
        }
    )

    access_token = create_access_token(subject=fresh_user_id)
    _set_auth_cookies(response, access_token, new_refresh_token)
    return {
        "message": "Token refreshed",
        "user": {"id": fresh_user_id, "email": user["email"], "full_name": user["full_name"]},
    }


@router.post("/logout")
async def logout(request: Request, response: Response, db: AsyncIOMotorDatabase = Depends(get_db)):
    refresh_tokens = db["refresh_tokens"]
    current_refresh_token = request.cookies.get("refresh_token")
    if current_refresh_token:
        try:
            payload = decode_token(current_refresh_token)
            token_jti = payload.get("jti")
            token_row = await refresh_tokens.find_one(
                {
                    "token_jti": token_jti,
                    "revoked": False,
                }
            )
            if token_row:
                await refresh_tokens.update_one({"_id": token_row["_id"]}, {"$set": {"revoked": True}})
        except Exception:
            pass

    _clear_auth_cookies(response)
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def me(request: Request, db: AsyncIOMotorDatabase = Depends(get_db)):
    users = db["users"]
    user_id = getattr(request.state, "user_id", None)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    object_id = _to_object_id(user_id)
    if not object_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user token")

    user = await users.find_one({"_id": object_id})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return {"id": str(user["_id"]), "email": user["email"], "full_name": user["full_name"]}
