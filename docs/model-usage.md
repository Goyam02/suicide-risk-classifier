# Model Inference API

## Quick Start

### Loading Models

```python
import joblib

# Binary classification model
binary_model = joblib.load("models/logistic_model.pkl")
binary_vectorizer = joblib.load("models/tfidf_vectorizer.pkl")

# Risk level classifier
risk_model = joblib.load("models/risk_level_classifier.pkl")
risk_vectorizer = joblib.load("models/risk_vectorizer.pkl")
```

## Binary Classification

### Basic Usage

```python
def predict_suicide_risk(text):
    """
    Predict if a post indicates suicide risk.
    
    Args:
        text: String - The post text to analyze
        
    Returns:
        int: 1 for suicide risk, 0 for no risk
    """
    vec = binary_vectorizer.transform([text])
    pred = binary_model.predict(vec)
    prob = binary_model.predict_proba(vec)[0][1]
    return pred[0], prob

# Example
text = "I feel like there's no point in living anymore"
prediction, confidence = predict_suicide_risk(text)
print(f"Risk: {'Yes' if prediction == 1 else 'No'}, Confidence: {confidence:.2%}")
```

### Batch Processing

```python
def batch_predict(texts):
    """Predict risk for multiple texts."""
    vectors = binary_vectorizer.transform(texts)
    predictions = binary_model.predict(vectors)
    probabilities = binary_model.predict_proba(vectors)
    return predictions, probabilities

# Example
posts = [
    "Had a great day with friends!",
    "Feeling really down and hopeless",
    "Work was stressful but manageable"
]
preds, probs = batch_predict(posts)
for post, pred, prob in zip(posts, preds, probs):
    print(f"'{post[:30]}...' -> Risk: {pred}, Confidence: {prob[1]:.2%}")
```

## Risk Level Classification

### Basic Usage

```python
RISK_LEVELS = {
    0: 'minimal',
    1: 'low', 
    2: 'mid',
    3: 'high',
    4: 'strong'
}

def predict_risk_level(text):
    """
    Classify the risk level of a post.
    
    Returns:
        tuple: (level_name, level_score)
    """
    vec = risk_vectorizer.transform([text])
    pred = risk_model.predict(vec)[0]
    return RISK_LEVELS[pred], pred

# Example
texts = [
    "Today was a good day!",
    "Feeling a bit sad lately",
    "I think about ending my life sometimes",
    "I want to kill myself, I have a plan"
]

for text in texts:
    level, score = predict_risk_level(text)
    print(f"'{text[:40]}...' -> {level.upper()} (score: {score})")
```

### Risk Level Actions

```python
RISK_ACTIONS = {
    'minimal': 'Standard check-in within 1 week',
    'low': 'Monitor and follow up within 3-5 days',
    'mid': 'Urgent screening within 24-48 hours',
    'high': 'Immediate intervention within 24 hours',
    'strong': 'CRITICAL - Emergency response required'
}

def get_recommended_action(text):
    """Get recommended action based on risk level."""
    level, score = predict_risk_level(text)
    action = RISK_ACTIONS[level]
    return level, action

# Example
text = "I'm tired of life and don't know how much longer I can go on"
level, action = get_recommended_action(text)
print(f"Risk Level: {level.upper()}")
print(f"Recommended Action: {action}")
```

## Combined Analysis

```python
def comprehensive_analysis(text):
    """
    Perform full analysis including all features.
    
    Returns dictionary with:
    - binary_prediction
    - risk_level
    - recommended_action
    - risk_score (probability)
    """
    # Binary prediction
    vec = binary_vectorizer.transform([text])
    binary_pred = binary_model.predict(vec)[0]
    binary_prob = binary_model.predict_proba(vec)[0][1]
    
    # Risk level
    risk_vec = risk_vectorizer.transform([text])
    risk_pred = risk_model.predict(risk_vec)[0]
    
    # Compile results
    return {
        'text': text[:100] + '...' if len(text) > 100 else text,
        'binary_prediction': 'Suicide Risk' if binary_pred == 1 else 'No Risk',
        'confidence': f"{binary_prob:.1%}",
        'risk_level': RISK_LEVELS[risk_pred].upper(),
        'action_required': RISK_ACTIONS[RISK_LEVELS[risk_pred]]
    }

# Example
result = comprehensive_analysis("I've been thinking about suicide lately")
for key, value in result.items():
    print(f"{key}: {value}")
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

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    result = comprehensive_analysis(text)
    return jsonify(result)

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
    
    # Load models
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

## Model Limitations

### Always Remember

⚠️ **Important Warnings**:

1. **Not a Diagnostic Tool**: This is a screening aid only
2. **False Negatives Possible**: May miss some high-risk cases
3. **False Positives Possible**: May flag non-risk posts
4. **Context Blindness**: Cannot understand full context
5. **Human Review Required**: All predictions should be reviewed

### Recommended Thresholds

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

## Performance Notes

| Operation | Speed |
|-----------|-------|
| Single prediction | ~10ms |
| Batch (1000 texts) | ~2 seconds |
| Model loading | ~500ms |

## Model Versioning

Current models are trained on:
- Dataset: `Suicide_Detection.csv` (232K rows)
- Date: April 2026
- Accuracy: 94% (binary), ~80% (multi-class)
