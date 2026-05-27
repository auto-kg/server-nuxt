<script setup lang="ts">
const { toasts, removeToast } = useAdminToast()

const toastClass = (type: string) => {
  if (type === 'success') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-950 shadow-emerald-950/10'
  }

  if (type === 'error') {
    return 'border-rose-200 bg-rose-50 text-rose-950 shadow-rose-950/10'
  }

  return 'border-slate-200 bg-white text-slate-950 shadow-slate-950/10'
}

const markerClass = (type: string) => {
  if (type === 'success') {
    return 'bg-emerald-500'
  }

  if (type === 'error') {
    return 'bg-rose-500'
  }

  return 'bg-slate-500'
}
</script>

<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed inset-x-0 top-3 z-[100] mx-auto grid max-w-lg gap-2 px-4">
      <TransitionGroup
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="-translate-y-3 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="-translate-y-3 opacity-0"
      >
        <article
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto rounded-2xl border p-4 shadow-xl"
          :class="toastClass(toast.type)"
          role="alert"
        >
          <div class="flex items-start gap-3">
            <span class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" :class="markerClass(toast.type)" />

            <div class="min-w-0 flex-1">
              <p class="text-sm font-black">{{ toast.title }}</p>
              <p v-if="toast.message" class="mt-1 text-sm font-semibold leading-5 opacity-80">
                {{ toast.message }}
              </p>
            </div>

            <button
              class="focus-ring -mr-1 -mt-1 min-h-8 rounded-xl px-2 text-sm font-black opacity-70 hover:opacity-100"
              type="button"
              @click="removeToast(toast.id)"
            >
              x
            </button>
          </div>
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
