<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="font-display text-3xl font-bold">Offers & Coupons</h1>
      <button @click="openModal()" class="btn-primary text-sm">+ Add Offer</button>
    </div>

    <div class="card overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="border-b border-ink-gray">
          <tr class="text-gray-400 text-left">
            <th class="p-4">Code</th>
            <th class="p-4">Type</th>
            <th class="p-4">Value</th>
            <th class="p-4">Min Order</th>
            <th class="p-4">Status</th>
            <th class="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in store.offers" :key="o.id" class="border-b border-ink-gray hover:bg-ink-gray/30 transition">
            <td class="p-4 font-mono font-bold text-ink-accent">{{ o.code }}</td>
            <td class="p-4 capitalize text-gray-400">{{ o.type }}</td>
            <td class="p-4 font-semibold">
              {{ o.type === 'flat' ? '₹' + o.value : o.value + '%' }}
              <span v-if="o.type === 'multibuy'" class="text-xs text-gray-500"> (buy {{ o.minQty }}+)</span>
            </td>
            <td class="p-4 text-gray-400">{{ o.minOrder ? '₹' + o.minOrder : '—' }}</td>
            <td class="p-4">
              <button @click="store.updateOffer(o.id, { active: !o.active })"
                :class="o.active ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'"
                class="text-xs px-3 py-1 rounded-full font-medium">
                {{ o.active ? 'Active' : 'Inactive' }}
              </button>
            </td>
            <td class="p-4 flex gap-2">
              <button @click="openModal(o)" class="text-xs bg-ink-gray px-3 py-1.5 rounded-lg hover:bg-ink-accent hover:text-ink-black transition">Edit</button>
              <button @click="store.deleteOffer(o.id)" class="text-xs bg-red-900/40 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div class="bg-ink-dark rounded-2xl p-8 w-full max-w-md border border-ink-gray">
        <h2 class="font-display text-2xl font-bold mb-6">{{ editing ? 'Edit' : 'Add' }} Offer</h2>
        <form @submit.prevent="save" class="space-y-4">
          <input v-model="form.code" placeholder="Coupon Code (e.g. SAVE20)" class="input uppercase" required />
          <select v-model="form.type" class="input">
            <option value="percentage">Percentage off</option>
            <option value="flat">Flat discount (₹)</option>
            <option value="multibuy">Multi-buy discount</option>
          </select>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs text-gray-500 mb-1 block">
                {{ form.type === 'flat' ? 'Discount ₹' : 'Discount %' }}
              </label>
              <input v-model.number="form.value" type="number" class="input" required />
            </div>
            <div v-if="form.type !== 'multibuy'">
              <label class="text-xs text-gray-500 mb-1 block">Min Order ₹</label>
              <input v-model.number="form.minOrder" type="number" class="input" />
            </div>
            <div v-else>
              <label class="text-xs text-gray-500 mb-1 block">Min Qty</label>
              <input v-model.number="form.minQty" type="number" min="2" class="input" />
            </div>
          </div>
          <input v-model="form.label" placeholder="Display label" class="input" />
          <label class="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" v-model="form.active" class="w-4 h-4 accent-yellow-400" />
            Active
          </label>
          <div class="flex gap-3 pt-2">
            <button type="submit" class="btn-primary flex-1">Save</button>
            <button type="button" @click="showModal=false" class="btn-outline flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useOfferStore } from '@/stores/offers'

const store = useOfferStore()
const showModal = ref(false)
const editing = ref(null)
const form = ref({})

function openModal(o = null) {
  editing.value = o
  form.value = o ? { ...o } : { code: '', type: 'percentage', value: 10, minOrder: 0, minQty: 2, label: '', active: true }
  showModal.value = true
}

function save() {
  form.value.code = form.value.code.toUpperCase()
  if (editing.value) store.updateOffer(editing.value.id, form.value)
  else store.addOffer(form.value)
  showModal.value = false
}
</script>
