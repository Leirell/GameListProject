<template>
  <RouterLink
    :to="{
      name: 'gameFile',
      params: {
        id: id
      }
    }"
  >
    <div class="p-4">
      <div>
        <img class="w-[170px] h-[226px] rounded-md" :src="cover" />
      </div>
      <div class="text-center text-wrap max-w-[175px] text-md font-semibold text-zinc-300">
        {{ name }}
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
const props = defineProps({
  name: String,
  cover: String,
  id: Number
})
console.log(props.id)
</script>
