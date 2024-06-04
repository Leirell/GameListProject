import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SearchResultView from '@/views/SearchResultView.vue'
import Login from '@/views/LoginView.vue'
import SignUp from '@/views/SignUpView.vue'
import GameFileView from '@/views/GameFileView.vue'
import Profile from '@/views/UserProfile.vue'
import AllGames from '@/views/AllGames.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/:text',
      name: 'searchResults',
      component: SearchResultView
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/sign-up',
      name: 'signUp',
      component: SignUp
    },
    {
      path: '/game/:id?',
      name: 'gameFile',
      component: GameFileView,
      props: true
    },
    {
    path: '/profile',
    name: 'profile',
    component: Profile
    },
    {
      path: '/profile/games/:username',
      name: 'all-games',
      component: AllGames
    }
  ]
})

export default router
