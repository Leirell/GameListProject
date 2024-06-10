<template>
  <div class="login-container flex items-start justify-center min-h-screen bg-gray-900 pt-12">
    <div class="login-box bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-3xl text-center text-white mb-8">Login Page</h1>
      <form @submit.prevent="submitLogin">
        <p v-if="errorMessage" class="text-red-500 text-center mb-4">{{ errorMessage }}</p>
        <div class="mb-4">
          <input
            class="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text" v-model="userData.username" placeholder="Enter Username" required />
        </div>
        <div class="mb-6">
          <input
            class="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password" v-model="userData.password" placeholder="Enter Password" required />
        </div>
        <button class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          type="submit">
          Login
        </button>
      </form>
      <div class="mt-6 text-center">
        <router-link class="text-blue-400 hover:text-blue-600" to="/sign-up">Sign up</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'

export default {
  data() {
    return {
      userData: {
        username: '',
        password: ''
      },
      errorMessage: ''
    };
  },
  methods: {
    async submitLogin() {
      try {
        const loginRequest = await fetch(`/v1/api/user/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.userData)
        });

        if (loginRequest.ok) {
          const response = await loginRequest.json();
          const token = response.response.token;

          const { login } = useAuthStore()
          login(token, this.userData.username)

          this.$router.push('/');
        } else {
          this.errorMessage = 'Username/Password failed';
        }
      } catch (error) {
        console.error('Error during login:', error);
        this.errorMessage = 'Error during login';
      }
    }
  }
}
</script>
