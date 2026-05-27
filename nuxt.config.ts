// https://nuxt.com/docs/api/configuration/nuxt-config
const hmrHost = process.env.NUXT_HMR_HOST?.replace(/^https?:\/\//, '').replace(/\/$/, '')
const allowedHosts = [
  hmrHost,
  process.env.NUXT_ALLOWED_HOST,
  '.pinggy-free.link',
  '.a.pinggy.link'
].filter(Boolean) as string[]

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],
  vite: {
    server: {
      allowedHosts,
      hmr: hmrHost
        ? {
            protocol: 'wss',
            host: hmrHost,
            clientPort: 443
          }
        : undefined
    }
  },
  tailwindcss: {
    cssPath: '~/assets/css/main.css'
  },
  app: {
    head: {
      title: 'AutoHub KG - автомобили с прозрачной историей',
      meta: [
        {
          name: 'description',
          content: 'Mobile-first демо автомобильного маркетплейса Кыргызстана на Nuxt 4.'
        }
      ],
      script: [
        {
          src: 'https://telegram.org/js/telegram-web-app.js'
        }
      ]
    }
  }
})
