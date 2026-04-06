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
import { paymentApi } from '@/lib/api'

const props = defineProps({
  amount: Number,
  name: String,
  email: String,
  phone: String,
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['success', 'failure'])
const loading = ref(false)

async function pay() {
  loading.value = true
  try {
    // Create order on backend first
    const order = await paymentApi.createOrder(props.amount)

    const options = {
      key:      import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:   order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name:     'NAQSHINK',
      description: 'Semi-Permanent Tattoo Order',
      image:    'https://via.placeholder.com/60x60/c8a96e/000?text=INK',
      prefill:  { name: props.name, email: props.email, contact: props.phone },
      theme:    { color: '#c8a96e' },
      async handler(response) {
        try {
          // Verify signature on backend
          await paymentApi.verify(response)
          loading.value = false
          emit('success', response)
        } catch {
          loading.value = false
          emit('failure', 'Payment verification failed')
        }
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
  } catch (e) {
    loading.value = false
    emit('failure', e.message)
  }
}
</script>
