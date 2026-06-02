# VYRA Android APK Build

## Prerequisites

- Flutter SDK with Android toolchain
- JDK 17
- Android SDK / licenses accepted

## Release APK

```powershell
cd D:\Vyra\client
flutter pub get
flutter build apk --release
```

Output: `build\app\outputs\flutter-apk\app-release.apk`

## App Bundle (Play Store)

```powershell
flutter build appbundle --release
```

## Signing (production)

1. Create keystore:
   ```powershell
   keytool -genkey -v -keystore vyra-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias vyra
   ```
2. Add `android/key.properties` and configure `build.gradle` signingConfigs.

## API URL for release builds

Update `lib/core/constants/api_constants.dart` with your production API URL before building.
