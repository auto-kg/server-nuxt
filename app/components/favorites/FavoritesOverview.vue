<script setup lang="ts">
import type { Car } from '~/types/car'

const props = defineProps<{
  favoriteCars: Car[]
  recentlyViewedCars: Car[]
}>()
</script>

<template>
  <div class="content-page">
    <section>
      <SectionHeader title="Избранное" subtitle="Автомобили, которые вы отметили для сравнения." />

      <div v-if="props.favoriteCars.length" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CarCard v-for="car in props.favoriteCars" :key="car.id" :car="car" />
      </div>

      <div v-else class="mt-6 rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center">
        <h2 class="text-xl font-bold text-slate-950">Пока пусто</h2>
        <p class="mt-2 text-sm font-semibold leading-6 text-slate-600">
          Добавляйте автомобили в избранное из каталога или карточки.
        </p>
        <BlackButton to="/" class="mt-4">
          Перейти в каталог
        </BlackButton>
      </div>
    </section>

    <section class="mt-10 sm:mt-12">
      <SectionHeader title="Недавно просмотренные" subtitle="Последние карточки, которые вы открывали на этом устройстве." compact />

      <div v-if="props.recentlyViewedCars.length" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CarCard v-for="car in props.recentlyViewedCars" :key="car.id" :car="car" />
      </div>

      <p v-else class="mt-6 rounded-lg bg-white p-5 text-sm font-bold text-slate-500">
        Просмотренные автомобили появятся здесь после открытия карточек.
      </p>
    </section>
  </div>
</template>
