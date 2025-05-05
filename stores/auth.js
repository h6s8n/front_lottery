import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null
  }),
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('auth_token', token)
    },
    loadToken() {
      const token = localStorage.getItem('auth_token')
      if (token) this.token = token
    },
    logout() {
      this.token = null
      localStorage.removeItem('auth_token')
    }
  }
}) 