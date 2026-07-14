#!/usr/bin/env sh
set -eu

APP_NAME="E-Mailer"

info() {
  printf '%s\n' "==> $1"
}

fail() {
  printf '%s\n' "Error: $1" >&2
  exit 1
}

if [ ! -f /etc/os-release ]; then
  fail "Cannot detect operating system. Debian 12+ or Ubuntu 22.04+ is required."
fi

. /etc/os-release

case "${ID:-}" in
  debian|ubuntu)
    ;;
  *)
    fail "$APP_NAME supports Debian and Ubuntu. Detected: ${PRETTY_NAME:-unknown OS}"
    ;;
esac

if ! command -v docker >/dev/null 2>&1; then
  fail "Docker is not installed. Install Docker first: https://docs.docker.com/engine/install/"
fi

if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE="docker-compose"
else
  fail "Docker Compose is not installed."
fi

if [ ! -f .env ]; then
  info "Creating .env from .env.example"
  cp .env.example .env
fi

info "Building and starting containers"
$COMPOSE up -d --build

info "$APP_NAME is running"
info "Admin UI: http://localhost:8080"
info "Next: edit .env for your real domain and restart with '$COMPOSE up -d'"
