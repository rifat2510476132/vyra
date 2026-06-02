# VYRA Installation Guide (Windows)

## Prerequisites

- Node.js 20+
- Flutter 3.24+
- PostgreSQL 16+
- Git

## 1. PostgreSQL

```powershell
createdb vyra_db
```

Or use Docker from `D:\Vyra\deployment`:

```powershell
cd D:\Vyra\deployment
docker compose up -d postgres
```

## 2. Backend

```powershell
cd D:\Vyra\server
copy .env.example .env
# Edit DATABASE_URL and secrets in .env
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

API: `http://localhost:5000/api/v1/health`

## 3. Flutter Client

```powershell
cd D:\Vyra\client
flutter pub get
flutter run
```

Configure API base URL in `lib/core/constants/api_constants.dart` for your machine (emulator uses `10.0.2.2` on Android).

## 4. Environment Variables

Copy `server/.env.example` and set:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`
- `OPENAI_API_KEY` (optional — AI falls back gracefully)
- `CLOUDINARY_*` (for media uploads)
- `FIREBASE_*` (for FCM push)
- `GOOGLE_CLIENT_*` (for OAuth)
