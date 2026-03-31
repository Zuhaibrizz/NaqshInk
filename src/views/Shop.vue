<template>
  <div class="page-top min-h-screen">
    <div class="max-w-7xl mx-auto px-4 py-10">
      <!-- Header -->
      <div class="flex items-end justify-between mb-8" data-reveal>
        <div>
          <h1 class="font-display text-4xl font-bold" style="color:var(--text)">All Designs</h1>
          <p class="text-sm mt-1" style="color:var(--text-muted)">{{ filtered.length }} designs</p>
        </div>
        <!-- Mobile filter toggle -->
        <button @click="sidebarOpen = !sidebarOpen"
          class="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition"
          style="background:var(--bg-input);color:var(--text);border:1px solid var(--border)">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18M7 8h10M11 12h4"/>
          </svg>
          Filters
          <span v-if="activeFilters > 0" class="badge text-[10px] px-1.5 py-0">{{ activeFilters }}</span>
        </button>
      </div>

      <div class="flex gap-8">
        <!-- ── LEFT SIDEBAR ── -->
        <aside class="hidden md:block w-56 flex-shrink-0 space-y-6">
          <!-- Search -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest mb-3" style="color:var(--text-faint)">Search</p>
            <div class="flex items-center gap-2 rounded-xl px-3 py-2.5" style="background:var(--bg-input);border:1px solid var(--border)">
              <svg class="w-4 h-4 flex-shrink-0" style="color:var(--text-faint)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input v-model="search" placeholder="Search..." class="bg-transparent outline-none text-sm flex-1" style="color:var(--text)" />
            </div>
          </div>

          <!-- Category -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest mb-3" style="color:var(--text-faint)">Category</p>
            <div class="space-y-1">
              <button v-for="cat in store.categories" :key="cat"
                @click="activeCategory = cat"
                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200"
                :style="activeCategory === cat
                  ? 'background:var(--accent);color:#0a0a0a;font-weight:600'
                  : 'color:var(--text-muted)'">
                <span>{{ cat }}</span>
                <span class="text-xs opacity-60">{{ catCount(cat) }}</span>
              </button>
            </div>
          </div>

          <!-- Price range -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest mb-3" style="color:var(--text-faint)">Price Range</p>
            <div class="space-y-1">
              <button v-for="r in priceRanges" :key="r.label"
                @click="activePrice = activePrice === r.label ? '' : r.label"
                class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200"
                :style="activePrice === r.label
                  ? 'background:rgba(200,169,110,0.15);color:var(--accent);border:1px solid rgba(200,169,110,0.3)'
                  : 'color:var(--text-muted)'">
                <span class="w-3 h-3 rounded-full border-2 flex-shrink-0 transition"
                  :style="activePrice === r.label ? 'background:var(--accent);border-color:var(--accent)' : 'border-color:var(--text-faint)'"></span>
                {{ r.label }}
              </button>
            </div>
          </div>

          <!-- Tags -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest mb-3" style="color:var(--text-faint)">Tags</p>
            <div class="flex flex-wrap gap-2">
              <button v-for="tag in allTags" :key="tag"
                @click="toggleTag(tag)"
                class="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
                :style="activeTags.includes(tag)
                  ? 'background:var(--accent);color:#0a0a0a'
                  : 'background:var(--bg-input);color:var(--text-muted);border:1px solid var(--border)'">
                {{ tag }}
              </button>
            </div>
          </div>

          <!-- Sort -->
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest mb-3" style="color:var(--text-faint)">Sort By</p>
            <select v-model="sortBy" class="w-full rounded-xl px-3 py-2 text-sm outline-none"
              style="background:var(--bg-input);color:var(--text);border:1px solid var(--border)">
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Best Discount</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          <!-- Clear filters -->
          <button v-if="activeFilters > 0" @click="clearFilters"
            class="w-full py-2 rounded-xl text-sm font-medium transition"
            style="border:1px solid var(--border);color:var(--text-muted)">
            ✕ Clear Filters ({{ activeFilters }})
          </button>
        </aside>

        <!-- ── MOBILE SIDEBAR DRAWER ── -->
        <Transition name="fade">
          <div v-if="sidebarOpen" class="fixed inset-0 bg-black/60 z-40 md:hidden" @click="sidebarOpen=false"/>
        </Transition>
        <Transition name="slide-left">
          <div v-if="sidebarOpen" class="fixed left-0 top-0 h-full w-72 z-50 md:hidden overflow-y-auto p-6 space-y-6"
            style="background:var(--bg-card);border-right:1px solid var(--border)">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold" style="color:var(--text)">Filters</h3>
              <button @click="sidebarOpen=false" style="color:var(--text-muted)">✕</button>
            </div>
            <!-- Same filter content for mobile -->
            <div class="space-y-1">
              <button v-for="cat in store.categories" :key="cat" @click="activeCategory=cat;sidebarOpen=false"
                class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition"
                :style="activeCategory===cat ? 'background:var(--accent);color:#0a0a0a;font-weight:600' : 'color:var(--text-muted)'">
                <span>{{ cat }}</span><span class="text-xs opacity-60">{{ catCount(cat) }}</span>
              </button>
            </div>
            <div class="space-y-1">
              <button v-for="r in priceRanges" :key="r.label" @click="activePrice=activePrice===r.label?'':r.label"
                class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition"
                :style="activePrice===r.label ? 'background:rgba(200,169,110,0.15);color:var(--accent)' : 'color:var(--text-muted)'">
                {{ r.label }}
              </button>
            </div>
            <button v-if="activeFilters>0" @click="clearFilters;sidebarOpen=false"
              class="w-full py-2 rounded-xl text-sm transition" style="border:1px solid var(--border);color:var(--text-muted)">
              ✕ Clear Filters
            </button>
          </div>
        </Transition>

        <!-- ── PRODUCT GRID ── -->
        <div class="flex-1 min-w-0">
          <div v-if="filtered.length" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            <div v-for="(p, i) in filtered" :key="p.id" data-reveal :data-delay="(i % 8) * 60">
              <ProductCard :product="p" />
            </div>
          </div>
          <div v-else class="text-center py-24">
            <p class="text-5xl mb-4">🔍</p>
            <p class="text-lg font-medium mb-2" style="color:var(--text)">No designs found</p>
            <p class="text-sm mb-6" style="color:var(--text-muted)">Try adjusting your filters</p>
            <button @click="clearFilters" class="btn-primary">Clear Filters</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { useProductStore } from '@/stores/products'
import { useScrollReveal } from '@/composables/useScrollReveal'

useScrollReveal()
const store = useProductStore()

const search = ref('')
const activeCategory = ref('All')
const activePrice = ref('')
const activeTags = ref([])
const sortBy = ref('')
const sidebarOpen = ref(false)

const priceRanges = [
  { label: 'Under ₹300', min: 0, max: 299 },
  { label: '₹300 – ₹500', min: 300, max: 500 },
  { label: '₹500 – ₹800', min: 501, max: 800 },
  { label: 'Above ₹800', min: 801, max: Infinity },
]

const allTags = ['bestseller', 'new', 'custom']

function catCount(cat) {
  if (cat === 'All') return store.products.length
  return store.products.filter(p => p.category === cat).length
}

function toggleTag(tag) {
  const i = activeTags.value.indexOf(tag)
  if (i === -1) activeTags.value.push(tag)
  else activeTags.value.splice(i, 1)
}

const activeFilters = computed(() => {
  let n = 0
  if (activeCategory.value !== 'All') n++
  if (activePrice.value) n++
  if (activeTags.value.length) n += activeTags.value.length
  if (search.value) n++
  return n
})

function clearFilters() {
  search.value = ''
  activeCategory.value = 'All'
  activePrice.value = ''
  activeTags.value = []
  sortBy.value = ''
}

const filtered = computed(() => {
  let list = [...store.products]
  if (activeCategory.value !== 'All') list = list.filter(p => p.category === activeCategory.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  }
  if (activePrice.value) {
    const r = priceRanges.find(r => r.label === activePrice.value)
    if (r) list = list.filter(p => p.price >= r.min && p.price <= r.max)
  }
  if (activeTags.value.length) {
    list = list.filter(p => activeTags.value.some(t => p.tags?.includes(t)))
  }
  if (sortBy.value === 'price-asc') list.sort((a, b) => a.price - b.price)
  else if (sortBy.value === 'price-desc') list.sort((a, b) => b.price - a.price)
  else if (sortBy.value === 'discount') list.sort((a, b) => (b.originalPrice - b.price) - (a.originalPrice - a.price))
  else if (sortBy.value === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
  return list
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-left-enter-active, .slide-left-leave-active { transition: transform 0.3s cubic-bezier(.22,1,.36,1); }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); }
</style>
