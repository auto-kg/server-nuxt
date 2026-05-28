<script setup lang="ts">
import type { Car, CarSearchFilters } from '~/types/car'
import { filterCarsLocally } from '~/utils/carFilters'

const route = useRoute()
const router = useRouter()
const { data: carsResponse } = await useFetch<{ data: Car[] }>('/api/cars')

const allCars = computed(() => carsResponse.value?.data ?? [])
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

    <main class="bg-slate-50 py-5 sm:py-7">
      <div class="px-4 sm:px-6 md:mx-auto md:w-[80%] md:px-0 lg:w-[70%]">
        <div class="mb-4">
          <NuxtLink to="/" class="focus-ring inline-flex min-h-9 items-center rounded-lg px-1 text-sm font-bold text-slate-600 hover:text-slate-950">
            На главную
          </NuxtLink>
        </div>

        <SearchForm
          :cars="allCars"
          :initial-filters="filters"
          :result-count="filteredCars.length"
          submit-label="Обновить каталог"
          @change="updateFilters"
          @reset="reset"
          @search="search"
        />

        <section id="catalog-results" class="mt-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <SectionHeader
            title="Каталог автомобилей"
            :subtitle="filteredCars.length ? `${filteredCars.length} предложений, показаны ${pageStart + 1}-${pageEnd}` : 'Нет предложений по выбранным условиям'"
            compact
          >
            <div class="inline-grid grid-cols-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                class="focus-ring min-h-9 rounded-md px-3 text-sm font-bold transition"
                :class="viewMode === 'grid' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-950'"
                type="button"
                @click="viewMode = 'grid'"
              >
                Блоки
              </button>

              <button
                class="focus-ring min-h-9 rounded-md px-3 text-sm font-bold transition"
                :class="viewMode === 'list' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-950'"
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

          <div v-else class="mt-5 rounded-lg border border-slate-200 bg-white p-6 text-center">
            <h3 class="text-xl font-bold text-slate-950">Ничего не найдено</h3>
            <p class="mt-2 text-sm text-slate-600">Попробуйте изменить марку, цену, город или тип транспорта.</p>
          </div>

          <nav
            v-if="totalPages > 1"
            class="mt-6 grid gap-3 border-t border-slate-100 pt-4 sm:flex sm:items-center sm:justify-between"
            aria-label="Пагинация каталога"
          >
            <button
              class="focus-ring min-h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
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
                class="focus-ring h-10 w-10 shrink-0 rounded-lg text-sm font-bold"
                :class="page === currentPage ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-950'"
                type="button"
                @click="setPage(page)"
              >
                {{ page }}
              </button>
            </div>

            <button
              class="focus-ring min-h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
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
