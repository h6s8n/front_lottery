<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#FF8E8E] to-[#FFB6B6] text-white font-vazir overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
      <div class="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-float-delayed"></div>
      <div class="absolute bottom-20 left-1/4 w-24 h-24 bg-white/10 rounded-full animate-float"></div>
    </div>

    <div class="relative z-10 container mx-auto p-4 pb-24">

      <div class="flex justify-between items-center bg-black/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
        <div class="text-center">
          <p class="text-xs text-white/80">تیکت‌های شما</p>
          <p class="font-bold text-xl">{{ user.tickets_count }} 🎟️</p>
        </div>
        <div class="text-center">
          <p class="text-xs text-white/80">دوستان دعوت‌شده</p>
          <p class="font-bold text-xl">{{ user.referrals_count }} 👥</p>
        </div>
        <div>
          <button class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </button>
        </div>
      </div>

      <div class="text-center my-10">
        <p class="text-white/80 text-lg">جایزه بزرگ این هفته</p>
        <p class="text-6xl font-extrabold text-yellow-300 text-shadow my-2">{{ jackpot.toLocaleString() }} <span class="text-4xl">تومان</span></p>
        <p class="text-white/80">شانست رو برای برنده شدن امتحان کن!</p>
      </div>

      <div class="text-center my-8">
        <button @click="shareOnTelegram" class="inline-block px-10 py-4 text-xl font-bold bg-yellow-400 text-gray-900 rounded-full shadow-lg hover:bg-yellow-300 transition-all transform hover:scale-105">
          دعوت از دوستان 🚀
        </button>
      </div>

      <div class="w-full">
        <h2 class="text-2xl font-bold mb-4 text-right">تیکت بیشتر کسب کن</h2>
        <div class="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 lg:grid-cols-5 md:gap-6">
          <div v-for="task in tasks" :key="task.id" class="flex-shrink-0 w-40 h-48 p-4 bg-black/20 rounded-2xl flex flex-col justify-between items-center text-center border border-white/10 transition-transform hover:-translate-y-2 md:w-auto">
            <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl">
              <span v-if="!isTaskUnlocked(task)">{{ task.icon }}</span>
              <svg v-else class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <p class="font-semibold mt-2">{{ task.title }}</p>
            <p class="text-xs text-yellow-300 font-bold">+{{ task.reward }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// تمام منطق دعوت دوستان فقط در یک خط!
const { shareOnTelegram } = useReferral()

// --- Mock Data (to be replaced with API/Store data) ---
const user = ref({
  referrals_count: 3,
  tickets_count: 5,
  joined_channel: false,
})

const jackpot = ref(50000000)

// --- Existing Task Logic ---
const tasks = ref([
  { id: 1, icon: '👤', title: 'دعوت اولین دوست', reward: '۱ تیکت رایگان', unlock_condition: (user) => user.referrals_count >= 1, },
  { id: 2, icon: '📢', title: 'عضویت در کانال', reward: '۱ تیکت رایگان', unlock_condition: (user) => user.joined_channel, },
  { id: 3, icon: '🔥', title: 'دعوت ۵ دوست', reward: '۳ تیکت رایگان', unlock_condition: (user) => user.referrals_count >= 5, },
  { id: 4, icon: '👑', title: 'لیدر انجمن', reward: 'آواتار ویژه', unlock_condition: (user) => user.referrals_count >= 10, },
  { id: 5, icon: '💎', title: 'خرید اولین بسته', reward: '۲ تیکت رایگان', unlock_condition: (user) => false, },
])

const isTaskUnlocked = (task) => {
  return task.unlock_condition(user.value)
}
</script>

<style scoped>
.font-vazir {
  font-family: Vazir, Tahoma, Arial, sans-serif;
}
.text-shadow {
  text-shadow: 2px 2px 8px rgba(255, 255, 0, 0.3), 0 0 5px rgba(0, 0, 0, 0.5);
}
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
@keyframes float-delayed {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
.animate-float-delayed {
  animation: float-delayed 7s ease-in-out infinite;
}
</style>