<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <select
    v-model="model"
    v-bind="$attrs"
    class="focus-ring min-h-11 w-full rounded-md border border-neutral-950/10 bg-white/45 px-3 text-sm font-medium normal-case tracking-normal text-neutral-950 backdrop-blur"
  >
    <slot />
  </select>
</template>
