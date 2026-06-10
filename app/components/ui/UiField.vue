<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <label class="grid gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-700">
    {{ label }}
    <slot />
  </label>
</template>
