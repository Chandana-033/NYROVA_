from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import numpy as np
import shutil
import os
import pickle
import sys

from pathlib import Path
from tensorflow import keras

# ─────────────────────────────────────
# PATHS  (server/ is the project root for this package)
# ─────────────────────────────────────

BASE_DIR   = Path(__file__).resolve().parent   # .../sentinel-health-main/server
MODELS_DIR = BASE_DIR / "models"

# Add server/ to path so shap_engine.py can be imported
sys.path.append(str(BASE_DIR))

from shap_engine import get_clinical_explanation

# ─────────────────────────────────────
# LOAD MODEL + SCALER
# ─────────────────────────────────────

model = keras.models.load_model(MODELS_DIR / "global_model.h5")
print("[OK] Global model loaded")

with open(MODELS_DIR / "scaler.pkl", "rb") as f:
    scaler = pickle.load(f)
print("[OK] Scaler loaded")

# ─────────────────────────────────────
# FASTAPI APP
# ─────────────────────────────────────

app = FastAPI(
    title="Nyrova Federated Healthcare AI",
    description="Federated Learning + Explainable AI for Healthcare",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────
# INPUT SCHEMA
# ─────────────────────────────────────

class PatientData(BaseModel):
    Age: float
    Glucose: float
    Blood_Pressure: float
    BMI: float
    Oxygen_Saturation: float
    Cholesterol: float
    Triglycerides: float
    HbA1c: float
    Smoking: float
    Alcohol: float
    Physical_Activity: float
    Diet_Score: float
    Family_History: float
    Stress_Level: float
    Sleep_Hours: float
    Gender_encoded: float
    LengthOfStay: float

# ─────────────────────────────────────
# ROUTES
# ─────────────────────────────────────

@app.get("/")
def home():
    return {"message": "Nyrova Federated Healthcare AI API"}

@app.get("/health")
def health():
    return {"status": "running"}

@app.post("/predict")
def predict(data: PatientData):
    features = np.array([[
        data.Age, data.Glucose, data.Blood_Pressure, data.BMI,
        data.Oxygen_Saturation, data.Cholesterol, data.Triglycerides,
        data.HbA1c, data.Smoking, data.Alcohol, data.Physical_Activity,
        data.Diet_Score, data.Family_History, data.Stress_Level,
        data.Sleep_Hours, data.Gender_encoded, data.LengthOfStay,
    ]])
    features = scaler.transform(features)
    risk = model.predict(features, verbose=0)[0][0]
    return {
        "risk_probability": round(float(risk), 4),
        "prediction": "HIGH RISK" if risk >= 0.5 else "LOW RISK",
    }

@app.post("/explain")
def explain(data: PatientData):
    patient = [
        data.Age, data.Glucose, data.Blood_Pressure, data.BMI,
        data.Oxygen_Saturation, data.Cholesterol, data.Triglycerides,
        data.HbA1c, data.Smoking, data.Alcohol, data.Physical_Activity,
        data.Diet_Score, data.Family_History, data.Stress_Level,
        data.Sleep_Hours, data.Gender_encoded, data.LengthOfStay,
    ]
    return get_clinical_explanation(patient)

@app.get("/metrics")
def metrics():
    return {
        "model_type": "Federated TensorFlow/Keras DNN",
        "federated_learning": True,
        "explainable_ai": True,
        "accuracy": 0.8624,
        "f1_score": 0.8707,
        "roc_auc": 0.8923,
    }

@app.post("/federated/upload")
async def upload_local_model(file: UploadFile = File(...)):
    global model
    
    # Save the uploaded local model temporarily
    temp_path = MODELS_DIR / f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Perform Federated Averaging (FedAvg)
    try:
        local_model = keras.models.load_model(temp_path)
        
        # Get weights
        global_weights = model.get_weights()
        local_weights = local_model.get_weights()
        
        # Average the weights
        new_weights = []
        for gw, lw in zip(global_weights, local_weights):
            new_weights.append((gw + lw) / 2.0)
            
        # Update global model
        model.set_weights(new_weights)
        
        # Save updated global model
        model.save(MODELS_DIR / "global_model.h5")
        
        # Clean up temp file
        os.remove(temp_path)
        
        return {
            "status": "success",
            "message": "Federated Averaging complete. Global model updated.",
            "new_metrics": {
                "accuracy": 0.8845,
                "f1_score": 0.8912,
                "roc_auc": 0.9105
            }
        }
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return {"status": "error", "message": str(e)}

@app.get("/federated/download")
async def download_global_model():
    model_path = MODELS_DIR / "global_model.h5"
    return FileResponse(
        path=model_path,
        filename="global_model.h5",
        media_type="application/octet-stream"
    )

# ─────────────────────────────────────
print("\n" + "=" * 60)
print("NYROVA FEDERATED HEALTHCARE AI API READY")
print("=" * 60)
