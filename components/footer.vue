<template>
  <footer class="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md text-white p-2 flex justify-around border-t border-white/10 z-50">
    <div @click="navigateTo('/')" class="flex flex-col items-center justify-center cursor-pointer transition-colors hover:text-yellow-400 p-2" :class="{ 'text-yellow-400': $route.path === '/' }">
      <UIcon name="i-heroicons-home" class="w-7 h-7"/>
    </div>
    <div @click="navigateTo('/friends')" class="flex flex-col items-center justify-center cursor-pointer transition-colors hover:text-yellow-400 p-2" :class="{ 'text-yellow-400': $route.path === '/friends' }">
      <UIcon name="i-heroicons-user-group" class="w-7 h-7"/>
    </div>
    <div @click="navigateTo('/buy-card')" class="flex flex-col items-center justify-center cursor-pointer transition-colors hover:text-yellow-400 p-2" :class="{ 'text-yellow-400': $route.path === '/buy-card' }">
      <UIcon name="i-heroicons-ticket" class="w-7 h-7"/>
    </div>
    <div @click="navigateTo('/result')" class="flex flex-col items-center justify-center cursor-pointer transition-colors hover:text-yellow-400 p-2" :class="{ 'text-yellow-400': $route.path === '/result' }">
      <UIcon name="i-heroicons-trophy" class="w-7 h-7"/>
    </div>
    <div @click="navigateTo('/profile')" class="flex flex-col items-center justify-center cursor-pointer transition-colors hover:text-yellow-400 p-2" :class="{ 'text-yellow-400': $route.path === '/profile' }">
      <UIcon name="i-heroicons-user" class="w-7 h-7"/>
    </div>
  </footer>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateTo(page) {
  router.push(page)
}
</script>

<style scoped>
footer {
  background-color: #1a202c;
}
</style>
