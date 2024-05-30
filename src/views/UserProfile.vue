<template>
  <div class="user-profile">
    <h1 class="flex flex-row justify-center flex-wrap m-auto text-white text-center text-3xl font-bold mb-4">User
      Profile</h1>
    <div class="user-info mb-4">
      <p class="flex flex-row flex-wrap m-auto text-white"><strong>Username:</strong> {{ user.username }}</p>
      <p class="flex flex-row flex-wrap m-auto text-white"><strong>Email:</strong> {{ user.email }}</p>
    </div>
    <div class="user-games text-white">
      <h2 class="text-2xl font-semibold mb-2">Saved Games</h2>
      <div class="flex m-auto text-white">
        <div v-for="game in userGames" :key="game.id" class="game-item">
          <GameSearchComponent :name="game.name" :cover="game.cover" :id="game.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import GameSearchComponent from '@/components/GameSearchComponent.vue'
import { authHeader } from '@/stores/helpers.js'

// Variables reactivas
const user = ref({})
const userGames = ref([])
const errorMessage = ref('')

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
    console.log('User data:', userData)
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
    console.log('Games data:', gamesData)
    userGames.value = gamesData.response

    console.log('User games:', userGames.value)
  } catch (error) {
    console.error('Error fetching user profile or games:', error)
    errorMessage.value = error.message
  }
}

// Ejecutar la función fetchUserProfile al montar el componente
onMounted(() => {
  fetchUserProfile()
})
</script>
