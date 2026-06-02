# VYRA - local backend + Postgres (Windows PowerShell)
# Usage:  cd D:\Vyra; .\scripts\local-start.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "==> Starting Postgres (Docker)..." -ForegroundColor Cyan
docker compose up -d postgres
if ($LASTEXITCODE -ne 0) {
  Write-Host "Docker failed. Is Docker Desktop running?" -ForegroundColor Red
  exit 1
}
Start-Sleep -Seconds 4

$ServerDir = Join-Path $Root "server"
Set-Location $ServerDir

if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host "Created server/.env from .env.example - edit secrets if needed." -ForegroundColor Yellow
}

Write-Host "==> Prisma migrate + seed..." -ForegroundColor Cyan
npx prisma migrate deploy
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm run prisma:seed
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "==> API on http://localhost:5000" -ForegroundColor Green
Write-Host "    Health: http://localhost:5000/api/v1/health" -ForegroundColor Green
Write-Host '    Login: alice@vyra.app / Password123!' -ForegroundColor Green
npm run dev
