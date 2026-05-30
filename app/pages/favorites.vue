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
  <main class="lux-page min-h-screen py-24 sm:py-28">
    <FavoritesOverview
      :favorite-cars="favoriteCars"
      :recently-viewed-cars="recentlyViewedCars"
    />
  </main>
</template>
