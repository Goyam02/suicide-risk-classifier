# Dataset Download Script

## Overview
This Python script downloads the suicide dataset from Kaggle using the `kagglehub` library.

## Purpose
1. Automate dataset acquisition
2. Ensure reproducible data sourcing
3. Handle dataset versioning

## Dependencies
```python
import kagglehub
import shutil
import os
```

## Source Dataset
- **Name**: `nikhileswarkomati/suicide-watch`
- **Provider**: Kaggle
- **Content**: Reddit posts labeled as suicide-related or non-suicide

## How It Works

### 1. Download from Kaggle
```python
cache_path = kagglehub.dataset_download("nikhileswarkomati/suicide-watch")
```
Downloads to Kaggle's default cache directory.

### 2. Define Destination
```python
project_root = os.getcwd()
dataset_path = os.path.join(project_root, "suicide-watch")
```
Sets target directory to project's `suicide-watch` folder.

### 3. Move to Project
```python
if os.path.exists(dataset_path):
    shutil.rmtree(dataset_path)

shutil.move(cache_path, dataset_path)
```
- Removes old dataset if exists
- Moves downloaded files to project

### 4. Output
```
Dataset moved to: D:\suicide-risk\suicide-watch
```

## Dataset Structure

After download, the directory contains:
```
suicide-watch/
├── Suicide_Detection.csv    # Main dataset file (~167MB)
└── [other files if any]
```

## CSV Format

| Column | Type | Description |
|--------|------|-------------|
| Unnamed: 0 | Integer | Index column |
| text | String | Reddit post content |
| class | String | "suicide" or "non-suicide" |

### Sample Rows
```
Unnamed: 0 | text                                                      | class
-----------+-----------------------------------------------------------+-------------
2          | Ex Wife Threatening SuicideRecently I left my...          | suicide
3          | Am I weird I dont get affected by compliments...         | non-suicide
4          | Finally 2020 is almost over...                            | non-suicide
```

## Dataset Statistics

| Metric | Value |
|--------|-------|
| Total Rows | 232,074 |
| Suicide Posts | 116,037 |
| Non-Suicide Posts | 116,037 |
| File Size | ~167 MB |

**Class Balance**: Perfectly balanced (50/50 split)

## Usage

### Running the Script
```bash
python download_dataset.py
```

### Prerequisites
1. Kaggle credentials configured (`~/.kaggle/kaggle.json`)
2. Internet connection
3. Sufficient disk space (~200MB)

### Setting Up Kaggle Credentials
```bash
# Install kaggle package
pip install kaggle

# Download credentials from Kaggle website
# Place at ~/.kaggle/kaggle.json (Linux/Mac) or C:\Users\<user>\.kaggle\kaggle.json (Windows)
```

## Alternative: Manual Download

If API access isn't configured:
1. Visit: https://www.kaggle.com/datasets/nikhileswarkomati/suicide-watch
2. Click "Download"
3. Extract to `suicide-watch/` folder

## Data Source Ethics

This dataset is from public Reddit posts, posted before the API change in 2023. Consider:

1. **Anonymization**: Usernames removed in dataset
2. **Public Posts**: Data was publicly available
3. **Research Purpose**: Intended for academic/research use
4. **Sensitivity**: Contains mental health content - handle responsibly

## Maintenance Notes

- **Kagglehub** caches downloads - subsequent runs are faster
- Dataset may be updated by author - check for new versions
- If link breaks, search Kaggle for "suicide watch" dataset

## Related Files

| File | Purpose |
|------|---------|
| `data-cleaning.ipynb` | Processes this raw data |
| `suicide-watch/` | Dataset storage directory |
| `suicide-watch/suicide_watch_cleaned.csv` | Cleaned output |
