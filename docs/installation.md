# Installation

## Supported Systems

- Debian 12+
- Ubuntu 22.04+
- Ubuntu 24.04+

## Requirements

- A server with a public IPv4 address.
- Docker Engine.
- Docker Compose.
- A domain where you can edit DNS records.

## Install

```bash
git clone https://github.com/luka4sar-sys/E-Mailer.git
cd e-mailer
cp .env.example .env
./scripts/install.sh
```

Open:

```txt
http://localhost:8080
```

For a remote server, replace `localhost` with the server IP or hostname.

## Configure

Edit `.env`:

```env
E_MAILER_HOSTNAME=mail.example.com
E_MAILER_PUBLIC_URL=https://mail.example.com
E_MAILER_ADMIN_EMAIL=admin@example.com
POSTGRES_PASSWORD=change-this-password
```

Restart:

```bash
docker compose up -d
```
