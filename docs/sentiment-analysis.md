# Sentiment Analysis Module

## Overview
This Jupyter notebook (`sentiment_analysis.ipynb`) adds sentiment analysis features to the cleaned dataset using two NLP libraries: VADER and TextBlob.

## Purpose
Sentiment analysis quantifies the emotional tone of text. For suicide risk assessment:
- **Negative sentiment** correlates with distress
- **Positive sentiment** correlates with non-crisis posts
- Provides interpretable features for classification

## Libraries Used

### 1. VADER (Valence Aware Dictionary and sEntiment Reasoner)
- Optimized for social media text
- Handles emojis, slang, and emphasis (CAPS)
- Does NOT require training data

### 2. TextBlob
- Rule-based sentiment analysis
- Provides polarity and subjectivity scores

## Input
- **Source File**: `suicide-watch/suicide_watch_backup.csv`
- **Format**: Pre-cleaned text with labels
- **Dataset Size**: 232,074 rows

## Code Implementation

### Step 1: Initialize VADER Analyzer
```python
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()

def get_vader_scores(text):
    if pd.isna(text) or text == '':
        return 0, 0, 0, 0
    scores = analyzer.polarity_scores(str(text))
    return scores['neg'], scores['neu'], scores['pos'], scores['compound']
```

### Step 2: Apply VADER to All Posts
```python
df[['vader_neg', 'vader_neu', 'vader_pos', 'vader_compound']] = df['clean_text'].apply(
    lambda x: pd.Series(get_vader_scores(x))
)
```

### Step 3: Apply TextBlob
```python
from textblob import TextBlob

def get_textblob_scores(text):
    if pd.isna(text) or text == '':
        return 0, 0
    blob = TextBlob(str(text))
    return blob.sentiment.polarity, blob.sentiment.subjectivity

df[['tb_polarity', 'tb_subjectivity']] = df['clean_text'].apply(
    lambda x: pd.Series(get_textblob_scores(x))
)
```

### Step 4: Categorize Sentiment
```python
def sentiment_category(compound):
    if compound >= 0.05:
        return 'positive'
    elif compound <= -0.05:
        return 'negative'
    else:
        return 'neutral'

df['sentiment'] = df['vader_compound'].apply(sentiment_category)
```

### Step 5: Train Classifier with Sentiment Features
```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

features = ['vader_neg', 'vader_neu', 'vader_pos', 'vader_compound', 
            'tb_polarity', 'tb_subjectivity', 'length']

X = df[features].fillna(0)
y = df['label']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

rf_model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
rf_model.fit(X_train, y_train)
```

## VADER Score Meanings

| Score | Range | Meaning |
|-------|-------|---------|
| `neg` | 0-1 | Proportion of negative sentiment |
| `neu` | 0-1 | Proportion of neutral sentiment |
| `pos` | 0-1 | Proportion of positive sentiment |
| `compound` | -1 to +1 | Normalized weighted score |

## TextBlob Score Meanings

| Score | Range | Meaning |
|-------|-------|---------|
| `polarity` | -1 to +1 | Negative to positive |
| `subjectivity` | 0 to 1 | Objective to subjective |

## Key Findings from Actual Analysis

### Overall Sentiment Distribution
| Sentiment | Count | Percentage |
|-----------|-------|------------|
| Negative | 128,347 | 55.3% |
| Positive | 86,959 | 37.5% |
| Neutral | 16,768 | 7.2% |

### Sentiment by Label (ACTUAL RESULTS)

**Suicide Posts (label=1)**:
- Mean Compound: **-0.440** (strongly negative)
- Mean Polarity (TB): **-0.011**
- Negative %: **73.0%**

**Non-Suicide Posts (label=0)**:
- Mean Compound: **+0.089** (slightly positive)
- Mean Polarity (TB): **+0.037**
- Positive %: **50.6%**

### Sentiment-Based Classification Performance
Using only sentiment features + length:
```
              precision    recall  f1-score   support

           0       0.78      0.81      0.79     23287
           1       0.80      0.77      0.78     23128

    accuracy                           0.79     46415
```

**Accuracy: 79%** using sentiment features alone!

## Feature Importance (Random Forest)
| Feature | Importance |
|---------|------------|
| `vader_compound` | Highest |
| `length` | High |
| `vader_neg` | Medium |
| `tb_polarity` | Medium |
| `tb_subjectivity` | Low |
| `vader_pos` | Low |
| `vader_neu` | Lowest |

## Output Files
- `suicide-watch/suicide_watch_with_sentiment.csv` - Dataset with sentiment features
- `sentiment_analysis.png` - Visualization of sentiment distributions
- `feature_importance.png` - Feature importance chart

## New Columns Added

| Column | Type | Description |
|--------|------|-------------|
| `vader_neg` | float | VADER negative score (0-1) |
| `vader_neu` | float | VADER neutral score (0-1) |
| `vader_pos` | float | VADER positive score (0-1) |
| `vader_compound` | float | VADER composite score (-1 to +1) |
| `tb_polarity` | float | TextBlob polarity (-1 to +1) |
| `tb_subjectivity` | float | TextBlob subjectivity (0 to 1) |
| `sentiment` | string | Categorical: positive/negative/neutral |

## Applications

### 1. Risk Screening
- Posts with compound score < -0.5 are much more likely to be suicide-related
- Can trigger automated alerts

### 2. Trend Monitoring
- Track sentiment changes over time for individual users
- Identify declining sentiment patterns

### 3. Feature Engineering
- Sentiment scores become input features for other models
- Improves classification when combined with TF-IDF

### 4. Explainability
- Clear, interpretable feature for non-technical stakeholders
- Easy to understand sentiment scores without ML knowledge

## Limitations

1. **Sarcasm/Irony**: Both VADER and TextBlob struggle with sarcasm
2. **Context Blindness**: Cannot understand situational context
3. **Domain Gap**: Trained on general social media, not mental health specifically
4. **Cultural Differences**: May not capture cultural variations in expression

## Next Steps
The sentiment-enriched dataset feeds into:
- `risk_level_classifier.ipynb` - Combines with keyword scoring
- Enhanced binary classification in `train.ipynb`
