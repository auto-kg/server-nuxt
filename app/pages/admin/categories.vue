<script setup lang="ts">
import AdminField from '~/components/admin/AdminField.vue'
import AdminShell from '~/components/admin/AdminShell.vue'
import type { AdminCategoryPayload, HomeCategory } from '~/types/car'

const { adminFetch, readyTelegramWebApp } = useAdminApi()
const data = ref<{ data: HomeCategory[] }>()

const isSubmitting = ref(false)
const errorMessage = ref('')

const form = reactive<AdminCategoryPayload>({
  title: '',
  image: '',
  sortOrder: 10,
  isActive: true
})

const categories = computed(() => data.value?.data ?? [])
const inputClass = 'focus-ring min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base font-bold text-slate-950 placeholder:text-slate-400'

const loadCategories = async () => {
  data.value = await adminFetch<{ data: HomeCategory[] }>('/api/admin/categories')
}

onMounted(async () => {
  readyTelegramWebApp()

  try {
    await loadCategories()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Нет доступа к админке'
  }
})

const submit = async () => {
  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await adminFetch('/api/admin/categories', {
      method: 'POST',
      body: form
    })

    form.title = ''
    form.image = ''
    form.sortOrder += 10
    form.isActive = true
    await loadCategories()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Не удалось добавить категорию'
  } finally {
    isSubmitting.value = false
  }
}

useHead({
  title: 'Популярные категории - AutoHub KG'
})
</script>

<template>
  <AdminShell title="Популярные категории" subtitle="Эти карточки отображаются на главной странице.">
    <div class="grid gap-4">
      <form class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" @submit.prevent="submit">
        <div class="grid gap-4">
          <AdminField label="Название">
            <input v-model.trim="form.title" :class="inputClass" placeholder="Семейные SUV" required>
          </AdminField>

          <AdminField label="Изображение URL">
            <textarea v-model.trim="form.image" class="focus-ring min-h-24 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-950" placeholder="https://..." required />
          </AdminField>

          <AdminField label="Порядок">
            <input v-model.number="form.sortOrder" :class="inputClass" inputmode="numeric" type="number">
          </AdminField>

          <label class="flex min-h-12 items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 text-sm font-black text-slate-800">
            Активна
            <input v-model="form.isActive" class="h-5 w-5 accent-emerald-600" type="checkbox">
          </label>

          <p v-if="errorMessage" class="rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-700">
            {{ errorMessage }}
          </p>

          <button
            class="focus-ring min-h-14 rounded-2xl bg-emerald-600 px-5 text-base font-black text-white shadow-lg shadow-emerald-600/20 disabled:opacity-60"
            :disabled="isSubmitting"
            type="submit"
          >
            {{ isSubmitting ? 'Добавляем...' : 'Добавить категорию' }}
          </button>
        </div>
      </form>

      <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 class="text-lg font-black">Текущие категории</h2>

        <div v-if="categories.length" class="mt-4 grid gap-3">
          <article
            v-for="category in categories"
            :key="category.id"
            class="flex gap-3 rounded-2xl border border-slate-100 p-3"
          >
            <img :src="category.image" :alt="category.title" class="h-16 w-20 rounded-xl object-cover">
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-black text-slate-950">{{ category.title }}</p>
              <p class="mt-1 text-xs font-bold text-slate-500">
                {{ category.isActive ? 'Активна' : 'Скрыта' }} · порядок {{ category.sortOrder }}
              </p>
            </div>
          </article>
        </div>

        <p v-else class="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">
          Категорий пока нет.
        </p>
      </section>
    </div>
  </AdminShell>
</template>
