<script setup lang="ts">
import type { PriceBadge } from '~/types/car'

const props = defineProps<{
  label: PriceBadge
}>()

const badgeClass = computed(() => {
  if (props.label === 'Top deal') {
    return 'bg-emerald-100 text-emerald-800'
  }

  if (props.label === 'Хорошая цена') {
    return 'bg-sky-100 text-sky-800'
  }

  return 'bg-amber-100 text-amber-800'
})
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
    :class="badgeClass"
  >
    {{ label }}
  </span>
</template>
