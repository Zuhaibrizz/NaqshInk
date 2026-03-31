<template>
  <div>
    <h1 class="font-display text-3xl font-bold mb-8">Customers</h1>
    <div class="card overflow-x-auto">
      <div v-if="customers.length === 0" class="text-center py-16 text-gray-500">No customers yet.</div>
      <table v-else class="w-full text-sm">
        <thead class="border-b border-ink-gray">
          <tr class="text-gray-400 text-left">
            <th class="p-4">Name</th>
            <th class="p-4">Email</th>
            <th class="p-4">Role</th>
            <th class="p-4">Orders</th>
            <th class="p-4">Spent</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in customers" :key="c.id" class="border-b border-ink-gray hover:bg-ink-gray/30 transition">
            <td class="p-4 font-medium">{{ c.name }}</td>
            <td class="p-4 text-gray-400">{{ c.email }}</td>
            <td class="p-4">
              <span :class="c.role === 'admin' ? 'text-ink-accent' : 'text-gray-400'" class="text-xs font-medium capitalize">
                {{ c.role }}
              </span>
            </td>
            <td class="p-4 text-gray-400">{{ orderCount(c.id) }}</td>
            <td class="p-4 text-ink-accent font-bold">₹{{ totalSpent(c.id) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useOrderStore } from '@/stores/orders'

const orders = useOrderStore()
const customers = computed(() => JSON.parse(localStorage.getItem('naqshink_users') || '[]'))

function orderCount(userId) {
  return orders.orders.filter(o => o.userId === userId).length
}
function totalSpent(userId) {
  return orders.orders.filter(o => o.userId === userId).reduce((s, o) => s + o.total, 0)
}
</script>
