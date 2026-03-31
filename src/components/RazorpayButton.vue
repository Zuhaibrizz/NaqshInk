<template>
  <button @click="pay" :disabled="disabled || loading"
    class="w-full text-center flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-full transition-all duration-300"
    :class="disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer hover:brightness-110'"
    :style="disabled
      ? 'background:var(--bg-input);color:var(--text-faint);border:1px solid var(--border)'
      : 'background:var(--accent);color:#0a0a0a'">
    <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
    <span v-if="loading">Processing...</span>
    <span v-else-if="disabled">Complete form to pay</span>
    <span v-else>🔒 Pay ₹{{ amount }} via Razorpay</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  amount: Number,
  name: String,
  email: String,
  phone: String,
  orderId: String,
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['success', 'failure'])
const loading = ref(false)

function pay() {
  loading.value = true

  // NOTE: In production, create order on your backend and pass server-generated order_id
  // Replace 'YOUR_RAZORPAY_KEY_ID' with your actual key
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: props.amount * 100, // paise
    currency: 'INR',
    name: 'NAQSHINK',
    description: 'Semi-Permanent Tattoo Order',
    image: 'https://via.placeholder.com/60x60/c8a96e/000?text=INK',
    // order_id: props.orderId, // from backend
    prefill: {
      name: props.name,
      email: props.email,
      contact: props.phone
    },
    theme: { color: '#c8a96e' },
    handler(response) {
      loading.value = false
      emit('success', response)
    },
    modal: {
      ondismiss() {
        loading.value = false
        emit('failure', 'Payment cancelled')
      }
    }
  }

  const rzp = new window.Razorpay(options)
  rzp.on('payment.failed', (res) => {
    loading.value = false
    emit('failure', res.error.description)
  })
  rzp.open()
}
</script>
