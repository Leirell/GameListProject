import { ref } from 'vue'

const isAuthenticated = ref(!!sessionStorage.getItem('authToken'))
const username = ref(sessionStorage.getItem('username'))

export function useAuthStore() {
  const login = (token, user) => {
    sessionStorage.setItem('authToken', token)
    sessionStorage.setItem('username', user)
    isAuthenticated.value = true
    username.value = user
  }

  const logout = () => {
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('username')
    isAuthenticated.value = false
    username.value = null
  }

  return {
    isAuthenticated,
    username,
    login,
    logout
  }
}
