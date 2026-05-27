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

## Upload Storage

Current driver:

```env
STORAGE_DRIVER=local
UPLOADS_DIR=/app/.output/public/uploads
PUBLIC_UPLOADS_BASE_URL=/uploads
UPLOAD_MAX_FILE_SIZE_MB=8
UPLOADS_HOST_DIR=./uploads
```

In Docker, uploaded files are stored on the host in:

```text
./uploads/cars
./uploads/site
```

On the server you can use an absolute path:

```env
UPLOADS_HOST_DIR=/var/lib/autohub/uploads
```

Create host directories before starting Docker:

```bash
sudo mkdir -p /var/lib/autohub/uploads/cars /var/lib/autohub/uploads/site
```

The public URL saved to the database should stay relative:

```text
/uploads/cars/file.jpg
/uploads/site/file.jpg
```

Admin upload endpoint:

```text
POST /api/admin/uploads
```

Request:

```text
multipart/form-data
file=<image>
```

Response:

```json
{
  "data": [
    {
      "path": "/uploads/cars/file.jpg",
      "url": "/uploads/cars/file.jpg"
    }
  ]
}
```

Future S3/R2 settings are already reserved in `.env.example`, but `STORAGE_DRIVER=s3` intentionally returns `501` until the driver is implemented.

## Local Development

```bash
pnpm install
pnpm dev --host 0.0.0.0
```
