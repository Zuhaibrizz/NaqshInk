<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="font-display text-3xl font-bold">Site Content</h1>
      <button @click="openAdd()" class="btn-primary text-sm">+ Add Item</button>
    </div>

    <div v-if="loading" class="text-center py-16" style="color:var(--text-faint)">Loading...</div>

    <div v-else class="space-y-8">
      <div v-for="(items, section) in content" :key="section" class="card overflow-hidden">
        <!-- Section header -->
        <div class="px-6 py-4 flex items-center justify-between" style="border-bottom:1px solid var(--border);background:var(--bg-input)">
          <h2 class="font-semibold capitalize" style="color:var(--text)">{{ section }}</h2>
          <span class="text-xs" style="color:var(--text-faint)">{{ items.length }} items</span>
        </div>

        <div class="divide-y" style="border-color:var(--border)">
          <div v-for="item in items" :key="item.id" class="px-6 py-4 flex items-start gap-4">
            <!-- Type badge -->
            <span class="text-xs px-2 py-1 rounded-full flex-shrink-0 mt-0.5 capitalize"
              :style="typeStyle(item.type)">
              {{ item.type }}
            </span>

            <!-- Key -->
            <div class="w-40 flex-shrink-0">
              <p class="text-xs font-mono" style="color:var(--text-faint)">{{ item.key }}</p>
            </div>

            <!-- Value editor -->
            <div class="flex-1 min-w-0">
              <!-- Image/video preview -->
              <div v-if="item.type === 'image' && item.value" class="mb-2">
                <img :src="item.value" class="h-16 rounded-lg object-cover" />
              </div>
              <div v-if="item.type === 'video' && item.value" class="mb-2">
                <div class="text-xs px-3 py-2 rounded-lg" style="background:var(--bg-input);color:var(--text-muted)">
                  🎬 {{ item.value }}
                </div>
              </div>

              <textarea v-if="editing === item.id"
                v-model="editValue"
                class="input text-sm resize-none w-full"
                :rows="item.type === 'text' ? 2 : 1"
                @keydown.escape="editing = null">
              </textarea>
              <p v-else class="text-sm truncate" style="color:var(--text-muted)">{{ item.value || '—' }}</p>
            </div>

            <!-- Active toggle -->
            <button @click="toggleActive(item)"
              class="text-xs px-2 py-1 rounded-full flex-shrink-0 transition"
              :style="item.active
                ? 'background:rgba(34,197,94,0.1);color:#4ade80'
                : 'background:rgba(239,68,68,0.1);color:#f87171'">
              {{ item.active ? '● On' : '○ Off' }}
            </button>

            <!-- Actions -->
            <div class="flex gap-2 flex-shrink-0">
              <button v-if="editing !== item.id" @click="startEdit(item)"
                class="text-xs px-3 py-1.5 rounded-lg transition"
                style="background:var(--bg-input);color:var(--text-muted)">Edit</button>
              <button v-else @click="saveEdit(item)"
                class="text-xs px-3 py-1.5 rounded-lg transition"
                style="background:var(--accent);color:#0a0a0a">Save</button>
              <button @click="deleteItem(item.id)"
                class="text-xs px-3 py-1.5 rounded-lg transition"
                style="background:rgba(239,68,68,0.1);color:#f87171">✕</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add modal -->
    <Transition name="modal">
      <div v-if="showAdd" class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <div class="rounded-2xl p-8 w-full max-w-md border" style="background:var(--bg-card);border-color:var(--border)">
          <h2 class="font-display text-xl font-bold mb-6">Add Content Item</h2>
          <form @submit.prevent="addItem" class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs mb-1 block" style="color:var(--text-faint)">Section</label>
                <input v-model="newItem.section" placeholder="e.g. hero, videos" class="input text-sm" required />
              </div>
              <div>
                <label class="text-xs mb-1 block" style="color:var(--text-faint)">Key</label>
                <input v-model="newItem.key" placeholder="e.g. title, video_url" class="input text-sm" required />
              </div>
            </div>
            <div>
              <label class="text-xs mb-1 block" style="color:var(--text-faint)">Type</label>
              <select v-model="newItem.type" class="input text-sm">
                <option value="text">Text</option>
                <option value="image">Image URL</option>
                <option value="video">Video URL / YouTube ID</option>
                <option value="html">HTML</option>
                <option value="boolean">Boolean (true/false)</option>
              </select>
            </div>
            <div>
              <label class="text-xs mb-1 block" style="color:var(--text-faint)">Value</label>
              <textarea v-model="newItem.value" class="input text-sm resize-none" rows="3" placeholder="Content value..."></textarea>
            </div>
            <div class="flex gap-3">
              <button type="submit" class="btn-primary flex-1">Add</button>
              <button type="button" @click="showAdd=false" class="btn-outline flex-1">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/lib/api'

const content = ref({})
const loading = ref(true)
const editing = ref(null)
const editValue = ref('')
const showAdd = ref(false)
const newItem = ref({ section: '', key: '', value: '', type: 'text' })

onMounted(async () => {
  await load()
  loading.value = false
})

async function load() {
  content.value = await api.get('/content')
}

function startEdit(item) {
  editing.value = item.id
  editValue.value = item.value
}

async function saveEdit(item) {
  await api.put(`/content/${item.id}`, { value: editValue.value, active: item.active })
  item.value = editValue.value
  editing.value = null
}

async function toggleActive(item) {
  await api.put(`/content/${item.id}`, { value: item.value, active: !item.active })
  item.active = !item.active
}

async function deleteItem(id) {
  if (!confirm('Delete this content item?')) return
  await api.delete(`/content/${id}`)
  await load()
}

function openAdd() {
  newItem.value = { section: '', key: '', value: '', type: 'text' }
  showAdd.value = true
}

async function addItem() {
  await api.post('/content', newItem.value)
  showAdd.value = false
  await load()
}

function typeStyle(type) {
  return {
    text:    'background:rgba(200,169,110,0.1);color:var(--accent)',
    image:   'background:rgba(99,102,241,0.1);color:#818cf8',
    video:   'background:rgba(239,68,68,0.1);color:#f87171',
    html:    'background:rgba(34,197,94,0.1);color:#4ade80',
    boolean: 'background:rgba(234,179,8,0.1);color:#facc15',
  }[type] || 'background:var(--bg-input);color:var(--text-muted)'
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
