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

onMounted(async () => {
  readyTelegramWebApp()

  try {
    data.value = await adminFetch<DictionariesResponse>('/api/admin/dictionaries')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Нет доступа к админке'
  }
})

const dictionaries = computed(() => data.value?.data ?? {
  brands: [],
  models: [],
  cities: ['Бишкек', 'Ош', 'Джалал-Абад'],
  fuels: [],
  transmissions: [],
  drivetrains: [],
  colors: []
})

const handleCreated = (id: string) => {
  createdId.value = id
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
      <section class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <h2 class="text-lg font-black text-emerald-900">Автомобиль сохранен</h2>
        <p class="mt-2 text-sm font-semibold leading-6 text-emerald-800">
          Сейчас запись хранится in-memory. После подключения Postgres она будет сохраняться постоянно.
        </p>
      </section>

      <button
        class="focus-ring min-h-14 rounded-2xl bg-emerald-600 px-5 text-base font-black text-white"
        type="button"
        @click="router.push(`/cars/${createdId}`)"
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
