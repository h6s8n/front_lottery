import { ref, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '~/stores/auth'

export const useReferral = () => {
  const auth = useAuthStore()
  const config = useRuntimeConfig()
  const referralLink = ref('')
  const botUsername = 'LotteryAbolBot'
  const loading = ref(false)

  const fetchReferralCode = async () => {
    if (!auth.token) return
    loading.value = true
    try {
      const res = await axios.get(`${config.public.apiBase}/user/referral-code`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      })
      const referralCode = res.data.referral_code
      referralLink.value = `https://t.me/${botUsername}?start=${referralCode}`
    } catch (err) {
      console.error("Failed to fetch referral code:", err)
      // Fallback to generic bot link if fetch fails
      referralLink.value = `https://t.me/${botUsername}`
    } finally {
      loading.value = false
    }
  }

  watch(
    () => auth.token,
    (newToken) => {
      if (newToken) fetchReferralCode()
    },
    { immediate: true }
  )

  const shareOnTelegram = async () => {
    if (!auth.token) {
      alert('برای دریافت لینک دعوت، ابتدا باید وارد شوید.')
      return
    }

    if (!referralLink.value) {
      await fetchReferralCode()
    }

    const shareText = "بیا با هم جایزه ببریم! با لینک من تو این لاتاری باحال ثبت‌نام کن و کلی جایزه ببر:"
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink.value)}&text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
  }

  return {
    referralLink,
    shareOnTelegram,
    loading
  }
}
