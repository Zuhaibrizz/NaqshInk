<template>
  <div class="page-top min-h-screen max-w-2xl mx-auto px-4 py-12">
    <RouterLink to="/account" class="text-gray-500 hover:text-white text-sm flex items-center gap-1 mb-6">
      ← Back to My Account
    </RouterLink>
    <h1 class="font-display text-3xl font-bold mb-2">Submit Your Custom Design</h1>
    <p class="text-gray-400 text-sm mb-8">Upload your tattoo idea and we'll print it and ship it to you.</p>

    <div class="card p-8 space-y-5">
      <div>
        <label class="text-sm text-gray-400 mb-1 block">Describe your design *</label>
        <textarea v-model="form.description" placeholder="E.g. A minimalist lotus with the word 'breathe' below it, fine line style..."
          class="input h-28 resize-none" required></textarea>
      </div>

      <!-- Image upload -->
      <div>
        <label class="text-sm text-gray-400 mb-1 block">Upload reference image (optional)</label>
        <div @click="$refs.fileInput.click()" @dragover.prevent @drop.prevent="onDrop"
          class="border-2 border-dashed border-ink-gray rounded-xl p-6 text-center cursor-pointer hover:border-ink-accent transition">
          <div v-if="preview">
            <img :src="preview" class="max-h-48 mx-auto rounded-lg object-contain" />
            <p class="text-xs text-gray-500 mt-2">Click to change</p>
          </div>
          <div v-else>
            <p class="text-3xl mb-2">🖼️</p>
            <p class="text-gray-400 text-sm">Drag & drop or click to upload</p>
            <p class="text-gray-600 text-xs mt-1">PNG, JPG up to 5MB</p>
          </div>
        </div>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-gray-400 mb-1 block">Size *</label>
          <select v-model="form.size" class="input">
            <option value="Small (5×5 cm)">Small (5×5 cm)</option>
            <option value="Medium (10×10 cm)">Medium (10×10 cm)</option>
            <option value="Large (15×15 cm)">Large (15×15 cm)</option>
            <option value="XL (20×20 cm)">XL (20×20 cm)</option>
          </select>
        </div>
        <div>
          <label class="text-sm text-gray-400 mb-1 block">Placement</label>
          <input v-model="form.placement" placeholder="e.g. Wrist, Forearm, Neck" class="input" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-gray-400 mb-1 block">Quantity *</label>
          <input v-model.number="form.quantity" type="number" min="1" max="10" class="input" />
        </div>
        <div>
          <label class="text-sm text-gray-400 mb-1 block">Phone *</label>
          <input v-model="form.phone" type="tel" placeholder="For WhatsApp updates" class="input" />
        </div>
      </div>

      <div>
        <label class="text-sm text-gray-400 mb-1 block">Additional notes</label>
        <textarea v-model="form.notes" placeholder="Any specific colors, style preferences, or references..."
          class="input h-20 resize-none"></textarea>
      </div>

      <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
      <p v-if="success" class="text-green-400 text-sm">{{ success }}</p>

      <button @click="submit" class="btn-primary w-full text-center">Submit Design Request</button>
      <p class="text-xs text-gray-500 text-center">Our team will review your design and contact you with pricing within 24 hours.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCustomOrderStore } from '@/stores/customOrders'

const auth = useAuthStore()
const customStore = useCustomOrderStore()
const router = useRouter()

const fileInput = ref(null)
const preview = ref(null)
const imageDataUrl = ref(null)
const error = ref('')
const success = ref('')

const form = ref({
  description: '', size: 'Small (5×5 cm)', placement: '', quantity: 1, phone: '', notes: ''
})

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) readFile(file)
}

function onDrop(e) {
  const file = e.dataTransfer.files[0]
  if (file) readFile(file)
}

function readFile(file) {
  if (file.size > 5 * 1024 * 1024) { error.value = 'Image must be under 5MB'; return }
  const reader = new FileReader()
  reader.onload = (e) => { preview.value = e.target.result; imageDataUrl.value = e.target.result }
  reader.readAsDataURL(file)
}

function submit() {
  error.value = ''
  if (!form.value.description.trim()) { error.value = 'Please describe your design.'; return }
  if (!form.value.phone.trim()) { error.value = 'Phone number is required.'; return }

  customStore.submit({
    userId: auth.user.id,
    userName: auth.user.name,
    userEmail: auth.user.email,
    phone: form.value.phone,
    description: form.value.description,
    imageDataUrl: imageDataUrl.value,
    size: form.value.size,
    placement: form.value.placement,
    quantity: form.value.quantity,
    notes: form.value.notes
  })

  success.value = 'Design submitted! We\'ll contact you within 24 hours.'
  setTimeout(() => router.push('/account'), 2000)
}
</script>
