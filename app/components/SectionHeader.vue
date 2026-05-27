<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  compact?: boolean
}>()
</script>

<template>
  <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h2 :class="compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'" class="font-black tracking-tight text-slate-950">{{ title }}</h2>
      <p v-if="subtitle" :class="compact ? 'mt-1 text-sm leading-6' : 'mt-2 text-base leading-7'" class="max-w-2xl text-slate-600">{{ subtitle }}</p>
    </div>
    <slot />
  </div>
</template>
