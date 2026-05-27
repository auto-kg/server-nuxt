<script setup lang="ts">
import type { Car, CarSearchFilters } from '~/types/car'

const props = defineProps<{
  cars: Car[]
}>()

const emit = defineEmits<{
  search: [filters: CarSearchFilters]
}>()

const filters = reactive<CarSearchFilters>({
  brand: '',
  model: '',
  description: '',
  maxPrice: '',
  yearFrom: '',
  maxMileage: '',
  fuel: '',
  city: ''
})

const brands = computed(() => [...new Set(props.cars.map((car) => car.brand))].sort())
const fuels = computed(() => [...new Set(props.cars.map((car) => car.fuel))].sort())
const cities = computed(() => [...new Set(props.cars.map((car) => car.city))].sort())

const submit = () => {
  emit('search', { ...filters })
}
</script>

<template>
  <form class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft" @submit.prevent="submit">
    <div class="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2.5 sm:px-5">
      <span class="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-xs font-black text-emerald-800">AUTO</span>
      <div>
        <p class="text-sm font-black text-slate-950">Поиск автомобиля</p>
        <p class="text-xs font-semibold text-slate-500">Фильтры и поиск по описанию</p>
      </div>
    </div>

    <div class="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4 lg:p-5">
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
        class="focus-ring mt-auto min-h-11 rounded-2xl bg-emerald-600 px-5 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 lg:col-span-1"
        type="submit"
      >
        Найти авто
      </button>
    </div>
  </form>
</template>
