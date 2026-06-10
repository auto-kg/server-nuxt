<script setup lang="ts">
withDefaults(defineProps<{
  padding?: 'none' | 'sm' | 'md'
  variant?: 'glass' | 'soft' | 'plain'
}>(), {
  padding: 'md',
  variant: 'glass'
})
</script>

<template>
  <div
    :class="[
      'rounded-lg',
      variant === 'glass' && 'lux-glass',
      variant === 'soft' && 'border border-white/35 bg-white/30 shadow-[0_18px_60px_rgba(17,19,21,0.08)] backdrop-blur-xl',
      variant === 'plain' && 'border border-slate-200 bg-white shadow-sm',
      padding === 'sm' && 'p-3 sm:p-4',
      padding === 'md' && 'p-4 sm:p-5'
    ]"
  >
    <slot />
  </div>
</template>
