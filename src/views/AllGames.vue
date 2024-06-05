<template>
  <div class="all-games max-w-6xl mx-auto p-4">
    <h1 class="text-white text-center text-4xl font-bold mb-6">All Saved Games</h1>
    <div class="flex justify-between items-center mb-4">
      <label class="text-white text-lg">Sort By:</label>
      <select v-model="sortOption" @change="sortGames" class="bg-gray-800 text-white p-2 rounded">
        <option value="date">Date Added</option>
        <option value="rating">User Rating</option>
      </select>
    </div>
    <div class="games-list grid grid-cols-5 gap-4">
      <div v-for="game in sortedGames" :key="game.id" class="game-item" @click="navigateToEdit(game.id)">
        <GameSearchComponent :name="game.name" :cover="game.cover" :id="game.id" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GameSearchComponent from '@/components/GameSearchComponent.vue'
import { authHeader } from '@/stores/helpers.js'

// Variables reactivas
const userGames = ref([])
const sortOption = ref('date')
const errorMessage = ref('')

// Computed property para ordenar los juegos
const sortedGames = computed(() => {
  if (sortOption.value === 'rating') {
    return [...userGames.value].sort((a, b) => b.grade - a.grade)
  } else {
    return [...userGames.value].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
  }
})

// Obtener el parámetro de la ruta
const route = useRoute()
const username = route.params.username

const fetchUserGames = async () => {
  if (!username) {
    console.error('No username provided in route params')
    return
  }

  try {
    // Petición para obtener todos los juegos guardados del usuario
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
    console.error('Error fetching user games:', error)
    errorMessage.value = error.message
  }
}

// Configurar el router
const router = useRouter()

// Función para manejar la navegación
const navigateToEdit = (id) => {
  router.push({ name: 'game-edit', params: { id, username } })
}

// Ejecutar la función fetchUserGames al montar el componente
onMounted(() => {
  fetchUserGames()
})

const sortGames = () => {
  // El sorting se maneja por el computed property sortedGames
}
</script>

<style scoped>
.all-games {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
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

h1 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

p {
  font-size: 1.125rem;
  margin-bottom: 0.75rem;
}
</style>
