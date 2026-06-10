<script setup lang="ts">
const [model, modifiers] = defineModel<string | number, 'trim'>({
  set(value) {
    if (modifiers.trim && typeof value === 'string') {
      return value.trim()
    }

    return value
  }
})

withDefaults(defineProps<{
  type?: string
}>(), {
  type: 'text'
})
</script>

<template>
  <input
    v-model="model"
    v-bind="$attrs"
    :type="type"
    class="focus-ring min-h-11 w-full rounded-md border border-neutral-950/10 bg-white/45 px-3 text-sm font-medium normal-case tracking-normal text-neutral-950 backdrop-blur placeholder:text-neutral-400"
  >
</template>
