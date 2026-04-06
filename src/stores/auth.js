import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/lib/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('naqshink_user') || 'null'))
  const token = ref(localStorage.getItem('naqshink_token') || null)

  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const isAdmin    = computed(() => user.value?.role === 'admin')

  function setSession(data) {
    token.value = data.token
    user.value  = data.user
    localStorage.setItem('naqshink_token', data.token)
    localStorage.setItem('naqshink_user',  JSON.stringify(data.user))
  }

  async function login(email, password) {
    const data = await authApi.login(email, password)
    setSession(data)
    return data.user
  }

  async function register(name, email, password) {
    const data = await authApi.register(name, email, password)
    setSession(data)
    return data.user
  }

  async function updateProfile(form) {
    const updated = await authApi.profile(form)
    user.value = { ...user.value, ...updated }
    localStorage.setItem('naqshink_user', JSON.stringify(user.value))
    return updated
  }

  async function changePassword(current, newPassword) {
    return authApi.password(current, newPassword)
  }

  function logout() {
    user.value  = null
    token.value = null
    localStorage.removeItem('naqshink_token')
    localStorage.removeItem('naqshink_user')
  }

  return { user, token, isLoggedIn, isAdmin, login, register, logout, updateProfile, changePassword }
})
