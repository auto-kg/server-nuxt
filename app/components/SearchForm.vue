<script setup lang="ts">
import type { Car, CarSearchFilters } from '~/types/car'
import { vehicleTypes } from '~/utils/vehicleType'

const props = defineProps<{
  cars: Car[]
  isLoading?: boolean
  resultCount?: number
  initialFilters?: Partial<CarSearchFilters>
  submitLabel?: string
  compact?: boolean
}>()

const emit = defineEmits<{
  search: [filters: CarSearchFilters]
  change: [filters: CarSearchFilters]
  reset: []
}>()

const filters = reactive<CarSearchFilters>(createDefaultCarSearchFilters())
const isOpen = ref(true)
const isSyncingInitialFilters = ref(false)

const filterKeys = Object.keys(createDefaultCarSearchFilters()) as Array<keyof CarSearchFilters>
const normalizeFilters = (value?: Partial<CarSearchFilters>): CarSearchFilters => ({
  ...createDefaultCarSearchFilters(),
  ...value
})
const areFiltersEqual = (first: CarSearchFilters, second: CarSearchFilters) =>
  filterKeys.every((key) => first[key] === second[key])

const brands = computed(() => [...new Set(props.cars.map((car) => car.brand))].sort())
const fuels = computed(() => [...new Set(props.cars.map((car) => car.fuel))].sort())
const cities = computed(() => [...new Set(props.cars.map((car) => car.city))].sort())
const hasActiveFilters = computed(() =>
  Object.values(filters).some((value) => String(value).trim())
)

watch(
  () => props.initialFilters,
  (value) => {
    if (value) {
      const nextFilters = normalizeFilters(value)

      if (areFiltersEqual(filters, nextFilters)) {
        return
      }

      isSyncingInitialFilters.value = true
      Object.assign(filters, nextFilters)
      nextTick(() => {
        isSyncingInitialFilters.value = false
      })
    }
  },
  { immediate: true }
)

watch(
  filters,
  () => {
    if (isSyncingInitialFilters.value) {
      return
    }

    emit('change', { ...filters })
  },
  { deep: true }
)

const submit = () => {
  emit('search', { ...filters })
}

const reset = () => {
  Object.assign(filters, createDefaultCarSearchFilters())
  emit('reset')
}
</script>

<template>
  <form class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft" @submit.prevent="submit">
    <div class="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-3 py-2.5 sm:px-4">
      <div class="flex min-w-0 items-center gap-3">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-[11px] font-bold text-emerald-800">AUTO</span>
        <div class="min-w-0">
          <p class="truncate text-sm font-bold text-slate-950">Поиск и фильтры</p>
          <p class="text-xs font-semibold text-slate-500">
            {{ props.resultCount === undefined ? (hasActiveFilters ? 'Фильтры применены' : 'Марка, модель, цена, город') : `${props.resultCount} авто подходит` }}
          </p>
        </div>
      </div>

      <button
        class="focus-ring min-h-9 shrink-0 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-950"
        type="button"
        :aria-expanded="isOpen"
        @click="isOpen = !isOpen"
      >
        {{ isOpen ? 'Скрыть' : 'Открыть' }}
      </button>
    </div>

    <div v-show="isOpen" class="grid gap-3 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-4">
      <label class="grid gap-1.5 text-xs font-bold text-slate-800 sm:col-span-2 lg:col-span-2">
        Поиск авто
        <input
          v-model.trim="filters.query"
          class="focus-ring min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 placeholder:text-slate-400"
          placeholder="Camry, Бишкек, дилер, кожа"
          type="search"
        >
      </label>

      <label class="grid gap-1.5 text-xs font-bold text-slate-800">
        Тип транспорта
        <select v-model="filters.vehicleType" class="focus-ring min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950">
          <option value="">Любой</option>
          <option v-for="type in vehicleTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
        </select>
      </label>

      <label class="grid gap-1.5 text-xs font-bold text-slate-800">
        Марка
        <select v-model="filters.brand" class="focus-ring min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950">
          <option value="">Любая</option>
          <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
        </select>
      </label>

      <label class="grid gap-1.5 text-xs font-bold text-slate-800">
        Модель
        <input
          v-model.trim="filters.model"
          class="focus-ring min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 placeholder:text-slate-400"
          placeholder="Например, Golf"
          type="text"
        >
      </label>

      <label class="grid gap-1.5 text-xs font-bold text-slate-800">
        По описанию
        <input
          v-model.trim="filters.description"
          class="focus-ring min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 placeholder:text-slate-400"
          placeholder="Без ДТП, кожа, 4WD"
          type="text"
        >
      </label>

      <label class="grid gap-1.5 text-xs font-bold text-slate-800">
        Цена до
        <input
          v-model="filters.maxPrice"
          class="focus-ring min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 placeholder:text-slate-400"
          inputmode="numeric"
          min="0"
          placeholder="30000"
          type="number"
        >
      </label>

      <label class="grid gap-1.5 text-xs font-bold text-slate-800">
        Год от
        <input
          v-model="filters.yearFrom"
          class="focus-ring min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 placeholder:text-slate-400"
          inputmode="numeric"
          min="1990"
          placeholder="2020"
          type="number"
        >
      </label>

      <label class="grid gap-1.5 text-xs font-bold text-slate-800">
        Пробег до
        <input
          v-model="filters.maxMileage"
          class="focus-ring min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950 placeholder:text-slate-400"
          inputmode="numeric"
          min="0"
          placeholder="80000"
          type="number"
        >
      </label>

      <label class="grid gap-1.5 text-xs font-bold text-slate-800">
        Тип топлива
        <select v-model="filters.fuel" class="focus-ring min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950">
          <option value="">Любой</option>
          <option v-for="fuel in fuels" :key="fuel" :value="fuel">{{ fuel }}</option>
        </select>
      </label>

      <label class="grid gap-1.5 text-xs font-bold text-slate-800">
        Город
        <select v-model="filters.city" class="focus-ring min-h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-950">
          <option value="">Любой</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
      </label>

      <button
        class="focus-ring mt-auto min-h-10 rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 lg:col-span-1"
        :disabled="props.isLoading"
        type="submit"
      >
        {{ props.isLoading ? 'Ищем...' : (props.submitLabel ?? 'Найти авто') }}
      </button>

      <button
        class="focus-ring mt-auto min-h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-950 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="props.isLoading || !hasActiveFilters"
        type="button"
        @click="reset"
      >
        Сбросить
      </button>
    </div>
  </form>
</template>
