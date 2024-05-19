<template>
  <div class="flex items-center max-w-sm mx-auto">
    <label for="simple-search" class="sr-only">Search</label>
    <div class="relative w-full">
      <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-white">
        <SearchIconSvgComponent />
      </div>
      <input
        v-model="inputText"
        @keyup.enter="submitSearch"
        type="text"
        class="border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 bg-gray-700 border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search Videogame..."
        required
      />
    </div>
    <button
      @click="submitSearch"
      type="submit"
      class="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      <SearchIconSvgComponent />
      <span class="sr-only">Search</span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SearchIconSvgComponent from './SearchIconSvgComponent.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const inputText = ref('')

const submitSearch = () => {
  router.push({
    name: 'searchResults',
    params: { text: inputText.value },
    query: {
      time: Date.now()
    }
  })
  console.log(inputText.value)
}
</script>
