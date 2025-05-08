<template>
  <footer class="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-around">
    <div @click="navigateTo('/')" class="flex flex-col items-center cursor-pointer">
      <UIcon name="i-heroicons-home" class="w-6 h-6 mb-1"/>
      <span>خانه</span>
    </div>
    <div class="flex flex-col items-center cursor-pointer" @click="navigateTo('friends')">
      <UIcon name="i-heroicons-user-group" class="w-6 h-6 mb-1"/>
      <span>دوستان</span>
    </div>
    <div class="flex flex-col items-center opacity-50 cursor-not-allowed select-none">
      <UIcon name="i-heroicons-ticket" class="w-6 h-6 mb-1"/>
      <span>خرید بلیط</span>
    </div>
    <div class="flex flex-col items-center opacity-50 cursor-not-allowed select-none">
      <UIcon name="i-heroicons-trophy" class="w-6 h-6 mb-1"/>
      <span>نتیجه</span>
    </div>
    <div class="flex flex-col items-center opacity-50 cursor-not-allowed select-none">
      <UIcon name="i-heroicons-user" class="w-6 h-6 mb-1"/>
      <span>پروفایل</span>
    </div>
  </footer>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateTo(page) {
  router.push(`/${page}`)
}
</script>

<style scoped>
footer {
  background-color: #1a202c;
}
</style>
