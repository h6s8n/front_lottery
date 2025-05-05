<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Invite Friends</h1>
    <p class="mb-6">Share your referral link and get rewards for every friend who joins!</p>

    <div v-if="!isLoggedIn" class="mb-6">
      <div class="bg-yellow-100 text-yellow-800 p-4 rounded">Please log in to see your referral information.</div>
    </div>

    <div v-else>
      <div class="bg-gray-800 p-4 rounded-lg mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="text-lg font-bold text-white mb-2">Your Referral Link</h2>
          <div class="flex gap-2 mb-2">
            <input :value="referralLink" readonly class="flex-1 bg-gray-700 text-white p-2 rounded" />
            <button @click="copyLink" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Copy</button>
          </div>
          <button @click="shareOnTelegram" class="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Share on Telegram</button>
        </div>
        <div class="flex flex-col items-center justify-center">
          <UIcon name="i-heroicons-gift" class="w-12 h-12 text-yellow-400 mb-2"/>
          <span class="text-white">Invite friends and earn rewards!</span>
        </div>
      </div>

      <div class="mt-6">
        <h2 class="text-xl font-bold mb-4">Your Invited Friends</h2>
        <div v-if="referrals.length === 0" class="text-gray-400">You haven't invited anyone yet.</div>
        <ul v-else class="bg-gray-800 p-4 rounded-lg text-white">
          <li v-for="friend in referrals" :key="friend.id" class="mb-2 flex items-center gap-2">
            <UIcon name="i-heroicons-user" class="w-5 h-5 text-blue-400"/>
            <span>{{ friend.first_name }} {{ friend.last_name }} <span v-if="friend.username">(@{{ friend.username }})</span></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '~/stores/auth'

const isLoggedIn = ref(false)
const user = ref(null)
const referralLink = ref('')
const botUsername = 'LotteryAbolBot'
const auth = useAuthStore()
const referrals = ref([])
const referralCode = ref('')

onMounted(async () => {
  if (auth.token) {
    isLoggedIn.value = true
    try {
      const res = await axios.get('http://localhost:8000/api/user/referrals', {
        headers: { Authorization: `Bearer ${auth.token}` }
      })
      user.value = res.data.user
      referrals.value = res.data.referrals
      referralCode.value = res.data.referral_code
      referralLink.value = `https://t.me/${botUsername}?start=${referralCode.value}`
    } catch (err) {
      isLoggedIn.value = false
    }
  }
})

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(referralLink.value)
    alert('Link copied to clipboard!')
  } catch (err) {
    alert('Failed to copy link')
  }
}

const shareOnTelegram = () => {
  window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink.value)}`, '_blank')
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
