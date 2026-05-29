<script setup lang="ts">
import type { Car } from '~/types/car'
import { formatMileage, formatPrice } from '~/utils/format'

const props = defineProps<{
  car: Car
}>()

const { isFavorite, toggleFavorite } = useFavorites()
const favorite = computed(() => isFavorite(props.car.id))
</script>

<template>
  <article class="group rounded-lg border border-white/35 bg-white/35 p-3 shadow-[0_18px_60px_rgba(17,19,21,0.08)] backdrop-blur-xl transition hover:border-white/60 hover:bg-white/45">
    <div class="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)_auto] sm:items-center">
      <NuxtLink :to="`/cars/${car.id}`" class="block overflow-hidden rounded-md bg-neutral-200">
        <img
          :src="car.images[0]"
          :alt="car.title"
          class="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-28 sm:aspect-auto"
          loading="lazy"
        >
      </NuxtLink>

      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <PriceBadge :label="car.priceBadge" />
          <PriceBadge v-if="car.isUrgent" label="Срочно" />
          <span class="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">{{ car.city }}</span>
        </div>

        <NuxtLink :to="`/cars/${car.id}`" class="focus-ring mt-2 block rounded-md">
          <h3 class="truncate text-base font-semibold text-neutral-950">{{ car.title }}</h3>
        </NuxtLink>

        <div class="mt-2 flex flex-wrap gap-2 text-xs font-medium text-neutral-600">
          <span class="rounded-md border border-white/35 bg-white/30 px-2.5 py-1.5 backdrop-blur">{{ car.year }}</span>
          <span class="rounded-md border border-white/35 bg-white/30 px-2.5 py-1.5 backdrop-blur">{{ formatMileage(car.mileage) }}</span>
          <span class="rounded-md border border-white/35 bg-white/30 px-2.5 py-1.5 backdrop-blur">{{ car.fuel }}</span>
          <span class="rounded-md border border-white/35 bg-white/30 px-2.5 py-1.5 backdrop-blur">{{ car.transmission }}</span>
        </div>
      </div>

      <div class="flex items-center justify-between gap-3 sm:grid sm:min-w-36 sm:justify-items-end">
        <p class="text-lg font-semibold text-neutral-950 sm:text-xl">{{ formatPrice(car.price) }}</p>

        <div class="flex gap-2">
          <button
            class="focus-ring flex h-10 w-10 items-center justify-center rounded-md border backdrop-blur transition"
            :class="favorite ? 'border-rose-200 bg-rose-50/90 text-rose-600' : 'border-white/45 bg-white/35 text-neutral-700 hover:text-rose-500'"
            type="button"
            :aria-label="favorite ? 'Удалить из избранного' : 'Добавить в избранное'"
            @click="toggleFavorite(car.id)"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                :fill="favorite ? 'currentColor' : 'none'"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </button>

          <BlackButton
            :to="`/cars/${car.id}`"
            compact
          >
            Подробнее
          </BlackButton>
        </div>
      </div>
    </div>
  </article>
</template>
