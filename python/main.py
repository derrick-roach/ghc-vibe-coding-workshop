"""
Simple Social Media API — FastAPI backend.

Endpoints follow the OpenAPI contract defined in openapi.yaml.
"""
import os
from contextlib import asynccontextmanager
from typing import List

import yaml
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.responses import JSONResponse, Response

from database import (
    add_like,
    create_comment,
    create_post,
    delete_comment,
    delete_post,
    get_all_posts,
    get_comment_by_id,
    get_comments_by_post_id,
    get_post_by_id,
    init_database,
    remove_like,
    update_comment,
    update_post,
)
from models import Comment, CommentRequest, Like, LikeRequest, Post, PostRequest

# ---------------------------------------------------------------------------
# OpenAPI spec (served as-is from the repository root openapi.yaml)
# ---------------------------------------------------------------------------

_OPENAPI_PATH = os.path.join(os.path.dirname(__file__), "..", "openapi.yaml")


def _load_openapi_spec() -> dict:
    with open(_OPENAPI_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


# ---------------------------------------------------------------------------
# Application lifecycle
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_database()
    yield


# ---------------------------------------------------------------------------
# FastAPI app — docs disabled so we can serve the raw openapi.yaml instead
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Simple Social Media API",
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Custom OpenAPI + Swagger UI endpoints
# ---------------------------------------------------------------------------

@app.get("/openapi.json", include_in_schema=False)
async def openapi_json():
    """Return the exact OpenAPI document defined in openapi.yaml."""
    return JSONResponse(_load_openapi_spec())


@app.get("/docs", include_in_schema=False)
async def swagger_ui():
    """Swagger UI powered by the project's openapi.yaml."""
    return get_swagger_ui_html(openapi_url="/openapi.json", title="Simple Social Media API")


# ---------------------------------------------------------------------------
# Posts  —  /api/posts
# ---------------------------------------------------------------------------

@app.get("/api/posts", response_model=List[Post], status_code=200, tags=["Posts"])
async def list_posts():
    try:
        return get_all_posts()
    except Exception as exc:
        raise HTTPException(500, {"error": "INTERNAL_ERROR", "message": str(exc)})


@app.post("/api/posts", response_model=Post, status_code=201, tags=["Posts"])
async def create_post_endpoint(body: PostRequest):
    try:
        return create_post(body)
    except Exception as exc:
        raise HTTPException(500, {"error": "INTERNAL_ERROR", "message": str(exc)})


@app.get("/api/posts/{post_id}", response_model=Post, status_code=200, tags=["Posts"])
async def get_post(post_id: str):
    post = get_post_by_id(post_id)
    if not post:
        raise HTTPException(404, {"error": "NOT_FOUND", "message": "Post not found"})
    return post


@app.patch("/api/posts/{post_id}", response_model=Post, status_code=200, tags=["Posts"])
async def update_post_endpoint(post_id: str, body: PostRequest):
    if not get_post_by_id(post_id):
        raise HTTPException(404, {"error": "NOT_FOUND", "message": "Post not found"})
    try:
        updated = update_post(post_id, body)
        return updated
    except Exception as exc:
        raise HTTPException(500, {"error": "INTERNAL_ERROR", "message": str(exc)})


@app.delete("/api/posts/{post_id}", status_code=204, tags=["Posts"])
async def delete_post_endpoint(post_id: str):
    if not delete_post(post_id):
        raise HTTPException(404, {"error": "NOT_FOUND", "message": "Post not found"})
    return Response(status_code=204)


# ---------------------------------------------------------------------------
# Comments  —  /api/posts/{post_id}/comments
# ---------------------------------------------------------------------------

@app.get("/api/posts/{post_id}/comments", response_model=List[Comment], status_code=200, tags=["Comments"])
async def list_comments(post_id: str):
    if not get_post_by_id(post_id):
        raise HTTPException(404, {"error": "NOT_FOUND", "message": "Post not found"})
    try:
        return get_comments_by_post_id(post_id)
    except Exception as exc:
        raise HTTPException(500, {"error": "INTERNAL_ERROR", "message": str(exc)})


@app.post("/api/posts/{post_id}/comments", response_model=Comment, status_code=201, tags=["Comments"])
async def create_comment_endpoint(post_id: str, body: CommentRequest):
    comment = create_comment(post_id, body)
    if comment is None:
        raise HTTPException(404, {"error": "NOT_FOUND", "message": "Post not found"})
    return comment


@app.get("/api/posts/{post_id}/comments/{comment_id}", response_model=Comment, status_code=200, tags=["Comments"])
async def get_comment(post_id: str, comment_id: str):
    comment = get_comment_by_id(post_id, comment_id)
    if not comment:
        raise HTTPException(404, {"error": "NOT_FOUND", "message": "Comment not found"})
    return comment


@app.patch("/api/posts/{post_id}/comments/{comment_id}", response_model=Comment, status_code=200, tags=["Comments"])
async def update_comment_endpoint(post_id: str, comment_id: str, body: CommentRequest):
    if not get_post_by_id(post_id):
        raise HTTPException(404, {"error": "NOT_FOUND", "message": "Post not found"})
    updated = update_comment(post_id, comment_id, body)
    if not updated:
        raise HTTPException(404, {"error": "NOT_FOUND", "message": "Comment not found"})
    return updated


@app.delete("/api/posts/{post_id}/comments/{comment_id}", status_code=204, tags=["Comments"])
async def delete_comment_endpoint(post_id: str, comment_id: str):
    if not delete_comment(post_id, comment_id):
        raise HTTPException(404, {"error": "NOT_FOUND", "message": "Comment not found"})
    return Response(status_code=204)


# ---------------------------------------------------------------------------
# Likes  —  /api/posts/{post_id}/likes
# ---------------------------------------------------------------------------

@app.post("/api/posts/{post_id}/likes", response_model=Like, status_code=201, tags=["Likes"])
async def like_post(post_id: str, body: LikeRequest):
    if not get_post_by_id(post_id):
        raise HTTPException(404, {"error": "NOT_FOUND", "message": "Post not found"})
    like = add_like(post_id, body.username)
    if like is None:
        raise HTTPException(400, {"error": "VALIDATION_ERROR", "message": "Post already liked by this user"})
    return like


@app.delete("/api/posts/{post_id}/likes", status_code=204, tags=["Likes"])
async def unlike_post(
    post_id: str,
    username: str = Query(..., description="Username of the user removing the like"),
):
    if not get_post_by_id(post_id):
        raise HTTPException(404, {"error": "NOT_FOUND", "message": "Post not found"})
    if not remove_like(post_id, username):
        raise HTTPException(404, {"error": "NOT_FOUND", "message": "Like not found"})
    return Response(status_code=204)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
