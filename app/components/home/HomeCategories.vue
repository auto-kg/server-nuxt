<script setup lang="ts">
import type { HomeCategory } from '~/types/car'

const props = defineProps<{
  categories: HomeCategory[]
}>()

const emit = defineEmits<{
  open: [category: HomeCategory]
}>()
</script>

<template>
  <section class="content-page py-4 sm:py-6">
    <div class="lux-glass rounded-lg p-4 sm:p-5">
      <SectionHeader title="Популярные категории" subtitle="Быстрые подборки для разных сценариев покупки." compact />

      <HorizontalScroller v-if="props.categories.length" class="mt-4">
        <article
          v-for="category in props.categories"
          :key="category.title"
          class="group w-36 shrink-0 snap-start overflow-hidden rounded-xl border border-white/35 bg-white/30 backdrop-blur sm:w-40"
        >
          <button class="block h-full w-full text-left" type="button" @click="emit('open', category)">
            <div class="aspect-square overflow-hidden bg-neutral-200">
              <img :src="category.image" :alt="category.title" class="h-full w-full object-cover transition duration-500 group-hover:scale-105">
            </div>
            <div class="px-3 py-2">
              <h3 class="text-sm font-semibold leading-tight text-neutral-950">{{ category.title }}</h3>
            </div>
          </button>
        </article>
      </HorizontalScroller>

      <div v-else class="mt-4 rounded-lg border border-dashed border-neutral-950/15 bg-white/25 p-5 text-center text-sm font-semibold text-neutral-500">
        Категории пока не добавлены
      </div>
    </div>
  </section>
</template>
