from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class WorkspaceCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=500)


class WorkspaceUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=500)


class WorkspaceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: Optional[str] = None
    user_id: str
    created_at: datetime
    updated_at: datetime
    message_count: int = 0


class WorkspaceListResponse(BaseModel):
    workspaces: list[WorkspaceResponse]
    total: int


class WorkspaceCreateResponse(BaseModel):
    message: str
    workspace: WorkspaceResponse