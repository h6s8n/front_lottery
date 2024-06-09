<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const coinOptions = [
  { label: 'تتر (USDT)', value: 'usdt' },
  { label: 'بیت کوین (BTC)', value: 'btc' },
  { label: 'اتریوم (ETH)', value: 'eth' }
]

const networkOptions = [
  { label: 'TRC20', value: 'trc20' },
  { label: 'ERC20', value: 'erc20' }
]

const selectedCoin = ref(coinOptions[0])
const selectedNetwork = ref(networkOptions[0])
const lotteryDate = ref('2024-12-31')
const collectedAmount = ref('500 USDT')
const isReferral = ref(false)
const referrer = ref('')

const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (route.query.ref) {
    isReferral.value = true
    referrer.value = route.query.ref
  }
})

const onSubmit = () => {
  router.push('/result?status=wait')
}
</script>

<template>
  <div class="contain-content flex justify-center items-center min-h-screen bg-gray-900 mt-3">
    <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <img src="/event1.webp" alt="Lottery Image" class="w-full h-auto mb-4 rounded-lg shadow-md"/>
      <div class="text-center mb-4 text-gray-700">
        <h2 class="text-xl font-bold">Lottery Date: {{ lotteryDate }}</h2>
        <p class="text-lg">Collected Amount: {{ collectedAmount }}</p>
      </div>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div v-if="isReferral" class="mb-4 text-green-600">
          Thank you for joining through a referral link from {{ referrer }}!
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">کوین</label>
          <USelectMenu v-model="selectedCoin" :options="coinOptions" />
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">شبکه</label>
          <USelectMenu v-model="selectedNetwork" :options="networkOptions" />
        </div>
        <button type="submit" class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Buy Card</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Additional styles if needed */
</style>
