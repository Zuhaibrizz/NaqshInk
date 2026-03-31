<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div v-if="cart.isOpen" class="fixed inset-0 bg-black/60 z-40" @click="cart.isOpen = false" />
  </Transition>

  <!-- Drawer -->
  <Transition name="slide">
    <div v-if="cart.isOpen" class="fixed right-0 top-0 h-full w-full max-w-md bg-ink-dark z-50 flex flex-col shadow-2xl">
      <!-- Header -->
      <div class="flex items-center justify-between p-5 border-b border-ink-gray">
        <h2 class="font-display text-xl font-semibold">Your Cart ({{ cart.count }})</h2>
        <button @click="cart.isOpen = false" class="p-2 hover:text-ink-accent transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Items -->
      <div class="flex-1 overflow-y-auto p-5 space-y-4">
        <div v-if="cart.items.length === 0" class="text-center text-gray-500 mt-20">
          <p class="text-4xl mb-4">🛒</p>
          <p>Your cart is empty</p>
          <RouterLink to="/shop" @click="cart.isOpen=false" class="btn-primary mt-4 text-sm">Shop Now</RouterLink>
        </div>

        <div v-for="item in cart.items" :key="item.id"
          class="flex gap-4 bg-ink-gray rounded-xl p-3">
          <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-sm truncate">{{ item.name }}</h4>
            <p v-if="item.isCustom" class="text-xs text-ink-accent mt-0.5">
              {{ item.customData?.placement }} · {{ item.customData?.dimensions }}
            </p>
            <p class="text-ink-accent font-bold mt-1">₹{{ item.price }}</p>
            <div class="flex items-center gap-2 mt-2">
              <button @click="cart.updateQty(item.id, item.qty - 1)"
                class="w-7 h-7 rounded-full bg-ink-black flex items-center justify-center hover:bg-ink-accent hover:text-ink-black transition text-sm">−</button>
              <span class="text-sm w-6 text-center">{{ item.qty }}</span>
              <button @click="cart.updateQty(item.id, item.qty + 1)"
                class="w-7 h-7 rounded-full bg-ink-black flex items-center justify-center hover:bg-ink-accent hover:text-ink-black transition text-sm">+</button>
            </div>
          </div>
          <button @click="cart.removeItem(item.id)" class="text-gray-500 hover:text-red-400 transition self-start">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="cart.items.length > 0" class="p-5 border-t border-ink-gray space-y-3">
        <div class="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span class="text-ink-accent">₹{{ cart.total }}</span>
        </div>
        <p class="text-xs text-green-400" v-if="cart.total >= 399">✓ Free shipping applied</p>
        <p class="text-xs text-gray-500" v-else>Add ₹{{ 399 - cart.total }} more for free shipping</p>
        <RouterLink to="/checkout" @click="cart.isOpen=false" class="btn-primary w-full text-center block">
          Proceed to Checkout
        </RouterLink>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
const cart = useCartStore()
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
