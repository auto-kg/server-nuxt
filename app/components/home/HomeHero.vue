<script setup lang="ts">
import type { Car, CarSearchFilters, VehicleType } from '~/types/car'
import type { SiteSettings } from '~/types/settings'

const props = defineProps<{
  settings: SiteSettings
  heroImage: string
  cars: Car[]
  resultCount: number
  vehicleTypes: VehicleType[]
}>()

const emit = defineEmits<{
  change: [filters: CarSearchFilters]
  reset: []
  search: [filters: CarSearchFilters]
}>()

const fallbackHeroImage = '/uploads/site-hero.png'

const handleHeroImageError = (event: Event) => {
  const image = event.target as HTMLImageElement

  if (image.src.endsWith(fallbackHeroImage)) {
    return
  }

  image.src = fallbackHeroImage
}
</script>

<template>
  <section class="relative overflow-hidden">
    <div class="relative min-h-[640px] overflow-hidden">
      <img
        :src="props.heroImage"
        alt="Автомобиль на дороге"
        class="absolute inset-0 h-full w-full object-cover object-center"
        @error="handleHeroImageError"
      >
<!--      <div class="absolute inset-0 bg-gradient-to-r from-[#f4f4f1]/55 via-[#f4f4f1]/24 to-transparent" />-->
      <div class="absolute inset-y-0 left-0 w-[30%] bg-gradient-to-r from-[#f4f4f1]/70 via-[#f4f4f1]/40 to-transparent" />
      <div class="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-[#e5e5e2]/35" />

      <div class="content-page relative grid min-h-[640px] items-center pb-28 pt-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div class="max-w-xl">
          <p class="mb-5 text-[16px] font-semibold uppercase tracking-[0.55em] text-neutral-900">
            {{ props.settings.heroBadge }}
          </p>
          <h1 class="max-w-lg text-5xl font-light leading-[0.92] tracking-normal text-neutral-950 sm:text-7xl lg:text-8xl">
            {{ props.settings.heroTitle }}
          </h1>
          <p class="mt-4 max-w-md text-[22px] leading-7 text-neutral-900 sm:text-[26px]">
            {{ props.settings.heroSubtitle }}
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-4">
            <UiButton to="/catalog">
              Смотреть каталог
              <svg class="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" />
              </svg>
            </UiButton>
          </div>
        </div>
      </div>
    </div>

    <div class="content-page relative -mt-20">
      <SearchForm
        :cars="props.cars"
        :result-count="props.resultCount"
        :vehicle-types="props.vehicleTypes"
        submit-label="Показать"
        @change="emit('change', $event)"
        @reset="emit('reset')"
        @search="emit('search', $event)"
      />
    </div>
  </section>
</template>
