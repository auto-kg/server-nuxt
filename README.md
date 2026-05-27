# AutoHub Nuxt

Nuxt 4 site and Telegram Mini App admin pages.

## Setup

Make sure to install dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev --host 0.0.0.0
```

## Admin Security Variables

The admin API requires validated Telegram Mini App `initData`.

```env
BOT_TOKEN=123456789:telegram-bot-token
ADMIN_GROUP_ID=-1001234567890
```

Optional fallback allowlist:

```env
ADMIN_TELEGRAM_IDS=123456789,987654321
```

Allowed Telegram group statuses are `creator` and `administrator`.

## Telegram Mini App With Pinggy

Use this order. Do not set `NUXT_HMR_HOST` before Pinggy gives you a URL.

Terminal 1:

```bash
cd /home/erkin/Desktop/lyambar/auto
pnpm dev --host 0.0.0.0
```

Terminal 2:

```bash
ssh -p 443 -R0:localhost:3000 -t free.pinggy.io x:https
```

Pinggy will print an HTTPS URL. Put that full URL into `../bot/.env`:

```env
MINI_APP_BASE_URL=https://your-url.a.pinggy.link
```

Then start or restart the bot.

If you need HMR inside the Telegram WebApp, restart Nuxt after you already know the Pinggy host:

```bash
NUXT_HMR_HOST=your-url.a.pinggy.link pnpm dev --host 0.0.0.0
```

For normal Telegram testing, HMR is optional. The Mini App works through Pinggy without it; refresh the WebApp manually after code changes.

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```
