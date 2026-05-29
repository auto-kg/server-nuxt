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
  logoText: 'ЛЯМБАР',
  logoInitial: 'L',
  logoImage: '/uploads/site-logo.png',
  heroBadge: 'Проверенные автомобили по всему Кыргызстану',
  heroTitle: 'Go AutoHub KG.',
  heroSubtitle: 'Найдите лучшее авто в Бишкеке и крупных городах Кыргызстана с быстрым поиском и честными карточками.',
  heroImage: fallbackHeroImage,
  footerDescription: 'Автомобильный маркетплейс Кыргызстана на Nuxt 4 с mobile-first интерфейсом и админкой для Telegram Mini App.',
  telegramUrl: '',
  instagramUrl: '',
  whatsappUrl: ''
}
const allCars = computed(() => carsResponse.value?.data ?? [])
const categories = computed(() => categoriesResponse.value?.data ?? [])
const vehicleTypes = computed(() => vehicleTypesResponse.value?.data ?? [])
const settings = computed(() => settingsResponse.value?.data ?? fallbackSettings)
const heroImage = computed(() => settings.value.heroImage || fallbackHeroImage)
const socialLinks = computed(() => [
  {
    label: 'Telegram',
    url: settings.value.telegramUrl,
    icon: 'telegram'
  },
  {
    label: 'Instagram',
    url: settings.value.instagramUrl,
    icon: 'instagram'
  },
  {
    label: 'WhatsApp',
    url: settings.value.whatsappUrl,
    icon: 'whatsapp'
  }
].filter((link) => link.url.trim()))
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

    <main class="lux-page">
      <section class="relative overflow-hidden">
        <div class="relative min-h-[650px] overflow-hidden">
          <img
            :src="heroImage"
            alt="Автомобиль на дороге"
            class="absolute inset-0 h-full w-full object-cover object-center"
            @error="handleHeroImageError"
          >
          <div class="absolute inset-0 bg-gradient-to-r from-[#f4f4f1]/55 via-[#f4f4f1]/24 to-transparent" />
          <div class="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-[#e5e5e2]/35" />

          <div class="content-page relative grid min-h-[650px] items-center pb-28 pt-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div class="max-w-xl">
              <p class="mb-6 text-[11px] font-semibold uppercase tracking-[0.55em] text-neutral-700">
                {{ settings?.heroBadge }}
              </p>
              <h1 class="max-w-lg text-5xl font-light leading-[0.92] tracking-normal text-neutral-950 sm:text-7xl lg:text-8xl">
                {{ settings?.heroTitle }}
              </h1>
              <p class="mt-7 max-w-md text-sm leading-7 text-neutral-600 sm:text-base">
                {{ settings?.heroSubtitle }}
              </p>

              <div class="mt-8 flex flex-wrap items-center gap-4">
                <BlackButton to="/catalog">
                  Смотреть каталог
                  <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" />
                  </svg>
                </BlackButton>
                <button class="focus-ring inline-flex min-h-11 items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-800" type="button">
                  <span class="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-950/20 bg-white/35 backdrop-blur">
                    <svg class="h-4 w-4 translate-x-px" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m9 7 8 5-8 5V7Z" fill="currentColor" />
                    </svg>
                  </span>
                  Обзор
                </button>
              </div>
            </div>

            <div class="hidden self-end justify-self-end pb-16 text-right lg:block">
              <div class="grid gap-6 border-l border-neutral-950/15 pl-7">
                <span class="text-xs font-semibold text-neutral-600">01</span>
                <span class="h-20 w-px bg-neutral-950/25" />
                <span class="text-xs font-semibold text-neutral-600">03</span>
              </div>
            </div>
          </div>
        </div>

        <div class="content-page relative -mt-20">
          <SearchForm
            :cars="allCars"
            :result-count="matchingCars.length"
            :vehicle-types="vehicleTypes"
            submit-label="Показать"
            @change="handleFilterChange"
            @reset="handleReset"
            @search="handleSearch"
          />
        </div>
      </section>

      <section class="content-page py-6 sm:py-8">
        <div class="lux-glass rounded-lg p-4 sm:p-5">
          <SectionHeader title="Популярные категории" subtitle="Быстрые подборки для разных сценариев покупки." compact />

          <HorizontalScroller v-if="categories.length" class="mt-4">
            <article
              v-for="category in categories"
              :key="category.title"
              class="group w-[78%] shrink-0 snap-start overflow-hidden rounded-lg border border-white/35 bg-white/30 backdrop-blur sm:w-[46%] lg:w-[31%] xl:w-[23.5%]"
            >
              <button class="block h-full w-full text-left" type="button" @click="openCategory(category)">
                <div class="aspect-[4/3] overflow-hidden bg-neutral-200">
                  <img :src="category.image" :alt="category.title" class="h-full w-full object-cover transition duration-500 group-hover:scale-105">
                </div>
                <div class="p-4">
                  <h3 class="text-lg font-semibold text-neutral-950">{{ category.title }}</h3>
                  <p class="mt-1 line-clamp-2 text-sm font-medium leading-6 text-neutral-500">
                    {{ category.description || 'Открыть подборку' }}
                  </p>
                </div>
              </button>
            </article>
          </HorizontalScroller>

          <div v-else class="mt-4 rounded-lg border border-dashed border-neutral-950/15 bg-white/25 p-5 text-center text-sm font-semibold text-neutral-500">
            Категории пока не добавлены
          </div>
        </div>
      </section>

      <section class="content-page py-4 sm:py-5">
        <div class="lux-glass rounded-lg p-4 sm:p-5">
          <SectionHeader
            title="Тип транспортных средств"
            subtitle="Быстрый старт по кузову и назначению автомобиля."
            compact
          />

          <div v-if="vehicleTypeCards.length" class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
            <button
              v-for="type in vehicleTypeCards"
              :key="type.value"
              class="focus-ring overflow-hidden rounded-lg border border-white/35 bg-white/30 text-left backdrop-blur transition hover:border-white/70 hover:bg-white/45"
              type="button"
              @click="openVehicleType(type.value)"
            >
              <span class="flex aspect-[16/9] items-center justify-center bg-white/25">
                <img v-if="type.image" :src="type.image" :alt="type.title" class="h-full w-full object-contain">
                <span v-else class="text-sm font-semibold text-neutral-500">{{ type.title }}</span>
              </span>
              <span class="block p-3">
                <span class="block text-base font-semibold text-neutral-950">{{ type.title }}</span>
                <span v-if="type.description" class="mt-1 line-clamp-2 block text-sm font-medium leading-6 text-neutral-500">{{ type.description }}</span>
                <span class="mt-1 block text-sm font-medium text-neutral-500">{{ type.count }} авто</span>
              </span>
            </button>
          </div>

          <div v-else class="mt-4 rounded-lg border border-dashed border-neutral-950/15 bg-white/25 p-5 text-center text-sm font-semibold text-neutral-500">
            Типы появятся после добавления объявлений.
          </div>
        </div>
      </section>

      <section class="content-page py-4 sm:py-5">
        <div class="lux-glass rounded-lg p-4 sm:p-5">
          <SectionHeader title="Популярные марки" subtitle="Быстрый вход в самые востребованные объявления каталога." compact />

          <div v-if="popularBrands.length" class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-8">
            <button
              v-for="item in popularBrands"
              :key="item.brand"
              class="focus-ring min-h-20 rounded-lg border border-white/35 bg-white/30 p-3 text-left backdrop-blur transition hover:border-white/70 hover:bg-white/45"
              type="button"
              @click="openBrand(item.brand)"
            >
              <span class="block text-lg font-semibold text-neutral-950">{{ item.brand }}</span>
              <span class="mt-1 block text-sm font-medium text-neutral-500">{{ item.count }} авто</span>
            </button>
          </div>
          <div v-else class="mt-4 rounded-lg border border-dashed border-neutral-950/15 bg-white/25 p-5 text-center text-sm font-semibold text-neutral-500">
            Марки появятся после добавления авто
          </div>
        </div>
      </section>

      <section class="content-page py-6 pb-10 sm:py-8 sm:pb-12">
        <SectionHeader title="Почему выбирают нас" subtitle="Фокус на понятном выборе и быстром сравнении объявлений." />

        <div class="mt-6 grid gap-4 md:grid-cols-3">
          <article
            v-for="advantage in advantages"
            :key="advantage.title"
            class="rounded-lg border border-white/35 bg-white/35 p-4 shadow-[0_18px_60px_rgba(17,19,21,0.08)] backdrop-blur-xl"
          >
            <h3 class="text-lg font-semibold text-neutral-950">{{ advantage.title }}</h3>
            <p class="mt-3 leading-7 text-neutral-600">{{ advantage.text }}</p>
          </article>
        </div>
      </section>
    </main>

    <footer class="w-full border-t border-white/35 bg-white/35 backdrop-blur-xl">
      <div class="content-page py-6 sm:py-8">
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-lg font-semibold uppercase tracking-[0.32em] text-neutral-950">{{ settings?.logoText }}</p>
            <p class="mt-2 max-w-xl text-sm leading-6 text-neutral-600">
              {{ settings?.footerDescription }}
            </p>
          </div>
          <nav class="flex flex-wrap items-center gap-3 text-sm font-semibold text-neutral-600">
            <NuxtLink class="focus-ring rounded-md hover:text-neutral-950" to="/favorites">Избранное</NuxtLink>
            <a
              v-for="link in socialLinks"
              :key="link.label"
              :href="link.url"
              :aria-label="link.label"
              class="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-neutral-950/10 bg-white/25 text-neutral-700 backdrop-blur transition hover:border-neutral-950/25 hover:bg-white/45 hover:text-neutral-950"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg v-if="link.icon === 'telegram'" class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21.8 4.6 18.5 20c-.2.9-.8 1.1-1.6.7l-4.8-3.6-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.5 13.6 1.8 12.1c-1-.3-1-1 .2-1.5L20.3 3.5c.9-.3 1.7.2 1.5 1.1Z" fill="currentColor" />
              </svg>
              <svg v-else-if="link.icon === 'instagram'" class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" stroke-width="2" />
                <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="2" />
                <circle cx="17" cy="7" r="1.2" fill="currentColor" />
              </svg>
              <svg v-else class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5.1 19 6 15.6A7.8 7.8 0 1 1 9.2 19l-4.1 0Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" />
                <path d="M9.6 8.7c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4-.1.6l-.4.5c-.1.2-.2.3 0 .6.4.8 1.2 1.7 2.1 2.2.3.2.5.2.7-.1l.6-.7c.2-.2.4-.2.7-.1l1.5.7c.3.2.4.3.4.6-.1.8-.8 1.7-1.7 1.8-1.4.2-3.5-.7-5.2-2.3-1.6-1.6-2.7-3.8-2.4-5 .1-.5.5-.9.9-1Z" fill="currentColor" />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </footer>
  </div>
</template>
