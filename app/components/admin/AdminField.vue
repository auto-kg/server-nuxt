<script setup lang="ts">
defineProps<{
  label: string
  hint?: string
}>()
</script>

<template>
  <label class="grid gap-2 text-sm font-bold text-slate-800">
    {{ label }}
    <slot />
    <span v-if="hint" class="text-xs font-semibold leading-5 text-slate-500">{{ hint }}</span>
  </label>
</template>
