<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12" style="background:var(--bg)">
    <div class="card p-8 w-full max-w-md">

      <!-- Step 1: Enter email -->
      <div v-if="step === 1">
        <h1 class="font-display text-3xl font-bold mb-2 text-center">Forgot Password</h1>
        <p class="text-gray-500 text-center text-sm mb-8">Enter your email and we'll send you an OTP</p>
        <form @submit.prevent="sendOtp" class="space-y-4">
          <input v-model="email" type="email" placeholder="Your email address" class="input" required />
          <p v-if="error" class="text-red-400 text-sm bg-red-900/20 rounded-lg px-3 py-2">{{ error }}</p>
          <button type="submit" :disabled="loading" class="btn-primary w-full text-center disabled:opacity-60">
            {{ loading ? 'Sending OTP...' : 'Send OTP' }}
          </button>
        </form>
        <p class="text-center text-sm text-gray-500 mt-6">
          <RouterLink to="/login" class="text-ink-accent hover:underline">← Back to Login</RouterLink>
        </p>
      </div>

      <!-- Step 2: Enter OTP -->
      <div v-if="step === 2">
        <h1 class="font-display text-3xl font-bold mb-2 text-center">Enter OTP</h1>
        <p class="text-gray-500 text-center text-sm mb-2">We sent a 6-digit code to</p>
        <p class="text-ink-accent text-center text-sm font-semibold mb-8">{{ email }}</p>
        <form @submit.prevent="verifyOtp" class="space-y-4">
          <input v-model="otp" placeholder="6-digit OTP" class="input text-center text-2xl tracking-widest"
            maxlength="6" inputmode="numeric" required />
          <p v-if="error" class="text-red-400 text-sm bg-red-900/20 rounded-lg px-3 py-2">{{ error }}</p>
          <button type="submit" :disabled="loading" class="btn-primary w-full text-center disabled:opacity-60">
            {{ loading ? 'Verifying...' : 'Verify OTP' }}
          </button>
        </form>
        <p class="text-center text-sm text-gray-500 mt-4">
          Didn't get it?
          <button @click="sendOtp" class="text-ink-accent hover:underline">Resend OTP</button>
        </p>
      </div>

      <!-- Step 3: New password -->
      <div v-if="step === 3">
        <h1 class="font-display text-3xl font-bold mb-2 text-center">New Password</h1>
        <p class="text-gray-500 text-center text-sm mb-8">Choose a strong new password</p>
        <form @submit.prevent="resetPassword" class="space-y-4">
          <input v-model="newPassword" type="password" placeholder="New password (min 6 chars)"
            class="input" minlength="6" required />
          <input v-model="confirmPassword" type="password" placeholder="Confirm new password"
            class="input" required />
          <p v-if="error" class="text-red-400 text-sm bg-red-900/20 rounded-lg px-3 py-2">{{ error }}</p>
          <button type="submit" :disabled="loading" class="btn-primary w-full text-center disabled:opacity-60">
            {{ loading ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>
      </div>

      <!-- Step 4: Success -->
      <div v-if="step === 4" class="text-center space-y-4">
        <div class="text-6xl">✅</div>
        <h2 class="font-display text-2xl font-bold">Password Reset!</h2>
        <p class="text-gray-400 text-sm">Your password has been updated successfully.</p>
        <RouterLink to="/login" class="btn-primary inline-block mt-2">Login Now</RouterLink>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { authApi } from '@/lib/api'

const step = ref(1)
const email = ref('')
const otp = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

async function sendOtp() {
  error.value = ''
  loading.value = true
  try {
    await authApi.forgotPassword(email.value)
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
    await authApi.verifyOtp(email.value, otp.value)
    step.value = 3
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function resetPassword() {
  error.value = ''
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  loading.value = true
  try {
    await authApi.resetPassword(email.value, otp.value, newPassword.value)
    step.value = 4
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
