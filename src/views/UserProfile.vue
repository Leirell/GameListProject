<template>
  <div class="max-w-6xl mx-auto p-4">
    <h1 class="text-white text-center text-4xl font-bold mb-6">{{ user.username }}'s Profile</h1>

    <div class="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <p class="text-white text-lg mb-2"><strong>Username:</strong> {{ user.username }}</p>
      <p class="text-white text-lg"><strong>Email:</strong> {{ user.email }}</p>
    </div>

    <div class="bg-gray-900 p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-white">Saved Games</h2>
        <div class="relative inline-block">
          <label for="sort" class="text-white mr-2">Sort By:</label>
          <select id="sort" v-model="sortOption" @change="sortGames"
            class="appearance-none p-2 pr-8 rounded bg-gray-800 text-white border border-gray-600 cursor-pointer focus:outline-none focus:shadow-outline-blue">
            <option value="date">Date Added</option>
            <option value="rating">User Rating</option>
            <option value="completed">Date Completed</option>
          </select>
          <span class="absolute top-1/2 right-2 transform -translate-y-1/2 text-white pointer-events-none">▼</span>
        </div>
      </div>
      <div class="grid grid-cols-5 gap-4">
        <div v-for="game in sortedUserGames" :key="game.id"
          class="bg-gray-800 p-2 rounded-lg shadow-md cursor-pointer transform transition-transform duration-200 hover:scale-105"
          @click="navigateToEdit(game.id)">
          <GameSearchComponent :name="game.name" :cover="game.cover" :id="game.id" />
        </div>
      </div>
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
const sortOption = ref('date')

// Computed property para ordenar los juegos según la opción seleccionada
const sortedUserGames = computed(() => {
  if (sortOption.value === 'rating') {
    return userGames.value.slice().sort((a, b) => b.grade - a.grade);
  } else if (sortOption.value === 'completed') {
    return userGames.value.slice().sort((a, b) => new Date(b.dateCompleted) - new Date(a.dateCompleted));
  }
  // Default sort by idGame
  return userGames.value.slice().sort((a, b) => b.idGame - a.idGame);
})



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
    console.error('Error fetching user data:', error)
  }
}

// Configurar el router
const router = useRouter()

// Función para manejar la navegación
const navigateToEdit = (id) => {
  const username = user.value.username
  router.replace({ name: 'game-edit', params: { id, username } })
}

// Ejecutar la función fetchUserProfile al montar el componente
onMounted(() => {
  fetchUserProfile()
})
</script>
