import { defineStore } from 'pinia'
import { ref } from 'vue'

// Offer types: 'percentage' | 'flat' | 'multibuy'
// multibuy: buy X get Y% off
const SEED_OFFERS = [
  { id: 1, code: 'NAQSH10', type: 'percentage', value: 10, minOrder: 0, active: true, label: '10% off on all orders' },
  { id: 2, code: 'FIRST50', type: 'flat', value: 50, minOrder: 299, active: true, label: '₹50 off on orders above ₹299' },
  { id: 3, code: 'INK20', type: 'percentage', value: 20, minOrder: 599, active: true, label: '20% off on orders above ₹599' },
  { id: 4, code: 'MULTIBUY', type: 'multibuy', value: 15, minQty: 2, active: true, label: '15% off when you buy 2 or more items' }
]

export const useOfferStore = defineStore('offers', () => {
  const offers = ref(JSON.parse(localStorage.getItem('naqshink_offers') || 'null') || SEED_OFFERS)

  function save() { localStorage.setItem('naqshink_offers', JSON.stringify(offers.value)) }

  function addOffer(o) { offers.value.push({ ...o, id: Date.now() }); save() }
  function updateOffer(id, data) {
    const i = offers.value.findIndex(o => o.id === id)
    if (i !== -1) { offers.value[i] = { ...offers.value[i], ...data }; save() }
  }
  function deleteOffer(id) { offers.value = offers.value.filter(o => o.id !== id); save() }

  function applyCode(code, cartTotal, cartCount) {
    const offer = offers.value.find(o => o.code === code.toUpperCase() && o.active)
    if (!offer) return { valid: false, message: 'Invalid or expired coupon code.' }

    if (offer.type === 'multibuy') {
      if (cartCount < offer.minQty) return { valid: false, message: `Add at least ${offer.minQty} items to use this code.` }
      const discount = Math.round(cartTotal * offer.value / 100)
      return { valid: true, offer, discount, message: `${offer.value}% multi-buy discount applied!` }
    }
    if (cartTotal < offer.minOrder) return { valid: false, message: `Minimum order ₹${offer.minOrder} required.` }
    const discount = offer.type === 'flat' ? offer.value : Math.round(cartTotal * offer.value / 100)
    return { valid: true, offer, discount, message: `${offer.label} applied!` }
  }

  // Auto multibuy — no code needed
  function autoDiscount(cartTotal, cartCount) {
    const mb = offers.value.find(o => o.type === 'multibuy' && o.active)
    if (mb && cartCount >= mb.minQty) {
      return { discount: Math.round(cartTotal * mb.value / 100), label: mb.label }
    }
    return { discount: 0, label: null }
  }

  return { offers, addOffer, updateOffer, deleteOffer, applyCode, autoDiscount }
})
