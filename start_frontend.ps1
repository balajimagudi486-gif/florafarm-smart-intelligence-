# FLORA — Frontend Startup Script (PowerShell)
# Run from c:\Users\DELL\Documents\Flora\

$env:PATH = "C:\nodejs;$env:PATH"

Write-Host "🌿 Starting FLORA Frontend..." -ForegroundColor Green
Set-Location frontend

Write-Host "✅ Starting Vite dev server on http://localhost:5173" -ForegroundColor Green
npm run dev
