<template>
  <div class="page-top min-h-screen max-w-5xl mx-auto px-4 py-12">
    <h1 class="font-display text-4xl font-bold mb-10">Checkout</h1>

    <div class="grid md:grid-cols-2 gap-10">
      <!-- Address form -->
      <div class="space-y-5">
        <h2 class="font-semibold text-lg text-ink-accent">Shipping Details</h2>
        <input v-model="form.name" placeholder="Full Name" class="input" />
        <input v-model="form.email" placeholder="Email Address" type="email" class="input" />
        <input v-model="form.phone" placeholder="Phone Number" type="tel" class="input" />
        <input v-model="form.address" placeholder="Street Address" class="input" />
        <div class="grid grid-cols-2 gap-4">
          <input v-model="form.city" placeholder="City" class="input" />
          <input v-model="form.pincode" placeholder="Pincode" class="input" />
        </div>
        <input v-model="form.state" placeholder="State" class="input" />

        <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
      </div>

      <!-- Order summary -->
      <div class="card p-6 h-fit space-y-4">
        <h2 class="font-semibold text-lg">Order Summary</h2>
        <div v-for="item in cart.items" :key="item.id" class="flex justify-between text-sm text-gray-400">
          <span>{{ item.name }} × {{ item.qty }}</span>
          <span>₹{{ item.price * item.qty }}</span>
        </div>
        <div v-if="autoDeal.discount > 0" class="flex justify-between text-sm text-green-400">
          <span>Multi-buy discount</span><span>−₹{{ autoDeal.discount }}</span>
        </div>
        <div class="flex justify-between text-sm text-gray-400">
          <span>Shipping</span>
          <span :class="cart.total >= 399 ? 'text-green-400' : ''">{{ cart.total >= 399 ? 'FREE' : '₹49' }}</span>
        </div>
        <div class="border-t border-ink-gray pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span class="text-ink-accent">₹{{ finalTotal }}</span>
        </div>

        <RazorpayButton
          :amount="finalTotal"
          :name="form.name"
          :email="form.email"
          :phone="form.phone"
          @success="onPaymentSuccess"
          @failure="onPaymentFailure"
        />
        <p class="text-xs text-gray-500 text-center">Secured by Razorpay · 256-bit SSL</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/orders'
import { useOfferStore } from '@/stores/offers'
import RazorpayButton from '@/components/RazorpayButton.vue'

const cart = useCartStore()
const auth = useAuthStore()
const orders = useOrderStore()
const offerStore = useOfferStore()
const router = useRouter()

const form = ref({ name: auth.user?.name || '', email: auth.user?.email || '', phone: '', address: '', city: '', pincode: '', state: '' })
const error = ref('')

const autoDeal = computed(() => offerStore.autoDiscount(cart.total, cart.count))
const shipping = computed(() => cart.total >= 399 ? 0 : 49)
const finalTotal = computed(() => Math.max(0, cart.total - autoDeal.value.discount + shipping.value))

function onPaymentSuccess(response) {
  const order = orders.createOrder(
    auth.user.id,
    [...cart.items],
    finalTotal.value,
    { ...form.value },
    response.razorpay_payment_id
  )
  cart.clear()
  router.push({ path: '/order-success', query: { id: order.id } })
}

function onPaymentFailure(msg) {
  error.value = 'Payment failed: ' + msg
}
</script>
