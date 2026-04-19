import os
import joblib
import numpy as np
from typing import Dict, Any, Optional

try:
    from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
    VADER_AVAILABLE = True
except ImportError:
    VADER_AVAILABLE = False

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")

binary_model: Optional[Any] = None
binary_vectorizer: Optional[Any] = None
risk_model: Optional[Any] = None
risk_vectorizer: Optional[Any] = None
models_loaded: bool = False
vader_analyzer: Optional[Any] = None


def init_sentiment() -> None:
    global vader_analyzer
    if VADER_AVAILABLE:
        vader_analyzer = SentimentIntensityAnalyzer()


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
    
    init_sentiment()


def predict_binary(text: str) -> Dict[str, Any]:
    if not models_loaded:
        return {"prediction": 1, "probability": 0.5}
    
    vec = binary_vectorizer.transform([text])
    pred = binary_model.predict(vec)[0]
    prob = binary_model.predict_proba(vec)[0][1]
    
    return {"prediction": int(pred), "probability": float(prob)}


def predict_risk_level(text: str) -> Dict[str, Any]:
    RISK_LEVELS = {
        0: "minimal",
        1: "low",
        2: "mid",
        3: "high",
        4: "strong"
    }
    
    if not models_loaded:
        return {"prediction": 0, "label": "minimal", "probability": 0.5}
    
    vec = risk_vectorizer.transform([text])
    pred = risk_model.predict(vec)[0]
    pred_int = int(pred)
    
    if hasattr(risk_model, "predict_proba"):
        prob = risk_model.predict_proba(vec)[0][pred_int]
    else:
        prob = 0.5
    
    return {"prediction": pred_int, "label": RISK_LEVELS[pred_int], "probability": float(prob)}


def get_sentiment_scores(text: str) -> Dict[str, float]:
    if not vader_analyzer:
        return {
            "neg": 0.0,
            "neu": 0.5,
            "pos": 0.0,
            "compound": 0.0
        }
    
    scores = vader_analyzer.polarity_scores(str(text))
    return {
        "neg": scores.get("neg", 0.0),
        "neu": scores.get("neu", 0.5),
        "pos": scores.get("pos", 0.0),
        "compound": scores.get("compound", 0.0)
    }


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


def detailed_analysis(text: str) -> Dict[str, Any]:
    binary = predict_binary(text)
    risk_result = predict_risk_level(text)
    sentiment = get_sentiment_scores(text)
    text_len = len(text)
    
    emotional = {
        "mood": max(0, min(100, (sentiment["compound"] + 1) * 50)),
        "stress": max(0, min(100, (1 - sentiment["compound"]) * 50 + (risk_result["prediction"] * 20))),
        "energy": max(0, min(100, sentiment["pos"] * 100)),
    }
    
    risk_level_score = risk_result["prediction"]
    
    if risk_level_score == 4:
        no_risk = 5
        critical = 80
        risk_pct = 15
    elif risk_level_score == 3:
        no_risk = 10
        critical = 50
        risk_pct = 40
    elif risk_level_score == 2:
        no_risk = 30
        critical = 20
        risk_pct = 50
    elif risk_level_score == 1:
        no_risk = 50
        critical = 0
        risk_pct = 50
    else:
        no_risk = 80
        critical = 0
        risk_pct = 20
    
    risk_dist = {
        "no_risk": no_risk,
        "risk": risk_pct,
        "critical": critical,
    }
    
    return {
        "text": text[:100] + "..." if len(text) > 100 else text,
        "text_length": text_len,
        "binary_prediction": "Suicide Risk" if binary["prediction"] == 1 else "No Risk",
        "confidence": binary["probability"],
        "risk_level": risk_result["label"],
        "risk_score": risk_result["prediction"],
        "risk_description": get_risk_description(risk_result["prediction"]),
        "action_required": get_action(risk_result["prediction"]),
        "sentiment": sentiment,
        "emotional": emotional,
        "risk_distribution": risk_dist,
    }


def get_risk_description(risk_level: int) -> str:
    descriptions = {
        0: "No risk indicators - standard response",
        1: "Mild distress - monitor and follow-up within 3-5 days",
        2: "Moderate risk - professional review needed within 24-48 hours",
        3: "High risk - urgent intervention within 24 hours",
        4: "Critical - emergency response required immediately"
    }
    return descriptions.get(risk_level, "Unknown")