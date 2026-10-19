#!/usr/bin/env bash
# Pull prebuilt GHCR images and recreate app containers.
# Does NOT build, does NOT compose down, does NOT prune volumes/images.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${ROOT_DIR}/docker-compose.prod.yml"
ENV_FILE="${ROOT_DIR}/.env"

# Read a single key from .env without sourcing (avoids bash readonly vars like UID).
read_env() {
  local key="$1"
  local default="${2:-}"
  if [[ ! -f "${ENV_FILE}" ]]; then
    echo "${default}"
    return
  fi
  local line
  line="$(grep -E "^${key}=" "${ENV_FILE}" | tail -1 || true)"
  if [[ -z "${line}" ]]; then
    echo "${default}"
    return
  fi
  local val="${line#*=}"
  val="${val%\"}"
  val="${val#\"}"
  val="${val%\'}"
  val="${val#\'}"
  echo "${val}"
}

IMAGE_TAG="$(read_env IMAGE_TAG "")"
IMAGE_REGISTRY="$(read_env IMAGE_REGISTRY "ghcr.io/nandaiqbalh/sekolah-aparatur")"
APP_PORT="$(read_env APP_PORT "3002")"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "ERROR: ${ENV_FILE} not found."
  echo "See docs/engineering/branching-and-deployment.md"
  exit 1
fi

if [[ -z "${IMAGE_TAG}" ]]; then
  echo "ERROR: IMAGE_TAG is not set in .env"
  echo "Append a short commit SHA, for example:"
  echo "  IMAGE_TAG=a81f92c"
  echo "See docs/engineering/branching-and-deployment.md"
  exit 1
fi

if [[ "${IMAGE_TAG}" == "latest" ]]; then
  echo "WARNING: IMAGE_TAG=latest is not immutable. Prefer a commit SHA for production."
fi

cd "${ROOT_DIR}"

echo "==> Deploying IMAGE_TAG=${IMAGE_TAG}"
echo "==> IMAGE_REGISTRY=${IMAGE_REGISTRY}"
echo "==> APP_PORT=${APP_PORT}"
echo "==> Pulling images (postgres + app)..."
docker compose -f "${COMPOSE_FILE}" pull

echo "==> Local compose images:"
docker compose -f "${COMPOSE_FILE}" images

echo "==> Ensuring db is up..."
docker compose -f "${COMPOSE_FILE}" up -d db
echo "==> Waiting for db to accept connections..."
for i in $(seq 1 30); do
  if docker compose -f "${COMPOSE_FILE}" exec -T db pg_isready >/dev/null 2>&1; then
    echo "==> db ready"
    break
  fi
  if [[ "${i}" -eq 30 ]]; then
    echo "WARNING: db not ready yet — app migrate may fail; check db logs"
  fi
  sleep 2
done

echo "==> Recreating app (force — picks up .env + compose env)..."
docker compose -f "${COMPOSE_FILE}" up -d --force-recreate --no-deps app

echo "==> Waiting for app health..."
for i in $(seq 1 30); do
  if curl -fsS -o /dev/null "http://127.0.0.1:${APP_PORT}/" 2>/dev/null; then
    echo "==> App responding on :${APP_PORT}"
    break
  fi
  if [[ "${i}" -eq 30 ]]; then
    echo "WARNING: app not responding yet — check logs"
  fi
  sleep 2
done

echo
echo "Deploy complete."
echo "Running image:"
docker compose -f "${COMPOSE_FILE}" ps app
echo
echo "Check: docker compose -f docker-compose.prod.yml ps"
echo "Logs:  docker compose -f docker-compose.prod.yml logs --tail=100 app"
echo
echo "Smoke: curl -fsS http://127.0.0.1:${APP_PORT}/ | head"
echo "Seed:  docker compose -f docker-compose.prod.yml exec app npx prisma db seed"
echo
echo "See docs/engineering/branching-and-deployment.md for deploy, nginx, and rollback."
