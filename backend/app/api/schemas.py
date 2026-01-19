"""Pydantic response schemas for the Context Explorer endpoints."""
from __future__ import annotations

from pydantic import BaseModel
from typing import Optional, Any


class ToolSchema(BaseModel):
    id: str
    name: str


class ToolOptionSchema(BaseModel):
    id: str
    label: str
    description: Optional[str] = None


class ToolContentSchema(BaseModel):
    toolId: str
    optionId: str
    label: str
    raw: Optional[Any] = None
    aiRendered: Optional[str] = None
    updatedAt: Optional[str] = None
