<template>
  <nav class="border-gray-200 bg-gray-900">
    <div class="flex flex-wrap items-center justify-between mx-auto p-4">
      <RouterLink
        :to="{
          name: 'home'
        }"
        class="flex items-center space-x-3 rtl:space-x-reverse"
      >
        <LogoComponent />
      </RouterLink>
      <div class="flex"><SearchBarComponent /></div>
      <div class="hidden w-full md:block md:w-auto" id="navbar-default">
        <ul
          class="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0"
        >
          <li v-if="!isAuthenticated">
            <RouterLink
              to="/login"
              class="block py-2 px-3 rounded md:border-0 md:p-0 md:hover:text-blue-500 hover:bg-gray-700 md:hover:bg-transparent text-slate-400"
              >Login</RouterLink
            >
          </li>
          <li v-if="!isAuthenticated">
            <RouterLink
              to="/sign-up"
              class="block py-2 px-3 rounded md:border-0 md:p-0 md:hover:text-blue-500 hover:bg-gray-700 md:hover:bg-transparent text-slate-400"
              >Sign Up</RouterLink
            >
          </li>
          <li v-if="isAuthenticated">
            <RouterLink
              to="/profile"
              class="block py-2 px-3 rounded md:border-0 md:p-0 md:hover:text-blue-500 hover:bg-gray-700 md:hover:bg-transparent text-slate-400"
              >Profile</RouterLink
            >
          </li>
          <li v-if="isAuthenticated">
            <button
              @click="handleLogout"
              class="block py-2 px-3 rounded md:border-0 md:p-0 md:hover:text-blue-500 hover:bg-gray-700 md:hover:bg-transparent text-slate-400"
              >Logout</button
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import LogoComponent from './LogoComponent.vue'
import SearchBarComponent from './SearchBarComponent.vue'

// Usar el store de autenticación
const { isAuthenticated, logout } = useAuthStore()

// Definir la función handleLogout
const handleLogout = () => {
  logout()
  // Redirigir al usuario a la página de inicio de sesión después de cerrar sesión
  window.location.href = '/login'
}
</script>
