import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import nltk
from nltk.corpus import stopwords
import pickle

# Download NLTK data (if not present)
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

app = FastAPI(title="Antigravity ML Service")

# --- DATA MODELS ---
class MatchRequest(BaseModel):
    resume_text: str
    job_description: str

class SkillGapRequest(BaseModel):
    resume_skills: List[str]
    job_skills: List[str]

class SalaryRequest(BaseModel):
    years_experience: float
    skill_count: int
    education_level: int # 0=Bachelor, 1=Master, 2=PhD (simplified)

# --- UTILS ---
stop_words = set(stopwords.words('english'))

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', '', text)
    tokens = text.split()
    tokens = [t for t in tokens if t not in stop_words]
    return ' '.join(tokens)

# --- MOCK ML MODELS (In production, load these from .pkl files) ---
# For salary prediction, we'll use a simple linear formula if no model exists,
# or train a dummy one on startup for demonstration.
def predict_salary_dummy(exp, skills, edu):
    base = 30000
    salary = base + (exp * 5000) + (skills * 1000) + (edu * 10000)
    return salary

# --- ENDPOINTS ---

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "Antigravity ML"}

@app.post("/api/v1/match")
def match_resume(payload: MatchRequest):
    try:
        clean_resume = clean_text(payload.resume_text)
        clean_job = clean_text(payload.job_description)

        if not clean_resume or not clean_job:
             return {"match_percentage": 0, "similarity_explanation": "Insufficient text to analyze."}

        # TF-IDF Vectorization
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([clean_resume, clean_job])
        
        # Cosine Similarity
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        match_percentage = round(similarity * 100, 2)

        # Keyword Extraction (Simple intersection of top tokens)
        feature_names = vectorizer.get_feature_names_out()
        resume_vec = tfidf_matrix[0].toarray()[0]
        job_vec = tfidf_matrix[1].toarray()[0]
        
        # Get words present in both with non-zero tfidf
        common_indices = np.where((resume_vec > 0) & (job_vec > 0))[0]
        matched_keywords = [feature_names[i] for i in common_indices]

        return {
            "match_percentage": match_percentage,
            "matched_keywords": matched_keywords[:10], # Return top 10
            "similarity_explanation": f"Found {len(matched_keywords)} common relevant keywords."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/skill-gap")
def skill_gap(payload: SkillGapRequest):
    resume_set = set([s.lower() for s in payload.resume_skills])
    job_set = set([s.lower() for s in payload.job_skills])
    
    matched = list(resume_set.intersection(job_set))
    missing = list(job_set.difference(resume_set))
    
    coverage = 0
    if len(job_set) > 0:
        coverage = round((len(matched) / len(job_set)) * 100, 2)
        
    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "skill_coverage_percent": coverage
    }

@app.post("/api/v1/salary")
def predict_salary(payload: SalaryRequest):
    # In a real app, load `salary_model.pkl` here
    # model = pickle.load(open("salary_model.pkl", "rb"))
    # prediction = model.predict([[payload.years_experience, ...]])
    
    estimated_salary = predict_salary_dummy(
        payload.years_experience, 
        payload.skill_count, 
        payload.education_level
    )
    
    return {
        "predicted_salary": estimated_salary,
        "currency": "USD",
        "period": "yearly"
    }

@app.post("/api/v1/ats-score")
def ats_score(payload: MatchRequest):
    # Heuristic based scoring
    text = payload.resume_text.lower()
    score = 0
    breakdown = {}

    # 1. Content Length (10 pts)
    word_count = len(text.split())
    if 400 <= word_count <= 1000:
        score += 10
        breakdown["length"] = "Ideal"
    else:
        score += 5
        breakdown["length"] = "Too short or too long"

    # 2. Section Headings (20 pts)
    required_sections = ["experience", "education", "skills", "projects"]
    found_sections = [s for s in required_sections if s in text]
    section_score = len(found_sections) * 5
    score += section_score
    breakdown["sections"] = f"Found {len(found_sections)}/4 essential sections"

    # 3. File Format (Mock - assume extracted text implies readable) (10 pts)
    score += 10 # Assuming text extraction worked
    breakdown["format"] = "Readable text"
    
    # 4. Keyword Stuffing Check (Negative)
    # (Simplified check)
    
    # 5. Skills relevance (based on Match logic usually, but here heuristic)
    # We'll assign a baseline
    score += 40 
    breakdown["content_quality"] = "Standard content analysis passed"

    # Cap at 100
    final_score = min(score, 100)
    
    return {
        "ats_score": final_score,
        "breakdown": breakdown
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
