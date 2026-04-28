from datetime import datetime, timedelta
from hashlib import sha256
from uuid import uuid4

import bcrypt
from jose import JWTError, jwt

from app.core.config import settings


def _bcrypt_ready_bytes(password: str) -> bytes:
    raw = password.encode("utf-8")
    # Bcrypt accepts only first 72 bytes; pre-hash long input to avoid truncation/ValueError.
    if len(raw) > 72:
        raw = sha256(raw).hexdigest().encode("utf-8")
    return raw


def hash_password(password: str) -> str:
    return bcrypt.hashpw(_bcrypt_ready_bytes(password), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(_bcrypt_ready_bytes(plain_password), hashed_password.encode("utf-8"))
    except ValueError:
        return False


def _create_token(subject: str, token_type: str, expires_delta: timedelta, jti: str | None = None) -> str:
    expire = datetime.utcnow() + expires_delta
    payload = {
        "sub": subject,
        "type": token_type,
        "exp": expire,
        "iat": datetime.utcnow(),
    }
    if jti:
        payload["jti"] = jti
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_access_token(subject: str) -> str:
    return _create_token(subject, "access", timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))


def create_refresh_token(subject: str) -> tuple[str, str]:
    jti = uuid4().hex
    token = _create_token(subject, "refresh", timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS), jti=jti)
    return token, jti


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])


def token_hash(token: str) -> str:
    return sha256(token.encode("utf-8")).hexdigest()


def token_expiry(days: int) -> datetime:
    return datetime.utcnow() + timedelta(days=days)


def parse_token(token: str) -> dict | None:
    try:
        return decode_token(token)
    except JWTError:
        return None
