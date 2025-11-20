<template>
  <footer class="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md text-white p-2 flex justify-around border-t border-white/10 z-50 pb-4 pt-3">
    <NuxtLink to="/" class="flex flex-col items-center justify-center cursor-pointer transition-colors hover:text-yellow-400 p-2" active-class="text-yellow-400">
      <UIcon name="i-heroicons-home" class="w-7 h-7"/>
    </NuxtLink>
    
    <NuxtLink to="/earn" class="flex flex-col items-center justify-center cursor-pointer transition-colors hover:text-yellow-400 p-2" active-class="text-yellow-400">
      <UIcon name="i-heroicons-gift" class="w-7 h-7"/>
    </NuxtLink>

    <NuxtLink to="/buy-card" class="flex flex-col items-center justify-center cursor-pointer transition-colors hover:text-yellow-400 p-2" active-class="text-yellow-400">
      <UIcon name="i-heroicons-ticket" class="w-7 h-7"/>
    </NuxtLink>

    <NuxtLink to="/result" class="flex flex-col items-center justify-center cursor-pointer transition-colors hover:text-yellow-400 p-2" active-class="text-yellow-400">
      <UIcon name="i-heroicons-trophy" class="w-7 h-7"/>
    </NuxtLink>

    <NuxtLink to="/profile" class="flex flex-col items-center justify-center cursor-pointer transition-colors hover:text-yellow-400 p-2" active-class="text-yellow-400">
      <UIcon name="i-heroicons-user" class="w-7 h-7"/>
    </NuxtLink>
  </footer>
</template>



<style scoped>
footer {
  background-color: #1a202c;
}
</style>
