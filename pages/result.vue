<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#FF8E8E] to-[#FFB6B6] text-white font-vazir overflow-x-hidden selection:bg-yellow-400 selection:text-black" dir="rtl">
    
    <!-- Background Elements -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-500/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
    </div>

    <div class="relative container mx-auto px-4 py-6 pb-32 max-w-md flex flex-col items-center justify-center min-h-[80vh]">
      
      <!-- WIN STATE -->
      <div v-if="status === 'win'" class="w-full bg-black/20 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl text-center animate-bounce-slow">
        <div class="w-32 h-32 mx-auto bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/50">
          <span class="text-6xl">🏆</span>
        </div>
        <h2 class="text-3xl font-black text-yellow-300 mb-2">تبریک!</h2>
        <p class="text-white/90 text-lg mb-6">شما برنده شدید!</p>
        <div class="bg-white/10 rounded-xl p-4 mb-6">
          <p class="text-sm text-white/70 mb-1">مبلغ جایزه</p>
          <p class="text-2xl font-mono font-bold text-green-400">50,000,000 تومان</p>
        </div>
        <button class="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl shadow-lg transition-transform active:scale-95">
          دریافت جایزه
        </button>
      </div>

      <!-- LOSE STATE -->
      <div v-else-if="status === 'lose'" class="w-full bg-black/20 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl text-center">
        <div class="w-24 h-24 mx-auto bg-gray-700/50 rounded-full flex items-center justify-center mb-6 grayscale">
          <span class="text-5xl">😔</span>
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">متاسفیم</h2>
        <p class="text-white/70 mb-6">شما در این قرعه‌کشی برنده نشدید.</p>
        <button @click="navigateTo('/buy-card')" class="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/10 transition-transform active:scale-95">
          خرید بلیط جدید
        </button>
      </div>

      <!-- WAIT STATE -->
      <div v-else class="w-full bg-black/20 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl text-center">
        <div class="w-24 h-24 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <span class="text-5xl">⏳</span>
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">در انتظار قرعه‌کشی</h2>
        <p class="text-white/70 mb-6">نتایج هنوز اعلام نشده است.</p>
        <div class="bg-white/10 rounded-xl p-3 mb-4 flex justify-between items-center">
          <span class="text-sm">زمان باقی‌مانده</span>
          <span class="font-mono font-bold text-yellow-300">04:23:12</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const status = route.query.status || 'wait'

function navigateTo(page) {
  router.push(page)
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
