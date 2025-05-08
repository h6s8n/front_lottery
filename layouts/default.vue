<template>
  <div class="flex flex-col min-h-screen">
    <main class="flex-grow pb-24"> <!-- Added padding-bottom here -->
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
const auth = useAuthStore()
const route = useRoute()

onMounted(() => {
  auth.loadToken()
  if (route.query.token) {
    auth.setToken(route.query.token)
  }
})

// اگر کاربر بین صفحات جابجا شد و توکن در query بود، باز هم ذخیره شود
watch(() => route.query.token, (newToken) => {
  if (newToken) {
    auth.setToken(newToken)
  }
})
</script>

<style scoped>
/* Additional styles if needed */
</style>
