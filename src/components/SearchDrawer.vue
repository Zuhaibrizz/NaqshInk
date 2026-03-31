<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" @click="close" />
  </Transition>

  <!-- Drawer -->
  <Transition name="slide">
    <div v-if="isOpen"
      class="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col shadow-2xl"
      style="background-color:var(--bg-card); border-left:1px solid var(--border)">

      <!-- Header -->
      <div class="flex items-center gap-3 p-5" style="border-bottom:1px solid var(--border)">
        <div class="flex-1 flex items-center gap-3 rounded-xl px-4 py-2.5" style="background:var(--bg-input); border:1px solid var(--border)">
          <svg class="w-4 h-4 flex-shrink-0" style="color:var(--text-faint)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input ref="inputRef" v-model="query" placeholder="Search tattoo designs..."
            class="flex-1 bg-transparent outline-none text-sm"
            style="color:var(--text)"
            @keyup.escape="close" />
          <button v-if="query" @click="query=''" style="color:var(--text-faint)" class="hover:opacity-70 transition text-xs">✕</button>
        </div>
        <button @click="close" class="p-2 rounded-xl hover:opacity-70 transition" style="color:var(--text-muted)">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Category pills -->
      <div class="flex gap-2 px-5 py-3 overflow-x-auto scrollbar-hide" style="border-bottom:1px solid var(--border)">
        <button v-for="cat in categories" :key="cat"
          @click="activeCategory = cat"
          class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0"
          :style="activeCategory === cat
            ? 'background:var(--accent);color:#0a0a0a'
            : 'background:var(--bg-input);color:var(--text-muted)'">
          {{ cat }}
        </button>
      </div>

      <!-- Results -->
      <div class="flex-1 overflow-y-auto p-4">
        <!-- Empty state -->
        <div v-if="query && !results.length" class="text-center py-16">
          <p class="text-4xl mb-3">🔍</p>
          <p class="text-sm" style="color:var(--text-muted)">No results for "{{ query }}"</p>
        </div>

        <!-- No query — show trending -->
        <div v-if="!query">
          <p class="text-xs font-semibold uppercase tracking-widest mb-4" style="color:var(--text-faint)">Trending</p>
          <div class="flex flex-wrap gap-2 mb-6">
            <button v-for="t in trending" :key="t" @click="query = t"
              class="px-3 py-1.5 rounded-full text-xs transition"
              style="background:var(--bg-input);color:var(--text-muted);border:1px solid var(--border)">
              🔥 {{ t }}
            </button>
          </div>
          <p class="text-xs font-semibold uppercase tracking-widest mb-4" style="color:var(--text-faint)">All Products</p>
        </div>

        <!-- Product list -->
        <div class="space-y-3">
          <div v-for="p in displayList" :key="p.id"
            @click="goToProduct(p)"
            class="flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all group"
            style="border:1px solid var(--border)"
            :style="{ backgroundColor: 'var(--bg-input)' }"
            @mouseenter="e => e.currentTarget.style.borderColor='var(--accent)'"
            @mouseleave="e => e.currentTarget.style.borderColor='var(--border)'">
            <img :src="p.image" :alt="p.name" class="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm truncate" style="color:var(--text)">{{ p.name }}</p>
              <p class="text-xs mt-0.5 truncate" style="color:var(--text-faint)">{{ p.category }}</p>
              <div class="flex items-center gap-2 mt-1.5">
                <span class="font-bold text-sm" style="color:var(--accent)">₹{{ p.price }}</span>
                <span class="line-through text-xs" style="color:var(--text-faint)">₹{{ p.originalPrice }}</span>
                <span class="text-xs text-green-500 font-medium">{{ Math.round((1-p.price/p.originalPrice)*100) }}% off</span>
              </div>
            </div>
            <div class="flex flex-col gap-2 flex-shrink-0">
              <button @click.stop="addToCart(p)"
                class="text-xs px-3 py-1.5 rounded-full font-semibold transition"
                style="background:var(--accent);color:#0a0a0a">
                + Cart
              </button>
              <span v-if="p.tags?.includes('bestseller')" class="badge text-center">Hot</span>
            </div>
          </div>
        </div>

        <!-- View all -->
        <div v-if="results.length > 0 || !query" class="mt-6 text-center">
          <RouterLink :to="query ? `/shop?q=${query}` : '/shop'" @click="close"
            class="btn-outline text-sm py-2 px-6">
            View All {{ results.length || store.products.length }} Designs →
          </RouterLink>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'

const props = defineProps({ isOpen: Boolean })
const emit = defineEmits(['close'])

const router = useRouter()
const store = useProductStore()
const cart = useCartStore()

const query = ref('')
const activeCategory = ref('All')
const inputRef = ref(null)

const categories = ['All', ...store.categories.slice(1)]
const trending = ['Moon Phase', 'Lotus', 'Serpent', 'Custom', 'Minimal']

const results = computed(() => {
  let list = store.products
  if (activeCategory.value !== 'All') list = list.filter(p => p.category === activeCategory.value)
  if (query.value.trim()) {
    const q = query.value.toLowerCase()
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    )
  }
  return list
})

const displayList = computed(() => query.value ? results.value : results.value.slice(0, 8))

watch(() => props.isOpen, async (v) => {
  if (v) { await nextTick(); inputRef.value?.focus() }
  else { query.value = ''; activeCategory.value = 'All' }
})

function close() { emit('close') }

function goToProduct(p) {
  router.push('/product/' + p.id)
  close()
}

function addToCart(p) {
  cart.addItem(p)
  close()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.3s cubic-bezier(.22,1,.36,1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
