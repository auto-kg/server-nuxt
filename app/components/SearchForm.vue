<script setup lang="ts">
import type { Car, CarSearchFilters } from '~/types/car'

const props = defineProps<{
  cars: Car[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  search: [filters: CarSearchFilters]
  reset: []
}>()

const filters = reactive<CarSearchFilters>({
  query: '',
  brand: '',
  model: '',
  description: '',
  maxPrice: '',
  yearFrom: '',
  maxMileage: '',
  fuel: '',
  city: ''
})
const isOpen = ref(true)

const brands = computed(() => [...new Set(props.cars.map((car) => car.brand))].sort())
const fuels = computed(() => [...new Set(props.cars.map((car) => car.fuel))].sort())
const cities = computed(() => [...new Set(props.cars.map((car) => car.city))].sort())
const hasActiveFilters = computed(() =>
  Object.values(filters).some((value) => String(value).trim())
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
  <form class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft" @submit.prevent="submit">
    <div class="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
      <div class="flex min-w-0 items-center gap-3">
        <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-xs font-black text-emerald-800">AUTO</span>
        <div class="min-w-0">
          <p class="truncate text-sm font-black text-slate-950">Поиск и фильтры</p>
          <p class="text-xs font-semibold text-slate-500">{{ hasActiveFilters ? 'Фильтры применены' : 'Марка, модель, цена, город' }}</p>
        </div>
      </div>

      <button
        class="focus-ring min-h-10 shrink-0 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-950"
        type="button"
        :aria-expanded="isOpen"
        @click="isOpen = !isOpen"
      >
        {{ isOpen ? 'Скрыть' : 'Открыть' }}
      </button>
    </div>

    <div v-show="isOpen" class="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4 lg:p-5">
      <label class="grid gap-1.5 text-xs font-bold text-slate-800 sm:col-span-2 lg:col-span-2">
        Поиск авто
        <input
          v-model.trim="filters.query"
          class="focus-ring min-h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 placeholder:text-slate-400"
          placeholder="Camry, Бишкек, дилер, кожа"
          type="search"
        >
      </label>

      <label class="grid gap-1.5 text-xs font-bold text-slate-800">
        Марка
        <select v-model="filters.brand" class="focus-ring min-h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950">
          <option value="">Любая</option>
          <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
        </select>
      </label>

      <label class="grid gap-1.5 text-xs font-bold text-slate-800">
        Модель
        <input
          v-model.trim="filters.model"
          class="focus-ring min-h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 placeholder:text-slate-400"
          placeholder="Например, Golf"
          type="text"
        >
      </label>

      <label class="grid gap-1.5 text-xs font-bold text-slate-800">
        По описанию
        <input
          v-model.trim="filters.description"
          class="focus-ring min-h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 placeholder:text-slate-400"
          placeholder="Без ДТП, кожа, 4WD"
          type="text"
        >
      </label>

      <label class="grid gap-1.5 text-xs font-bold text-slate-800">
        Цена до
        <input
          v-model="filters.maxPrice"
          class="focus-ring min-h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 placeholder:text-slate-400"
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
          class="focus-ring min-h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 placeholder:text-slate-400"
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
          class="focus-ring min-h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 placeholder:text-slate-400"
          inputmode="numeric"
          min="0"
          placeholder="80000"
          type="number"
        >
      </label>

      <label class="grid gap-1.5 text-xs font-bold text-slate-800">
        Тип топлива
        <select v-model="filters.fuel" class="focus-ring min-h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950">
          <option value="">Любой</option>
          <option v-for="fuel in fuels" :key="fuel" :value="fuel">{{ fuel }}</option>
        </select>
      </label>

      <label class="grid gap-1.5 text-xs font-bold text-slate-800">
        Город
        <select v-model="filters.city" class="focus-ring min-h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950">
          <option value="">Любой</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
      </label>

      <button
        class="focus-ring mt-auto min-h-11 rounded-2xl bg-emerald-600 px-5 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 lg:col-span-1"
        :disabled="props.isLoading"
        type="submit"
      >
        {{ props.isLoading ? 'Ищем...' : 'Найти авто' }}
      </button>

      <button
        class="focus-ring mt-auto min-h-11 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-950 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="props.isLoading || !hasActiveFilters"
        type="button"
        @click="reset"
      >
        Сбросить
      </button>
    </div>
  </form>
</template>
