<script setup lang="ts">
import type { Car } from '~/types/car'
import { formatPrice } from '~/utils/format'

defineProps<{
  car: Car
  contactUrl: string
  show: boolean
}>()
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-2.5 shadow-[0_-16px_40px_rgba(15,23,42,0.14)] backdrop-blur lg:hidden"
    >
      <div class="mx-auto flex max-w-lg items-center gap-2">
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-bold leading-tight text-slate-950">{{ car.title }}</p>
          <p class="text-sm leading-tight text-slate-500">{{ formatPrice(car.price) }}</p>
        </div>
        <BlackButton
          class="shrink-0"
          compact
          :href="contactUrl"
          rel="noopener noreferrer"
          target="_blank"
        >
          Связаться
        </BlackButton>
      </div>
    </div>
  </Transition>
</template>
