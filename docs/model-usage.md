# Model Inference Guide

## Overview
This guide explains how to load and use the trained models for prediction.

## Available Models

### 1. Binary Classification Model
| File | Description |
|------|-------------|
| `models/logistic_model.pkl` | Logistic Regression classifier |
| `models/tfidf_vectorizer.pkl` | TF-IDF vectorizer |

**Accuracy**: 94%
**Output**: 0 (non-suicide) or 1 (suicide)

### 2. Risk Level Model
| File | Description |
|------|-------------|
| `models/risk_level_classifier.pkl` | Random Forest classifier |
| `models/risk_vectorizer.pkl` | TF-IDF vectorizer with bigrams |

**Accuracy**: 85%
**Output**: 0 (minimal), 1 (low), 2 (mid), 3 (high), 4 (strong)

## Loading Models

```python
import joblib

# Binary classification
binary_model = joblib.load("models/logistic_model.pkl")
binary_vectorizer = joblib.load("models/tfidf_vectorizer.pkl")

# Risk level classification
risk_model = joblib.load("models/risk_level_classifier.pkl")
risk_vectorizer = joblib.load("models/risk_vectorizer.pkl")
```

## Binary Classification Usage

### Single Prediction
```python
def predict_suicide_risk(text):
    vec = binary_vectorizer.transform([text])
    pred = binary_model.predict(vec)[0]
    prob = binary_model.predict_proba(vec)[0][1]
    return pred, prob

# Example
text = "I feel like there's no point in living anymore"
prediction, confidence = predict_suicide_risk(text)
print(f"Risk: {'Yes' if prediction == 1 else 'No'}")
print(f"Confidence: {confidence:.2%}")
```

### Batch Prediction
```python
def batch_predict(texts):
    vectors = binary_vectorizer.transform(texts)
    predictions = binary_model.predict(vectors)
    probabilities = binary_model.predict_proba(vectors)
    return predictions, probabilities
```

## Risk Level Classification Usage

### Risk Level Mapping
```python
RISK_LEVELS = {
    0: 'minimal',
    1: 'low', 
    2: 'mid',
    3: 'high',
    4: 'strong'
}

RISK_DESCRIPTIONS = {
    'minimal': 'No risk indicators',
    'low': 'Mild distress, monitor',
    'mid': 'Moderate risk, professional review needed',
    'high': 'High risk, urgent intervention',
    'strong': 'Critical, emergency response'
}

RISK_ACTIONS = {
    'minimal': 'Standard check-in within 1 week',
    'low': 'Monitor and follow up within 3-5 days',
    'mid': 'Urgent screening within 24-48 hours',
    'high': 'Immediate intervention within 24 hours',
    'strong': 'CRITICAL - Emergency response required'
}
```

### Single Prediction
```python
def predict_risk_level(text):
    vec = risk_vectorizer.transform([text])
    pred = risk_model.predict(vec)[0]
    return RISK_LEVELS[pred], pred

# Example
text = "I want to kill myself, I have a plan"
level, score = predict_risk_level(text)
print(f"Risk Level: {level.upper()}")
print(f"Action: {RISK_ACTIONS[level]}")
```

## Combined Analysis

```python
def comprehensive_analysis(text):
    # Binary prediction
    bin_vec = binary_vectorizer.transform([text])
    bin_pred = binary_model.predict(bin_vec)[0]
    bin_prob = binary_model.predict_proba(bin_vec)[0][1]
    
    # Risk level
    risk_vec = risk_vectorizer.transform([text])
    risk_pred = risk_model.predict(risk_vec)[0]
    
    return {
        'text': text[:100] + '...' if len(text) > 100 else text,
        'binary_prediction': 'Suicide Risk' if bin_pred == 1 else 'No Risk',
        'confidence': f"{bin_prob:.1%}",
        'risk_level': RISK_LEVELS[risk_pred].upper(),
        'risk_score': risk_pred,
        'action_required': RISK_ACTIONS[RISK_LEVELS[risk_pred]]
    }
```

## Flask API Example

```python
from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load models at startup
binary_model = joblib.load("models/logistic_model.pkl")
binary_vectorizer = joblib.load("models/tfidf_vectorizer.pkl")
risk_model = joblib.load("models/risk_level_classifier.pkl")
risk_vectorizer = joblib.load("models/risk_vectorizer.pkl")

RISK_LEVELS = {0: 'minimal', 1: 'low', 2: 'mid', 3: 'high', 4: 'strong'}
RISK_ACTIONS = {
    'minimal': 'Standard check-in',
    'low': 'Monitor',
    'mid': 'Professional review',
    'high': 'Urgent intervention',
    'strong': 'Emergency response'
}

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    # Get predictions
    bin_vec = binary_vectorizer.transform([text])
    bin_pred = binary_model.predict(bin_vec)[0]
    bin_prob = binary_model.predict_proba(bin_vec)[0][1]
    
    risk_vec = risk_vectorizer.transform([text])
    risk_pred = risk_model.predict(risk_vec)[0]
    
    return jsonify({
        'binary_prediction': 'Suicide Risk' if bin_pred == 1 else 'No Risk',
        'confidence': f"{bin_prob:.1%}",
        'risk_level': RISK_LEVELS[risk_pred].upper(),
        'recommended_action': RISK_ACTIONS[RISK_LEVELS[risk_pred]]
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

## CLI Tool Example

```python
#!/usr/bin/env python3
"""Command-line interface for suicide risk analysis."""

import argparse
import joblib

RISK_LEVELS = {0: 'minimal', 1: 'low', 2: 'mid', 3: 'high', 4: 'strong'}

def main():
    parser = argparse.ArgumentParser(description='Suicide Risk Analysis')
    parser.add_argument('text', help='Text to analyze')
    parser.add_argument('--model', default='binary', choices=['binary', 'risk'],
                        help='Model type to use')
    args = parser.parse_args()
    
    if args.model == 'binary':
        model = joblib.load("models/logistic_model.pkl")
        vectorizer = joblib.load("models/tfidf_vectorizer.pkl")
        vec = vectorizer.transform([args.text])
        pred = model.predict(vec)[0]
        prob = model.predict_proba(vec)[0][1]
        print(f"Suicide Risk: {'Yes' if pred == 1 else 'No'}")
        print(f"Confidence: {prob:.1%}")
    else:
        model = joblib.load("models/risk_level_classifier.pkl")
        vectorizer = joblib.load("models/risk_vectorizer.pkl")
        vec = vectorizer.transform([args.text])
        pred = model.predict(vec)[0]
        print(f"Risk Level: {RISK_LEVELS[pred].upper()}")

if __name__ == '__main__':
    main()
```

**Usage**:
```bash
python cli.py "I want to end my life" --model risk
```

## Performance Notes

| Operation | Speed |
|-----------|-------|
| Single prediction | ~10ms |
| Batch (1,000 texts) | ~2 seconds |
| Model loading | ~500ms |

## Model Limitations

⚠️ **Important Warnings**:

1. **Not a Diagnostic Tool**: This is a screening aid only
2. **False Negatives Possible**: May miss some high-risk cases
3. **False Positives Possible**: May flag non-risk posts
4. **Context Blindness**: Cannot understand full context
5. **Human Review Required**: All predictions should be reviewed

## Recommended Thresholds

```python
# For high-stakes decisions
HIGH_CONF = 0.80  # Require 80% confidence

# For screening purposes
MEDIUM_CONF = 0.60  # Flag for review at 60%

def safe_prediction(text):
    pred, prob = predict_suicide_risk(text)
    
    if prob >= HIGH_CONF:
        return 'HIGH_RISK', prob
    elif prob >= MEDIUM_CONF:
        return 'REVIEW_RECOMMENDED', prob
    else:
        return 'LOW_RISK', prob
```

## Model Versioning

| Model | Dataset | Date | Accuracy |
|-------|---------|------|----------|
| Binary | 232K rows | April 2026 | 94% |
| Risk Level | 232K rows | April 2026 | 85% |
