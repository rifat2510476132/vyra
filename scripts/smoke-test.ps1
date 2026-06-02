# Quick API smoke test - run while server is up
$base = $env:VYRA_TEST_URL
if (-not $base) { $base = "http://localhost:5000" }

Write-Host "Testing $base/api/v1/health ..."
$r = Invoke-RestMethod -Uri "$base/api/v1/health" -Method Get
if ($r.ok) { Write-Host "OK: API healthy" -ForegroundColor Green }
else { Write-Host "FAIL" -ForegroundColor Red; exit 1 }

Write-Host "Testing login ..."
$body = @{ email = "alice@vyra.app"; password = "Password123!" } | ConvertTo-Json
$login = Invoke-RestMethod -Uri "$base/api/v1/auth/login" -Method Post -Body $body -ContentType "application/json"
if ($login.data.accessToken) { Write-Host "OK: Login works" -ForegroundColor Green }
else { Write-Host "FAIL: login" -ForegroundColor Red; exit 1 }

Write-Host "All smoke tests passed." -ForegroundColor Green
