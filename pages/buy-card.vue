<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FF9966] via-[#FF5E62] to-[#FF9966] text-white font-vazir overflow-x-hidden selection:bg-yellow-400 selection:text-black" dir="rtl">
    
    <!-- Background Elements -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-500/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
    </div>

    <div class="relative container mx-auto px-4 py-6 pb-32 max-w-md">
      
      <h1 class="text-3xl font-black text-center mb-6 text-white drop-shadow-md">خرید بلیط</h1>

      <!-- Payment Method Switcher -->
      <div class="bg-white/20 backdrop-blur-md p-1 rounded-2xl flex mb-6 border border-white/30 shadow-lg">
        <button 
          @click="paymentMethod = 'rial'"
          class="flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2"
          :class="paymentMethod === 'rial' ? 'bg-white text-pink-600 shadow-md' : 'text-white/70 hover:bg-white/10'"
        >
          <UIcon name="i-heroicons-credit-card" class="w-5 h-5"/>
          پرداخت ریالی
        </button>
        <button 
          @click="paymentMethod = 'crypto'"
          class="flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2"
          :class="paymentMethod === 'crypto' ? 'bg-yellow-400 text-black shadow-md' : 'text-white/70 hover:bg-white/10'"
        >
          <UIcon name="i-heroicons-currency-dollar" class="w-5 h-5"/>
          ارز دیجیتال
        </button>
      </div>

      <div class="bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-[24px] shadow-xl transition-all duration-500 relative overflow-hidden">
        
        <!-- Cutoff Time -->
        <div class="flex justify-between items-center mb-6 text-white bg-black/10 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
          <p class="text-sm font-bold flex items-center gap-2">
            <UIcon name="i-heroicons-clock" class="w-5 h-5 text-yellow-300"/>
            زمان قرعه‌کشی:
          </p>
          <span class="font-mono dir-ltr font-bold">{{ cutoffTime }}</span>
        </div>

        <!-- Ticket Selection (Common for both) -->
        <div class="mb-6">
           <div class="flex justify-between items-center mb-2">
             <label class="text-white font-bold text-sm">تعداد بلیط</label>
             <span class="text-yellow-300 font-mono font-black text-lg drop-shadow-sm">{{ ticketCount }} عدد</span>
           </div>
           <div class="flex items-center gap-4 bg-black/10 p-2 rounded-xl border border-white/10">
             <button @click="ticketCount > 1 ? ticketCount-- : null" class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors text-white">
               <UIcon name="i-heroicons-minus" class="w-5 h-5"/>
             </button>
             <input type="range" v-model="ticketCount" min="1" max="50" class="flex-1 accent-yellow-400 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"/>
             <button @click="ticketCount++" class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors text-white">
               <UIcon name="i-heroicons-plus" class="w-5 h-5"/>
             </button>
           </div>
        </div>

        <!-- RIAL PAYMENT UI -->
        <div v-if="paymentMethod === 'rial'" class="animate-fade-in">
           <div class="bg-gradient-to-br from-gray-800 to-black p-5 rounded-2xl mb-6 border border-white/20 relative overflow-hidden shadow-lg">
             <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
             <div class="flex justify-between items-start mb-8">
               <div class="text-white/80 text-xs font-bold">کارت بانکی</div>
               <UIcon name="i-heroicons-credit-card" class="w-8 h-8 text-white/50"/>
             </div>
             <div class="text-2xl font-mono tracking-widest mb-4 text-white font-bold">**** **** **** 1234</div>
             <div class="flex justify-between text-xs text-white/60 font-bold">
               <span>دارنده کارت</span>
               <span>SHETAB</span>
             </div>
           </div>

           <div class="bg-black/10 rounded-xl p-4 mb-6 space-y-2 border border-white/10">
            <div class="flex justify-between text-sm text-white font-bold">
              <span>قیمت هر بلیط:</span>
              <span class="font-mono">{{ pricePerLineRial.toLocaleString() }} تومان</span>
            </div>
            <div class="flex justify-between font-black text-lg border-t border-white/10 pt-2">
              <span class="text-white">مجموع:</span>
              <span class="text-green-300 font-mono drop-shadow-sm">{{ (ticketCount * pricePerLineRial).toLocaleString() }} تومان</span>
            </div>
          </div>

          <button @click="onSubmitRial" class="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black text-lg rounded-2xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/20">
            <UIcon name="i-heroicons-credit-card" class="w-6 h-6"/>
            پرداخت با کارت بانکی
          </button>
        </div>

        <!-- CRYPTO PAYMENT UI -->
        <div v-else class="animate-fade-in">
           <!-- Coin and Network Selection -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-white text-xs font-bold mb-2">ارز</label>
              <USelectMenu v-model="selectedCoin" :options="coinOptions" class="w-full"
                :ui="{ 
                  background: 'bg-black/60 backdrop-blur-xl', 
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
              <label class="block text-white text-xs font-bold mb-2">شبکه</label>
              <USelectMenu v-model="selectedNetwork" :options="networkOptions" class="w-full"
                 :ui="{ 
                  background: 'bg-black/60 backdrop-blur-xl', 
                  color: { white: { outline: 'text-white ring-white/20' } },
                  option: { active: 'bg-white/20' }
                }"
              />
            </div>
          </div>

          <div class="bg-black/10 rounded-xl p-4 mb-6 space-y-2 border border-white/10">
            <div class="flex justify-between text-sm text-white font-bold">
              <span>قیمت هر بلیط:</span>
              <span class="font-mono">{{ pricePerLine }} USDT</span>
            </div>
            <div class="flex justify-between font-black text-lg border-t border-white/10 pt-2">
              <span class="text-white">مجموع:</span>
              <span class="text-yellow-300 font-mono drop-shadow-sm">{{ totalPrice }} USDT</span>
            </div>
          </div>

          <button @click="onSubmit" class="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-black text-lg rounded-2xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/20">
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
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

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
const onSubmit = async () => {
  if (!auth.token) return

  try {
    alert(`پرداخت ${totalPrice.value} تتر از طریق شبکه ${selectedNetwork.value.label}`)
  } catch (e) {
    console.error(e)
  }
}

const onSubmitRial = () => {
  alert(`انتقال به درگاه پرداخت شاپرک برای مبلغ ${(ticketCount.value * pricePerLineRial).toLocaleString()} تومان`)
}
</script>

<style scoped>
.animate-pulse-slow {
    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
