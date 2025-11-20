<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#FF8E8E] to-[#FFB6B6] text-white font-sans relative overflow-hidden pb-24 select-none selection:bg-yellow-400 selection:text-black">
    <!-- Background Elements -->
    <AppLoading v-if="isLoading" />
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/20 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-300/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      <div class="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-pink-500/10 rounded-full blur-[100px] animate-pulse delay-2000"></div>
    </div>

    <!-- Header Stats (HUD Style) -->
    <div class="relative z-10 px-4 pt-2 pb-4">
      
      <!-- Header Stats -->
      <div class="flex justify-between items-center mb-6">
        <div class="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg">
          <div class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-lg shadow-sm">🎟️</div>
          <div>
            <p class="text-[10px] text-white/80 font-bold">تیکت‌های شما</p>
            <p class="font-black text-lg text-white drop-shadow-sm">{{ tickets }}</p>
          </div>
        </div>
        
        <div class="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-lg">
          <div class="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-lg shadow-sm">🏆</div>
          <div>
            <p class="text-[10px] text-white/80 font-bold">لول {{ level }}</p>
            <p class="font-black text-lg text-white drop-shadow-sm">{{ levelTitle }}</p>
          </div>
        </div>
      </div>



      <!-- Main Clicker Area -->
      <div class="flex flex-col items-center justify-center mb-2 relative w-full">
      <div class="flex justify-between text-xs text-white/80 font-bold mb-1 w-full">
        <span>پیشرفت سطح</span>
        <span>{{ levelProgress }}%</span>
      </div>
      <div class="h-3 bg-black/10 rounded-full overflow-hidden border border-white/20 backdrop-blur-sm w-full">
        <div 
          class="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 transition-all duration-500 ease-out relative shadow-[0_0_10px_rgba(250,204,21,0.5)]"
          :style="{ width: `${levelProgress}%` }"
        >
          <div class="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
        </div>
      </div>
    </div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 flex flex-col items-center justify-center">
      
      <!-- Points Display (Main Counter) -->
      <div class="flex flex-col items-center mb-1 animate-fade-in-up">
        <div class="flex items-center gap-3">
          <span class="text-5xl filter drop-shadow-md">🪙</span>
          <span class="text-6xl font-black tracking-tighter text-white drop-shadow-lg font-mono">
            {{ formatNumber(points) }}
          </span>
        </div>
        <span class="text-sm text-white/90 font-bold mt-2 tracking-widest uppercase text-[10px] bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">موجودی سکه</span>
      </div>

      <!-- Mascot (Click Area) -->
      <div class="relative w-80 h-80 flex items-center justify-center mb-8 select-none touch-none">
        <!-- Circular Glow/Border Container -->
        <div 
          class="absolute inset-0 rounded-full transition-all duration-300"
          :class="{ 'scale-95': isClicking }"
          style="
            box-shadow: 0 0 60px rgba(255, 255, 255, 0.4), 
                        inset 0 0 40px rgba(255, 255, 255, 0.2);
            border: 6px solid rgba(255, 255, 255, 0.3);
          "
        ></div>

        <!-- Mascot Image -->
        <div 
          class="relative w-full h-full rounded-full overflow-hidden cursor-pointer active:scale-95 transition-transform duration-100 z-20"
          @pointerdown="handleMascotClick"
        >
          <img 
            src="/mascot.png" 
            alt="Mascot" 
            class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            draggable="false"
          />
          
          <!-- Click Ripple Effect -->
          <div v-if="isClicking" class="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
        </div>

        <!-- Floating Numbers Container -->
        <div class="absolute inset-0 pointer-events-none z-30 overflow-visible">
          <TransitionGroup name="float-up">
            <div
              v-for="click in clicks"
              :key="click.id"
              class="absolute text-4xl font-black text-white drop-shadow-md flex items-center gap-1"
              :style="{ left: click.x + 'px', top: click.y + 'px' }"
            >
              <span class="text-yellow-300 drop-shadow-sm">+{{ clickAmount }}</span>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- Action Buttons Grid -->
      <div class="w-full px-6 grid grid-cols-2 gap-3 mb-24">
        <!-- Invite Button -->
        <button 
          @click="shareOnTelegram"
          class="group relative overflow-hidden bg-white/20 backdrop-blur-md p-4 rounded-3xl border border-white/40 shadow-lg active:scale-95 transition-all duration-200 hover:bg-white/30"
        >
          <div class="flex flex-col items-center gap-2 relative z-10">
            <div class="bg-blue-500/20 p-2 rounded-2xl">
              <UIcon name="i-heroicons-users" class="w-8 h-8 text-blue-100 drop-shadow-sm" />
            </div>
            <span class="font-bold text-sm text-white">دعوت از دوستان</span>
          </div>
        </button>

        <!-- Convert Button -->
        <button 
          @click="isConvertModalOpen = true"
          class="group relative overflow-hidden bg-white/20 backdrop-blur-md p-4 rounded-3xl border border-white/40 shadow-lg active:scale-95 transition-all duration-200 hover:bg-white/30"
        >
          <div class="flex flex-col items-center gap-2 relative z-10">
            <div class="bg-purple-500/20 p-2 rounded-2xl">
              <UIcon name="i-heroicons-ticket" class="w-8 h-8 text-purple-100 drop-shadow-sm" />
            </div>
            <span class="font-bold text-sm text-white">تبدیل سکه به بلیط</span>
          </div>
        </button>
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

    <!-- Bottom Stats Bar -->
    <div class="fixed bottom-24 left-4 right-4 z-40">
      <div class="bg-white/20 backdrop-blur-xl rounded-3xl p-1.5 border border-white/40 shadow-2xl flex items-center justify-between pr-4 pl-1.5 h-16">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-yellow-400/30 flex items-center justify-center border border-yellow-400/20">
            <span class="text-xl animate-pulse">⚡</span>
          </div>
          <div class="flex flex-col">
            <span class="text-[10px] text-white/80 font-bold uppercase tracking-wider">انرژی</span>
            <div class="flex items-baseline gap-1">
              <span class="text-lg font-black text-white font-mono drop-shadow-sm">{{ energy }}</span>
              <span class="text-[10px] text-white/60 font-mono font-bold">/ {{ maxEnergy }}</span>
            </div>
          </div>
        </div>
        
        <button class="h-12 px-6 bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-200 text-black text-sm font-black rounded-2xl transition-all shadow-lg shadow-yellow-400/30 flex items-center gap-2 active:scale-95">
          <UIcon name="i-heroicons-bolt" class="w-5 h-5" />
          <span>شارژ</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
const convertAmount = ref(1)
const router = useRouter()

// Lottery State
const currentLottery = ref(null)
const countdown = ref('00:00:00')
let countdownInterval = null

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

onMounted(async () => {
  if (auth.token) {
    await Promise.all([
      refresh(), // Use the existing refresh function for user data
      fetchLottery()
    ])
  }
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})

watch(userData, (newData) => {
  if (newData) {
    points.value = newData.points
    tickets.value = newData.tickets
    level.value = newData.level
  }
}, { immediate: true })

// Computed
const levelTitle = computed(() => {
  const titles = ['برنز', 'نقره', 'طلا', 'پلاتین', 'الماس', 'استاد', 'grandmaster', 'elite', 'legendary', 'mythic']
  return titles[level.value - 1] || 'Unknown'
})

const levelProgress = computed(() => {
  const nextLevelThreshold = level.value * 5000
  return Math.min(Math.floor((points.value / nextLevelThreshold) * 100), 100)
})

// Methods
const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num)
}

const handleMascotClick = (event) => {
  event.preventDefault()
  
  if (navigator.vibrate) navigator.vibrate(10)

  isClicking.value = true
  setTimeout(() => isClicking.value = false, 100)

  points.value += clickAmount.value
  
  if (energy.value > 0) energy.value -= 1

  const rect = event.target.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  const id = Date.now()
  clicks.value.push({ id, x, y })
  setTimeout(() => {
    clicks.value = clicks.value.filter(c => c.id !== id)
  }, 1000)

  sendClickToBackend()
}

let clickBuffer = 0
let debounceTimer = null

const sendClickToBackend = () => {
  clickBuffer += clickAmount.value
  
  if (debounceTimer) clearTimeout(debounceTimer)
  
  debounceTimer = setTimeout(async () => {
    if (clickBuffer > 0 && auth.token) {
      try {
        const res = await axios.post(`${config.public.apiBase}/points/add`, {
          amount: clickBuffer,
          type: 'click'
        }, {
          headers: { Authorization: `Bearer ${auth.token}` }
        })
        
        if (res.data.level) {
          level.value = res.data.level
        }
        
        clickBuffer = 0
      } catch (error) {
        console.error('Failed to sync clicks:', error)
      }
    }
  }, 1000)
}

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
    refresh() // Refresh data to ensure sync
  } catch (error) {
    console.error('Conversion failed:', error)
    alert('خطا در تبدیل امتیاز')
  }
}
</script>

<style scoped>
.animate-pulse-slow {
    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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