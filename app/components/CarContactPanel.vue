<script setup lang="ts">
import type { Seller } from '~/types/car'

defineProps<{
  seller: Seller
  city: string
  compact?: boolean
  contactUrl?: string
}>()
</script>

<template>
  <aside class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
    <template v-if="compact">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="text-xs font-bold uppercase tracking-wide text-emerald-700">{{ seller.type }}</p>
          <h2 class="mt-1 truncate text-lg font-black text-slate-950">{{ seller.name }}</h2>
          <p class="mt-1 text-sm font-semibold text-slate-500">{{ city }}</p>
        </div>
        <span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-black text-slate-800">
          {{ seller.rating }}
        </span>
      </div>

      <div class="mt-4 rounded-2xl bg-slate-50 p-3">
        <p class="text-xs font-bold uppercase tracking-wide text-slate-500">Телефон</p>
        <p class="mt-1 text-base font-black text-slate-950">{{ seller.phone }}</p>
      </div>
    </template>

    <SellerPanel v-else :seller="seller" :city="city" />

    <div v-if="compact" class="mt-4 grid gap-3 border-t border-slate-100 pt-4">
      <a
        v-if="contactUrl"
        class="focus-ring inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-center text-base font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
        :href="contactUrl"
        rel="noopener noreferrer"
        target="_blank"
      >
        Связаться с продавцом
      </a>
    </div>

    <div v-else class="mt-5 grid gap-3 border-t border-slate-100 pt-5">
      <a
        v-if="contactUrl"
        class="focus-ring inline-flex min-h-12 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-center text-base font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
        :href="contactUrl"
        rel="noopener noreferrer"
        target="_blank"
      >
        Связаться с продавцом
      </a>
    </div>
  </aside>
</template>
