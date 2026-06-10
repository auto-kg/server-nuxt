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
      <CarAdminActions v-if="showAdminNavigation" :car-id="car.id" @back="goBackToAdmin" />

      <NuxtLink to="/" class="focus-ring inline-flex min-h-11 items-center rounded-full px-1 text-sm font-bold text-slate-600 hover:text-slate-950">
        Назад к каталогу
      </NuxtLink>

      <div class="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div class="space-y-6">
          <CarGallery :images="car.images" :title="car.title" />

          <CarOverviewHeader :car="car" />
          <SpecGrid :specs="specs" />
          <CarDescriptionSection :description="car.description" />

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

      <SimilarCarsSection :cars="similarCars" />
    </div>
  </main>

  <MobileContactBar :car="car" :contact-url="whatsappUrl" :show="showMobileContactBar" />
</template>
