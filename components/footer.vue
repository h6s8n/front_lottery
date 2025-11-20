<template>
  <footer class="fixed bottom-0 left-0 right-0 bg-white/20 backdrop-blur-xl border-t border-white/30 p-2 flex justify-around z-50 pb-5 pt-3 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
    <NuxtLink to="/" class="flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 p-2 text-white/70" active-class="!text-yellow-300 scale-110 drop-shadow-sm">
      <UIcon name="i-heroicons-home" class="w-7 h-7"/>
    </NuxtLink>
    
    <NuxtLink to="/earn" class="flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 p-2 text-white/70" active-class="!text-yellow-300 scale-110 drop-shadow-sm">
      <UIcon name="i-heroicons-gift" class="w-7 h-7"/>
    </NuxtLink>

    <NuxtLink to="/buy-card" class="flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 p-2 text-white/70" active-class="!text-yellow-300 scale-110 drop-shadow-sm">
      <UIcon name="i-heroicons-ticket" class="w-7 h-7"/>
    </NuxtLink>

    <NuxtLink to="/result" class="flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 p-2 text-white/70" active-class="!text-yellow-300 scale-110 drop-shadow-sm">
      <UIcon name="i-heroicons-trophy" class="w-7 h-7"/>
    </NuxtLink>

    <NuxtLink to="/profile" class="flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 p-2 text-white/70" active-class="!text-yellow-300 scale-110 drop-shadow-sm">
      <UIcon name="i-heroicons-user" class="w-7 h-7"/>
    </NuxtLink>
  </footer>
</template>

<style scoped>
/* No custom CSS needed, using Tailwind classes */
</style>
