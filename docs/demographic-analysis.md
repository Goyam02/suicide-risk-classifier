# Demographic Analysis Module

## Overview
This Jupyter notebook (`demographic_analysis.ipynb`) extracts demographic information from text data and compares findings with official WHO/CDC statistics.

## Purpose
Understanding who is posting helps:
1. **Identify high-risk demographic groups**
2. **Validate dataset representativeness**
3. **Compare with official suicide statistics**
4. **Inform targeted interventions**

## Input
- **Source Files**: 
  - `suicide-watch/Suicide_Detection.csv` (raw text for extraction)
  - `suicide-watch/suicide_watch_backup.csv` (cleaned data)
- **Dataset Size**: 232,074 rows

## Code Implementation

### Step 1: Load Both Datasets
```python
df_original = pd.read_csv("suicide-watch/Suicide_Detection.csv")
df_original = df_original.rename(columns={'text': 'raw_text', 'class': 'label'})
df_original['label'] = df_original['label'].map({'non-suicide': 0, 'suicide': 1})
df = pd.read_csv("suicide-watch/suicide_watch_backup.csv")
df['raw_text'] = df_original['raw_text']  # Add original text
```

### Step 2: Age Extraction Function
```python
def extract_age(text):
    text = str(text).lower()
    patterns = [
        r'\b(\d{1,2})\s*(years?\s*old|yo|y\.?o\.?|yrs?)\b',  # "16 years old", "16 yo"
        r'\b(\d{1,2})\s*year\s*old\b',
        r'age[:\s]+(\d{1,2})',                                # "age 16"
        r'i[\'\s]?m\s*(\d{1,2})',                            # "I'm 16"
        r'i\s*am\s*(\d{1,2})',                               # "I am 16"
        r'(\d{1,2})\s+yo',                                    # "16 yo"
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            age = int(match.group(1))
            if 10 <= age <= 100:
                return age
    return None
```

### Step 3: Gender Extraction Function
```python
def extract_gender(text):
    text = str(text).lower()
    male_patterns = [r'\bmale\b', r'\bman\b', r'\bboy\b', 
                     r'\bhe\b', r'\bhis\b', r'\bhim\b']
    female_patterns = [r'\bfemale\b', r'\bwoman\b', r'\bgirl\b',
                       r'\bshe\b', r'\bher\b', r'\bhers\b']
    
    male_score = sum(1 for p in male_patterns if re.search(p, text))
    female_score = sum(1 for p in female_patterns if re.search(p, text))
    
    if male_score > female_score and male_score > 0:
        return 'male'
    elif female_score > male_score and female_score > 0:
        return 'female'
    return 'unknown'
```

### Step 4: Reason Extraction
```python
reasons = {
    'depression': ['depression', 'depressed', 'depressive'],
    'loneliness': ['lonely', 'alone', 'isolated', 'isolation'],
    'relationship': ['breakup', 'girlfriend', 'boyfriend', 'divorce', 'cheating'],
    'family': ['family', 'parents', 'mom', 'dad', 'mother', 'father'],
    'work_stress': ['job', 'work', 'unemployed', 'fired', 'boss'],
    'financial': ['money', 'poor', 'broke', 'debt', 'financial'],
    'abuse': ['abuse', 'abused', 'trauma', 'harassment'],
    'bullying': ['bullying', 'bullied', 'cyberbullying'],
    'substance': ['alcohol', 'drugs', 'addiction', 'substance'],
    'self_harm': ['cutting', 'self harm', 'self-harm'],
    'social_media': ['social media', 'instagram', 'facebook', 'twitter']
}

def extract_reasons(text):
    text = str(text).lower()
    found_reasons = []
    for reason, keywords in reasons.items():
        if any(kw in text for kw in keywords):
            found_reasons.append(reason)
    return found_reasons
```

## Key Findings from Actual Analysis

### Age Extraction Results
| Metric | Value |
|--------|-------|
| Posts with age | 16,017 (6.9%) |
| Mean age | 21.5 years |
| Median age | 19.0 years |
| Mode (most common) | 16 years |

### Gender Distribution Results
| Gender | Count | Percentage |
|--------|-------|------------|
| Unknown | 167,488 | 72.2% |
| Female | 34,014 | 14.7% |
| Male | 30,572 | 13.2% |

### Top Reasons (ACTUAL RESULTS)
| Rank | Reason | Count | Percentage |
|------|--------|-------|------------|
| 1 | family | 60,653 | 26.1% |
| 2 | work_stress | 42,794 | 18.4% |
| 3 | depression | 27,896 | 12.0% |
| 4 | relationship | 25,441 | 11.0% |
| 5 | financial | 24,262 | 10.5% |
| 6 | loneliness | 23,013 | 9.9% |
| 7 | substance | 8,035 | 3.5% |
| 8 | abuse | 7,545 | 3.3% |
| 9 | self_harm | 6,013 | 2.6% |
| 10 | social_media | 3,839 | 1.7% |

## WHO Global Suicide Statistics (Reference Data)

### Suicide Rates by Age Group
| Age Group | Rate per 100,000 |
|-----------|-----------------|
| 10-24 | 14.5 |
| 25-34 | 13.8 |
| 35-44 | 14.2 |
| 45-54 | 15.1 |
| 55-64 | 14.8 |
| 65+ | 16.2 |

### CDC US Statistics by Gender
| Gender | Suicide Rate | Attempts per Completion |
|--------|-------------|------------------------|
| Male | 22.4 per 100k | 1 |
| Female | 6.1 per 100k | 3 |

**Key Insight**: Males have **3.7x higher** suicide death rate, but females attempt **3x more**.

## WHO Global Risk Factors
| Factor | % of Cases |
|--------|------------|
| Mental Disorders | 90% |
| Stressors (work, financial) | 50% |
| Impulsivity | 40% |
| Substance Abuse | 30% |
| Previous Attempts | 30% |
| Trauma/Abuse | 25% |
| Access to Means | 20% |

## Dataset vs Reality Comparison

### Age Discrepancy
| Metric | Dataset | Official Stats |
|--------|---------|----------------|
| Dominant Age | 16-19 years | 65+ years |
| Average Age | 21.5 years | 45+ years |

**Why?** Online communities skew young. Elderly are underrepresented online.

### Gender Patterns
| Aspect | Dataset | Official Stats |
|--------|---------|----------------|
| Female Posts | 52.7% of known | Higher attempt rate |
| Male Deaths | Lower in dataset | 3.7x higher rate |

**Why?** Males die more but post less; females seek help/post online more.

## Output Files
- `suicide-watch/suicide_watch_with_demographics.csv` - Dataset with demographics
- `demographic_analysis.png` - Visualizations (age, gender, reasons)
- `external_statistics.png` - WHO/CDC comparison charts

## New Columns Added
| Column | Type | Description |
|--------|------|-------------|
| `raw_text` | string | Original unprocessed text |
| `extracted_age` | int/null | Age if detected, else null |
| `extracted_gender` | string | male/female/unknown |
| `reasons` | list | Identified reason categories |
| `num_reasons` | int | Count of reasons mentioned |

## Key Insights Summary

1. **Young Dominance**: Dataset dominated by teens/young adults (16-24)
   - Reflects online community demographics
   - Misses elderly high-risk population

2. **Gender Pattern**: More female engagement
   - Matches research: females attempt more, seek help more
   - Males die more but post less

3. **Top Reasons** (from ACTUAL data):
   - Family issues #1 trigger (26.1%)
   - Work stress #2 (18.4%)
   - Depression explicitly mentioned in 12%

4. **Multiple Factors**: Many posts mention multiple reasons
   - Risk increases with number of factors

## Limitations

1. **Low Extraction Rate**: Only 6.9% have explicit age mentions
2. **Gender Ambiguity**: 72% unknown gender (pronoun-based detection limited)
3. **Keyword Matching**: May miss context or synonyms
4. **Self-Reporting**: Ages/genders are self-reported, not verified

## Applications

1. **Demographic Targeting**: Focus interventions on high-risk groups
2. **Dataset Bias Detection**: Identify underrepresented populations
3. **Research Validation**: Compare online data with official statistics
4. **Feature Engineering**: Demographics as additional ML features
