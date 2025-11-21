<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FF9966] via-[#FF5E62] to-[#FF9966] text-white font-vazir overflow-x-hidden selection:bg-yellow-400 selection:text-black pb-24">
    
    <AppLoading v-if="isLoading" />

    <!-- Background Elements -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/20 rounded-full blur-[100px] animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-yellow-300/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
    </div>

    <div class="relative container mx-auto px-4 py-6 max-w-md">
      
      <div class="text-center mb-8">
        <div class="inline-block p-1 rounded-full bg-white/30 backdrop-blur-sm mb-4 shadow-lg border border-white/20">
          <div class="bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full p-4 w-20 h-20 flex items-center justify-center shadow-inner">
            <span class="text-5xl filter drop-shadow-md">🏆</span>
          </div>
        </div>
        <h1 class="text-3xl font-black text-white drop-shadow-md mb-2">نتایج قرعه‌کشی</h1>
        <p class="text-white/90 text-sm font-bold">لیست برندگان خوش‌شانس!</p>
      </div>

      <!-- Active Lottery Status -->
      <div v-if="currentLottery" class="mb-8 animate-fade-in-up">
        <div class="bg-white/20 backdrop-blur-md border border-white/30 rounded-[24px] p-6 shadow-xl relative overflow-hidden text-center">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"></div>
          
          <h2 class="text-xl font-black text-white mb-2 drop-shadow-md">قرعه‌کشی بعدی</h2>
          
          <div class="text-4xl font-black text-yellow-300 drop-shadow-lg mb-4 font-mono dir-ltr tracking-wider">
            {{ countdown }}
          </div>

          <div class="flex justify-center gap-4 text-sm font-bold text-white/80">
            <div class="bg-black/20 px-3 py-1.5 rounded-lg">
              <span>جایزه: </span>
              <span class="text-yellow-300">{{ formatNumber(currentLottery.prize_pool || 0) }}</span>
            </div>
            <div class="bg-black/20 px-3 py-1.5 rounded-lg">
              <span>شرکت‌کنندگان: </span>
              <span class="text-white">{{ formatNumber(currentLottery.participants_count || 0) }}</span>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-white/10">
            <p class="text-xs text-white/70">هنوز فرصت دارید! همین الان بلیط بخرید.</p>
          </div>
        </div>
      </div>

      <!-- History List -->
      <div v-if="history && history.length > 0" class="space-y-4">
        <h3 class="font-bold text-white/90 px-2 border-r-4 border-yellow-400 pr-3">برندگان قبلی</h3>
        
        <div v-for="(lottery, index) in history" :key="lottery.id" 
             class="bg-white/10 backdrop-blur-md border border-white/20 rounded-[24px] p-5 shadow-lg relative overflow-hidden group hover:bg-white/20 transition-all duration-300">
          
          <!-- Winner Badge -->
          <div class="absolute top-0 left-0 bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-br-xl shadow-sm z-10">
            #{{ lottery.id }}
          </div>

          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white/30">
              👑
            </div>
            <div>
              <p class="text-[10px] text-white/60 font-bold mb-0.5">برنده خوش‌شانس</p>
              <h3 class="font-black text-base text-white drop-shadow-sm">
                {{ lottery.winner ? `${lottery.winner.first_name} ${lottery.winner.last_name}` : 'هنوز مشخص نشده' }}
              </h3>
              <p class="text-[10px] text-yellow-300 font-mono dir-ltr" v-if="lottery.winner">@{{ lottery.winner.username }}</p>
            </div>
          </div>

          <div class="bg-black/10 rounded-xl p-3 flex justify-between items-center border border-white/5">
            <div>
              <p class="text-[10px] text-white/50 font-bold mb-0.5">مبلغ جایزه</p>
              <p class="font-black text-white text-sm">{{ formatNumber(lottery.prize_pool) }} <span class="text-[10px] text-white/50">تومان</span></p>
            </div>
            <div class="text-left">
              <p class="text-[10px] text-white/50 font-bold mb-0.5">تاریخ قرعه‌کشی</p>
              <p class="font-bold text-white/80 text-xs dir-ltr">{{ new Date(lottery.draw_time).toLocaleDateString('fa-IR') }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!isLoading && !currentLottery" class="text-center py-12 opacity-80">
        <div class="bg-white/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-inner">
          <span class="text-4xl grayscale">📭</span>
        </div>
        <p class="text-white font-bold text-lg">هنوز قرعه‌کشی انجام نشده!</p>
      </div>

      <button @click="router.push('/')" class="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl border border-white/10 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2">
        <UIcon name="i-heroicons-home" class="w-5 h-5" />
        <span>بازگشت به خانه</span>
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { formatNumber } from '~/utils/format'

const router = useRouter()
const auth = useAuthStore()
const config = useRuntimeConfig()

definePageMeta({
  middleware: 'auth'
})

// State
const countdown = ref('00:00:00')
let countdownInterval = null

// Data Fetching
const { data: pageData, pending: isLoading } = await useAsyncData('results-page', async () => {
  if (!auth.token) return null
  
  const [currentRes, historyRes] = await Promise.all([
    $fetch(`${config.public.apiBase}/lottery/current`, { 
      headers: { Authorization: `Bearer ${auth.token}` } 
    }).catch(() => null), // Handle 404 if no active lottery
    $fetch(`${config.public.apiBase}/lottery/history`, { 
      headers: { Authorization: `Bearer ${auth.token}` } 
    }).catch(() => [])
  ])

  return {
    current: (currentRes && (currentRes.data || currentRes)) || null,
    history: (historyRes && (historyRes.data || historyRes)) || []
  }
}, {
  lazy: true,
  immediate: !!auth.token,
  watch: [() => auth.token]
})

const currentLottery = computed(() => pageData.value?.current)
const history = computed(() => pageData.value?.history || [])

// Countdown Logic
const startCountdown = () => {
  if (import.meta.server) return
  if (!currentLottery.value) return
  
  if (countdownInterval) clearInterval(countdownInterval)
  
  const updateTimer = () => {
    const now = new Date().getTime()
    const drawTime = new Date(currentLottery.value.draw_time).getTime()
    const distance = drawTime - now

    if (distance < 0) {
      countdown.value = 'در حال قرعه‌کشی...'
      clearInterval(countdownInterval)
      return
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)

    countdown.value = `${days}d ${hours}h ${minutes}m ${seconds}s`
  }

  updateTimer()
  countdownInterval = setInterval(updateTimer, 1000)
}

// Watch for data to start countdown
watch(currentLottery, (newVal) => {
  if (newVal) {
    startCountdown()
  }
}, { immediate: true })

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
