<template>
  <div class="page-top min-h-screen max-w-5xl mx-auto px-4 py-12">
    <h1 class="font-display text-4xl font-bold mb-10">Your Cart</h1>

    <div v-if="cart.items.length === 0" class="text-center py-20 text-gray-500">
      <p class="text-6xl mb-4">🛒</p>
      <p class="text-xl mb-6">Your cart is empty</p>
      <RouterLink to="/shop" class="btn-primary">Start Shopping</RouterLink>
    </div>

    <div v-else class="grid md:grid-cols-3 gap-8">
      <!-- Items -->
      <div class="md:col-span-2 space-y-4">
        <!-- Multi-buy banner -->
        <div v-if="autoDeal.label" class="bg-green-900/30 border border-green-700 rounded-xl px-4 py-3 text-sm text-green-400 flex items-center gap-2">
          🎉 {{ autoDeal.label }} — saving ₹{{ autoDeal.discount }}!
        </div>

        <div v-for="item in cart.items" :key="item.id" class="card flex gap-4 p-4">
          <img :src="item.image" :alt="item.name" class="w-24 h-24 object-cover rounded-xl" />
          <div class="flex-1">
            <h3 class="font-semibold">{{ item.name }}</h3>
            <p class="text-gray-500 text-sm">{{ item.category }}</p>
            <p class="text-ink-accent font-bold mt-1">₹{{ item.price }}</p>
            <div class="flex items-center gap-3 mt-3">
              <button @click="cart.updateQty(item.id, item.qty - 1)"
                class="w-8 h-8 rounded-full bg-ink-gray hover:bg-ink-accent hover:text-ink-black transition flex items-center justify-center">−</button>
              <span>{{ item.qty }}</span>
              <button @click="cart.updateQty(item.id, item.qty + 1)"
                class="w-8 h-8 rounded-full bg-ink-gray hover:bg-ink-accent hover:text-ink-black transition flex items-center justify-center">+</button>
            </div>
          </div>
          <div class="flex flex-col items-end justify-between">
            <button @click="cart.removeItem(item.id)" class="text-gray-500 hover:text-red-400 transition text-sm">Remove</button>
            <p class="font-bold text-white">₹{{ item.price * item.qty }}</p>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="card p-6 h-fit space-y-4">
        <h2 class="font-semibold text-lg">Order Summary</h2>

        <div class="flex justify-between text-sm text-gray-400">
          <span>Subtotal</span><span>₹{{ cart.total }}</span>
        </div>

        <!-- Auto multibuy -->
        <div v-if="autoDeal.discount > 0" class="flex justify-between text-sm text-green-400">
          <span>Multi-buy discount</span><span>−₹{{ autoDeal.discount }}</span>
        </div>

        <!-- Coupon discount -->
        <div v-if="appliedDiscount > 0" class="flex justify-between text-sm text-green-400">
          <span>Coupon ({{ appliedCode }})</span><span>−₹{{ appliedDiscount }}</span>
        </div>

        <div class="flex justify-between text-sm text-gray-400">
          <span>Shipping</span>
          <span :class="cart.total >= 399 ? 'text-green-400' : ''">
            {{ cart.total >= 399 ? 'FREE' : '₹49' }}
          </span>
        </div>

        <div class="border-t border-ink-gray pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span class="text-ink-accent">₹{{ finalTotal }}</span>
        </div>

        <!-- Coupon input -->
        <div class="space-y-2">
          <div class="flex gap-2">
            <input v-model="couponInput" placeholder="Coupon code" class="input text-sm py-2 flex-1" @keyup.enter="applyCoupon" />
            <button @click="applyCoupon" class="btn-primary text-sm py-2 px-4">Apply</button>
          </div>
          <p v-if="couponMsg" :class="couponValid ? 'text-green-400' : 'text-red-400'" class="text-xs">{{ couponMsg }}</p>
          <button v-if="appliedCode" @click="removeCoupon" class="text-xs text-gray-500 hover:text-red-400 transition">Remove coupon</button>
        </div>

        <!-- Available offers hint -->
        <div class="border-t border-ink-gray pt-3 space-y-1">
          <p class="text-xs text-gray-500 font-medium">Available offers:</p>
          <p v-for="o in activeOffers" :key="o.id" class="text-xs text-gray-600">
            <span class="text-ink-accent font-mono">{{ o.code }}</span> — {{ o.label }}
          </p>
        </div>

        <RouterLink to="/checkout" class="btn-primary w-full text-center block">Checkout</RouterLink>
        <RouterLink to="/shop" class="text-center text-sm text-gray-500 hover:text-white transition block">Continue Shopping</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useOfferStore } from '@/stores/offers'

const cart = useCartStore()
const offerStore = useOfferStore()

const couponInput = ref('')
const couponMsg = ref('')
const couponValid = ref(false)
const appliedCode = ref('')
const appliedDiscount = ref(0)

const autoDeal = computed(() => offerStore.autoDiscount(cart.total, cart.count))
const activeOffers = computed(() => offerStore.offers.filter(o => o.active && o.type !== 'multibuy'))

const shipping = computed(() => cart.total >= 399 ? 0 : 49)
const finalTotal = computed(() =>
  Math.max(0, cart.total - autoDeal.value.discount - appliedDiscount.value + shipping.value)
)

function applyCoupon() {
  const result = offerStore.applyCode(couponInput.value, cart.total, cart.count)
  couponValid.value = result.valid
  couponMsg.value = result.message
  if (result.valid) {
    appliedCode.value = couponInput.value.toUpperCase()
    appliedDiscount.value = result.discount
  }
}

function removeCoupon() {
  appliedCode.value = ''
  appliedDiscount.value = 0
  couponInput.value = ''
  couponMsg.value = ''
}
</script>
