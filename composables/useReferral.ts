import { ref, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '~/stores/auth'

// این تابع Composable ماست
export const useReferral = () => {
  const auth = useAuthStore()
  const referralLink = ref('')
  const botUsername = 'LotteryAbolBot' // Your bot's username

  // این watch توکن را زیر نظر می‌گیرد و لینک را می‌سازد
  watch(
    () => auth.token,
    async (newToken) => {
      if (newToken) {
        try {
          const res = await axios.get('https://www.monopolies.ir/api/user/referral-code', {
            headers: { Authorization: `Bearer ${newToken}` }
          })
          const referralCode = res.data.referral_code
          referralLink.value = `https://t.me/${botUsername}?start=${referralCode}`
        } catch (err) {
          console.error("Failed to fetch referral code:", err)
          referralLink.value = `https://t.me/${botUsername}` // Fallback link
        }
      }
    },
    { immediate: true }
  )

  // این تابع، منطق اشتراک‌گذاری را انجام می‌دهد
  const shareOnTelegram = () => {
    if (!auth.token || !referralLink.value) {
      alert('برای دریافت لینک دعوت، ابتدا باید وارد شوید.');
      return;
    }
    const shareText = "بیا با هم جایزه ببریم! با لینک من تو این لاتاری باحال ثبت‌نام کن و کلی جایزه ببر:";
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink.value)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  }

  // هر چیزی که کامپوننت‌ها به آن نیاز دارند را برمی‌گردانیم
  return {
    referralLink,
    shareOnTelegram
  }
}
