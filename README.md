# CV Matcher (FastAPI + Vite/React + OpenAI + Gemini)

CV-Matcher is an AI-powered web application that analyzes how well a candidate’s CV aligns with a given job description. Built with FastAPI (Python) and Vite/React (TypeScript), it leverages OpenAI and Google Gemini models to evaluate uploaded PDFs or DOCX files and return a realistic match score (0–100) with pros, cons, and a short reasoning. The project follows SOLID principles and a clean architecture to ensure scalability, clarity, and easy provider swapping — demonstrating applied AI integration, modern full-stack development, and clean system design.

🔧 Prerequisites

- Python 3.10+ (same as your venv)
- Node 18+ (for Vite)
- Accounts/keys for:
- OpenAI → <https://platform.openai.com/api-keys>
- Google AI Studio (Gemini) → <https://aistudio.google.com/app/apikey>

## ⚙️ Backend — Setup & Run

### 1. Create and activate a venv

- cd backend
- python -m venv .venv
- source .venv/bin/activate   # Windows: .venv\Scripts\activate

### 2. Install dependencies

pip install -r requirements.txt

### 3. Create .env in backend/

- Which LLM to use by default (can be overridden per request)
- PROVIDER=OpenAI

- OpenAI
- OPENAI_API_KEY=sk-...your-openai-key...
- CHAT_MODEL=gpt-4o-mini
- EMBEDDINGS_MODEL=text-embedding-3-small

- Gemini
- GOOGLE_API_KEY=AIza...your-gemini-key...
- GEMINI_CHAT_MODEL=gemini-1.5-flash     # or a model you listed via ListModels
- GEMINI_EMBEDDINGS_MODEL=text-embedding-004

- Claude
- ANTHROPIC_API_KEY=sk-ant-...your-key...
- ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

- Ensemble judge
- ENSEMBLE_JUDGE_PROVIDER=OpenAI   # who reconciles the other models (OpenAI/Gemini/Claude)

- Generation parameters
- TEMPERATURE=0.4
- SEED=7
- MAX_TOKENS=500

### 4. Run the API

uvicorn app.main:app --reload

### 5. Open docs

- <http://localhost:8000/docs>
- POST /match — upload cv + jd (PDF/DOCX).
- Optional query param: provider=OpenAI|Gemini|Claude|Ensemble (defaults to env PROVIDER).
- GET /health — simple ping.

## 🖥 Frontend — Setup & Run

### 1. Install deps

- cd frontend
- npm install

### 2. Start dev server

npm run dev

### 3. Visit <http://localhost:5173>

- Upload a JD and a CV
- Use the Provider toggle (OpenAI/Gemini)
- Click Start AI Match Scoring
