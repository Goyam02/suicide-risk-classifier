# Risk Level Classification Module

## Overview
This notebook extends binary classification (suicide/non-suicide) to multi-class risk level classification with 5 distinct levels.

## Purpose
Binary classification is limited for clinical use. Risk levels provide:
1. **Triage**: Prioritize urgent cases
2. **Intervention**: Match response to risk level
3. **Monitoring**: Track changes over time
4. **Explainability**: Clear communication to stakeholders

## Risk Level Definitions

| Level | Label | Score | Description | Examples |
|-------|-------|-------|-------------|----------|
| 0 | **Minimal** | - | No risk indicators | "Had a great day!" |
| 1 | **Low** | 1 | Mild distress | "Feeling down", "stressed" |
| 2 | **Mid** | 2 | Moderate risk | "Hopeless", "worthless", "crying" |
| 3 | **High** | 3 | High risk | "Want to die", "suicide" |
| 4 | **Strong** | 4 | Critical | "Plan to kill myself" |

## Keyword-Based Classification

### High Risk Keywords
```python
high_risk_keywords = [
    'kill myself', 'end my life', 'want to die', 'going to kill',
    'suicide', 'hang myself', 'shoot myself', 'jump off',
    'overdose', 'pills', 'no reason to live', 'better off dead'
]
```

### Mid Risk Keywords
```python
mid_risk_keywords = [
    'hopeless', 'worthless', 'burden', 'empty', 'crying',
    'give up', 'tired of life', 'nothing matters', 'cutting',
    'hate myself', 'hate my life', 'feel like dying'
]
```

### Low Risk Keywords
```python
low_risk_keywords = [
    'depressed', 'sad', 'lonely', 'anxious', 'stressed',
    'overwhelmed', 'exhausted', 'struggling', 'hard to cope',
    'not okay', 'down', 'unhappy'
]
```

### Classification Logic
```python
def classify_risk(text):
    high_score = sum(1 for kw in high_risk_keywords if kw in text)
    mid_score = sum(1 for kw in mid_risk_keywords if kw in text)
    low_score = sum(1 for kw in low_risk_keywords if kw in text)
    
    if high_score >= 2 or (high_score >= 1 and mid_score >= 1):
        return 'strong'
    elif high_score >= 1:
        return 'high'
    elif mid_score >= 2:
        return 'mid'
    elif mid_score >= 1 or low_score >= 2:
        return 'low'
    else:
        return 'minimal'
```

## Distribution in Dataset

| Risk Level | Count | Percentage |
|-----------|-------|------------|
| Minimal | 157,264 | 67.8% |
| High | 29,765 | 12.8% |
| Strong | 25,656 | 11.1% |
| Low | 17,236 | 7.4% |
| Mid | 2,153 | 0.9% |

**Note**: The "Mid" class is underrepresented - may need data augmentation.

## Model Training

### Features
- **TF-IDF Vectorization**: 
  - Max features: 5,000
  - N-grams: (1, 2) - unigrams and bigrams
  - Captures word frequency and word pairs

### Models Compared

#### Logistic Regression
```python
LogisticRegression(
    max_iter=1000,
    random_state=42,
    class_weight='balanced',
    solver='lbfgs'
)
```

#### Random Forest
```python
RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    n_jobs=-1,
    class_weight='balanced'
)
```

### Performance Metrics
Expected results for Random Forest (best performer):

| Class | Precision | Recall | F1-Score | Support |
|-------|-----------|--------|----------|---------|
| minimal | ~0.85 | ~0.90 | ~0.87 | ~31K |
| low | ~0.65 | ~0.55 | ~0.60 | ~3.4K |
| mid | ~0.40 | ~0.30 | ~0.35 | ~430 |
| high | ~0.72 | ~0.68 | ~0.70 | ~6K |
| strong | ~0.78 | ~0.75 | ~0.76 | ~5.1K |

**Overall Accuracy**: ~80%

## Applications

### 1. Triage System
```
STRONG/HIGH → Immediate intervention (24hr response)
MID → Urgent screening (48-72hr)
LOW → Monitor (1 week follow-up)
MINIMAL → Standard check-in
```

### 2. Resource Allocation
- Focus hotline resources on HIGH/STRONG cases
- Automated messages for LOW/MINIMAL
- Human review for MID

### 3. Longitudinal Monitoring
- Track risk level changes over time
- Alert when user escalates to higher level
- Identify patterns in risk trajectories

### 4. Clinical Decision Support
- Supplement (not replace) clinical judgment
- Flag posts for human review
- Document risk trends

## Sample Predictions

| Text | Predicted Risk |
|------|---------------|
| "Today was a good day at work!" | Minimal |
| "Feeling a bit down lately" | Low |
| "Been struggling, feeling worthless" | Mid |
| "I think about ending my life sometimes" | High |
| "I want to kill myself, I have a plan" | Strong |

## Output Files
- **Model**: `models/risk_level_classifier.pkl`
- **Vectorizer**: `models/risk_vectorizer.pkl`
- **Dataset**: `suicide-watch/suicide_watch_with_risk_levels.csv`

## Visualization
- `risk_distribution.png`: Class distribution bar chart
- `risk_confusion_matrix.png`: Confusion matrix heatmap

## Limitations

1. **Keyword Dependency**: Misses subtle indicators
2. **Class Imbalance**: Mid class severely underrepresented
3. **No Context**: Doesn't understand situational factors
4. **Self-Report Bias**: Based on what users choose to share

## Improvements for Production

1. **Data Augmentation**: Generate more MID-class examples
2. **Deep Learning**: Use BERT/RoBERTa for better context
3. **Ensemble Methods**: Combine multiple models
4. **Active Learning**: Human-in-the-loop for edge cases
5. **Temporal Features**: Add time-based risk progression
