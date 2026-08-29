# FLORA — Backend Startup Script (PowerShell)
# Run from c:\Users\DELL\Documents\Flora\

Write-Host "🌿 Starting FLORA Backend..." -ForegroundColor Green

Set-Location backend

# Check if virtual environment exists
if (-not (Test-Path ".venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
}

# Activate venv
.\.venv\Scripts\Activate.ps1

# Install requirements
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt --quiet

# Start FastAPI
Write-Host "✅ Starting FastAPI server on http://localhost:8000" -ForegroundColor Green
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
