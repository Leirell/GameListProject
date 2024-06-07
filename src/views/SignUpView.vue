<template>
    <div class="signup-container flex items-start justify-center min-h-screen bg-gray-900 pt-12">
      <div class="signup-box bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 class="text-3xl text-center text-white mb-8">Sign Up Page</h1>
        <form @submit.prevent="submitSignUp">
          <p v-if="errorMessage" class="text-red-500 text-center mb-4">{{ errorMessage }}</p>
          <div class="mb-4">
            <input class="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                   type="text" v-model="userData.username" placeholder="Enter Username" required />
          </div>
          <div class="mb-4">
            <input class="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                   type="email" v-model="userData.email" placeholder="Enter Email" required />
          </div>
          <div class="mb-6">
            <input class="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                   type="password" v-model="userData.password" placeholder="Enter Password" required />
          </div>
          <button class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors" type="submit">
            Sign Up
          </button>
        </form>
        <div class="mt-6 text-center">
          <router-link class="text-blue-400 hover:text-blue-600" to="/login">Login</router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        userData: {
          username: '',
          email: '',
          password: ''
        },
        errorMessage: ''
      };
    },
    methods: {
      async submitSignUp() {
        try {
          const signUpRequest = await fetch(`/v1/api/user/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.userData)
          });
  
          if (signUpRequest.ok) {
            this.$router.push('/');
          } else {
            const errorData = await signUpRequest.json();
            if (errorData.error) {
              this.errorMessage = errorData.error;
            } else {
              this.errorMessage = 'There is already an account with that Username/Email';
            }
          }
        } catch (error) {
          console.error('Error during sign up:', error);
          this.errorMessage = 'There is already an account with that Username/Email';
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .signup-container {
    background-color: #1a202c;
    padding-top: 50px; /* Añadir un poco de espacio superior */
  }
  
  .signup-box {
    background-color: #2d3748;
    margin-top: 0; /* Eliminar cualquier margen superior adicional */
  }
  
  input::placeholder {
    color: #a0aec0;
  }
  
  button {
    transition: background-color 0.3s;
  }
  </style>
  