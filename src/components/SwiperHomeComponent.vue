<template>
  <swiper
    :style="{
      '--swiper-navigation-color': '#fff',
      '--swiper-pagination-color': '#fff'
    }"
    @swiper="onSwiperDlcs"
    :spaceBetween="10"
    :navigation="true"
    :autoHeight="true"
    :slidesPerView="5"
    :freeMode="true"
    :watchSlidesProgress="true"
    :modules="modules"
    :autoplay="{ delay: 2000 }"
    class="w-full"
  >
    <swiper-slide v-for="e in gameList" :key="e.id"
      ><GameSearchComponent :name="e.name" :cover="e.cover" :id="e.id" />
    </swiper-slide>
  </swiper>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import GameSearchComponent from '@/components/GameSearchComponent.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Navigation, Autoplay, Thumbs } from 'swiper/modules'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
// define your modules list here
const modules = [FreeMode, Navigation, Thumbs, Autoplay]

const thumbsSwiperDlcs = ref(null)

const onSwiperDlcs = (swiper) => {
  thumbsSwiperDlcs.value = swiper
}

const props = defineProps({
  request: String
})

//esta variable es reactiva con el ref de vue para que asi cambie al instante de obtener datos en la linea 15
const gameList = ref([])
let ready = true

const callback = async () => {
  const gameRequest = await fetch(`/v1/api/game/${props.request}`, { method: 'POST' })
  const gameData = await gameRequest.json()
  gameList.value = []

  if (!ready) return
  ready = false

  gameData.response.forEach((game) => {
    let url = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png'
    if (game.cover != null) {
      url = game.cover.url.replace('t_thumb', 't_cover_big')
    }

    gameList.value.push({
      name: game.name,
      cover: url,
      id: game.id
    })
    console.log(game)
  })
  ready = true
}

onMounted(async () => {
  await callback()
})
</script>
