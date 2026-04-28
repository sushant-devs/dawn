from fastapi import Request, status
from fastapi.responses import JSONResponse
from jose import ExpiredSignatureError, JWTError
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.security import decode_token


class AuthTokenMiddleware(BaseHTTPMiddleware):
    protected_paths = {"/api/v1/auth/me"}

    async def dispatch(self, request: Request, call_next):
        if request.url.path in self.protected_paths:
            token = request.cookies.get("access_token")
            if not token:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Access token missing"},
                )

            try:
                payload = decode_token(token)
                if payload.get("type") != "access":
                    return JSONResponse(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        content={"detail": "Invalid access token type"},
                    )
                request.state.user_id = payload.get("sub")
            except ExpiredSignatureError:
                response = JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Access token expired"},
                )
                response.delete_cookie("access_token", path="/")
                return response
            except JWTError:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Invalid access token"},
                )

        return await call_next(request)
