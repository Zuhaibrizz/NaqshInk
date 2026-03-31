import { defineStore } from 'pinia'
import { ref } from 'vue'

const SEED = [
  { id: 1, name: 'Inflow', slug: 'inflow', price: 399, originalPrice: 599, category: 'Spiritual', description: 'A symbol of seamless energy — balance meets movement. Continuous linework representing calm persistence.', image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=600&q=80', tags: ['bestseller'], stock: 50 },
  { id: 2, name: 'Weightless', slug: 'weightless', price: 349, originalPrice: 499, category: 'Nature', description: 'A feather symbolizing freedom from what no longer serves you. Letting go, trust, quiet strength.', image: 'https://images.unsplash.com/photo-1590246814883-57c511e4f2f4?w=600&q=80', tags: ['new'], stock: 40 },
  { id: 3, name: 'Static Web', slug: 'static-web', price: 299, originalPrice: 449, category: 'Geometric', description: 'Intricate web geometry — precision meets artistry in every line.', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80', tags: [], stock: 60 },
  { id: 4, name: 'Serpent', slug: 'serpent', price: 449, originalPrice: 649, category: 'Spiritual', description: 'Ancient symbol of transformation and rebirth. Bold, fluid serpent design.', image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&q=80', tags: ['bestseller'], stock: 35 },
  { id: 5, name: 'Lotus Bloom', slug: 'lotus-bloom', price: 399, originalPrice: 549, category: 'Floral', description: 'Rising from the mud, blooming in beauty. The lotus — purity and resilience.', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80', tags: ['new'], stock: 45 },
  { id: 6, name: 'Minimal Arrow', slug: 'minimal-arrow', price: 249, originalPrice: 399, category: 'Minimal', description: 'Direction. Purpose. Forward motion. A clean arrow for the focused soul.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', tags: [], stock: 80 },
  { id: 7, name: 'Moon Phase', slug: 'moon-phase', price: 499, originalPrice: 699, category: 'Celestial', description: 'All phases of the moon in one elegant band. Cycles, change, and cosmic rhythm.', image: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=600&q=80', tags: ['bestseller'], stock: 30 },
  { id: 8, name: 'Custom Design', slug: 'custom', price: 1199, originalPrice: 1499, category: 'Custom', description: 'Your idea, our craft. Send us your design and we\'ll bring it to life on your skin.', image: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=600&q=80', tags: ['custom'], stock: 999 }
]

export const useProductStore = defineStore('products', () => {
  const products = ref(JSON.parse(localStorage.getItem('naqshink_products') || 'null') || SEED)

  function save() {
    localStorage.setItem('naqshink_products', JSON.stringify(products.value))
  }

  function addProduct(p) {
    products.value.push({ ...p, id: Date.now() })
    save()
  }

  function updateProduct(id, data) {
    const i = products.value.findIndex(p => p.id === id)
    if (i !== -1) { products.value[i] = { ...products.value[i], ...data }; save() }
  }

  function deleteProduct(id) {
    products.value = products.value.filter(p => p.id !== id)
    save()
  }

  function getById(id) {
    return products.value.find(p => p.id === Number(id))
  }

  const categories = ['All', 'Spiritual', 'Nature', 'Geometric', 'Floral', 'Minimal', 'Celestial', 'Custom']

  return { products, categories, addProduct, updateProduct, deleteProduct, getById }
})
