# Vet Booking System

Expo app (web + mobile) for the Rondev veterinary clinic MVP.

## URLs (production)

| Surface | URL |
|---------|-----|
| **Web app** | https://vet.rondev.com.ph |
| **Demo guide (Rondev services)** | https://service.rondev.com.ph/vet-clinic/ |
| **API** | https://api.rondev.com.ph/api/vet |
| **Staging API** | https://staging-api.rondev.com.ph/api/vet |

## Demo logins (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vetclinic.com | Admin@1234 |
| Staff | dr.maria@vetclinic.com | Staff@1234 |
| Customer | juan.delacruz@email.com | Customer@1234 |

## Local dev

**Ops panel (Ron only):** `npm run vet:panel` → http://127.0.0.1:8099/ · Terminal menu: `npm run vet:ops`

```bash
# API (repo root)
npm run vet:dev

# Frontend
cd veterinary-booking-system
cp .env.example .env
npm install
npm run dev
```

Web: http://localhost:8082 · API: http://localhost:3000

## Production deploy (VPS)

Runs automatically on push to `main` via GitHub Actions (`deploy-production.yml`).

Manual on server:

```bash
cd /var/www/rondev-backend
./scripts/deploy/vps-deploy.sh vet production    # API + web
./scripts/deploy/vps-deploy.sh vet-api production
./scripts/deploy/vps-deploy.sh vet-web production
```

### First-time VPS setup

1. `sudo bash docker/vet/nginx/install-on-vps.sh` — nginx proxies for api + vet subdomains
2. Copy env files:
   - `.env.production` from `.env.production.example` (set `DB_PASSWORD`, `JWT_SECRET`, `CORS_ORIGIN`)
   - `veterinary-booking-system/.env.production` from `.env.production.example`
3. `docker volume create vet_rondev-prod-data` (bootstrap script does this)
4. Cloudflare A records: `api`, `staging-api`, `vet` → VPS IP
5. `certbot --nginx -d api.rondev.com.ph -d staging-api.rondev.com.ph -d vet.rondev.com.ph`

### Web build (manual)

```bash
cd veterinary-booking-system
cp .env.production.example .env.production
npm ci && npm run build:web
docker compose -p vet-web-production --env-file .env.production -f docker/web/docker-compose.yml up -d
```

Static export lands in `dist/`; nginx container serves on host port **8093**.

## Mobile (EAS)

```bash
cd veterinary-booking-system
eas build --profile production --platform android
```

Production API is baked via `eas.json` → `https://api.rondev.com.ph`.
