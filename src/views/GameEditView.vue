<template>
  <div class="game-edit">
    <GameSearchComponent :name="game.name" :cover="game.cover" :id="game.id" />
    <form @submit.prevent="saveChanges">
      <div class="form-group">
        <label for="grade" class="text-white">Grade:</label>
        <input type="number" v-model="grade" id="grade" class="form-control" />
      </div>
      <div class="form-group">
        <label for="review" class="text-white">Review:</label>
        <textarea v-model="review" id="review" class="form-control"></textarea>
      </div>
      <div class="form-group">
        <label for="dateCompleted" class="text-white">Date Completed:</label>
        <input type="date" v-model="dateCompleted" id="dateCompleted" class="form-control" />
      </div>
      <button type="submit" class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save Changes</button>
      <button @click="cancelChanges" type="button"
        class="mt-4 ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
    </form>
    <div v-if="successMessage" class="mt-4 p-4 bg-green-500 text-white rounded">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import GameSearchComponent from '@/components/GameSearchComponent.vue'
import { authHeader } from '@/stores/helpers.js'

const game = ref({})
const grade = ref(0)
const review = ref('')
const dateCompleted = ref('')
const successMessage = ref('')

const route = useRoute()
const router = useRouter()

const fetchGameDetails = async () => {
  const { id } = route.params
  const username = sessionStorage.getItem('username')

  try {
    const gameRequest = await fetch(`/v1/api/userGame/user/game/${username}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      }
    })

    if (!gameRequest.ok) {
      throw new Error('Failed to fetch game details')
    }

    const gameData = await gameRequest.json()
    game.value = gameData.response
    grade.value = gameData.response.grade
    review.value = gameData.response.review
    dateCompleted.value = gameData.response.dateCompleted
  } catch (error) {
    console.error('Error fetching game details:', error)
  }
}

const saveChanges = async () => {
  try {
    const gameId = game.value.idGame
    const gameData = {
      id: game.value.id,
      grade: grade.value,
      review: review.value,
      dateCompleted: dateCompleted.value
    }

    const response = await fetch(`/v1/api/userGame/modify/${gameId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader()
      },
      body: JSON.stringify(gameData)
    })

    if (!response.ok) {
      throw new Error('Failed to save changes')
    }

    successMessage.value = 'Changes saved successfully!'
    setTimeout(() => {
      successMessage.value = ''
      router.push({ name: 'user-profile' })
    }, 3000)
  } catch (error) {
    console.error('Error saving changes:', error)
  }
}

const cancelChanges = () => {
  router.push({ name: 'profile' })
}

onMounted(() => {
  fetchGameDetails()
})
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 0.25rem;
}
</style>
