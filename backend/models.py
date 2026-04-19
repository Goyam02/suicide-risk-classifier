import os
import joblib
import numpy as np
from typing import Dict, Any, Optional

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")

binary_model: Optional[Any] = None
binary_vectorizer: Optional[Any] = None
risk_model: Optional[Any] = None
risk_vectorizer: Optional[Any] = None
models_loaded: bool = False


def load_models() -> None:
    global binary_model, binary_vectorizer, risk_model, risk_vectorizer, models_loaded
    
    model_path = lambda f: os.path.join(MODELS_DIR, f)
    
    try:
        binary_model = joblib.load(model_path("logistic_model.pkl"))
        binary_vectorizer = joblib.load(model_path("tfidf_vectorizer.pkl"))
        risk_model = joblib.load(model_path("risk_level_classifier.pkl"))
        risk_vectorizer = joblib.load(model_path("risk_vectorizer.pkl"))
        models_loaded = True
    except FileNotFoundError as e:
        print(f"Warning: Model files not found at {MODELS_DIR}. {e}")
        print("Please run the notebooks to train models first.")
        models_loaded = False


def predict_binary(text: str) -> Dict[str, Any]:
    if not models_loaded:
        return {"prediction": 1, "probability": 0.5}
    
    vec = binary_vectorizer.transform([text])
    pred = binary_model.predict(vec)[0]
    prob = binary_model.predict_proba(vec)[0][1]
    
    return {"prediction": int(pred), "probability": float(prob)}


def predict_risk_level(text: str) -> Dict[str, Any]:
    if not models_loaded:
        return {"prediction": 0, "probability": 0.5}
    
    RISK_LEVELS = {
        0: "minimal",
        1: "low",
        2: "mid",
        3: "high",
        4: "strong"
    }
    
    vec = risk_vectorizer.transform([text])
    pred = risk_model.predict(vec)[0]
    
    if hasattr(risk_model, "predict_proba"):
        prob = risk_model.predict_proba(vec)[0][pred]
    else:
        prob = 0.5
    
    return {"prediction": int(pred), "label": RISK_LEVELS[pred], "probability": float(prob)}


def comprehensive_analysis(text: str) -> Dict[str, Any]:
    binary = predict_binary(text)
    risk = predict_risk_level(text)
    
    return {
        "text": text[:100] + "..." if len(text) > 100 else text,
        "binary_prediction": "Suicide Risk" if binary["prediction"] == 1 else "No Risk",
        "confidence": binary["probability"],
        "risk_level": risk["label"],
        "risk_score": risk["prediction"],
        "action_required": get_action(risk["prediction"])
    }


def get_action(risk_level: int) -> str:
    actions = {
        0: "Standard check-in within 1 week",
        1: "Monitor and follow up within 3-5 days",
        2: "Urgent screening within 24-48 hours",
        3: "Immediate intervention within 24 hours",
        4: "CRITICAL - Emergency response required"
    }
    return actions.get(risk_level, "Unknown")