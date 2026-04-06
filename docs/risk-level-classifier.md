# Risk Level Multi-Class Classification

## Overview
This Jupyter notebook (`risk_level_classifier.ipynb`) extends binary classification (suicide/non-suicide) to **5-class risk level classification** for more nuanced risk assessment.

## Purpose
Binary classification (yes/no) is too simplistic for clinical use. Multi-class risk levels provide:

1. **Triage**: Prioritize urgent cases over lower-risk ones
2. **Intervention Matching**: Different responses for different severity levels
3. **Monitoring**: Track risk level changes over time
4. **Explainability**: Clear communication to stakeholders
5. **Resource Allocation**: Focus resources on highest-risk cases

## Input
- **Source File**: `suicide-watch/suicide_watch_backup.csv`
- **Dataset Size**: 232,074 rows

## Risk Level Definitions

| Level | Label | Score Range | Description | Example |
|-------|-------|-------------|-------------|---------|
| 0 | **MINIMAL** | None | No risk indicators | "Had a great day!" |
| 1 | **LOW** | 1+ low | Mild distress | "Feeling down", "stressed" |
| 2 | **MID** | 2+ mid | Moderate risk | "Hopeless", "worthless", "crying" |
| 3 | **HIGH** | 1+ high | High risk | "Want to die", "suicide" |
| 4 | **STRONG** | 2+ high OR high+mid | Critical | "Plan to kill myself" |

## Code Implementation

### Step 1: Define Risk Keywords

```python
high_risk_keywords = [
    'kill myself', 'end my life', 'want to die', 'going to kill',
    'suicide', 'hang myself', 'shoot myself', 'jump off',
    'overdose', 'pills', 'no reason to live', 'better off dead'
]

mid_risk_keywords = [
    'hopeless', 'worthless', 'burden', 'empty', 'crying',
    'give up', 'tired of life', 'nothing matters', 'cutting',
    'hate myself', 'hate my life', 'feel like dying'
]

low_risk_keywords = [
    'depressed', 'sad', 'lonely', 'anxious', 'stressed',
    'overwhelmed', 'exhausted', 'struggling', 'hard to cope',
    'not okay', 'down', 'unhappy'
]
```

### Step 2: Classification Logic

```python
def classify_risk(text):
    text = str(text).lower()
    
    high_score = sum(1 for kw in high_risk_keywords if kw in text)
    mid_score = sum(1 for kw in mid_risk_keywords if kw in text)
    low_score = sum(1 for kw in low_risk_keywords if kw in text)
    
    if high_score >= 2 or (high_score >= 1 and mid_score >= 1):
        return 'strong'    # Critical
    elif high_score >= 1:
        return 'high'      # High risk
    elif mid_score >= 2:
        return 'mid'       # Moderate
    elif mid_score >= 1 or low_score >= 2:
        return 'low'       # Mild distress
    else:
        return 'minimal'   # No indicators
```

### Step 3: Apply Classification

```python
df['risk_level'] = df['clean_text'].apply(classify_risk)
```

### Step 4: Create Numeric Labels

```python
risk_mapping = {'minimal': 0, 'low': 1, 'mid': 2, 'high': 3, 'strong': 4}
df['risk_label'] = df['risk_level'].map(risk_mapping)
```

### Step 5: Train ML Models

```python
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Vectorize with bigrams
vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)
```

## Actual Results from Notebook

### Risk Level Distribution (ACTUAL)
| Risk Level | Count | Percentage |
|-----------|-------|------------|
| minimal | 157,264 | 67.8% |
| high | 29,765 | 12.8% |
| strong | 25,656 | 11.1% |
| low | 17,236 | 7.4% |
| mid | 2,153 | 0.9% |

**Note**: The "mid" class is severely underrepresented - a limitation.

### Training Results

**Train/Test Split**:
- Training: 185,659 samples
- Test: 46,415 samples

### Logistic Regression Performance

```
=== LOGISTIC REGRESSION ===
              precision    recall  f1-score   support

     minimal       0.98      0.89      0.94     31453
         low       0.50      0.76      0.60      3447
         mid       0.26      0.62      0.37       431
        high       0.69      0.77      0.73      5953
      strong       0.79      0.74      0.76      5131

    accuracy                           0.85     46415
   macro avg       0.64      0.76      0.68     46415
weighted avg       0.88      0.85      0.86     46415
```

### Random Forest Performance

```
=== RANDOM FOREST ===
              precision    recall  f1-score   support

     minimal       0.88      0.99      0.93     31453
         low       0.66      0.17      0.27      3447
         mid       1.00      0.00      0.01       431
        high       0.78      0.60      0.68      5953
      strong       0.73      0.74      0.73      5131

    accuracy                           0.84     46415
   macro avg       0.81      0.50      0.52     46415
```

### Model Comparison

| Model | Accuracy | Best For |
|-------|----------|----------|
| Logistic Regression | **85%** | Balanced, production use |
| Random Forest | **84%** | High precision on critical cases |

**Logistic Regression** is recommended due to:
- Higher overall accuracy (85% vs 84%)
- Better macro F1-score (0.68 vs 0.52)
- More balanced predictions across classes

### Sample Predictions (ACTUAL)

| Text | Predicted Risk |
|------|---------------|
| "Today was a good day at work!" | minimal |
| "Feeling a bit down lately, not sure why" | minimal |
| "Been struggling with depression and feeling worthless" | low |
| "I think about ending my life sometimes" | minimal |
| "I want to kill myself, I have a plan" | **high** |

## Saved Artifacts

| File | Description |
|------|-------------|
| `models/risk_level_classifier.pkl` | Trained Random Forest model |
| `models/risk_vectorizer.pkl` | TF-IDF vectorizer |
| `suicide-watch/suicide_watch_with_risk_levels.csv` | Dataset with risk levels |

## New Columns Added

| Column | Type | Description |
|--------|------|-------------|
| `risk_level` | string | Category: minimal/low/mid/high/strong |
| `risk_label` | int | Numeric: 0/1/2/3/4 |

## Application in Triage Systems

```
STRONG (4) ──────────────────→ EMERGENCY: Immediate response
         ──────────────────→ Police/welfare check within 1 hour

HIGH (3) ───────────────────→ URGENT: Intervention within 24 hours
         ───────────────────→ Crisis hotline callback within 4 hours

MID (2) ──────────────────────→ SCREENING: Professional review in 48-72 hours
         ────────────────────→ Schedule assessment appointment

LOW (1) ─────────────────────→ MONITOR: Follow-up within 1 week
         ──────────────────────→ Automated check-in message

MINIMAL (0) ─────────────────→ ROUTINE: Standard response
         ──────────────────────→ Resource library access
```

## Visualizations Generated

1. `risk_distribution.png` - Bar chart of risk level counts
2. `risk_confusion_matrix.png` - Heatmap of predictions vs actual

## Limitations

1. **Class Imbalance**: Mid class has only 2,153 samples (0.9%)
2. **Keyword Dependency**: May miss subtle indicators
3. **No Context**: Cannot understand situational factors
4. **Self-Report Bias**: Based on what users choose to share
5. **Binary Assumption**: Dataset was originally binary, so risk levels are inferred

## Why Multi-Class Matters Over Binary

| Aspect | Binary (Yes/No) | Multi-Class (5 Levels) |
|--------|-----------------|------------------------|
| Triage | Limited | Precise prioritization |
| Response | One-size-fits-all | Level-appropriate |
| Monitoring | Can't track changes | Can track escalation |
| Explainability | "At risk" or not | "Critical" vs "mild" |
| Resources | May be misused | Better allocation |

## Comparison with Binary Classification

| Aspect | Binary (`train.ipynb`) | Multi-Class (`risk_level_classifier.ipynb`) |
|--------|------------------------|---------------------------------------------|
| Classes | 2 | 5 |
| Accuracy | 94% | 85% |
| Use Case | Screening | Triage & intervention |
| Output | Yes/No | Minimal/Low/Mid/High/Strong |

## Improvements for Production

1. **Data Augmentation**: Generate more MID-class examples
2. **Deep Learning**: Use BERT/RoBERTa for better context understanding
3. **Ensemble Methods**: Combine multiple models
4. **Active Learning**: Human-in-the-loop for edge cases
5. **Temporal Features**: Add time-based risk progression
