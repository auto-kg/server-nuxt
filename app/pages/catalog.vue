<script setup lang="ts">
import type { Car, CarSearchFilters, VehicleType } from '~/types/car'
import { filterCarsLocally } from '~/utils/carFilters'

const route = useRoute()
const router = useRouter()
const { data: carsResponse } = await useFetch<{ data: Car[] }>('/api/cars')
const { data: vehicleTypesResponse } = await useFetch<{ data: VehicleType[] }>('/api/vehicle-types')

const allCars = computed(() => carsResponse.value?.data ?? [])
const vehicleTypes = computed(() => vehicleTypesResponse.value?.data ?? [])
const filters = ref<CarSearchFilters>(carSearchFiltersFromQuery(route.query))
const currentPage = ref(1)
const viewMode = ref<'grid' | 'list'>('grid')
const perPage = 9
const filterKeys = Object.keys(createDefaultCarSearchFilters()) as Array<keyof CarSearchFilters>
const areFiltersEqual = (first: CarSearchFilters, second: CarSearchFilters) =>
  filterKeys.every((key) => first[key] === second[key])

const filteredCars = computed(() => filterCarsLocally(allCars.value, filters.value))
const totalPages = computed(() => Math.max(Math.ceil(filteredCars.value.length / perPage), 1))
const pageStart = computed(() => (currentPage.value - 1) * perPage)
const pageEnd = computed(() => Math.min(pageStart.value + perPage, filteredCars.value.length))
const paginatedCars = computed(() => filteredCars.value.slice(pageStart.value, pageEnd.value))
const visiblePages = computed(() => {
  const start = Math.max(currentPage.value - 2, 1)
  const end = Math.min(start + 4, totalPages.value)

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
})

watch(
  () => route.query,
  (query) => {
    filters.value = carSearchFiltersFromQuery(query)
    currentPage.value = 1
  }
)

const updateFilters = (nextFilters: CarSearchFilters) => {
  if (areFiltersEqual(filters.value, nextFilters)) {
    return
  }

  filters.value = { ...nextFilters }
}

const search = (nextFilters: CarSearchFilters) => {
  filters.value = { ...nextFilters }
  currentPage.value = 1
  router.push({
    path: '/catalog',
    query: carSearchFiltersToQuery(nextFilters)
  })
}

const reset = () => {
  filters.value = createDefaultCarSearchFilters()
  currentPage.value = 1
  router.push('/catalog')
}

const setPage = (page: number) => {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)

  if (import.meta.client) {
    document.getElementById('catalog-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

useHead({
  title: 'Каталог автомобилей - AutoHub KG'
})
</script>

<template>
  <main class="lux-page min-h-screen py-24 sm:py-28">
      <div class="content-page">
        <div class="mb-4">
          <NuxtLink to="/" class="focus-ring inline-flex min-h-9 items-center rounded-md px-1 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600 hover:text-neutral-950">
            На главную
          </NuxtLink>
        </div>

        <SearchForm
          :cars="allCars"
          :initial-filters="filters"
          :result-count="filteredCars.length"
          :vehicle-types="vehicleTypes"
          submit-label="Обновить каталог"
          @change="updateFilters"
          @reset="reset"
          @search="search"
        />

        <CatalogResults
          v-model:view-mode="viewMode"
          :cars="paginatedCars"
          :current-page="currentPage"
          :filtered-count="filteredCars.length"
          :page-end="pageEnd"
          :page-start="pageStart"
          :total-pages="totalPages"
          :visible-pages="visiblePages"
          @set-page="setPage"
        />
      </div>
  </main>
</template>
