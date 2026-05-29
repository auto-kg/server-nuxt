<script setup lang="ts">
import AdminField from '~/components/admin/AdminField.vue'
import AdminShell from '~/components/admin/AdminShell.vue'
import type { AdminCategoryPayload, AdminVehicleTypePayload, HomeCategory, VehicleType } from '~/types/car'

const { adminFetch, readyTelegramWebApp } = useAdminApi()
const { showSuccess, showError } = useAdminToast()
const categoriesResponse = ref<{ data: HomeCategory[] }>()
const vehicleTypesResponse = ref<{ data: VehicleType[] }>()

const isSubmittingCategory = ref(false)
const isSubmittingVehicleType = ref(false)
const errorMessage = ref('')

const categoryForm = reactive<AdminCategoryPayload>({
  title: '',
  description: '',
  image: '',
  sortOrder: 10,
  isActive: true
})

const vehicleTypeForm = reactive<AdminVehicleTypePayload>({
  value: '',
  title: '',
  description: '',
  image: '',
  sortOrder: 10,
  isActive: true
})

const categories = computed(() => categoriesResponse.value?.data ?? [])
const vehicleTypes = computed(() => vehicleTypesResponse.value?.data ?? [])
const inputClass = 'focus-ring min-h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-950 placeholder:text-slate-400'
const textareaClass = 'focus-ring min-h-24 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 placeholder:text-slate-400'

const loadData = async () => {
  const [categoriesData, vehicleTypesData] = await Promise.all([
    adminFetch<{ data: HomeCategory[] }>('/api/admin/categories'),
    adminFetch<{ data: VehicleType[] }>('/api/admin/vehicle-types')
  ])

  categoriesResponse.value = categoriesData
  vehicleTypesResponse.value = vehicleTypesData
}

onMounted(async () => {
  readyTelegramWebApp()

  try {
    await loadData()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Нет доступа к админке'
    showError('Нет доступа к админке', errorMessage.value)
  }
})

const submitCategory = async () => {
  isSubmittingCategory.value = true
  errorMessage.value = ''

  try {
    await adminFetch('/api/admin/categories', {
      method: 'POST',
      body: categoryForm
    })

    categoryForm.title = ''
    categoryForm.description = ''
    categoryForm.image = ''
    categoryForm.sortOrder += 10
    categoryForm.isActive = true
    await loadData()
    showSuccess('Категория добавлена', 'Она появится на главной странице.')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Не удалось добавить категорию'
    showError('Не удалось добавить категорию', errorMessage.value)
  } finally {
    isSubmittingCategory.value = false
  }
}

const submitVehicleType = async () => {
  isSubmittingVehicleType.value = true
  errorMessage.value = ''

  try {
    await adminFetch('/api/admin/vehicle-types', {
      method: 'POST',
      body: vehicleTypeForm
    })

    vehicleTypeForm.value = ''
    vehicleTypeForm.title = ''
    vehicleTypeForm.description = ''
    vehicleTypeForm.image = ''
    vehicleTypeForm.sortOrder += 10
    vehicleTypeForm.isActive = true
    await loadData()
    showSuccess('Тип транспорта добавлен', 'Его можно будет выбрать в карточке автомобиля.')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Не удалось добавить тип транспорта'
    showError('Не удалось добавить тип транспорта', errorMessage.value)
  } finally {
    isSubmittingVehicleType.value = false
  }
}

useHead({
  title: 'Категории и типы - AutoHub KG'
})
</script>

<template>
  <AdminShell title="Категории и типы" subtitle="Карточки для главной страницы и связи с объявлениями. Изображения задаются внешними URL.">
    <div class="grid gap-4">
      <form class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" @submit.prevent="submitCategory">
        <div class="grid gap-4">
          <h2 class="text-lg font-bold">Популярная категория</h2>

          <AdminField label="Название">
            <input v-model.trim="categoryForm.title" :class="inputClass" placeholder="Семейные SUV" required>
          </AdminField>

          <AdminField label="Описание">
            <textarea v-model.trim="categoryForm.description" :class="textareaClass" placeholder="Коротко: для кого эта подборка и какие авто туда относить." />
          </AdminField>

          <AdminField label="Изображение URL">
            <div class="grid gap-3">
              <textarea v-model.trim="categoryForm.image" :class="textareaClass" placeholder="https://..." required />
              <img v-if="categoryForm.image" :src="categoryForm.image" alt="" class="h-36 w-full rounded-lg bg-slate-100 object-cover">
            </div>
          </AdminField>

          <AdminField label="Порядок">
            <input v-model.number="categoryForm.sortOrder" :class="inputClass" inputmode="numeric" type="number">
          </AdminField>

          <label class="flex min-h-10 items-center justify-between gap-4 rounded-lg bg-slate-50 px-4 text-sm font-bold text-slate-800">
            Активна
            <input v-model="categoryForm.isActive" class="h-5 w-5 accent-emerald-600" type="checkbox">
          </label>

          <p v-if="errorMessage" class="rounded-lg bg-rose-50 p-4 text-sm font-bold text-rose-700">
            {{ errorMessage }}
          </p>

          <button
            class="focus-ring min-h-11 rounded-lg bg-emerald-600 px-5 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 disabled:opacity-60"
            :disabled="isSubmittingCategory"
            type="submit"
          >
            {{ isSubmittingCategory ? 'Добавляем...' : 'Добавить категорию' }}
          </button>
        </div>
      </form>

      <form class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" @submit.prevent="submitVehicleType">
        <div class="grid gap-4">
          <h2 class="text-lg font-bold">Тип транспорта</h2>

          <AdminField label="Название">
            <input v-model.trim="vehicleTypeForm.title" :class="inputClass" placeholder="Седан" required>
          </AdminField>

          <AdminField label="Код" hint="Можно оставить пустым, код сформируется из названия. Используется в ссылках фильтра.">
            <input v-model.trim="vehicleTypeForm.value" :class="inputClass" placeholder="sedan">
          </AdminField>

          <AdminField label="Описание">
            <textarea v-model.trim="vehicleTypeForm.description" :class="textareaClass" placeholder="Коротко опишите тип кузова или назначение." />
          </AdminField>

          <AdminField label="Изображение URL">
            <div class="grid gap-3">
              <textarea v-model.trim="vehicleTypeForm.image" :class="textareaClass" placeholder="https://..." />
              <img v-if="vehicleTypeForm.image" :src="vehicleTypeForm.image" alt="" class="h-36 w-full rounded-lg bg-slate-100 object-contain">
            </div>
          </AdminField>

          <AdminField label="Порядок">
            <input v-model.number="vehicleTypeForm.sortOrder" :class="inputClass" inputmode="numeric" type="number">
          </AdminField>

          <label class="flex min-h-10 items-center justify-between gap-4 rounded-lg bg-slate-50 px-4 text-sm font-bold text-slate-800">
            Активен
            <input v-model="vehicleTypeForm.isActive" class="h-5 w-5 accent-emerald-600" type="checkbox">
          </label>

          <button
            class="focus-ring min-h-11 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white shadow-sm disabled:opacity-60"
            :disabled="isSubmittingVehicleType"
            type="submit"
          >
            {{ isSubmittingVehicleType ? 'Добавляем...' : 'Добавить тип' }}
          </button>
        </div>
      </form>

      <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 class="text-lg font-bold">Текущие категории</h2>

        <div v-if="categories.length" class="mt-4 grid gap-3">
          <article
            v-for="category in categories"
            :key="category.id"
            class="flex gap-3 rounded-lg border border-slate-100 p-3"
          >
            <img :src="category.image" :alt="category.title" class="h-16 w-20 rounded-xl object-cover">
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-bold text-slate-950">{{ category.title }}</p>
              <p v-if="category.description" class="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-600">{{ category.description }}</p>
              <p class="mt-1 text-xs font-bold text-slate-500">
                {{ category.isActive ? 'Активна' : 'Скрыта' }} · порядок {{ category.sortOrder }}
              </p>
            </div>
          </article>
        </div>

        <p v-else class="mt-4 rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-500">
          Категорий пока нет.
        </p>
      </section>

      <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 class="text-lg font-bold">Текущие типы транспорта</h2>

        <div v-if="vehicleTypes.length" class="mt-4 grid gap-3">
          <article
            v-for="type in vehicleTypes"
            :key="type.id"
            class="flex gap-3 rounded-lg border border-slate-100 p-3"
          >
            <img v-if="type.image" :src="type.image" :alt="type.title" class="h-16 w-20 rounded-xl bg-slate-100 object-contain">
            <div v-else class="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500">
              {{ type.title.slice(0, 2).toUpperCase() }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-bold text-slate-950">{{ type.title }}</p>
              <p v-if="type.description" class="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-600">{{ type.description }}</p>
              <p class="mt-1 text-xs font-bold text-slate-500">
                {{ type.isActive ? 'Активен' : 'Скрыт' }} · {{ type.value }} · порядок {{ type.sortOrder }}
              </p>
            </div>
          </article>
        </div>

        <p v-else class="mt-4 rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-500">
          Типов транспорта пока нет.
        </p>
      </section>
    </div>
  </AdminShell>
</template>
