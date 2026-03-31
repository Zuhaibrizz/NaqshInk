import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('naqshink_user') || 'null'))

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  function login(email, password) {
    // Simulate auth — replace with real API call
    const users = JSON.parse(localStorage.getItem('naqshink_users') || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid credentials')
    user.value = found
    localStorage.setItem('naqshink_user', JSON.stringify(found))
    return found
  }

  function register(name, email, password) {
    const users = JSON.parse(localStorage.getItem('naqshink_users') || '[]')
    if (users.find(u => u.email === email)) throw new Error('Email already exists')
    const newUser = { id: Date.now(), name, email, password, role: 'user' }
    users.push(newUser)
    localStorage.setItem('naqshink_users', JSON.stringify(users))
    user.value = newUser
    localStorage.setItem('naqshink_user', JSON.stringify(newUser))
    return newUser
  }

  function logout() {
    user.value = null
    localStorage.removeItem('naqshink_user')
  }

  // Seed admin on first load
  function seedAdmin() {
    const users = JSON.parse(localStorage.getItem('naqshink_users') || '[]')
    if (!users.find(u => u.email === 'admin@naqshink.in')) {
      users.push({ id: 1, name: 'Admin', email: 'admin@naqshink.in', password: 'admin123', role: 'admin' })
      localStorage.setItem('naqshink_users', JSON.stringify(users))
    }
  }

  seedAdmin()

  return { user, isLoggedIn, isAdmin, login, register, logout }
})
