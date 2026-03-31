<template>
  <div class="card group cursor-pointer" @click="$router.push('/product/' + product.id)">
    <div class="relative overflow-hidden aspect-square">
      <img :src="product.image" :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div class="absolute top-3 left-3 flex gap-2">
        <span v-for="tag in product.tags" :key="tag" class="badge capitalize">{{ tag }}</span>
      </div>
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
        <button @click.stop="cart.addItem(product)"
          class="btn-primary text-sm py-2 px-5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          Add to Cart
        </button>
      </div>
    </div>
    <div class="p-4">
      <p class="text-xs text-gray-500 mb-1">{{ product.category }}</p>
      <h3 class="font-semibold text-white mb-2">{{ product.name }}</h3>
      <div class="flex items-center gap-2">
        <span class="text-ink-accent font-bold">₹{{ product.price }}</span>
        <span class="text-gray-500 line-through text-sm">₹{{ product.originalPrice }}</span>
        <span class="text-green-400 text-xs">{{ discount }}% off</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const props = defineProps({ product: Object })
const cart = useCartStore()
const discount = computed(() =>
  Math.round((1 - props.product.price / props.product.originalPrice) * 100)
)
</script>
