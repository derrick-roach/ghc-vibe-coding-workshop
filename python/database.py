"""
SQLite database initialization and CRUD operations for the SNS API.
"""
import sqlite3
import uuid
from contextlib import contextmanager
from datetime import datetime, timezone
from typing import List, Optional

from models import Comment, CommentRequest, Like, LikeRequest, Post, PostRequest

DATABASE_NAME = "sns_api.db"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


@contextmanager
def get_db():
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
    finally:
        conn.close()


# ---------------------------------------------------------------------------
# Initialization
# ---------------------------------------------------------------------------

def init_database() -> None:
    with get_db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS posts (
                id         TEXT PRIMARY KEY,
                username   TEXT NOT NULL,
                content    TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS comments (
                id         TEXT PRIMARY KEY,
                post_id    TEXT NOT NULL,
                username   TEXT NOT NULL,
                content    TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS likes (
                post_id    TEXT NOT NULL,
                username   TEXT NOT NULL,
                liked_at   TEXT NOT NULL,
                PRIMARY KEY (post_id, username),
                FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
            );
        """)
        conn.commit()


# ---------------------------------------------------------------------------
# Posts
# ---------------------------------------------------------------------------

def _row_to_post(row: sqlite3.Row) -> Post:
    return Post(
        id=row["id"],
        username=row["username"],
        content=row["content"],
        likesCount=row["likes_count"],
        commentsCount=row["comments_count"],
        createdAt=row["created_at"],
        updatedAt=row["updated_at"],
    )


_POST_SELECT = """
    SELECT
        p.id, p.username, p.content, p.created_at, p.updated_at,
        COUNT(DISTINCT l.username) AS likes_count,
        COUNT(DISTINCT c.id)       AS comments_count
    FROM posts p
    LEFT JOIN likes    l ON l.post_id = p.id
    LEFT JOIN comments c ON c.post_id = p.id
"""


def get_all_posts() -> List[Post]:
    with get_db() as conn:
        rows = conn.execute(
            _POST_SELECT + " GROUP BY p.id ORDER BY p.created_at DESC"
        ).fetchall()
        return [_row_to_post(r) for r in rows]


def get_post_by_id(post_id: str) -> Optional[Post]:
    with get_db() as conn:
        row = conn.execute(
            _POST_SELECT + " WHERE p.id = ? GROUP BY p.id", (post_id,)
        ).fetchone()
        return _row_to_post(row) if row else None


def create_post(data: PostRequest) -> Post:
    post_id = str(uuid.uuid4())
    now = _now_iso()
    with get_db() as conn:
        conn.execute(
            "INSERT INTO posts (id, username, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
            (post_id, data.username, data.content, now, now),
        )
        conn.commit()
    return Post(
        id=post_id,
        username=data.username,
        content=data.content,
        likesCount=0,
        commentsCount=0,
        createdAt=now,
        updatedAt=now,
    )


def update_post(post_id: str, data: PostRequest) -> Optional[Post]:
    now = _now_iso()
    with get_db() as conn:
        cur = conn.execute(
            "UPDATE posts SET content = ?, updated_at = ? WHERE id = ?",
            (data.content, now, post_id),
        )
        if cur.rowcount == 0:
            return None
        conn.commit()
    return get_post_by_id(post_id)


def delete_post(post_id: str) -> bool:
    with get_db() as conn:
        cur = conn.execute("DELETE FROM posts WHERE id = ?", (post_id,))
        conn.commit()
        return cur.rowcount > 0


# ---------------------------------------------------------------------------
# Comments
# ---------------------------------------------------------------------------

def _row_to_comment(row: sqlite3.Row) -> Comment:
    return Comment(
        id=row["id"],
        postId=row["post_id"],
        username=row["username"],
        content=row["content"],
        createdAt=row["created_at"],
        updatedAt=row["updated_at"],
    )


def get_comments_by_post_id(post_id: str) -> List[Comment]:
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC",
            (post_id,),
        ).fetchall()
        return [_row_to_comment(r) for r in rows]


def get_comment_by_id(post_id: str, comment_id: str) -> Optional[Comment]:
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM comments WHERE id = ? AND post_id = ?",
            (comment_id, post_id),
        ).fetchone()
        return _row_to_comment(row) if row else None


def create_comment(post_id: str, data: CommentRequest) -> Optional[Comment]:
    if not get_post_by_id(post_id):
        return None
    comment_id = str(uuid.uuid4())
    now = _now_iso()
    with get_db() as conn:
        conn.execute(
            "INSERT INTO comments (id, post_id, username, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
            (comment_id, post_id, data.username, data.content, now, now),
        )
        conn.commit()
    return Comment(
        id=comment_id,
        postId=post_id,
        username=data.username,
        content=data.content,
        createdAt=now,
        updatedAt=now,
    )


def update_comment(post_id: str, comment_id: str, data: CommentRequest) -> Optional[Comment]:
    now = _now_iso()
    with get_db() as conn:
        cur = conn.execute(
            "UPDATE comments SET content = ?, updated_at = ? WHERE id = ? AND post_id = ?",
            (data.content, now, comment_id, post_id),
        )
        if cur.rowcount == 0:
            return None
        conn.commit()
    return get_comment_by_id(post_id, comment_id)


def delete_comment(post_id: str, comment_id: str) -> bool:
    with get_db() as conn:
        cur = conn.execute(
            "DELETE FROM comments WHERE id = ? AND post_id = ?",
            (comment_id, post_id),
        )
        conn.commit()
        return cur.rowcount > 0


# ---------------------------------------------------------------------------
# Likes
# ---------------------------------------------------------------------------

def add_like(post_id: str, username: str) -> Optional[Like]:
    if not get_post_by_id(post_id):
        return None
    now = _now_iso()
    with get_db() as conn:
        try:
            conn.execute(
                "INSERT INTO likes (post_id, username, liked_at) VALUES (?, ?, ?)",
                (post_id, username, now),
            )
            conn.commit()
        except sqlite3.IntegrityError:
            # Already liked
            return None
    return Like(postId=post_id, username=username, likedAt=now)


def remove_like(post_id: str, username: str) -> bool:
    with get_db() as conn:
        cur = conn.execute(
            "DELETE FROM likes WHERE post_id = ? AND username = ?",
            (post_id, username),
        )
        conn.commit()
        return cur.rowcount > 0
