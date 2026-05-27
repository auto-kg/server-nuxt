<script setup lang="ts">
import AdminCarForm from '~/components/admin/AdminCarForm.vue'
import AdminShell from '~/components/admin/AdminShell.vue'

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

const router = useRouter()
const createdId = ref('')
const errorMessage = ref('')
const data = ref<DictionariesResponse>()
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

const loadDictionaries = async () => {
  data.value = await adminFetch<DictionariesResponse>('/api/admin/dictionaries')
}

onMounted(async () => {
  readyTelegramWebApp()

  try {
    await loadDictionaries()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Нет доступа к админке'
    showError('Нет доступа к админке', errorMessage.value)
  }
})

const dictionaries = computed(() => {
  const loaded = data.value?.data

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

const handleCreated = async (id: string) => {
  createdId.value = id
  showSuccess('Автомобиль сохранен', 'Можно открыть объявление или добавить еще одно авто.')
  await loadDictionaries()
}

useHead({
  title: 'Добавить автомобиль - AutoHub KG'
})
</script>

<template>
  <AdminShell title="Новое авто" subtitle="Форма оптимизирована для телефона и Telegram Mini App.">
    <p v-if="errorMessage" class="mb-4 rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-700">
      {{ errorMessage }}
    </p>

    <div v-if="createdId" class="grid gap-4">
      <button
        class="focus-ring min-h-14 rounded-2xl bg-emerald-600 px-5 text-base font-black text-white"
        type="button"
        @click="router.push({ path: `/cars/${createdId}`, query: { from: 'admin' } })"
      >
        Открыть объявление
      </button>

      <button
        class="focus-ring min-h-14 rounded-2xl border border-slate-200 bg-white px-5 text-base font-black text-slate-950"
        type="button"
        @click="createdId = ''"
      >
        Добавить еще одно авто
      </button>
    </div>

    <AdminCarForm v-else :dictionaries="dictionaries" @created="handleCreated" />
  </AdminShell>
</template>
