from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from . import db


@asynccontextmanager
async def lifespan(_app: FastAPI):
    db.init_db()
    yield


app = FastAPI(title="ZapIA API", version="0.1.0", lifespan=lifespan)


class ItemCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)


class ItemPatch(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    done: bool | None = None


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/items")
def list_items():
    return db.fetch_items()


@app.post("/api/items", status_code=201)
def create_item(payload: ItemCreate):
    return db.insert_item(payload.title.strip())


@app.patch("/api/items/{item_id}")
def patch_item(item_id: int, payload: ItemPatch):
    if db.fetch_item(item_id) is None:
        raise HTTPException(status_code=404, detail="Item not found")
    title = payload.title.strip() if payload.title is not None else None
    return db.update_item(item_id, title, payload.done)


@app.delete("/api/items/{item_id}", status_code=204)
def remove_item(item_id: int):
    if not db.delete_item(item_id):
        raise HTTPException(status_code=404, detail="Item not found")
    return None
