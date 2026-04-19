from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import os

from .models import load_models, predict_binary, predict_risk_level, comprehensive_analysis

app = FastAPI(
    title="Suicide Risk Classification API",
    description="API for suicide risk detection from text using ML models",
    version="1.0.0"
)

RISK_LEVELS = {
    0: "minimal",
    1: "low",
    2: "mid",
    3: "high",
    4: "strong"
}

RISK_DESCRIPTIONS = {
    "minimal": "No risk indicators - standard response",
    "low": "Mild distress - monitor and follow-up within 3-5 days",
    "mid": "Moderate risk - professional review needed within 24-48 hours",
    "high": "High risk - urgent intervention within 24 hours",
    "strong": "Critical - emergency response required immediately"
}

RISK_ACTIONS = {
    "minimal": "Standard check-in within 1 week",
    "low": "Monitor and follow up within 3-5 days",
    "mid": "Urgent screening within 24-48 hours",
    "high": "Immediate intervention within 24 hours",
    "strong": "CRITICAL - Emergency response required"
}


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=50000, description="Text to analyze")


class BatchAnalyzeRequest(BaseModel):
    texts: List[str] = Field(..., min_items=1, max_items=1000)


class AnalysisResult(BaseModel):
    text: str
    binary_prediction: str
    confidence: float
    risk_level: str
    risk_description: str
    action_required: str


class HealthResponse(BaseModel):
    status: str
    models_loaded: bool


@app.on_event("startup")
async def startup_event():
    load_models()


@app.get("/health", response_model=HealthResponse)
async def health_check():
    from .models import models_loaded
    return HealthResponse(
        status="healthy" if models_loaded else "models_not_loaded",
        models_loaded=models_loaded
    )


@app.post("/analyze", response_model=AnalysisResult)
def analyze_text(request: AnalyzeRequest):
    text = request.text.strip()
    
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    result = comprehensive_analysis(text)
    
    risk_level = RISK_LEVELS[result["risk_score"]]
    
    return AnalysisResult(
        text=result["text"],
        binary_prediction=result["binary_prediction"],
        confidence=result["confidence"],
        risk_level=risk_level.upper(),
        risk_description=RISK_DESCRIPTIONS[risk_level],
        action_required=RISK_ACTIONS[risk_level]
    )


@app.post("/analyze/batch")
def analyze_batch(request: BatchAnalyzeRequest):
    texts = [t.strip() for t in request.texts if t.strip()]
    
    if not texts:
        raise HTTPException(status_code=400, detail="No valid texts provided")
    
    results = []
    for text in texts:
        result = comprehensive_analysis(text)
        risk_level = RISK_LEVELS[result["risk_score"]]
        
        results.append({
            "text": result["text"],
            "binary_prediction": result["binary_prediction"],
            "confidence": result["confidence"],
            "risk_level": risk_level.upper(),
            "risk_description": RISK_DESCRIPTIONS[risk_level],
            "action_required": RISK_ACTIONS[risk_level]
        })
    
    return {"results": results, "total": len(results)}


@app.get("/")
def root():
    return {
        "message": "Suicide Risk Classification API",
        "version": "1.0.0",
        "docs": "/docs"
    }