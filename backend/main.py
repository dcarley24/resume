import os
from dotenv import load_dotenv
import google.generativeai as genai
from pypdf import PdfReader
from docx import Document
import io
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uuid
from datetime import datetime
import json

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OptimizationRequest(BaseModel):
    user_id: str
    resume_text: Optional[str] = None
    job_description_text: Optional[str] = None
    feedback: Optional[str] = None

class HistoryItem(BaseModel):
    id: str
    user_id: str
    timestamp: str
    resume_text: str
    job_description_text: str
    optimized_resume: str
    analysis: str

# In-memory storage
history_db: List[HistoryItem] = []

async def extract_text(file: UploadFile) -> str:
    content = await file.read()
    filename = file.filename.lower()
    
    if filename.endswith('.pdf'):
        reader = PdfReader(io.BytesIO(content))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    elif filename.endswith('.docx'):
        doc = Document(io.BytesIO(content))
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text
    else:
        # Assume text file
        return content.decode('utf-8')

@app.get("/")
async def root():
    return {"message": "Resume Optimization API is running"}

@app.post("/upload")
async def upload_file(user_id: str = Form(...), file: UploadFile = File(...), type: str = Form(...)):
    try:
        text = await extract_text(file)
        return {"filename": file.filename, "user_id": user_id, "type": type, "extracted_text": text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

@app.get("/history/{user_id}")
async def get_history(user_id: str):
    return [item for item in history_db if item.user_id == user_id]

@app.post("/optimize")
async def optimize_resume(request: OptimizationRequest):
    if not request.resume_text or not request.job_description_text:
        raise HTTPException(status_code=400, detail="Resume and Job Description are required")

    prompt = f"""
    You are an expert resume writer and career coach. Your task is to optimize a resume for a specific job description.
    
    JOB DESCRIPTION:
    {request.job_description_text}
    
    ORIGINAL RESUME:
    {request.resume_text}
    
    INSTRUCTIONS:
    1. Analyze the job description for key skills, qualifications, and keywords.
    2. Rewrite the resume to highlight relevant experience and skills that match the job.
    3. Use strong action verbs and quantify achievements where possible.
    4. Maintain the truthfulness of the original resume; do not invent experiences.
    5. **IMPORTANT**: The "resume_content" must be PLAIN TEXT suitable for an ATS. Do NOT use Markdown formatting (no bolding, no headers with #). Use simple spacing and capitalization for structure.
    6. Provide a separate "analysis" explaining what changes you made and why.

    OUTPUT FORMAT:
    Return a valid JSON object with exactly two keys:
    - "resume_content": The optimized resume text (Plain Text).
    - "analysis": A string explaining the changes.
    """

    if request.feedback:
        prompt += f"\n\nUSER FEEDBACK ON PREVIOUS VERSION:\n{request.feedback}\n\nPlease refine the resume taking this feedback into account."

    try:
        # Use generation_config to enforce JSON if possible, or just prompt engineering
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        
        try:
            result = json.loads(response.text)
            resume_content = result.get("resume_content", "")
            analysis = result.get("analysis", "")
        except json.JSONDecodeError:
            # Fallback if JSON fails
            resume_content = response.text
            analysis = "Could not parse analysis."

        # Save to history
        history_item = HistoryItem(
            id=str(uuid.uuid4()),
            user_id=request.user_id,
            timestamp=datetime.now().isoformat(),
            resume_text=request.resume_text,
            job_description_text=request.job_description_text,
            optimized_resume=resume_content,
            analysis=analysis
        )
        history_db.append(history_item)

        return {
            "original_resume": request.resume_text,
            "optimized_resume": resume_content,
            "analysis": analysis,
            "changes_made": ["Optimized for keywords", "ATS-friendly format"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Generation failed: {str(e)}")
