<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#FF8E8E] to-[#FFB6B6] font-vazir p-4" dir="rtl">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-4xl font-extrabold mb-4 text-shadow text-right text-white">دعوت دوستان</h1>
      <p class="mb-6 text-lg text-white/90 text-right">لینک دعوتت رو با دوستانت به اشتراک بذار و جایزه بگیر!</p>

      <div v-if="!isLoggedIn" class="mb-6">
        <div class="bg-yellow-100/90 text-yellow-800 p-4 rounded-2xl text-right shadow-lg">برای مشاهده اطلاعات دعوت، ابتدا وارد شوید.</div>
      </div>

      <div v-else>
        <div class="bg-white/20 p-6 rounded-2xl backdrop-blur-sm mb-6 flex flex-col md:flex-row-reverse md:items-center md:justify-between gap-4 shadow-xl">
          <div class="flex-1">
            <h2 class="text-xl font-bold text-white mb-2 text-right">لینک دعوت شما</h2>
            <div class="flex gap-2 mb-2 flex-row-reverse">
              <input :value="referralLink" readonly class="flex-1 bg-white/30 text-white p-2 rounded-lg text-right placeholder:text-white/70 focus:outline-none" />
              <button @click="copyLink"
                class="bg-gradient-to-r from-[#FF9F43] to-[#FF6B6B] hover:from-[#FF6B6B] hover:to-[#FF9F43] text-white px-4 py-2 rounded-lg font-bold shadow transition-all duration-300">
                کپی
              </button>
            </div>
            <button @click="shareOnTelegram"
              class="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow transition-all duration-300">
              اشتراک‌گذاری در تلگرام
            </button>
          </div>
          <div class="flex flex-col items-center justify-center">
            <UIcon name="i-heroicons-gift" class="w-14 h-14 text-yellow-300 mb-2 drop-shadow" />
            <span class="text-white text-right">دوستات رو دعوت کن و جایزه بگیر!</span>
          </div>
        </div>

        <div class="mt-6">
          <h2 class="text-2xl font-bold mb-4 text-right text-white">دوستان دعوت‌شده شما</h2>
          <div v-if="referrals.length === 0" class="text-white/80 text-right">هنوز کسی را دعوت نکرده‌اید.</div>
          <div v-if="referrals.length === 0" class="text-white/80 text-right font-bold bg-white/20 rounded-xl p-4 mt-2 shadow">
            شما هنوز دوستی را دعوت نکرده‌اید.
          </div>
          <ul v-else class="bg-white/20 p-4 rounded-2xl text-white text-right shadow">
            <li v-for="friend in referrals" :key="friend.id" class="mb-2 flex items-center gap-2 flex-row-reverse">
              <UIcon name="i-heroicons-user" class="w-5 h-5 text-blue-300" />
              <span>
                <template v-if="friend.first_name || friend.last_name">
                  {{ friend.first_name || '' }} {{ friend.last_name || '' }}
                  <span v-if="friend.username">(@{{ friend.username }})</span>
                </template>
                <template v-else-if="friend.username">
                  @{{ friend.username }}
                </template>
                <template v-else>
                  بدون نام ({{ friend.telegram_id ? friend.telegram_id.slice(-4) : friend.id }})
                </template>
              </span>
            </li>
          </ul>
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
        const resInvitees = await axios.get('http://46.21.93.232:8000/api/user/invitees', {
          headers: { Authorization: `Bearer ${newToken}` }
        })
        referrals.value = resInvitees.data.invitees
      } catch (err) {
        referrals.value = []
      }
      try {
        const resReferral = await axios.get('http://46.21.93.232:8000/api/user/referral-code', {
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
  text-shadow: 2px 2px 8px rgba(0,0,0,0.18);
}
</style>
