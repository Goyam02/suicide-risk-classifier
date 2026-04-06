# Suicide Risk Classification Model Training

## Overview
This notebook trains the primary binary classification model (Logistic Regression with TF-IDF) for suicide risk detection.

## Purpose
Build a production-ready classifier that:
1. Predicts suicide vs non-suicide posts
2. Achieves high accuracy for screening
3. Provides interpretable results
4. Saves model for deployment

## Model Architecture

### Pipeline
```
Text → TF-IDF Vectorization → Logistic Regression → Prediction
```

### TF-IDF Vectorizer
```python
TfidfVectorizer(max_features=5000)
```

**TF-IDF** (Term Frequency-Inverse Document Frequency):
- Measures word importance relative to corpus
- Downweights common words ("the", "is")
- Upweights distinctive words

**Parameters**:
- `max_features=5000`: Limit vocabulary to top 5000 terms
- Default n-gram range: (1, 1) - unigrams only

### Logistic Regression
```python
LogisticRegression(
    max_iter=1000,
    class_weight='balanced',
    random_state=42
)
```

**Why Logistic Regression?**
- Fast training and prediction
- Interpretable coefficients
- Works well with TF-IDF features
- `class_weight='balanced'` handles any class imbalance

## Input
- **Source**: `suicide-watch/suicide_watch_cleaned.csv`
- **Format**: Cleaned text with binary labels (0/1)

## Training Process

### 1. Train-Test Split
```python
X_train, X_test, y_train, y_test = train_test_split(
    df["clean_text"],
    df["label"],
    test_size=0.2,      # 80/20 split
    random_state=42     # Reproducibility
)
```

**Result**:
- Training: 185,659 samples
- Test: 46,403 samples

### 2. Vectorization
```python
vectorizer = TfidfVectorizer(max_features=5000)
X_train_vec = vectorizer.fit_transform(X_train)   # Fit on train only
X_test_vec = vectorizer.transform(X_test)           # Transform test
```

**Important**: Fit only on training data to prevent data leakage.

### 3. Model Training
```python
model = LogisticRegression(max_iter=1000, class_weight='balanced', random_state=42)
model.fit(X_train_vec, y_train)
```

### 4. Evaluation
```python
y_pred = model.predict(X_test_vec)
```

## Performance Metrics

### Classification Report
```
              precision    recall  f1-score   support

           0       0.93      0.94      0.94     23092
           1       0.94      0.93      0.94     23311

    accuracy                           0.94     46403
   macro avg       0.94      0.94      0.94     46403
```

**Interpretation**:
- **Precision 93-94%**: Low false positive rate
- **Recall 93-94%**: Catches most suicide posts
- **F1-Score 94%**: Balanced precision/recall
- **Accuracy 94%**: Overall correct predictions

### Confusion Matrix
```
              Predicted 0    Predicted 1
Actual 0         21,815         1,277
Actual 1          1,724        21,587
```

**Breakdown**:
- True Negatives: 21,815 (correct non-suicide)
- False Positives: 1,277 (non-suicide predicted as suicide)
- False Negatives: 1,724 (suicide predicted as non-suicide) ⚠️
- True Positives: 21,587 (correct suicide)

**Note**: False negatives are more concerning in this domain (missed risk).

## Sample Predictions

```python
samples = [
    "I feel empty and tired of everything",      # → 1 (suicide)
    "Life is meaningless, I don't see a point", # → 1 (suicide)
    "I want to end my life",                     # → 1 (suicide)
    "Today was a great day!"                     # → 0 (non-suicide)
]
```

## Saved Artifacts

### Model File
```python
joblib.dump(model, "models/logistic_model.pkl")
```
- Serialized sklearn model
- ~40KB in size

### Vectorizer File
```python
joblib.dump(vectorizer, "models/tfidf_vectorizer.pkl")
```
- Vocabulary and IDF weights
- ~180KB in size

## Loading and Using the Model

```python
import joblib

# Load
model = joblib.load("models/logistic_model.pkl")
vectorizer = joblib.load("models/tfidf_vectorizer.pkl")

# Predict
samples = ["I feel hopeless"]
vec = vectorizer.transform(samples)
prediction = model.predict(vec)  # Returns [1] for suicide
```

## Error Analysis

The notebook includes analysis of misclassified samples:
```python
errors = X_test[y_test != y_pred]
print(errors.head(10))
```

**Common Errors**:
1. Metaphorical expressions ("I'm dying of boredom")
2. Ambiguous context ("thinking about..." vs "thinking about doing...")
3. Very short posts with insufficient signal

## Strengths

1. **High Accuracy**: 94% overall performance
2. **Fast**: Inference in milliseconds
3. **Interpretable**: Can examine coefficients
4. **Lightweight**: Works on modest hardware

## Limitations

1. **Binary Only**: Doesn't indicate severity
2. **No Context**: Misses situational factors
3. **Keyword Dependent**: May miss subtle indicators
4. **English Only**: No multilingual support

## Comparison with Other Notebooks

| Notebook | Task | Classes | Accuracy |
|----------|------|---------|----------|
| `train.ipynb` | Binary classification | 2 | 94% |
| `risk_level_classifier.ipynb` | Multi-class | 5 | ~80% |
| `sentiment_analysis.ipynb` | Sentiment + Classification | 2 | 79% |

## Production Deployment

This model can be deployed as:
1. **REST API**: Flask/FastAPI endpoint
2. **Batch Processing**: Process saved posts
3. **Real-time**: Monitor streaming data
4. **Integration**: Embed in existing systems

## Ethical Considerations

1. **Not a Diagnosis**: Model is screening tool, not clinical tool
2. **Human Review**: Important cases should involve humans
3. **Bias**: May reflect biases in training data
4. **Privacy**: Handle data responsibly
5. **Fallback**: Have escalation paths for edge cases
