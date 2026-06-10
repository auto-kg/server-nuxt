# Локальный запуск проекта

Порядок ниже рассчитан на папку `auto`.

## 1. Подготовить `.env`

```bash
cd /home/erkin/Desktop/lyambar/auto
cp .env.example .env
nano .env
```

Минимально проверь эти значения:

```env
NUXT_HOST_PORT=3001
POSTGRES_HOST_PORT=5433

POSTGRES_DB=autohub
POSTGRES_USER=autohub
POSTGRES_PASSWORD=localpass
DATABASE_URL=postgres://autohub:localpass@postgres:5432/autohub

STORAGE_DRIVER=s3
MINIO_API_HOST_PORT=9000
MINIO_CONSOLE_HOST_PORT=9001
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
S3_BUCKET=autohub-uploads
S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_PUBLIC_BASE_URL=http://127.0.0.1:9000/autohub-uploads
S3_FORCE_PATH_STYLE=true

NUXT_ALLOWED_HOST=.pinggy-free.link
PUBLIC_SITE_URL=
NUXT_HMR_HOST=
```

Если порт `9000` занят, используй другие порты:

```env
MINIO_API_HOST_PORT=9010
MINIO_CONSOLE_HOST_PORT=9011
S3_PUBLIC_BASE_URL=http://127.0.0.1:9010/autohub-uploads
```

`S3_ENDPOINT` при запуске Nuxt внутри Docker оставь:

```env
S3_ENDPOINT=http://minio:9000
```

Если запускаешь Nuxt через `pnpm dev` на хосте, поменяй:

```env
S3_ENDPOINT=http://127.0.0.1:9000
```

или при занятых портах:

```env
S3_ENDPOINT=http://127.0.0.1:9010
```

## 2. Запустить Postgres и MinIO

```bash
docker compose up -d postgres minio minio-init
```

Проверка:

```bash
docker compose ps
```

MinIO console:

```text
http://127.0.0.1:9001
```

Логин/пароль по умолчанию:

```text
minioadmin / minioadmin
```

Если используешь порты `9010/9011`, console будет:

```text
http://127.0.0.1:9011
```

## 3. Применить миграции БД

Если Nuxt запускается через Docker:

```bash
docker compose run --rm nuxt pnpm db:migrate
```

Если Nuxt запускается локально через `pnpm`:

```bash
pnpm db:migrate
```

Для локального `pnpm db:migrate` нужен `DATABASE_URL`, доступный с хоста, например:

```env
DATABASE_URL=postgres://autohub:localpass@127.0.0.1:5433/autohub
```

После миграции для Docker-режима верни:

```env
DATABASE_URL=postgres://autohub:localpass@postgres:5432/autohub
```

## 4. Запустить Nuxt

Вариант A: через Docker

```bash
docker compose up -d --build nuxt
```

Проверка:

```bash
curl -I http://127.0.0.1:3001
```

Вариант B: локально через `pnpm dev`

Для этого в `.env` должны быть host-адреса:

```env
DATABASE_URL=postgres://autohub:localpass@127.0.0.1:5433/autohub
S3_ENDPOINT=http://127.0.0.1:9000
S3_PUBLIC_BASE_URL=http://127.0.0.1:9000/autohub-uploads
```

Запуск:

```bash
pnpm dev --host 0.0.0.0 --port 3001
```

Проверка:

```bash
curl -I http://127.0.0.1:3001
```

## 5. Запустить Pinggy для Nuxt

В отдельном терминале:

```bash
ssh -p 443 -R0:localhost:3001 -t free.pinggy.io x:https
```

Pinggy выдаст публичный HTTPS URL вида:

```text
https://xxxxx.pinggy-free.link
```

Скопируй этот URL.

## 6. Обновить `.env` после Pinggy

В `auto/.env` поставь:

```env
PUBLIC_SITE_URL=https://xxxxx.pinggy-free.link
NUXT_HMR_HOST=https://xxxxx.pinggy-free.link
NUXT_ALLOWED_HOST=.pinggy-free.link
```

Если Mini App или Telegram bot используют публичный адрес Nuxt, этот же URL нужно прописать в env бота:

```env
MINI_APP_BASE_URL=https://xxxxx.pinggy-free.link
```

После изменения env перезапусти Nuxt.

Docker:

```bash
docker compose up -d --build nuxt
```

pnpm dev:

```bash
Ctrl+C
pnpm dev --host 0.0.0.0 --port 3001
```

## 7. Проверить загрузку файлов в MinIO

1. Открой админку.
2. Загрузи изображение автомобиля или hero/logo.
3. Проверь bucket в MinIO console:

```text
http://127.0.0.1:9001
```

Bucket:

```text
autohub-uploads
```

Файлы должны появляться в папках:

```text
cars/
site/
```

URL файлов должен начинаться с:

```text
http://127.0.0.1:9000/autohub-uploads/...
```

Если используешь порт `9010`:

```text
http://127.0.0.1:9010/autohub-uploads/...
```

## 8. Быстрая диагностика

Статус контейнеров:

```bash
docker compose ps
```

Логи Nuxt:

```bash
docker compose logs -f nuxt
```

Логи MinIO init:

```bash
docker compose logs minio-init
```

Проверить bucket:

```bash
curl -I http://127.0.0.1:9000/autohub-uploads/
```

Если порт `9000` занят:

```bash
curl -I http://127.0.0.1:9010/autohub-uploads/
```

Остановить проект:

```bash
docker compose down
```

Остановить с удалением volume данных:

```bash
docker compose down -v
```

Команду с `-v` используй только если можно удалить локальную БД и файлы MinIO.

