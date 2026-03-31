<template>
  <div class="page-top min-h-screen bg-ink-black">
    <!-- Hero banner -->
    <div class="bg-gradient-to-r from-ink-dark to-ink-black border-b border-ink-gray px-4 py-10 text-center">
      <span class="badge mb-3 inline-block">Custom Tailored Collection</span>
      <h1 class="font-display text-4xl md:text-5xl font-bold mb-3">Your Image. Your Tattoo.</h1>
      <p class="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
        Upload any image — a portrait, logo, signature, artwork — and we'll print it as a hyper-realistic semi-permanent tattoo. Lasts 1–2 weeks. No needles.
      </p>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-10">

      <!-- LEFT: Upload + Config -->
      <div class="space-y-6">
        <div class="card p-6">
          <h2 class="font-semibold text-lg mb-4 flex items-center gap-2">
            <span class="w-7 h-7 rounded-full bg-ink-accent text-ink-black text-sm font-bold flex items-center justify-center">1</span>
            Upload Your Image
          </h2>

          <!-- Drop zone -->
          <div
            @click="$refs.fileInput.click()"
            @dragover.prevent="dragging = true"
            @dragleave="dragging = false"
            @drop.prevent="onDrop"
            :class="dragging ? 'border-ink-accent bg-ink-accent/5' : 'border-ink-gray hover:border-ink-accent'"
            class="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all">
            <div v-if="!uploadedImage">
              <div class="text-5xl mb-3">🖼️</div>
              <p class="font-medium mb-1">Drag & drop your image here</p>
              <p class="text-gray-500 text-sm">or click to browse · PNG, JPG, SVG up to 10MB</p>
              <p class="text-xs text-gray-600 mt-3">Works great with: portraits, logos, signatures, artwork, QR codes, text</p>
            </div>
            <div v-else class="relative">
              <img :src="uploadedImage" class="max-h-48 mx-auto rounded-xl object-contain" />
              <p class="text-xs text-gray-500 mt-3">Click to change image</p>
            </div>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />
          <p v-if="uploadError" class="text-red-400 text-xs mt-2">{{ uploadError }}</p>
        </div>

        <!-- Size -->
        <div class="card p-6">
          <h2 class="font-semibold text-lg mb-4 flex items-center gap-2">
            <span class="w-7 h-7 rounded-full bg-ink-accent text-ink-black text-sm font-bold flex items-center justify-center">2</span>
            Choose Size
          </h2>
          <div class="grid grid-cols-2 gap-3">
            <button v-for="s in sizes" :key="s.label"
              @click="selectedSize = s"
              :class="selectedSize.label === s.label ? 'border-ink-accent bg-ink-accent/10 text-white' : 'border-ink-gray text-gray-400 hover:border-gray-500'"
              class="border rounded-xl p-4 text-left transition-all">
              <p class="font-semibold text-sm">{{ s.label }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ s.dim }}</p>
              <p class="text-ink-accent font-bold mt-2">₹{{ s.price }}</p>
            </button>
          </div>
        </div>

        <!-- Placement -->
        <div class="card p-6">
          <h2 class="font-semibold text-lg mb-4 flex items-center gap-2">
            <span class="w-7 h-7 rounded-full bg-ink-accent text-ink-black text-sm font-bold flex items-center justify-center">3</span>
            Placement Area
          </h2>
          <div class="flex flex-wrap gap-2">
            <button v-for="p in placements" :key="p"
              @click="selectedPlacement = p"
              :class="selectedPlacement === p ? 'bg-ink-accent text-ink-black' : 'bg-ink-gray text-gray-300 hover:bg-gray-600'"
              class="px-4 py-2 rounded-full text-sm font-medium transition">
              {{ p }}
            </button>
          </div>
        </div>

        <!-- Qty + Notes -->
        <div class="card p-6 space-y-4">
          <h2 class="font-semibold text-lg flex items-center gap-2">
            <span class="w-7 h-7 rounded-full bg-ink-accent text-ink-black text-sm font-bold flex items-center justify-center">4</span>
            Quantity & Notes
          </h2>
          <div class="flex items-center gap-4">
            <label class="text-sm text-gray-400">Quantity</label>
            <div class="flex items-center gap-3 bg-ink-gray rounded-full px-4 py-2">
              <button @click="qty = Math.max(1, qty - 1)" class="hover:text-ink-accent text-lg">−</button>
              <span class="w-6 text-center font-semibold">{{ qty }}</span>
              <button @click="qty++" class="hover:text-ink-accent text-lg">+</button>
            </div>
            <span class="text-ink-accent font-bold text-lg">₹{{ totalPrice }}</span>
          </div>
          <textarea v-model="notes" placeholder="Any special instructions? (e.g. remove background, make it black & white, add text...)"
            class="input h-20 resize-none text-sm"></textarea>
        </div>

        <!-- Add to cart -->
        <button @click="addToCart"
          :disabled="!uploadedImage"
          class="btn-primary w-full text-center py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed">
          {{ uploadedImage ? 'Add Custom Tattoo to Cart' : 'Upload an image first' }}
        </button>

        <p v-if="addedMsg" class="text-green-400 text-sm text-center">{{ addedMsg }}</p>

        <!-- Trust badges -->
        <div class="grid grid-cols-3 gap-3 text-center">
          <div v-for="b in badges" :key="b.label" class="card p-3">
            <p class="text-2xl mb-1">{{ b.icon }}</p>
            <p class="text-xs text-gray-400">{{ b.label }}</p>
          </div>
        </div>
      </div>

      <!-- RIGHT: Live Preview -->
      <div class="space-y-6">
        <div class="card p-6">
          <h2 class="font-semibold text-lg mb-4">Live Preview</h2>

          <!-- Skin mockup selector -->
          <div class="flex gap-2 mb-4">
            <button v-for="m in mockups" :key="m.label"
              @click="activeMockup = m"
              :class="activeMockup.label === m.label ? 'bg-ink-accent text-ink-black' : 'bg-ink-gray text-gray-400'"
              class="px-3 py-1.5 rounded-full text-xs font-medium transition">
              {{ m.label }}
            </button>
          </div>

          <!-- Preview canvas -->
          <div class="relative rounded-2xl overflow-hidden bg-ink-gray aspect-[3/4] flex items-center justify-center select-none">
            <!-- Skin background -->
            <div class="absolute inset-0" :style="{ background: activeMockup.bg }"></div>

            <!-- Body outline SVG -->
            <svg class="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 300 400" fill="none">
              <ellipse cx="150" cy="60" rx="45" ry="55" stroke="#c8a96e" stroke-width="1.5"/>
              <path d="M105 110 Q80 130 70 200 Q65 240 75 280" stroke="#c8a96e" stroke-width="1.5"/>
              <path d="M195 110 Q220 130 230 200 Q235 240 225 280" stroke="#c8a96e" stroke-width="1.5"/>
              <path d="M105 115 Q150 135 195 115 L200 260 Q175 280 150 282 Q125 280 100 260 Z" stroke="#c8a96e" stroke-width="1.5" fill="none"/>
              <path d="M120 260 Q115 320 110 370" stroke="#c8a96e" stroke-width="1.5"/>
              <path d="M180 260 Q185 320 190 370" stroke="#c8a96e" stroke-width="1.5"/>
            </svg>

            <!-- Placement indicator -->
            <div class="absolute" :style="placementStyle">
              <div v-if="!uploadedImage"
                class="border-2 border-dashed border-ink-accent/60 rounded-xl flex items-center justify-center bg-ink-accent/5"
                :style="{ width: previewSize + 'px', height: previewSize + 'px' }">
                <p class="text-ink-accent/60 text-xs text-center px-2">Your tattoo<br/>appears here</p>
              </div>
              <div v-else
                class="rounded-xl overflow-hidden shadow-2xl"
                :style="{ width: previewSize + 'px', height: previewSize + 'px' }">
                <!-- Skin blend overlay -->
                <div class="relative w-full h-full">
                  <img :src="uploadedImage"
                    class="w-full h-full object-contain"
                    :style="{ opacity: 0.88, mixBlendMode: 'multiply' }" />
                  <div class="absolute inset-0 rounded-xl"
                    :style="{ background: 'radial-gradient(ellipse, transparent 40%, ' + activeMockup.bg + ' 100%)', mixBlendMode: 'normal' }">
                  </div>
                </div>
              </div>
            </div>

            <!-- Size label -->
            <div class="absolute bottom-3 right-3 bg-black/60 rounded-lg px-2 py-1 text-xs text-gray-300">
              {{ selectedSize.dim }}
            </div>
          </div>

          <p class="text-xs text-gray-500 mt-3 text-center">
            Preview is approximate. Final print will be crisp and hyper-realistic.
          </p>
        </div>

        <!-- How it works -->
        <div class="card p-6">
          <h3 class="font-semibold mb-4">How It Works</h3>
          <div class="space-y-3">
            <div v-for="(step, i) in howItWorks" :key="i" class="flex items-start gap-3">
              <span class="w-6 h-6 rounded-full bg-ink-accent text-ink-black text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{{ i+1 }}</span>
              <div>
                <p class="text-sm font-medium">{{ step.title }}</p>
                <p class="text-xs text-gray-500">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- What works best -->
        <div class="card p-6">
          <h3 class="font-semibold mb-3">What Works Best</h3>
          <div class="grid grid-cols-2 gap-2">
            <div v-for="t in imageTypes" :key="t.label"
              class="flex items-center gap-2 bg-ink-gray rounded-lg px-3 py-2">
              <span>{{ t.icon }}</span>
              <span class="text-xs text-gray-300">{{ t.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
const fileInput = ref(null)
const uploadedImage = ref(null)
const uploadError = ref('')
const dragging = ref(false)
const notes = ref('')
const qty = ref(1)
const addedMsg = ref('')

const sizes = [
  { label: 'Small', dim: '5 × 5 cm', price: 499 },
  { label: 'Medium', dim: '10 × 10 cm', price: 799 },
  { label: 'Large', dim: '15 × 15 cm', price: 1099 },
  { label: 'XL', dim: '20 × 20 cm', price: 1499 },
]
const selectedSize = ref(sizes[1])

const placements = ['Wrist', 'Forearm', 'Upper Arm', 'Neck', 'Chest', 'Back', 'Ankle', 'Calf', 'Hand', 'Shoulder']
const selectedPlacement = ref('Forearm')

const mockups = [
  { label: 'Fair', bg: 'linear-gradient(135deg, #f5d5b8 0%, #e8b896 100%)' },
  { label: 'Medium', bg: 'linear-gradient(135deg, #d4956a 0%, #c07a4f 100%)' },
  { label: 'Dark', bg: 'linear-gradient(135deg, #8b5e3c 0%, #6b4226 100%)' },
]
const activeMockup = ref(mockups[0])

const totalPrice = computed(() => selectedSize.value.price * qty.value)

// Map placement to position on the body preview
const placementPositions = {
  'Wrist':      { top: '68%', left: '18%' },
  'Forearm':    { top: '58%', left: '15%' },
  'Upper Arm':  { top: '42%', left: '12%' },
  'Neck':       { top: '22%', left: '38%' },
  'Chest':      { top: '38%', left: '35%' },
  'Back':       { top: '42%', left: '35%' },
  'Ankle':      { top: '88%', left: '28%' },
  'Calf':       { top: '76%', left: '28%' },
  'Hand':       { top: '74%', left: '16%' },
  'Shoulder':   { top: '32%', left: '10%' },
}

const previewSizeMap = { Small: 60, Medium: 90, Large: 120, XL: 150 }
const previewSize = computed(() => previewSizeMap[selectedSize.value.label])

const placementStyle = computed(() => {
  const pos = placementPositions[selectedPlacement.value] || { top: '40%', left: '35%' }
  return {
    top: pos.top,
    left: pos.left,
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
  }
})

function onFileChange(e) { processFile(e.target.files[0]) }
function onDrop(e) { dragging.value = false; processFile(e.dataTransfer.files[0]) }

function processFile(file) {
  uploadError.value = ''
  if (!file) return
  if (file.size > 10 * 1024 * 1024) { uploadError.value = 'Image must be under 10MB'; return }
  const reader = new FileReader()
  reader.onload = (e) => { uploadedImage.value = e.target.result }
  reader.readAsDataURL(file)
}

function addToCart() {
  if (!uploadedImage.value) return
  const product = {
    id: 'custom-' + Date.now(),
    name: `Custom Tattoo (${selectedSize.value.label})`,
    category: 'Custom',
    price: selectedSize.value.price,
    originalPrice: selectedSize.value.price,
    image: uploadedImage.value,
    isCustom: true,
    customData: {
      imageDataUrl: uploadedImage.value,
      size: selectedSize.value.label,
      dimensions: selectedSize.value.dim,
      placement: selectedPlacement.value,
      notes: notes.value,
    }
  }
  cart.addItem(product, qty.value)
  addedMsg.value = '✓ Added to cart!'
  setTimeout(() => addedMsg.value = '', 3000)
}

const badges = [
  { icon: '🖨️', label: 'Printed in-house' },
  { icon: '⚡', label: 'Ships in 2–3 days' },
  { icon: '💧', label: 'Waterproof & skin-safe' },
]

const howItWorks = [
  { title: 'Upload your image', desc: 'Any photo, logo, artwork, signature or QR code' },
  { title: 'We print & prep it', desc: 'Our team prints your design on skin-safe transfer paper' },
  { title: 'Apply in 30 seconds', desc: 'Wet, press, peel — looks real instantly' },
  { title: 'Lasts 1–2 weeks', desc: 'Fades naturally, no residue, no regret' },
]

const imageTypes = [
  { icon: '🤳', label: 'Face portraits' },
  { icon: '✍️', label: 'Signatures' },
  { icon: '🐾', label: 'Pet photos' },
  { icon: '🎨', label: 'Artwork / logos' },
  { icon: '📝', label: 'Text & quotes' },
  { icon: '📱', label: 'QR codes' },
  { icon: '🌸', label: 'Custom florals' },
  { icon: '⭐', label: 'Any design' },
]
</script>
