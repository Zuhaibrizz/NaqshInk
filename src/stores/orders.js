import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrderStore = defineStore('orders', () => {
  const orders = ref(JSON.parse(localStorage.getItem('naqshink_orders') || '[]'))

  function save() {
    localStorage.setItem('naqshink_orders', JSON.stringify(orders.value))
  }

  function createOrder(userId, items, total, address, paymentId) {
    const order = {
      id: 'INK' + Date.now(),
      userId,
      items,
      total,
      address,
      paymentId,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
    orders.value.unshift(order)
    save()
    return order
  }

  function updateStatus(id, status) {
    const o = orders.value.find(o => o.id === id)
    if (o) { o.status = status; save() }
  }

  function getByUser(userId) {
    return orders.value.filter(o => o.userId === userId)
  }

  return { orders, createOrder, updateStatus, getByUser }
})
