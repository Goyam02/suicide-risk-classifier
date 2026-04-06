# Dataset Download Script

## Overview
This Python script (`download_dataset.py`) downloads the suicide detection dataset from Kaggle using the `kagglehub` library.

## Purpose
1. **Automate** dataset acquisition
2. **Ensure reproducible** data sourcing
3. **Handle** dataset versioning
4. **Organize** data in project structure

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
- **Size**: ~167 MB

## How It Works

### Step 1: Download from Kaggle
```python
cache_path = kagglehub.dataset_download("nikhileswarkomati/suicide-watch")
```
Downloads to Kaggle's default cache directory.

### Step 2: Define Project Location
```python
project_root = os.getcwd()
dataset_path = os.path.join(project_root, "suicide-watch")
```
Sets target directory to project's `suicide-watch` folder.

### Step 3: Move to Project
```python
if os.path.exists(dataset_path):
    shutil.rmtree(dataset_path)

shutil.move(cache_path, dataset_path)
```
- Removes old dataset if exists (prevents conflicts)
- Moves downloaded files to project folder

### Step 4: Confirmation
```python
print("Dataset moved to:", dataset_path)
```

## Usage

### Running the Script
```bash
python download_dataset.py
```

### Prerequisites
1. **Kaggle API Credentials** configured
2. **Internet connection**
3. **Sufficient disk space** (~200MB)

### Setting Up Kaggle Credentials

**Windows**:
1. Install kaggle package: `pip install kaggle`
2. Get credentials from https://www.kaggle.com/account
3. Save to: `C:\Users\<your_username>\.kaggle\kaggle.json`

**Linux/Mac**:
1. Install kaggle package: `pip install kaggle`
2. Get credentials from https://www.kaggle.com/account
3. Save to: `~/.kaggle/kaggle.json`

## Alternative: Manual Download

If API access isn't configured:
1. Visit: https://www.kaggle.com/datasets/nikhileswarkomati/suicide-watch
2. Click "Download"
3. Extract ZIP to `suicide-watch/` folder

## Output Structure

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

## Data Source Ethics

This dataset is from public Reddit posts, posted before the API change in 2023.

Considerations:
1. **Anonymization**: Usernames removed in dataset
2. **Public Posts**: Data was publicly available when collected
3. **Research Purpose**: Intended for academic/research use
4. **Sensitivity**: Contains mental health content - handle responsibly

## Maintenance Notes

- **Kagglehub** caches downloads - subsequent runs are faster
- Dataset may be updated by author - check for new versions
- If link breaks, search Kaggle for "suicide watch" dataset
- Original dataset: https://www.kaggle.com/datasets/nikhileswarkomati/suicide-watch

## Related Files

| File | Purpose |
|------|---------|
| `data-cleaning.ipynb` | Processes this raw data |
| `suicide-watch/` | Dataset storage directory |
| `suicide-watch/suicide_watch_cleaned.csv` | Cleaned output |
