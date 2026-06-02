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

## Production Checklist

- [ ] Strong JWT secrets
- [ ] HTTPS termination (Nginx / Cloudflare)
- [ ] `prisma migrate deploy` on release
- [ ] Firebase service account for FCM
- [ ] Cloudinary credentials for media
- [ ] `CLIENT_URL` CORS origin set to production web URL
