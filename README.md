# AutoHub Nuxt

Nuxt 4 site, admin Mini App pages, and Postgres.

## Server Setup

Caddy should terminate HTTPS and proxy to the Nuxt container:

```caddyfile
autohub-63-180-133-249.sslip.io {
  reverse_proxy 127.0.0.1:3001
}
```

Create env:

```bash
cp .env.example .env
nano .env
```

Keep `POSTGRES_PASSWORD` and `DATABASE_URL` aligned:

```env
POSTGRES_PASSWORD=change_this
DATABASE_URL=postgres://autohub:change_this@postgres:5432/autohub
```

Start database:

```bash
docker compose up -d postgres
```

Apply migrations:

```bash
docker compose run --rm nuxt pnpm db:migrate
```

Start Nuxt:

```bash
docker compose up -d --build
```

Check:

```bash
docker compose ps
curl -I http://127.0.0.1:3001
curl -I https://autohub-63-180-133-249.sslip.io
```

## Local Development

```bash
pnpm install
pnpm dev --host 0.0.0.0
```
