<template>
  <div class="page-top min-h-screen max-w-5xl mx-auto px-4 py-12">
    <h1 class="font-display text-4xl font-bold mb-10">Your Cart</h1>

    <div v-if="cart.items.length === 0" class="text-center py-20" style="color:var(--text-faint)">
      <p class="text-6xl mb-4">🛒</p>
      <p class="text-xl mb-6" style="color:var(--text)">Your cart is empty</p>
      <RouterLink to="/shop" class="btn-primary">Start Shopping</RouterLink>
    </div>

    <div v-else class="grid md:grid-cols-3 gap-8">
      <div class="md:col-span-2 space-y-4">
        <div v-for="deal in autoDeals" :key="deal.id"
          class="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
          style="background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.3);color:#4ade80">
          🎉 {{ deal.label }} — saving ₹{{ deal.discount }}!
        </div>
        <div v-for="item in cart.items" :key="item.id" class="card flex gap-4 p-4">
          <img :src="item.image" :alt="item.name" class="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
          <div class="flex-1">
            <h3 class="font-semibold" style="color:var(--text)">{{ item.name }}</h3>
            <p class="text-sm" style="color:var(--text-faint)">{{ item.category }}</p>
            <p class="font-bold mt-1" style="color:var(--accent)">₹{{ item.price }}</p>
            <div class="flex items-center gap-3 mt-3">
              <button @click="cart.updateQty(item.id, item.qty - 1)" class="w-8 h-8 rounded-full flex items-center justify-center" style="background:var(--bg-input)">−</button>
              <span style="color:var(--text)">{{ item.qty }}</span>
              <button @click="cart.updateQty(item.id, item.qty + 1)" class="w-8 h-8 rounded-full flex items-center justify-center" style="background:var(--bg-input)">+</button>
            </div>
          </div>
          <div class="flex flex-col items-end justify-between">
            <button @click="cart.removeItem(item.id)" class="text-xs hover:text-red-400 transition" style="color:var(--text-faint)">Remove</button>
            <p class="font-bold" style="color:var(--text)">₹{{ item.price * item.qty }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6 h-fit space-y-4">
        <h2 class="font-semibold text-lg" style="color:var(--text)">Order Summary</h2>
        <div class="flex justify-between text-sm" style="color:var(--text-muted)">
          <span>Subtotal</span><span>₹{{ cart.total }}</span>
        </div>
        <div v-for="deal in autoDeals" :key="deal.id" class="flex justify-between text-sm text-green-400">
          <span class="truncate mr-2 text-xs">{{ deal.label }}</span>
          <span class="flex-shrink-0">−₹{{ deal.discount }}</span>
        </div>
        <div v-if="appliedDiscount > 0" class="flex justify-between text-sm text-green-400">
          <span>Coupon ({{ appliedCode }})</span><span>−₹{{ appliedDiscount }}</span>
        </div>
        <div class="flex justify-between text-sm" style="color:var(--text-muted)">
          <span>Shipping</span>
          <span :class="cart.total >= 399 ? 'text-green-400' : ''">{{ cart.total >= 399 ? 'FREE' : '₹49' }}</span>
        </div>
        <div class="flex justify-between font-bold text-lg" style="border-top:1px solid var(--border);padding-top:1rem">
          <span style="color:var(--text)">Total</span>
          <span style="color:var(--accent)">₹{{ finalTotal }}</span>
        </div>

        <div class="space-y-2" style="border-top:1px solid var(--border);padding-top:1rem">
          <p class="text-xs font-medium" style="color:var(--text-faint)">Have a promo code?</p>
          <div class="flex gap-2">
            <input v-model="couponInput" placeholder="Enter coupon code" class="input text-sm py-2 flex-1"
              @keyup.enter="applyCoupon" style="text-transform:uppercase" />
            <button @click="applyCoupon" class="btn-primary text-sm py-2 px-4">Apply</button>
          </div>
          <p v-if="couponMsg" :class="couponValid ? 'text-green-400' : 'text-red-400'" class="text-xs">{{ couponMsg }}</p>
          <button v-if="appliedCode" @click="removeCoupon" class="text-xs hover:text-red-400 transition" style="color:var(--text-faint)">✕ Remove coupon</button>
        </div>

        <RouterLink to="/checkout" class="btn-primary w-full text-center block">Checkout</RouterLink>
        <RouterLink to="/shop" class="text-center text-sm block hover:opacity-80 transition" style="color:var(--text-faint)">Continue Shopping</RouterLink>
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

const autoDeals = computed(() => offerStore.autoApply(cart.items, cart.total, cart.count))
const autoDiscountTotal = computed(() => autoDeals.value.reduce((s, d) => s + d.discount, 0))
const shipping = computed(() => cart.total >= 399 ? 0 : 49)
const finalTotal = computed(() => Math.max(0, cart.total - autoDiscountTotal.value - appliedDiscount.value + shipping.value))

async function applyCoupon() {
  if (!couponInput.value.trim()) return
  const result = await offerStore.applyCode(couponInput.value, cart.total, cart.count, cart.items)
  couponValid.value = result.valid
  couponMsg.value = result.message
  if (result.valid) { appliedCode.value = couponInput.value.toUpperCase(); appliedDiscount.value = result.discount }
}

function removeCoupon() {
  appliedCode.value = ''; appliedDiscount.value = 0; couponInput.value = ''; couponMsg.value = ''
}
</script>
