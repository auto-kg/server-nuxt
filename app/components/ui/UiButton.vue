<script setup lang="ts">
const props = withDefaults(defineProps<{
  to?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  size?: 'sm' | 'md'
  variant?: 'primary' | 'outline' | 'ghost'
}>(), {
  type: 'button',
  size: 'md',
  variant: 'primary'
})

const classes = computed(() => [
  'focus-ring inline-flex items-center justify-center gap-2 rounded-[3px] text-center text-xs font-semibold uppercase tracking-[0.18em] transition disabled:cursor-not-allowed disabled:opacity-60',
  props.size === 'sm' ? 'min-h-10 px-3' : 'min-h-11 px-5',
  props.variant === 'primary' && 'bg-neutral-950 text-white hover:bg-neutral-800',
  props.variant === 'outline' && 'border border-neutral-950/15 bg-white/25 text-neutral-950 backdrop-blur hover:bg-white/45',
  props.variant === 'ghost' && 'text-neutral-800 hover:bg-white/35'
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
