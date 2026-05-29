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
  <div>
    <AppHeader />

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

        <section id="catalog-results" class="lux-glass mt-5 rounded-lg p-4 sm:p-5">
          <SectionHeader
            title="Каталог автомобилей"
            :subtitle="filteredCars.length ? `${filteredCars.length} предложений, показаны ${pageStart + 1}-${pageEnd}` : 'Нет предложений по выбранным условиям'"
            compact
          >
            <div class="inline-grid grid-cols-2 rounded-md border border-neutral-950/10 bg-white/25 p-1 backdrop-blur">
              <button
                class="focus-ring min-h-9 rounded-sm px-3 text-xs font-semibold uppercase tracking-[0.14em] transition"
                :class="viewMode === 'grid' ? 'bg-neutral-950 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-950'"
                type="button"
                @click="viewMode = 'grid'"
              >
                Блоки
              </button>

              <button
                class="focus-ring min-h-9 rounded-sm px-3 text-xs font-semibold uppercase tracking-[0.14em] transition"
                :class="viewMode === 'list' ? 'bg-neutral-950 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-950'"
                type="button"
                @click="viewMode = 'list'"
              >
                Строки
              </button>
            </div>
          </SectionHeader>

          <div v-if="paginatedCars.length && viewMode === 'grid'" class="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <CarCard v-for="car in paginatedCars" :key="car.id" :car="car" />
          </div>

          <div v-else-if="paginatedCars.length" class="mt-4 grid gap-3">
            <CarListItem v-for="car in paginatedCars" :key="car.id" :car="car" />
          </div>

          <div v-else class="mt-5 rounded-lg border border-white/35 bg-white/30 p-6 text-center backdrop-blur">
            <h3 class="text-xl font-semibold text-neutral-950">Ничего не найдено</h3>
            <p class="mt-2 text-sm text-neutral-600">Попробуйте изменить марку, цену, город или тип транспорта.</p>
          </div>

          <nav
            v-if="totalPages > 1"
            class="mt-6 grid gap-3 border-t border-white/35 pt-4 sm:flex sm:items-center sm:justify-between"
            aria-label="Пагинация каталога"
          >
            <button
              class="focus-ring min-h-10 rounded-none border border-neutral-950/15 bg-white/25 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-950 backdrop-blur disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="currentPage === 1"
              type="button"
              @click="setPage(currentPage - 1)"
            >
              Назад
            </button>

            <div class="flex justify-center gap-2 overflow-x-auto">
              <button
                v-for="page in visiblePages"
                :key="page"
                class="focus-ring h-10 w-10 shrink-0 rounded-md text-sm font-semibold"
                :class="page === currentPage ? 'bg-neutral-950 text-white' : 'border border-neutral-950/15 bg-white/25 text-neutral-950 backdrop-blur'"
                type="button"
                @click="setPage(page)"
              >
                {{ page }}
              </button>
            </div>

            <button
              class="focus-ring min-h-10 rounded-none border border-neutral-950/15 bg-white/25 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-950 backdrop-blur disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="currentPage === totalPages"
              type="button"
              @click="setPage(currentPage + 1)"
            >
              Далее
            </button>
          </nav>
        </section>
      </div>
    </main>
  </div>
</template>
