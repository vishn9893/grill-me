# Deploying GrillMe

Next.js 13 (standalone) + Prisma + PostgreSQL, deployed as two Docker Compose services
behind Nginx with Let's Encrypt.

## 1. Server prerequisites

Ubuntu 24.04 or Debian 12 assumed.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git nginx certbot python3-certbot-nginx ufw
sudo ufw allow OpenSSH && sudo ufw allow 80,443 && sudo ufw --force enable
```

Install Docker:

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER && newgrp docker
```

If you are on a cloud provider (AWS, GCP, Azure, Hetzner, DigitalOcean, …) also open
ports **22, 80, 443** in the instance's security group / firewall.

## 2. Clone

```bash
sudo mkdir -p /srv/grillme && sudo chown $USER /srv/grillme
cd /srv/grillme
git clone https://github.com/vishn9893/grill-me.git .
```

## 3. Configure environment

```bash
cp .env.example .env
openssl rand -base64 32   # paste the output into NEXTAUTH_SECRET
```

`.env`:

```dotenv
DATABASE_URL="postgresql://grillme:grillme@postgres:5432/grillme?schema=public"
NEXTAUTH_SECRET="<paste the openssl output>"
NEXTAUTH_URL="https://your-domain.com"
SEED_DEMO="false"
```

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Overridden by `docker-compose.yml`; the value here is only used by non-Docker workflows. |
| `NEXTAUTH_SECRET` | Signs session JWTs. Must be long, random, and stable across restarts. |
| `NEXTAUTH_URL` | Public URL. Must match the real site or auth redirects break. |
| `SEED_DEMO` | `true` loads demo users and posts on boot. |

```bash
chmod 600 .env
```

Changing the Postgres password means editing both `POSTGRES_PASSWORD` in
`docker-compose.yml` and `DATABASE_URL` in `.env`, then recreating the volume
(`docker compose down -v`) — that wipes the database.

## 4. DNS

Point an **A record** for `your-domain.com` at the server's public IP before
requesting a certificate.

## 5. Build and start

```bash
docker compose build
docker compose up -d
docker compose ps
docker compose logs -f app
```

On first boot the app container waits for Postgres, runs `prisma migrate deploy`,
and starts. The app listens on `127.0.0.1:3000` inside the container network but is
published on host port `3000`, so check it with `curl http://localhost:3000`.

## 6. Nginx + HTTPS

```bash
sudo tee /etc/nginx/sites-available/grillme > /dev/null <<'EOF'
server {
  server_name your-domain.com;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
EOF

sudo ln -s /etc/nginx/sites-available/grillme /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d your-domain.com
```

Verify: `curl -I https://your-domain.com` should return `200`.

## Updating

```bash
cd /srv/grillme
git pull
docker compose build
docker compose up -d
```

New Prisma migrations in `prisma/migrations/` are applied automatically on boot.

## Running without Docker

Use `docker-compose.dev.yml` to expose Postgres to the host, then run Node directly:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d postgres
npm ci
npx prisma generate
npx prisma migrate deploy
npm run seed          # optional demo data
npm run build
npm start             # or: npm run dev
```

For production outside Docker, run the app under systemd and point Nginx at it:

```ini
[Unit]
Description=GrillMe Next.js
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/srv/grillme/grill-me
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now grillme
```

## Before going live

- If `SEED_DEMO` was `true`, accounts exist with the password `password123`
  (`demo@grillme.local`, `moderator@grillme.local`). Delete or re-hash them.
- Rotate `POSTGRES_PASSWORD` away from the default before real data lands.
- Back up the `grillme_pgdata` volume or use `pg_dump` on a schedule.
- The `app` service runs as an unprivileged user; only port `3000` is published.
