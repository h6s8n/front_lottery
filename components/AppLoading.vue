<template>
  <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
    <div class="relative">
      <!-- Glowing effect -->
      <div class="absolute inset-0 bg-yellow-500/30 blur-xl rounded-full animate-pulse"></div>
      
      <!-- Spinning Mascot or Coin -->
      <img 
        src="/mascot.png" 
        alt="Loading..." 
        class="relative w-24 h-24 rounded-full border-4 border-yellow-400 shadow-2xl animate-spin-slow object-cover"
      />
    </div>
    <p class="mt-4 text-yellow-400 font-bold text-lg animate-pulse">در حال بارگذاری...</p>
  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
