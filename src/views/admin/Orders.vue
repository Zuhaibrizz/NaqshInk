<template>
  <div>
    <h1 class="font-display text-3xl font-bold mb-8">Orders</h1>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div v-for="s in stats" :key="s.label" class="card p-5">
        <p class="text-gray-400 text-xs mb-1">{{ s.label }}</p>
        <p class="text-2xl font-bold" :class="s.color">{{ s.value }}</p>
      </div>
    </div>

    <!-- Orders table -->
    <div class="card overflow-x-auto">
      <div v-if="orders.orders.length === 0" class="text-center py-16 text-gray-500">No orders yet.</div>
      <table v-else class="w-full text-sm">
        <thead class="border-b border-ink-gray">
          <tr class="text-gray-400 text-left">
            <th class="p-4">Order ID</th>
            <th class="p-4">Customer</th>
            <th class="p-4">Items</th>
            <th class="p-4">Total</th>
            <th class="p-4">Status</th>
            <th class="p-4">Date</th>
            <th class="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in orders.orders" :key="o.id" class="border-b border-ink-gray hover:bg-ink-gray/30 transition">
            <td class="p-4 font-mono text-xs text-ink-accent">{{ o.id }}</td>
            <td class="p-4">
              <p class="font-medium">{{ o.address.name }}</p>
              <p class="text-gray-500 text-xs">{{ o.address.email }}</p>
            </td>
            <td class="p-4 text-gray-400">{{ o.items.length }} item(s)</td>
            <td class="p-4 font-bold text-ink-accent">₹{{ o.total }}</td>
            <td class="p-4">
              <span :class="statusClass(o.status)" class="text-xs px-2 py-1 rounded-full font-medium">
                {{ o.status }}
              </span>
            </td>
            <td class="p-4 text-gray-500 text-xs">{{ new Date(o.createdAt).toLocaleDateString('en-IN') }}</td>
            <td class="p-4">
              <select :value="o.status" @change="orders.updateStatus(o.id, $event.target.value)"
                class="bg-ink-gray text-white text-xs rounded-lg px-2 py-1 border border-ink-gray focus:outline-none">
                <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
              </select>
            </td>
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
const statuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const stats = computed(() => [
  { label: 'Total Orders', value: orders.orders.length, color: 'text-white' },
  { label: 'Revenue', value: '₹' + orders.orders.reduce((s, o) => s + o.total, 0), color: 'text-ink-accent' },
  { label: 'Delivered', value: orders.orders.filter(o => o.status === 'delivered').length, color: 'text-green-400' },
  { label: 'Pending', value: orders.orders.filter(o => o.status === 'confirmed').length, color: 'text-yellow-400' }
])

function statusClass(s) {
  return {
    confirmed: 'bg-blue-900/40 text-blue-400',
    processing: 'bg-yellow-900/40 text-yellow-400',
    shipped: 'bg-purple-900/40 text-purple-400',
    delivered: 'bg-green-900/40 text-green-400',
    cancelled: 'bg-red-900/40 text-red-400'
  }[s] || 'bg-gray-700 text-gray-400'
}
</script>
