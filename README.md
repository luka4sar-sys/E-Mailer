# E-Mailer

Self-hosted mail platform with a simple Docker installation, admin UI, domain setup guidance, DNS checks, and a clean webmail-ready interface.

> Status: early MVP scaffold. The current version provides the project structure, installer, admin UI, API, and DNS guidance flow. Real Postfix/Dovecot/Rspamd integration comes next.

## Goals

- Install on a server in a few commands.
- Support Debian 12+ and Ubuntu 22.04/24.04.
- Configure mail domains through a web admin UI.
- Show the exact DNS records required for MX, SPF, DKIM, and DMARC.
- Provide a clean dark UI with a blue primary accent.
- Grow into a full mail stack powered by proven components.

## Quick Start

```bash
git clone https://github.com/luka4sar-sys/E-Mailer.git
cd e-mailer
cp .env.example .env
chmod +x scripts/*.sh
./scripts/install.sh
```

Then open:

```txt
http://localhost:8080
```

## Manual Docker Start

```bash
cp .env.example .env
docker compose up -d --build
```

## Services

- `admin-ui`: web admin interface.
- `api`: domain and DNS guidance API.
- `postgres`: storage for domains and mailboxes.

Planned mail services:

- `postfix`: SMTP.
- `dovecot`: IMAP.
- `rspamd`: spam filtering and DKIM signing.
- `caddy`: TLS and reverse proxy.

## Required Ports

For the final mail server stack, your server will need:

- `25/tcp` SMTP
- `465/tcp` SMTPS
- `587/tcp` Submission
- `993/tcp` IMAPS
- `80/tcp` HTTP for Let's Encrypt
- `443/tcp` HTTPS

This MVP exposes the admin UI on `8080/tcp`.

## License

MIT
