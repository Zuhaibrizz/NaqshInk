<template>
  <div class="page-top min-h-screen max-w-5xl mx-auto px-4 py-12">
    <h1 class="font-display text-4xl font-bold mb-10">Checkout</h1>

    <div class="grid md:grid-cols-2 gap-10">
      <!-- ── SHIPPING FORM ── -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-lg" style="color:var(--accent)">Shipping Details</h2>
          <!-- GPS button -->
          <button @click="detectLocation" :disabled="gpsLoading"
            class="flex items-center gap-2 text-xs px-3 py-2 rounded-full transition-all"
            style="background:var(--bg-input);border:1px solid var(--border);color:var(--text-muted)">
            <svg v-if="gpsLoading" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            {{ gpsLoading ? 'Detecting...' : 'Use My Location' }}
          </button>
        </div>

        <p v-if="gpsError" class="text-red-400 text-xs bg-red-900/20 rounded-lg px-3 py-2">{{ gpsError }}</p>
        <p v-if="gpsSuccess" class="text-green-400 text-xs bg-green-900/20 rounded-lg px-3 py-2">{{ gpsSuccess }}</p>

        <!-- Name -->
        <div>
          <input v-model="form.name" @blur="touch('name')" placeholder="Full Name *" class="input"
            :class="fieldError('name') ? 'border-red-500' : ''" />
          <p v-if="fieldError('name')" class="text-red-400 text-xs mt-1">{{ fieldError('name') }}</p>
        </div>

        <!-- Email -->
        <div>
          <input v-model="form.email" @blur="touch('email')" placeholder="Email Address *" type="email" class="input"
            :class="fieldError('email') ? 'border-red-500' : ''" />
          <p v-if="fieldError('email')" class="text-red-400 text-xs mt-1">{{ fieldError('email') }}</p>
        </div>

        <!-- Phone -->
        <div>
          <input v-model="form.phone" @blur="touch('phone')" placeholder="Phone Number * (10 digits)" type="tel"
            class="input" :class="fieldError('phone') ? 'border-red-500' : ''" maxlength="10" />
          <p v-if="fieldError('phone')" class="text-red-400 text-xs mt-1">{{ fieldError('phone') }}</p>
        </div>

        <!-- Street Address -->
        <div>
          <input v-model="form.address" @blur="touch('address')" placeholder="Street Address, Flat/House No. *"
            class="input" :class="fieldError('address') ? 'border-red-500' : ''" />
          <p v-if="fieldError('address')" class="text-red-400 text-xs mt-1">{{ fieldError('address') }}</p>
        </div>

        <!-- Pincode — auto-fills city & state -->
        <div>
          <div class="relative">
            <input v-model="form.pincode" @blur="touch('pincode')" @input="onPincodeInput"
              placeholder="Pincode * (6 digits)" class="input pr-10"
              :class="fieldError('pincode') ? 'border-red-500' : pincodeLoading ? 'border-ink-accent/50' : ''"
              maxlength="6" />
            <div class="absolute right-3 top-1/2 -translate-y-1/2">
              <svg v-if="pincodeLoading" class="w-4 h-4 animate-spin" style="color:var(--accent)" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <span v-else-if="pincodeOk" class="text-green-400 text-sm">✓</span>
            </div>
          </div>
          <p v-if="fieldError('pincode')" class="text-red-400 text-xs mt-1">{{ fieldError('pincode') }}</p>
          <p v-if="pincodeError" class="text-red-400 text-xs mt-1">{{ pincodeError }}</p>
        </div>

        <!-- City + State — auto-filled but editable -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <input v-model="form.city" @blur="touch('city')" placeholder="City *" class="input"
              :class="fieldError('city') ? 'border-red-500' : ''" />
            <p v-if="fieldError('city')" class="text-red-400 text-xs mt-1">{{ fieldError('city') }}</p>
          </div>
          <div>
            <input v-model="form.state" @blur="touch('state')" placeholder="State *" class="input"
              :class="fieldError('state') ? 'border-red-500' : ''" />
            <p v-if="fieldError('state')" class="text-red-400 text-xs mt-1">{{ fieldError('state') }}</p>
          </div>
        </div>

        <!-- Landmark (optional) -->
        <input v-model="form.landmark" placeholder="Landmark (optional)" class="input" />

        <!-- Progress indicator -->
        <div class="rounded-xl p-3 text-sm flex items-center gap-3 transition-all"
          :style="isFormValid
            ? 'background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3)'
            : 'background:var(--bg-input);border:1px solid var(--border)'">
          <span class="text-lg">{{ isFormValid ? '✅' : '📋' }}</span>
          <span :style="isFormValid ? 'color:#4ade80' : 'color:var(--text-faint)'">
            {{ isFormValid ? 'All details filled — ready to pay!' : `${filledCount} of ${totalFields} fields completed` }}
          </span>
          <div class="ml-auto w-20 h-1.5 rounded-full overflow-hidden flex-shrink-0" style="background:var(--border)">
            <div class="h-full rounded-full transition-all duration-500"
              :style="`width:${(filledCount/totalFields)*100}%;background:${isFormValid ? '#4ade80' : 'var(--accent)'}`">
            </div>
          </div>
        </div>
      </div>

      <!-- ── ORDER SUMMARY ── -->
      <div class="card p-6 h-fit space-y-4">
        <h2 class="font-semibold text-lg">Order Summary</h2>

        <div v-for="item in cart.items" :key="item.id" class="flex justify-between text-sm" style="color:var(--text-muted)">
          <span>{{ item.name }} × {{ item.qty }}</span>
          <span>₹{{ item.price * item.qty }}</span>
        </div>

        <div v-if="autoDeal.discount > 0" class="flex justify-between text-sm text-green-400">
          <span>Multi-buy discount</span><span>−₹{{ autoDeal.discount }}</span>
        </div>

        <div class="flex justify-between text-sm" style="color:var(--text-muted)">
          <span>Shipping</span>
          <span :class="cart.total >= 399 ? 'text-green-400' : ''">{{ cart.total >= 399 ? 'FREE' : '₹49' }}</span>
        </div>

        <div class="flex justify-between font-bold text-lg" style="border-top:1px solid var(--border);padding-top:1rem">
          <span>Total</span>
          <span style="color:var(--accent)">₹{{ finalTotal }}</span>
        </div>

        <!-- Shipping address preview -->
        <div v-if="isFormValid" class="rounded-xl p-3 text-xs space-y-0.5" style="background:var(--bg-input);color:var(--text-muted)">
          <p class="font-semibold text-xs mb-1" style="color:var(--text)">📦 Delivering to:</p>
          <p>{{ form.name }} · {{ form.phone }}</p>
          <p>{{ form.address }}<span v-if="form.landmark">, {{ form.landmark }}</span></p>
          <p>{{ form.city }}, {{ form.state }} – {{ form.pincode }}</p>
        </div>

        <RazorpayButton
          :amount="finalTotal"
          :name="form.name"
          :email="form.email"
          :phone="form.phone"
          :disabled="!isFormValid"
          @success="onPaymentSuccess"
          @failure="onPaymentFailure"
        />

        <p v-if="!isFormValid" class="text-xs text-center" style="color:var(--text-faint)">
          Fill in all shipping details to enable payment
        </p>
        <p v-if="error" class="text-red-400 text-sm text-center">{{ error }}</p>
        <p class="text-xs text-center" style="color:var(--text-faint)">🔒 Secured by Razorpay · 256-bit SSL</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/orders'
import { useOfferStore } from '@/stores/offers'
import RazorpayButton from '@/components/RazorpayButton.vue'

const cart = useCartStore()
const auth = useAuthStore()
const orders = useOrderStore()
const offerStore = useOfferStore()
const router = useRouter()

const form = ref({
  name: auth.user?.name || '',
  email: auth.user?.email || '',
  phone: '',
  address: '',
  pincode: '',
  city: '',
  state: '',
  landmark: ''
})

const error = ref('')
const touched = ref({})
const pincodeLoading = ref(false)
const pincodeOk = ref(false)
const pincodeError = ref('')
const gpsLoading = ref(false)
const gpsError = ref('')
const gpsSuccess = ref('')

function touch(field) { touched.value[field] = true }

const rules = {
  name:    v => v.trim().length >= 2                    ? '' : 'Full name is required',
  email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)  ? '' : 'Valid email is required',
  phone:   v => /^\d{10}$/.test(v)                     ? '' : 'Enter a valid 10-digit phone number',
  address: v => v.trim().length >= 5                    ? '' : 'Street address is required',
  pincode: v => /^\d{6}$/.test(v)                      ? '' : 'Enter a valid 6-digit pincode',
  city:    v => v.trim().length >= 2                    ? '' : 'City is required',
  state:   v => v.trim().length >= 2                    ? '' : 'State is required',
}

function fieldError(field) {
  if (!touched.value[field]) return ''
  return rules[field](form.value[field])
}

const totalFields = Object.keys(rules).length
const filledCount = computed(() => Object.keys(rules).filter(f => rules[f](form.value[f]) === '').length)
const isFormValid = computed(() => Object.keys(rules).every(f => rules[f](form.value[f]) === ''))

// ── Pincode auto-fill ──
let pincodeTimer = null
function onPincodeInput() {
  pincodeOk.value = false
  pincodeError.value = ''
  clearTimeout(pincodeTimer)
  if (form.value.pincode.length === 6) {
    pincodeTimer = setTimeout(fetchPincode, 400)
  }
}

async function fetchPincode() {
  pincodeLoading.value = true
  pincodeError.value = ''
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${form.value.pincode}`)
    const data = await res.json()
    if (data[0].Status === 'Success') {
      const po = data[0].PostOffice[0]
      form.value.city    = po.District
      form.value.state   = po.State
      // Mark fields as touched so they show as filled
      touched.value.city  = true
      touched.value.state = true
      pincodeOk.value = true
    } else {
      pincodeError.value = 'Pincode not found. Please enter city & state manually.'
    }
  } catch {
    pincodeError.value = 'Could not fetch pincode details. Enter manually.'
  } finally {
    pincodeLoading.value = false
  }
}

// ── GPS location detection ──
async function detectLocation() {
  gpsError.value = ''
  gpsSuccess.value = ''

  if (!navigator.geolocation) {
    gpsError.value = 'Geolocation is not supported by your browser.'
    return
  }

  gpsLoading.value = true

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const { latitude, longitude } = pos.coords
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data = await res.json()
        const addr = data.address

        // Fill fields from reverse geocode
        if (addr.road || addr.neighbourhood || addr.suburb) {
          form.value.address = [addr.house_number, addr.road || addr.neighbourhood || addr.suburb]
            .filter(Boolean).join(', ')
        }
        if (addr.postcode) {
          form.value.pincode = addr.postcode.replace(/\s/g, '').slice(0, 6)
          touched.value.pincode = true
          if (/^\d{6}$/.test(form.value.pincode)) await fetchPincode()
        }
        if (addr.city || addr.town || addr.village || addr.county) {
          form.value.city = addr.city || addr.town || addr.village || addr.county
          touched.value.city = true
        }
        if (addr.state) {
          form.value.state = addr.state
          touched.value.state = true
        }
        if (addr.suburb || addr.neighbourhood) {
          form.value.landmark = addr.suburb || addr.neighbourhood
        }

        touched.value.address = true
        gpsSuccess.value = '📍 Location detected! Please verify and complete any missing fields.'
      } catch {
        gpsError.value = 'Could not fetch address from location. Please fill manually.'
      } finally {
        gpsLoading.value = false
      }
    },
    (err) => {
      gpsLoading.value = false
      if (err.code === 1) gpsError.value = 'Location access denied. Please allow location permission and try again.'
      else gpsError.value = 'Could not detect location. Please fill manually.'
    },
    { timeout: 10000, enableHighAccuracy: true }
  )
}

const autoDeal = computed(() => offerStore.autoDiscount(cart.total, cart.count))
const shipping = computed(() => cart.total >= 399 ? 0 : 49)
const finalTotal = computed(() => Math.max(0, cart.total - autoDeal.value.discount + shipping.value))

function onPaymentSuccess(response) {
  const order = orders.createOrder(
    auth.user.id,
    [...cart.items],
    finalTotal.value,
    { ...form.value },
    response.razorpay_payment_id
  )
  cart.clear()
  router.push({ path: '/order-success', query: { id: order.id } })
}

function onPaymentFailure(msg) {
  error.value = 'Payment failed: ' + msg
}
</script>
