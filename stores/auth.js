import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)

  // Initialize from cookie (works on server and client)
  const tokenCookie = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/'
  })

  // Sync state with cookie immediately if available
  if (tokenCookie.value) {
    token.value = tokenCookie.value
  }

  function setToken(newToken) {
    token.value = newToken
    tokenCookie.value = newToken
  }

  function loadToken() {
    if (tokenCookie.value) {
      token.value = tokenCookie.value
    }
  }

  function logout() {
    token.value = null
    tokenCookie.value = null
  }

  return { token, setToken, loadToken, logout }
})