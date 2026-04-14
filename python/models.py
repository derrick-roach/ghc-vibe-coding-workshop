"""
Pydantic models matching the OpenAPI schema definitions in openapi.yaml.
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------------

class PostRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=50, description="Username of the post author")
    content: str = Field(..., min_length=1, max_length=2000, description="Content of the post")


class CommentRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=50, description="Username of the comment author")
    content: str = Field(..., min_length=1, max_length=1000, description="Content of the comment")


class LikeRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=50, description="Username of the user liking the post")


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

class Post(BaseModel):
    id: str = Field(..., description="Unique identifier for the post")
    username: str = Field(..., min_length=1, max_length=50, description="Username of the post author")
    content: str = Field(..., min_length=1, max_length=2000, description="Content of the post")
    likesCount: int = Field(..., ge=0, description="Total number of likes on the post")
    commentsCount: int = Field(..., ge=0, description="Total number of comments on the post")
    createdAt: datetime = Field(..., description="Timestamp when the post was created")
    updatedAt: datetime = Field(..., description="Timestamp when the post was last updated")


class Comment(BaseModel):
    id: str = Field(..., description="Unique identifier for the comment")
    postId: str = Field(..., description="Identifier of the post this comment belongs to")
    username: str = Field(..., min_length=1, max_length=50, description="Username of the comment author")
    content: str = Field(..., min_length=1, max_length=1000, description="Content of the comment")
    createdAt: datetime = Field(..., description="Timestamp when the comment was created")
    updatedAt: datetime = Field(..., description="Timestamp when the comment was last updated")


class Like(BaseModel):
    postId: str = Field(..., description="Identifier of the liked post")
    username: str = Field(..., min_length=1, max_length=50, description="Username of the user who liked the post")
    likedAt: datetime = Field(..., description="Timestamp when the like was recorded")


class Error(BaseModel):
    error: str = Field(..., description="Error code or type")
    message: str = Field(..., description="Human-readable description of the error")
    details: Optional[List[str]] = Field(None, description="Optional list of specific validation issues")
