import { defineStore } from 'pinia'
import { ref } from 'vue'
import { offerApi } from '@/lib/api'

export const useOfferStore = defineStore('offers', () => {
  const offers = ref([])

  function normalise(o) {
    return {
      ...o,
      minOrder: o.min_order ?? o.minOrder ?? 0,
      minQty:   o.min_qty   ?? o.minQty   ?? 1,
      active:   Boolean(o.active),
    }
  }

  async function fetchOffers() {
    const rows = await offerApi.active()
    offers.value = rows.map(normalise)
  }

  async function fetchAll() {
    const rows = await offerApi.all()
    offers.value = rows.map(normalise)
  }

  async function addOffer(data) {
    const o = await offerApi.create({ ...data, min_order: data.minOrder, min_qty: data.minQty })
    offers.value.push(normalise(o))
  }

  async function updateOffer(id, data) {
    const payload = { ...data }
    if (data.minOrder !== undefined) payload.min_order = data.minOrder
    const o = await offerApi.update(id, payload)
    const i = offers.value.findIndex(x => x.id === id)
    if (i !== -1) offers.value[i] = normalise(o)
  }

  async function deleteOffer(id) {
    await offerApi.remove(id)
    offers.value = offers.value.filter(o => o.id !== id)
  }

  // Validate coupon code via API (for general % / flat offers)
  async function applyCode(code, cartTotal, cartCount, cartItems = []) {
    try {
      const result = await offerApi.validate(code, cartTotal, cartCount, cartItems)
      return result
    } catch {
      // Network error or unexpected failure — never show raw error to user
      return { valid: false, message: 'Could not apply coupon. Please try again.' }
    }
  }

  /**
   * Auto-apply all eligible offers based on cart contents — no code needed.
   * - product offers  → apply when that product is in cart
   * - category offers → apply when any item from that category is in cart
   * - multibuy        → apply when qty condition is met
   * Returns array: [{ id, label, discount }]
   */
  function autoApply(cartItems = [], cartTotal = 0, cartCount = 0) {
    const applied = []

    for (const offer of offers.value) {
      if (!offer.active) continue

      // Multibuy — needs min qty, applies to whole cart
      if (offer.type === 'multibuy' && (!offer.applies_to || offer.applies_to === 'all')) {
        if (cartCount >= offer.minQty) {
          applied.push({
            id: offer.id,
            label: offer.label || `${offer.value}% off (buy ${offer.minQty}+)`,
            discount: Math.round(cartTotal * offer.value / 100)
          })
        }
        continue
      }

      // Product-specific — auto-apply if that product is in cart
      if (offer.applies_to === 'product' && offer.target_value) {
        const item = cartItems.find(i => String(i.id) === String(offer.target_value))
        if (item) {
          const itemTotal = item.price * item.qty
          const discount = offer.type === 'flat'
            ? Math.min(offer.value, itemTotal)
            : Math.round(itemTotal * offer.value / 100)
          applied.push({
            id: offer.id,
            label: offer.label || `${offer.value}${offer.type === 'flat' ? '₹' : '%'} off on ${item.name}`,
            discount
          })
        }
        continue
      }

      // Category-specific — auto-apply if any item from that category is in cart
      if (offer.applies_to === 'category' && offer.target_value) {
        const eligible = cartItems.filter(i => i.category === offer.target_value)
        if (eligible.length) {
          const eligibleTotal = eligible.reduce((s, i) => s + i.price * i.qty, 0)
          const discount = offer.type === 'flat'
            ? Math.min(offer.value, eligibleTotal)
            : Math.round(eligibleTotal * offer.value / 100)
          applied.push({
            id: offer.id,
            label: offer.label || `${offer.value}${offer.type === 'flat' ? '₹' : '%'} off on ${offer.target_value}`,
            discount
          })
        }
        continue
      }
    }

    return applied
  }

  // Total auto-discount amount
  function autoDiscountTotal(cartItems, cartTotal, cartCount) {
    return autoApply(cartItems, cartTotal, cartCount).reduce((s, o) => s + o.discount, 0)
  }

  // Legacy compat
  function autoDiscount(cartTotal, cartCount) {
    return { discount: autoDiscountTotal([], cartTotal, cartCount), label: null }
  }

  // Coupon-eligible offers (general, not product/category specific)
  function couponOffers() {
    return offers.value.filter(o => o.active && o.applies_to === 'all' && o.type !== 'multibuy')
  }

  return { offers, fetchOffers, fetchAll, addOffer, updateOffer, deleteOffer, applyCode, autoApply, autoDiscountTotal, autoDiscount, couponOffers }
})
