<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FF9966] via-[#FF5E62] to-[#FF9966] text-white font-sans relative overflow-hidden pb-24 selection:bg-yellow-400 selection:text-black">
    <!-- Background Elements -->
    <AppLoading v-if="isLoading" />
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/20 rounded-full blur-[100px] animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-yellow-300/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      <div class="absolute top-[40%] left-[20%] w-[20%] h-[20%] bg-white/10 rounded-full blur-[60px]"></div>
    </div>

    <div class="relative z-10 px-4 pt-6 pb-32">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <div class="inline-block p-1 rounded-full bg-white/30 backdrop-blur-sm mb-4 shadow-lg border border-white/20">
          <div class="bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full p-4 w-24 h-24 flex items-center justify-center shadow-inner">
            <span class="text-6xl filter drop-shadow-md transform hover:scale-110 transition-transform duration-300">🎁</span>
          </div>
        </div>
        <h1 class="text-3xl font-black mb-2 text-white drop-shadow-md tracking-tight">کسب درآمد</h1>
        <p class="text-white/90 text-sm font-bold">ماموریت‌ها رو انجام بده و سکه جمع کن! ✨</p>
      </div>

      <!-- Daily Rewards Section -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-3 px-2">
          <h2 class="font-bold text-white flex items-center gap-2 drop-shadow-sm">
            <span class="w-2 h-6 bg-yellow-400 rounded-full shadow-sm"></span>
            جایزه روزانه
          </h2>
          <span class="text-xs text-white/80 font-bold cursor-pointer hover:text-white transition-colors bg-white/20 px-2 py-1 rounded-lg">مشاهده همه</span>
        </div>
        <div class="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          <div 
            v-for="(day, index) in 7" 
            :key="index"
            class="min-w-[72px] h-24 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all relative overflow-hidden group shadow-lg"
            :class="index === 0 ? 'bg-white/30 border-white/40 backdrop-blur-md transform scale-105' : 'bg-white/10 border-white/20 backdrop-blur-sm opacity-80'"
          >
            <div class="text-[10px] font-bold text-white/80 mb-1">روز {{ index + 1 }}</div>
            <div class="text-2xl mb-1 drop-shadow-sm">{{ index === 0 ? '⚡' : '🔒' }}</div>
            <div class="text-xs font-black" :class="index === 0 ? 'text-yellow-300' : 'text-white/60'">
              {{ formatNumber((index + 1) * 500) }}
            </div>
            <!-- Active Indicator -->
            <div v-if="index === 0" class="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400"></div>
          </div>
        </div>
      </div>

      <!-- Task Categories (Tabs) -->
      <div class="flex p-1.5 bg-white/20 backdrop-blur-md rounded-2xl mb-6 border border-white/20 shadow-lg">
        <button 
          v-for="tab in ['همه', 'ویژه', 'شبکه‌های اجتماعی', 'دوستان']" 
          :key="tab"
          @click="activeTab = tab"
          class="flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 relative z-10"
          :class="activeTab === tab ? 'text-pink-600 shadow-md bg-white' : 'text-white/80 hover:text-white hover:bg-white/10'"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Tasks List -->
      <div class="grid grid-cols-2 gap-3">
        <!-- Real Tasks -->
        <div 
          v-for="task in filteredTasks" 
          :key="task.id"
          class="group bg-white/20 backdrop-blur-md border border-white/30 rounded-[20px] p-3 flex flex-col justify-between hover:bg-white/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden"
        >
          <!-- Top Section -->
          <div class="flex items-start gap-3 mb-2">
            <!-- Cat Image (Top Left) -->
            <div class="w-10 h-10 rounded-full overflow-hidden shadow-md bg-white/40 p-0.5 flex-shrink-0">
              <img 
                :src="`https://robohash.org/${task.id}?set=set4&bgset=bg1&size=100x100`" 
                alt="Task Icon" 
                class="w-full h-full object-cover rounded-full"
              >
            </div>

            <!-- Title & Reward (Right) -->
            <div class="flex flex-col min-w-0">
              <h3 class="font-black text-[11px] text-white drop-shadow-sm leading-tight mb-1 line-clamp-2 h-8">{{ task.title }}</h3>
              <div class="flex flex-col">
                <span class="text-[9px] text-white/60 font-bold">پاداش</span>
                <div class="flex items-center gap-1">
                  <span class="text-[10px]">{{ task.reward_type === 'ticket' ? '🎟️' : '🪙' }}</span>
                  <span class="text-yellow-300 font-black text-xs drop-shadow-sm">+{{ formatNumber(task.reward_amount) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="h-px bg-white/20 w-full my-2"></div>

          <!-- Bottom Section -->
          <div class="flex items-center justify-between h-8">
            <!-- Level/Info (Left) -->
            <div class="flex items-center h-full border-l border-white/20 pl-2">
              <span class="text-[10px] font-bold text-white/80">Lvl 1</span>
            </div>

            <!-- Action Button (Right) -->
            <button 
              @click="handleTaskAction(task)"
              :disabled="task.status === 'claimed' || taskStates[task.id]?.loading"
              class="flex-1 h-full flex items-center justify-end gap-1 font-bold text-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed pl-2"
              :class="task.status === 'claimed' ? 'text-green-300' : 'text-white'"
            >
              <span v-if="taskStates[task.id]?.loading" class="animate-spin ml-1">⏳</span>
              <span v-else-if="task.status === 'claimed'">✅ انجام شد</span>
              <span v-else class="flex items-center gap-1">
                <span class="text-lg">👉</span>
                <span>انجام بده</span>
              </span>
            </button>
          </div>
        </div>

        <!-- Static/Coming Soon Tasks -->
        <div v-if="activeTab === 'همه' || activeTab === 'ویژه'" class="opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          <div class="bg-white/10 border border-white/20 rounded-[20px] p-3 flex flex-col justify-between h-full backdrop-blur-sm">
            <!-- Top Section -->
            <div class="flex items-start gap-3 mb-2">
              <div class="w-10 h-10 rounded-full overflow-hidden shadow-md bg-white/20 p-0.5 flex-shrink-0">
                <img src="https://robohash.org/wallet?set=set4&bgset=bg1&size=100x100" class="w-full h-full object-cover rounded-full">
              </div>
              <div class="flex flex-col min-w-0">
                <h3 class="font-black text-[11px] text-white/80 leading-tight mb-1 line-clamp-2 h-8">اتصال کیف پول</h3>
                <div class="flex flex-col">
                  <span class="text-[9px] text-white/40 font-bold">پاداش</span>
                  <div class="flex items-center gap-1">
                    <span class="text-[10px]">🪙</span>
                    <span class="text-yellow-300/80 font-black text-xs">+1M</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="h-px bg-white/10 w-full my-2"></div>

            <!-- Bottom Section -->
            <div class="flex items-center justify-between h-8">
              <div class="flex items-center h-full border-l border-white/10 pl-2">
                <span class="text-[10px] font-bold text-white/40">Lvl 10</span>
              </div>
              <div class="flex-1 h-full flex items-center justify-end gap-1 pl-2">
                <span class="text-[10px] font-bold text-white/40">🔒 قفل</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'همه' || activeTab === 'دوستان'" class="opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          <div class="bg-white/10 border border-white/20 rounded-[20px] p-3 flex flex-col justify-between h-full backdrop-blur-sm">
            <!-- Top Section -->
            <div class="flex items-start gap-3 mb-2">
              <div class="w-10 h-10 rounded-full overflow-hidden shadow-md bg-white/20 p-0.5 flex-shrink-0">
                <img src="https://robohash.org/friends?set=set4&bgset=bg1&size=100x100" class="w-full h-full object-cover rounded-full">
              </div>
              <div class="flex flex-col min-w-0">
                <h3 class="font-black text-[11px] text-white/80 leading-tight mb-1 line-clamp-2 h-8">دعوت از ۱۰ دوست</h3>
                <div class="flex flex-col">
                  <span class="text-[9px] text-white/40 font-bold">پاداش</span>
                  <div class="flex items-center gap-1">
                    <span class="text-[10px]">🪙</span>
                    <span class="text-yellow-300/80 font-black text-xs">+500K</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="h-px bg-white/10 w-full my-2"></div>

            <!-- Bottom Section -->
            <div class="flex items-center justify-between h-8">
              <div class="flex items-center h-full border-l border-white/10 pl-2">
                <span class="text-[10px] font-bold text-white/40">Lvl 5</span>
              </div>
              <div class="flex-1 h-full flex items-center justify-end gap-1 pl-2">
                <div class="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                  <div class="w-1/3 h-full bg-yellow-400"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'auth'
})

const auth = useAuthStore()
const config = useRuntimeConfig()
const activeTab = ref('همه')
const taskStates = ref({})

// Fetch Tasks
const { data: tasks, pending: isLoading, refresh: refreshTasks } = await useAsyncData('tasks', () => 
  $fetch(`${config.public.apiBase}/tasks`, {
    headers: { Authorization: `Bearer ${auth.token}` }
  }), {
    lazy: true
  }
)

const filteredTasks = computed(() => {
  if (!tasks.value) return []
  const allTasks = tasks.value.data || tasks.value
  
  if (activeTab.value === 'همه') return allTasks
  if (activeTab.value === 'ویژه') return allTasks.filter(t => t.is_special)
  if (activeTab.value === 'شبکه‌های اجتماعی') return allTasks.filter(t => t.category === 'social')
  if (activeTab.value === 'دوستان') return allTasks.filter(t => t.category === 'referral')
  
  return allTasks
})

const handleTaskAction = async (task) => {
  if (task.status === 'claimed') return

  // Initialize state for this task if not exists
  if (!taskStates.value[task.id]) {
    taskStates.value[task.id] = { loading: false }
  }

  // If not started, open link and set to pending
  if (task.status === 'available') {
    if (task.link) {
      window.open(task.link, '_blank')
    }
    
    // Optimistic update to 'pending' (or whatever the backend expects for "started")
    // For now, let's assume we just verify immediately or after a delay.
    // In a real app, we might call an endpoint to "start" the task.
    
    // Let's try to claim/verify immediately for this demo
    verifyTask(task)
  } else {
    verifyTask(task)
  }
}

const verifyTask = async (task) => {
  taskStates.value[task.id].loading = true
  try {
    await axios.post(`${config.public.apiBase}/tasks/${task.id}/claim`, {}, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    // Refresh tasks to get updated status
    await refreshTasks()
    // Update user points/tickets if needed (auth store might need refresh)
    // auth.fetchUser() 
  } catch (error) {
    console.error('Task claim failed:', error)
    alert('تایید انجام ماموریت با خطا مواجه شد. لطفا دوباره تلاش کنید.')
  } finally {
    taskStates.value[task.id].loading = false
  }
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('fa-IR').format(num)
}
</script>
