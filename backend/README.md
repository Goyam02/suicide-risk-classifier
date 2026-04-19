# Suicide Risk Classification Backend

FastAPI-based backend for suicide risk detection using trained ML models.

## Prerequisites

- Python 3.11+
- Trained models in `../models/` directory

## Setup

### 1. Create virtual environment (using existing venv)

```bash
# Activate existing venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

### 2. Install backend dependencies

```bash
pip install -r backend/requirements.txt
```

Or install all project dependencies:

```bash
pip install -r requirements.txt
```

### 3. Run the server

```bash
# Option 1: Using Python
python -m backend.run

# Option 2: Using uvicorn directly
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### Health Check
```
GET /health
```

Returns:
```json
{
  "status": "healthy",
  "models_loaded": true
}
```

### Analyze Single Text
```
POST /analyze
```

Request:
```json
{
  "text": "I feel like there's no point in living anymore"
}
```

Response:
```json
{
  "text": "I feel like there's no point...",
  "binary_prediction": "Suicide Risk",
  "confidence": 0.94,
  "risk_level": "HIGH",
  "risk_description": "High risk - urgent intervention within 24 hours",
  "action_required": "Immediate intervention within 24 hours"
}
```

### Batch Analysis
```
POST /analyze/batch
```

Request:
```json
{
  "texts": [
    "I feel hopeless",
    "Had a great day today!",
    "I want to end my life"
  ]
}
```

Response:
```json
{
  "results": [...],
  "total": 3
}
```

## Risk Level Definitions

| Level | Label | Description | Action |
|-------|-------|-------------|--------|
| 0 | MINIMAL | No risk indicators | Standard response |
| 1 | LOW | Mild distress | Monitor, follow-up |
| 2 | MID | Moderate risk | Professional review |
| 3 | HIGH | High risk | Urgent intervention |
| 4 | STRONG | Critical | Emergency response |

## Configuration

Environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| API_HOST | 0.0.0.0 | Host to bind to |
| API_PORT | 8000 | Port to run on |
| API_RELOAD | false | Enable auto-reload |

## Documentation

Interactive API docs available at: `http://localhost:8000/docs`

## Models Required

The following model files must exist in the `models/` directory:

- `logistic_model.pkl` - Binary classifier (94% accuracy)
- `tfidf_vectorizer.pkl` - TF-IDF vectorizer for binary model
- `risk_level_classifier.pkl` - Multi-class risk classifier (85% accuracy)
- `risk_vectorizer.pkl` - TF-IDF vectorizer for risk model