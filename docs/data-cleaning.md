# Data Cleaning Pipeline

## Overview
This notebook handles the initial data cleaning and feature engineering for the suicide risk classification project.

## Purpose
Raw text data from social media posts contains noise, special characters, URLs, and inconsistencies that can degrade model performance. This pipeline cleans the data and creates meaningful features.

## Input
- **Source**: `suicide-watch/Suicide_Detection.csv`
- **Format**: CSV with columns `Unnamed: 0`, `text`, `class`

## Processes

### 1. Data Loading
```python
df = pd.read_csv("suicide-watch/Suicide_Detection.csv")
```
Loads the raw Kaggle dataset containing suicide-related posts.

### 2. Column Cleanup
```python
df = df.drop(columns=["Unnamed: 0"])
df = df.rename(columns={"text": "raw_text", "class": "label"})
```
- Removes index column
- Renames columns for clarity

### 3. Text Cleaning Function
```python
def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+", "", text)           # Remove URLs
    text = re.sub(r"(.)\1{2,}", r"\1", text)     # Remove repeated chars (e.g., "helllo" -> "hello")
    text = re.sub(r"[^a-z\s]", "", text)          # Remove special chars/numbers
    text = re.sub(r"\s+", " ", text).strip()      # Normalize whitespace
    return text
```
**Why**: Removes noise while preserving meaningful text content

### 4. Feature Engineering

#### Length Feature
```python
df["length"] = df["raw_text"].apply(len)
```
- Measures raw text length
- Suicide posts tend to be longer (more detailed)

#### Risk Score (Keyword-based)
```python
keywords = ["kill myself", "end my life", "suicide", "hopeless"]
def keyword_score(text):
    return sum(1 for k in keywords if k in text)
df["risk_score"] = df["clean_text"].apply(keyword_score)
```
- Simple heuristic for risk indication
- Used as additional feature for classification

#### Pronoun Count
```python
def pronoun_count(text):
    return text.split().count("i")
df["pronoun_count"] = df["clean_text"].apply(pronoun_count)
```
- Counts first-person singular pronouns
- Research shows correlation between "I" usage and distress

### 5. Label Encoding
```python
df["label"] = df["label"].map({
    "non-suicide": 0,
    "suicide": 1
})
```
Converts string labels to binary integers for ML models.

### 6. Dataset Export
```python
df_final.to_csv("suicide-watch/suicide_watch_cleaned.csv", index=False)
```

## Output
- **File**: `suicide-watch/suicide_watch_cleaned.csv`
- **Columns**: `clean_text`, `label`, `length`, `risk_score`, `pronoun_count`

## Features Explained

| Feature | Type | Description | Use Case |
|---------|------|-------------|----------|
| `clean_text` | String | Preprocessed text | Main input for TF-IDF vectorization |
| `label` | Integer | 0=non-suicide, 1=suicide | Target variable for classification |
| `length` | Integer | Character count of raw text | Feature for classification models |
| `risk_score` | Integer | Count of high-risk keywords | Indicator of potential risk level |
| `pronoun_count` | Integer | Count of "I" occurrences | Psychological indicator |

## Statistical Insights

### Class Balance
- `suicide`: 116,037 posts
- `non-suicide`: 116,037 posts
- **Result**: Perfectly balanced dataset (50/50 split)

### Text Length Analysis
- Suicide posts: ~1050 characters (average)
- Non-suicide posts: ~329 characters (average)
- **Insight**: Suicide posts tend to be ~3x longer

## Why This Matters

1. **Model Performance**: Clean data = better feature extraction = higher accuracy
2. **Interpretability**: Engineered features provide insights beyond raw text
3. **Bias Reduction**: Consistent preprocessing reduces spurious patterns
4. **Reproducibility**: Documented pipeline ensures consistent results

## Backup Strategy
Before modifying data, create a backup:
```bash
cp suicide-watch/suicide_watch_cleaned.csv suicide-watch/suicide_watch_backup.csv
```

## Next Steps
This cleaned dataset feeds into:
- `sentiment_analysis.ipynb` - Adds sentiment features
- `train.ipynb` - Trains the classification model
- `risk_level_classifier.ipynb` - Creates multi-class risk levels
