<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'auth'
})


const auth = useAuthStore()
const config = useRuntimeConfig()
const user = ref({
  first_name: '',
  last_name: '',
  username: '',
  telegram_id: '',
  created_at: '',
  avatar: ''
})
const editing = ref(false)


const activeTab = ref('profile') // 'profile' | 'friends'
const referrals = ref([])
const referralLink = ref('')
const botUsername = 'LotteryAbolBot'

const startEditing = () => {
  editing.value = true
}

const saveProfile = async () => {
  try {
    await axios.post(`${config.public.apiBase}/user/update`, {
      first_name: user.value.first_name,
      last_name: user.value.last_name
    }, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    editing.value = false
    alert('پروفایل با موفقیت بروزرسانی شد')
  } catch (error) {
    console.error('Failed to update profile:', error)
    alert('خطا در بروزرسانی پروفایل')
  }
}

// Fetch User Data & Referrals
const { data: pageData, pending: isLoading } = await useAsyncData('profile-data', async () => {
  if (!auth.token) return null
  
  const [userRes, inviteesRes, referralRes] = await Promise.all([
    $fetch(`${config.public.apiBase}/user`, { headers: { Authorization: `Bearer ${auth.token}` } }),
    $fetch(`${config.public.apiBase}/user/invitees`, { headers: { Authorization: `Bearer ${auth.token}` } }).catch(() => ({ invitees: [] })),
    $fetch(`${config.public.apiBase}/user/referral-code`, { headers: { Authorization: `Bearer ${auth.token}` } }).catch(() => ({ referral_code: '' }))
  ])

  return {
    user: (userRes as any).data || userRes, // UserResource wraps in data
    invitees: (inviteesRes as any).data || [], // UserResource collection wraps in data
    referralCode: (referralRes as any).data?.referral_code || (referralRes as any).referral_code || ''
  }
}, {
  watch: [() => auth.token],
  immediate: !!auth.token
})

watch(pageData, (newData) => {
  if (newData) {
    user.value = newData.user
    referrals.value = newData.invitees
    if (newData.referralCode) {
      referralLink.value = `https://t.me/${botUsername}?start=${newData.referralCode}`
    }
  }
}, { immediate: true })

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

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#FF8E8E] to-[#FFB6B6] text-white font-vazir overflow-x-hidden selection:bg-yellow-400 selection:text-black" dir="rtl">
    
    <!-- Background Elements -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-500/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
    </div>

    <div class="relative container mx-auto px-4 py-6 pb-32 max-w-md">
      
      <h1 class="text-3xl font-black text-center mb-6 text-white drop-shadow-md">پروفایل کاربری</h1>

      <!-- Tabs -->
      <div class="flex p-1 bg-white/20 backdrop-blur-md rounded-2xl mb-6 border border-white/30 shadow-lg">
        <button 
          @click="activeTab = 'profile'"
          class="flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300"
          :class="activeTab === 'profile' ? 'bg-white text-pink-600 shadow-md' : 'text-white/70 hover:bg-white/10'"
        >
          پروفایل من
        </button>
        <button 
          @click="activeTab = 'friends'"
          class="flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300"
          :class="activeTab === 'friends' ? 'bg-white text-pink-600 shadow-md' : 'text-white/70 hover:bg-white/10'"
        >
          دوستان ({{ referrals.length }})
        </button>
      </div>

      <AppLoading v-if="isLoading" />

      <!-- PROFILE TAB -->
      <div v-if="activeTab === 'profile'" class="animate-fade-in">
        <div class="bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-[24px] shadow-xl mb-6">
          <div class="text-center mb-6">
            <div class="relative inline-block">
              <img 
                src="/mascot.png" 
                alt="Profile Picture" 
                class="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/40 shadow-lg bg-white/10 object-cover"
              />
            </div>
            <h2 class="text-xl font-black text-white drop-shadow-sm">{{ user.first_name }} {{ user.last_name }}</h2>
            <p class="text-white/80 text-sm dir-ltr font-bold">@{{ user.username || 'No Username' }}</p>
            <p class="text-white/60 text-xs mt-1 font-medium">شناسه: {{ user.telegram_id }}</p>
            <p class="text-white/60 text-xs mt-1 font-medium">عضویت: {{ new Date(user.created_at).toLocaleDateString('fa-IR') }}</p>
          </div>

          <div v-if="editing" class="space-y-4">
            <div>
              <label class="block text-white/90 text-xs font-bold mb-2">نام</label>
              <input v-model="user.first_name" class="w-full bg-white/20 border border-white/30 text-white placeholder-white/50 p-3 rounded-xl focus:outline-none focus:border-yellow-300 transition-colors font-bold" />
            </div>
            <div>
              <label class="block text-white/90 text-xs font-bold mb-2">نام خانوادگی</label>
              <input v-model="user.last_name" class="w-full bg-white/20 border border-white/30 text-white placeholder-white/50 p-3 rounded-xl focus:outline-none focus:border-yellow-300 transition-colors font-bold" />
            </div>
            <div class="flex gap-2 pt-2">
              <button @click="saveProfile" class="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-transform active:scale-95 border border-white/20">ذخیره تغییرات</button>
              <button @click="editing = false" class="px-4 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors border border-white/20 font-bold">لغو</button>
            </div>
          </div>

          <div v-else>
            <button @click="startEditing" class="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-4 rounded-xl border border-white/30 transition-all flex items-center justify-center gap-2 shadow-sm">
              <UIcon name="i-heroicons-pencil-square" class="w-5 h-5"/>
              ویرایش پروفایل
            </button>
          </div>
        </div>

        <div class="bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-[24px] shadow-xl">
          <h2 class="text-lg font-black mb-4 flex items-center gap-2 text-red-100 drop-shadow-sm">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5"/>
            منطقه خطر
          </h2>
          <button class="w-full bg-red-500/20 hover:bg-red-500/30 text-red-100 border border-red-200/30 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-inner">
            <UIcon name="i-heroicons-trash" class="w-5 h-5"/>
            خروج از حساب
          </button>
        </div>
      </div>

      <!-- FRIENDS TAB -->
      <div v-else class="animate-fade-in">
        <!-- Referral Link Card -->
        <div class="bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-[24px] mb-8 relative overflow-hidden shadow-xl group hover:bg-white/25 transition-all duration-300">
           <div class="absolute top-0 right-0 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
           
           <div class="text-center mb-6">
             <h2 class="font-black text-xl text-white drop-shadow-sm mb-1">لینک اختصاصی شما</h2>
             <p class="text-xs text-white/80 font-bold">این لینک رو برای دوستانت بفرست 👇</p>
           </div>

           <div class="bg-black/10 rounded-2xl p-2 flex items-center gap-2 mb-4 border border-white/20 backdrop-blur-sm">
             <button @click="copyLink" class="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-xl transition-colors border border-white/10 shadow-sm">
               <UIcon name="i-heroicons-clipboard" class="w-5 h-5"/>
             </button>
             <div class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left text-sm font-mono text-white font-bold dir-ltr px-2">
               {{ referralLink }}
             </div>
           </div>

           <button @click="shareOnTelegram" class="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-black rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/20">
             <UIcon name="i-heroicons-paper-airplane" class="w-5 h-5 rotate-[-45deg]"/>
             ارسال در تلگرام
           </button>
        </div>

        <!-- Friends List -->
        <div>
          <div class="flex justify-between items-center mb-4 px-2">
            <h2 class="text-xl font-black text-white flex items-center gap-2 drop-shadow-sm">
              <span class="w-2 h-6 bg-yellow-400 rounded-full shadow-sm"></span>
              لیست دوستان
            </h2>
          </div>

          <div v-if="referrals.length === 0" class="text-center py-12 opacity-80">
            <div class="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-inner">
              <UIcon name="i-heroicons-users" class="w-12 h-12 text-white/80"/>
            </div>
            <p class="text-white font-bold text-lg">هنوز کسی رو دعوت نکردی!</p>
            <p class="text-white/70 text-sm mt-1">اولین نفر باش که دوستاشو میاره 😉</p>
          </div>

          <div v-else class="space-y-3">
            <div v-for="friend in referrals" :key="friend.id" class="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-3 flex items-center gap-3 hover:bg-white/30 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]">
              <div class="w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl flex items-center justify-center text-white font-black shadow-md text-xl border border-white/20">
                {{ (friend.first_name || 'U').charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0 text-right">
                 <p class="font-black text-sm truncate text-white drop-shadow-sm">
                    {{ friend.first_name || '' }} {{ friend.last_name || '' }}
                 </p>
                 <p class="text-xs text-white/70 font-bold truncate dir-ltr mt-0.5">
                    {{ friend.username ? '@' + friend.username : 'ID: ' + (friend.telegram_id ? friend.telegram_id.slice(-4) : '***') }}
                 </p>
              </div>
              <div class="text-xs font-black text-yellow-300 bg-black/20 px-2.5 py-1.5 rounded-xl border border-white/10 backdrop-blur-sm flex items-center gap-1">
                <span>+1</span>
                <span class="text-sm">🎟️</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-pulse-slow {
    animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
