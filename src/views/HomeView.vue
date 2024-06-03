<template>
  <div class="flex flex-col w-2/3 m-auto">
    <div class="mt-6 text-white text-center text-4xl">Top Rating</div>
    <div class="flex flex-row mt-5 bg-slate-700 h-80">
      <SwiperHomeComponent :request="'searchByRating'" />
    </div>
    <div class="mt-6 text-white text-center text-4xl">Coming Soon</div>
    <div class="mt-5 bg-slate-700 h-80">
      <SwiperHomeComponent :request="'searchComingSoon'" />
    </div>
    <div class="mt-6 text-white text-center text-4xl">Recently Released</div>
    <div class="mt-5 bg-slate-700 h-80">
      <SwiperHomeComponent :request="'searchRecentlyRealeased'" />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import SwiperHomeComponent from '@/components/SwiperHomeComponent.vue'

const route = useRoute()

console.log('view', route.params.text)
</script>
