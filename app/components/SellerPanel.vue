<script setup lang="ts">
import type { Seller } from '~/types/car'

defineProps<{
  seller: Seller
  city: string
}>()
</script>

<template>
  <div>
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-sm font-bold text-emerald-700">{{ seller.type }}</p>
        <h2 class="mt-1 text-xl font-black text-slate-950">{{ seller.name }}</h2>
      </div>
      <span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-black text-slate-800">
        {{ seller.rating }}
      </span>
    </div>

    <div class="mt-5 grid gap-3 text-sm text-slate-600">
      <div class="rounded-2xl bg-slate-50 p-3">
        <p class="font-bold text-slate-950">{{ city }}</p>
      </div>
      <div class="rounded-2xl bg-slate-50 p-3">
        <p class="text-xs font-bold uppercase tracking-wide text-slate-500">Телефон</p>
        <p class="mt-1 text-base font-black text-slate-950">{{ seller.phone }}</p>
      </div>
    </div>
  </div>
</template>
