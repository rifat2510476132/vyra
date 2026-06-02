# VYRA — Local PC test → Web app → Global APK

**Repo:** `D:\Vyra`  
**Status:** Code **100%** ready; you add hosting accounts + API keys.

---

## Part 1 — Local PC এ check করো (১৫–২০ মিনিট)

### Prerequisites

| Tool | Install |
|------|---------|
| **Docker Desktop** | Postgres চালানোর জন্য |
| **Node.js 20+** | API |
| **Flutter 3.5+** | App |
| **Android Studio** (optional) | Emulator + APK |
| **Windows Developer Mode** | Settings → Developer Mode ON (Flutter plugins) |

### Step A — Backend চালু

PowerShell:

```powershell
cd D:\Vyra
.\scripts\local-start.ps1
```

এটা করবে:

1. `docker compose up -d postgres`
2. `server/.env` না থাকলে copy করবে
3. `prisma migrate deploy` + seed
4. API: **http://localhost:5000**

**Test:** ব্রাউজারে খোলো → http://localhost:5000/api/v1/health  
দেখতে হবে: `{"ok":true,...}`

**Login (seed):** `alice@vyra.app` / `Password123!`

### Step B — Flutter app চালু

নতুন PowerShell window:

```powershell
cd D:\Vyra
.\scripts\local-flutter.ps1
```

| Target | Command |
|--------|---------|
| Windows desktop | `.\scripts\local-flutter.ps1` |
| Chrome (web) | `.\scripts\local-flutter.ps1 -Target chrome` |
| Android emulator | `.\scripts\local-flutter.ps1 -Target android` |

Config file: `client/config/local.env.json` (localhost API URL)

### Step C — Smoke test checklist

- [ ] Login with alice
- [ ] Home feed loads
- [ ] Create post + image upload (needs Cloudinary in `.env`)
- [ ] Messages → open a chat (start chat may need `POST /conversations/direct`)
- [ ] Settings → Vyra Worlds, Reality Board
- [ ] AI Hub opens

Cloudinary ছাড়াও text/AI কাজ করবে; image upload এর জন্য `server/.env` এ `CLOUDINARY_*` দাও।

---

## Part 2 — Web app বানাও (globally shareable link)

### 2.1 Public API host করো (আগে)

বিনামূল্যে/সহজ option (একটা বেছে নাও):

| Platform | Notes |
|----------|--------|
| **Render** | `deployment/render.yaml` — Postgres addon + API |
| **Railway** | `deployment/railway.json` |
| **Fly.io / VPS** | Docker: root `docker-compose.yml` |

Deploy পর পাবে URL, যেমন: `https://vyra-api.onrender.com`

`server/.env` production এ set করো:

```env
PORT=5000
DATABASE_URL=postgresql://...
CLIENT_URL=https://vyra.app,https://www.vyra.app
APP_PUBLIC_URL=https://vyra.app
JWT_ACCESS_SECRET=...long random...
JWT_REFRESH_SECRET=...long random...
```

Deploy এ চালাও: `npx prisma migrate deploy` + seed

### 2.2 Web build

```powershell
cd D:\Vyra\client\config
copy production.env.example.json production.env.json
# production.env.json এ YOUR-API-DOMAIN বদলাও
```

Example `production.env.json`:

```json
{
  "VYRA_API_URL": "https://vyra-api.onrender.com/api/v1",
  "VYRA_SOCKET_URL": "https://vyra-api.onrender.com"
}
```

Build:

```powershell
cd D:\Vyra
.\scripts\build-release.ps1
```

Output folder: `D:\Vyra\client\build\web`

### 2.3 Web host করো (shareable URL)

| Host | How |
|------|-----|
| **Netlify** | Drag-drop `build/web` folder |
| **Vercel** | Import repo, output `client/build/web` |
| **Firebase Hosting** | `firebase deploy` |
| **Same VPS as API** | Copy `build/web` → `/var/www/vyra/web` + `deployment/nginx-full.conf` |

**Important:** `CLIENT_URL` এ তোমার web URL add করো (comma-separated), নাহলে CORS block করবে।

Optional — API একই server এ web serve:

```env
WEB_ROOT=/path/to/client/build/web
```

তাহলে এক domain এ app + API (nginx config: `deployment/nginx-full.conf`).

---

## Part 3 — APK বানাও (Android globally share)

### 3.1 Build APK

`production.env.json` এ public API URL থাকতে হবে (Part 2.2)।

```powershell
cd D:\Vyra\client
flutter build apk --release --dart-define-from-file=config/production.env.json
```

APK path:

`D:\Vyra\client\build\app\outputs\flutter-apk\app-release.apk`

### 3.2 Share করার উপায়

| Method | Who can install |
|--------|-----------------|
| **Google Play Console** | Everyone (best for global) — $25 one-time, upload AAB/APK |
| **Direct APK link** | Upload APK to Cloudinary/S3/Drive → share HTTPS link (users enable “Install unknown apps”) |
| **Firebase App Distribution** | Testers by email |

Production signing (Play Store):

1. `keytool -genkey ...` → keystore
2. `android/key.properties` + `build.gradle.kts` signing config  
   (see [Flutter Android release docs](https://docs.flutter.dev/deployment/android))

এখন debug-signed APK `build-release.ps1` দিয়ে install-test এর জন্য যথেষ্ট।

### 3.3 Push notifications (optional)

- Firebase project + `google-services.json` in `client/android/app/`
- Server `FIREBASE_*` in `.env`
- Flutter dart-defines in `production.env.json`

---

## Part 4 — Architecture (এক নজরে)

```
[User Phone / Browser]
        |
        v
  Flutter (Web or APK)
        |  HTTPS  VYRA_API_URL
        v
  Express API :5000  +  Socket.IO
        |
        v
  PostgreSQL
        +
  Cloudinary (media)  +  Firebase (push)
```

---

## Quick commands cheat sheet

```powershell
# Local API
cd D:\Vyra; .\scripts\local-start.ps1

# Local app
cd D:\Vyra; .\scripts\local-flutter.ps1 -Target chrome

# Production builds
cd D:\Vyra; .\scripts\build-release.ps1

# Docker full stack (API only)
cd D:\Vyra; docker compose up --build
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Flutter symlink error | Windows Developer Mode ON |
| CORS error on web | Add web URL to `CLIENT_URL` in server `.env` |
| Android cannot reach API | Emulator: `10.0.2.2:5000`; real phone: use PC LAN IP, not `localhost` |
| Image upload fails | Set `CLOUDINARY_*` in server `.env` |
| Email reset code | Dev: read server terminal log; Prod: set `SMTP_*` |

---

**তুমি এখন Part 1 Step A দিয়ে শুরু করো** — `.\scripts\local-start.ps1` চালাও, health URL খোলো, তারপর `local-flutter.ps1`।
