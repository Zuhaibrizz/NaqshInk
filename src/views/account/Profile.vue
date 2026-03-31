<template>
  <div class="page-top min-h-screen max-w-4xl mx-auto px-4 py-12">
    <div class="flex items-center gap-4 mb-10" data-reveal>
      <RouterLink to="/account" class="text-gray-500 hover:text-white transition text-sm">← My Orders</RouterLink>
      <span class="text-gray-700">/</span>
      <span class="text-gray-400 text-sm">Profile</span>
    </div>

    <div class="grid md:grid-cols-3 gap-8">
      <!-- Avatar card -->
      <div class="card p-8 text-center h-fit" data-reveal>
        <div class="w-24 h-24 rounded-full bg-ink-accent/20 border-2 border-ink-accent flex items-center justify-center text-4xl font-bold text-ink-accent mx-auto mb-4">
          {{ auth.user?.name?.[0]?.toUpperCase() }}
        </div>
        <h2 class="font-display text-xl font-bold">{{ auth.user?.name }}</h2>
        <p class="text-gray-500 text-sm mt-1">{{ auth.user?.email }}</p>
        <span class="badge mt-3 inline-block capitalize">{{ auth.user?.role }}</span>

        <div class="mt-6 space-y-2 text-sm">
          <div class="flex justify-between text-gray-400">
            <span>Total Orders</span>
            <span class="text-white font-semibold">{{ myOrders.length }}</span>
          </div>
          <div class="flex justify-between text-gray-400">
            <span>Total Spent</span>
            <span class="text-ink-accent font-bold">₹{{ totalSpent }}</span>
          </div>
          <div class="flex justify-between text-gray-400">
            <span>Custom Designs</span>
            <span class="text-white font-semibold">{{ myCustom.length }}</span>
          </div>
        </div>

        <button @click="auth.logout(); $router.push('/')"
          class="mt-6 w-full text-sm text-red-400 border border-red-900/40 rounded-xl py-2.5 hover:bg-red-900/20 transition">
          Logout
        </button>
      </div>

      <!-- Edit profile -->
      <div class="md:col-span-2 space-y-6">
        <div class="card p-8" data-reveal>
          <h3 class="font-semibold text-lg mb-6">Edit Profile</h3>
          <form @submit.prevent="saveProfile" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs text-gray-500 mb-1 block">Full Name</label>
                <input v-model="form.name" class="input" placeholder="Your name" />
              </div>
              <div>
                <label class="text-xs text-gray-500 mb-1 block">Phone</label>
                <input v-model="form.phone" class="input" placeholder="+91 XXXXX XXXXX" type="tel" />
              </div>
            </div>
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Email</label>
              <input v-model="form.email" class="input opacity-50 cursor-not-allowed" type="email" disabled />
              <p class="text-xs text-gray-600 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label class="text-xs text-gray-500 mb-1 block">Default Address</label>
              <input v-model="form.address" class="input" placeholder="Street address" />
            </div>
            <div class="grid grid-cols-3 gap-3">
              <input v-model="form.city" class="input" placeholder="City" />
              <input v-model="form.state" class="input" placeholder="State" />
              <input v-model="form.pincode" class="input" placeholder="Pincode" />
            </div>
            <p v-if="saved" class="text-green-400 text-sm">✓ Profile updated!</p>
            <button type="submit" class="btn-primary">Save Changes</button>
          </form>
        </div>

        <!-- Change password -->
        <div class="card p-8" data-reveal>
          <h3 class="font-semibold text-lg mb-6">Change Password</h3>
          <form @submit.prevent="changePassword" class="space-y-4">
            <input v-model="pwd.current" type="password" placeholder="Current Password" class="input" />
            <input v-model="pwd.new" type="password" placeholder="New Password (min 6 chars)" class="input" minlength="6" />
            <input v-model="pwd.confirm" type="password" placeholder="Confirm New Password" class="input" />
            <p v-if="pwdError" class="text-red-400 text-sm">{{ pwdError }}</p>
            <p v-if="pwdSaved" class="text-green-400 text-sm">✓ Password updated!</p>
            <button type="submit" class="btn-outline">Update Password</button>
          </form>
        </div>

        <!-- Recent orders mini -->
        <div class="card p-6" data-reveal>
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold">Recent Orders</h3>
            <RouterLink to="/account" class="text-xs text-ink-accent hover:underline">View all</RouterLink>
          </div>
          <div v-if="myOrders.length === 0" class="text-center py-6 text-gray-500 text-sm">No orders yet.</div>
          <div v-else class="space-y-3">
            <div v-for="o in myOrders.slice(0,3)" :key="o.id"
              class="flex items-center justify-between py-2 border-b border-ink-gray last:border-0">
              <div>
                <p class="font-mono text-xs text-ink-accent">{{ o.id }}</p>
                <p class="text-xs text-gray-500">{{ new Date(o.createdAt).toLocaleDateString('en-IN') }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-sm">₹{{ o.total }}</p>
                <span :class="statusClass(o.status)" class="text-xs px-2 py-0.5 rounded-full capitalize">{{ o.status }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/orders'
import { useCustomOrderStore } from '@/stores/customOrders'
import { useScrollReveal } from '@/composables/useScrollReveal'

useScrollReveal()
const auth = useAuthStore()
const orderStore = useOrderStore()
const customStore = useCustomOrderStore()

const myOrders = computed(() => orderStore.getByUser(auth.user?.id))
const myCustom = computed(() => customStore.getByUser(auth.user?.id))
const totalSpent = computed(() => myOrders.value.reduce((s, o) => s + o.total, 0))

const saved = ref(false)
const pwdError = ref('')
const pwdSaved = ref(false)

const form = ref({
  name: auth.user?.name || '',
  email: auth.user?.email || '',
  phone: auth.user?.phone || '',
  address: auth.user?.address || '',
  city: auth.user?.city || '',
  state: auth.user?.state || '',
  pincode: auth.user?.pincode || '',
})

const pwd = ref({ current: '', new: '', confirm: '' })

function saveProfile() {
  const users = JSON.parse(localStorage.getItem('naqshink_users') || '[]')
  const idx = users.findIndex(u => u.id === auth.user.id)
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...form.value }
    localStorage.setItem('naqshink_users', JSON.stringify(users))
    auth.user.name = form.value.name
    localStorage.setItem('naqshink_user', JSON.stringify(users[idx]))
  }
  saved.value = true
  setTimeout(() => saved.value = false, 3000)
}

function changePassword() {
  pwdError.value = ''
  const users = JSON.parse(localStorage.getItem('naqshink_users') || '[]')
  const user = users.find(u => u.id === auth.user.id)
  if (!user || user.password !== pwd.value.current) { pwdError.value = 'Current password is incorrect'; return }
  if (pwd.value.new !== pwd.value.confirm) { pwdError.value = 'Passwords do not match'; return }
  user.password = pwd.value.new
  localStorage.setItem('naqshink_users', JSON.stringify(users))
  pwd.value = { current: '', new: '', confirm: '' }
  pwdSaved.value = true
  setTimeout(() => pwdSaved.value = false, 3000)
}

function statusClass(s) {
  return { confirmed: 'bg-blue-900/40 text-blue-400', processing: 'bg-yellow-900/40 text-yellow-400', shipped: 'bg-purple-900/40 text-purple-400', delivered: 'bg-green-900/40 text-green-400', cancelled: 'bg-red-900/40 text-red-400' }[s] || 'bg-gray-700 text-gray-400'
}
</script>
