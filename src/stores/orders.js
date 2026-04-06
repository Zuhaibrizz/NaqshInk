import { defineStore } from 'pinia'
import { ref } from 'vue'
import { orderApi, paymentApi } from '@/lib/api'

export const useOrderStore = defineStore('orders', () => {
  const orders  = ref([])
  const loading = ref(false)

  function normalise(o) {
    return {
      ...o,
      userId:    o.user_id    ?? o.userId,
      paymentId: o.payment_id ?? o.paymentId,
      createdAt: o.created_at ?? o.createdAt,
    }
  }

  async function fetchAll() {
    loading.value = true
    try { orders.value = (await orderApi.all()).map(normalise) }
    finally { loading.value = false }
  }

  async function fetchMine() {
    loading.value = true
    try { orders.value = (await orderApi.mine()).map(normalise) }
    finally { loading.value = false }
  }

  // Called after Razorpay payment succeeds
  async function createOrder(userId, items, total, address, paymentId) {
    const order = await orderApi.create({ items, total, address, paymentId })
    orders.value.unshift(normalise(order))
    return normalise(order)
  }

  async function updateStatus(id, status) {
    const updated = await orderApi.setStatus(id, status)
    const i = orders.value.findIndex(o => o.id === id)
    if (i !== -1) orders.value[i] = normalise(updated)
  }

  function getByUser(userId) {
    return orders.value.filter(o => (o.userId ?? o.user_id) === userId)
  }

  return { orders, loading, fetchAll, fetchMine, createOrder, updateStatus, getByUser }
})
