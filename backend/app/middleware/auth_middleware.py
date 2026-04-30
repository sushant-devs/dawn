from fastapi import Request, status
from fastapi.responses import JSONResponse
from jose import ExpiredSignatureError, JWTError
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.security import decode_token


class AuthTokenMiddleware(BaseHTTPMiddleware):
    protected_paths = {
        "/api/v1/auth/me",
        "/api/v1/workspaces/",
        "/api/v1/workspaces",
    }
    
    def _is_protected_path(self, path: str) -> bool:
        # Check exact matches
        if path in self.protected_paths:
            return True
        # Check if path starts with protected workspace paths
        if path.startswith("/api/v1/workspaces/") or path.startswith("/api/v1/workspaces"):
            return True
        return False

    async def dispatch(self, request: Request, call_next):
        # Skip authentication for OPTIONS requests (CORS preflight)
        if request.method == "OPTIONS":
            return await call_next(request)
            
        if self._is_protected_path(request.url.path):
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
