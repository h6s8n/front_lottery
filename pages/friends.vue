<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Invite friends!</h1>
    <p class="mb-6">You and your friend will receive bonuses</p>

    <div class="bg-gray-800 p-4 rounded-lg mb-6">
      <div class="flex items-center mb-4">
        <UIcon name="i-heroicons-gift" class="w-6 h-6 text-yellow-500 mr-2"/>
        <div class="text-white">
          <div class="font-bold">Invite a friend</div>
          <div>+5,000 for you and your friend</div>
        </div>
      </div>

      <div class="flex items-center">
        <UIcon name="i-heroicons-gift" class="w-6 h-6 text-yellow-500 mr-2"/>
        <div class="text-white">
          <div class="font-bold">Invite a friend with Telegram Premium</div>
          <div>+25,000 for you and your friend</div>
        </div>
      </div>
    </div>

    <button @click="generateLink" class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-6">
      Generate Telegram Referral Link
    </button>

    <div v-if="referralLink" class="bg-gray-800 p-4 rounded-lg text-white">
      <p class="mb-2">Your Telegram referral link:</p>
      <div class="flex gap-2 mb-2">
        <input v-model="referralLink" readonly class="flex-1 bg-gray-700 text-white p-2 rounded"/>
        <button @click="copyLink" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Copy
        </button>
      </div>
      <button @click="shareOnTelegram" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        Share on Telegram
      </button>
    </div>

    <div class="mt-6">
      <h2 class="text-xl font-bold mb-4">List of your friends</h2>
      <div class="text-gray-400">You haven't invited anyone yet</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const referralLink = ref('')
const botUsername = 'LotteryAbolBot' // نام کاربری بات تلگرام

const generateLink = () => {
  const referralCode = generateRandomString()
  referralLink.value = `https://t.me/${botUsername}?start=${referralCode}`
}

const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 10)
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(referralLink.value)
    alert('Link copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy link:', err)
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
