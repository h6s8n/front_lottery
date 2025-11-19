<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#FF8E8E] to-[#FFB6B6] text-white font-vazir overflow-x-hidden selection:bg-yellow-400 selection:text-black">
    
    <!-- Background Elements -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-500/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
      <div class="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full animate-float"></div>
      <div class="absolute top-40 right-20 w-6 h-6 bg-white/10 rounded-full animate-float-delayed"></div>
    </div>

    <div class="relative container mx-auto px-4 py-6 pb-32 max-w-md">
      
      <h1 class="text-3xl font-black text-center mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 drop-shadow-sm">دعوت دوستان</h1>
      <p class="text-center text-white/80 text-sm mb-8">دوستانت رو دعوت کن و تیکت رایگان بگیر!</p>

      <div v-if="!isLoggedIn" class="mb-6">
        <div class="bg-black/20 backdrop-blur-md border border-white/10 p-6 rounded-3xl text-center shadow-lg">
          <p class="mb-4">برای دریافت لینک دعوت اختصاصی، لطفاً وارد شوید.</p>
        </div>
      </div>

      <div v-else>
        <!-- Referral Link Card -->
        <div class="bg-black/20 backdrop-blur-md border border-white/10 p-6 rounded-3xl mb-8 shadow-xl relative overflow-hidden group">
           <div class="absolute top-0 right-0 w-20 h-20 bg-yellow-400/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
           
           <div class="text-center mb-4">
             <div class="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-lg mb-3 rotate-3 group-hover:rotate-6 transition-transform">
               🎁
             </div>
             <h2 class="font-bold text-lg">لینک اختصاصی شما</h2>
           </div>

           <div class="bg-black/20 rounded-xl p-3 flex items-center gap-2 mb-4 border border-white/5">
             <button @click="copyLink" class="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors">
               <UIcon name="i-heroicons-clipboard" class="w-5 h-5"/>
             </button>
             <div class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left text-sm font-mono text-white/80 dir-ltr">
               {{ referralLink }}
             </div>
           </div>

           <button @click="shareOnTelegram" class="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2">
             <UIcon name="i-heroicons-paper-airplane" class="w-5 h-5 rotate-[-45deg]"/>
             ارسال در تلگرام
           </button>
        </div>

        <!-- Friends List -->
        <div>
          <div class="flex justify-between items-end mb-4 px-2">
            <h2 class="text-xl font-bold flex items-center gap-2">
              <span class="w-2 h-6 bg-green-400 rounded-full"></span>
              لیست دوستان
            </h2>
            <span class="text-xs text-white/60 bg-black/10 px-2 py-1 rounded-lg">{{ referrals.length }} نفر</span>
          </div>

          <div v-if="referrals.length === 0" class="text-center py-10 opacity-60">
            <UIcon name="i-heroicons-users" class="w-16 h-16 mb-2 mx-auto"/>
            <p>هنوز کسی را دعوت نکرده‌اید.</p>
          </div>

          <div v-else class="space-y-3">
            <div v-for="friend in referrals" :key="friend.id" class="bg-black/20 backdrop-blur-sm border border-white/5 rounded-2xl p-3 flex items-center gap-3 hover:bg-black/30 transition-colors">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-inner">
                {{ (friend.first_name || 'U').charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0 text-right">
                 <p class="font-bold text-sm truncate">
                    {{ friend.first_name || '' }} {{ friend.last_name || '' }}
                 </p>
                 <p class="text-xs text-white/50 truncate" dir="ltr">
                    {{ friend.username ? '@' + friend.username : 'ID: ' + (friend.telegram_id ? friend.telegram_id.slice(-4) : '***') }}
                 </p>
              </div>
              <div class="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">
                +1 تیکت
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '~/stores/auth'

const isLoggedIn = ref(false)
const user = ref<any>(null)
const referralLink = ref('')
const botUsername = 'LotteryAbolBot'
const auth = useAuthStore()
const referrals = ref<any[]>([])
const referralCode = ref('')

watch(
  () => auth.token,
  async (newToken) => {
    isLoggedIn.value = !!newToken
    if (newToken) {
      try {
        const resInvitees = await axios.get('https://www.monopolies.ir/api/user/invitees', {
          headers: { Authorization: `Bearer ${newToken}` }
        })
        referrals.value = resInvitees.data.invitees
      } catch (err) {
        referrals.value = []
      }
      try {
        const resReferral = await axios.get('https://www.monopolies.ir/api/user/referral-code', {
          headers: { Authorization: `Bearer ${newToken}` }
        })
        referralCode.value = resReferral.data.referral_code
        referralLink.value = `https://t.me/${botUsername}?start=${referralCode.value}`
      } catch (err) {
        referralCode.value = ''
        referralLink.value = ''
      }
    }
  },
  { immediate: true }
)

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(referralLink.value)
    alert('Link copied to clipboard!')
  } catch (err) {
    alert('Failed to copy link')
  }
}

const shareOnTelegram = () => {
  window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink.value)}`, '_blank')
}
</script>

<style scoped>
.text-shadow {
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.18);
}
</style>
