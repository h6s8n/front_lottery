<template>
  <div class="contain-content flex justify-center items-center min-h-screen bg-gray-100 mt-3">
    <div class="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">

      <!-- Cutoff Time and Show/Hide Option -->
      <div class="flex justify-between items-center mb-4 text-gray-700">
        <p class="text-sm">🕒 Cutoff time: {{ cutoffTime }}</p>
        <button @click="toggleShowMore" class="text-sm text-blue-600">
          {{ showMore ? 'Show less' : 'Show more' }}
        </button>
      </div>

      <!-- Public Key and Number List -->
      <div v-for="(entry, index) in publicKeyEntries" :key="index" class="mb-4 bg-gray-50 p-4 rounded-lg shadow-sm">
        <div class="flex justify-between items-center mb-2">
          <div class="flex space-x-2">
            <div
                v-for="number in entry.numbers"
                :key="number"
                :class="{'bg-blue-500 text-white': number === entry.specialNumber, 'bg-gray-200': number !== entry.specialNumber}"
                class="rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
              {{ number }}
            </div>
          </div>
          <div class="flex space-x-2">
            <button @click="editEntry(index)" class="text-blue-600 hover:text-blue-800">
              ✎
            </button>
            <button @click="removeEntry(index)" class="text-red-600 hover:text-red-800">
              🗑
            </button>
          </div>
        </div>
      </div>

      <!-- Price Per Line and Total Price -->
      <div class="text-center mb-4 text-gray-700">
        <p>Price per line: {{ pricePerLine }} USDT</p>
        <p>Total price: {{ totalPrice }} USDT</p>
      </div>

      <!-- Coin and Network Selection -->
      <div class="flex items-center space-x-2 mb-4">
        <div class="flex-1">
          <label class="block text-gray-700 text-sm font-bold mb-2">Coin</label>
          <USelectMenu v-model="selectedCoin" :options="coinOptions" />
        </div>
        <div class="flex-1">
          <label class="block text-gray-700 text-sm font-bold mb-2">Network</label>
          <USelectMenu v-model="selectedNetwork" :options="networkOptions" />
        </div>
      </div>

      <!-- Add New Entry Button -->
      <div class="text-center mb-6">
        <button @click="addNewEntry" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          + Add New Entry
        </button>
      </div>

      <!-- Submit Button -->
      <div>
        <button type="submit" @click="onSubmit" class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">
          Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Constant price per line
const pricePerLine = 2; // USDT

// Public key entries array
const publicKeyEntries = ref([
  {
    publicKey: '0x1234abcd5678efgh',
    numbers: [2, 32, 44, 47, 54],
    specialNumber: 2
  },
  {
    publicKey: '0x5678efgh1234abcd',
    numbers: [9, 19, 25, 46, 65],
    specialNumber: 6
  }
])

// Computed total price based on the number of public key entries
const totalPrice = computed(() => {
  return publicKeyEntries.value.length * pricePerLine;
})

const cutoffTime = ref('Wed 5:00 AM')
const showMore = ref(false)

const toggleShowMore = () => {
  showMore.value = !showMore.value
}

// Coin and Network selection options
const coinOptions = [
  { label: 'USDT', value: 'usdt' },
  { label: 'BTC', value: 'btc' },
  { label: 'ETH', value: 'eth' }
]

const networkOptions = [
  { label: 'TRC20', value: 'trc20' },
  { label: 'ERC20', value: 'erc20' }
]

const selectedCoin = ref(coinOptions[0])
const selectedNetwork = ref(networkOptions[0])

// Add a new public key entry
const addNewEntry = () => {
  publicKeyEntries.value.push({
    publicKey: 'New Public Key',
    numbers: [1, 2, 3, 4, 5],
    specialNumber: 1
  })
}

// Remove an existing public key entry
const removeEntry = (index: number) => {
  publicKeyEntries.value.splice(index, 1)
}

// Placeholder function for editing an entry
const editEntry = (index: number) => {
  alert(`Edit entry at index: ${index}`)
}

// Submit the form
const onSubmit = () => {
  alert(`Proceeding to checkout with total price of ${totalPrice.value} USDT`)
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
