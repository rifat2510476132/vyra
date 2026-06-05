# VYRA Deployment

## Docker (local / VPS)

```powershell
cd D:\Vyra\deployment
docker compose up --build
```

## PM2

```powershell
cd D:\Vyra\server
npm run build
cd D:\Vyra\deployment
pm2 start ecosystem.config.js
```

## Nginx

Copy `deployment/nginx.conf` to your site config and point `proxy_pass` to the API port.

## Railway

Use `deployment/railway.json` and set `DATABASE_URL` in the Railway dashboard.

## Render

Use `deployment/render.yaml` — link the PostgreSQL addon to `DATABASE_URL`.

## Prisma Build Fix

This project now includes a server build flow that ensures Prisma Client is generated before TypeScript compilation.

- `server/package.json` includes:
  - `prisma:generate`: `npx prisma generate --schema=prisma/schema.prisma`
  - `build`: `npm run prisma:generate && tsc`
  - `postinstall`: `npm run prisma:generate`
- `deployment/Dockerfile` already runs `npx prisma generate` during the build stage.
- Cloud build commands should either run `npm install` and `npx prisma generate`, or use the provided Dockerfile.

### Recommended local Docker deploy

```powershell
cd D:\Vyra\deployment
docker compose up --build
```

### Render

`deployment/render.yaml` is already configured with:
- `buildCommand: cd server && npm install && npx prisma generate && npm run build`
- `startCommand: cd server && npx prisma migrate deploy && npm start`

### Railway

`deployment/railway.json` uses the Dockerfile and starts with:
- `npx prisma migrate deploy && node dist/server.js`

## Production Checklist

- [ ] Strong JWT secrets
- [ ] HTTPS termination (Nginx / Cloudflare)
- [ ] `prisma migrate deploy` on release
- [ ] Firebase service account for FCM
- [ ] Cloudinary credentials for media
- [ ] `CLIENT_URL` CORS origin set to production web URL
