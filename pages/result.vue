<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-900">
    <div class="container mx-auto p-6 max-w-sm">
      <component :is="cardComponent" class="w-full h-auto rounded-lg shadow-md" />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import WinCard from '@/components/cards/Win.vue'
import LoseCard from '@/components/cards/Lose.vue'
import WaitCard from '@/components/cards/Wait.vue'

const route = useRoute()
const status = route.query.status || 'wait'

const cardComponent = {
  win: WinCard,
  lose: LoseCard,
  wait: WaitCard
}[status]
</script>

<style scoped>
/* Additional styles if needed */
</style>
