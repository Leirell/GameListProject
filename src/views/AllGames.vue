<template>
    <div class="all-games">
      <h1 class="text-white text-center text-3xl font-bold mb-4">All Saved Games</h1>
      <div class="games-list flex">
        <div v-for="game in userGames" :key="game.id" class="game-item">
          <GameSearchComponent :name="game.name" :cover="game.cover" :id="game.id" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import GameSearchComponent from '@/components/GameSearchComponent.vue'
  import { authHeader } from '@/stores/helpers.js'
  
  // Variables reactivas
  const userGames = ref([])
  const errorMessage = ref('')
  
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
      console.log('Games data:', gamesData)
      userGames.value = gamesData.response
  
      console.log('User games:', userGames.value)
    } catch (error) {
      console.error('Error fetching user games:', error)
      errorMessage.value = error.message
    }
  }
  
  // Ejecutar la función fetchUserGames al montar el componente
  onMounted(() => {
    fetchUserGames()
  })
  </script>
  