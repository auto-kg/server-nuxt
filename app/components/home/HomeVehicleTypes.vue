<script setup lang="ts">
import type { VehicleType } from '~/types/car'

type VehicleTypeCard = VehicleType & {
  count: number
}

const props = defineProps<{
  vehicleTypes: VehicleTypeCard[]
}>()

const emit = defineEmits<{
  open: [vehicleType: string]
}>()
</script>

<template>
  <section class="content-page py-3 sm:py-4">
    <div class="lux-glass rounded-lg p-4 sm:p-5">
      <SectionHeader
        title="Тип транспортных средств"
        subtitle="Быстрый старт по кузову и назначению автомобиля."
        compact
      />

      <div v-if="props.vehicleTypes.length" class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <button
          v-for="type in props.vehicleTypes"
          :key="type.value"
          class="focus-ring overflow-hidden rounded-lg border border-white/35 bg-white/30 text-left backdrop-blur transition hover:border-white/70 hover:bg-white/45"
          type="button"
          @click="emit('open', type.value)"
        >
          <span class="flex aspect-[16/9] items-center justify-center bg-white/25">
            <img v-if="type.image" :src="type.image" :alt="type.title" class="h-full w-full object-contain">
            <span v-else class="text-sm font-semibold text-neutral-500">{{ type.title }}</span>
          </span>
          <span class="block p-3">
            <span class="block text-base font-semibold text-neutral-950">{{ type.title }}</span>
            <span v-if="type.description" class="mt-1 line-clamp-2 block text-sm font-medium leading-6 text-neutral-500">{{ type.description }}</span>
            <span class="mt-1 block text-sm font-medium text-neutral-500">{{ type.count }} авто</span>
          </span>
        </button>
      </div>

      <div v-else class="mt-4 rounded-lg border border-dashed border-neutral-950/15 bg-white/25 p-5 text-center text-sm font-semibold text-neutral-500">
        Типы появятся после добавления объявлений.
      </div>
    </div>
  </section>
</template>
