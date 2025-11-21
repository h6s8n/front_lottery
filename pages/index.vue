<template>

  <div class="h-screen bg-gradient-to-br from-[#FF6B6B] via-[#FF8E8E] to-[#FFB6B6] text-white font-sans relative overflow-hidden select-none selection:bg-yellow-400 selection:text-black flex flex-col">
    <!-- Background Elements -->
    <AppLoading v-if="isLoading" />
    <div class="fixed inset-0 z-0 pointer-events-none">
      <!-- Simplified gradient orbs -->
      <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white/20 rounded-full blur-[100px] animate-pulse"></div>
      <div class="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-yellow-300/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
    </div>

    <!-- Header Stats (HUD Style) -->
    <div class="relative z-20 px-4 pt-4 shrink-0">
      
      <!-- Header Stats -->
      <div class="flex justify-between items-center mb-2">
        <div class="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl px-3 py-1.5 flex items-center gap-2 shadow-lg">
          <div class="w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-base shadow-lg">🎟️</div>
          <div>
            <p class="text-[9px] text-white/90 font-bold">تیکت‌های شما</p>
            <p class="font-black text-base text-white drop-shadow-lg">{{ tickets }}</p>
          </div>
        </div>
        
        <div class="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl px-3 py-1.5 flex items-center gap-2 shadow-lg">
          <div class="w-7 h-7 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-base shadow-lg">🏆</div>
          <div>
            <p class="text-[9px] text-white/90 font-bold">لول {{ level }}</p>
            <p class="font-black text-base text-white drop-shadow-lg">{{ levelTitle }}</p>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="flex flex-col items-center justify-center relative w-full">
        <div class="flex justify-between text-[10px] text-white/90 font-bold mb-1 w-full">
          <span>پیشرفت سطح</span>
          <span>{{ levelProgress }}%</span>
        </div>
        <div class="h-2.5 bg-black/10 rounded-full overflow-hidden border border-white/30 backdrop-blur-sm w-full">
          <div 
            class="h-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 transition-all duration-500 ease-out relative shadow-[0_0_15px_rgba(253,224,71,0.6)]"
            :style="{ width: `${levelProgress}%` }"
          >
            <div class="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 flex flex-col items-center justify-start flex-1 min-h-0 pt-2 overflow-y-auto">
      
      <!-- Points Display (Main Counter) -->
      <div class="flex flex-col items-center mb-3 shrink-0">
        <div class="flex items-center gap-2">
          <span class="text-3xl filter drop-shadow-md">🪙</span>
          <span class="text-4xl font-black tracking-tighter text-white drop-shadow-lg font-mono">
            {{ formatNumber(points) }}
          </span>
        </div>
        <span class="text-white/90 font-bold mt-1 tracking-widest uppercase text-[9px] bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/20">موجودی سکه</span>
      </div>

      <!-- Mascot (Click Area) -->
      <div class="relative w-[55vw] h-[55vw] max-w-[220px] max-h-[220px] flex items-center justify-center mb-3 select-none touch-none shrink-0">
        <!-- Simplified Glow -->
        <div 
          class="absolute inset-0 rounded-full transition-all duration-200"
          :class="{ 'scale-95': isClicking }"
          style="box-shadow: 0 0 40px rgba(255, 255, 255, 0.6); border: 4px solid rgba(255, 255, 255, 0.4);"
        ></div>

        <!-- Mascot Image -->
        <div 
          class="relative w-full h-full rounded-full overflow-hidden cursor-pointer active:scale-95 transition-transform duration-100 z-20"
          @click="handleMascotClick"
        >
          <img 
            src="/mascot.png" 
            alt="Mascot" 
            class="w-full h-full object-cover"
            draggable="false"
          />
          
          <!-- Click Ripple Effect -->
          <div v-if="isClicking" class="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
        </div>

        <!-- Floating Numbers Container -->
        <div class="absolute inset-0 pointer-events-none z-30 overflow-visible">
          <TransitionGroup name="float-up">
            <div
              v-for="click in clicks"
              :key="click.id"
              class="absolute text-2xl font-black text-yellow-300 drop-shadow-lg"
              :style="{ left: click.x + 'px', top: click.y + 'px' }"
            >
              +{{ clickAmount }}
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Action Buttons Grid -->
      <div class="w-full px-4 grid grid-cols-2 gap-2 mb-3 shrink-0">
        <!-- Invite Button -->
        <button 
          @click="shareOnTelegram"
          class="bg-white/20 backdrop-blur-xl p-2.5 rounded-xl border border-white/40 active:scale-95 transition-all hover:bg-white/30 shadow-lg"
        >
          <div class="flex flex-col items-center gap-1">
            <div class="bg-blue-500/20 p-1.5 rounded-lg">
              <UIcon name="i-heroicons-users" class="w-5 h-5 text-white" />
            </div>
            <span class="font-bold text-[10px] text-white">دعوت دوستان</span>
          </div>
        </button>

        <!-- Convert Button -->
        <button 
          @click="isConvertModalOpen = true"
          class="bg-white/20 backdrop-blur-xl p-2.5 rounded-xl border border-white/40 active:scale-95 transition-all hover:bg-white/30 shadow-lg"
        >
          <div class="flex flex-col items-center gap-1">
            <div class="bg-purple-500/20 p-1.5 rounded-lg">
              <UIcon name="i-heroicons-ticket" class="w-5 h-5 text-white" />
            </div>
            <span class="font-bold text-[10px] text-white">تبدیل سکه</span>
          </div>
        </button>
      </div>

      <!-- My Tickets (Glass Bottom Sheet Style - Pink Theme) -->
      <div class="w-full mt-auto shrink-0 z-20" v-if="myTickets.length > 0">
        <div class="bg-gradient-to-b from-white/30 to-white/10 backdrop-blur-2xl rounded-t-[35px] p-6 pb-8 flex flex-col items-center text-center border-t border-white/40 shadow-[0_-10px_50px_rgba(255,107,107,0.3)] relative overflow-hidden">
          
          <!-- Decorative Background Elements -->
          <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>

          <!-- Handle -->
          <div class="w-12 h-1 bg-white/40 rounded-full mb-6"></div>

          <!-- Icon -->
          <div class="mb-4 relative">
            <div class="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl border border-white/30 shadow-lg transform rotate-6 group-hover:rotate-12 transition-transform duration-500">
              <span class="transform -rotate-6 drop-shadow-lg">🎫</span>
            </div>
          </div>

          <!-- Title -->
          <h3 class="text-xl font-black text-white mb-1 drop-shadow-md">آخرین بلیط شما</h3>
          <p class="text-xs text-white/80 mb-6 font-medium">شماره‌های شانس ثبت شده برای قرعه‌کشی</p>

          <!-- Balls Display (Glassy Container) -->
          <div class="flex items-center justify-center gap-3 mb-8 w-full px-2">
             <div 
               v-for="(num, idx) in myTickets[0].numbers.white" 
               :key="idx"
               class="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-lg border border-white/30 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]"
             >
               {{ num }}
             </div>
             
             <!-- Separator -->
             <div class="w-px h-8 bg-white/30 mx-1"></div>
             
             <div class="w-11 h-11 rounded-full bg-gradient-to-br from-[#FF4B4B] to-[#FF0000] flex items-center justify-center text-white font-black text-lg shadow-[0_0_20px_rgba(255,75,75,0.5)] border border-white/30">
               {{ myTickets[0].numbers.red }}
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
      </div>

      <!-- All Tickets Modal -->
      <UModal v-model="isTicketsModalOpen">
        <div class="p-5 bg-[#1a1a2e] border border-white/10 rounded-2xl">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-white">بلیط‌های من</h3>
            <button @click="isTicketsModalOpen = false" class="text-gray-400 hover:text-white">
              <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
            </button>
          </div>
          
          <div class="flex flex-col gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
            <TicketCard 
              v-for="ticket in myTickets" 
              :key="ticket.id" 
              :ticket="ticket"
            />
          </div>
        </div>
      </UModal>

      
      <!-- Energy Bar -->
      <div class="w-full px-4 mb-4 shrink-0">
        <div class="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-xl rounded-2xl p-1.5 border border-orange-400/30 flex items-center justify-between pr-3 pl-1.5 h-12">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <span class="text-base">⚡</span>
            </div>
            <div class="flex flex-col">
              <span class="text-[8px] text-orange-200 font-bold uppercase">انرژی</span>
              <div class="flex items-baseline gap-1">
                <span class="text-sm font-black text-white font-mono">{{ energy }}</span>
                <span class="text-[8px] text-gray-400 font-mono">/ {{ maxEnergy }}</span>
              </div>
            </div>
          </div>
          
          <button class="h-8 px-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[10px] font-black rounded-xl transition-all flex items-center gap-1 active:scale-95">
            <UIcon name="i-heroicons-bolt" class="w-3 h-3" />
            <span>شارژ</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Convert Modal -->
    <UModal v-model="isConvertModalOpen">
      <div class="p-6 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-3xl border border-white/20 shadow-2xl">
        <h3 class="text-xl font-black mb-4 text-center text-white drop-shadow-md">تبدیل سکه به بلیط</h3>
        <p class="text-white/80 text-center mb-6 text-sm font-bold">
          هر ۱۰۰ سکه = ۱ بلیط لاتاری
        </p>
        
        <div class="flex justify-center items-center gap-4 mb-6">
          <button @click="convertAmount > 1 ? convertAmount-- : null" class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold hover:bg-white/30 transition-colors">-</button>
          <span class="text-3xl font-mono font-black w-20 text-center drop-shadow-sm">{{ convertAmount }}</span>
          <button @click="convertAmount++" class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold hover:bg-white/30 transition-colors">+</button>
        </div>

        <div class="bg-black/20 p-4 rounded-2xl mb-6 flex justify-between items-center text-sm border border-white/10">
          <span class="text-white/80 font-bold">هزینه کل:</span>
          <div class="flex items-center gap-1">
            <span class="font-black text-yellow-300 text-lg">{{ formatNumber(convertAmount * 100) }}</span>
            <span>🪙</span>
          </div>
        </div>

        <div class="flex gap-3">
          <button @click="isConvertModalOpen = false" class="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-colors">انصراف</button>
          <button 
            @click="convertPoints" 
            :disabled="points < convertAmount * 1000"
            class="flex-1 py-3 rounded-xl bg-yellow-400 text-black font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:bg-yellow-300 transition-colors"
          >
            تبدیل کن
          </button>
        </div>
      </div>
    </UModal>




    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '~/stores/auth'
import { useReferral } from '~/composables/useReferral'

definePageMeta({
  middleware: 'auth'
})

const auth = useAuthStore()
const { shareOnTelegram } = useReferral()
const config = useRuntimeConfig()

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
const router = useRouter()

// Lottery State
const currentLottery = ref(null)
const countdown = ref('00:00:00')
let countdownInterval = null

// Computed properties
const levelTitle = computed(() => {
  const titles = ['مبتدی', 'برنزی', 'نقره‌ای', 'طلایی', 'الماسی', 'افسانه‌ای']
  return titles[Math.min(level.value - 1, titles.length - 1)] || 'مبتدی'
})

const levelProgress = computed(() => {
  // Simple progress calculation: (points % 1000) / 10
  return Math.min(Math.floor((points.value % 1000) / 10), 100)
})

// Fetch Lottery Data
const fetchLottery = async () => {
  try {
    const res = await axios.get(`${config.public.apiBase}/lottery/current`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    currentLottery.value = res.data
    startCountdown()
  } catch (e) {
    console.error('Error fetching lottery:', e)
  }
}

const startCountdown = () => {
  if (!currentLottery.value) return
  
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

// Data Fetching
const { data: userData, pending: isLoading, refresh } = await useFetch(`${config.public.apiBase}/user/tickets`, {
  headers: { Authorization: `Bearer ${auth.token}` },
  immediate: !!auth.token,
  watch: [() => auth.token]
})

// Watch userData and update local state
watch(userData, (newData) => {
  console.log('🔍 userData received:', newData)
  // useFetch returns {data: actualData}, so we need to access .data
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

const myTickets = ref([])

const fetchMyTickets = async () => {
  if (!auth.token) return
  try {
    const res = await axios.get(`${config.public.apiBase}/tickets/my-tickets`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    myTickets.value = res.data
  } catch (e) {
    console.error('Error fetching tickets:', e)
  }
}

// Handle mascot click
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
    // Optional: You can update points from server response if needed
    // const res = await ...
    // points.value = res.data.points
  } catch (error) {
    console.error('Failed to sync clicks:', error)
    // Rollback points if sync fails (optional, but good UX)
    // points.value -= clicksToSend * clickAmount.value
    // pendingClicks += clicksToSend // Retry later?
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

onMounted(async () => {
  if (auth.token) {
    await Promise.all([
      refresh(),
      fetchLottery(),
      fetchMyTickets()
    ])
  }
})

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
    fetchMyTickets() // Refresh tickets list
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

.delay-1500 {
  animation-delay: 1500ms;
}

.delay-2000 {
  animation-delay: 2000ms;
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

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
```