<script setup lang="ts">
import type { SiteSettings } from '~/types/settings'

const isMenuOpen = ref(false)
const route = useRoute()
const { favoriteIds, loadFavorites } = useFavorites()
const { data: settingsResponse } = await useFetch<{ data: SiteSettings }>('/api/settings')

const settings = computed(() => settingsResponse.value?.data)
const logoImage = computed(() => settings.value?.logoImage?.trim() || '')
const isLogoImageHidden = ref(false)

const links = [
  { label: 'Избранное', to: '/favorites' }
]

watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
  }
)

watch(logoImage, () => {
  isLogoImageHidden.value = false
})

onMounted(loadFavorites)
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-40">
    <div class="w-full border-b border-white/45 bg-white/35 px-4 shadow-[0_18px_60px_rgba(20,22,24,0.1)] backdrop-blur-xl sm:px-6 lg:px-8">
      <div class="flex h-14 items-center justify-between gap-3">
        <NuxtLink to="/" class="focus-ring flex min-w-0 items-center gap-3 rounded-md">
          <img
            v-if="logoImage && !isLogoImageHidden"
            :src="logoImage"
            :alt="settings?.logoText ?? 'ЛЯМБАР'"
            class="h-9 w-9 rounded-md object-contain"
            @error="isLogoImageHidden = true"
          >
          <span v-else class="flex h-9 w-9 items-center justify-center rounded-md bg-neutral-950 text-xs font-semibold text-white">
            {{ settings?.logoInitial ?? 'A' }}
          </span>
          <span class="truncate text-base font-semibold uppercase tracking-[0.42em] text-neutral-950">{{ settings?.logoText ?? 'AutoHub KG' }}</span>
        </NuxtLink>

        <nav class="hidden items-center gap-8 md:flex">
          <NuxtLink
            to="/"
            class="focus-ring rounded-sm text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-700 transition hover:text-neutral-950"
          >
            Главная
          </NuxtLink>
          <NuxtLink
            to="/catalog"
            class="focus-ring rounded-sm text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-700 transition hover:text-neutral-950"
          >
            Каталог
          </NuxtLink>
          <NuxtLink
            v-for="link in links"
            :key="link.label"
            :to="link.to"
            class="focus-ring rounded-sm text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-700 transition hover:text-neutral-950"
          >
            {{ link.label }}
            <span v-if="link.label === 'Избранное' && favoriteIds.length" class="ml-1 text-neutral-950">
              {{ favoriteIds.length }}
            </span>
          </NuxtLink>
        </nav>

        <div class="hidden items-center gap-2 md:flex">
          <span class="h-6 w-px bg-neutral-950/15" />
          <BlackButton compact>
            Связаться
            <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" />
            </svg>
          </BlackButton>
        </div>

        <button
          class="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-neutral-950/10 bg-white/35 text-neutral-950 backdrop-blur md:hidden"
          type="button"
          :aria-expanded="isMenuOpen"
          aria-label="Открыть меню"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span class="relative h-4 w-5">
            <span
              class="absolute left-0 top-0 h-0.5 w-5 rounded bg-current transition"
              :class="{ 'translate-y-2 rotate-45': isMenuOpen }"
            />
            <span
              class="absolute left-0 top-2 h-0.5 w-5 rounded bg-current transition"
              :class="{ 'opacity-0': isMenuOpen }"
            />
            <span
              class="absolute left-0 top-4 h-0.5 w-5 rounded bg-current transition"
              :class="{ '-translate-y-2 -rotate-45': isMenuOpen }"
            />
          </span>
        </button>
      </div>

      <div v-if="isMenuOpen" class="border-t border-neutral-950/10 pb-4 pt-3 md:hidden">
        <nav class="grid gap-2">
          <NuxtLink
            to="/"
            class="focus-ring flex min-h-10 items-center rounded-md px-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-800 hover:bg-white/35"
          >
            Главная
          </NuxtLink>
          <NuxtLink
            to="/catalog"
            class="focus-ring flex min-h-10 items-center rounded-md px-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-800 hover:bg-white/35"
          >
            Каталог
          </NuxtLink>
          <NuxtLink
            v-for="link in links"
            :key="link.label"
            :to="link.to"
            class="focus-ring flex min-h-10 items-center justify-between rounded-md px-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-800 hover:bg-white/35"
          >
            <span>{{ link.label }}</span>
            <span v-if="link.label === 'Избранное' && favoriteIds.length" class="rounded-full bg-neutral-950 px-2.5 py-1 text-xs text-white">
              {{ favoriteIds.length }}
            </span>
          </NuxtLink>
          <BlackButton class="mt-2">
            Связаться
          </BlackButton>
        </nav>
      </div>
    </div>
  </header>
</template>
