# Sentiment Analysis Module

## Overview
This notebook adds sentiment analysis features to the cleaned dataset using two popular NLP libraries: VADER and TextBlob.

## Purpose
Sentiment analysis quantifies the emotional tone of text. For suicide risk assessment, negative sentiment is a strong indicator of distress.

## Libraries Used

### VADER (Valence Aware Dictionary and sEntiment Reasoner)
- Designed for social media text
- Handles emojis, slang, and emphasis (CAPS)
- Returns compound score from -1 (most negative) to +1 (most positive)

### TextBlob
- Rule-based sentiment analysis
- Provides polarity (-1 to +1) and subjectivity (0 to 1)
- Good for general-purpose sentiment detection

## Input
- **Source**: `suicide-watch/suicide_watch_backup.csv`
- **Format**: Pre-cleaned text data with labels

## Sentiment Scores Explained

### VADER Scores
```python
scores = analyzer.polarity_scores(text)
# Returns:
# - neg: Proportion of negative sentiment (0-1)
# - neu: Proportion of neutral sentiment (0-1)
# - pos: Proportion of positive sentiment (0-1)
# - compound: Normalized weighted composite score (-1 to +1)
```

### TextBlob Scores
```python
blob = TextBlob(text)
# Returns:
# - polarity: -1 (negative) to +1 (positive)
# - subjectivity: 0 (objective) to 1 (subjective)
```

### Sentiment Categories
```python
def sentiment_category(compound):
    if compound >= 0.05:      return 'positive'
    elif compound <= -0.05:   return 'negative'
    else:                     return 'neutral'
```

## Key Findings from Analysis

### Overall Distribution
| Sentiment | Count | Percentage |
|-----------|-------|------------|
| Negative  | 128,347 | 55.3% |
| Positive  | 86,959 | 37.5% |
| Neutral   | 16,768 | 7.2% |

### By Label Comparison

**Suicide Posts (label=1)**:
- Mean Compound: **-0.440** (strongly negative)
- Mean Polarity: **-0.011**
- Negative %: **73.0%**

**Non-Suicide Posts (label=0)**:
- Mean Compound: **+0.089** (slightly positive)
- Mean Polarity: **+0.037**
- Positive %: **50.6%**

## Feature Importance
When used with Random Forest classifier, sentiment features achieve ~79% accuracy:

| Feature | Importance |
|---------|------------|
| `vader_compound` | Highest |
| `length` | High |
| `vader_neg` | Medium |
| `tb_polarity` | Medium |
| `vader_pos` | Low |
| `tb_subjectivity` | Low |
| `vader_neu` | Lowest |

## Applications

### 1. Risk Screening
- Posts with compound score < -0.5 are 3x more likely to be suicide-related
- Can trigger alerts for immediate review

### 2. Trend Monitoring
- Track sentiment changes over time
- Identify users showing declining sentiment

### 3. Feature for ML Models
- Sentiment scores become input features
- Improves classification accuracy when combined with TF-IDF

### 4. Explainability
- Clear, interpretable feature for stakeholders
- Non-technical users can understand sentiment scores

## Output
- **File**: `suicide-watch/suicide_watch_with_sentiment.csv`
- **New Columns**: 
  - `vader_neg`, `vader_neu`, `vader_pos`, `vader_compound`
  - `tb_polarity`, `tb_subjectivity`
  - `sentiment` (categorical)

## Visualization
The notebook generates:
- `sentiment_analysis.png`: Sentiment distribution charts
- `feature_importance.png`: Feature importance for classification

## Limitations

1. **Sarcasm/Irony**: Both VADER and TextBlob struggle with sarcasm
2. **Context**: Doesn't understand situational context
3. **Domain-specific**: Trained on general social media, not mental health specifically
4. **Imbalanced Data**: Negative sentiment alone doesn't guarantee suicide risk

## Next Steps
The sentiment-enriched dataset can be used for:
- Enhanced classification models
- Real-time risk monitoring
- Combined with demographic features for better insights
