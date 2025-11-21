<template>
  <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 shadow-xl p-4 flex flex-col gap-3 group hover:bg-white/15 transition-all duration-300">
    <!-- Header: Lottery Name & Date -->
    <div class="flex justify-between items-center border-b border-white/10 pb-2">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
          <span class="text-lg">🎰</span>
        </div>
        <div class="flex flex-col">
          <span class="text-xs font-bold text-white/90">Mini Powerball</span>
          <span class="text-[10px] text-white/60 font-mono">#{{ ticket.id }}</span>
        </div>
      </div>
      <div class="px-2 py-1 rounded-lg bg-black/20 text-[10px] font-bold text-white/80 backdrop-blur-sm">
        {{ formatDate(ticket.created_at) }}
      </div>
    </div>

    <!-- Numbers Row -->
    <div class="flex justify-center items-center gap-2 py-2">
      <!-- White Balls (1-15) -->
      <div 
        v-for="(num, idx) in ticket.numbers.white" 
        :key="idx"
        class="w-10 h-10 rounded-full bg-gradient-to-b from-white to-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center text-gray-800 font-black text-lg border-2 border-white/50 transform group-hover:scale-110 transition-transform duration-300"
        :style="{ transitionDelay: `${idx * 50}ms` }"
      >
        {{ num }}
      </div>

      <!-- Separator -->
      <div class="w-px h-8 bg-white/20 mx-1"></div>

      <!-- Red Powerball (1-5) -->
      <div 
        class="w-11 h-11 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_15px_rgba(239,68,68,0.6)] flex items-center justify-center text-white font-black text-xl border-2 border-red-400/50 animate-pulse-slow transform group-hover:rotate-12 transition-transform duration-500"
      >
        {{ ticket.numbers.red }}
      </div>
    </div>

    <!-- Footer: Status -->
    <div class="flex justify-between items-center pt-1">
      <div class="flex items-center gap-1.5">
        <div class="w-2 h-2 rounded-full" :class="statusColor"></div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-white/70">{{ ticket.status }}</span>
      </div>
      <div class="text-[10px] text-white/40">Good Luck!</div>
    </div>

    <!-- Shine Effect -->
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  ticket: {
    type: Object,
    required: true
  }
})

const statusColor = computed(() => {
  switch (props.ticket.status) {
    case 'won': return 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]'
    case 'lost': return 'bg-red-400'
    default: return 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]'
  }
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
}
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
