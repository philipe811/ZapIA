"""Tiny SQLite helper — no ORM needed for the starter app."""

import os
import sqlite3
from contextlib import closing, contextmanager

DB_PATH = os.environ.get("DATABASE_PATH", "app.db")


@contextmanager
def connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    try:
        with conn:
            yield conn
    finally:
        conn.close()


def init_db() -> None:
    os.makedirs(os.path.dirname(DB_PATH) or ".", exist_ok=True)
    with connect() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                done INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
            """
        )


def row_to_item(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "title": row["title"],
        "done": bool(row["done"]),
        "created_at": row["created_at"],
    }


def fetch_items() -> list[dict]:
    with connect() as conn:
        rows = conn.execute(
            "SELECT id, title, done, created_at FROM items ORDER BY id DESC"
        ).fetchall()
    return [row_to_item(row) for row in rows]


def fetch_item(item_id: int) -> dict | None:
    with connect() as conn:
        row = conn.execute(
            "SELECT id, title, done, created_at FROM items WHERE id = ?", (item_id,)
        ).fetchone()
    return row_to_item(row) if row else None


def insert_item(title: str) -> dict:
    with connect() as conn:
        cursor = conn.execute("INSERT INTO items (title) VALUES (?)", (title,))
        item_id = cursor.lastrowid
    return fetch_item(item_id)


def update_item(item_id: int, title: str | None, done: bool | None) -> dict | None:
    with connect() as conn:
        if title is not None:
            conn.execute("UPDATE items SET title = ? WHERE id = ?", (title, item_id))
        if done is not None:
            conn.execute(
                "UPDATE items SET done = ? WHERE id = ?", (1 if done else 0, item_id)
            )
    return fetch_item(item_id)


def delete_item(item_id: int) -> bool:
    with connect() as conn:
        cursor = conn.execute("DELETE FROM items WHERE id = ?", (item_id,))
    return cursor.rowcount > 0
