<script setup lang="ts">
const props = defineProps<{
  advantages: Array<{
    title: string
    text: string
  }>
}>()
</script>

<template>
  <section class="content-page py-4 pb-10 sm:py-6 sm:pb-12">
    <SectionHeader title="Почему выбирают нас" subtitle="Фокус на понятном выборе и быстром сравнении объявлений." />

    <div class="mt-6 grid gap-4 md:grid-cols-3">
      <article
        v-for="advantage in props.advantages"
        :key="advantage.title"
        class="rounded-lg border border-white/35 bg-white/35 p-4 shadow-[0_18px_60px_rgba(17,19,21,0.08)] backdrop-blur-xl"
      >
        <h3 class="text-lg font-semibold text-neutral-950">{{ advantage.title }}</h3>
        <p class="mt-3 leading-7 text-neutral-600">{{ advantage.text }}</p>
      </article>
    </div>
  </section>
</template>
