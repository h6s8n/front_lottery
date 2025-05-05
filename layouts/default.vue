<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main class="flex-grow pb-24"> <!-- Added padding-bottom here -->
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { onMounted } from 'vue'
const auth = useAuthStore()
onMounted(() => {
  auth.loadToken()
})
</script>

<style scoped>
/* Additional styles if needed */
</style>
