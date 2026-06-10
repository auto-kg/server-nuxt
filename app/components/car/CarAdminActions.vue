<script setup lang="ts">
defineProps<{
  carId: string
}>()

const emit = defineEmits<{
  back: []
}>()
</script>

<template>
  <section class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 shadow-sm">
    <div class="grid grid-cols-2 gap-2">
      <BlackButton type="button" @click="emit('back')">В админку</BlackButton>
      <BlackButton :to="`/admin/cars/${carId}/edit`">Редактировать</BlackButton>
    </div>
  </section>
</template>
