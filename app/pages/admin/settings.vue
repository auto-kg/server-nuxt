<script setup lang="ts">
import AdminField from '~/components/admin/AdminField.vue'
import AdminShell from '~/components/admin/AdminShell.vue'
import type { SiteSettings } from '~/types/settings'

const isSaving = ref(false)
const saved = ref(false)
const errorMessage = ref('')

const { adminFetch, readyTelegramWebApp } = useAdminApi()
const settingsResponse = ref<{ data: SiteSettings }>()

const settings = reactive<SiteSettings>({
  logoText: 'AutoHub KG',
  logoInitial: 'A',
  heroBadge: 'Проверенные автомобили по всему Кыргызстану',
  heroTitle: 'Go AutoHub KG.',
  heroSubtitle: 'Найдите лучшее авто в Бишкеке и крупных городах Кыргызстана.',
  heroImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2200&q=82',
  footerDescription: 'Автомобильный маркетплейс Кыргызстана на Nuxt 4 с mobile-first интерфейсом и админкой для Telegram Mini App.'
})

const inputClass = 'focus-ring min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-base font-bold text-slate-950 placeholder:text-slate-400'

watch(
  () => settingsResponse.value?.data,
  (value) => {
    if (value) {
      Object.assign(settings, value)
    }
  },
  { immediate: true }
)

const loadSettings = async () => {
  settingsResponse.value = await adminFetch<{ data: SiteSettings }>('/api/admin/settings')
}

onMounted(async () => {
  readyTelegramWebApp()

  try {
    await loadSettings()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Нет доступа к админке'
  }
})

const save = async () => {
  isSaving.value = true
  saved.value = false
  errorMessage.value = ''

  try {
    const response = await adminFetch<{ data: SiteSettings }>('/api/admin/settings', {
      method: 'PATCH',
      body: settings
    })

    Object.assign(settings, response.data)
    await loadSettings()
    saved.value = true
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Не удалось сохранить настройки'
  } finally {
    isSaving.value = false
  }
}

useHead({
  title: 'Настройки сайта - AutoHub KG'
})
</script>

<template>
  <AdminShell title="Настройки сайта" subtitle="Редкие действия: логотип, главный фон и тексты.">
    <form class="grid gap-4" @submit.prevent="save">
      <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid gap-4">
          <AdminField label="Логотип / название">
            <input v-model.trim="settings.logoText" :class="inputClass">
          </AdminField>

          <AdminField label="Буквы в иконке логотипа" hint="1-2 символа. Например: A или KG.">
            <input v-model.trim="settings.logoInitial" :class="inputClass" maxlength="2">
          </AdminField>

          <AdminField label="Текст бейджа над заголовком">
            <input v-model.trim="settings.heroBadge" :class="inputClass">
          </AdminField>

          <AdminField label="Заголовок hero">
            <input v-model.trim="settings.heroTitle" :class="inputClass">
          </AdminField>

          <AdminField label="Подзаголовок hero">
            <textarea v-model.trim="settings.heroSubtitle" class="focus-ring min-h-24 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-950" />
          </AdminField>

          <AdminField label="Главное изображение URL">
            <textarea v-model.trim="settings.heroImage" class="focus-ring min-h-24 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-950" />
          </AdminField>

          <AdminField label="Текст footer">
            <textarea v-model.trim="settings.footerDescription" class="focus-ring min-h-24 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-950" />
          </AdminField>
        </div>
      </section>

      <p v-if="saved" class="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
        Настройки сохранены и применяются на публичном сайте.
      </p>

      <p v-if="errorMessage" class="rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-700">
        {{ errorMessage }}
      </p>

      <button
        class="focus-ring min-h-14 rounded-2xl bg-emerald-600 px-5 text-base font-black text-white shadow-lg shadow-emerald-600/20 disabled:opacity-60"
        :disabled="isSaving"
        type="submit"
      >
        {{ isSaving ? 'Сохраняем...' : 'Сохранить настройки' }}
      </button>
    </form>
  </AdminShell>
</template>
