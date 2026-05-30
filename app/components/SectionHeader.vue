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
      <h2 :class="compact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'" class="font-semibold tracking-tight text-neutral-950">{{ title }}</h2>
      <p v-if="subtitle" :class="compact ? 'mt-1 text-xs leading-5' : 'mt-2 text-sm leading-6'" class="max-w-2xl text-neutral-600">{{ subtitle }}</p>
    </div>
    <slot />
  </div>
</template>
