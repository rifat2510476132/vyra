# VYRA - run Flutter app against local API
# Usage:
#   cd D:\Vyra
#   .\scripts\local-flutter.ps1              # Chrome (recommended on Windows)
#   .\scripts\local-flutter.ps1 -Target windows   # needs Visual Studio C++ tools
#   .\scripts\local-flutter.ps1 -Target android

param(
  [ValidateSet("windows", "chrome", "android", "web-server")]
  [string]$Target = "chrome"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Client = Join-Path $Root "client"
$Config = Join-Path $Client "config\local.env.json"

Set-Location $Client
flutter pub get

$defines = @("--dart-define-from-file=$Config")

switch ($Target) {
  "chrome" {
    flutter run -d chrome @defines --web-port=8080
  }
  "web-server" {
    flutter run -d web-server @defines --web-port=8080
  }
  "android" {
    $emuConfig = Join-Path $Client "config\android-emulator.env.json"
    @"
{
  "VYRA_API_URL": "http://10.0.2.2:5000/api/v1",
  "VYRA_SOCKET_URL": "http://10.0.2.2:5000"
}
"@ | Set-Content -Path $emuConfig -Encoding UTF8
    flutter run -d android --dart-define-from-file=$emuConfig
  }
  default {
    flutter run -d windows @defines
  }
}
