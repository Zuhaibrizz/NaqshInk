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
            <th class="p-4">Tracking</th>
            <th class="p-4">Date</th>
            <th class="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in orders.orders" :key="o.id" class="border-b border-ink-gray hover:bg-ink-gray/30 transition">
            <td class="p-4 font-mono text-xs text-ink-accent">{{ o.id }}</td>
            <td class="p-4">
              <p class="font-medium">{{ o.address.name }}</p>
              <p class="text-gray-500 text-xs">{{ o.address.email }}</p>
              <p class="text-gray-500 text-xs">{{ o.address.phone }}</p>
            </td>
            <td class="p-4 text-gray-400">{{ o.items.length }} item(s)</td>
            <td class="p-4 font-bold text-ink-accent">₹{{ o.total }}</td>
            <td class="p-4">
              <span :class="statusClass(o.status)" class="text-xs px-2 py-1 rounded-full font-medium capitalize">
                {{ statusLabel(o.status) }}
              </span>
            </td>
            <td class="p-4 text-xs text-gray-400">
              <span v-if="o.trackingNumber" class="font-mono text-ink-accent">{{ o.trackingNumber }}</span>
              <span v-else class="text-gray-600">—</span>
              <p v-if="o.trackingStatus" class="text-gray-500 mt-0.5">{{ o.trackingStatus }}</p>
              <p v-if="o.trackingLocation" class="text-gray-600 mt-0.5">📍 {{ o.trackingLocation }}</p>
            </td>
            <td class="p-4 text-gray-500 text-xs">{{ new Date(o.createdAt).toLocaleDateString('en-IN') }}</td>
            <td class="p-4">
              <div class="flex flex-col gap-2">
                <select :value="o.status" @change="orders.updateStatus(o.id, $event.target.value)"
                  class="bg-ink-gray text-white text-xs rounded-lg px-2 py-1 border border-ink-gray focus:outline-none">
                  <option v-for="s in statuses" :key="s.value" :value="s.value">{{ s.label }}</option>
                </select>
                <button @click="openTracking(o)"
                  class="text-xs px-2 py-1 rounded-lg border border-ink-accent/30 text-ink-accent hover:bg-ink-accent/10 transition">
                  📦 Update Tracking
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Tracking update modal -->
    <Teleport to="body">
      <div v-if="trackingOrder" class="fixed inset-0 z-50 flex items-center justify-center px-4"
        style="background:rgba(0,0,0,0.7)" @click.self="trackingOrder=null">
        <div class="card p-6 max-w-md w-full space-y-4">
          <h3 class="font-semibold text-lg">Update Tracking
            <span class="font-mono text-ink-accent text-sm ml-2">{{ trackingOrder.id }}</span>
          </h3>

          <div>
            <label class="text-xs text-gray-500 mb-1 block">Courier</label>
            <input v-model="trackingForm.courier" class="input text-sm" placeholder="Delhivery" />
          </div>
          <div>
            <label class="text-xs text-gray-500 mb-1 block">Tracking Number (AWB)</label>
            <input v-model="trackingForm.trackingNumber" class="input text-sm" placeholder="e.g. 1234567890123" />
          </div>
          <div>
            <label class="text-xs text-gray-500 mb-1 block">Tracking Status</label>
            <select v-model="trackingForm.trackingStatus" class="input text-sm">
              <option value="">Select status</option>
              <option v-for="s in delhiveryStatuses" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
          <div>
            <label class="text-xs text-gray-500 mb-1 block">Current Location</label>
            <input v-model="trackingForm.trackingLocation" class="input text-sm" placeholder="e.g. Delhi Hub, Delhi" />
          </div>

          <p v-if="trackingError" class="text-red-400 text-xs">{{ trackingError }}</p>
          <div class="flex gap-3 justify-end pt-2">
            <button @click="trackingOrder=null" class="btn-outline text-sm py-2 px-4">Cancel</button>
            <button @click="saveTracking" :disabled="trackingLoading" class="btn-primary text-sm py-2 px-4 disabled:opacity-60">
              {{ trackingLoading ? 'Saving...' : 'Save Tracking' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '@/stores/orders'

const orders = useOrderStore()
onMounted(() => orders.fetchAll())

const statuses = [
  { value: 'confirmed',        label: '✅ Confirmed' },
  { value: 'processing',       label: '🔄 Processing' },
  { value: 'printed',          label: '🖨️ Printed' },
  { value: 'dispatched',       label: '📦 Dispatched' },
  { value: 'in_transit',       label: '🚚 In Transit' },
  { value: 'out_for_delivery', label: '🛵 Out for Delivery' },
  { value: 'delivered',        label: '✔️ Delivered' },
  { value: 'cancelled',        label: '❌ Cancelled' },
]

const delhiveryStatuses = [
  'Shipment Booked',
  'Picked Up',
  'In Transit',
  'Reached Destination Hub',
  'Out for Delivery',
  'Delivery Attempted',
  'Delivered',
  'RTO Initiated',
  'RTO Delivered',
]

function statusLabel(s) {
  return statuses.find(x => x.value === s)?.label.replace(/^.+?\s/, '') || s
}

const stats = computed(() => [
  { label: 'Total Orders',  value: orders.orders.length, color: 'text-white' },
  { label: 'Revenue',       value: '₹' + orders.orders.reduce((s, o) => s + o.total, 0), color: 'text-ink-accent' },
  { label: 'Delivered',     value: orders.orders.filter(o => o.status === 'delivered').length, color: 'text-green-400' },
  { label: 'Pending',       value: orders.orders.filter(o => ['confirmed','processing','printed'].includes(o.status)).length, color: 'text-yellow-400' },
])

function statusClass(s) {
  return {
    confirmed:        'bg-blue-900/40 text-blue-400',
    processing:       'bg-yellow-900/40 text-yellow-400',
    printed:          'bg-orange-900/40 text-orange-400',
    dispatched:       'bg-indigo-900/40 text-indigo-400',
    in_transit:       'bg-purple-900/40 text-purple-400',
    out_for_delivery: 'bg-cyan-900/40 text-cyan-400',
    delivered:        'bg-green-900/40 text-green-400',
    cancelled:        'bg-red-900/40 text-red-400',
  }[s] || 'bg-gray-700 text-gray-400'
}

// ── Tracking modal ──
const trackingOrder = ref(null)
const trackingLoading = ref(false)
const trackingError = ref('')
const trackingForm = ref({ courier: '', trackingNumber: '', trackingStatus: '', trackingLocation: '' })

function openTracking(order) {
  trackingOrder.value = order
  trackingError.value = ''
  trackingForm.value = {
    courier:          order.courier          || 'Delhivery',
    trackingNumber:   order.trackingNumber   || '',
    trackingStatus:   order.trackingStatus   || '',
    trackingLocation: order.trackingLocation || '',
  }
}

async function saveTracking() {
  trackingLoading.value = true
  trackingError.value = ''
  try {
    await orders.updateTracking(trackingOrder.value.id, trackingForm.value)
    trackingOrder.value = null
  } catch (e) {
    trackingError.value = e.message
  } finally {
    trackingLoading.value = false
  }
}
</script>
