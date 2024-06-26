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
          <button @click="handleButtonClick" type="button"
            class="w-full p-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            {{ isGameInList ? 'Remove from list' : 'Add to list' }}
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
            <div v-if="game.rating > 70" class="ml-0 px-4 py-4 rounded-md text text-4xl bg-green-500">
              {{ game.rating }}
            </div>
            <div v-else-if="game.rating > 50" class="ml-0 px-5 py-5 rounded-md text text-4xl bg-orange-500">
              {{ game.rating }}
            </div>
            <div v-else class="ml-0 px-5 py-5 rounded-md text text-4xl bg-red-500">
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
      }" @swiper="onSwiperDlcs" :spaceBetween="10" :navigation="true" :autoHeight="true" :slidesPerView="5"
        :freeMode="true" :watchSlidesProgress="true" :modules="modules" class="w-full">
        <swiper-slide v-for="dlc in dlcs" :key="dlc"><img class="w-[124px] h-[165px] rounded-md"
            :src="dlc" /></swiper-slide>
      </swiper>
    </div>
  </div>

  <transition name="fade">
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 class="text-2xl font-semibold text-white mb-4">Game Details</h2>
        <label for="grade" class="block text-white mb-2">Grade:</label>
        <input v-model="grade" type="number" id="grade" min="0" max="10"
          class="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 text-white" />
        <label for="review" class="block text-white mb-2">Review:</label>
        <textarea v-model="review" id="review" rows="4"
          class="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 text-white"></textarea>
        <label for="date" class="block text-white mb-2">Date Completed:</label>
        <input v-model="dateCompleted" type="date" id="date"
          class="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 text-white" />
        <div class="flex justify-end space-x-4">
          <button @click="toggleForm" type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Cancel
          </button>
          <button @click="saveGame" type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
            Save
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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
const dlcs = ref([])
const isGameInList = ref(false)
const showForm = ref(false)
const grade = ref(0)
const review = ref('')
const dateCompleted = ref(new Date().toISOString().substr(0, 10))

const router = useRouter()
const username = sessionStorage.getItem('username')

if (!username) {
  console.error('No username found in session storage')
} else {
  // Verificar si el juego ya está en la lista del usuario
  const checkGameInList = async () => {
    try {
      const response = await fetch(`/v1/api/userGame/user/games/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        }
      })
      const data = await response.json()
      if (response.ok) {
        isGameInList.value = data.response.some((g) => g.id === game.value.id)
      } else {
        console.error('Error checking game in list:', data)
      }
    } catch (error) {
      console.error('Error checking game in list:', error)
    }
  }

  onMounted(async () => {
    await checkGameInList()
  })
}

const gameRequest = await fetch(`/v1/api/game/searchById/${props.id}`, {
  method: 'POST'
})
const gameList = await gameRequest.json()
const gameData = gameList.response[0]

let url = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png'
if (gameData.cover != null) {
  url = gameData.cover.url.replace('t_thumb', 't_cover_big')
}
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

dlcs.value = dlcs.value.concat(
  gameData.expansions
    ? gameData.expansions.map((expansion) => expansion.cover.url.replace('t_thumb', 't_1080p'))
    : []
)

const saveGame = async () => {
  try {
    const saveGameData = {
      id: game.value.id,
      name: game.value.name,
      cover: game.value.cover,
      genres: game.value.genres,
      platforms: game.value.platforms,
      summary: game.value.summary.substring(0, 5000),
      rating: game.value.rating,
      username: username,
      grade: grade.value,
      review: review.value,
      dateCompleted: dateCompleted.value
    }
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
      isGameInList.value = true
      showForm.value = false
    } else {
      console.error('Error saving game:', data)
    }
  } catch (error) {
    console.error('Error saving game:', error)
  }
}

const getGameId = async () => {
  try {
    const response = await fetch(`/v1/api/userGame/user/game/${username}/${game.value.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader() // Agregar el token a los headers
      }
    });
    const data = await response.json();
    if (response.ok) {
      return data.response.idGame; // Asumiendo que esta es la estructura de la respuesta
    } else {
      console.error('Error fetching game ID:', data)
      return null;
    }
  } catch (error) {
    console.error('Error fetching game ID:', error)
    return null;
  }
};

const removeGame = async () => {
  try {
    const gameId = await getGameId();
    if (!gameId) {
      console.error('Game ID not found');
      return;
    }
    const response = await fetch(`/v1/api/userGame/delete/${gameId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader() // Agregar el token a los headers
      }
    })
    const data = await response.json()
    if (response.ok) {
      console.log('Game removed successfully:', data)
      isGameInList.value = false
      showForm.value = false
    } else {
      console.error('Error removing game:', data)
    }
  } catch (error) {
    console.error('Error removing game:', error)
  }
}

const toggleForm = async () => {
  if (isGameInList.value) {
    await removeGame()
  } else {
    showForm.value = !showForm.value
  }
}

const handleButtonClick = () => {
  if (!username) {
    router.push('/login')
  } else {
    toggleForm()
  }
}
</script>
