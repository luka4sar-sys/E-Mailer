#!/usr/bin/env sh
set -eu

printf '%s\n' "E-Mailer environment check"

if [ -f /etc/os-release ]; then
  . /etc/os-release
  printf '%s\n' "OS: ${PRETTY_NAME:-unknown}"
else
  printf '%s\n' "OS: unknown"
fi

if command -v docker >/dev/null 2>&1; then
  docker --version
else
  printf '%s\n' "Docker: missing"
fi

if docker compose version >/dev/null 2>&1; then
  docker compose version
elif command -v docker-compose >/dev/null 2>&1; then
  docker-compose --version
else
  printf '%s\n' "Docker Compose: missing"
fi

printf '%s\n' "Required production ports: 25, 465, 587, 993, 80, 443"
printf '%s\n' "MVP admin port: 8080"
