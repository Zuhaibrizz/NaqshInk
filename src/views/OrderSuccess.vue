<template>
  <div class="page-top min-h-screen flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <div class="text-7xl mb-6">🎉</div>
      <h1 class="font-display text-4xl font-bold mb-4 text-ink-accent">Order Confirmed!</h1>
      <p class="text-gray-400 mb-2">Your order <span class="text-white font-semibold">{{ orderId }}</span> has been placed.</p>
      <p class="text-gray-500 text-sm mb-8">You'll receive a shipping confirmation on WhatsApp with your tracking number.</p>
      <div class="flex gap-4 justify-center">
        <RouterLink to="/shop" class="btn-primary">Shop More</RouterLink>
        <RouterLink to="/" class="btn-outline">Go Home</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const orderId = route.query.id
</script>
