<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="font-display text-3xl font-bold">Customers</h1>
      <div class="text-sm" style="color:var(--text-muted)">{{ customers.length }} registered users</div>
    </div>

    <!-- Search -->
    <div class="mb-5 max-w-sm">
      <input v-model="search" placeholder="Search by name or email..." class="input text-sm" />
    </div>

    <div class="card overflow-x-auto">
      <div v-if="loading" class="text-center py-16" style="color:var(--text-faint)">Loading customers...</div>
      <div v-else-if="filtered.length === 0" class="text-center py-16" style="color:var(--text-faint)">No customers found.</div>
      <table v-else class="w-full text-sm">
        <thead style="border-bottom:1px solid var(--border)">
          <tr class="text-left" style="color:var(--text-faint)">
            <th class="p-4">Customer</th>
            <th class="p-4">Phone</th>
            <th class="p-4">Location</th>
            <th class="p-4">Role</th>
            <th class="p-4">Orders</th>
            <th class="p-4">Spent</th>
            <th class="p-4">Joined</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in filtered" :key="c.id"
            class="transition" style="border-bottom:1px solid var(--border)"
            @mouseenter="e=>e.currentTarget.style.background='var(--bg-input)'"
            @mouseleave="e=>e.currentTarget.style.background=''">
            <td class="p-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style="background:rgba(200,169,110,0.15);color:var(--accent)">
                  {{ c.name?.[0]?.toUpperCase() }}
                </div>
                <div>
                  <p class="font-medium" style="color:var(--text)">{{ c.name }}</p>
                  <p class="text-xs" style="color:var(--text-faint)">{{ c.email }}</p>
                </div>
              </div>
            </td>
            <td class="p-4" style="color:var(--text-muted)">{{ c.phone || '—' }}</td>
            <td class="p-4 text-xs" style="color:var(--text-muted)">
              {{ [c.city, c.state].filter(Boolean).join(', ') || '—' }}
            </td>
            <td class="p-4">
              <select :value="c.role" @change="setRole(c.id, $event.target.value)"
                class="text-xs rounded-lg px-2 py-1 outline-none transition"
                :style="c.role === 'admin'
                  ? 'background:rgba(234,179,8,0.15);color:#facc15;border:1px solid rgba(234,179,8,0.3)'
                  : 'background:var(--bg-input);color:var(--text-muted);border:1px solid var(--border)'">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td class="p-4 font-semibold" style="color:var(--text)">{{ c.order_count }}</td>
            <td class="p-4 font-bold" style="color:var(--accent)">₹{{ c.total_spent }}</td>
            <td class="p-4 text-xs" style="color:var(--text-faint)">
              {{ new Date(c.created_at).toLocaleDateString('en-IN') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { customerApi } from '@/lib/api'

const customers = ref([])
const loading = ref(true)
const search = ref('')

const filtered = computed(() => {
  if (!search.value) return customers.value
  const q = search.value.toLowerCase()
  return customers.value.filter(c =>
    c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)
  )
})

onMounted(async () => {
  try {
    customers.value = await customerApi.list()
  } finally {
    loading.value = false
  }
})

async function setRole(id, role) {
  await customerApi.setRole(id, role)
  const c = customers.value.find(x => x.id === id)
  if (c) c.role = role
}
</script>
