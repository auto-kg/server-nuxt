<script setup lang="ts">
const props = defineProps<{
  brands: Array<{
    brand: string
    count: number
  }>
}>()

const emit = defineEmits<{
  open: [brand: string]
}>()
</script>

<template>
  <section class="content-page py-3 sm:py-4">
    <div class="lux-glass rounded-lg p-4 sm:p-5">
      <SectionHeader title="Популярные марки" subtitle="Быстрый вход в самые востребованные объявления каталога." compact />

      <div v-if="props.brands.length" class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-8">
        <button
          v-for="item in props.brands"
          :key="item.brand"
          class="focus-ring min-h-20 rounded-lg border border-white/35 bg-white/30 p-3 text-left backdrop-blur transition hover:border-white/70 hover:bg-white/45"
          type="button"
          @click="emit('open', item.brand)"
        >
          <span class="block text-lg font-semibold text-neutral-950">{{ item.brand }}</span>
          <span class="mt-1 block text-sm font-medium text-neutral-500">{{ item.count }} авто</span>
        </button>
      </div>

      <div v-else class="mt-4 rounded-lg border border-dashed border-neutral-950/15 bg-white/25 p-5 text-center text-sm font-semibold text-neutral-500">
        Марки появятся после добавления авто
      </div>
    </div>
  </section>
</template>
