# Resume Optimization Tool

A full-stack application to optimize resumes using Google Gemini AI.

## Features
- **AI Optimization**: Tailors resumes to specific job descriptions.
- **PDF/DOCX Support**: Upload existing documents.
- **History**: Tracks past optimizations.
- **ATS Friendly**: Generates plain text output.

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: FastAPI + Python
- **AI**: Google Gemini 2.0 Flash

## Setup
1.  Backend:
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    # Create .env with GEMINI_API_KEY
    uvicorn main:app --reload
    ```
2.  Frontend:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
