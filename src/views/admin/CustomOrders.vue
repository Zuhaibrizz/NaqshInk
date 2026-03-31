<template>
  <div>
    <h1 class="font-display text-3xl font-bold mb-8">Custom Design Requests</h1>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div v-for="s in stats" :key="s.label" class="card p-5">
        <p class="text-gray-400 text-xs mb-1">{{ s.label }}</p>
        <p class="text-2xl font-bold" :class="s.color">{{ s.value }}</p>
      </div>
    </div>

    <div v-if="store.submissions.length === 0" class="card text-center py-16 text-gray-500">
      No custom design requests yet.
    </div>

    <div v-else class="space-y-4">
      <div v-for="c in store.submissions" :key="c.id" class="card p-5">
        <div class="flex gap-4">
          <!-- Image -->
          <div class="flex-shrink-0">
            <img v-if="c.imageDataUrl" :src="c.imageDataUrl" class="w-24 h-24 object-cover rounded-xl" />
            <div v-else class="w-24 h-24 bg-ink-gray rounded-xl flex items-center justify-center text-3xl">🎨</div>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div>
                <p class="font-mono text-ink-accent text-sm font-bold">{{ c.id }}</p>
                <p class="text-sm font-medium">{{ c.userName }} · {{ c.userEmail }}</p>
                <p class="text-xs text-gray-500">{{ c.phone }} · {{ new Date(c.createdAt).toLocaleDateString('en-IN') }}</p>
              </div>
              <span :class="statusClass(c.printStatus)" class="text-xs px-3 py-1 rounded-full font-semibold capitalize">
                {{ c.printStatus }}
              </span>
            </div>

            <p class="text-sm text-gray-300 mb-2">{{ c.description }}</p>

            <div class="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
              <span class="bg-ink-gray px-2 py-1 rounded">{{ c.size }}</span>
              <span class="bg-ink-gray px-2 py-1 rounded">{{ c.placement || 'No placement' }}</span>
              <span class="bg-ink-gray px-2 py-1 rounded">Qty: {{ c.quantity }}</span>
              <span v-if="c.price" class="bg-ink-accent/20 text-ink-accent px-2 py-1 rounded font-bold">₹{{ c.price }}</span>
            </div>

            <p v-if="c.notes" class="text-xs text-gray-500 italic mb-3">Notes: {{ c.notes }}</p>

            <!-- Admin actions -->
            <div class="flex flex-wrap gap-3 items-end">
              <div>
                <label class="text-xs text-gray-500 block mb-1">Update Status</label>
                <select :value="c.printStatus" @change="updateStatus(c.id, $event.target.value)"
                  class="bg-ink-gray text-white text-xs rounded-lg px-3 py-2 border border-ink-gray focus:outline-none focus:border-ink-accent">
                  <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
              <div>
                <label class="text-xs text-gray-500 block mb-1">Set Price (₹)</label>
                <input :value="c.price || ''" @change="setPrice(c.id, $event.target.value)"
                  type="number" placeholder="e.g. 799" class="input text-xs py-2 w-28" />
              </div>
              <div class="flex-1 min-w-40">
                <label class="text-xs text-gray-500 block mb-1">Admin Note</label>
                <input :value="c.adminNote" @change="setNote(c.id, $event.target.value)"
                  placeholder="Message to customer..." class="input text-xs py-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCustomOrderStore } from '@/stores/customOrders'

const store = useCustomOrderStore()
const statuses = ['pending', 'reviewing', 'printing', 'printed', 'shipped', 'delivered', 'rejected']

const stats = computed(() => [
  { label: 'Total Requests', value: store.submissions.length, color: 'text-white' },
  { label: 'Pending', value: store.submissions.filter(s => s.printStatus === 'pending').length, color: 'text-yellow-400' },
  { label: 'Printing', value: store.submissions.filter(s => s.printStatus === 'printing').length, color: 'text-blue-400' },
  { label: 'Delivered', value: store.submissions.filter(s => s.printStatus === 'delivered').length, color: 'text-green-400' }
])

function updateStatus(id, status) { store.updateStatus(id, status) }
function setPrice(id, price) { store.updateStatus(id, store.submissions.find(s => s.id === id)?.printStatus, undefined, Number(price)) }
function setNote(id, note) { store.updateStatus(id, store.submissions.find(s => s.id === id)?.printStatus, note) }

function statusClass(s) {
  return {
    pending: 'bg-gray-700 text-gray-300',
    reviewing: 'bg-blue-900/40 text-blue-400',
    printing: 'bg-yellow-900/40 text-yellow-400',
    printed: 'bg-purple-900/40 text-purple-400',
    shipped: 'bg-indigo-900/40 text-indigo-400',
    delivered: 'bg-green-900/40 text-green-400',
    rejected: 'bg-red-900/40 text-red-400'
  }[s] || 'bg-gray-700 text-gray-400'
}
</script>
