<script setup lang="ts">
import type { Car, CarSearchFilters, HomeCategory } from '~/types/car'
import type { SiteSettings } from '~/types/settings'
import { filterCarsLocally } from '~/utils/carFilters'
import { getCarVehicleType, vehicleTypes } from '~/utils/vehicleType'

const { data: carsResponse } = await useFetch<{ data: Car[] }>('/api/cars')
const { data: settingsResponse } = await useFetch<{ data: SiteSettings }>('/api/settings')
const { data: categoriesResponse } = await useFetch<{ data: HomeCategory[] }>('/api/categories')
const router = useRouter()
const fallbackHeroImage = '/uploads/site-hero.png'
const fallbackSettings: SiteSettings = {
  logoText: 'AutoHub KG',
  logoInitial: 'A',
  heroBadge: 'Проверенные автомобили по всему Кыргызстану',
  heroTitle: 'Go AutoHub KG.',
  heroSubtitle: 'Найдите лучшее авто в Бишкеке и крупных городах Кыргызстана с быстрым поиском и честными карточками.',
  heroImage: fallbackHeroImage,
  footerDescription: 'Автомобильный маркетплейс Кыргызстана на Nuxt 4 с mobile-first интерфейсом и админкой для Telegram Mini App.'
}
const allCars = computed(() => carsResponse.value?.data ?? [])
const categories = computed(() => categoriesResponse.value?.data ?? [])
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
  vehicleTypes
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

const openCategory = (title: string) => {
  goToCatalog({
    ...createDefaultCarSearchFilters(),
    query: title
  })
}

const handleHeroImageError = (event: Event) => {
  const image = event.target as HTMLImageElement

  if (image.src.endsWith(fallbackHeroImage)) {
    return
  }

  image.src = fallbackHeroImage
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
  <div>
    <AppHeader />

    <main class="bg-slate-50">
      <section class="relative bg-white pb-6 lg:pb-8">
        <div class="relative min-h-[430px] overflow-hidden bg-slate-900 shadow-soft sm:min-h-[520px] lg:min-h-[560px]">
            <img
              :src="heroImage"
              alt="Автомобиль на дороге"
              class="absolute inset-0 h-full w-full object-cover object-center"
              @error="handleHeroImageError"
            >
            <div class="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/10 to-slate-950/55" />
            <div class="relative flex min-h-[430px] items-end px-5 pb-24 sm:min-h-[520px] sm:px-10 sm:pb-28 lg:min-h-[560px] lg:px-20">
              <div class="max-w-3xl text-white">
                <p class="mb-3 inline-flex rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-950">
                  {{ settings?.heroBadge }}
                </p>
                <h1 class="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  {{ settings?.heroTitle }}
                </h1>
                <p class="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/90 sm:text-lg sm:leading-7">
                  {{ settings?.heroSubtitle }}
                </p>
              </div>
            </div>
        </div>

        <div class="relative -mt-12 px-4 sm:px-6 md:mx-auto md:w-[80%] md:px-0 lg:w-[70%]">
          <div class="mx-auto">
            <SearchForm
              :cars="allCars"
              :result-count="matchingCars.length"
              submit-label="Показать в каталоге"
              @change="handleFilterChange"
              @reset="handleReset"
              @search="handleSearch"
            />
          </div>
        </div>
      </section>

      <section class="px-4 py-4 sm:px-6 sm:py-5 md:mx-auto md:w-[80%] md:px-0 lg:w-[70%]">
        <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <SectionHeader title="Популярные категории" subtitle="Быстрые подборки для разных сценариев покупки." compact />

          <HorizontalScroller v-if="categories.length" class="mt-4">
            <article
              v-for="category in categories"
              :key="category.title"
              class="group w-[78%] shrink-0 snap-start overflow-hidden rounded-lg border border-slate-200 bg-white sm:w-[46%] lg:w-[31%] xl:w-[23.5%]"
            >
              <button class="block w-full text-left" type="button" @click="openCategory(category.title)">
              <div class="aspect-[4/3] overflow-hidden bg-slate-200">
                <img :src="category.image" :alt="category.title" class="h-full w-full object-cover transition duration-500 group-hover:scale-105">
              </div>
              <div class="p-4">
                <h3 class="text-lg font-bold text-slate-950">{{ category.title }}</h3>
                <p class="mt-1 text-sm font-semibold text-slate-500">Открыть подборку</p>
              </div>
              </button>
            </article>
          </HorizontalScroller>

          <div v-else class="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm font-bold text-slate-500">
            Категории пока не добавлены
          </div>
        </div>
      </section>

      <section class="px-4 py-4 sm:px-6 sm:py-5 md:mx-auto md:w-[80%] md:px-0 lg:w-[70%]">
        <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <SectionHeader
            title="Тип транспортных средств"
            subtitle="Быстрый старт по кузову и назначению автомобиля."
            compact
          />

          <div v-if="vehicleTypeCards.length" class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
            <button
              v-for="type in vehicleTypeCards"
              :key="type.value"
              class="focus-ring min-h-20 rounded-lg border border-slate-200 bg-white p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
              type="button"
              @click="openVehicleType(type.value)"
            >
              <span class="block text-base font-bold text-slate-950">{{ type.label }}</span>
              <span class="mt-1 block text-sm font-semibold text-slate-500">{{ type.count }} авто</span>
            </button>
          </div>

          <div v-else class="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm font-bold text-slate-500">
            Типы появятся после добавления объявлений.
          </div>
        </div>
      </section>

      <section class="py-4 sm:py-5">
        <div class="px-4 sm:px-6 md:mx-auto md:w-[80%] md:px-0 lg:w-[70%]">
          <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <SectionHeader title="Популярные марки" subtitle="Быстрый вход в самые востребованные объявления каталога." compact />

            <div v-if="popularBrands.length" class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-8">
              <button
                v-for="item in popularBrands"
                :key="item.brand"
                class="focus-ring min-h-20 rounded-lg border border-slate-200 bg-white p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
                type="button"
                @click="openBrand(item.brand)"
              >
                <span class="block text-lg font-bold text-slate-950">{{ item.brand }}</span>
                <span class="mt-1 block text-sm font-semibold text-slate-500">{{ item.count }} авто</span>
              </button>
            </div>
            <div v-else class="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm font-bold text-slate-500">
              Марки появятся после добавления авто
            </div>
          </div>
        </div>
      </section>

      <section class="container-page py-6 pb-10 sm:py-8 sm:pb-12">
        <SectionHeader title="Почему выбирают нас" subtitle="Фокус на понятном выборе и быстром сравнении объявлений." />

        <div class="mt-6 grid gap-4 md:grid-cols-3">
          <article
            v-for="advantage in advantages"
            :key="advantage.title"
            class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h3 class="text-lg font-bold text-slate-950">{{ advantage.title }}</h3>
            <p class="mt-3 leading-7 text-slate-600">{{ advantage.text }}</p>
          </article>
        </div>
      </section>
    </main>

    <footer class="w-full border-t border-slate-200 bg-white">
      <div class="container-page py-6 sm:py-8">
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-lg font-bold text-slate-950">{{ settings?.logoText }}</p>
            <p class="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              {{ settings?.footerDescription }}
            </p>
          </div>
          <nav class="flex flex-wrap gap-4 text-sm font-bold text-slate-600">
            <NuxtLink class="focus-ring rounded-lg hover:text-slate-950" to="/favorites">Избранное</NuxtLink>
          </nav>
        </div>
      </div>
    </footer>
  </div>
</template>
