<template>
  <div class="space-y-6">
    <!-- Stat cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="s in stats" :key="s.label" class="card p-5">
        <div class="flex items-start justify-between mb-3">
          <p class="text-gray-400 text-xs font-medium">{{ s.label }}</p>
          <span class="text-2xl">{{ s.icon }}</span>
        </div>
        <p class="text-3xl font-bold" :class="s.color">{{ s.value }}</p>
        <p class="text-xs text-gray-600 mt-1">{{ s.sub }}</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Recent orders -->
      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold">Recent Orders</h3>
          <RouterLink to="/admin/orders" class="text-xs text-ink-accent hover:underline">View all</RouterLink>
        </div>
        <div v-if="recentOrders.length === 0" class="text-center py-8 text-gray-500 text-sm">No orders yet</div>
        <div v-else class="space-y-3">
          <div v-for="o in recentOrders" :key="o.id"
            class="flex items-center justify-between py-2 border-b border-ink-gray last:border-0">
            <div>
              <p class="text-sm font-mono text-ink-accent">{{ o.id }}</p>
              <p class="text-xs text-gray-500">{{ o.address?.name }} · {{ new Date(o.createdAt).toLocaleDateString('en-IN') }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-sm">₹{{ o.total }}</p>
              <span :class="statusClass(o.status)" class="text-xs px-2 py-0.5 rounded-full">{{ o.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Custom order requests -->
      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold">Custom Design Requests</h3>
          <RouterLink to="/admin/custom-orders" class="text-xs text-ink-accent hover:underline">View all</RouterLink>
        </div>
        <div v-if="recentCustom.length === 0" class="text-center py-8 text-gray-500 text-sm">No requests yet</div>
        <div v-else class="space-y-3">
          <div v-for="c in recentCustom" :key="c.id"
            class="flex items-center gap-3 py-2 border-b border-ink-gray last:border-0">
            <img v-if="c.imageDataUrl" :src="c.imageDataUrl" class="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
            <div v-else class="w-10 h-10 bg-ink-gray rounded-lg flex items-center justify-center text-lg flex-shrink-0">🎨</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ c.userName }}</p>
              <p class="text-xs text-gray-500 truncate">{{ c.description }}</p>
            </div>
            <span :class="customStatusClass(c.printStatus)" class="text-xs px-2 py-0.5 rounded-full capitalize flex-shrink-0">
              {{ c.printStatus }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Low stock alert -->
    <div class="card p-5" v-if="lowStock.length">
      <h3 class="font-semibold mb-4 text-yellow-400">⚠️ Low Stock Alert</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="p in lowStock" :key="p.id" class="bg-ink-gray rounded-xl p-3 flex items-center gap-3">
          <img :src="p.image" class="w-10 h-10 rounded-lg object-cover" />
          <div>
            <p class="text-sm font-medium">{{ p.name }}</p>
            <p class="text-xs text-red-400 font-bold">{{ p.stock }} left</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Active offers -->
    <div class="card p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold">Active Offers</h3>
        <RouterLink to="/admin/offers" class="text-xs text-ink-accent hover:underline">Manage</RouterLink>
      </div>
      <div class="flex flex-wrap gap-3">
        <div v-for="o in activeOffers" :key="o.id"
          class="bg-ink-gray rounded-xl px-4 py-2 flex items-center gap-3">
          <span class="font-mono font-bold text-ink-accent text-sm">{{ o.code }}</span>
          <span class="text-xs text-gray-400">{{ o.label }}</span>
        </div>
        <p v-if="!activeOffers.length" class="text-gray-500 text-sm">No active offers</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useOrderStore } from '@/stores/orders'
import { useProductStore } from '@/stores/products'
import { useCustomOrderStore } from '@/stores/customOrders'
import { useOfferStore } from '@/stores/offers'

const orderStore = useOrderStore()
const productStore = useProductStore()
const customStore = useCustomOrderStore()
const offerStore = useOfferStore()

const totalRevenue = computed(() => orderStore.orders.reduce((s, o) => s + o.total, 0))
const customers = computed(() => JSON.parse(localStorage.getItem('naqshink_users') || '[]').filter(u => u.role !== 'admin'))

const stats = computed(() => [
  { label: 'Total Revenue', value: '₹' + totalRevenue.value.toLocaleString('en-IN'), icon: '💰', color: 'text-ink-accent', sub: 'All time' },
  { label: 'Total Orders', value: orderStore.orders.length, icon: '📦', color: 'text-white', sub: orderStore.orders.filter(o => o.status === 'confirmed').length + ' pending' },
  { label: 'Customers', value: customers.value.length, icon: '👥', color: 'text-blue-400', sub: 'Registered users' },
  { label: 'Custom Requests', value: customStore.submissions.length, icon: '✏️', color: 'text-purple-400', sub: customStore.submissions.filter(s => s.printStatus === 'pending').length + ' pending' },
])

const recentOrders = computed(() => orderStore.orders.slice(0, 5))
const recentCustom = computed(() => customStore.submissions.slice(0, 5))
const lowStock = computed(() => productStore.products.filter(p => p.stock <= 10))
const activeOffers = computed(() => offerStore.offers.filter(o => o.active))

function statusClass(s) {
  return { confirmed: 'bg-blue-900/40 text-blue-400', processing: 'bg-yellow-900/40 text-yellow-400', shipped: 'bg-purple-900/40 text-purple-400', delivered: 'bg-green-900/40 text-green-400', cancelled: 'bg-red-900/40 text-red-400' }[s] || 'bg-gray-700 text-gray-400'
}
function customStatusClass(s) {
  return { pending: 'bg-gray-700 text-gray-300', reviewing: 'bg-blue-900/40 text-blue-400', printing: 'bg-yellow-900/40 text-yellow-400', delivered: 'bg-green-900/40 text-green-400', rejected: 'bg-red-900/40 text-red-400' }[s] || 'bg-gray-700 text-gray-400'
}
</script>
