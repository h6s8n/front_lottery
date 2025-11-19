<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#FF8E8E] to-[#FFB6B6] text-white font-vazir overflow-x-hidden selection:bg-yellow-400 selection:text-black" dir="rtl">
    
    <!-- Background Elements -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-500/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
    </div>

    <div class="relative container mx-auto px-4 py-6 pb-32 max-w-md">
      
      <h1 class="text-3xl font-black text-center mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 drop-shadow-sm">خرید بلیط</h1>

      <!-- Payment Method Switcher -->
      <div class="bg-black/20 backdrop-blur-md p-1 rounded-2xl flex mb-6 border border-white/10">
        <button 
          @click="paymentMethod = 'rial'"
          class="flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2"
          :class="paymentMethod === 'rial' ? 'bg-white text-gray-900 shadow-lg' : 'text-white/60 hover:bg-white/5'"
        >
          <UIcon name="i-heroicons-credit-card" class="w-5 h-5"/>
          پرداخت ریالی
        </button>
        <button 
          @click="paymentMethod = 'crypto'"
          class="flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2"
          :class="paymentMethod === 'crypto' ? 'bg-yellow-400 text-black shadow-lg' : 'text-white/60 hover:bg-white/5'"
        >
          <UIcon name="i-heroicons-currency-dollar" class="w-5 h-5"/>
          ارز دیجیتال
        </button>
      </div>

      <div class="bg-black/20 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-xl transition-all duration-500">
        
        <!-- Cutoff Time -->
        <div class="flex justify-between items-center mb-6 text-white/90 bg-white/10 p-3 rounded-xl">
          <p class="text-sm font-bold flex items-center gap-2">
            <UIcon name="i-heroicons-clock" class="w-5 h-5 text-yellow-300"/>
            زمان قرعه‌کشی:
          </p>
          <span class="font-mono dir-ltr">{{ cutoffTime }}</span>
        </div>

        <!-- Ticket Selection (Common for both) -->
        <div class="mb-6">
           <div class="flex justify-between items-center mb-2">
             <label class="text-white/80 text-sm font-bold">تعداد بلیط</label>
             <span class="text-yellow-300 font-mono font-bold">{{ ticketCount }} عدد</span>
           </div>
           <div class="flex items-center gap-4 bg-white/10 p-2 rounded-xl">
             <button @click="ticketCount > 1 ? ticketCount-- : null" class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
               <UIcon name="i-heroicons-minus" class="w-5 h-5"/>
             </button>
             <input type="range" v-model="ticketCount" min="1" max="50" class="flex-1 accent-yellow-400 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"/>
             <button @click="ticketCount++" class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
               <UIcon name="i-heroicons-plus" class="w-5 h-5"/>
             </button>
           </div>
        </div>

        <!-- RIAL PAYMENT UI -->
        <div v-if="paymentMethod === 'rial'" class="animate-fade-in">
           <div class="bg-gradient-to-br from-gray-700 to-gray-900 p-5 rounded-2xl mb-6 border border-white/10 relative overflow-hidden">
             <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
             <div class="flex justify-between items-start mb-8">
               <div class="text-white/80 text-xs">کارت بانکی</div>
               <UIcon name="i-heroicons-credit-card" class="w-8 h-8 text-white/50"/>
             </div>
             <div class="text-2xl font-mono tracking-widest mb-4 text-white/90">**** **** **** 1234</div>
             <div class="flex justify-between text-xs text-white/60">
               <span>دارنده کارت</span>
               <span>SHETAB</span>
             </div>
           </div>

           <div class="bg-white/10 rounded-xl p-4 mb-6 space-y-2">
            <div class="flex justify-between text-sm text-white/80">
              <span>قیمت هر بلیط:</span>
              <span class="font-mono">{{ pricePerLineRial.toLocaleString() }} تومان</span>
            </div>
            <div class="flex justify-between font-bold text-lg border-t border-white/10 pt-2">
              <span>مجموع:</span>
              <span class="text-green-300 font-mono">{{ (ticketCount * pricePerLineRial).toLocaleString() }} تومان</span>
            </div>
          </div>

          <button @click="onSubmitRial" class="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black text-lg rounded-2xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2">
            <UIcon name="i-heroicons-credit-card" class="w-6 h-6"/>
            پرداخت با کارت بانکی
          </button>
        </div>

        <!-- CRYPTO PAYMENT UI -->
        <div v-else class="animate-fade-in">
           <!-- Coin and Network Selection -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-white/80 text-xs font-bold mb-2">ارز</label>
              <USelectMenu v-model="selectedCoin" :options="coinOptions" class="w-full"
                :ui="{ 
                  background: 'bg-black/40 backdrop-blur-md', 
                  color: { white: { outline: 'text-white ring-white/20' } },
                  option: { active: 'bg-white/20' }
                }"
              >
                 <template #label>
                    <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" :class="selectedCoin.color">{{ selectedCoin.symbol }}</span>
                        {{ selectedCoin.label }}
                    </div>
                 </template>
              </USelectMenu>
            </div>
            <div>
              <label class="block text-white/80 text-xs font-bold mb-2">شبکه</label>
              <USelectMenu v-model="selectedNetwork" :options="networkOptions" class="w-full"
                 :ui="{ 
                  background: 'bg-black/40 backdrop-blur-md', 
                  color: { white: { outline: 'text-white ring-white/20' } },
                  option: { active: 'bg-white/20' }
                }"
              />
            </div>
          </div>

          <div class="bg-white/10 rounded-xl p-4 mb-6 space-y-2">
            <div class="flex justify-between text-sm text-white/80">
              <span>قیمت هر بلیط:</span>
              <span class="font-mono">{{ pricePerLine }} USDT</span>
            </div>
            <div class="flex justify-between font-bold text-lg border-t border-white/10 pt-2">
              <span>مجموع:</span>
              <span class="text-yellow-300 font-mono">{{ totalPrice }} USDT</span>
            </div>
          </div>

          <button @click="onSubmit" class="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-black text-lg rounded-2xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2">
            <UIcon name="i-heroicons-currency-dollar" class="w-6 h-6"/>
            پرداخت با تتر
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// State
const paymentMethod = ref('rial') // 'rial' | 'crypto'
const ticketCount = ref(1)
const cutoffTime = ref('چهارشنبه ۱۷:۰۰')

// Prices
const pricePerLine = 2; // USDT
const pricePerLineRial = 120000; // Tomans (Example rate)

// Computed
const totalPrice = computed(() => {
  return ticketCount.value * pricePerLine;
})

// Coin and Network selection options
const coinOptions = [
  { label: 'USDT', value: 'usdt', symbol: 'T', color: 'bg-green-500 text-white' },
  { label: 'BTC', value: 'btc', symbol: 'B', color: 'bg-orange-500 text-white' },
  { label: 'ETH', value: 'eth', symbol: 'E', color: 'bg-blue-500 text-white' }
]

const networkOptions = [
  { label: 'TRC20', value: 'trc20' },
  { label: 'ERC20', value: 'erc20' },
  { label: 'BEP20', value: 'bep20' }
]

const selectedCoin = ref(coinOptions[0])
const selectedNetwork = ref(networkOptions[0])

// Actions
const onSubmit = () => {
  alert(`پرداخت ${totalPrice.value} تتر از طریق شبکه ${selectedNetwork.value.label}`)
}

const onSubmitRial = () => {
  alert(`انتقال به درگاه پرداخت شاپرک برای مبلغ ${(ticketCount.value * pricePerLineRial).toLocaleString()} تومان`)
}

// Legacy (can be removed if we don't use manual number selection anymore)
const publicKeyEntries = ref([])
const addNewEntry = () => {}
const removeEntry = () => {}
const editEntry = () => {}
</script>

<style scoped>
/* Custom styles if needed */
</style>
