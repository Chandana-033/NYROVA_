# ============================================================
#  start.ps1 — Nyrova unified launcher
#  Starts the FastAPI AI backend (port 8000) and the React
#  frontend (port 8080) in two separate terminal windows.
#
#  Usage:  .\start.ps1
# ============================================================

$Root       = $PSScriptRoot
$Server     = Join-Path $Root "server"

# The Python venv is kept in the healthshield directory to avoid
# Windows Long Path issues with TensorFlow's deeply nested headers.
# (TF paths can exceed the 260-char default limit inside deeply
#  nested project directories without admin Long Path registry key.)
$VenvPython = "C:\Users\chand\Downloads\healthshield\.venv\Scripts\python.exe"

# ── Safety check ────────────────────────────────────────────
if (-not (Test-Path $VenvPython)) {
    Write-Host ""
    Write-Host "[ERROR] Python venv not found at:" -ForegroundColor Red
    Write-Host "  $VenvPython" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run the following first:" -ForegroundColor Yellow
    Write-Host "  cd C:\Users\chand\Downloads\healthshield" -ForegroundColor Yellow
    Write-Host "  py -3.13 -m venv .venv" -ForegroundColor Yellow
    Write-Host "  .venv\Scripts\pip install fastapi uvicorn pydantic numpy pandas scikit-learn shap tensorflow h5py" -ForegroundColor Yellow
    exit 1
}

# ── Kill any process already on port 8000 ───────────────────
$existing = netstat -ano | Select-String ":8000 " | Where-Object { $_ -match "LISTENING" }
if ($existing) {
    $pid8000 = ($existing -split "\s+")[-1]
    Write-Host "[Nyrova] Freeing port 8000 (PID $pid8000)..." -ForegroundColor Yellow
    taskkill /PID $pid8000 /F 2>$null | Out-Null
    Start-Sleep -Seconds 1
}

# ── 1. Launch FastAPI backend ────────────────────────────────
Write-Host "[Nyrova] Starting FastAPI backend on http://localhost:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", "Write-Host 'Nyrova AI Backend' -ForegroundColor Cyan; cd '$Server'; & '$VenvPython' -m uvicorn main:app --host 127.0.0.1 --port 8000"

# Give TensorFlow time to load the model before frontend opens
Start-Sleep -Seconds 3

# ── 2. Launch Vite React frontend ────────────────────────────
Write-Host "[Nyrova] Starting React frontend on http://localhost:8080 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", "Write-Host 'Nyrova React Frontend' -ForegroundColor Cyan; cd '$Root'; npm run dev"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host "  Nyrova is starting up - open your browser to:" -ForegroundColor Magenta
Write-Host ""
Write-Host "  Dashboard  ->  http://localhost:8080" -ForegroundColor White
Write-Host "  Predictor  ->  http://localhost:8080/predict" -ForegroundColor White
Write-Host "  API Docs   ->  http://localhost:8000/docs" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Magenta
