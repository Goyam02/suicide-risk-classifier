# Binary Classification Model Training

## Overview
This Jupyter notebook (`train.ipynb`) trains the primary binary classification model (Logistic Regression with TF-IDF) for suicide risk detection.

## Purpose
Build a production-ready binary classifier that:
1. **Predicts** suicide vs non-suicide posts with 94% accuracy
2. **Provides** probability scores for confidence
3. **Is fast** enough for real-time inference
4. **Is interpretable** for stakeholders

## Input
- **Source File**: `suicide-watch/suicide_watch_cleaned.csv`
- **Dataset Size**: 232,074 rows (after removing empty texts)
- **Format**: Cleaned text with binary labels (0/1)

## Code Implementation

### Step 1: Load and Prepare Data
```python
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import pandas as pd

df = pd.read_csv("suicide-watch/suicide_watch_cleaned.csv")

# Clean data
df["clean_text"] = df["clean_text"].fillna("").astype(str)
df = df[df["clean_text"].str.strip() != ""]
```

### Step 2: Train-Test Split
```python
X_train, X_test, y_train, y_test = train_test_split(
    df["clean_text"],
    df["label"],
    test_size=0.2,      # 80/20 split
    random_state=42     # Reproducibility
)
```

**Result**:
- Training: ~185,659 samples
- Test: ~46,403 samples

### Step 3: TF-IDF Vectorization
```python
vectorizer = TfidfVectorizer(max_features=5000)
X_train_vec = vectorizer.fit_transform(X_train)   # Fit on training data
X_test_vec = vectorizer.transform(X_test)         # Transform test data
```

**Important**: Fit only on training data to prevent data leakage!

### Step 4: Train Model
```python
model = LogisticRegression(
    max_iter=1000,
    class_weight="balanced",   # Handle any class imbalance
    random_state=42
)

model.fit(X_train_vec, y_train)
```

### Step 5: Evaluate Model
```python
y_pred = model.predict(X_test_vec)
print(classification_report(y_test, y_pred))
```

## Model Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PIPELINE                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  "I feel hopeless"  ──►  TF-IDF  ──►  Logistic  ──►  [1]   │
│                            Vectorizer    Regression          │
│                                                              │
│  • 5000 features max                                         │
│  • Unigrams (word-level)                                    │
│  • Term frequency weighting                                  │
│  • Inverse document frequency                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Actual Results

### Classification Report
```
              precision    recall  f1-score   support

           0       0.93      0.94      0.94     23092
           1       0.94      0.93      0.94     23311

    accuracy                           0.94     46403
   macro avg       0.94      0.94      0.94     46403
weighted avg       0.94      0.94      0.94     46403
```

### Confusion Matrix
```
              Predicted 0    Predicted 1
Actual 0         21,815         1,277
Actual 1          1,724        21,587
```

### Metric Definitions

| Metric | Formula | Meaning |
|--------|---------|---------|
| **Precision** | TP/(TP+FP) | Of predicted positive, how many are correct |
| **Recall** | TP/(TP+FN) | Of actual positive, how many were caught |
| **F1-Score** | 2×(P×R)/(P+R) | Harmonic mean of precision and recall |
| **Accuracy** | (TP+TN)/Total | Overall correctness |

### Performance Summary

| Class | Precision | Recall | F1-Score | Support |
|-------|-----------|--------|----------|---------|
| Non-Suicide (0) | 93% | 94% | 94% | 23,092 |
| Suicide (1) | 94% | 93% | 94% | 23,311 |
| **Overall** | - | - | **94%** | 46,403 |

### Prediction Breakdown
- **True Negatives**: 21,815 (correct non-suicide predictions)
- **False Positives**: 1,277 (non-suicide predicted as suicide) ⚠️
- **False Negatives**: 1,724 (suicide predicted as non-suicide) ⚠️⚠️
- **True Positives**: 21,587 (correct suicide predictions)

## Sample Predictions

```python
samples = [
    "I feel empty and tired of everything",
    "Life is meaningless, I don't see a point",
    "I want to end my life",
    "Today was a great day!"
]

vec = vectorizer.transform(samples)
print(model.predict(vec))  # Output: [1 1 1 0]
```

| Text | Prediction |
|------|------------|
| "I feel empty and tired of everything" | 1 (Suicide) |
| "Life is meaningless, I don't see a point" | 1 (Suicide) |
| "I want to end my life" | 1 (Suicide) |
| "Today was a great day!" | 0 (Non-Suicide) |

## Error Analysis

```python
errors = X_test[y_test != y_pred]
print(errors.head(10))
```

**Common Error Types**:
1. Metaphorical expressions ("I'm dying of boredom")
2. Ambiguous context ("thinking about..." vs "thinking about doing...")
3. Very short posts with insufficient signal

## Saved Artifacts

| File | Description | Size |
|------|-------------|------|
| `models/logistic_model.pkl` | Trained sklearn model | ~40KB |
| `models/tfidf_vectorizer.pkl` | Vocabulary + IDF weights | ~180KB |

## Loading and Using the Model

```python
import joblib

# Load
model = joblib.load("models/logistic_model.pkl")
vectorizer = joblib.load("models/tfidf_vectorizer.pkl")

# Predict
samples = ["I feel hopeless and alone"]
vec = vectorizer.transform(samples)
prediction = model.predict(vec)      # Returns [1] for suicide
probability = model.predict_proba(vec) # Returns [[prob_no, prob_yes]]
```

## Strengths

1. **High Accuracy**: 94% overall performance
2. **Fast Inference**: Milliseconds per prediction
3. **Interpretable**: Can examine coefficients
4. **Lightweight**: Works on modest hardware
5. **Probabilistic**: Provides confidence scores

## Limitations

1. **Binary Only**: Doesn't indicate severity
2. **No Context**: Misses situational factors
3. **Keyword Dependent**: May miss subtle indicators
4. **English Only**: No multilingual support

## Comparison with Other Notebooks

| Notebook | Task | Classes | Accuracy | Best For |
|----------|------|---------|----------|----------|
| `train.ipynb` | Binary classification | 2 | **94%** | Production screening |
| `risk_level_classifier.ipynb` | Multi-class | 5 | 85% | Triage systems |
| `sentiment_analysis.ipynb` | Sentiment + RF | 2 | 79% | Explainability |

## Use Cases

### 1. Automated Screening
- Process incoming posts in real-time
- Flag high-risk content for human review

### 2. Risk Monitoring
- Track sentiment and predictions over time
- Alert when risk patterns emerge

### 3. Resource Allocation
- Prioritize human review for positive predictions
- Reduce false positive burden

### 4. Research
- Analyze patterns in flagged content
- Study risk factors and correlations

## Production Deployment Options

### REST API (Flask/FastAPI)
```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    text = data.get('text', '')
    vec = vectorizer.transform([text])
    pred = model.predict(vec)[0]
    prob = model.predict_proba(vec)[0][1]
    return jsonify({'prediction': int(pred), 'probability': float(prob)})
```

### Batch Processing
```python
def batch_predict(texts):
    vectors = vectorizer.transform(texts)
    predictions = model.predict(vectors)
    probabilities = model.predict_proba(vectors)
    return predictions, probabilities
```

## Ethical Considerations

⚠️ **Important Warnings**:

1. **Not a Diagnosis**: Model is a screening aid, not clinical tool
2. **False Negatives**: May miss some high-risk cases (1,724 in test)
3. **Human Review**: Important cases should involve humans
4. **Bias**: May reflect biases in training data
5. **Privacy**: Handle mental health data responsibly
6. **Fallback**: Always have escalation paths

## Performance Benchmarks

| Operation | Speed |
|-----------|-------|
| Single prediction | ~10ms |
| Batch (1,000 texts) | ~2 seconds |
| Model loading | ~500ms |
