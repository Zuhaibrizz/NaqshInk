<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="font-display text-3xl font-bold">Products</h1>
      <button @click="openModal()" class="btn-primary text-sm">+ Add Product</button>
    </div>

    <!-- Table -->
    <div class="card overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="border-b border-ink-gray">
          <tr class="text-gray-400 text-left">
            <th class="p-4">Image</th>
            <th class="p-4">Name</th>
            <th class="p-4">Category</th>
            <th class="p-4">Price</th>
            <th class="p-4">Stock</th>
            <th class="p-4">Status</th>
            <th class="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in store.products" :key="p.id" class="border-b border-ink-gray hover:bg-ink-gray/30 transition">
            <td class="p-4"><img :src="p.image" class="w-12 h-12 object-cover rounded-lg" /></td>
            <td class="p-4 font-medium">{{ p.name }}</td>
            <td class="p-4 text-gray-400">{{ p.category }}</td>
            <td class="p-4 text-ink-accent font-bold">₹{{ p.price }}</td>
            <td class="p-4">
              <span :class="p.stock > 10 ? 'text-green-400' : 'text-red-400'">{{ p.stock }}</span>
            </td>
            <td class="p-4">
              <button @click="store.updateProduct(p.id, { active: p.active ? 0 : 1 })"
                class="text-xs px-3 py-1 rounded-full font-medium transition"
                :style="p.active
                  ? 'background:rgba(34,197,94,0.1);color:#4ade80'
                  : 'background:rgba(239,68,68,0.1);color:#f87171'">
                {{ p.active ? '● Active' : '○ Hidden' }}
              </button>
            </td>
            <td class="p-4 flex gap-2">
              <button @click="openModal(p)" class="text-xs bg-ink-gray px-3 py-1.5 rounded-lg hover:bg-ink-accent hover:text-ink-black transition">Edit</button>
              <button @click="store.deleteProduct(p.id)" class="text-xs bg-red-900/40 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div class="bg-ink-dark rounded-2xl p-8 w-full max-w-lg border border-ink-gray">
        <h2 class="font-display text-2xl font-bold mb-6">{{ editing ? 'Edit' : 'Add' }} Product</h2>
        <form @submit.prevent="save" class="space-y-4">
          <input v-model="form.name" placeholder="Product Name" class="input" required />
          <input v-model="form.image" placeholder="Image URL" class="input" />
          <select v-model="form.category" class="input">
            <option v-for="c in store.categories.slice(1)" :key="c" :value="c">{{ c }}</option>
          </select>
          <textarea v-model="form.description" placeholder="Description" class="input h-24 resize-none"></textarea>
          <div class="grid grid-cols-3 gap-3">
            <input v-model.number="form.price" placeholder="Price ₹" type="number" class="input" required />
            <input v-model.number="form.originalPrice" placeholder="MRP ₹" type="number" class="input" />
            <input v-model.number="form.stock" placeholder="Stock" type="number" class="input" />
          </div>
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
import { ref, onMounted } from 'vue'
import { useProductStore } from '@/stores/products'

const store = useProductStore()
const showModal = ref(false)
const editing = ref(null)
const form = ref({})

onMounted(() => store.fetchAll())

function openModal(p = null) {
  editing.value = p
  form.value = p ? { ...p } : { name: '', image: '', category: 'Minimal', description: '', price: 299, originalPrice: 499, stock: 50, tags: [] }
  showModal.value = true
}

async function save() {
  if (editing.value) await store.updateProduct(editing.value.id, form.value)
  else await store.addProduct(form.value)
  showModal.value = false
}
</script>
