# DNS Setup

For each domain, E-Mailer shows DNS records in the admin UI.

## Required Records

### MX

Routes incoming mail to your mail server.

```txt
example.com MX 10 mail.example.com
```

### SPF

Allows the domain MX server to send mail.

```txt
example.com TXT v=spf1 mx -all
```

### DKIM

Publishes a public key used to verify signed outbound mail.

```txt
default._domainkey.example.com TXT v=DKIM1; k=rsa; p=...
```

### DMARC

Defines what receivers should do when SPF or DKIM fails.

```txt
_dmarc.example.com TXT v=DMARC1; p=quarantine; rua=mailto:postmaster@example.com
```

## Important

Reverse DNS must also point your server IP back to your mail hostname. This is usually configured at your VPS or hosting provider, not at your DNS provider.
