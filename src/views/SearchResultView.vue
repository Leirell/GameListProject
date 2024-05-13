<template>
  <div class="flex flex-row justify-center flex-wrap w-2/3 m-auto">
    <div v-for="e in gamesList" :key="e.name">
      <GameSearchComponent :name="e.name" :cover="e.cover" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import GameSearchComponent from '@/components/GameSearchComponent.vue'

const route = useRoute()

//esta variable es reactiva con el ref de vue para que asi cambie al instante de obtener datos en la linea 15
const gamesList = ref([])
let ready = true

console.log('view', route.params.text)

//para peticiones api siempre asyncrono
const callback = async () => {
  const gameRequest = await fetch(`/v1/api/game/search/${route.params.text}`, { method: 'POST' })
  const gameData = await gameRequest.json()
  gamesList.value = []

  console.log(ready)
  if (!ready) return
  ready = false

  await Promise.all(
    //con el .map iteramos por el json de gameData para poder hacer la peticion de covers en paralelo
    gameData.response.map(async (game) => {
      let url = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png'
      if (game.cover != null) {
        const coverRequest = await fetch(`/v1/api/game/cover/${game.cover}`, { method: 'POST' })
        const coverData = await coverRequest.json()
        url = coverData.response[0].url.replace('t_thumb', 't_cover_big')
      }

      gamesList.value.push({
        name: game.name,
        cover: url
      })
    })
  )
  ready = true
}

watch(() => route.query.time, callback)
onMounted(async () => {
  await callback()
})
</script>
