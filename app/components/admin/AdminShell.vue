<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <main class="min-h-screen bg-slate-100 pb-8 text-slate-950">
    <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div class="mx-auto max-w-lg px-4 py-4">
        <div class="flex items-center justify-between gap-3">
          <NuxtLink to="/admin" class="focus-ring rounded-2xl text-sm font-black text-emerald-700">
            AutoHub KG
          </NuxtLink>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
            TG Admin
          </span>
        </div>
        <h1 class="mt-4 text-2xl font-black tracking-tight">{{ title }}</h1>
        <p v-if="subtitle" class="mt-2 text-sm leading-6 text-slate-600">{{ subtitle }}</p>
      </div>
    </header>

    <div class="mx-auto max-w-lg px-4 py-5">
      <slot />
    </div>
  </main>
</template>
