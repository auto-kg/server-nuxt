<script setup lang="ts">
import AdminShell from '~/components/admin/AdminShell.vue'
import type { Car } from '~/types/car'
import { formatPrice } from '~/utils/format'

const { adminFetch, readyTelegramWebApp } = useAdminApi()
const carsResponse = ref<{ data: Car[] }>()
const errorMessage = ref('')

const latestCars = computed(() => carsResponse.value?.data.slice(0, 4) ?? [])

onMounted(async () => {
  readyTelegramWebApp()

  try {
    carsResponse.value = await adminFetch<{ data: Car[] }>('/api/admin/cars')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Нет доступа к админке'
  }
})

useHead({
  title: 'Админка AutoHub KG'
})
</script>

<template>
  <AdminShell title="Админка" subtitle="Быстрые действия для ежедневного управления объявлениями через Telegram Mini App.">
    <div class="grid gap-4">
      <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 class="text-lg font-black">Ежедневные действия</h2>

        <div class="mt-4 grid gap-3">
          <NuxtLink
            to="/admin/cars/new"
            class="focus-ring flex min-h-14 items-center justify-between rounded-2xl bg-emerald-600 px-4 text-base font-black text-white shadow-lg shadow-emerald-600/20"
          >
            <span>Добавить автомобиль</span>
            <span aria-hidden="true">+</span>
          </NuxtLink>

          <button class="focus-ring min-h-14 rounded-2xl border border-slate-200 bg-white px-4 text-left text-base font-black text-slate-950">
            Исправить марку или модель
          </button>

          <button class="focus-ring min-h-14 rounded-2xl border border-slate-200 bg-white px-4 text-left text-base font-black text-slate-950">
            Снять объявление с публикации
          </button>

          <NuxtLink
            to="/admin/categories"
            class="focus-ring flex min-h-14 items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-base font-black text-slate-950"
          >
            <span>Популярные категории</span>
            <span aria-hidden="true">›</span>
          </NuxtLink>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-lg font-black">Последние авто</h2>
          <span class="text-sm font-black text-slate-500">{{ carsResponse?.data.length ?? 0 }}</span>
        </div>

        <p v-if="errorMessage" class="mt-4 rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-700">
          {{ errorMessage }}
        </p>

        <div class="mt-4 grid gap-3">
          <NuxtLink
            v-for="car in latestCars"
            :key="car.id"
            :to="`/cars/${car.id}`"
            class="focus-ring flex gap-3 rounded-2xl border border-slate-100 p-3"
          >
            <img :src="car.images[0]" :alt="car.title" class="h-16 w-20 rounded-xl object-cover">
            <div class="min-w-0">
              <p class="truncate text-sm font-black text-slate-950">{{ car.title }}</p>
              <p class="mt-1 text-sm font-bold text-slate-600">{{ car.city }} · {{ formatPrice(car.price) }}</p>
            </div>
          </NuxtLink>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 class="text-lg font-black">Редкие настройки</h2>
        <p class="mt-2 text-sm leading-6 text-slate-600">
          Логотип, главный фон и тексты лучше держать отдельно от ежедневного добавления авто.
        </p>

        <NuxtLink
          to="/admin/settings"
          class="focus-ring mt-4 flex min-h-14 items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-black text-slate-950"
        >
          <span>Настройки сайта</span>
          <span aria-hidden="true">›</span>
        </NuxtLink>
      </section>
    </div>
  </AdminShell>
</template>
