# Suicide Risk Classification Project

## Project Overview

This project develops machine learning models to classify suicide risk from text data (social media posts). It uses Natural Language Processing (NLP) techniques to predict risk levels for mental health screening and intervention.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PROJECT PIPELINE                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐    ┌────────────────┐    ┌────────────────────────┐  │
│  │   Kaggle     │    │  Data Cleaning │    │   Feature Engineering   │  │
│  │   Dataset    │───▶│  Pipeline      │───▶│   (length, keywords,    │  │
│  │  (232K rows) │    │                │    │    pronoun count)        │  │
│  └──────────────┘    └────────────────┘    └────────────────────────┘  │
│                                                     │                   │
│         ┌───────────────────────────────────────────┼───────────────┐   │
│         │                                           │               │   │
│         ▼                                           ▼               ▼   │
│  ┌─────────────────┐              ┌────────────────────────────────┐  │
│  │ Sentiment        │              │ Risk Level Multi-Class          │  │
│  │ Analysis         │              │ Classification (5 levels)      │  │
│  │ (VADER/TextBlob) │              │ minimal/low/mid/high/strong     │  │
│  │ 79% accuracy     │              │ 85% accuracy                   │  │
│  └─────────────────┘              └────────────────────────────────┘  │
│         │                                           │                   │
│         │                                           │                   │
│         └─────────────────────┬─────────────────────┘                   │
│                               ▼                                          │
│                    ┌─────────────────────┐                              │
│                    │ Binary Classification │                              │
│                    │ (Suicide/Non-Suicide) │                              │
│                    │    94% accuracy       │                              │
│                    └─────────────────────┘                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
suicide-risk/
├── docs/                                   # Documentation
│   ├── README.md                          # This file - Project overview
│   ├── data-cleaning.md                   # Data preprocessing pipeline
│   ├── sentiment-analysis.md              # Sentiment feature extraction
│   ├── demographic-analysis.md             # Demographics extraction
│   ├── risk-level-classifier.md           # Multi-class risk levels (5 levels)
│   ├── train-model.md                     # Binary classification model
│   ├── download-dataset.md                # Dataset acquisition
│   └── model-usage.md                     # API & usage examples
│
├── suicide-watch/                         # Dataset folder
│   ├── Suicide_Detection.csv              # Original raw data (~167MB)
│   ├── suicide_watch_cleaned.csv          # Cleaned data
│   ├── suicide_watch_backup.csv           # Backup before modifications
│   ├── suicide_watch_with_sentiment.csv   # + Sentiment features
│   ├── suicide_watch_with_demographics.csv # + Demographics
│   └── suicide_watch_with_risk_levels.csv # + Risk levels
│
├── models/                                # Trained models (pickle files)
│   ├── logistic_model.pkl                 # Binary classifier (94% accuracy)
│   ├── tfidf_vectorizer.pkl              # TF-IDF for binary model
│   ├── risk_level_classifier.pkl          # Multi-class classifier (85% accuracy)
│   └── risk_vectorizer.pkl               # TF-IDF for risk model
│
├── venv/                                  # Python virtual environment
│
├── data-cleaning.ipynb                   # Step 1: Data preprocessing
├── sentiment_analysis.ipynb               # Step 2: Sentiment analysis
├── demographic_analysis.ipynb            # Step 3: Demographics extraction
├── risk_level_classifier.ipynb           # Step 4: Multi-class risk levels
├── train.ipynb                           # Step 5: Binary classification
├── download_dataset.py                   # Dataset downloader
├── requirements.txt                      # Python dependencies
└── README.md                             # This file
```

## Quick Start

### 1. Setup Environment
```bash
# Create virtual environment
python -m venv venv

# Activate
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt
```

### 2. Download Dataset
```bash
python download_dataset.py
```

### 3. Run Notebooks in Order
```bash
jupyter notebook
```

**Recommended Execution Order**:
1. `data-cleaning.ipynb` - Clean and prepare data
2. `sentiment_analysis.ipynb` - Add sentiment features
3. `demographic_analysis.ipynb` - Extract demographics
4. `risk_level_classifier.ipynb` - Create 5-level risk classification
5. `train.ipynb` - Train binary classifier

## What Each Notebook Does

### 1. data-cleaning.ipynb
**Purpose**: Clean raw text and engineer features

**What it does**:
- Loads raw CSV from Kaggle
- Removes URLs, special characters
- Creates features: length, risk_score, pronoun_count
- Outputs: `suicide_watch_cleaned.csv`

### 2. sentiment_analysis.ipynb
**Purpose**: Add emotional tone features

**What it does**:
- Applies VADER sentiment analysis
- Applies TextBlob sentiment analysis
- Creates 6 new features per post
- Trains Random Forest with 79% accuracy
- Outputs: `suicide_watch_with_sentiment.csv`

### 3. demographic_analysis.ipynb
**Purpose**: Extract demographic information

**What it does**:
- Extracts age using regex patterns
- Detects gender using pronouns
- Identifies reasons (depression, family, work, etc.)
- Compares with WHO/CDC statistics
- Outputs: `suicide_watch_with_demographics.csv`

### 4. risk_level_classifier.ipynb
**Purpose**: Multi-class risk classification

**What it does**:
- Classifies into 5 risk levels: minimal/low/mid/high/strong
- Uses keyword-based scoring + ML
- Trains Logistic Regression (85%) and Random Forest (84%)
- Outputs: `suicide_watch_with_risk_levels.csv`

### 5. train.ipynb
**Purpose**: Binary classification for production

**What it does**:
- Trains Logistic Regression with TF-IDF
- Achieves 94% accuracy
- Saves models for deployment
- Outputs: `models/logistic_model.pkl`

## Model Performance Comparison

| Model | Type | Classes | Accuracy | Use Case |
|-------|------|---------|----------|----------|
| `train.ipynb` | Logistic Regression | Binary (2) | **94%** | Production screening |
| `risk_level_classifier.ipynb` | Logistic Regression | Multi-class (5) | **85%** | Triage & intervention |
| `sentiment_analysis.ipynb` | Random Forest | Binary (2) | **79%** | Explainability |

## Risk Level Definitions

| Level | Label | Description | Action |
|-------|-------|-------------|--------|
| 0 | MINIMAL | No risk indicators | Standard response |
| 1 | LOW | Mild distress | Monitor, follow-up |
| 2 | MID | Moderate risk | Professional review |
| 3 | HIGH | High risk | Urgent intervention |
| 4 | STRONG | Critical | Emergency response |

## Key Findings from Data

### Dataset Statistics
- **Total Posts**: 232,074 (perfectly balanced)
- **Suicide Posts**: 116,037 (50%)
- **Non-Suicide Posts**: 116,037 (50%)

### Text Length
- Suicide posts: ~1050 characters (average)
- Non-suicide posts: ~329 characters (average)
- **Insight**: Suicide posts are 3x longer

### Sentiment Analysis
- Suicide posts: **73% negative** sentiment
- Non-suicide posts: **51% positive** sentiment

### Top Risk Factors (from actual data)
1. Family issues (26.1%)
2. Work stress (18.4%)
3. Depression (12.0%)
4. Relationship problems (11.0%)
5. Financial stress (10.5%)

## Dependencies

```
pandas>=1.5.0
numpy>=1.23.0
scikit-learn>=1.0.0
matplotlib>=3.5.0
seaborn>=0.11.0
nltk>=3.8.0
textblob>=0.17.0
vaderSentiment>=3.3.0
requests>=2.28.0
joblib>=1.2.0
kagglehub>=0.1.0
jupyter>=1.0.0
```

## Applications

### 1. Mental Health Screening
Automated detection of at-risk content for human review.

### 2. Crisis Response Triage
Prioritize emergency response based on risk level.

### 3. Resource Allocation
Focus limited mental health resources on highest-risk cases.

### 4. Research & Analysis
Study patterns in suicide-related content.

## Ethical Considerations

⚠️ **IMPORTANT**: This is a screening tool, NOT a diagnostic tool.

1. **Human Oversight**: All high-risk predictions require human review
2. **Privacy**: Handle mental health data with extreme care
3. **Bias**: Models may reflect societal biases
4. **Consent**: Ensure appropriate consent for data use
5. **Fallback**: Always have escalation paths for edge cases
6. **Limitations**: Cannot fully understand context or nuance

## Further Improvements

1. **Deep Learning**: BERT/RoBERTa for better context understanding
2. **Multi-language**: Extend to non-English content
3. **Temporal Analysis**: Track risk changes over time
4. **Active Learning**: Human-in-the-loop for edge cases
5. **API Deployment**: RESTful service for real-time inference

## Documentation

All detailed documentation is in the `/docs` folder:
- Start with `README.md` (this file)
- `data-cleaning.md` - Pipeline explanation
- `sentiment-analysis.md` - VADER/TextBlob features
- `demographic-analysis.md` - Demographics extraction
- `risk-level-classifier.md` - 5-level risk classification
- `train-model.md` - Binary model training
- `model-usage.md` - API & deployment examples

## License & Ethics

This project is for **research and educational purposes**.

- Dataset is from public Reddit posts (anonymized)
- Do not use for actual clinical diagnosis
- Mental health decisions should always involve qualified professionals

---

**Remember**: This tool assists screening. Always prioritize human judgment and professional mental health expertise.
