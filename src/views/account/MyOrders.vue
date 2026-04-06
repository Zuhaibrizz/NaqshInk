<template>
  <div class="page-top min-h-screen max-w-5xl mx-auto px-4 py-12">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-display text-3xl font-bold">My Account</h1>
        <p class="text-gray-400 text-sm mt-1">Welcome back, <span class="text-ink-accent">{{ auth.user?.name }}</span></p>
      </div>
      <div class="flex gap-3">
        <RouterLink to="/account/custom-order"
          class="btn-primary text-sm py-2 px-4">+ Submit Custom Design</RouterLink>
        <button @click="auth.logout(); $router.push('/')"
          class="btn-outline text-sm py-2 px-4">Logout</button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-ink-dark rounded-xl p-1 mb-8 w-fit">
      <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
        :class="activeTab === tab.key ? 'bg-ink-accent text-ink-black' : 'text-gray-400 hover:text-white'"
        class="px-5 py-2 rounded-lg text-sm font-medium transition">
        {{ tab.label }}
        <span v-if="tab.count" class="ml-1 text-xs opacity-70">({{ tab.count }})</span>
      </button>
    </div>

    <!-- Orders Tab -->
    <div v-if="activeTab === 'orders'">
      <div v-if="myOrders.length === 0" class="text-center py-20 text-gray-500">
        <p class="text-5xl mb-4">📦</p>
        <p class="mb-4">No orders yet.</p>
        <RouterLink to="/shop" class="btn-primary">Start Shopping</RouterLink>
      </div>

      <div v-else class="space-y-6">
        <div v-for="order in myOrders" :key="order.id" class="card p-6">
          <!-- Order header -->
          <div class="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <p class="font-mono text-ink-accent font-bold text-sm">{{ order.id }}</p>
              <p class="text-gray-500 text-xs mt-0.5">{{ new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }) }}</p>
            </div>
            <span :class="statusClass(order.status)" class="text-xs px-3 py-1 rounded-full font-semibold capitalize">
              {{ order.status }}
            </span>
          </div>

          <!-- Tracking timeline -->
          <div class="mb-5">
            <div class="flex items-center gap-0">
              <div v-for="(step, i) in trackingSteps" :key="step.key" class="flex items-center flex-1 last:flex-none">
                <div class="flex flex-col items-center">
                  <div :class="stepDone(order.status, step.key) ? 'bg-ink-accent text-ink-black' : 'bg-ink-gray text-gray-500'"
                    class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all">
                    {{ stepDone(order.status, step.key) ? '✓' : i + 1 }}
                  </div>
                  <p class="text-xs mt-1 text-center w-16 leading-tight"
                    :class="stepDone(order.status, step.key) ? 'text-ink-accent' : 'text-gray-600'">
                    {{ step.label }}
                  </p>
                </div>
                <div v-if="i < trackingSteps.length - 1"
                  :class="stepDone(order.status, trackingSteps[i+1].key) ? 'bg-ink-accent' : 'bg-ink-gray'"
                  class="flex-1 h-0.5 mb-5 transition-all">
                </div>
              </div>
            </div>
          </div>

          <!-- Items -->
          <div class="border-t border-ink-gray pt-4">
            <div class="flex flex-wrap gap-3 mb-3">
              <div v-for="item in order.items" :key="item.id" class="flex items-center gap-2 bg-ink-gray rounded-lg px-3 py-2">
                <img :src="item.image" class="w-8 h-8 rounded object-cover" />
                <span class="text-sm">{{ item.name }}</span>
                <span class="text-xs text-gray-500">×{{ item.qty }}</span>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <p class="text-xs text-gray-500">
                Shipped to: {{ order.address.city }}, {{ order.address.state }} – {{ order.address.pincode }}
              </p>
              <p class="font-bold text-ink-accent">₹{{ order.total }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Orders Tab -->
    <div v-if="activeTab === 'custom'">
      <div v-if="myCustomOrders.length === 0" class="text-center py-20 text-gray-500">
        <p class="text-5xl mb-4">🎨</p>
        <p class="mb-4">No custom designs submitted yet.</p>
        <RouterLink to="/account/custom-order" class="btn-primary">Submit Your Design</RouterLink>
      </div>

      <div v-else class="space-y-4">
        <div v-for="c in myCustomOrders" :key="c.id" class="card p-5 flex gap-4">
          <img v-if="c.imageDataUrl" :src="c.imageDataUrl" class="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
          <div v-else class="w-20 h-20 bg-ink-gray rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🎨</div>
          <div class="flex-1">
            <div class="flex items-start justify-between gap-2">
              <p class="font-mono text-xs text-ink-accent">{{ c.id }}</p>
              <span :class="customStatusClass(c.printStatus)" class="text-xs px-2 py-0.5 rounded-full font-medium capitalize">
                {{ c.printStatus }}
              </span>
            </div>
            <p class="text-sm text-gray-300 mt-1 line-clamp-2">{{ c.description }}</p>
            <div class="flex gap-4 mt-2 text-xs text-gray-500">
              <span>Size: {{ c.size }}</span>
              <span>Placement: {{ c.placement }}</span>
              <span>Qty: {{ c.quantity }}</span>
              <span v-if="c.price" class="text-ink-accent font-bold">₹{{ c.price }}</span>
            </div>
            <p v-if="c.adminNote" class="mt-2 text-xs text-yellow-400 bg-yellow-900/20 rounded px-2 py-1">
              Admin: {{ c.adminNote }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/orders'
import { useCustomOrderStore } from '@/stores/customOrders'

const auth = useAuthStore()
const orderStore = useOrderStore()
const customStore = useCustomOrderStore()

const myOrders = computed(() => orderStore.orders)
const myCustomOrders = computed(() => customStore.submissions)

const activeTab = ref('orders')
const tabs = computed(() => [
  { key: 'orders', label: 'My Orders', count: myOrders.value.length },
  { key: 'custom', label: 'Custom Designs', count: myCustomOrders.value.length }
])

onMounted(async () => {
  await orderStore.fetchMine()
})

const trackingSteps = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' }
]

const statusOrder = ['confirmed', 'processing', 'shipped', 'delivered']

function stepDone(orderStatus, stepKey) {
  if (orderStatus === 'cancelled') return false
  return statusOrder.indexOf(orderStatus) >= statusOrder.indexOf(stepKey)
}

function statusClass(s) {
  return {
    confirmed: 'bg-blue-900/40 text-blue-400',
    processing: 'bg-yellow-900/40 text-yellow-400',
    shipped: 'bg-purple-900/40 text-purple-400',
    delivered: 'bg-green-900/40 text-green-400',
    cancelled: 'bg-red-900/40 text-red-400'
  }[s] || 'bg-gray-700 text-gray-400'
}

function customStatusClass(s) {
  return {
    pending: 'bg-gray-700 text-gray-400',
    reviewing: 'bg-blue-900/40 text-blue-400',
    printing: 'bg-yellow-900/40 text-yellow-400',
    printed: 'bg-purple-900/40 text-purple-400',
    shipped: 'bg-indigo-900/40 text-indigo-400',
    delivered: 'bg-green-900/40 text-green-400',
    rejected: 'bg-red-900/40 text-red-400'
  }[s] || 'bg-gray-700 text-gray-400'
}
</script>
