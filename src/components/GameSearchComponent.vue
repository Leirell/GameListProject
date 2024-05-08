<template>
  <div class="p-4">
    <div>
      <img class="w-[170px] h-[226px] rounded-md" :src="cover" />
    </div>
    <div class="text-center text-wrap max-w-[175px] text-md font-semibold text-zinc-300">
      {{ name }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  cover: String
})
</script>
