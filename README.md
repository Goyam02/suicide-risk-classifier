# Suicide Risk Classification Project

## Project Overview

This project develops machine learning models to classify suicide risk from text data. It uses natural language processing (NLP) techniques to analyze social media posts and predict risk levels for mental health screening and intervention.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PROJECT PIPELINE                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐    ┌────────────────┐    ┌───────────────────┐    │
│  │   Kaggle     │    │  Data Cleaning │    │  Feature          │    │
│  │   Dataset    │───▶│  Pipeline      │───▶│  Engineering      │    │
│  │  (232K rows) │    │                │    │                   │    │
│  └──────────────┘    └────────────────┘    └───────────────────┘    │
│                                                    │                │
│         ┌─────────────────────────────────────────┼──────────┐     │
│         │                                         │          │     │
│         ▼                                         ▼          ▼     │
│  ┌─────────────────┐              ┌──────────────────────────┐    │
│  │ Sentiment        │              │ Risk Level               │    │
│  │ Analysis         │              │ Classification           │    │
│  │ (VADER/TextBlob) │              │ (Multi-class: 5 levels) │    │
│  └─────────────────┘              └──────────────────────────┘    │
│         │                                         │                │
│         │                                         │                │
│         └─────────────────────┬───────────────────┘                │
│                               ▼                                    │
│                    ┌─────────────────────┐                         │
│                    │ Binary Classification │                         │
│                    │ (Suicide/Non-Suicide) │                         │
│                    │ Accuracy: 94%         │                         │
│                    └─────────────────────┘                         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
suicide-risk/
├── docs/                           # Documentation
│   ├── README.md                   # This file
│   ├── data-cleaning.md           # Data cleaning pipeline
│   ├── sentiment-analysis.md      # Sentiment feature extraction
│   ├── demographic-analysis.md    # Demographic extraction
│   ├── risk-level-classifier.md   # Multi-class risk levels
│   ├── train-model.md             # Model training
│   └── download-dataset.md        # Dataset acquisition
│
├── suicide-watch/                  # Dataset folder
│   ├── Suicide_Detection.csv      # Original raw data
│   ├── suicide_watch_cleaned.csv  # Cleaned data
│   ├── suicide_watch_backup.csv   # Backup before modifications
│   ├── suicide_watch_with_sentiment.csv
│   ├── suicide_watch_with_demographics.csv
│   └── suicide_watch_with_risk_levels.csv
│
├── models/                         # Trained models
│   ├── logistic_model.pkl          # Binary classifier
│   ├── tfidf_vectorizer.pkl       # TF-IDF transformer
│   ├── risk_level_classifier.pkl   # Multi-class classifier
│   └── risk_vectorizer.pkl        # Risk model vectorizer
│
├── venv/                           # Virtual environment
│
├── data-cleaning.ipynb            # Data preprocessing
├── sentiment_analysis.ipynb        # Sentiment features
├── demographic_analysis.ipynb     # Demographics extraction
├── risk_level_classifier.ipynb    # Risk level classification
├── train.ipynb                    # Binary model training
├── download_dataset.py            # Dataset downloader
└── requirements.txt               # Python dependencies
```

## Quick Start

### 1. Setup Environment
```bash
# Create and activate virtual environment
python -m venv venv
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

**Recommended Order**:
1. `data-cleaning.ipynb` - Clean and prepare data
2. `sentiment_analysis.ipynb` - Add sentiment features
3. `demographic_analysis.ipynb` - Extract demographics
4. `risk_level_classifier.ipynb` - Create risk levels
5. `train.ipynb` - Train binary classifier

## Features Overview

### 1. Data Cleaning (`data-cleaning.ipynb`)
- Text normalization (lowercase, remove URLs, special chars)
- Feature engineering (length, keyword scores, pronoun count)
- Label encoding (suicide/non-suicide → 0/1)

### 2. Sentiment Analysis (`sentiment_analysis.ipynb`)
- **VADER**: Social media optimized sentiment
- **TextBlob**: General-purpose polarity/subjectivity
- **Result**: 6 new sentiment features per post

### 3. Demographic Analysis (`demographic_analysis.ipynb`)
- **Age extraction**: Regex patterns for "I'm 16", "16 yo"
- **Gender detection**: Pronoun-based classification
- **Reason extraction**: 11 categories (depression, family, work, etc.)
- **External comparison**: WHO/CDC statistics

### 4. Risk Classification (`risk_level_classifier.ipynb`)
- **5 Risk Levels**: Minimal → Low → Mid → High → Strong
- **Keyword-based scoring**: 30+ risk indicators
- **Multi-class models**: Random Forest, Logistic Regression

### 5. Binary Classification (`train.ipynb`)
- **Model**: Logistic Regression + TF-IDF
- **Accuracy**: 94%
- **Purpose**: Production screening model

## Model Performance

| Model | Task | Classes | Accuracy | Best For |
|-------|------|---------|----------|----------|
| Logistic Regression | Binary | 2 | 94% | Production deployment |
| Random Forest | Risk Levels | 5 | ~80% | Triage systems |
| Sentiment + RF | Binary | 2 | 79% | Explainability |

## Key Findings

### Dataset Characteristics
- **232,074 posts** (perfectly balanced 50/50)
- Average length: Suicide posts 3x longer
- Mean age: 21.5 years (skews young)

### Sentiment Patterns
- Suicide posts: **73% negative** sentiment
- Non-suicide posts: **51% positive** sentiment
- Compound score: -0.44 vs +0.09

### Top Risk Factors
1. Family issues (26.2%)
2. Work stress (18.4%)
3. Depression (12.0%)
4. Relationship problems (11.0%)
5. Financial stress (10.4%)

## Applications

### 1. Mental Health Screening
```
User Post → Model → Risk Level → Action
                                ↓
              ┌─────────────────┼─────────────────┐
              │                 │                 │
           Minimal           High/Strong        Mid
              │                 │                 │
         Standard         Immediate          Urgent
         Check-in         Response          Screening
```

### 2. Crisis Hotline Integration
- Real-time scoring of incoming messages
- Priority routing based on risk level
- Automated responses for lower risk

### 3. Research & Analysis
- Trend analysis by demographics
- Geographic/demographic risk patterns
- Intervention effectiveness tracking

## Ethical Considerations

⚠️ **Important**: This tool is a screening aid, not a diagnostic tool.

1. **Human Oversight**: All high-risk predictions should involve human review
2. **Privacy**: Handle mental health data with extreme care
3. **Bias**: Models may reflect societal biases in training data
4. **Consent**: Ensure appropriate consent for data use
5. **Fallback**: Always have escalation paths

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

## License & Ethics

This project is for **research and educational purposes**. 

- Dataset is from public Reddit posts (anonymized)
- Do not use for actual clinical diagnosis
- Mental health decisions should always involve qualified professionals

## Further Improvements

1. **Deep Learning**: BERT/RoBERTa for better context understanding
2. **Multi-language**: Extend to non-English content
3. **Temporal Analysis**: Track risk changes over time
4. **Active Learning**: Human-in-the-loop for edge cases
5. **API Deployment**: RESTful service for real-time inference

## Contact & Support

For questions about this project:
- Review documentation in `/docs` folder
- Check notebook comments for code explanations
- Examine output visualizations for insights

---

**Remember**: This is a screening tool. Always prioritize human judgment and professional mental health expertise.
