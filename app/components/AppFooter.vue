<script setup lang="ts">
import type { SiteSettings } from '~/types/settings'

const fallbackSettings: SiteSettings = {
  logoText: 'ЛЯМБАР',
  logoInitial: 'L',
  logoImage: '/uploads/site-logo.png',
  heroBadge: '',
  heroTitle: '',
  heroSubtitle: '',
  heroImage: '/uploads/site-hero.png',
  footerDescription: 'Автомобильный маркетплейс Кыргызстана с удобным каталогом, фильтрами и карточками автомобилей.',
  telegramUrl: '',
  instagramUrl: '',
  whatsappUrl: ''
}

const { data: settingsResponse } = await useFetch<{ data: SiteSettings }>('/api/settings')
const settings = computed(() => settingsResponse.value?.data ?? fallbackSettings)
const socialLinks = computed(() => [
  {
    label: 'Telegram',
    url: settings.value.telegramUrl,
    icon: 'telegram'
  },
  {
    label: 'Instagram',
    url: settings.value.instagramUrl,
    icon: 'instagram'
  },
  {
    label: 'WhatsApp',
    url: settings.value.whatsappUrl,
    icon: 'whatsapp'
  }
].filter((link) => link.url.trim()))
</script>

<template>
  <footer class="w-full border-t border-white/35 bg-white/35 backdrop-blur-xl">
    <div class="content-page py-6 sm:py-8">
      <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-lg font-semibold uppercase tracking-[0.32em] text-neutral-950">{{ settings.logoText }}</p>
          <p class="mt-2 max-w-xl text-sm leading-6 text-neutral-600">
            {{ settings.footerDescription }}
          </p>
        </div>
        <nav class="flex items-center gap-3 text-sm font-semibold text-neutral-600">
<!--          <NuxtLink class="focus-ring rounded-md hover:text-neutral-950" to="/favorites">Избранное</NuxtLink>-->
          <a
            v-for="link in socialLinks"
            :key="link.label"
            :href="link.url"
            :aria-label="link.label"
            class="focus-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-neutral-950/10 bg-white/25 text-neutral-700 backdrop-blur transition hover:border-neutral-950/25 hover:bg-white/45 hover:text-neutral-950"
            rel="noopener noreferrer"
            target="_blank"
          >
            <svg v-if="link.icon === 'telegram'" class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21.8 4.6 18.5 20c-.2.9-.8 1.1-1.6.7l-4.8-3.6-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.5 13.6 1.8 12.1c-1-.3-1-1 .2-1.5L20.3 3.5c.9-.3 1.7.2 1.5 1.1Z" fill="currentColor" />
            </svg>
            <svg v-else-if="link.icon === 'instagram'" class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" stroke-width="2" />
              <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="2" />
              <circle cx="17" cy="7" r="1.2" fill="currentColor" />
            </svg>
            <svg v-else class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5.1 19 6 15.6A7.8 7.8 0 1 1 9.2 19l-4.1 0Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" />
              <path d="M9.6 8.7c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.4.5c-.1.2-.2.3 0 .6.4.8 1.2 1.7 2.1 2.2.3.2.5.2.7-.1l.6-.7c.2-.2.4-.2.7-.1l1.5.7c.3.2.4.3.4.6-.1.8-.8 1.7-1.7 1.8-1.4.2-3.5-.7-5.2-2.3-1.6-1.6-2.7-3.8-2.4-5 .1-.5.5-.9.9-1Z" fill="currentColor" />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  </footer>
</template>
