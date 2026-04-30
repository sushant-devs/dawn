from datetime import datetime
from typing import Optional

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Request, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.db.session import get_db
from app.schemas.workspace import (
    WorkspaceCreateRequest,
    WorkspaceCreateResponse,
    WorkspaceListResponse,
    WorkspaceResponse,
    WorkspaceUpdateRequest,
)


router = APIRouter(prefix="/workspaces", tags=["workspaces"])


def _to_object_id(value: str) -> ObjectId | None:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        return None


def _workspace_to_response(workspace_doc: dict, message_count: int = 0) -> WorkspaceResponse:
    return WorkspaceResponse(
        id=str(workspace_doc["_id"]),
        name=workspace_doc["name"],
        description=workspace_doc.get("description"),
        user_id=workspace_doc["user_id"],
        created_at=workspace_doc["created_at"],
        updated_at=workspace_doc["updated_at"],
        message_count=message_count,
    )


@router.post("/", response_model=WorkspaceCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_workspace(
    payload: WorkspaceCreateRequest,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    user_id = getattr(request.state, "user_id", None)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    workspaces = db["workspaces"]
    
    # Check if workspace name already exists for this user
    existing = await workspaces.find_one({
        "user_id": user_id,
        "name": payload.name.strip()
    })
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Workspace with this name already exists"
        )

    workspace_doc = {
        "name": payload.name.strip(),
        "description": payload.description.strip() if payload.description else None,
        "user_id": user_id,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    
    insert_result = await workspaces.insert_one(workspace_doc)
    workspace_doc["_id"] = insert_result.inserted_id
    
    return WorkspaceCreateResponse(
        message="Workspace created successfully",
        workspace=_workspace_to_response(workspace_doc)
    )


@router.get("/", response_model=WorkspaceListResponse)
async def get_workspaces(
    request: Request,
    skip: int = 0,
    limit: int = 100,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    user_id = getattr(request.state, "user_id", None)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    workspaces = db["workspaces"]
    messages = db["messages"]  # Assuming messages collection exists
    
    # Get workspaces for the user
    cursor = workspaces.find({"user_id": user_id}).sort("created_at", 1).skip(skip).limit(limit)
    workspace_docs = await cursor.to_list(length=limit)
    
    # Count total workspaces for pagination
    total = await workspaces.count_documents({"user_id": user_id})
    
    # Get message counts for each workspace
    workspace_responses = []
    for workspace_doc in workspace_docs:
        workspace_id = str(workspace_doc["_id"])
        message_count = await messages.count_documents({"workspace_id": workspace_id})
        workspace_responses.append(_workspace_to_response(workspace_doc, message_count))
    
    return WorkspaceListResponse(workspaces=workspace_responses, total=total)


@router.get("/{workspace_id}", response_model=WorkspaceResponse)
async def get_workspace(
    workspace_id: str,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    user_id = getattr(request.state, "user_id", None)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    object_id = _to_object_id(workspace_id)
    if not object_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid workspace ID")

    workspaces = db["workspaces"]
    messages = db["messages"]
    
    workspace_doc = await workspaces.find_one({
        "_id": object_id,
        "user_id": user_id
    })
    if not workspace_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")
    
    message_count = await messages.count_documents({"workspace_id": workspace_id})
    return _workspace_to_response(workspace_doc, message_count)


@router.put("/{workspace_id}", response_model=WorkspaceResponse)
async def update_workspace(
    workspace_id: str,
    payload: WorkspaceUpdateRequest,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    user_id = getattr(request.state, "user_id", None)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    object_id = _to_object_id(workspace_id)
    if not object_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid workspace ID")

    workspaces = db["workspaces"]
    messages = db["messages"]
    
    # Check if workspace exists and belongs to user
    workspace_doc = await workspaces.find_one({
        "_id": object_id,
        "user_id": user_id
    })
    if not workspace_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")
    
    # Prepare update data
    update_data = {"updated_at": datetime.utcnow()}
    
    if payload.name is not None:
        name = payload.name.strip()
        # Check if new name conflicts with existing workspace
        existing = await workspaces.find_one({
            "user_id": user_id,
            "name": name,
            "_id": {"$ne": object_id}
        })
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Workspace with this name already exists"
            )
        update_data["name"] = name
    
    if payload.description is not None:
        update_data["description"] = payload.description.strip() if payload.description else None
    
    # Update workspace
    await workspaces.update_one(
        {"_id": object_id},
        {"$set": update_data}
    )
    
    # Get updated workspace
    updated_workspace = await workspaces.find_one({"_id": object_id})
    message_count = await messages.count_documents({"workspace_id": workspace_id})
    
    return _workspace_to_response(updated_workspace, message_count)


@router.delete("/{workspace_id}")
async def delete_workspace(
    workspace_id: str,
    request: Request,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    user_id = getattr(request.state, "user_id", None)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    object_id = _to_object_id(workspace_id)
    if not object_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid workspace ID")

    workspaces = db["workspaces"]
    messages = db["messages"]
    
    # Check if workspace exists and belongs to user
    workspace_doc = await workspaces.find_one({
        "_id": object_id,
        "user_id": user_id
    })
    if not workspace_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")
    
    # Delete associated messages first
    await messages.delete_many({"workspace_id": workspace_id})
    
    # Delete the workspace
    await workspaces.delete_one({"_id": object_id})
    
    return {"message": "Workspace deleted successfully"}