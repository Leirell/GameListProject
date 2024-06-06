<template>
  <div class="game-edit max-w-3xl mx-auto p-4">
    <div class="text-center mb-6">
      <GameSearchComponent :name="game.name" :cover="game.cover" :id="game.id" />
    </div>
    <div class="bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
      <div v-if="!isEditing">
        <p class="text-white text-lg mb-2"><strong>Grade:</strong> {{ grade }}</p>
        <p class="text-white text-lg mb-2"><strong>Review:</strong> {{ review }}</p>
        <p class="text-white text-lg mb-2"><strong>Date Completed:</strong> {{ dateCompleted }}</p>
        <div class="flex justify-end space-x-2">
          <button @click="isEditing = true"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
            Edit
          </button>
          <button @click="goToProfile"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors">
            Back to Profile
          </button>
        </div>
      </div>
      <form v-else @submit.prevent="saveChanges" class="space-y-4">
        <div class="form-group">
          <label for="grade" class="text-white block mb-2">Grade:</label>
          <input type="number" v-model="grade" id="grade"
            class="form-control w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded" />
        </div>
        <div class="form-group">
          <label for="review" class="text-white block mb-2">Review:</label>
          <textarea v-model="review" id="review"
            class="form-control w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded"></textarea>
        </div>
        <div class="form-group">
          <label for="dateCompleted" class="text-white block mb-2">Date Completed:</label>
          <input type="date" v-model="dateCompleted" id="dateCompleted"
            class="form-control w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded" />
        </div>
        <div class="flex justify-end space-x-2">
          <button type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
            Save Changes
          </button>
          <button @click="cancelChanges" type="button"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
    <div v-if="successMessage" class="mt-4 p-4 bg-green-500 text-white rounded text-center">
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
const isEditing = ref(false)

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
    isEditing.value = false
    setTimeout(() => {
      successMessage.value = ''
      router.push({ name: 'user-profile' })
    }, 3000)
  } catch (error) {
    console.error('Error saving changes:', error)
  }
}

const cancelChanges = () => {
  isEditing.value = false
}

const goToProfile = () => {
  router.push({ name: 'profile' })
}

onMounted(() => {
  fetchGameDetails()
})
</script>

<style scoped>
.game-edit {
  max-width: 768px;
  margin: 0 auto;
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.25rem;
  background-color: #2d3748;
  color: white;
  border: 1px solid #4a5568;
  border-radius: 0.375rem;
}

.bg-gray-800 {
  background-color: #2d3748;
}

.text-white {
  color: #fff;
}

.bg-blue-500 {
  background-color: #4299e1;
}

.bg-blue-700 {
  background-color: #2b6cb0;
}

.bg-red-500 {
  background-color: #f56565;
}

.bg-red-700 {
  background-color: #c53030;
}

.bg-green-500 {
  background-color: #48bb78;
}

.bg-gray-500 {
  background-color: #a0aec0;
}

.bg-gray-700 {
  background-color: #4a5568;
}

.hover\:bg-blue-700:hover {
  background-color: #2b6cb0;
}

.hover\:bg-red-700:hover {
  background-color: #c53030;
}

.hover\:bg-gray-700:hover {
  background-color: #4a5568;
}

.text-center {
  text-align: center;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mt-4 {
  margin-top: 1rem;
}

.p-4 {
  padding: 1rem;
}

.p-2 {
  padding: 0.5rem;
}

.rounded {
  border-radius: 0.375rem;
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.transition-colors {
  transition: background-color 0.2s;
}
</style>
