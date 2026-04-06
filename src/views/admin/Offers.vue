<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="font-display text-3xl font-bold">Offers & Coupons</h1>
      <button @click="openModal()" class="btn-primary text-sm">+ Add Offer</button>
    </div>

    <div class="card overflow-x-auto">
      <div v-if="loading" class="text-center py-16" style="color:var(--text-faint)">Loading...</div>
      <div v-else-if="!store.offers.length" class="text-center py-16" style="color:var(--text-faint)">No offers yet.</div>
      <table v-else class="w-full text-sm">
        <thead style="border-bottom:1px solid var(--border)">
          <tr class="text-left" style="color:var(--text-faint)">
            <th class="p-4">Code</th>
            <th class="p-4">Type</th>
            <th class="p-4">Value</th>
            <th class="p-4">Applies To</th>
            <th class="p-4">Min Order</th>
            <th class="p-4">Status</th>
            <th class="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in store.offers" :key="o.id"
            class="transition" style="border-bottom:1px solid var(--border)"
            @mouseenter="e=>e.currentTarget.style.background='var(--bg-input)'"
            @mouseleave="e=>e.currentTarget.style.background=''">
            <td class="p-4 font-mono font-bold" style="color:var(--accent)">{{ o.code }}</td>
            <td class="p-4 capitalize" style="color:var(--text-muted)">{{ o.type }}</td>
            <td class="p-4 font-semibold" style="color:var(--text)">
              {{ o.type === 'flat' ? '₹' + o.value : o.value + '%' }}
              <span v-if="o.type === 'multibuy'" class="text-xs" style="color:var(--text-faint)"> (buy {{ o.minQty }}+)</span>
            </td>
            <td class="p-4">
              <span class="text-xs px-2 py-1 rounded-full"
                :style="o.applies_to === 'all'
                  ? 'background:rgba(200,169,110,0.1);color:var(--accent)'
                  : 'background:var(--bg-input);color:var(--text-muted)'">
                {{ appliesLabel(o) }}
              </span>
            </td>
            <td class="p-4" style="color:var(--text-muted)">{{ o.minOrder ? '₹' + o.minOrder : '—' }}</td>
            <td class="p-4">
              <button @click="store.updateOffer(o.id, { active: !o.active })"
                class="text-xs px-3 py-1 rounded-full font-medium transition"
                :style="o.active
                  ? 'background:rgba(34,197,94,0.1);color:#4ade80'
                  : 'background:rgba(239,68,68,0.1);color:#f87171'">
                {{ o.active ? 'Active' : 'Inactive' }}
              </button>
            </td>
            <td class="p-4 flex gap-2">
              <button @click="openModal(o)"
                class="text-xs px-3 py-1.5 rounded-lg transition"
                style="background:var(--bg-input);color:var(--text-muted)">Edit</button>
              <button @click="store.deleteOffer(o.id)"
                class="text-xs px-3 py-1.5 rounded-lg transition"
                style="background:rgba(239,68,68,0.1);color:#f87171">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <div class="rounded-2xl p-8 w-full max-w-lg border" style="background:var(--bg-card);border-color:var(--border)">
          <h2 class="font-display text-2xl font-bold mb-6">{{ editing ? 'Edit' : 'Add' }} Offer</h2>
          <form @submit.prevent="save" class="space-y-4">

            <input v-model="form.code" placeholder="Coupon Code (e.g. SAVE20)" class="input" style="text-transform:uppercase" required />

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs mb-1 block" style="color:var(--text-faint)">Offer Type</label>
                <select v-model="form.type" class="input">
                  <option value="percentage">Percentage off</option>
                  <option value="flat">Flat discount (₹)</option>
                  <option value="multibuy">Multi-buy discount</option>
                </select>
              </div>
              <div>
                <label class="text-xs mb-1 block" style="color:var(--text-faint)">
                  {{ form.type === 'flat' ? 'Discount ₹' : 'Discount %' }}
                </label>
                <input v-model.number="form.value" type="number" min="1" class="input" required />
              </div>
            </div>

            <!-- Applies To -->
            <div>
              <label class="text-xs mb-1 block" style="color:var(--text-faint)">Applies To</label>
              <select v-model="form.applies_to" class="input">
                <option value="all">All Products</option>
                <option value="category">Specific Category</option>
                <option value="product">Specific Product</option>
              </select>
            </div>

            <!-- Category picker -->
            <div v-if="form.applies_to === 'category'">
              <label class="text-xs mb-1 block" style="color:var(--text-faint)">Select Category</label>
              <select v-model="form.target_value" class="input">
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <!-- Product picker -->
            <div v-if="form.applies_to === 'product'">
              <label class="text-xs mb-1 block" style="color:var(--text-faint)">Select Product</label>
              <select v-model="form.target_value" class="input">
                <option v-for="p in productStore.products" :key="p.id" :value="String(p.id)">
                  {{ p.name }} — ₹{{ p.price }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div v-if="form.type !== 'multibuy'">
                <label class="text-xs mb-1 block" style="color:var(--text-faint)">Min Order ₹</label>
                <input v-model.number="form.minOrder" type="number" min="0" class="input" />
              </div>
              <div v-else>
                <label class="text-xs mb-1 block" style="color:var(--text-faint)">Min Qty</label>
                <input v-model.number="form.minQty" type="number" min="2" class="input" />
              </div>
              <div>
                <label class="text-xs mb-1 block" style="color:var(--text-faint)">Max Uses (0 = unlimited)</label>
                <input v-model.number="form.max_uses" type="number" min="0" class="input" placeholder="0" />
              </div>
            </div>

            <input v-model="form.label" placeholder="Display label (shown to customer)" class="input" />

            <label class="flex items-center gap-2 text-sm cursor-pointer" style="color:var(--text-muted)">
              <input type="checkbox" v-model="form.active" class="w-4 h-4 accent-yellow-400" />
              Active
            </label>

            <p v-if="saveError" class="text-red-400 text-sm">{{ saveError }}</p>

            <div class="flex gap-3 pt-2">
              <button type="submit" :disabled="saving" class="btn-primary flex-1">
                {{ saving ? 'Saving...' : 'Save Offer' }}
              </button>
              <button type="button" @click="showModal=false" class="btn-outline flex-1">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useOfferStore } from '@/stores/offers'
import { useProductStore } from '@/stores/products'

const store = useOfferStore()
const productStore = useProductStore()
const showModal = ref(false)
const editing = ref(null)
const saving = ref(false)
const saveError = ref('')
const loading = ref(true)
const form = ref({})

const categories = ['Spiritual', 'Nature', 'Geometric', 'Floral', 'Minimal', 'Celestial', 'Custom']

onMounted(async () => {
  await Promise.all([store.fetchAll(), productStore.fetchAll()])
  loading.value = false
})

function appliesLabel(o) {
  if (o.applies_to === 'category') return `Category: ${o.target_value}`
  if (o.applies_to === 'product') {
    const p = productStore.products.find(x => String(x.id) === String(o.target_value))
    return `Product: ${p?.name || o.target_value}`
  }
  return 'All Products'
}

function openModal(o = null) {
  editing.value = o
  saveError.value = ''
  form.value = o ? { ...o } : {
    code: '', type: 'percentage', value: 10,
    applies_to: 'all', target_value: null,
    minOrder: 0, minQty: 2, max_uses: 0,
    label: '', active: true
  }
  showModal.value = true
}

async function save() {
  saving.value = true
  saveError.value = ''
  try {
    const payload = {
      ...form.value,
      code: form.value.code.toUpperCase(),
      min_order: form.value.minOrder,
      min_qty:   form.value.minQty,
      target_value: form.value.applies_to === 'all' ? null : form.value.target_value,
    }
    if (editing.value) await store.updateOffer(editing.value.id, payload)
    else await store.addOffer(payload)
    showModal.value = false
  } catch (e) {
    saveError.value = e.message
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
