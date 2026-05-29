<script setup lang="ts">
import type { Car } from '~/types/car'

const props = defineProps<{
  cars: Car[]
  currentPage: number
  filteredCount: number
  pageEnd: number
  pageStart: number
  totalPages: number
  viewMode: 'grid' | 'list'
  visiblePages: number[]
}>()

const emit = defineEmits<{
  'update:viewMode': [viewMode: 'grid' | 'list']
  setPage: [page: number]
}>()
</script>

<template>
  <section id="catalog-results" class="lux-glass mt-5 rounded-lg p-4 sm:p-5">
    <SectionHeader
      title="Каталог автомобилей"
      :subtitle="props.filteredCount ? `${props.filteredCount} предложений, показаны ${props.pageStart + 1}-${props.pageEnd}` : 'Нет предложений по выбранным условиям'"
      compact
    >
      <div class="inline-grid grid-cols-2 rounded-md border border-neutral-950/10 bg-white/25 p-1 backdrop-blur">
        <button
          class="focus-ring min-h-9 rounded-sm px-3 text-xs font-semibold uppercase tracking-[0.14em] transition"
          :class="props.viewMode === 'grid' ? 'bg-neutral-950 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-950'"
          type="button"
          @click="emit('update:viewMode', 'grid')"
        >
          Блоки
        </button>

        <button
          class="focus-ring min-h-9 rounded-sm px-3 text-xs font-semibold uppercase tracking-[0.14em] transition"
          :class="props.viewMode === 'list' ? 'bg-neutral-950 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-950'"
          type="button"
          @click="emit('update:viewMode', 'list')"
        >
          Строки
        </button>
      </div>
    </SectionHeader>

    <div v-if="props.cars.length && props.viewMode === 'grid'" class="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <CarCard v-for="car in props.cars" :key="car.id" :car="car" />
    </div>

    <div v-else-if="props.cars.length" class="mt-4 grid gap-3">
      <CarListItem v-for="car in props.cars" :key="car.id" :car="car" />
    </div>

    <div v-else class="mt-5 rounded-lg border border-white/35 bg-white/30 p-6 text-center backdrop-blur">
      <h3 class="text-xl font-semibold text-neutral-950">Ничего не найдено</h3>
      <p class="mt-2 text-sm text-neutral-600">Попробуйте изменить марку, цену, город или тип транспорта.</p>
    </div>

    <nav
      v-if="props.totalPages > 1"
      class="mt-6 grid gap-3 border-t border-white/35 pt-4 sm:flex sm:items-center sm:justify-between"
      aria-label="Пагинация каталога"
    >
      <button
        class="focus-ring min-h-10 rounded-none border border-neutral-950/15 bg-white/25 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-950 backdrop-blur disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="props.currentPage === 1"
        type="button"
        @click="emit('setPage', props.currentPage - 1)"
      >
        Назад
      </button>

      <div class="flex justify-center gap-2 overflow-x-auto">
        <button
          v-for="page in props.visiblePages"
          :key="page"
          class="focus-ring h-10 w-10 shrink-0 rounded-md text-sm font-semibold"
          :class="page === props.currentPage ? 'bg-neutral-950 text-white' : 'border border-neutral-950/15 bg-white/25 text-neutral-950 backdrop-blur'"
          type="button"
          @click="emit('setPage', page)"
        >
          {{ page }}
        </button>
      </div>

      <button
        class="focus-ring min-h-10 rounded-none border border-neutral-950/15 bg-white/25 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-950 backdrop-blur disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="props.currentPage === props.totalPages"
        type="button"
        @click="emit('setPage', props.currentPage + 1)"
      >
        Далее
      </button>
    </nav>
  </section>
</template>
