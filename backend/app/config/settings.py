from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    provider: str = "OpenAI"
    openai_api_key: str | None = None
    embeddings_model: str = "text-embedding-3-large"
    chat_model: str = "gpt-4o-mini"

    class Config:
        env_file = ".env"

settings = Settings()