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
  <article class="group relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
    <NuxtLink :to="`/cars/${car.id}`" class="block">
      <div class="relative aspect-[4/3] overflow-hidden bg-slate-200">
        <img
          :src="car.images[0]"
          :alt="car.title"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        >
        <div class="absolute left-3 top-3">
          <PriceBadge :label="car.priceBadge" />
        </div>
      </div>
    </NuxtLink>

    <button
      class="focus-ring absolute right-3 top-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-sm shadow-slate-950/10 backdrop-blur transition"
      :class="favorite ? 'border-rose-200 bg-rose-50/95 text-rose-600' : 'border-white/70 bg-white/90 text-slate-700 hover:bg-white hover:text-rose-500'"
      type="button"
      :aria-label="favorite ? 'Удалить из избранного' : 'Добавить в избранное'"
      @click="toggleFavorite(car.id)"
    >
      <svg
        class="h-5 w-5 transition"
        :class="{ 'scale-110': favorite }"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
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

    <div class="space-y-3 p-3">
      <div>
        <div class="min-w-0">
          <NuxtLink :to="`/cars/${car.id}`" class="focus-ring rounded-lg">
            <h3 class="line-clamp-2 text-base font-bold leading-tight text-slate-950">
              {{ car.title }}
            </h3>
          </NuxtLink>
          <p class="mt-2 text-xl font-bold tracking-tight text-slate-950">
            {{ formatPrice(car.price) }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 text-sm text-slate-600">
        <span class="rounded-lg bg-slate-50 px-2.5 py-1.5">{{ car.year }}</span>
        <span class="rounded-lg bg-slate-50 px-2.5 py-1.5">{{ formatMileage(car.mileage) }}</span>
        <span class="rounded-lg bg-slate-50 px-2.5 py-1.5">{{ car.fuel }}</span>
        <span class="rounded-lg bg-slate-50 px-2.5 py-1.5">{{ car.transmission }}</span>
      </div>

      <div class="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <span class="text-sm font-semibold text-slate-600">{{ car.city }}</span>
        <NuxtLink
          :to="`/cars/${car.id}`"
          class="focus-ring rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          Подробнее
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
