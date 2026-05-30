<script setup lang="ts">
import AdminShell from '~/components/admin/AdminShell.vue'
import type { Car } from '~/types/car'
import { formatPrice } from '~/utils/format'

const { adminFetch, readyTelegramWebApp } = useAdminApi()
const carsResponse = ref<{ data: Car[] }>()
const searchQuery = ref('')
const isLoadingCars = ref(false)
const errorMessage = ref('')

const cars = computed(() => carsResponse.value?.data ?? [])

const loadCars = async () => {
  isLoadingCars.value = true
  errorMessage.value = ''

  try {
    carsResponse.value = await adminFetch<{ data: Car[] }>('/api/admin/cars', {
      query: {
        query: searchQuery.value.trim(),
        limit: 20
      }
    })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Нет доступа к админке'
  } finally {
    isLoadingCars.value = false
  }
}

onMounted(async () => {
  readyTelegramWebApp()
  await loadCars()
})

useHead({
  title: 'Админка AutoHub KG'
})
</script>

<template>
  <AdminShell title="Админка" subtitle="Быстрые действия для ежедневного управления объявлениями через Telegram Mini App.">
    <div class="grid gap-4">
      <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 class="text-lg font-bold">Ежедневные действия</h2>

        <div class="mt-4 grid gap-3">
          <NuxtLink
            to="/admin/cars/new"
            class="focus-ring flex min-h-11 items-center justify-between rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white shadow-sm shadow-emerald-600/20"
          >
            <span>Добавить автомобиль</span>
            <span aria-hidden="true">+</span>
          </NuxtLink>

          <button class="min-h-11 cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 text-left text-sm font-bold text-slate-400" disabled type="button">
            Исправить марку или модель
          </button>

          <button class="min-h-11 cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 text-left text-sm font-bold text-slate-400" disabled type="button">
            Снять объявление с публикации
          </button>

          <NuxtLink
            to="/admin/categories"
            class="focus-ring flex min-h-11 items-center justify-between rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-950"
          >
            <span>Категории и типы</span>
            <span aria-hidden="true">›</span>
          </NuxtLink>
        </div>
      </section>

      <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-lg font-bold">Поиск авто</h2>
          <span class="text-sm font-bold text-slate-500">{{ cars.length }}</span>
        </div>

        <form class="mt-4 grid gap-3" @submit.prevent="loadCars">
          <input
            v-model.trim="searchQuery"
            class="focus-ring min-h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-950 placeholder:text-slate-400"
            placeholder="Марка, модель, город, название"
          >

          <button
            class="focus-ring min-h-10 rounded-lg bg-slate-950 px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isLoadingCars"
            type="submit"
          >
            {{ isLoadingCars ? 'Ищем...' : 'Найти' }}
          </button>
        </form>

        <p v-if="errorMessage" class="mt-4 rounded-lg bg-rose-50 p-4 text-sm font-bold text-rose-700">
          {{ errorMessage }}
        </p>

        <div class="mt-4 grid gap-3">
          <article
            v-for="car in cars"
            :key="car.id"
            class="grid gap-3 rounded-lg border border-slate-100 p-3"
          >
            <div class="flex gap-3">
              <img :src="car.images[0]" :alt="car.title" class="h-16 w-20 rounded-xl object-cover">
              <div class="min-w-0">
                <p class="truncate text-sm font-bold text-slate-950">{{ car.title }}</p>
                <p class="mt-1 text-sm font-bold text-slate-600">{{ car.city }} · {{ formatPrice(car.price) }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <NuxtLink
                :to="`/admin/cars/${car.id}/edit`"
                class="focus-ring min-h-11 rounded-lg bg-emerald-600 px-3 py-3 text-center text-sm font-bold text-white"
              >
                Изменить
              </NuxtLink>

              <NuxtLink
                :to="{ path: `/cars/${car.id}`, query: { from: 'admin' } }"
                class="focus-ring min-h-11 rounded-lg border border-slate-200 px-3 py-3 text-center text-sm font-bold text-slate-950"
              >
                Открыть
              </NuxtLink>
            </div>
          </article>

          <p v-if="!isLoadingCars && !cars.length && !errorMessage" class="rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-500">
            Ничего не найдено.
          </p>
        </div>
      </section>

      <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 class="text-lg font-bold">Редкие настройки</h2>
        <p class="mt-2 text-sm leading-6 text-slate-600">
          Логотип, главный фон и тексты лучше держать отдельно от ежедневного добавления авто.
        </p>

        <NuxtLink
          to="/admin/settings"
          class="focus-ring mt-4 flex min-h-11 items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-950"
        >
          <span>Настройки сайта</span>
          <span aria-hidden="true">›</span>
        </NuxtLink>
      </section>
    </div>
  </AdminShell>
</template>
