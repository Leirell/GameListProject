<template>
  <div class="flex flex-row justify-center flex-wrap w-2/3 m-auto">
    <div class="text-center text-wrap max-w-[175px] text-md font-semibold text-zinc-300">
      {{ game.name }}
    </div>
    <GameImageComponent :cover="game.cover" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GameImageComponent from '@/components/GameImageComponent.vue'

const props = defineProps({
  id: String
})

const game = ref({})

const gameRequest = await fetch(`/v1/api/game/searchById/${props.id}`, {
  method: 'POST'
})
const gameList = await gameRequest.json()
const gameData = gameList.response[0]

let url = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png'
if (gameData.cover != null) {
  url = gameData.cover.url.replace('t_thumb', 't_cover_big')
}
console.log(gameData.name, gameData.cover, props.id)
game.value = {
  name: gameData.name,
  cover: url,
  id: gameData.id
}
</script>
