# VYRA — build Web + APK for sharing
# 1) Copy client/config/production.env.example.json -> production.env.json and set YOUR public API URL
# 2) Run:  cd D:\Vyra; .\scripts\build-release.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Client = Join-Path $Root "client"
$ProdConfig = Join-Path $Client "config\production.env.json"

if (-not (Test-Path $ProdConfig)) {
  Write-Host "ERROR: Create $ProdConfig from production.env.example.json first." -ForegroundColor Red
  exit 1
}

Set-Location $Client
flutter pub get

Write-Host "==> Building Web (release)..." -ForegroundColor Cyan
flutter build web --release --dart-define-from-file=$ProdConfig
$WebOut = Join-Path $Client "build\web"
Write-Host "Web output: $WebOut" -ForegroundColor Green

Write-Host "==> Building APK (release)..." -ForegroundColor Cyan
flutter build apk --release --dart-define-from-file=$ProdConfig
$Apk = Join-Path $Client "build\app\outputs\flutter-apk\app-release.apk"
Write-Host "APK output: $Apk" -ForegroundColor Green

Write-Host ""
Write-Host "Next: deploy API + upload web folder + share APK link (see docs/LOCAL_TEST_AND_RELEASE.md)" -ForegroundColor Yellow
