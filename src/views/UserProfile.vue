<template>
  <div class="user-profile">
    <h1 class="flex flex-row justify-center flex-wrap m-auto text-white text-center text-3xl font-bold mb-4">User Profile</h1>
    <div class="user-info mb-4">
      <p class="flex flex-row flex-wrap m-auto text-white"><strong>Username:</strong> {{ user.username }}</p>
      <p class="flex flex-row flex-wrap m-auto text-white"><strong>Email:</strong> {{ user.email }}</p>
    </div>
    <div class="mt-6 text-white text-center w-2/3 m-auto">
      <h2 class="text-2xl font-semibold mb-2">Saved Games</h2>
      <div class="flex mt-5 bg-slate-700 h-80">
        <div v-for="game in limitedUserGames" :key="game.id" class="game-item" @click="navigateToEdit(game.id)">
          <GameSearchComponent :name="game.name" :cover="game.cover" :id="game.id" />
        </div>
      </div>
      <button @click="viewAllGames" class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        View All Games
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import GameSearchComponent from '@/components/GameSearchComponent.vue'
import { authHeader } from '@/stores/helpers.js'

// Variables reactivas
const user = ref({})
const userGames = ref([])
const errorMessage = ref('')

// Computed property para obtener los últimos 5 juegos
const limitedUserGames = computed(() => userGames.value.slice(0, 5))

const fetchUserProfile = async () => {
  const username = sessionStorage.getItem('username')
  if (!username) {
    console.error('No username found in session storage')
    return
  }

  try {
    // Petición para obtener los datos del usuario
    const userRequest = await fetch(`/v1/api/user/profile/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      }
    })

    if (!userRequest.ok) {
      throw new Error('Failed to fetch user profile')
    }

    const userData = await userRequest.json()
    user.value = userData.response

    // Petición para obtener los juegos guardados del usuario
    const gamesRequest = await fetch(`/v1/api/userGame/user/games/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      }
    })

    if (!gamesRequest.ok) {
      throw new Error('Failed to fetch user games')
    }

    const gamesData = await gamesRequest.json()
    userGames.value = gamesData.response
  } catch (error) {
    errorMessage.value = error.message
  }
}

// Configurar el router
const router = useRouter()

// Función para manejar la navegación
const navigateToEdit = (gameId) => {
  router.push({ name: 'game-edit', params: { id: gameId } })
}

const viewAllGames = () => {
  const username = sessionStorage.getItem('username')
  router.push({ name: 'all-games', params: { username } })
}

// Ejecutar la función fetchUserProfile al montar el componente
onMounted(() => {
  fetchUserProfile()
})
</script>
