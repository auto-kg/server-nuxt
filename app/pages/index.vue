<script setup lang="ts">
import type { Car, CarSearchFilters, HomeCategory } from '~/types/car'
import type { SiteSettings } from '~/types/settings'

const { data: carsResponse } = await useFetch<{ data: Car[] }>('/api/cars')
const { data: settingsResponse } = await useFetch<{ data: SiteSettings }>('/api/settings')
const { data: categoriesResponse } = await useFetch<{ data: HomeCategory[] }>('/api/categories')
const allCars = computed(() => carsResponse.value?.data ?? [])
const categories = computed(() => categoriesResponse.value?.data ?? [])
const displayedCars = ref<Car[]>([])
const settings = computed(() => settingsResponse.value?.data)

const featuredCars = computed(() => allCars.value.filter((car) => car.isFeatured).slice(0, 6))

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

watch(
  allCars,
  (cars) => {
    displayedCars.value = cars
  },
  { immediate: true }
)

const handleSearch = async (filters: CarSearchFilters) => {
  const response = await $fetch<{ data: Car[] }>('/api/cars', {
    query: filters
  })

  displayedCars.value = response.data
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
      <section class="relative bg-white pb-8 lg:pb-24">
        <div class="relative min-h-[520px] overflow-hidden bg-slate-900 shadow-soft sm:min-h-[620px] lg:min-h-[660px]">
            <img
              src="/banner2.png"
              alt="Автомобиль на дороге"
              class="absolute inset-0 h-full w-full object-cover"
            >
            <div class="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/10 to-slate-950/55" />
            <div class="relative flex min-h-[520px] items-end px-5 pb-28 sm:min-h-[620px] sm:px-10 sm:pb-36 lg:min-h-[660px] lg:px-20">
              <div class="max-w-3xl text-white">
                <p class="mb-4 inline-flex rounded-full bg-white/90 px-4 py-2 text-sm font-black text-slate-950">
                  {{ settings?.heroBadge }}
                </p>
                <h1 class="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                  {{ settings?.heroTitle }}
                </h1>
                <p class="mt-4 max-w-2xl text-lg font-semibold leading-8 text-white/90 sm:text-2xl">
                  {{ settings?.heroSubtitle }}
                </p>
              </div>
            </div>
        </div>

        <div class="relative -mt-16 px-4 sm:px-6 md:mx-auto md:w-[80%] md:px-0 lg:absolute lg:inset-x-0 lg:bottom-0 lg:w-[70%] lg:translate-y-1/2">
          <div class="mx-auto">
            <SearchForm :cars="allCars" @search="handleSearch" />
          </div>
        </div>
      </section>

      <section class="px-4 py-4 sm:px-6 sm:py-5 md:mx-auto md:w-[80%] md:px-0 lg:w-[70%] lg:pb-5 lg:pt-36">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <SectionHeader title="Популярные категории" subtitle="Быстрые подборки для разных сценариев покупки." compact />

          <HorizontalScroller v-if="categories.length" class="mt-4">
            <article
              v-for="category in categories"
              :key="category.title"
              class="group w-[78%] shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white sm:w-[46%] lg:w-[31%] xl:w-[23.5%]"
            >
              <div class="aspect-[4/3] overflow-hidden bg-slate-200">
                <img :src="category.image" :alt="category.title" class="h-full w-full object-cover transition duration-500 group-hover:scale-105">
              </div>
              <div class="p-4">
                <h3 class="text-lg font-black text-slate-950">{{ category.title }}</h3>
                <p class="mt-1 text-sm font-semibold text-slate-500">Открыть подборку</p>
              </div>
            </article>
          </HorizontalScroller>

          <div v-else class="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm font-bold text-slate-500">
            Категории пока не добавлены
          </div>
        </div>
      </section>

      <section class="px-4 py-4 sm:px-6 sm:py-5 md:mx-auto md:w-[80%] md:px-0 lg:w-[70%]">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <SectionHeader
            title="Лучшие предложения"
            subtitle="Подборка автомобилей с сильной комплектацией, понятной историей и привлекательной оценкой цены."
            compact
          />

          <HorizontalScroller v-if="featuredCars.length" class="mt-4">
            <div
              v-for="car in featuredCars"
              :key="car.id"
              class="w-[84%] shrink-0 snap-start sm:w-[48%] lg:w-[46%] xl:w-[31.5%]"
            >
              <CarCard :car="car" />
            </div>
          </HorizontalScroller>

          <div v-else class="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm font-bold text-slate-500">
            Лучшие предложения пока не выбраны
          </div>
        </div>
      </section>

      <section class="px-4 py-4 sm:px-6 sm:py-5 md:mx-auto md:w-[80%] md:px-0 lg:w-[70%]">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <SectionHeader
            title="Каталог автомобилей"
            :subtitle="`${displayedCars.length} предложений доступно сейчас`"
            compact
          />

          <div v-if="displayedCars.length" class="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <CarCard v-for="car in displayedCars" :key="car.id" :car="car" />
          </div>

          <div v-else class="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <h3 class="text-xl font-black text-slate-950">Ничего не найдено</h3>
            <p class="mt-2 text-slate-600">Попробуйте изменить марку, цену или год выпуска.</p>
          </div>
        </div>
      </section>

      <section class="py-4 sm:py-5">
        <div class="px-4 sm:px-6 md:mx-auto md:w-[80%] md:px-0 lg:w-[70%]">
          <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <SectionHeader title="Популярные марки" subtitle="Быстрый вход в самые востребованные объявления каталога." compact />

            <div v-if="popularBrands.length" class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-8">
              <button
                v-for="item in popularBrands"
                :key="item.brand"
                class="focus-ring min-h-24 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
                type="button"
              >
                <span class="block text-lg font-black text-slate-950">{{ item.brand }}</span>
                <span class="mt-1 block text-sm font-semibold text-slate-500">{{ item.count }} авто</span>
              </button>
            </div>
            <div v-else class="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm font-bold text-slate-500">
              Марки появятся после добавления авто
            </div>
          </div>
        </div>
      </section>

      <section class="container-page py-8 pb-12 sm:py-10 sm:pb-16">
        <SectionHeader title="Почему выбирают нас" subtitle="Фокус на понятном выборе и быстром сравнении объявлений." />

        <div class="mt-6 grid gap-4 md:grid-cols-3">
          <article
            v-for="advantage in advantages"
            :key="advantage.title"
            class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h3 class="text-lg font-black text-slate-950">{{ advantage.title }}</h3>
            <p class="mt-3 leading-7 text-slate-600">{{ advantage.text }}</p>
          </article>
        </div>
      </section>
    </main>

    <footer class="w-full border-t border-slate-200 bg-white">
      <div class="container-page py-8 sm:py-10">
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-lg font-black text-slate-950">{{ settings?.logoText }}</p>
            <p class="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              {{ settings?.footerDescription }}
            </p>
          </div>
          <nav class="flex flex-wrap gap-4 text-sm font-bold text-slate-600">
            <NuxtLink class="focus-ring rounded-lg hover:text-slate-950" to="/">Купить</NuxtLink>
            <NuxtLink class="focus-ring rounded-lg hover:text-slate-950" to="/">Продать</NuxtLink>
            <NuxtLink class="focus-ring rounded-lg hover:text-slate-950" to="/">Лизинг</NuxtLink>
            <NuxtLink class="focus-ring rounded-lg hover:text-slate-950" to="/">Избранное</NuxtLink>
          </nav>
        </div>
      </div>
    </footer>
  </div>
</template>
