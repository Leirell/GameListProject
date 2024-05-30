<template>
  <div :style="[
    `background-image:linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url('${artworkUrl}')`
  ]" class="bg-no-repeat bg-cover">
    <div class="flex flex-wrap w-2/3 m-auto">
      <div class="flex flex-col">
        <div class="text-wrap text-4xl font-semibold text-white m-3">
          {{ game.name }}
        </div>
      </div>
    </div>
    <div class="flex flex-wrap w-2/3 m-auto">
      <div class="flex flex-col">
        <div>
          <GameImageComponent :cover="game.cover" class="m-4" />
        </div>
        <div class="m-4 mb-0">
          <button @click="saveGame" type="submit"
            class="w-full p-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Add to list
          </button>
        </div>
      </div>

      <div class="flex flex-col w-[410px] m-4">
        <swiper :style="{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff'
        }" :spaceBetween="10" :navigation="true" :thumbs="{ swiper: thumbsSwiper }" :slidesPerView="auto"
          :modules="modules" class="w-full">
          <swiper-slide v-for="screenshot in screenshotUrl" :key="screenshot"><img
              class="object-fill rounded-md w-full h-60" :src="screenshot" /></swiper-slide>
        </swiper>
        <swiper @swiper="onSwiper2" :autoHeight="true" :slidesPerView="5" :freeMode="true" :watchSlidesProgress="true"
          :modules="modules" class="w-full">
          <swiper-slide v-for="screenshot in screenshotUrl" :key="screenshot"><img class="w-[75px] h-[50px] rounded-md"
              :src="screenshot" /></swiper-slide>
        </swiper>

        <div class="">
          <div class="flex flex-row text-wrap font-semibold text-white m-5 ml-0">
            <div v-if="game.rating > 50" class="ml-0 px-4 py-4 rounded-md text text-4xl bg-green-500">
              {{ game.rating }}
            </div>
            <div v-else class="ml-0 px-5 py-5 rounded-md text text-4xl bg-red-600">
              {{ game.rating }}
            </div>
            <div v-if="game.rating > 50 && game.rating < 70"
              class="ml-0 px-5 py-5 rounded-md text text-4xl bg-orange-500">
              {{ game.rating }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-wrap flex-col w-2/3 m-auto mt-3">
    <div class="flex flex-row text-wrap font-semibold text-white">
      <div>Genres:</div>
      <div class="font-normal ml-1">{{ game.genres }}</div>
    </div>
    <div class="flex flex-row text-wrap font-semibold text-white mt-2">
      <h2>Platforms:</h2>
      <div class="font-normal ml-1">{{ game.platforms }}</div>
    </div>
    <div class="bg-slate-700 p-2 rounded-md font-normal text-white mt-2">
      {{ game.summary }}
    </div>
  </div>
  <div v-if="dlcs.length > 0" class="flex flex-col w-2/3 m-auto mt-4 text-white">
    <div class="underline">More for {{ game.name }}</div>
    <div class="flex flex-col mt-2 bg-slate-700 p-2 rounded-md">
      <swiper :style="{
        '--swiper-navigation-color': '#fff',
        '--swiper-pagination-color': '#fff'
      }" :spaceBetween="10" :navigation="true" :thumbs="{ swiper: thumbsSwiper }" :slidesPerView="auto"
        :modules="modules" class="w-full">
      </swiper>
      <swiper :style="{
        '--swiper-navigation-color': '#fff',
        '--swiper-pagination-color': '#fff'
      }" @swiper="onSwiperDlcs" :spaceBetween="10" :navigation="true" :autoHeight="true" :slidesPerView="5"
        :freeMode="true" :watchSlidesProgress="true" :modules="modules" class="w-full">
        <swiper-slide v-for="dlc in dlcs" :key="dlc"><img class="w-[124px] h-[165px] rounded-md"
            :src="dlc" /></swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GameImageComponent from '@/components/GameImageComponent.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import { authHeader } from '@/stores/helpers.js'

const modules = [FreeMode, Navigation, Thumbs]

const thumbsSwiper = ref(null)
const thumbsSwiperDlcs = ref(null)

const onSwiper2 = (swiper) => {
  thumbsSwiper.value = swiper
}
const onSwiperDlcs = (swiper) => {
  thumbsSwiperDlcs.value = swiper
}

const props = defineProps({
  id: String
})

const game = ref({})
const artworkUrl = ref({})
const screenshotUrl = ref({})
const dlcs = ref({})

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
  dlcs: gameData.dlcs,
  genres: gameData.genres.map((genre) => genre.name).join(', '),
  platforms: gameData.platforms.map((platform) => platform.name).join(', '),
  summary: gameData.summary,
  rating: Math.ceil(gameData.rating),
  id: gameData.id
}

artworkUrl.value = gameData.artworks ? gameData.artworks[0].url.replace('t_thumb', 't_1080p') : ''
screenshotUrl.value = gameData.screenshots
  ? gameData.screenshots.map((screenshot) => screenshot.url.replace('t_thumb', 't_1080p'))
  : []

dlcs.value = gameData.dlcs
  ? gameData.dlcs.map((dlc) => dlc.cover.url.replace('t_thumb', 't_1080p'))
  : []
console.log(screenshotUrl)

dlcs.value = dlcs.value.concat(
  gameData.expansions
    ? gameData.expansions.map((expansion) => expansion.cover.url.replace('t_thumb', 't_1080p'))
    : []
)

const saveGame = async () => {
  const username = sessionStorage.getItem('username')
  if (!username) {
    console.error('No username found in session storage')
    return
  }
  try {
    const saveGameData = {
      id: game.value.id,
      name: game.value.name,
      cover: game.value.cover,
      genres: game.value.genres,
      platforms: game.value.platforms,
      summary: game.value.summary.substring(0, 5000),
      rating: game.value.rating,
      username: username
    }
    console.log(props.id)
    const response = await fetch('/v1/api/userGame/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader() // Agregar el token a los headers
      },
      body: JSON.stringify(saveGameData)
    })
    const data = await response.json()
    if (response.ok) {
      console.log('Game saved successfully:', data)
    } else {
      console.error('Error saving game:', data)
    }
  } catch (error) {
    console.error('Error saving game:', error)
  }
}
</script>
