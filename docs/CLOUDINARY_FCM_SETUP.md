# Cloudinary + FCM setup (VYRA)

## Server (`D:\Vyra\server\.env`)

```env
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@....iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Run migration:

```bash
cd server
npx prisma migrate deploy
npm run dev
```

## API endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/media/upload` | multipart `file`, optional `purpose` |
| POST | `/api/v1/media/avatar` | avatar → profile |
| POST | `/api/v1/media/cover` | cover image |
| DELETE | `/api/v1/media/:mediaId` | delete + Cloudinary destroy |
| POST | `/api/v1/devices/register` | `{ token, platform }` |
| DELETE | `/api/v1/devices/register` | `{ token }` |

Notifications are created on: friend request, accept, comment, like, chat message — with DB row + Socket `notification:new` + FCM.

## Flutter FCM

1. Create Firebase project → add Android/iOS apps.
2. Download `google-services.json` → `client/android/app/`
3. Download `GoogleService-Info.plist` → `client/ios/Runner/`
4. Run with dart-defines:

```bash
cd client
flutter pub get
flutter run \
  --dart-define=VYRA_API_URL=http://10.0.2.2:5000/api/v1 \
  --dart-define=FIREBASE_PROJECT_ID=your-project \
  --dart-define=FIREBASE_API_KEY=... \
  --dart-define=FIREBASE_APP_ID=1:...:android:... \
  --dart-define=FIREBASE_MESSAGING_SENDER_ID=...
```

Without Firebase defines, the app runs normally; push registration is skipped.

## Cloudinary only (no Firebase)

Set Cloudinary env on server and use image upload in **Emit Signal** and **Evolve Identity**. Push will not fire until Firebase is configured.
