<script setup lang="ts">
const scroller = ref<HTMLElement | null>(null)
const canScroll = ref(false)

const updateScrollState = () => {
  const element = scroller.value
  canScroll.value = Boolean(element && element.scrollWidth > element.clientWidth + 4)
}

const scrollByPage = (direction: 'prev' | 'next') => {
  const element = scroller.value

  if (!element) {
    return
  }

  const distance = element.clientWidth * 0.85
  element.scrollBy({
    left: direction === 'next' ? distance : -distance,
    behavior: 'smooth'
  })
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('resize', updateScrollState)
})

onUpdated(updateScrollState)

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScrollState)
})
</script>

<template>
  <div class="relative">
    <div
      ref="scroller"
      class="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      @scroll="updateScrollState"
    >
      <slot />
    </div>

    <div v-if="canScroll" class="pointer-events-none absolute inset-y-0 left-0 hidden w-7 bg-gradient-to-r from-white/70 to-transparent lg:block" />
    <div v-if="canScroll" class="pointer-events-none absolute inset-y-0 right-0 hidden w-7 bg-gradient-to-l from-white/70 to-transparent lg:block" />

    <button
      v-if="canScroll"
      class="focus-ring absolute -left-5 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl font-black text-slate-900 shadow-soft transition hover:bg-slate-50 lg:flex"
      type="button"
      aria-label="Показать предыдущие"
      @click="scrollByPage('prev')"
    >
      ‹
    </button>
    <button
      v-if="canScroll"
      class="focus-ring absolute -right-5 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl font-black text-slate-900 shadow-soft transition hover:bg-slate-50 lg:flex"
      type="button"
      aria-label="Показать следующие"
      @click="scrollByPage('next')"
    >
      ›
    </button>
  </div>
</template>
