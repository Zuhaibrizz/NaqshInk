<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12" style="background:var(--bg)">
    <div class="w-full max-w-4xl grid md:grid-cols-2 gap-8">

      <!-- Login form -->
      <div class="card p-8">
        <h1 class="font-display text-3xl font-bold mb-2 text-center">Welcome Back</h1>
        <p class="text-gray-500 text-center text-sm mb-8">Sign in to your NAQSHINK account</p>

        <form @submit.prevent="submit" class="space-y-4">
          <input v-model="email" type="email" placeholder="Email" class="input" required />
          <input v-model="password" type="password" placeholder="Password" class="input" required />
          <div class="flex justify-end">
            <RouterLink to="/forgot-password" class="text-xs text-ink-accent hover:underline">Forgot password?</RouterLink>
          </div>
          <p v-if="error" class="text-red-400 text-sm bg-red-900/20 rounded-lg px-3 py-2">{{ error }}</p>
          <button type="submit" class="btn-primary w-full text-center">Sign In</button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          Don't have an account?
          <RouterLink to="/register" class="text-ink-accent hover:underline">Register</RouterLink>
        </p>
      </div>

      <!-- Setup guide -->
      <div class="space-y-4">
        <!-- Admin access -->
        <div class="card p-6 border-yellow-600/40">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-xl">🔐</span>
            <h3 class="font-semibold text-yellow-400">Admin Access</h3>
          </div>
          <p class="text-gray-400 text-sm mb-4">Use these credentials to access the full admin panel:</p>
          <div class="bg-ink-black rounded-xl p-4 font-mono text-sm space-y-2 border border-ink-gray">
            <div class="flex justify-between">
              <span class="text-gray-500">Email</span>
              <button @click="fillAdmin" class="text-ink-accent hover:underline">admin@naqshink.in</button>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Password</span>
              <span class="text-white">admin123</span>
            </div>
          </div>
          <button @click="fillAdmin" class="mt-4 w-full text-center text-sm bg-yellow-900/30 border border-yellow-600/40 text-yellow-400 rounded-xl py-2.5 hover:bg-yellow-900/50 transition">
            → Fill & Login as Admin
          </button>
          <div class="mt-4 space-y-2 text-xs text-gray-500">
            <p class="font-medium text-gray-400">Admin can:</p>
            <p>📊 View dashboard overview & revenue</p>
            <p>🎨 Add / edit / delete products</p>
            <p>📦 Manage & update order statuses</p>
            <p>✏️ Review custom design requests & set prices</p>
            <p>🏷️ Create coupon codes & offers</p>
            <p>👥 View all customers & their orders</p>
          </div>
        </div>

        <!-- User access -->
        <div class="card p-6">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-xl">👤</span>
            <h3 class="font-semibold text-ink-accent">User Account</h3>
          </div>
          <p class="text-gray-400 text-sm mb-3">Register a new account to get full user access:</p>
          <div class="space-y-2 text-xs text-gray-500">
            <p>🛒 Browse & purchase tattoo designs</p>
            <p>📦 Track your orders with live status timeline</p>
            <p>✏️ Submit custom tattoo designs via Custom Studio</p>
            <p>🎨 Upload any image — portrait, logo, signature</p>
            <p>🏷️ Apply coupon codes at checkout</p>
          </div>
          <RouterLink to="/register" class="mt-4 btn-primary w-full text-center text-sm block">
            Create User Account
          </RouterLink>
        </div>

        <!-- Quick nav -->
        <div class="card p-4">
          <p class="text-xs text-gray-500 mb-3 font-medium">Quick Navigation</p>
          <div class="grid grid-cols-2 gap-2">
            <RouterLink to="/shop" class="text-xs bg-ink-gray hover:bg-ink-accent hover:text-ink-black transition rounded-lg px-3 py-2 text-center">🛍️ Shop</RouterLink>
            <RouterLink to="/custom-studio" class="text-xs bg-ink-gray hover:bg-ink-accent hover:text-ink-black transition rounded-lg px-3 py-2 text-center">✏️ Custom Studio</RouterLink>
            <RouterLink to="/" class="text-xs bg-ink-gray hover:bg-ink-accent hover:text-ink-black transition rounded-lg px-3 py-2 text-center">🏠 Home</RouterLink>
            <RouterLink to="/cart" class="text-xs bg-ink-gray hover:bg-ink-accent hover:text-ink-black transition rounded-lg px-3 py-2 text-center">🛒 Cart</RouterLink>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

function fillAdmin() {
  email.value = 'admin@naqshink.in'
  password.value = 'admin123'
  submit()
}

async function submit() {
  error.value = ''
  try {
    const user = await auth.login(email.value, password.value)
    router.push(user.role === 'admin' ? '/admin/overview' : '/')
  } catch (e) {
    error.value = e.message
  }
}
</script>
