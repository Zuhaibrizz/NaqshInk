<template>
  <div class="page-top min-h-screen max-w-7xl mx-auto px-4 py-12" v-if="product">
    <div class="grid md:grid-cols-2 gap-12">
      <!-- Image -->
      <div class="rounded-2xl overflow-hidden aspect-square">
        <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
      </div>

      <!-- Details -->
      <div class="flex flex-col justify-center">
        <p class="text-ink-accent text-sm mb-2">{{ product.category }}</p>
        <h1 class="font-display text-4xl font-bold mb-4">{{ product.name }}</h1>
        <div class="flex items-center gap-3 mb-6">
          <span class="text-3xl font-bold text-ink-accent">₹{{ product.price }}</span>
          <span class="text-gray-500 line-through text-xl">₹{{ product.originalPrice }}</span>
          <span class="badge">{{ discount }}% off</span>
        </div>
        <p class="text-gray-400 leading-relaxed mb-8">{{ product.description }}</p>

        <!-- Features -->
        <div class="grid grid-cols-2 gap-3 mb-8">
          <div v-for="f in features" :key="f" class="flex items-center gap-2 text-sm text-gray-300">
            <span class="text-ink-accent">✓</span> {{ f }}
          </div>
        </div>

        <!-- Qty + Add -->
        <div class="flex items-center gap-4 mb-4">
          <div class="flex items-center gap-3 bg-ink-gray rounded-full px-4 py-2">
            <button @click="qty = Math.max(1, qty - 1)" class="text-lg hover:text-ink-accent">−</button>
            <span class="w-6 text-center">{{ qty }}</span>
            <button @click="qty++" class="text-lg hover:text-ink-accent">+</button>
          </div>
          <button @click="addToCart" class="btn-primary flex-1 text-center">Add to Cart</button>
        </div>
        <RouterLink to="/checkout" @click="addToCart" class="btn-outline text-center">Buy Now</RouterLink>

        <p class="text-xs text-gray-500 mt-6">Free shipping on orders over ₹399 · Dispatched in 2–3 days</p>
      </div>
    </div>
  </div>
  <div v-else class="page-top text-center py-20 text-gray-500">Product not found.</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const store = useProductStore()
const cart = useCartStore()

const product = computed(() => store.getById(route.params.id))
const qty = ref(1)
const discount = computed(() =>
  product.value ? Math.round((1 - product.value.price / product.value.originalPrice) * 100) : 0
)

const features = ['Pain Free', 'Waterproof', 'Skin Safe', 'Lasts 1–2 Weeks', 'Easy Application', 'No Needles']

function addToCart() {
  if (product.value) cart.addItem(product.value, qty.value)
}
</script>
