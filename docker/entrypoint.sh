#!/bin/sh
set -e

export PATH="/opt/tools/node_modules/.bin:${PATH}"
export NODE_PATH="/opt/tools/node_modules${NODE_PATH:+:$NODE_PATH}"

echo "[entrypoint] Running database migrations..."
prisma migrate deploy
echo "[entrypoint] Migrations complete"

if [ "${RUN_DB_SEED}" = "true" ]; then
  echo "[entrypoint] Seeding database..."
  tsx prisma/seed.ts
  echo "[entrypoint] Seed complete"
fi

echo "[entrypoint] Starting Next.js standalone server..."
exec node server.js
