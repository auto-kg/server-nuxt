<script setup lang="ts">
import AdminField from '~/components/admin/AdminField.vue'
import AdminShell from '~/components/admin/AdminShell.vue'
import type { SiteSettings } from '~/types/settings'

const isSaving = ref(false)
const isUploadingHero = ref(false)
const isUploadingLogo = ref(false)
const errorMessage = ref('')

const { adminFetch, readyTelegramWebApp } = useAdminApi()
const { showSuccess, showError } = useAdminToast()
const settingsResponse = ref<{ data: SiteSettings }>()

const settings = reactive<SiteSettings>({
  logoText: 'ЛЯМБАР',
  logoInitial: 'L',
  logoImage: '/uploads/site-logo.png',
  heroBadge: 'Проверенные автомобили по всему Кыргызстану',
  heroTitle: 'Go AutoHub KG.',
  heroSubtitle: 'Найдите лучшее авто в Бишкеке и крупных городах Кыргызстана.',
  heroImage: '/uploads/site-hero.png',
  footerDescription: 'Автомобильный маркетплейс Кыргызстана на Nuxt 4 с mobile-first интерфейсом и админкой для Telegram Mini App.',
  telegramUrl: '',
  instagramUrl: '',
  whatsappUrl: ''
})

const inputClass = 'focus-ring min-h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-950 placeholder:text-slate-400'

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
    showError('Нет доступа к админке', errorMessage.value)
  }
})

const save = async () => {
  isSaving.value = true
  errorMessage.value = ''

  try {
    const response = await adminFetch<{ data: SiteSettings }>('/api/admin/settings', {
      method: 'PATCH',
      body: settings
    })

    Object.assign(settings, response.data)
    await loadSettings()
    showSuccess('Настройки сохранены', 'Изменения применяются на публичном сайте.')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Не удалось сохранить настройки'
    showError('Не удалось сохранить настройки', errorMessage.value)
  } finally {
    isSaving.value = false
  }
}

const handleHeroImageError = (event: Event) => {
  const image = event.target as HTMLImageElement

  if (image.src.endsWith('/uploads/site-hero.png')) {
    return
  }

  image.src = '/uploads/site-hero.png'
}

const handleLogoImageError = (event: Event) => {
  const image = event.target as HTMLImageElement

  if (image.src.endsWith('/uploads/site-logo.png')) {
    return
  }

  image.src = '/uploads/site-logo.png'
}

const uploadLogoImage = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  isUploadingLogo.value = true
  errorMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'site')

    const response = await adminFetch<{ data: Array<{ path: string }> }>('/api/admin/uploads', {
      method: 'POST',
      body: formData
    })

    settings.logoImage = response.data[0]?.path ?? settings.logoImage
    showSuccess('Логотип загружен', 'Не забудьте сохранить настройки.')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Не удалось загрузить логотип'
    showError('Не удалось загрузить логотип', errorMessage.value)
  } finally {
    input.value = ''
    isUploadingLogo.value = false
  }
}

const uploadHeroImage = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  isUploadingHero.value = true
  errorMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'site')

    const response = await adminFetch<{ data: Array<{ path: string }> }>('/api/admin/uploads', {
      method: 'POST',
      body: formData
    })

    settings.heroImage = response.data[0]?.path ?? settings.heroImage
    showSuccess('Изображение загружено', 'Не забудьте сохранить настройки.')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Не удалось загрузить изображение'
    showError('Не удалось загрузить изображение', errorMessage.value)
  } finally {
    input.value = ''
    isUploadingHero.value = false
  }
}

useHead({
  title: 'Настройки сайта - AutoHub KG'
})
</script>

<template>
  <AdminShell title="Настройки сайта" subtitle="Редкие действия: логотип, главный фон и тексты.">
    <form class="grid gap-4" @submit.prevent="save">
      <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid gap-4">
          <AdminField label="Логотип / название">
            <input v-model.trim="settings.logoText" :class="inputClass">
          </AdminField>

          <AdminField label="Буквы в иконке логотипа" hint="1-2 символа. Например: A или KG.">
            <input v-model.trim="settings.logoInitial" :class="inputClass" maxlength="2">
          </AdminField>

          <AdminField label="Изображение логотипа" hint="PNG/WebP с прозрачным фоном подойдет лучше всего. Если файл не загрузится, сайт покажет буквенную иконку.">
            <div class="grid gap-3">
              <div class="flex h-32 items-center justify-center rounded-lg bg-slate-950 p-4">
                <img :src="settings.logoImage" alt="" class="max-h-full max-w-full object-contain" @error="handleLogoImageError">
              </div>
              <input class="text-sm font-bold text-slate-700" accept="image/jpeg,image/png,image/webp,image/gif" type="file" @change="uploadLogoImage">
              <textarea v-model.trim="settings.logoImage" class="focus-ring min-h-20 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950" />
              <p v-if="isUploadingLogo" class="text-sm font-bold text-slate-500">Загружаем логотип...</p>
            </div>
          </AdminField>

          <AdminField label="Текст бейджа над заголовком">
            <input v-model.trim="settings.heroBadge" :class="inputClass">
          </AdminField>

          <AdminField label="Заголовок hero">
            <input v-model.trim="settings.heroTitle" :class="inputClass">
          </AdminField>

          <AdminField label="Подзаголовок hero">
            <textarea v-model.trim="settings.heroSubtitle" class="focus-ring min-h-24 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950" />
          </AdminField>

          <AdminField label="Главное изображение" hint="Для главного экрана лучше использовать широкое фото: примерно 16:9 или шире. Узкие и квадратные изображения будут кадрироваться.">
            <div class="grid gap-3">
              <div class="aspect-[16/9] overflow-hidden rounded-lg bg-slate-200">
                <img :src="settings.heroImage" alt="" class="h-full w-full object-cover object-center" @error="handleHeroImageError">
              </div>
              <input class="text-sm font-bold text-slate-700" accept="image/jpeg,image/png,image/webp,image/gif" type="file" @change="uploadHeroImage">
              <textarea v-model.trim="settings.heroImage" class="focus-ring min-h-20 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950" />
              <p v-if="isUploadingHero" class="text-sm font-bold text-slate-500">Загружаем изображение...</p>
            </div>
          </AdminField>

          <AdminField label="Текст footer">
            <textarea v-model.trim="settings.footerDescription" class="focus-ring min-h-24 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950" />
          </AdminField>

          <AdminField label="Telegram ссылка" hint="Например: https://t.me/lyambar_rassilka">
            <input v-model.trim="settings.telegramUrl" :class="inputClass" inputmode="url" placeholder="https://t.me/...">
          </AdminField>

          <AdminField label="Instagram ссылка" hint="Например: https://instagram.com/username">
            <input v-model.trim="settings.instagramUrl" :class="inputClass" inputmode="url" placeholder="https://instagram.com/...">
          </AdminField>

          <AdminField label="WhatsApp ссылка" hint="Например: https://wa.me/996555000000">
            <input v-model.trim="settings.whatsappUrl" :class="inputClass" inputmode="url" placeholder="https://wa.me/...">
          </AdminField>
        </div>
      </section>

      <p v-if="errorMessage" class="rounded-lg bg-rose-50 p-4 text-sm font-bold text-rose-700">
        {{ errorMessage }}
      </p>

      <button
        class="focus-ring min-h-11 rounded-lg bg-emerald-600 px-5 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 disabled:opacity-60"
        :disabled="isSaving"
        type="submit"
      >
        {{ isSaving ? 'Сохраняем...' : 'Сохранить настройки' }}
      </button>
    </form>
  </AdminShell>
</template>
