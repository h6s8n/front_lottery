<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#FF8E8E] to-[#FFB6B6] text-white font-vazir">
    <!-- Decorative Elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
      <div class="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-float-delayed"></div>
      <div class="absolute bottom-20 left-1/4 w-24 h-24 bg-white/10 rounded-full animate-float"></div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col items-center text-center px-4 pt-24 relative z-10">
      <!-- Logo/Icon -->
      
      <!-- Title -->
      <h1 class="text-6xl font-extrabold mb-4 text-shadow">لاتاری کارت</h1>
      <p class="text-2xl mb-12 text-white/90 max-w-md leading-relaxed">کارت جمع کن، دوست دعوت کن، جایزه ببر! </p>

      <!-- Start Button -->
      <a 
        href="https://t.me/LotteryAbolBot?start=login" 
        target="_blank" 
        class="group relative inline-flex items-center justify-center px-12 py-4 text-2xl font-bold text-white transition-all duration-300 ease-in-out transform hover:scale-105 hover:rotate-1"
      >
        <span class="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-white/30 group-hover:-translate-x-0 group-hover:-translate-y-0 rounded-full"></span>
        <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-[#FF9F43] to-[#FF6B6B] border-4 border-white group-hover:bg-gradient-to-r group-hover:from-[#FF6B6B] group-hover:to-[#FF9F43] rounded-full"></span>
        <span class="relative flex items-center gap-3">
          <span>شروع بازی</span>
          <svg class="w-7 h-7 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </a>

      <!-- Features -->
      <div class="mt-20 w-full overflow-x-auto">
        <div class="flex flex-row gap-4 md:grid md:grid-cols-3 md:gap-8 w-max md:w-full text-center">
          <div class="p-6 bg-white/10 rounded-2xl backdrop-blur-sm hover:scale-105 transition-transform min-w-[220px] flex-shrink-0">
            <div class="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">ورود رایگان</h3>
            <p class="text-white/80">کارت اول با اولین ورود 🎁</p>
          </div>
          <div class="p-6 bg-white/10 rounded-2xl backdrop-blur-sm hover:scale-105 transition-transform min-w-[220px] flex-shrink-0">
            <div class="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">دعوت دوستان</h3>
            <p class="text-white/80">کارت سوم با دعوت ۱۰ نفر 👥</p>
          </div>
          <div class="p-6 bg-white/10 rounded-2xl backdrop-blur-sm hover:scale-105 transition-transform min-w-[220px] flex-shrink-0">
            <div class="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">جایزه نقدی</h3>
            <p class="text-white/80">برنده جایزه‌های نقدی شو 💰</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// فونت ایرانی Vazir را باید به پروژه اضافه کنید یا از CDN استفاده کنید
</script>

<style scoped>
.font-vazir {
  font-family: Vazir, Tahoma, Arial, sans-serif;
}

.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
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

.animate-bounce-slow {
  animation: bounce 3s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
