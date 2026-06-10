<script setup lang="ts">
import type { Car } from '~/types/car'

defineProps<{
  cars: Car[]
}>()
</script>

<template>
  <section class="py-8 sm:py-10">
    <SectionHeader title="Похожие автомобили" subtitle="Близкие варианты по цене, марке или типу топлива." />
    <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <CarCard v-for="car in cars" :key="car.id" :car="car" />
    </div>
  </section>
</template>
