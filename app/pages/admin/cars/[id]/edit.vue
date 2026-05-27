<script setup lang="ts">
import AdminCarForm from '~/components/admin/AdminCarForm.vue'
import AdminShell from '~/components/admin/AdminShell.vue'
import type { Car } from '~/types/car'

interface DictionariesResponse {
  data: {
    brands: string[]
    models: string[]
    cities: string[]
    fuels: string[]
    transmissions: string[]
    drivetrains: string[]
    colors: string[]
  }
}

const route = useRoute()
const carId = computed(() => String(route.params.id ?? ''))
const car = ref<Car>()
const dictionariesResponse = ref<DictionariesResponse>()
const savedId = ref('')
const errorMessage = ref('')
const isLoading = ref(true)
const { adminFetch, readyTelegramWebApp } = useAdminApi()
const { showSuccess, showError } = useAdminToast()

const unique = (values: string[]) => [...new Set(values.filter(Boolean))]

const defaultDictionaries = {
  brands: [],
  models: [],
  cities: ['Бишкек', 'Ош', 'Джалал-Абад'],
  fuels: ['Бензин', 'Дизель', 'Гибрид', 'Электро', 'Газ'],
  transmissions: ['Автомат', 'Механика', 'Робот', 'Вариатор'],
  drivetrains: ['Передний', 'Задний', 'Полный'],
  colors: ['Белый', 'Черный', 'Серый', 'Серебристый', 'Синий', 'Красный', 'Зеленый', 'Коричневый']
}

const loadData = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const [dictionaries, carResponse] = await Promise.all([
      adminFetch<DictionariesResponse>('/api/admin/dictionaries'),
      adminFetch<{ data: Car }>(`/api/admin/cars/${carId.value}`)
    ])

    dictionariesResponse.value = dictionaries
    car.value = carResponse.data
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Не удалось загрузить автомобиль'
    showError('Не удалось загрузить автомобиль', errorMessage.value)
  } finally {
    isLoading.value = false
  }
}

const dictionaries = computed(() => {
  const loaded = dictionariesResponse.value?.data

  return {
    brands: unique([...(loaded?.brands ?? []), ...defaultDictionaries.brands]),
    models: unique([...(loaded?.models ?? []), ...defaultDictionaries.models]),
    cities: unique([...(loaded?.cities ?? []), ...defaultDictionaries.cities]),
    fuels: unique([...(loaded?.fuels ?? []), ...defaultDictionaries.fuels]),
    transmissions: unique([...(loaded?.transmissions ?? []), ...defaultDictionaries.transmissions]),
    drivetrains: unique([...(loaded?.drivetrains ?? []), ...defaultDictionaries.drivetrains]),
    colors: unique([...(loaded?.colors ?? []), ...defaultDictionaries.colors])
  }
})

onMounted(async () => {
  readyTelegramWebApp()
  await loadData()
})

const handleSaved = (id: string) => {
  savedId.value = id
  showSuccess('Изменения сохранены', 'Данные автомобиля обновлены.')
}

useHead({
  title: 'Редактировать автомобиль - AutoHub KG'
})
</script>

<template>
  <AdminShell title="Редактировать авто" subtitle="Можно менять основные данные, характеристики, продавца и фотографии.">
    <p v-if="errorMessage" class="mb-4 rounded-lg bg-rose-50 p-4 text-sm font-bold text-rose-700">
      {{ errorMessage }}
    </p>

    <p v-if="isLoading" class="rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-500">
      Загружаем автомобиль...
    </p>

    <div v-else-if="car" class="grid gap-4">
      <NuxtLink
        v-if="savedId"
        :to="{ path: `/cars/${savedId}`, query: { from: 'admin' } }"
        class="focus-ring min-h-10 rounded-lg bg-emerald-600 px-4 py-3 text-center text-sm font-bold text-white"
      >
        Открыть объявление
      </NuxtLink>

      <AdminCarForm
        :dictionaries="dictionaries"
        :initial-car="car"
        submit-label="Сохранить изменения"
        @saved="handleSaved"
      />
    </div>
  </AdminShell>
</template>
