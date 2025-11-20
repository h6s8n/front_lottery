<template>
  <div class="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>

    <div class="relative z-10 flex flex-col items-center text-center max-w-md w-full">
      <!-- Logo/Mascot -->
      <div class="w-32 h-32 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 p-1 mb-8 shadow-[0_0_50px_rgba(234,179,8,0.4)]">
        <img src="/mascot.png" alt="Logo" class="w-full h-full rounded-full object-cover border-4 border-black" />
      </div>

      <h1 class="text-3xl font-black mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        خوش آمدید!
      </h1>
      <p class="text-gray-400 mb-12 text-sm leading-relaxed">
        برای شروع بازی و کسب درآمد، لطفا از طریق تلگرام وارد شوید.
      </p>

      <!-- Login Button -->
      <a 
        href="https://t.me/LotteryAbolBot?start=login"
        target="_blank"
        class="w-full group relative overflow-hidden bg-[#229ED9] hover:bg-[#1e8qb0] p-4 rounded-2xl transition-all duration-300 active:scale-95 shadow-[0_4px_20px_rgba(34,158,217,0.4)]"
      >
        <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <div class="relative flex items-center justify-center gap-3">
          <UIcon name="i-heroicons-paper-airplane" class="w-6 h-6 text-white -rotate-45" />
          <span class="font-bold text-lg">ورود با تلگرام</span>
        </div>
      </a>

      <p class="mt-6 text-xs text-gray-600">
        با کلیک روی دکمه بالا، ربات تلگرام باز می‌شود. دکمه START را بزنید تا وارد شوید.
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'empty',
  middleware: 'auth'
})
</script>
