<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12" style="background:var(--bg)">
    <div class="w-full max-w-md">
      <div class="card p-8">

        <!-- Step 1: Details + password -->
        <div v-if="step === 1">
          <h1 class="font-display text-3xl font-bold mb-2 text-center">Create Account</h1>
          <p class="text-gray-500 text-center text-sm mb-8">Join the NAQSHINK community</p>

          <form @submit.prevent="sendOtp" class="space-y-4">
            <input v-model="name" placeholder="Full Name" class="input" required />
            <input v-model="email" type="email" placeholder="Email Address" class="input" required />

            <div>
              <input v-model="password" type="password" placeholder="Password" class="input" required />
              <!-- Strength indicator -->
              <div class="mt-2 space-y-1">
                <div class="flex gap-1">
                  <div v-for="i in 4" :key="i" class="h-1 flex-1 rounded-full transition-all duration-300"
                    :style="strengthScore >= i ? `background:${strengthColor}` : 'background:var(--border)'"></div>
                </div>
                <p class="text-xs" :style="`color:${strengthColor}`">{{ strengthLabel }}</p>
                <ul class="text-xs space-y-0.5" style="color:var(--text-faint)">
                  <li :class="checks.length ? 'text-green-400' : ''">{{ checks.length ? '✓' : '○' }} Min 8 characters</li>
                  <li :class="checks.upper ? 'text-green-400' : ''">{{ checks.upper ? '✓' : '○' }} Uppercase letter</li>
                  <li :class="checks.lower ? 'text-green-400' : ''">{{ checks.lower ? '✓' : '○' }} Lowercase letter</li>
                  <li :class="checks.number ? 'text-green-400' : ''">{{ checks.number ? '✓' : '○' }} Number</li>
                  <li :class="checks.special ? 'text-green-400' : ''">{{ checks.special ? '✓' : '○' }} Special character (!@#$...)</li>
                </ul>
              </div>
            </div>

            <input v-model="confirmPassword" type="password" placeholder="Confirm Password" class="input" required />
            <p v-if="confirmPassword && password !== confirmPassword" class="text-red-400 text-xs">Passwords do not match</p>

            <p v-if="error" class="text-red-400 text-sm bg-red-900/20 rounded-lg px-3 py-2">{{ error }}</p>
            <button type="submit" :disabled="loading || !isPasswordValid || password !== confirmPassword"
              class="btn-primary w-full text-center disabled:opacity-50">
              {{ loading ? 'Sending OTP...' : 'Send Verification Code' }}
            </button>
          </form>

          <p class="text-center text-sm text-gray-500 mt-6">
            Already have an account?
            <RouterLink to="/login" class="text-ink-accent hover:underline">Sign In</RouterLink>
          </p>
        </div>

        <!-- Step 2: OTP verification -->
        <div v-if="step === 2">
          <h1 class="font-display text-3xl font-bold mb-2 text-center">Verify Email</h1>
          <p class="text-gray-500 text-center text-sm mb-2">We sent a 6-digit code to</p>
          <p class="text-ink-accent text-center font-semibold text-sm mb-8">{{ email }}</p>

          <form @submit.prevent="verifyOtp" class="space-y-4">
            <input v-model="otp" placeholder="6-digit code" class="input text-center text-2xl tracking-widest"
              maxlength="6" inputmode="numeric" required />
            <p v-if="error" class="text-red-400 text-sm bg-red-900/20 rounded-lg px-3 py-2">{{ error }}</p>
            <button type="submit" :disabled="loading" class="btn-primary w-full text-center disabled:opacity-50">
              {{ loading ? 'Verifying...' : 'Verify & Create Account' }}
            </button>
          </form>

          <p class="text-center text-sm text-gray-500 mt-4">
            Didn't get it?
            <button @click="sendOtp" class="text-ink-accent hover:underline">Resend code</button>
          </p>
        </div>

        <!-- Step 3: Success -->
        <div v-if="step === 3" class="text-center space-y-4">
          <div class="text-6xl">🎉</div>
          <h2 class="font-display text-2xl font-bold">Account Created!</h2>
          <p class="text-gray-400 text-sm">Welcome to NAQSHINK, {{ name }}!</p>
          <RouterLink to="/" class="btn-primary inline-block mt-2">Start Shopping</RouterLink>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/lib/api'

const auth = useAuthStore()
const router = useRouter()

const step = ref(1)
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const otp = ref('')
const error = ref('')
const loading = ref(false)

// ── Password strength ──
const checks = computed(() => ({
  length:  password.value.length >= 8,
  upper:   /[A-Z]/.test(password.value),
  lower:   /[a-z]/.test(password.value),
  number:  /[0-9]/.test(password.value),
  special: /[^A-Za-z0-9]/.test(password.value),
}))

const strengthScore = computed(() => Object.values(checks.value).filter(Boolean).length - 1)

const isPasswordValid = computed(() => Object.values(checks.value).every(Boolean))

const strengthColor = computed(() => ['#ef4444','#f97316','#eab308','#22c55e'][strengthScore.value] || '#ef4444')
const strengthLabel = computed(() => ['Too weak','Weak','Fair','Strong','Very strong'][strengthScore.value] || '')

async function sendOtp() {
  error.value = ''
  if (!isPasswordValid.value) { error.value = 'Password does not meet requirements'; return }
  if (password.value !== confirmPassword.value) { error.value = 'Passwords do not match'; return }
  loading.value = true
  try {
    await authApi.registerInit(name.value, email.value, password.value)
    step.value = 2
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function verifyOtp() {
  error.value = ''
  loading.value = true
  try {
    const data = await authApi.registerVerify(email.value, otp.value)
    auth.setSession(data)
    step.value = 3
    setTimeout(() => router.push('/'), 2000)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
