<script setup lang="ts">
import type { Car, CarSearchFilters, HomeCategory, VehicleType } from '~/types/car'
import type { SiteSettings } from '~/types/settings'
import { filterCarsLocally } from '~/utils/carFilters'
import { getCarVehicleType } from '~/utils/vehicleType'

const { data: carsResponse } = await useFetch<{ data: Car[] }>('/api/cars')
const { data: settingsResponse } = await useFetch<{ data: SiteSettings }>('/api/settings')
const { data: categoriesResponse } = await useFetch<{ data: HomeCategory[] }>('/api/categories')
const { data: vehicleTypesResponse } = await useFetch<{ data: VehicleType[] }>('/api/vehicle-types')
const router = useRouter()
const fallbackHeroImage = '/uploads/site-hero.png'
const fallbackSettings: SiteSettings = {
  logoText: 'auto.kg',
  logoInitial: 'A',
  logoImage: '/uploads/site-logo.png',
  heroBadge: 'Проверенные автомобили по всему Кыргызстану',
  heroTitle: 'AUTO KG.',
  heroSubtitle: 'Найдите лучшее авто в Бишкеке и крупных городах Кыргызстана с быстрым поиском и честными карточками.',
  heroImage: fallbackHeroImage,
  footerDescription: 'Автомобильный маркетплейс Кыргызстана с mobile-first интерфейсом и удобной админкой.',
  telegramUrl: '',
  instagramUrl: '',
  whatsappUrl: '+99612345678'
}
const allCars = computed(() => carsResponse.value?.data ?? [])
const categories = computed(() => categoriesResponse.value?.data ?? [])
const vehicleTypes = computed(() => vehicleTypesResponse.value?.data ?? [])
const settings = computed(() => settingsResponse.value?.data ?? fallbackSettings)
const heroImage = computed(() => settings.value.heroImage || fallbackHeroImage)
const activeFilters = ref<CarSearchFilters>(createDefaultCarSearchFilters())
const matchingCars = computed(() => filterCarsLocally(allCars.value, activeFilters.value))

const popularBrands = computed(() => {
  const counts = allCars.value.reduce<Record<string, number>>((acc, car) => {
    acc[car.brand] = (acc[car.brand] ?? 0) + 1
    return acc
  }, {})

  return Object.entries(counts)
    .map(([brand, count]) => ({ brand, count }))
    .sort((a, b) => b.count - a.count || a.brand.localeCompare(b.brand))
    .slice(0, 8)
})

const vehicleTypeCards = computed(() =>
  vehicleTypes.value
    .map((type) => ({
      ...type,
      count: allCars.value.filter((car) => getCarVehicleType(car) === type.value).length
    }))
    .filter((type) => type.count > 0)
)

const goToCatalog = (filters: CarSearchFilters) => {
  router.push({
    path: '/catalog',
    query: carSearchFiltersToQuery(filters)
  })
}

const handleFilterChange = (filters: CarSearchFilters) => {
  activeFilters.value = { ...filters }
}

const handleSearch = (filters: CarSearchFilters) => {
  activeFilters.value = { ...filters }
  goToCatalog(filters)
}

const handleReset = () => {
  activeFilters.value = createDefaultCarSearchFilters()
}

const openBrand = (brand: string) => {
  goToCatalog({
    ...createDefaultCarSearchFilters(),
    brand
  })
}

const openVehicleType = (vehicleType: string) => {
  goToCatalog({
    ...createDefaultCarSearchFilters(),
    vehicleType
  })
}

const openCategory = (category: HomeCategory) => {
  goToCatalog({
    ...createDefaultCarSearchFilters(),
    categoryId: category.id
  })
}

const advantages = [
  {
    title: 'Прозрачные объявления',
    text: 'В карточках сразу видны ключевые параметры, цена и город продавца.'
  },
  {
    title: 'Быстрый поиск с телефона',
    text: 'Крупные поля, понятные фильтры и удобная сетка для мобильного просмотра.'
  },
  {
    title: 'Подбор похожих авто',
    text: 'На странице автомобиля легко продолжить выбор без возврата в общий каталог.'
  }
]

useHead({
  title: computed(() => `${settings.value?.logoText ?? 'AutoHub KG'} - купить автомобиль в Кыргызстане`)
})
</script>

<template>
  <main class="lux-page">
    <HomeHero
      :cars="allCars"
      :hero-image="heroImage"
      :result-count="matchingCars.length"
      :settings="settings"
      :vehicle-types="vehicleTypes"
      @change="handleFilterChange"
      @reset="handleReset"
      @search="handleSearch"
    />
    <HomeCategories :categories="categories" @open="openCategory" />
    <HomeVehicleTypes :vehicle-types="vehicleTypeCards" @open="openVehicleType" />
    <HomeBrands :brands="popularBrands" @open="openBrand" />
    <HomeAdvantages :advantages="advantages" />
  </main>
</template>
