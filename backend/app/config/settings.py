"""
settings.py
------------
Centralized configuration for environment variables and API credentials.
This file reads values from `.env` and exposes them via a typed Settings object.

Applies SRP (Single Responsibility): configuration loading only.
"""

from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    # --- App behavior ---
    provider: str = Field(default="OpenAI", description="Which provider to use (OpenAI|Gemini|Claude|Fusion)")
    env: str = Field(default="development", description="Environment label (dev/prod/test)")

    # --- OpenAI configuration ---
    openai_api_key: str | None = Field(default=None, description="OpenAI API key")
    chat_model: str = Field(default="gpt-4o-mini", description="OpenAI chat model name")
    embeddings_model: str = Field(default="text-embedding-3-small", description="OpenAI embeddings model")

    # --- Gemini configuration ---
    google_api_key: str | None = Field(default=None, description="Google Gemini API key")
    gemini_chat_model: str = Field(default="gemini-2.5-flash", description="Gemini chat model name")
    gemini_embeddings_model: str = Field(default="text-embedding-004", description="Gemini embeddings model")

    # --- Anthropic Claude configuration ---
    anthropic_api_key: str | None = Field(default=None, description="Anthropic API key")
    anthropic_model: str = Field(default="claude-sonnet-4-5-20250929", description="Anthropic Claude model name")

    # --- Fusion (meta) configuration ---
    fusion_judge_provider: str = Field(default="OpenAI", description="Provider to use as the final judge for the fusion judge step")

    # --- General tuning ---
    temperature: float = Field(default=0.4, description="Sampling temperature for model output")
    seed: int = Field(default=7, description="Fixed seed for reproducibility")
    max_tokens: int = Field(default=500, description="Cap model output tokens to control cost")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Singleton instance imported by other modules
settings = Settings()
