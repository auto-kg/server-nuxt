<script setup lang="ts">
import type { Car } from '~/types/car'
import { formatMileage, formatPrice } from '~/utils/format'

const route = useRoute()
const { loadFavorites } = useFavorites()

const carId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
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

onMounted(() => {
  loadFavorites()
  updateMobileContactBar()
  window.addEventListener('scroll', updateMobileContactBar, { passive: true })
  window.addEventListener('resize', updateMobileContactBar)
})

onBeforeUnmount(() => {
  if (!import.meta.client) {
    return
  }

  window.removeEventListener('scroll', updateMobileContactBar)
  window.removeEventListener('resize', updateMobileContactBar)
})

useHead({
  title: `${car.title} - ${formatPrice(car.price)}`
})
</script>

<template>
  <div>
    <AppHeader />

    <main class="bg-slate-50 pb-24 pt-5 sm:pt-8 lg:pb-8">
      <div class="px-4 sm:px-6 md:mx-auto md:w-[80%] md:px-0 lg:w-[70%]">
        <NuxtLink to="/" class="focus-ring inline-flex min-h-11 items-center rounded-full px-1 text-sm font-black text-slate-600 hover:text-slate-950">
          Назад к каталогу
        </NuxtLink>

      <div class="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div class="space-y-6">
          <CarGallery :images="car.images" :title="car.title" />

          <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div class="mb-3">
                  <PriceBadge :label="car.priceBadge" />
                </div>
                <h1 class="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{{ car.title }}</h1>
                <p class="mt-3 text-base font-bold text-slate-600">{{ car.city }}</p>
              </div>
              <p class="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{{ formatPrice(car.price) }}</p>
            </div>
          </section>

          <SpecGrid :specs="specs" />

          <div ref="mobileContactRef" class="lg:hidden">
            <CarContactPanel
              :seller="car.seller"
              :city="car.city"
              compact
            />
          </div>

          <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 class="text-xl font-black tracking-tight text-slate-950">Описание</h2>
            <p class="mt-3 text-base leading-8 text-slate-600">{{ car.description }}</p>
          </section>
        </div>

        <div class="hidden lg:block">
          <CarContactPanel
            class="lg:sticky lg:top-24"
            :seller="car.seller"
            :city="car.city"
          />
        </div>
      </div>

      <section class="py-10 sm:py-12">
        <SectionHeader title="Похожие автомобили" subtitle="Близкие варианты по цене, марке или типу топлива." />
        <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CarCard v-for="similarCar in similarCars" :key="similarCar.id" :car="similarCar" />
        </div>
      </section>
      </div>
    </main>

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
        class="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-16px_40px_rgba(15,23,42,0.14)] backdrop-blur lg:hidden"
      >
        <div class="mx-auto flex max-w-lg items-center gap-3">
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-black text-slate-950">{{ car.seller.name }}</p>
            <p class="text-sm font-bold text-slate-600">{{ formatPrice(car.price) }}</p>
          </div>
          <button class="focus-ring min-h-11 shrink-0 rounded-2xl bg-emerald-600 px-4 text-sm font-black text-white shadow-lg shadow-emerald-600/20">
            Связаться
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
