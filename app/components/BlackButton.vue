<script setup lang="ts">
const props = withDefaults(defineProps<{
  to?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  compact?: boolean
}>(), {
  type: 'button',
  compact: false
})

const classes = computed(() => [
  'focus-ring inline-flex items-center justify-center gap-2 rounded-[3px] bg-neutral-950 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60',
  props.compact ? 'min-h-10 px-3' : 'min-h-11 px-5'
])
</script>

<template>
  <NuxtLink v-if="to" v-bind="$attrs" :to="to" :class="classes">
    <slot />
  </NuxtLink>

  <a v-else-if="href" v-bind="$attrs" :href="href" :class="classes">
    <slot />
  </a>

  <button v-else v-bind="$attrs" :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
