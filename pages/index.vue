<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#FF8E8E] to-[#FFB6B6] text-white font-vazir overflow-x-hidden selection:bg-yellow-400 selection:text-black">
    
    <!-- Background Elements -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-500/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
    </div>

    <div class="relative container mx-auto px-4 py-4 pb-24 max-w-md">

      <!-- Top Horizontal Navbar -->
      <div class="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all"
          :class="activeTab === tab.id ? 'bg-white text-gray-900' : 'bg-black/20 text-white/60 hover:bg-black/30'"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Invite Friends Button -->
      <button 
        @click="shareOnTelegram"
        class="w-full mb-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-black py-4 px-6 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-between"
      >
        <div class="text-right">
          <p class="text-lg">دعوت از دوستان</p>
          <p class="text-xs opacity-80">تیکت رایگان بگیر! 🎁</p>
        </div>
        <div class="text-3xl">✉️</div>
      </button>

      <!-- Task Cards Grid (Top Section) -->
      <div class="grid grid-cols-2 gap-3 mb-6">
        <div 
          v-for="task in displayedTasks" 
          :key="task.id"
          @click="handleTaskClick(task)"
          class="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-3 cursor-pointer hover:bg-black/30 active:scale-95 transition-all"
        >
          <div class="text-xs text-white/80 mb-1 truncate">{{ task.title }}</div>
          <div class="flex items-center justify-between">
            <div class="text-2xl">{{ task.icon }}</div>
            <div class="text-right">
              <div class="text-sm font-bold text-yellow-300">{{ task.reward }}</div>
              <div class="text-[10px] text-white/50">{{ task.subtitle }}</div>
            </div>
          </div>
          <!-- Check/Lock Status -->
          <div class="mt-2 flex items-center justify-center">
            <div v-if="isTaskUnlocked(task)" class="text-green-400 text-xs">✓ انجام شده</div>
            <div v-else class="text-white/40 text-xs">مرحله {{ task.level }}</div>
          </div>
        </div>
      </div>

      <!-- Central Mascot -->
      <div class="flex justify-center mb-6 relative">
        <!-- Outer Glow Ring -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-72 h-72 rounded-full bg-gradient-to-b from-yellow-400/30 to-orange-500/30 blur-2xl"></div>
        </div>
        
        <!-- Mascot Circle Container -->
        <div 
          class="relative w-64 h-64 rounded-full overflow-hidden cursor-pointer transition-transform duration-200 mascot-circle"
          :class="{'scale-95': mascotClicked}"
          @click="handleMascotClick"
        >
          <!-- Mascot Image -->
          <img 
            src="/mascot.png" 
            alt="Lucky Cat" 
            class="absolute inset-0 w-full h-full object-cover"
          />
          
          <!-- Click Effect -->
          <div v-if="mascotClicked" class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-10 text-yellow-300 font-bold text-3xl animate-bounce z-10">
            +{{ clickReward }}
          </div>
        </div>
      </div>

      <!-- Bottom Stats Bar -->
      <div class="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-4">
        <div class="flex items-center justify-between">
          <!-- Energy/Coins Display -->
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span class="text-xl">⚡</span>
            </div>
            <div>
              <div class="text-lg font-black">{{ user.tickets_count }}</div>
              <div class="text-xs text-white/50">/ {{ maxTickets }}</div>
            </div>
          </div>

          <!-- Boost Button -->
          <button 
            @click="showDailyModal = true"
            class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <span>🚀</span>
            شارژ
          </button>
        </div>
      </div>

      <!-- Daily Check-in Modal -->
      <div v-if="showDailyModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="bg-gradient-to-b from-gray-800 to-gray-900 border border-white/10 rounded-3xl p-6 w-full max-w-sm text-center relative overflow-hidden">
            <button @click="showDailyModal = false" class="absolute top-4 right-4 text-white/50 hover:text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <h2 class="text-2xl font-black text-white mb-2">جایزه روزانه</h2>
            <p class="text-white/60 text-sm mb-6">هر روز سر بزن و تیکت رایگان بگیر!</p>

            <div class="grid grid-cols-4 gap-2 mb-6">
                <div v-for="(reward, index) in dailyRewards" :key="index" 
                     class="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border relative"
                     :class="[
                        index < user.streak ? 'bg-green-500/20 border-green-500/50 text-green-400' : 
                        index === user.streak ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 ring-2 ring-yellow-500/30' : 
                        'bg-white/5 border-white/10 text-white/30'
                     ]">
                    <span class="text-xs font-bold">روز {{ index + 1 }}</span>
                    <span class="text-lg font-black">{{ reward }}</span>
                    <div v-if="index < user.streak" class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                        ✅
                    </div>
                </div>
            </div>

            <button 
                @click="claimDailyReward"
                :disabled="dailyRewardClaimed"
                class="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-black text-lg rounded-2xl shadow-lg transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {{ dailyRewardClaimed ? 'فردا بیا!' : 'دریافت جایزه' }}
            </button>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const { shareOnTelegram } = useReferral()

// Tabs
const tabs = ref([
  { id: 'markets', label: 'بازار' },
  { id: 'prteam', label: 'تیم و روابط' },
  { id: 'legal', label: 'قوانین' },
  { id: 'specials', label: 'ویژه' },
])
const activeTab = ref('markets')

// User Data
const user = ref({
  referrals_count: 3,
  tickets_count: 9000,
  joined_channel: false,
  instagram_joined: false,
  youtube_watched: false,
  streak: 0
})

const maxTickets = ref(9000)
const clickReward = ref(1)

// Mascot Logic
const mascotClicked = ref(false)
const handleMascotClick = () => {
  mascotClicked.value = true
  user.value.tickets_count += clickReward.value
  setTimeout(() => mascotClicked.value = false, 300)
}

// Daily Check-in
const showDailyModal = ref(false)
const dailyRewardClaimed = ref(false)
const dailyRewards = [1, 2, 3, 5, 8, 12, 20]
const claimDailyReward = () => {
  dailyRewardClaimed.value = true
  user.value.tickets_count += dailyRewards[user.value.streak]
  user.value.streak = (user.value.streak + 1) % 7
  setTimeout(() => showDailyModal.value = false, 2000)
}

// Tasks
const allTasks = ref([
  { 
    id: 1, 
    icon: '👥', 
    title: 'دعوت دوست اول', 
    reward: '۱ تیکت', 
    subtitle: 'در تلگرام',
    level: 'سطح ۱',
    unlock_condition: (u) => u.referrals_count >= 1,
    action: () => shareOnTelegram() 
  },
  { 
    id: 2, 
    icon: '📢', 
    title: 'عضویت در کانال', 
    reward: '۱ تیکت', 
    subtitle: 'عضو شو',
    level: 'سطح ۱',
    unlock_condition: (u) => u.joined_channel,
    action: () => window.open('https://t.me/your_channel', '_blank') 
  },
  { 
    id: 3, 
    icon: '📸', 
    title: 'فالو اینستاگرام', 
    reward: '۲ تیکت', 
    subtitle: 'دنبال کن',
    level: 'سطح ۲',
    unlock_condition: (u) => u.instagram_joined,
    action: () => window.open('https://instagram.com/your_page', '_blank') 
  },
  { 
    id: 4, 
    icon: '📺', 
    title: 'سابسکرایب یوتیوب', 
    reward: '۳ تیکت', 
    subtitle: 'ویدیو ببین',
    level: 'سطح ۳',
    unlock_condition: (u) => u.youtube_watched,
    action: () => window.open('https://youtube.com/your_channel', '_blank') 
  },
])

const displayedTasks = computed(() => {
  return allTasks.value.slice(0, 4)
})

const isTaskUnlocked = (task) => {
  return task.unlock_condition(user.value)
}

const handleTaskClick = (task) => {
  if (isTaskUnlocked(task)) return
  if (task.action) task.action()
}
</script>

<style scoped>
.font-vazir {
  font-family: Vazir, Tahoma, Arial, sans-serif;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.mascot-circle {
  box-shadow: 
    0 0 0 5px #FFD700,
    0 0 20px rgba(255, 215, 0, 0.6),
    0 0 40px rgba(255, 215, 0, 0.4),
    inset 0 0 30px rgba(255, 215, 0, 0.1);
}

.animate-pulse-slow {
    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>