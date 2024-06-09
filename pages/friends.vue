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
      Generate Referral Link
    </button>

    <div v-if="referralLink" class="bg-gray-800 p-4 rounded-lg text-white">
      <p class="mb-2">Your referral link:</p>
      <input v-model="referralLink" readonly class="w-full bg-gray-700 text-white p-2 rounded"/>
    </div>

    <div class="mt-6">
      <h2 class="text-xl font-bold mb-4">List of your friends</h2>
      <div class="text-gray-400">You haven't invited anyone yet</div>
    </div>
  </div>
</template>

<script setup lang="ts">


const referralLink = ref('')

const generateLink = () => {
  referralLink.value = `https://yourapp.com/buy-card?ref=${generateRandomString()}`
}

const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 10)
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
