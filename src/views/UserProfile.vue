<template>
  <div class="user-profile max-w-6xl mx-auto p-4">
    <h1 class="text-white text-center text-4xl font-bold mb-6">User Profile</h1>
    
    <!-- User Info Section -->
    <div class="user-info bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <p class="text-white text-lg mb-2"><strong>Username:</strong> {{ user.username }}</p>
      <p class="text-white text-lg"><strong>Email:</strong> {{ user.email }}</p>
    </div>

    <!-- Saved Games Section -->
    <div class="saved-games bg-gray-900 p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-white">Saved Games</h2>
        <div>
          <label for="sort" class="text-white mr-2">Sort By:</label>
          <select id="sort" v-model="sortOption" @change="sortGames" class="p-2 rounded bg-gray-800 text-white">
            <option value="date">Date Added</option>
            <option value="rating">User Rating</option>
          </select>
        </div>
      </div>
      <div class="games-list grid grid-cols-5 gap-4">
        <div
          v-for="game in sortedUserGames"
          :key="game.id"
          class="game-item bg-gray-800 p-2 rounded-lg shadow-md cursor-pointer transform transition-transform duration-200 hover:scale-105"
          @click="navigateToEdit(game.id)"
        >
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
    return userGames.value.slice().sort((a, b) => b.grade - a.grade)
  }
  // Default sort by date
  return userGames.value.slice().sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
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
  router.push({ name: 'game-edit', params: { id, username } })
}

// Función para manejar la ordenación de juegos
const sortGames = () => {
  // No se necesita implementar lógica aquí ya que sortedUserGames se actualiza automáticamente
}

// Ejecutar la función fetchUserProfile al montar el componente
onMounted(() => {
  fetchUserProfile()
})
</script>

<style scoped>
.user-profile {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.user-info {
  background-color: #2d3748;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.saved-games {
  background-color: #1a202c;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.games-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}

.game-item {
  background-color: #2d3748;
  padding: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.game-item:hover {
  transform: scale(1.05);
}

button {
  background-color: #4299e1;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: bold;
  color: #fff;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #2b6cb0;
}

select {
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #2d3748;
  color: white;
  border: 1px solid #4a5568;
}
</style>
