<script setup lang="ts">
import type { Car } from '~/types/car'
import { formatPrice } from '~/utils/format'

defineProps<{
  car: Car
}>()
</script>

<template>
  <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
    <div class="mb-2 flex flex-wrap items-center gap-2">
      <PriceBadge :label="car.priceBadge" />
      <PriceBadge v-if="car.isUrgent" label="Срочно" />
      <span class="text-xs text-slate-500">{{ car.city }}</span>
    </div>
    <div class="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <h1 class="text-xl font-bold tracking-tight text-slate-950 sm:text-3xl">{{ car.title }}</h1>
      <p class="text-xl font-bold tracking-tight text-slate-950 sm:shrink-0 sm:text-3xl">{{ formatPrice(car.price) }}</p>
    </div>
  </section>
</template>
