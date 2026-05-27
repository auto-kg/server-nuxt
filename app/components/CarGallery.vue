<script setup lang="ts">
const props = defineProps<{
  images: string[]
  title: string
}>()

const activeIndex = ref(0)
const activeImage = computed(() => props.images[activeIndex.value] ?? props.images[0])
</script>

<template>
  <section class="space-y-3">
    <div class="aspect-[4/3] overflow-hidden rounded-lg bg-slate-200 shadow-soft md:aspect-[16/10]">
      <img :src="activeImage" :alt="title" class="h-full w-full object-cover">
    </div>

    <div class="grid grid-cols-3 gap-3">
      <button
        v-for="(imageUrl, index) in images"
        :key="imageUrl"
        class="focus-ring aspect-[4/3] overflow-hidden rounded-lg border bg-slate-200 transition"
        :class="index === activeIndex ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-transparent opacity-80 hover:opacity-100'"
        type="button"
        @click="activeIndex = index"
      >
        <img :src="imageUrl" :alt="`${title}, фото ${index + 1}`" class="h-full w-full object-cover">
      </button>
    </div>
  </section>
</template>
