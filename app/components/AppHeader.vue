<script setup lang="ts">
import type { SiteSettings } from '~/types/settings'

const isMenuOpen = ref(false)
const route = useRoute()
const { favoriteIds, loadFavorites } = useFavorites()
const { data: settingsResponse } = await useFetch<{ data: SiteSettings }>('/api/settings')

const settings = computed(() => settingsResponse.value?.data)

const links = [
  { label: 'Купить', to: '/' },
  { label: 'Продать', to: '/' },
  { label: 'Лизинг', to: '/' },
  { label: 'Избранное', to: '/' }
]

watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
  }
)

onMounted(loadFavorites)
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
    <div class="container-page">
      <div class="flex h-16 items-center justify-between gap-3">
        <NuxtLink to="/" class="focus-ring flex items-center gap-2 rounded-xl">
          <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-black text-white">
            {{ settings?.logoInitial ?? 'A' }}
          </span>
          <span class="text-lg font-black tracking-tight text-slate-950">{{ settings?.logoText ?? 'AutoHub KG' }}</span>
        </NuxtLink>

        <nav class="hidden items-center gap-1 md:flex">
          <NuxtLink
            v-for="link in links"
            :key="link.label"
            :to="link.to"
            class="focus-ring rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
          >
            {{ link.label }}
            <span v-if="link.label === 'Избранное' && favoriteIds.length" class="ml-1 text-emerald-700">
              {{ favoriteIds.length }}
            </span>
          </NuxtLink>
        </nav>

        <div class="hidden items-center gap-2 md:flex">
          <button class="focus-ring rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50">
            Войти
          </button>
        </div>

        <button
          class="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 md:hidden"
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

      <div v-if="isMenuOpen" class="border-t border-slate-100 pb-4 pt-3 md:hidden">
        <nav class="grid gap-2">
          <NuxtLink
            v-for="link in links"
            :key="link.label"
            :to="link.to"
            class="focus-ring flex min-h-12 items-center justify-between rounded-2xl px-4 text-base font-bold text-slate-800 hover:bg-slate-100"
          >
            <span>{{ link.label }}</span>
            <span v-if="link.label === 'Избранное' && favoriteIds.length" class="rounded-full bg-emerald-100 px-2.5 py-1 text-xs text-emerald-800">
              {{ favoriteIds.length }}
            </span>
          </NuxtLink>
          <button class="focus-ring mt-2 min-h-12 rounded-2xl bg-slate-950 px-4 text-base font-bold text-white">
            Войти
          </button>
        </nav>
      </div>
    </div>
  </header>
</template>
