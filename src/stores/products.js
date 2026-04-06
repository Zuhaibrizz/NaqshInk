import { defineStore } from 'pinia'
import { ref } from 'vue'
import { productApi } from '@/lib/api'

export const useProductStore = defineStore('products', () => {
  const products  = ref([])
  const loading   = ref(false)
  const categories = ['All', 'Spiritual', 'Nature', 'Geometric', 'Floral', 'Minimal', 'Celestial', 'Custom']

  function normaliseTags(raw) {
    if (!raw) return []
    if (Array.isArray(raw)) return raw
    try { return JSON.parse(raw) } catch {
      // Handle plain comma-separated or bare string from old seed
      return raw.replace(/[\[\]"]/g, '').split(',').map(t => t.trim()).filter(Boolean)
    }
  }

  // Normalise API response (snake_case → camelCase for frontend compat)
  function normalise(p) {
    return {
      ...p,
      originalPrice: p.original_price ?? p.originalPrice,
      tags: normaliseTags(p.tags),
    }
  }

  async function fetchAll(params = {}) {
    loading.value = true
    try {
      const rows = await productApi.list(params)
      products.value = rows.map(normalise)
    } finally {
      loading.value = false
    }
  }

  async function addProduct(data) {
    const p = await productApi.create({
      ...data,
      original_price: data.originalPrice ?? data.original_price,
    })
    products.value.push(normalise(p))
  }

  async function updateProduct(id, data) {
    const p = await productApi.update(id, {
      ...data,
      original_price: data.originalPrice ?? data.original_price,
    })
    const i = products.value.findIndex(x => x.id === id)
    if (i !== -1) products.value[i] = normalise(p)
  }

  async function deleteProduct(id) {
    await productApi.remove(id)
    products.value = products.value.filter(p => p.id !== id)
  }

  function getById(id) {
    return products.value.find(p => p.id === Number(id))
  }

  return { products, loading, categories, fetchAll, addProduct, updateProduct, deleteProduct, getById }
})
