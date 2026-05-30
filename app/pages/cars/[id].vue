<script setup lang="ts">
import type { Car } from '~/types/car'
import { buildWhatsappUrl } from '~/utils/contact'
import { formatMileage, formatPrice } from '~/utils/format'

const route = useRoute()
const router = useRouter()
const requestUrl = useRequestURL()
const { loadFavorites } = useFavorites()
const { addRecentlyViewed, loadRecentlyViewed } = useRecentlyViewed()
const { readyTelegramWebApp, waitForTelegramInitData } = useAdminApi()

const carId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
const openedFromAdmin = computed(() => route.query.from === 'admin')
const { data: carResponse, error } = await useFetch<{ data: Car }>(`/api/cars/${carId}`)
const { data: carsResponse } = await useFetch<{ data: Car[] }>('/api/cars')
const car = carResponse.value?.data

if (error.value || !car) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Автомобиль не найден'
  })
}

const similarCars = computed(() =>
  (carsResponse.value?.data ?? [])
    .filter((candidate) => candidate.id !== car.id)
    .map((candidate) => ({
      car: candidate,
      score:
        (candidate.brand === car.brand ? 4 : 0) +
        (candidate.fuel === car.fuel ? 2 : 0) +
        (candidate.city === car.city ? 1 : 0) +
        (Math.abs(candidate.price - car.price) < 8000 ? 2 : 0)
    }))
    .sort((a, b) => b.score - a.score || a.car.price - b.car.price)
    .slice(0, 3)
    .map(({ car }) => car)
)
const mobileContactRef = ref<HTMLElement | null>(null)
const showMobileContactBar = ref(false)
const showAdminNavigation = ref(false)
let telegramBackHandler: (() => void) | undefined
const carUrl = computed(() => `${requestUrl.origin}${route.path}`)
const whatsappMessage = computed(() =>
  `Здравствуйте! Интересует автомобиль ${car.title} за ${formatPrice(car.price)}. Объявление: ${carUrl.value}`
)
const whatsappUrl = computed(() => buildWhatsappUrl(car.seller.phone, whatsappMessage.value))

const specs = computed(() => [
  { label: 'Год', value: car.year },
  { label: 'Пробег', value: formatMileage(car.mileage) },
  { label: 'Двигатель', value: car.engine },
  { label: 'Топливо', value: car.fuel },
  { label: 'Коробка', value: car.transmission },
  { label: 'Привод', value: car.drivetrain },
  { label: 'Мощность', value: `${car.power} л.с.` },
  { label: 'Цвет', value: car.color }
])

const updateMobileContactBar = () => {
  if (!import.meta.client || window.innerWidth >= 1024) {
    showMobileContactBar.value = false
    return
  }

  const contactElement = mobileContactRef.value
  showMobileContactBar.value = Boolean(contactElement && contactElement.getBoundingClientRect().bottom < 0)
}

const goBackToAdmin = () => {
  router.push('/admin')
}

const setupTelegramBackButton = () => {
  if (!import.meta.client) {
    return
  }

  const backButton = window.Telegram?.WebApp?.BackButton

  if (!backButton) {
    return
  }

  telegramBackHandler = goBackToAdmin
  backButton.show?.()
  backButton.onClick?.(telegramBackHandler)
}

onMounted(async () => {
  loadFavorites()
  loadRecentlyViewed()
  addRecentlyViewed(car.id)
  updateMobileContactBar()
  window.addEventListener('scroll', updateMobileContactBar, { passive: true })
  window.addEventListener('resize', updateMobileContactBar)

  if (openedFromAdmin.value) {
    readyTelegramWebApp()
    showAdminNavigation.value = Boolean(await waitForTelegramInitData())

    if (showAdminNavigation.value) {
      setupTelegramBackButton()
    }
  }
})

onBeforeUnmount(() => {
  if (!import.meta.client) {
    return
  }

  window.removeEventListener('scroll', updateMobileContactBar)
  window.removeEventListener('resize', updateMobileContactBar)

  const backButton = window.Telegram?.WebApp?.BackButton

  if (telegramBackHandler && backButton) {
    backButton.offClick?.(telegramBackHandler)
    backButton.hide?.()
  }
})

useHead({
  title: `${car.title} - ${formatPrice(car.price)}`
})
</script>

<template>
  <main class="lux-page pb-24 pt-24 sm:pt-28 lg:pb-8">
    <div class="content-page">

      <section v-if="showAdminNavigation" class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 shadow-sm">
        <div class="grid grid-cols-2 gap-2">
          <BlackButton type="button" @click="goBackToAdmin">В админку</BlackButton>
          <BlackButton :to="`/admin/cars/${car.id}/edit`">Редактировать</BlackButton>
        </div>
      </section>

      <NuxtLink to="/" class="focus-ring inline-flex min-h-11 items-center rounded-full px-1 text-sm font-bold text-slate-600 hover:text-slate-950">
        Назад к каталогу
      </NuxtLink>

      <div class="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div class="space-y-6">
          <CarGallery :images="car.images" :title="car.title" />

          <!-- Заголовочная секция: вертикально на мобиле, горизонтально на sm+ -->
          <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <PriceBadge :label="car.priceBadge" />
              <PriceBadge v-if="car.isUrgent" label="Срочно" />
              <span class="text-xs text-slate-500">{{ car.city }}</span>
            </div>
            <div class="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <h1 class="text-xl font-bold tracking-tight text-slate-950 sm:text-3xl">{{ car.title }}</h1>
              <p class="text-xl font-bold tracking-tight text-slate-950 sm:text-3xl sm:shrink-0">{{ formatPrice(car.price) }}</p>
            </div>
          </section>

          <SpecGrid :specs="specs" />

          <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 class="text-xl font-bold tracking-tight text-slate-950">Описание</h2>
            <p class="mt-3 text-sm leading-8 text-slate-600">{{ car.description }}</p>
          </section>

          <!-- Контакт после описания на мобиле -->
          <div ref="mobileContactRef" class="lg:hidden">
            <CarContactPanel
              :seller="car.seller"
              :city="car.city"
              :contact-url="whatsappUrl"
              compact
            />
          </div>
        </div>

        <div class="hidden lg:block">
          <CarContactPanel
            class="lg:sticky lg:top-24"
            :seller="car.seller"
            :city="car.city"
            :contact-url="whatsappUrl"
          />
        </div>
      </div>

      <section class="py-8 sm:py-10">
        <SectionHeader title="Похожие автомобили" subtitle="Близкие варианты по цене, марке или типу топлива." />
        <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CarCard v-for="similarCar in similarCars" :key="similarCar.id" :car="similarCar" />
        </div>
      </section>

    </div>
  </main>

  <!-- Sticky-бар снизу (мобиле) -->
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="showMobileContactBar"
      class="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-2.5 shadow-[0_-16px_40px_rgba(15,23,42,0.14)] backdrop-blur lg:hidden"
    >
      <div class="mx-auto flex max-w-lg items-center gap-2">
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-bold text-slate-950 leading-tight">{{ car.title }}</p>
          <p class="text-sm text-slate-500 leading-tight">{{ formatPrice(car.price) }}</p>
        </div>
        <BlackButton
          class="shrink-0"
          compact
          :href="whatsappUrl"
          rel="noopener noreferrer"
          target="_blank"
        >
          Связаться
        </BlackButton>
      </div>
    </div>
  </Transition>
</template>
