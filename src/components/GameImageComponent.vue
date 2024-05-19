<template>
  <div>
    <img class="w-[215px] h-[322px] rounded-md" :src="cover" />
  </div>
</template>

<script setup>
defineProps({
  cover: String
})
</script>
