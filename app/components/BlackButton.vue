<script setup lang="ts">
withDefaults(defineProps<{
  to?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  compact?: boolean
}>(), {
  type: 'button',
  compact: false
})
</script>

<template>
  <UiButton
    v-bind="$attrs"
    :disabled="disabled"
    :href="href"
    :size="compact ? 'sm' : 'md'"
    :to="to"
    :type="type"
    variant="primary"
  >
    <slot />
  </UiButton>
</template>
