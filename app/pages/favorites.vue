<script setup lang="ts">
import type { Car } from '~/types/car'

const { favoriteIds, loadFavorites } = useFavorites()
const { recentlyViewedIds, loadRecentlyViewed } = useRecentlyViewed()
const { data: carsResponse } = await useFetch<{ data: Car[] }>('/api/cars')

const cars = computed(() => carsResponse.value?.data ?? [])
const favoriteCars = computed(() => cars.value.filter((car) => favoriteIds.value.includes(car.id)))
const recentlyViewedCars = computed(() =>
  recentlyViewedIds.value
    .map((id) => cars.value.find((car) => car.id === id))
    .filter((car): car is Car => Boolean(car))
    .filter((car) => !favoriteIds.value.includes(car.id))
    .slice(0, 6)
)

onMounted(() => {
  loadFavorites()
  loadRecentlyViewed()
})

useHead({
  title: 'Избранное - AutoHub KG'
})
</script>

<template>
  <div>
    <AppHeader />

    <main class="lux-page min-h-screen py-24 sm:py-28">
      <div class="content-page">
        <section>
          <SectionHeader title="Избранное" subtitle="Автомобили, которые вы отметили для сравнения." />

          <div v-if="favoriteCars.length" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CarCard v-for="car in favoriteCars" :key="car.id" :car="car" />
          </div>

          <div v-else class="mt-6 rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center">
            <h2 class="text-xl font-bold text-slate-950">Пока пусто</h2>
            <p class="mt-2 text-sm font-semibold leading-6 text-slate-600">
              Добавляйте автомобили в избранное из каталога или карточки.
            </p>
            <BlackButton
              to="/"
              class="mt-4"
            >
              Перейти в каталог
            </BlackButton>
          </div>
        </section>

        <section class="mt-10 sm:mt-12">
          <SectionHeader title="Недавно просмотренные" subtitle="Последние карточки, которые вы открывали на этом устройстве." compact />

          <div v-if="recentlyViewedCars.length" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CarCard v-for="car in recentlyViewedCars" :key="car.id" :car="car" />
          </div>

          <p v-else class="mt-6 rounded-lg bg-white p-5 text-sm font-bold text-slate-500">
            Просмотренные автомобили появятся здесь после открытия карточек.
          </p>
        </section>
      </div>
    </main>
  </div>
</template>
