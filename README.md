# CV Matcher (FastAPI + Vite/React + ChatGPT + Gemini)

CV-Matcher is an AI-powered web application that analyzes how well a candidate’s CV aligns with a given job description. Built with FastAPI (Python) and Vite/React (TypeScript), it leverages ChatGPT (OpenAI) and Google Gemini models to evaluate uploaded PDFs or DOCX files and return a realistic match score (0–100) with pros, cons, and a short reasoning. The project follows SOLID principles and a clean architecture to ensure scalability, clarity, and easy provider swapping — demonstrating applied AI integration, modern full-stack development, and clean system design.

## ✨ Key Features
- AI Match Scoring: Upload CV + JD, pick provider (ChatGPT/Gemini/Claude/Fusion), get score, band, pros/cons, and reasoning.
- Interactive UI: Upload panel, animated result panel with score bubble, and responsive motion choreography.
- Context Explorer: Danish sample data across tools (Invenias, Survey, Copilot, TalentRiver, Quill) with “keep” to pin context cards and export them. Can be wired to live tool endpoints via feature flag (see Context API).
- Export to PDF: “Export 360° Candidate View” prints match result plus pinned context cards to PDF/print dialog.
- Clean Architecture: SOLID-aligned hooks/components, shared motion presets, and typed API layer for provider flexibility.

🔧 Prerequisites

- Python 3.10+ (same as your venv)
- Node 18+ (for Vite)
- Accounts/keys for:
- OpenAI (for ChatGPT) → <https://platform.openai.com/api-keys>
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
- PROVIDER=ChatGPT

- ChatGPT (OpenAI)
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

- Fusion judge
- FUSION_JUDGE_PROVIDER=ChatGPT   # who reconciles the other models (ChatGPT/Gemini/Claude)

- Generation parameters
- TEMPERATURE=0.4
- SEED=7
- MAX_TOKENS=500

### 4. Run the API

uvicorn app.main:app --reload

### 5. Open docs

- <http://localhost:8000/docs>
- POST /match — upload cv + jd (PDF/DOCX).
- Optional query param: provider=ChatGPT|Gemini|Claude|Fusion (defaults to env PROVIDER). OpenAI is accepted as an alias for ChatGPT.
- GET /health — simple ping.
- Context Explorer (demo endpoints):
  - GET /tools — list context tools
  - GET /tools/{toolId}/options — list options for a tool
  - GET /tools/{toolId}/options/{optionId} — get option content (static demo data; extend for live integrations)

## 🖥 Frontend — Setup & Run

### 1. Install deps

- cd frontend
- npm install

### 2. Start dev server

npm run dev

### 3. Visit <http://localhost:5173>

- Upload a JD and a CV
- Use the Provider toggle (ChatGPT/Gemini/Claude/Fusion)
- Click Evaluate to score; view animated score bubble, pros/cons, and reasoning
- Open Context Explorer to browse candidate context data; keep/pin cards for later reference
- Export 360° Candidate View to PDF/print (includes match result and pinned cards)

### Context Explorer (API-driven)
- The Context Explorer uses a Context API client to fetch tools/options/content from backend endpoints.
- Enable via env vars: `VITE_CONTEXT_API_ENABLED=true` and `VITE_CONTEXT_API_URL=http://localhost:8000` (or your host).
- Backend demo endpoints return Danish sample content; replace with live tool integrations over time.
