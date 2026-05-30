<script setup lang="ts">
import type { PriceBadge } from '~/types/car'

const props = defineProps<{
  label: PriceBadge
}>()

const badgeClass = computed(() => {
  if (props.label === 'Top deal') {
    return 'border-white/45 bg-white/75 text-neutral-950'
  }

  if (props.label === 'Хорошая цена') {
    return 'border-white/45 bg-neutral-100/80 text-neutral-800'
  }

  if (props.label === 'Срочно') {
    return 'border-rose-200/60 bg-rose-50/85 text-rose-700'
  }

  return 'border-white/45 bg-stone-100/85 text-stone-800'
})
</script>

<template>
  <span
    class="inline-flex items-center rounded-sm border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] shadow-sm backdrop-blur"
    :class="badgeClass"
  >
    {{ label }}
  </span>
</template>
