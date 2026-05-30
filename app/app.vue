<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-950 antialiased">
    <NuxtRouteAnnouncer />
    <NuxtPage v-if="route.path.startsWith('/admin')" />
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
