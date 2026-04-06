<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background:var(--bg)">
    <div class="w-full max-w-md">
      <div class="card p-8">
        <h1 class="font-display text-3xl font-bold mb-2 text-center">Create Account</h1>
        <p class="text-gray-500 text-center text-sm mb-8">Join the NAQSHINK community</p>

        <form @submit.prevent="submit" class="space-y-4">
          <input v-model="name" placeholder="Full Name" class="input" required />
          <input v-model="email" type="email" placeholder="Email" class="input" required />
          <input v-model="password" type="password" placeholder="Password (min 6 chars)" class="input" required minlength="6" />
          <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
          <button type="submit" class="btn-primary w-full text-center">Create Account</button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          Already have an account?
          <RouterLink to="/login" class="text-ink-accent hover:underline">Sign In</RouterLink>
        </p>
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
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

async function submit() {
  try {
    await auth.register(name.value, email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.message
  }
}
</script>
