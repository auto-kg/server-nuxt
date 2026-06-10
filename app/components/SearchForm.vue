<script setup lang="ts">
import type { Car, CarSearchFilters, VehicleType } from '~/types/car'
import { vehicleTypes as fallbackVehicleTypes } from '~/utils/vehicleType'

const props = defineProps<{
  cars: Car[]
  isLoading?: boolean
  resultCount?: number
  initialFilters?: Partial<CarSearchFilters>
  submitLabel?: string
  compact?: boolean
  vehicleTypes?: VehicleType[]
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
const availableVehicleTypes = computed(() =>
  props.vehicleTypes?.length
    ? props.vehicleTypes
    : fallbackVehicleTypes.map((type, index) => ({
        id: type.value,
        value: type.value,
        title: type.title,
        description: type.description,
        image: type.image,
        sortOrder: (index + 1) * 10,
        isActive: true
      }))
)
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
  <form class="lux-glass overflow-hidden rounded-lg" @submit.prevent="submit">
    <div class="flex items-center justify-between gap-3 border-b border-white/35 bg-white/20 px-3 py-3 sm:px-4">
      <div class="flex min-w-0 items-center gap-3">
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-neutral-950/10 bg-neutral-950">
          <img
            src="https://img.icons8.com/?size=100&id=132&format=png&color=FFFFFF"
            alt="Описание картинки"
            class="h-full w-full object-contain p-1"
          />
        </span>
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold uppercase tracking-[0.18em] text-neutral-950">Поиск и фильтры</p>
          <p class="text-xs font-medium text-neutral-500">
            {{ props.resultCount === undefined ? (hasActiveFilters ? 'Фильтры применены' : 'Марка, модель, цена, город') : `${props.resultCount} авто подходит` }}
          </p>
        </div>
      </div>

      <button
        class="focus-ring min-h-9 shrink-0 rounded-md border border-neutral-950/10 bg-white/35 px-3 text-xs font-semibold text-neutral-950 backdrop-blur transition hover:bg-white/55"
        type="button"
        :aria-expanded="isOpen"
        @click="isOpen = !isOpen"
      >
        {{ isOpen ? 'Скрыть' : 'Открыть' }}
      </button>
    </div>

    <div v-show="isOpen" class="grid gap-3 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-4">
      <UiField class="sm:col-span-2 lg:col-span-2" label="Поиск авто">
        <UiInput
          v-model.trim="filters.query"
          placeholder="Camry, Бишкек, дилер, кожа"
          type="search"
        />
      </UiField>

      <UiField label="Тип транспорта">
        <UiSelect v-model="filters.vehicleType">
          <option value="">Любой</option>
          <option v-for="type in availableVehicleTypes" :key="type.value" :value="type.value">{{ type.title }}</option>
        </UiSelect>
      </UiField>

      <UiField label="Марка">
        <UiSelect v-model="filters.brand">
          <option value="">Любая</option>
          <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
        </UiSelect>
      </UiField>

      <UiField label="Модель">
        <UiInput
          v-model.trim="filters.model"
          placeholder="Например, Golf"
          type="text"
        />
      </UiField>

      <UiField label="По описанию">
        <UiInput
          v-model.trim="filters.description"
          placeholder="Без ДТП, кожа, 4WD"
          type="text"
        />
      </UiField>

      <UiField label="Цена до">
        <UiInput
          v-model="filters.maxPrice"
          inputmode="numeric"
          min="0"
          placeholder="30000"
          type="number"
        />
      </UiField>

      <UiField label="Год от">
        <UiInput
          v-model="filters.yearFrom"
          inputmode="numeric"
          min="1990"
          placeholder="2020"
          type="number"
        />
      </UiField>

      <UiField label="Пробег до">
        <UiInput
          v-model="filters.maxMileage"
          inputmode="numeric"
          min="0"
          placeholder="80000"
          type="number"
        />
      </UiField>

      <UiField label="Тип топлива">
        <UiSelect v-model="filters.fuel">
          <option value="">Любой</option>
          <option v-for="fuel in fuels" :key="fuel" :value="fuel">{{ fuel }}</option>
        </UiSelect>
      </UiField>

      <UiField label="Город">
        <UiSelect v-model="filters.city">
          <option value="">Любой</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </UiSelect>
      </UiField>

      <UiButton
        class="w-full mt-auto lg:col-span-1"
        :disabled="props.isLoading"
        type="submit"
        variant="primary"
      >
        {{ props.isLoading ? 'Ищем...' : (props.submitLabel ?? 'Найти авто') }}
      </UiButton>

      <UiButton
        class="mt-auto w-full"
        :disabled="props.isLoading || !hasActiveFilters"
        type="button"
        variant="outline"
        @click="reset"
      >
        Сбросить
      </UiButton>
    </div>
  </form>
</template>
