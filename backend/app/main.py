"""FastAPI app wiring CORS and API routes."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router

app = FastAPI(title="CV Matcher API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your React dev server
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
