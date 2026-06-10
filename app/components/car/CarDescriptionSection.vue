<script setup lang="ts">
defineProps<{
  description: string
}>()
</script>

<template>
  <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
    <h2 class="text-xl font-bold tracking-tight text-slate-950">Описание</h2>
    <p class="mt-3 text-sm leading-8 text-slate-600">{{ description }}</p>
  </section>
</template>
