import shap
import numpy as np
import pandas as pd

from pathlib import Path
from tensorflow import keras

# ─────────────────────────────────────────
# PATHS
# ─────────────────────────────────────────

BASE_DIR      = Path(__file__).resolve().parent   # server/
MODELS_DIR    = BASE_DIR / "models"
DATASETS_DIR  = BASE_DIR / "datasets"

# ─────────────────────────────────────────
# LOAD MODEL + BACKGROUND DATA
# ─────────────────────────────────────────

model = keras.models.load_model(MODELS_DIR / "global_model.h5")
print("[OK] Global model loaded")

df = pd.read_csv(DATASETS_DIR / "hospital_a.csv")
X_background = df.drop("Health_Risk", axis=1).sample(100, random_state=42)

# ─────────────────────────────────────────
# FEATURE NAMES
# ─────────────────────────────────────────

FEATURE_NAMES = [
    "Age", "Glucose", "Blood Pressure", "BMI", "Oxygen Saturation",
    "Cholesterol", "Triglycerides", "HbA1c", "Smoking", "Alcohol",
    "Physical Activity", "Diet Score", "Family History", "Stress Level",
    "Sleep Hours", "Gender_encoded", "LengthOfStay",
]

# ─────────────────────────────────────────
# SHAP EXPLAINER
# ─────────────────────────────────────────

explainer = shap.Explainer(model, X_background)
print("[OK] SHAP Explainer Ready")

# ─────────────────────────────────────────
# MEDICAL RULES
# ─────────────────────────────────────────

MEDICAL_RULES = {
    "Glucose":            {"positive": "High glucose levels strongly increased diabetes risk.",             "negative": "Stable glucose levels helped reduce diabetes-related risk."},
    "HbA1c":              {"positive": "Elevated HbA1c indicated poor long-term blood sugar control.",      "negative": "Healthy HbA1c levels suggested stable blood sugar regulation."},
    "Cholesterol":        {"positive": "Elevated cholesterol increased cardiovascular disease risk.",        "negative": "Healthy cholesterol levels supported cardiovascular stability."},
    "Blood Pressure":     {"positive": "Abnormal blood pressure increased hypertension-related risk.",      "negative": "Normal blood pressure reduced cardiovascular strain."},
    "BMI":                {"positive": "High BMI contributed to obesity-related complications.",             "negative": "Healthy BMI reduced obesity-related disease risk."},
    "Smoking":            {"positive": "Smoking habits negatively impacted overall health condition.",       "negative": "Non-smoking behavior supported better respiratory and cardiac health."},
    "Oxygen Saturation":  {"positive": "Low oxygen saturation contributed to respiratory health concerns.", "negative": "Healthy oxygen saturation supported stable respiratory function."},
    "Physical Activity":  {"positive": "Low physical activity negatively affected metabolic health.",       "negative": "Regular physical activity improved metabolic stability."},
    "Stress Level":       {"positive": "Elevated stress levels increased health instability.",              "negative": "Controlled stress levels supported overall wellness."},
    "Sleep Hours":        {"positive": "Poor sleep quality negatively affected recovery and wellness.",     "negative": "Healthy sleep duration improved recovery and body regulation."},
    "Family History":     {"positive": "Family medical history contributed to inherited disease risk.",     "negative": "No significant inherited disease risk was observed."},
    "Triglycerides":      {"positive": "Elevated triglycerides increased metabolic syndrome risk.",         "negative": "Healthy triglyceride levels supported metabolic balance."},
    "Alcohol":            {"positive": "Alcohol consumption contributed to liver and cardiovascular stress.", "negative": "Limited alcohol exposure reduced metabolic stress."},
    "Diet Score":         {"positive": "Poor diet quality negatively impacted overall health.",             "negative": "Balanced dietary habits supported long-term health stability."},
    "Age":                {"positive": "Advanced age increased vulnerability to chronic disease.",           "negative": "Age-related risk contribution remained relatively low."},
    "LengthOfStay":       {"positive": "Longer hospitalization duration indicated severe medical condition.", "negative": "Shorter hospitalization duration suggested stable recovery."},
}

# ─────────────────────────────────────────
# EXPLAIN FUNCTION
# ─────────────────────────────────────────

def explain_prediction(patient_data: list) -> dict:
    X = pd.DataFrame([patient_data], columns=FEATURE_NAMES)
    shap_values  = explainer(X)
    prediction   = model.predict(X, verbose=0)[0][0]
    contributions = shap_values.values[0]

    feature_impact = sorted(
        zip(FEATURE_NAMES, contributions),
        key=lambda x: abs(x[1]),
        reverse=True,
    )

    explanations = []
    for feature, impact in feature_impact[:5]:
        if feature in MEDICAL_RULES:
            direction    = "increased" if impact > 0 else "reduced"
            medical_reason = MEDICAL_RULES[feature]["positive" if impact > 0 else "negative"]
            explanations.append({
                "feature": feature,
                "impact":  round(float(impact), 4),
                "effect":  direction,
                "medical_reason": medical_reason,
            })

    return {
        "risk_probability": round(float(prediction), 4),
        "prediction": "HIGH RISK" if prediction >= 0.5 else "LOW RISK",
        "top_contributing_factors": explanations,
    }


def get_clinical_explanation(patient_data: list) -> dict:
    return explain_prediction(patient_data)
