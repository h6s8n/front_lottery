<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FF9966] via-[#FF5E62] to-[#FF9966] text-white font-vazir overflow-x-hidden selection:bg-yellow-400 selection:text-black" dir="rtl">
    
    <!-- Background Elements -->
    <AppLoading v-if="isLoading || lotteryLoading || ticketsLoading" />
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-500/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
      
      <!-- Floating Particles -->
      <div class="absolute top-[20%] left-[20%] w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
      <div class="absolute top-[60%] right-[20%] w-3 h-3 bg-yellow-300/40 rounded-full animate-bounce delay-500"></div>
      <div class="absolute bottom-[10%] left-[40%] w-2 h-2 bg-pink-400/40 rounded-full animate-pulse delay-1000"></div>
    </div>

    <div class="relative container mx-auto px-4 py-6 pb-32 max-w-md">
      
      <!-- Header Stats -->
      <div class="grid grid-cols-2 gap-3 mb-6">
        <!-- Tickets Card -->
        <div class="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/30 shadow-lg flex items-center justify-between group hover:bg-white/25 transition-all duration-300">
          <div class="flex flex-col">
             <span class="text-xs text-white/80 font-bold mb-1">بلیط‌های من</span>
             <span class="text-2xl font-black text-white drop-shadow-md group-hover:scale-110 transition-transform origin-right">{{ formatNumber(tickets) }}</span>
          </div>
          <div class="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-xl flex items-center justify-center shadow-inner rotate-3 group-hover:rotate-12 transition-transform">
            <span class="text-xl">🎟️</span>
          </div>
        </div>

        <!-- Level Card -->
        <div class="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/30 shadow-lg flex items-center justify-between group hover:bg-white/25 transition-all duration-300">
          <div class="flex flex-col">
             <span class="text-xs text-white/80 font-bold mb-1">لول {{ formatNumber(level) }}</span>
             <span class="text-xs font-black text-white drop-shadow-md">{{ levelTitle }}</span>
          </div>
          <div class="relative w-10 h-10 flex items-center justify-center">
             <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path class="text-white/20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="4" />
                <path class="text-yellow-300 drop-shadow-[0_0_5px_rgba(253,224,71,0.8)]" :stroke-dasharray="`${levelProgress}, 100`" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="4" />
             </svg>
             <span class="absolute text-[10px] font-bold text-white">{{ formatNumber(levelProgress) }}%</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex flex-col items-center justify-center mb-8 relative z-10">
        
        <!-- Points Display -->
        <div class="mb-8 text-center relative">
           <div class="absolute -inset-4 bg-white/10 blur-xl rounded-full animate-pulse-slow"></div>
           <h1 class="text-5xl font-black text-white drop-shadow-lg tracking-tight relative z-10 flex items-center justify-center gap-3">
             <div class="w-16 h-16 relative flex items-center justify-center rounded-full overflow-hidden border-2 border-yellow-400/60 shadow-lg bg-transparent group">
               <div class="absolute inset-0 bg-yellow-400/10 blur-md rounded-full group-hover:bg-yellow-400/30 transition-colors"></div>
               <img src="/coin.png" alt="Coin" class="w-full h-full object-cover filter brightness-110 transform scale-[1.45]" />
             </div>
             {{ formatNumber(points) }}
           </h1>
           <p class="text-white/80 text-sm font-bold mt-2 bg-white/10 px-3 py-1 rounded-full inline-block backdrop-blur-sm border border-white/10">موجودی شما</p>
        </div>

        <!-- Mascot Clicker -->
        <div class="relative w-72 h-72 mb-8 group cursor-pointer select-none touch-manipulation" @click="handleMascotClick">
           <!-- Glow Effect -->
           <div class="absolute inset-0 bg-gradient-to-tr from-yellow-300/30 to-pink-500/30 rounded-full blur-3xl group-hover:blur-[40px] transition-all duration-500 opacity-60 animate-pulse-slow"></div>
           
           <!-- Mascot Image -->
           <div class="relative w-full h-full transition-transform duration-100 ease-out active:scale-95 active:rotate-2 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl" :class="{'scale-95': isClicking}">
             <img src="/mascot.png" alt="Mascot" class="w-full h-full object-cover drop-shadow-2xl filter brightness-110" draggable="false" />
           </div>

           <!-- Floating Numbers -->
           <TransitionGroup name="float-up">
             <div 
               v-for="click in clicks" 
               :key="click.id"
               class="absolute text-2xl font-black text-white pointer-events-none z-50 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
               :style="{ left: click.x + 'px', top: click.y + 'px' }"
             >
               +{{ formatNumber(clickAmount) }}
             </div>
           </TransitionGroup>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-4 w-full mb-8">
           <button 
             @click="isConvertModalOpen = true"
             class="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-black py-4 rounded-2xl shadow-lg transform transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 border-yellow-600"
           >
             <UIcon name="i-heroicons-arrow-path" class="w-6 h-6" />
             <span>تبدیل امتیاز</span>
           </button>
           
           <button 
             @click="shareOnTelegram"
             class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-black py-4 rounded-2xl shadow-lg transform transition-all active:scale-95 flex items-center justify-center gap-2 border-b-4 border-blue-700"
           >
             <UIcon name="i-heroicons-user-plus" class="w-6 h-6" />
             <span>دعوت دوستان</span>
           </button>
        </div>

        <!-- Energy Bar -->
        <div class="w-full bg-black/20 backdrop-blur-md rounded-2xl p-1.5 border border-white/10 shadow-inner">
           <div class="flex justify-between text-xs font-bold text-white mb-1 px-2">
             <span class="flex items-center gap-1">
               <UIcon name="i-heroicons-bolt" class="w-3 h-3 text-yellow-300" />
               انرژی
             </span>
             <span>{{ formatNumber(energy) }} / {{ formatNumber(maxEnergy) }}</span>
           </div>
           <div class="w-full h-3 bg-black/30 rounded-full overflow-hidden shadow-inner">
             <div 
               class="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(253,224,71,0.5)]"
               :style="{ width: (energy / maxEnergy * 100) + '%' }"
             ></div>
           </div>
        </div>

      </div>

      <!-- My Tickets Section (Bottom Sheet Style) -->
      <div v-if="myTickets.length > 0" class="bg-white/10 backdrop-blur-xl border-t border-white/20 rounded-t-[30px] p-6 -mx-4 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] animate-fade-in-up">
         <div class="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6"></div>
         
         <div class="flex justify-between items-end mb-4">
           <div>
              <h3 class="text-xl font-black text-white mb-1 drop-shadow-md">آخرین بلیط شما</h3>
              <p class="text-xs text-white/80 font-medium">شماره‌های شانس ثبت شده برای قرعه‌کشی</p>
           </div>
           <div class="text-right">
              <p class="text-[10px] text-white/60 font-bold mb-0.5">زمان قرعه‌کشی</p>
              <p class="text-sm font-mono text-yellow-300 font-black bg-black/20 px-2 py-1 rounded-lg dir-ltr">{{ countdown }}</p>
           </div>
         </div>

         <!-- Balls Display (Glassy Container) -->
         <div class="flex items-center justify-center gap-3 mb-6 w-full px-2 py-4 bg-black/10 rounded-2xl border border-white/5 shadow-inner">
            <div 
              v-for="(num, idx) in myTickets[0].numbers.white" 
              :key="idx"
              class="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-lg border border-white/30 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]"
            >
              {{ toPersianDigits(num) }}
            </div>
            
            <!-- Separator -->
            <div class="w-px h-8 bg-white/30 mx-1"></div>
            
            <div class="w-11 h-11 rounded-full bg-gradient-to-br from-[#FF4B4B] to-[#FF0000] flex items-center justify-center text-white font-black text-lg shadow-[0_0_20px_rgba(255,75,75,0.5)] border border-white/30">
              {{ toPersianDigits(myTickets[0].numbers.red) }}
            </div>
         </div>

         <!-- Button (No Modal) -->
         <button 
           class="w-full py-4 bg-white/20 hover:bg-white/30 text-white font-bold text-sm rounded-2xl shadow-lg border border-white/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
         >
           <span>مشاهده همه بلیط‌ها</span>
           <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
         </button>
      </div>
      
      <!-- Empty State for Tickets -->
      <div v-else class="bg-white/10 backdrop-blur-xl border-t border-white/20 rounded-t-[30px] p-8 -mx-4 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] text-center animate-fade-in-up">
          <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <span class="text-3xl">🎫</span>
          </div>
          <h3 class="text-lg font-black text-white mb-2">هنوز بلیطی ندارید!</h3>
          <p class="text-sm text-white/70 mb-6">همین الان امتیازات رو تبدیل کن و شانست رو امتحان کن</p>
          <button 
             @click="isConvertModalOpen = true"
             class="w-full py-3 bg-yellow-400 text-black font-black rounded-xl shadow-lg active:scale-95 transition-transform"
           >
             خرید اولین بلیط
           </button>
      </div>

    <!-- Convert Modal -->
    <UModal v-model="isConvertModalOpen" :ui="{ 
      background: 'bg-transparent', 
      overlay: { background: 'bg-black/80 backdrop-blur-sm' },
      padding: 'p-4'
    }">
      <div class="bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] rounded-[30px] p-6 border border-white/10 shadow-2xl relative overflow-hidden">
        <!-- Background Glow -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="text-center mb-6 relative z-10">
          <div class="w-16 h-16 bg-yellow-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-yellow-400/30">
            <UIcon name="i-heroicons-ticket" class="w-8 h-8 text-yellow-400" />
          </div>
          <h3 class="text-xl font-black text-white mb-1">تبدیل امتیاز به بلیط</h3>
          <p class="text-xs text-gray-400">هر ۱۰۰۰ امتیاز = ۱ بلیط شانس</p>
        </div>

        <div class="bg-black/30 rounded-2xl p-4 mb-6 border border-white/5">
          <div class="flex justify-between items-center mb-4">
            <span class="text-gray-300 text-sm font-bold">تعداد بلیط</span>
            <span class="text-yellow-400 font-black text-xl">{{ formatNumber(convertAmount) }}</span>
          </div>
          
          <div class="flex items-center gap-3">
            <button 
              @click="convertAmount > 1 ? convertAmount-- : null"
              class="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <UIcon name="i-heroicons-minus" class="w-5 h-5" />
            </button>
            
            <input 
              type="range" 
              v-model="convertAmount" 
              min="1" 
              max="50" 
              class="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-400"
            />
            
            <button 
              @click="convertAmount++"
              class="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <UIcon name="i-heroicons-plus" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between text-xs text-gray-400 px-2">
            <span>هزینه کل:</span>
            <span class="text-white font-bold">{{ formatNumber(convertAmount * 1000) }} امتیاز</span>
          </div>
          
          <button 
            @click="convertPoints" 
            :disabled="points < convertAmount * 1000"
            class="w-full py-4 rounded-2xl bg-yellow-400 text-black font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:bg-yellow-300 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span v-if="points >= convertAmount * 1000">تایید و تبدیل</span>
            <span v-else>موجودی کافی نیست</span>
          </button>
          
          <button 
            @click="isConvertModalOpen = false"
            class="w-full py-3 rounded-2xl bg-white/5 text-white/60 font-bold text-xs hover:bg-white/10 transition-colors"
          >
            انصراف
          </button>
        </div>
      </div>
    </UModal>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '~/stores/auth'
import { useReferral } from '~/composables/useReferral'
import { formatNumber, toPersianDigits } from '~/utils/format'

definePageMeta({
  middleware: 'auth'
})

const auth = useAuthStore()
const { shareOnTelegram } = useReferral()
const config = useRuntimeConfig()
const router = useRouter()

// State
const points = ref(0)
const tickets = ref(0)
const level = ref(1)
const energy = ref(1000)
const maxEnergy = ref(1000)
const clickAmount = ref(1)
const isClicking = ref(false)
const clicks = ref([])
const isConvertModalOpen = ref(false)
const isTicketsModalOpen = ref(false)
const convertAmount = ref(1)

// Lottery State
const currentLottery = ref(null)
const countdown = ref('00:00:00')
let countdownInterval = null
const myTickets = ref([])

// Computed properties
const levelTitle = computed(() => {
  const titles = ['مبتدی', 'برنزی', 'نقره‌ای', 'طلایی', 'الماسی', 'افسانه‌ای']
  return titles[Math.min(level.value - 1, titles.length - 1)] || 'مبتدی'
})

const levelProgress = computed(() => {
  // Simple progress calculation: (points % 1000) / 10
  return Math.min(Math.floor((points.value % 1000) / 10), 100)
})

// --- Functions ---

const startCountdown = () => {
  if (import.meta.server) return
  if (!currentLottery.value) return
  
  // Clear existing interval if any to prevent duplicates
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

// Click Sync Logic
let pendingClicks = 0
let syncTimeout = null

const syncClicks = async () => {
  if (pendingClicks === 0) return

  const clicksToSend = pendingClicks
  pendingClicks = 0 // Reset immediately to avoid double sending

  try {
    await axios.post(`${config.public.apiBase}/clicker/sync`, {
      points: clicksToSend
    }, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
  } catch (error) {
    console.error('Failed to sync clicks:', error)
  }
}

const handleMascotClick = (event) => {
  if (energy.value <= 0) return

  // Decrease energy
  energy.value = Math.max(0, energy.value - 1)

  // Add points locally
  points.value += clickAmount.value
  
  // Add to pending clicks
  pendingClicks++

  // Batch Sync: Send every 10 clicks
  if (pendingClicks >= 10) {
    syncClicks()
  }

  // Visual feedback
  isClicking.value = true
  setTimeout(() => {
    isClicking.value = false
  }, 100)
  
  // Floating number animation
  const rect = event.target.getBoundingClientRect()
  const x = event.clientX - rect.left - 20
  const y = event.clientY - rect.top - 20
  
  const clickId = Date.now()
  clicks.value.push({ id: clickId, x, y })
  
  setTimeout(() => {
    clicks.value = clicks.value.filter(c => c.id !== clickId)
  }, 800)
}

// --- Data Fetching ---

// 1. Fetch User Data
const { data: userData, pending: isLoading, refresh } = await useFetch(`${config.public.apiBase}/user/tickets`, {
  headers: { Authorization: `Bearer ${auth.token}` },
  immediate: !!auth.token,
  watch: [() => auth.token],
  lazy: true
})

watch(userData, (newData) => {
  console.log('🔍 userData received:', newData)
  const actualData = newData?.data || newData
  console.log('📦 Actual data:', actualData)
  
  if (actualData) {
    points.value = actualData.points || 0
    tickets.value = actualData.tickets || 0
    level.value = actualData.level || 1
    console.log('✅ Updated - Points:', points.value, 'Tickets:', tickets.value, 'Level:', level.value)
  } else {
    console.log('❌ userData is null/undefined')
  }
}, { immediate: true })

// 2. Fetch Lottery Data
const { data: lotteryData, pending: lotteryLoading } = await useAsyncData('lottery', () => 
  $fetch(`${config.public.apiBase}/lottery/current`, {
    headers: { Authorization: `Bearer ${auth.token}` }
  }), {
    lazy: true,
    immediate: !!auth.token,
    watch: [() => auth.token]
  }
)

watch(lotteryData, (newData) => {
  if (newData) {
    const actualData = newData.data || newData
    currentLottery.value = actualData
    startCountdown()
  }
}, { immediate: true })

// 3. Fetch My Tickets
const { data: ticketsData, pending: ticketsLoading } = await useAsyncData('my-tickets', () => 
  $fetch(`${config.public.apiBase}/tickets/my-tickets`, {
    headers: { Authorization: `Bearer ${auth.token}` }
  }), {
    lazy: true,
    immediate: !!auth.token,
    watch: [() => auth.token]
  }
)

watch(ticketsData, (newData) => {
  if (newData) {
    myTickets.value = newData
  }
}, { immediate: true })


// Update convertPoints to refresh tickets
const convertPoints = async () => {
  if (!auth.token) return
  
  try {
    const res = await axios.post(`${config.public.apiBase}/points/convert`, {
      tickets_quantity: convertAmount.value
    }, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    
    points.value = res.data.points
    tickets.value = res.data.tickets
    isConvertModalOpen.value = false
    
    alert('تبدیل با موفقیت انجام شد!')
    refresh() 
    // Refresh tickets list manually or trigger re-fetch
    // Since we use useAsyncData, we can refresh it if we had the refresh function exposed
    // But for now, let's just reload page or rely on reactivity if we update the key
    // A better way is to destructure refresh from useAsyncData for tickets too.
    // For simplicity, I'll just re-fetch manually here or let the user refresh.
    // Or better:
    window.location.reload() // Simple fix for now to ensure everything syncs
  } catch (error) {
    console.error('Conversion failed:', error)
    if (error.response && error.response.status === 403 && error.response.data.code === 'REQUIRE_INVITE') {
      alert('برای دریافت اولین تیکت، باید حداقل یک نفر را دعوت کنید!')
    } else {
      alert(error.response?.data?.message || 'خطا در تبدیل امتیاز')
    }
  }
}
</script>

<style scoped>
.animate-pulse-slow {
    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-500 {
  animation-delay: 500ms;
}

.delay-1000 {
  animation-delay: 1000ms;
}

.float-up-enter-active {
  transition: all 0.8s ease-out;
}
.float-up-enter-from {
  opacity: 1;
  transform: translateY(0) scale(0.5);
}
.float-up-leave-to {
  opacity: 0;
  transform: translateY(-100px) scale(1.5);
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>