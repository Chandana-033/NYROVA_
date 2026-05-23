# Nyrova — Unified Federated Healthcare AI & Explainable Predictor

Welcome to **Nyrova**, an enterprise-grade healthcare analytics platform. Nyrova integrates a secure React-based clinical dashboard with a FastAPI machine learning backend that implements a **Deep Neural Network (DNN) Disease Risk Predictor** and **SHAP (SHapley Additive exPlanations)** clinical interpretability engine.

This unified workspace merges the predictive model and data pipelines directly with the premium client dashboard.
Access it here: https://nyrova.chandana-reddy-1701.workers.dev/

---

## 📂 Project Architecture & Directory Structure

```filepath
sentinel-health-main/
├── server/                     # Unified Python FastAPI Backend
│   ├── datasets/               # Reference datasets (hospital telemetry)
│   │   └── hospital_a.csv      # Background patient profile cohort (for SHAP)
│   ├── models/                 # Serialized DNN models & data transforms
│   │   ├── global_model.h5     # Trained Keras Deep Neural Network model
│   │   └── scaler.pkl          # Scikit-Learn standard scaler
│   ├── main.py                 # FastAPI application, routes, and CORS setup
│   ├── shap_engine.py          # SHAP Permutation Explainer & clinical rules
│   └── requirements.txt        # Backend dependencies
├── src/                        # Premium React (Vite + TypeScript) Frontend
│   ├── components/             # Reusable UI widgets & layouts
│   │   └── dashboard/          # Sidebar navigation, top headers
│   ├── hooks/                  # Global hooks (Nyrova Auth telemetry)
│   ├── routes/                 # TanStack Router page routes
│   │   └── _app/               
│   │       └── predict.tsx     # Disease Predictor portal
│   └── styles.css              # Main tailwind/vanilla design tokens
├── start.ps1                   # One-Click Unified Launcher (PowerShell)
├── package.json                # Frontend package dependencies
└── README.md                   # Complete Project Documentation (This file)
```

---

## 🔌 Port Configuration & Interfaces

When running locally, Nyrova operates on the following endpoints:

* **React Frontend Dashboard**: `http://localhost:8080`
* **Disease Predictor Route**: `http://localhost:8080/predict`
* **FastAPI Backend AI Server**: `http://localhost:8000`
* **Swagger API Documentation**: `http://localhost:8000/docs`

---

## 🚀 How to Run the Integrated Workspace

To launch the complete Nyrova ecosystem (Frontend + Backend) simultaneously:

1. Open a PowerShell terminal as Administrator or standard user in the project root:
   ```powershell
   cd c:\Users\chand\Downloads\sentinel-health-main\sentinel-health-main
   ```
2. Execute the unified launcher script:
   ```powershell
   .\start.ps1
   ```
This script automatically:
* Frees up port `8000` if it's currently occupied.
* Launches the FastAPI AI backend inside a new PowerShell window using the preconfigured virtual environment.
* Waits for TensorFlow to load the model.
* Launches the Vite/React dev server on port `8080` in another separate window.

---

## 🛑 Commands to Run After Stopping the Server

If you stop the servers (e.g., using `Ctrl + C` in the terminal windows) or close the consoles, some background threads or ports might remain hung in the system. Use the following commands to safely manage, clean up, or test your system.

### 1. Freeing Up Hung Ports (Backend Port 8000 & Frontend Port 8080)
If the port remains occupied or you get an `Address already in use` error:
```powershell
# Find the Process ID (PID) listening on port 8000 (Backend)
$existing8000 = netstat -ano | Select-String ":8000 " | Where-Object { $_ -match "LISTENING" }
if ($existing8000) {
    $pid8000 = ($existing8000 -split "\s+")[-1]
    taskkill /PID $pid8000 /F
    Write-Host "Killed backend process on PID $pid8000" -ForegroundColor Green
}

# Find the Process ID (PID) listening on port 8080 (Frontend)
$existing8080 = netstat -ano | Select-String ":8080 " | Where-Object { $_ -match "LISTENING" }
if ($existing8080) {
    $pid880 = ($existing8080 -split "\s+")[-1]
    taskkill /PID $pid880 /F
    Write-Host "Killed frontend process on PID $pid880" -ForegroundColor Green
}
```

### 2. Manual Startup (Individual Terminals)
If you prefer running the servers manually instead of using `start.ps1`:

* **Terminal A — Starting the Merged Backend**:
  ```powershell
  cd c:\Users\chand\Downloads\sentinel-health-main\sentinel-health-main\server
  
  # Activate virtual environment
  C:\Users\chand\Downloads\healthshield\.venv\Scripts\Activate.ps1
  
  # Run the Uvicorn server on Port 8000
  python -m uvicorn main:app --host 127.0.0.1 --port 8000
  ```

* **Terminal B — Starting the React Frontend**:
  ```powershell
  cd c:\Users\chand\Downloads\sentinel-health-main\sentinel-health-main
  
  # Launch the Vite server
  npm run dev
  ```

### 3. Testing Backend Health via PowerShell
To verify the FastAPI backend is online and serving predictions correctly:
```powershell
# Test general health status
Invoke-RestMethod -Uri http://127.0.0.1:8000/health

# Run a sample risk prediction payload
$payload = @{
    Age = 45
    Glucose = 110
    Blood_Pressure = 80
    BMI = 24.5
    Oxygen_Saturation = 98
    Cholesterol = 180
    Triglycerides = 130
    HbA1c = 5.4
    Smoking = 0
    Alcohol = 0
    Physical_Activity = 3
    Diet_Score = 8
    Family_History = 0
    Stress_Level = 3
    Sleep_Hours = 7.5
    Gender_encoded = 0
    LengthOfStay = 2
} | ConvertTo-Json

Invoke-RestMethod -Uri http://127.0.0.1:8000/predict -Method Post -Body $payload -ContentType "application/json"
```

### 4. Cleaning Temporary Build Artifacts / Node Modules
If you are updating dependencies or experiencing bundler cache issues:
```powershell
# Delete the React production build cache and dist folder
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# Reinstall frontend npm packages (if package.json updates)
npm install
```
