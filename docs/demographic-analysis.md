# Demographic Analysis Module

## Overview
This notebook extracts demographic information from text data and compares findings with official WHO/CDC statistics.

## Purpose
Understanding who is posting helps:
1. Identify high-risk demographic groups
2. Validate dataset representativeness
3. Compare with official suicide statistics
4. Inform targeted interventions

## Input
- **Source**: `suicide-watch/Suicide_Detection.csv` (raw text for extraction)
- **Format**: Original posts with text before cleaning

## Extraction Methods

### 1. Age Extraction
```python
def extract_age(text):
    patterns = [
        r'\b(\d{1,2})\s*(years?\s*old|yo|y\.?o\.?|yrs?)\b',  # "16 years old", "16 yo"
        r'\b(\d{1,2})\s*year\s*old\b',
        r'age[:\s]+(\d{1,2})',                               # "age 16", "age: 16"
        r'i[\'\s]?m\s*(\d{1,2})',                           # "I'm 16", "Im 16"
        r'i\s*am\s*(\d{1,2})',                              # "I am 16"
        r'(\d{1,2})\s+yo',                                  # "16 yo"
    ]
```
**Results**:
- Age extracted from ~2.8% of posts
- Mean age: **21.5 years**
- Median age: **19.0 years**
- Mode (most common): **16 years**

### 2. Gender Extraction
```python
def extract_gender(text):
    male_patterns = [r'\bmale\b', r'\bman\b', r'\bboy\b', 
                     r'\bhe\b', r'\bhis\b', r'\bhim\b']
    female_patterns = [r'\bfemale\b', r'\bwoman\b', r'\bgirl\b',
                       r'\bshe\b', r'\bher\b', r'\bhers\b']
```
**Results**:
- Male posts: 47.3%
- Female posts: 52.7%
- Unknown: 72.8% (no clear gender indicators)

### 3. Reason Extraction
Categories and keywords used:

| Category | Keywords | % of Posts |
|----------|----------|------------|
| family | family, parents, mom, dad, mother, father | 26.2% |
| work_stress | job, work, unemployed, fired, boss | 18.4% |
| depression | depression, depressed, depressive | 12.0% |
| relationship | breakup, girlfriend, boyfriend, divorce, cheating | 11.0% |
| financial | money, poor, broke, debt, financial | 10.4% |
| loneliness | lonely, alone, isolated, isolation | 9.9% |
| substance | alcohol, drugs, addiction, substance | 3.5% |
| abuse | abuse, abused, trauma, harassment | 3.2% |
| self_harm | cutting, self harm, self-harm | 2.3% |
| social_media | social media, instagram, facebook | 1.6% |
| bullying | bullying, bullied, cyberbullying | <1% |

## Comparison with Official Statistics

### WHO Global Suicide Rates by Age Group
| Age Group | Rate per 100,000 |
|-----------|------------------|
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

**Key Insight**: Males have **3.7x higher** suicide death rate but females attempt **3x more**.

### WHO Global Risk Factors
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
| Highest Risk Age | 16-19 years | 65+ years |
| Average Age | 21.5 years | 45+ years |

**Why?** Online communities skew young. Elderly are underrepresented online.

### Gender Distribution
| Metric | Dataset | Official Stats |
|--------|---------|----------------|
| Female Posts | 52.7% | Higher attempt rate |
| Male Deaths | Lower in dataset | 3.7x higher death rate |

**Why?** Males die by suicide more, but females seek help/post online more.

## Key Insights Summary

1. **Young Dominance**: Dataset dominated by teens/young adults (16-24)
   - Reflects online community demographics
   - Misses elderly high-risk population

2. **Gender Pattern**: More female engagement
   - Matches research: females attempt more
   - Males die more but post less

3. **Top Reasons**: Family, work, depression
   - Family issues #1 trigger (26.2%)
   - Depression explicitly mentioned in 12%

4. **Multiple Factors**: Many posts mention multiple reasons
   - Risk increases with number of factors

## Output
- **File**: `suicide-watch/suicide_watch_with_demographics.csv`
- **New Columns**: 
  - `raw_text` (original text)
  - `extracted_age` (integer or null)
  - `extracted_gender` ('male', 'female', or 'unknown')
  - `reasons` (list of identified reasons)
  - `num_reasons` (count of reasons)

## Visualizations Generated
- `demographic_analysis.png`: Age, gender, and reason distributions
- `external_statistics.png`: WHO/CDC comparison charts

## Limitations

1. **Low Extraction Rate**: Only ~3% have explicit age mentions
2. **Gender Ambiguity**: 72% unknown gender (pronoun-based detection limited)
3. **Keyword Matching**: May miss context or synonyms
4. **Self-Reporting**: Ages/genders are self-reported, not verified

## Applications

1. **Demographic Targeting**: Focus interventions on high-risk groups
2. **Dataset Bias Detection**: Identify underrepresented populations
3. **Research Validation**: Compare online data with official statistics
4. **Feature Engineering**: Demographics as additional ML features
