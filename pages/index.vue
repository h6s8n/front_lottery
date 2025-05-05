<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Welcome to the Lottery</h1>
    <a
      v-if="!isLoggedIn"
      href="https://t.me/LotteryAbolBot?start=login"
      class="w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline block text-center mb-6"
      target="_blank"
    >
      Login with Telegram
    </a>
    <div class="space-y-6">
      <!-- EuroMillions Card -->
      <div class="bg-blue-600 text-white p-6 rounded-lg flex justify-between items-center">
        <div>
          <h2 class="text-4xl font-bold">£51 Million</h2>
          <p class="text-lg">It's a <span class="font-bold">4x Rollover!</span></p>
        </div>
        <div class="text-center">
          <p>Time left to buy tickets:</p>
          <div class="flex space-x-2">
            <div>
              <p class="text-2xl font-bold">1</p>
              <p>Days</p>
            </div>
            <div>
              <p class="text-2xl font-bold">6</p>
              <p>Hours</p>
            </div>
            <div>
              <p class="text-2xl font-bold">6</p>
              <p>Mins</p>
            </div>
            <div>
              <p class="text-2xl font-bold">38</p>
              <p>Secs</p>
            </div>
          </div>
        </div>
        <nuxt-link to="/buy-card" class="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Buy Tickets Now</nuxt-link>
      </div>

      <!-- Lotto Card -->
      <div class="bg-red-600 text-white p-6 rounded-lg flex justify-between items-center">
        <div>
          <h2 class="text-4xl font-bold">£5.2 Million</h2>
          <p class="text-lg">It's a <span class="font-bold">DOUBLE Rollover!</span></p>
        </div>
        <div class="text-center">
          <p>Time left to buy tickets:</p>
          <div class="flex space-x-2">
            <div>
              <p class="text-2xl font-bold">2</p>
              <p>Days</p>
            </div>
            <div>
              <p class="text-2xl font-bold">6</p>
              <p>Hours</p>
            </div>
            <div>
              <p class="text-2xl font-bold">6</p>
              <p>Mins</p>
            </div>
            <div>
              <p class="text-2xl font-bold">38</p>
              <p>Secs</p>
            </div>
          </div>
        </div>
        <nuxt-link to="/buy-tickets" class="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Buy Tickets Now</nuxt-link>
      </div>

      <!-- Irish Lotto Card -->
      <div class="bg-green-600 text-white p-6 rounded-lg flex justify-between items-center">
        <div>
          <h2 class="text-4xl font-bold">€6.5 Million</h2>
          <p class="text-lg">It's a <span class="font-bold">Rollover!</span></p>
        </div>
        <div class="text-center">
          <p>Time left to buy tickets:</p>
          <div class="flex space-x-2">
            <div>
              <p class="text-2xl font-bold">2</p>
              <p>Days</p>
            </div>
            <div>
              <p class="text-2xl font-bold">6</p>
              <p>Hours</p>
            </div>
            <div>
              <p class="text-2xl font-bold">16</p>
              <p>Mins</p>
            </div>
            <div>
              <p class="text-2xl font-bold">38</p>
              <p>Secs</p>
            </div>
          </div>
        </div>
        <nuxt-link to="/buy-tickets" class="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Buy Tickets Now</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

const isLoggedIn = ref(false)
const auth = useAuthStore()

onMounted(() => {
  // خواندن توکن از URL
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  if (token) {
    auth.setToken(token)
    isLoggedIn.value = true
    // حذف پارامتر از URL
    window.history.replaceState({}, document.title, '/')
  } else if (auth.token || localStorage.getItem('auth_token')) {
    isLoggedIn.value = true
  }
})
</script>

<style scoped>
/* Additional styles if needed */
</style>
