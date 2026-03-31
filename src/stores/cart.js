import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('naqshink_cart') || '[]'))
  const isOpen = ref(false)

  function save() {
    localStorage.setItem('naqshink_cart', JSON.stringify(items.value))
  }

  function addItem(product, qty = 1) {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) existing.qty += qty
    else items.value.push({ ...product, qty })
    save()
    isOpen.value = true
  }

  function removeItem(id) {
    items.value = items.value.filter(i => i.id !== id)
    save()
  }

  function updateQty(id, qty) {
    const item = items.value.find(i => i.id === id)
    if (item) { item.qty = Math.max(1, qty); save() }
  }

  function clear() {
    items.value = []
    save()
  }

  const total = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))
  const count = computed(() => items.value.reduce((s, i) => s + i.qty, 0))

  return { items, isOpen, addItem, removeItem, updateQty, clear, total, count }
})
