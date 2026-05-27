import type { Car, CarSearchFilters } from '~/types/car'

export const createDefaultCarSearchFilters = (): CarSearchFilters => ({
  query: '',
  brand: '',
  model: '',
  description: '',
  maxPrice: '',
  yearFrom: '',
  maxMileage: '',
  fuel: '',
  city: ''
})

export const useCarCatalog = (initialCars: Ref<Car[]>) => {
  const cars = ref<Car[]>([])
  const filters = ref<CarSearchFilters>(createDefaultCarSearchFilters())
  const currentPage = ref(1)
  const perPage = ref(9)
  const isLoading = ref(false)
  const errorMessage = ref('')

  const hasActiveFilters = computed(() =>
    Object.values(filters.value).some((value) => String(value).trim())
  )

  watch(
    initialCars,
    (value) => {
      if (!hasActiveFilters.value) {
        cars.value = [...value]
      }
    },
    { immediate: true }
  )

  const totalCars = computed(() => cars.value.length)
  const totalPages = computed(() => Math.max(Math.ceil(totalCars.value / perPage.value), 1))
  const pageStart = computed(() => (currentPage.value - 1) * perPage.value)
  const pageEnd = computed(() => Math.min(pageStart.value + perPage.value, totalCars.value))
  const paginatedCars = computed(() => cars.value.slice(pageStart.value, pageEnd.value))

  const visiblePages = computed(() => {
    const start = Math.max(currentPage.value - 2, 1)
    const end = Math.min(start + 4, totalPages.value)

    return Array.from({ length: end - start + 1 }, (_, index) => start + index)
  })

  const setPage = (page: number) => {
    currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
  }

  const applyFilters = async (nextFilters: CarSearchFilters) => {
    filters.value = { ...nextFilters }
    currentPage.value = 1
    isLoading.value = true
    errorMessage.value = ''

    try {
      const response = await $fetch<{ data: Car[] }>('/api/cars', {
        query: filters.value
      })

      cars.value = response.data
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Не удалось загрузить автомобили'
    } finally {
      isLoading.value = false
    }
  }

  const resetFilters = () => {
    filters.value = createDefaultCarSearchFilters()
    cars.value = [...initialCars.value]
    currentPage.value = 1
    errorMessage.value = ''
  }

  return {
    cars,
    filters,
    currentPage,
    perPage,
    isLoading,
    errorMessage,
    hasActiveFilters,
    totalCars,
    totalPages,
    pageStart,
    pageEnd,
    paginatedCars,
    visiblePages,
    setPage,
    applyFilters,
    resetFilters
  }
}
