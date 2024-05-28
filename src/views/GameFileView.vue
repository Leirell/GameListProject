<template>
  <Suspense><GameFileComponent :id="id"></GameFileComponent></Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const GameFileComponent = defineAsyncComponent(() => import('@/components/GameFileComponent.vue'))

defineProps({
  id: String
})
</script>
