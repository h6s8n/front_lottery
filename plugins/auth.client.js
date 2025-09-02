import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const auth = useAuthStore()
  const route = useRoute()

  // ۱. در اولین بارگذاری، توکن را از حافظه محلی (localStorage) بارگذاری کن
  auth.loadToken()

  // ۲. در اولین بارگذاری، چک کن که آیا توکنی در URL وجود دارد یا نه
  if (route.query.token) {
    auth.setToken(route.query.token)
  }

  // ۳. بعد از هر تغییر مسیر (navigation)، دوباره URL را برای وجود توکن چک کن
  nuxtApp.hook('page:finish', () => {
    const currentRoute = useRoute()
    if (currentRoute.query.token) {
      auth.setToken(currentRoute.query.token)
    }
  })
})
