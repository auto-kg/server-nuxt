<script setup lang="ts">
defineProps<{
  specs: Array<{
    label: string
    value: string | number
  }>
}>()
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
    <h2 class="text-xl font-black tracking-tight text-slate-950">Характеристики</h2>
    <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div v-for="spec in specs" :key="spec.label" class="rounded-2xl bg-slate-50 p-3">
        <p class="text-xs font-bold uppercase tracking-wide text-slate-500">{{ spec.label }}</p>
        <p class="mt-1 text-base font-black text-slate-950">{{ spec.value }}</p>
      </div>
    </div>
  </section>
</template>
