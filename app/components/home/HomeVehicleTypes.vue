<script setup lang="ts">
import type {VehicleType} from '~/types/car'

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
    <UiPanel>
      <SectionHeader
        title="Тип транспортных средств"
        subtitle="Быстрый старт по кузову и назначению автомобиля."
        compact
      />

      <div v-if="props.vehicleTypes.length" class="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          v-for="type in props.vehicleTypes"
          :key="type.value"
          class="focus-ring flex w-20 shrink-0 flex-col items-center gap-1.5 rounded-xl border border-white/35 bg-white/30 p-2.5 text-center backdrop-blur transition hover:border-white/70 hover:bg-white/45"
          type="button"
          @click="emit('open', type.value)"
        >
          <span class="flex h-10 w-10 items-center justify-center">
            <img v-if="type.image" :src="type.image" :alt="type.title" class="h-full w-full object-contain">
            <span v-else class="text-xs font-semibold text-neutral-500">{{ type.title[0] }}</span>
          </span>
          <span class="text-xs font-semibold leading-tight text-neutral-950">{{ type.title }}</span>
          <span class="text-xs font-medium text-neutral-500">{{ type.count }}</span>
        </button>
      </div>

      <div v-else
           class="mt-4 rounded-lg border border-dashed border-neutral-950/15 bg-white/25 p-5 text-center text-sm font-semibold text-neutral-500">
        Типы появятся после добавления объявлений.
      </div>
    </UiPanel>
  </section>
</template>
