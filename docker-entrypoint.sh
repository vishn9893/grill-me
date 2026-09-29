#!/bin/sh
set -e

echo "==> Waiting for database"
i=0
until node -e '
const net = require("net");
const url = new URL(process.env.DATABASE_URL);
const s = net.connect(Number(url.port || 5432), url.hostname);
s.on("connect", () => { s.end(); process.exit(0); });
s.on("error", () => process.exit(1));
setTimeout(() => process.exit(1), 3000);
'; do
  i=$((i + 1))
  if [ "$i" -ge 30 ]; then
    echo "Database not reachable after 60s" >&2
    exit 1
  fi
  sleep 2
done

echo "==> Applying migrations"
prisma migrate deploy

if [ "$SEED_DEMO" = "true" ]; then
  echo "==> Seeding demo data"
  node prisma/seed.mjs
fi

echo "==> Starting app on port ${PORT:-3000}"
exec node server.js
