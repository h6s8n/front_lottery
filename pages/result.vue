<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#FF8E8E] to-[#FFB6B6] text-white font-sans overflow-x-hidden selection:bg-yellow-400 selection:text-black pb-24">
    
    <!-- Background Elements -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/20 rounded-full blur-[100px] animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-yellow-300/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
    </div>

    <div class="relative container mx-auto px-4 py-6 max-w-md">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-black text-white drop-shadow-md mb-2">نتایج قرعه‌کشی</h1>
        <p class="text-white/90 text-sm font-bold">لیست برندگان خوش‌شانس! 🏆</p>
      </div>

      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>

      <div v-else-if="history.length === 0" class="text-center py-12 opacity-80">
        <div class="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-inner">
          <span class="text-4xl">📭</span>
        </div>
        <p class="text-white font-bold text-lg">هنوز قرعه‌کشی انجام نشده!</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="(lottery, index) in history" :key="lottery.id" 
             class="bg-white/20 backdrop-blur-md border border-white/30 rounded-[24px] p-5 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          
          <!-- Winner Badge -->
          <div class="absolute top-0 left-0 bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-br-xl shadow-sm z-10">
            #{{ lottery.id }}
          </div>

          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-white/30">
              👑
            </div>
            <div>
              <p class="text-xs text-white/80 font-bold mb-1">برنده خوش‌شانس</p>
              <h3 class="font-black text-lg text-white drop-shadow-sm">
                {{ lottery.winner ? `${lottery.winner.first_name} ${lottery.winner.last_name}` : 'هنوز مشخص نشده' }}
              </h3>
              <p class="text-[10px] text-white/60 font-mono dir-ltr" v-if="lottery.winner">@{{ lottery.winner.username }}</p>
            </div>
          </div>

          <div class="bg-black/10 rounded-xl p-3 flex justify-between items-center border border-white/10 backdrop-blur-sm">
            <div>
              <p class="text-[10px] text-white/70 font-bold mb-0.5">مبلغ جایزه</p>
              <p class="font-black text-yellow-300 drop-shadow-sm">{{ formatNumber(lottery.prize_pool) }} <span class="text-[10px]">تومان</span></p>
            </div>
            <div class="text-left">
              <p class="text-[10px] text-white/70 font-bold mb-0.5">تاریخ قرعه‌کشی</p>
              <p class="font-bold text-white text-xs dir-ltr">{{ new Date(lottery.draw_time).toLocaleDateString('fa-IR') }}</p>
            </div>
          </div>
        </div>
      </div>

      <button @click="router.push('/')" class="w-full mt-8 py-3 bg-white/20 hover:bg-white/30 text-white font-black rounded-xl border border-white/20 transition-all active:scale-95 shadow-sm">
        بازگشت به خانه
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const config = useRuntimeConfig()

const history = ref([])
const loading = ref(true)

const formatNumber = (num) => {
  return new Intl.NumberFormat('fa-IR').format(num)
}

const fetchHistory = async () => {
  try {
    const res = await axios.get(`${config.public.apiBase}/lottery/history`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    history.value = res.data
  } catch (e) {
    console.error('Error fetching history:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (auth.token) {
    fetchHistory()
  } else {
    router.push('/')
  }
})
</script>
