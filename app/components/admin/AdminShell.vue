<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()

const accessState = ref<'checking' | 'allowed' | 'blocked'>('checking')
const { readyTelegramWebApp, waitForTelegramInitData } = useAdminApi()

onMounted(async () => {
  readyTelegramWebApp()
  accessState.value = await waitForTelegramInitData() ? 'allowed' : 'blocked'
})
</script>

<template>
  <main class="min-h-screen bg-slate-100 pb-8 text-slate-950">
    <AdminToast />

    <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div class="mx-auto max-w-lg px-4 py-3">
        <div class="flex items-center justify-between gap-3">
          <NuxtLink to="/admin" class="focus-ring rounded-lg text-sm font-bold text-emerald-700">
            AutoHub KG
          </NuxtLink>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            TG Admin
          </span>
        </div>
        <h1 class="mt-3 text-xl font-bold tracking-tight">{{ title }}</h1>
        <p v-if="subtitle" class="mt-1.5 text-sm leading-5 text-slate-600">{{ subtitle }}</p>
      </div>
    </header>

    <div v-if="accessState === 'checking'" class="mx-auto max-w-lg px-4 py-4">
      <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-sm font-bold text-slate-600">Проверяем доступ...</p>
      </section>
    </div>

    <div v-else-if="accessState === 'blocked'" class="mx-auto max-w-lg px-4 py-4">
      <section class="rounded-lg border border-rose-200 bg-rose-50 p-4">
        <h2 class="text-lg font-bold text-rose-900">Нет доступа</h2>
        <p class="mt-2 text-sm font-semibold leading-6 text-rose-800">
          Откройте админку через кнопку Telegram бота.
        </p>
      </section>
    </div>

    <div v-else class="mx-auto max-w-lg px-4 py-4">
      <slot />
    </div>
  </main>
</template>
