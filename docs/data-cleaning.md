# Data Cleaning Pipeline

## Overview
This Jupyter notebook (`data-cleaning.ipynb`) handles the initial data preprocessing and feature engineering for the suicide risk classification project.

## Purpose
Raw text data from social media posts contains noise, special characters, URLs, and inconsistencies that can degrade model performance. This pipeline cleans the data and creates meaningful features.

## Input
- **Source File**: `suicide-watch/Suicide_Detection.csv`
- **Original Format**: CSV with 3 columns (`Unnamed: 0`, `text`, `class`)
- **Total Rows**: 232,074 (perfectly balanced: 116,037 each class)

## Step-by-Step Process

### Step 1: Load Data
```python
df = pd.read_csv("suicide-watch/Suicide_Detection.csv")
```
Loads the raw Kaggle dataset containing suicide-related posts.

### Step 2: Clean Column Names
```python
df = df.drop(columns=["Unnamed: 0"])
df = df.rename(columns={"text": "raw_text", "class": "label"})
```
- Removes the unnecessary index column
- Renames columns for clarity

### Step 3: Analyze Class Balance
```python
print(df["label"].value_counts())
```
**Result**:
- suicide: 116,037 posts
- non-suicide: 116,037 posts
- **Perfect 50/50 split**

### Step 4: Text Length Analysis
```python
df["length"] = df["raw_text"].apply(len)
df.groupby("label")["length"].mean()
```
**Result**:
- Suicide posts: ~1050 characters (average)
- Non-suicide posts: ~329 characters (average)
- **Insight**: Suicide posts are ~3x longer

### Step 5: Text Cleaning Function
```python
def clean_text(text):
    text = text.lower()                                    # Convert to lowercase
    text = re.sub(r"http\S+", "", text)                   # Remove URLs
    text = re.sub(r"(.)\1{2,}", r"\1", text)             # Remove repeated chars
    text = re.sub(r"[^a-z\s]", "", text)                  # Keep only letters
    text = re.sub(r"\s+", " ", text).strip()              # Normalize whitespace
    return text

df["clean_text"] = df["raw_text"].apply(clean_text)
```

### Step 6: Risk Score (Keyword Feature)
```python
keywords = ["kill myself", "end my life", "suicide", "hopeless"]

def keyword_score(text):
    return sum(1 for k in keywords if k in text)

df["risk_score"] = df["clean_text"].apply(keyword_score)
```
Simple heuristic that counts high-risk keyword occurrences.

### Step 7: Pronoun Count Feature
```python
def pronoun_count(text):
    return text.split().count("i")

df["pronoun_count"] = df["clean_text"].apply(pronoun_count)
```
Counts first-person singular pronouns ("I").

### Step 8: Select Final Columns
```python
df_final = df[["clean_text", "label", "length", "risk_score", "pronoun_count"]]
```

### Step 9: Encode Labels
```python
df_final["label"] = df_final["label"].map({
    "non-suicide": 0,
    "suicide": 1
})
```

### Step 10: Save Cleaned Data
```python
df_final.to_csv("suicide-watch/suicide_watch_cleaned.csv", index=False)
```

## Output Files

| File | Description |
|------|-------------|
| `suicide-watch/suicide_watch_cleaned.csv` | Cleaned dataset |
| `suicide-watch/suicide_watch_backup.csv` | Backup created before modifications |

## Final Dataset Schema

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `clean_text` | string | Preprocessed text | "i feel hopeless today" |
| `label` | int | 0=non-suicide, 1=suicide | 1 |
| `length` | int | Character count | 1050 |
| `risk_score` | int | High-risk keyword count | 2 |
| `pronoun_count` | int | Number of "I" occurrences | 8 |

## Why This Matters

1. **Model Performance**: Clean data produces better feature extraction
2. **Consistency**: All text follows the same preprocessing rules
3. **Feature Engineering**: Engineered features provide additional signals
4. **Reproducibility**: Documented pipeline ensures consistent results

## Statistical Insights

| Metric | Suicide | Non-Suicide |
|--------|---------|--------------|
| Count | 116,037 | 116,037 |
| Avg Length | 1050 chars | 329 chars |
| Ratio | 3.2x longer | baseline |

## Usage in Pipeline
This cleaned dataset is the foundation for all subsequent analysis:
- `train.ipynb` - Binary classification training
- `sentiment_analysis.ipynb` - Adds sentiment features
- `risk_level_classifier.ipynb` - Creates multi-class risk levels
- `demographic_analysis.ipynb` - Extracts demographics

## Backup Strategy
Before any modifications, create a backup:
```bash
cp suicide-watch/suicide_watch_cleaned.csv suicide-watch/suicide_watch_backup.csv
```
