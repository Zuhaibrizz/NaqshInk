<template>
  <button @click="pay" :disabled="loading"
    class="btn-primary w-full text-center flex items-center justify-center gap-2 disabled:opacity-60">
    <span v-if="loading">Processing...</span>
    <span v-else>Pay ₹{{ amount }} via Razorpay</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  amount: Number,       // in INR
  name: String,
  email: String,
  phone: String,
  orderId: String
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
