<template>
  <footer class="bg-ink-dark border-t border-ink-gray mt-20">
    <div class="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
      <!-- Brand -->
      <div class="md:col-span-1">
        <div class="font-display text-2xl font-bold text-ink-accent mb-1">NAQSHINK</div>
        <p class="text-xs tracking-widest text-gray-600 uppercase mb-4">Crafting Art with Tradition</p>
        <p class="text-gray-400 text-sm leading-relaxed mb-5">
          Semi-permanent tattoos that look real, feel real, and fade naturally. No pain. No commitment. Just style.
        </p>
        <!-- Social -->
        <div class="flex gap-3">
          <a v-for="s in socials" :key="s.label" :href="s.href" target="_blank"
            class="w-8 h-8 rounded-lg bg-ink-gray hover:bg-ink-accent hover:text-ink-black flex items-center justify-center text-gray-400 transition-all duration-200 text-sm"
            :aria-label="s.label">{{ s.icon }}</a>
        </div>
      </div>

      <!-- Shop -->
      <div>
        <h4 class="font-semibold mb-4 text-white text-sm">Shop</h4>
        <ul class="space-y-2.5 text-sm text-gray-400">
          <li><RouterLink to="/shop" class="hover:text-ink-accent transition">All Designs</RouterLink></li>
          <li><RouterLink to="/custom-studio" class="hover:text-ink-accent transition">Custom Studio</RouterLink></li>
          <li><RouterLink to="/cart" class="hover:text-ink-accent transition">Cart</RouterLink></li>
        </ul>
      </div>

      <!-- Info -->
      <div>
        <h4 class="font-semibold mb-4 text-white text-sm">Info</h4>
        <ul class="space-y-2.5 text-sm text-gray-400">
          <li><RouterLink to="/about" class="hover:text-ink-accent transition">About Us</RouterLink></li>
          <li><RouterLink to="/how-it-works" class="hover:text-ink-accent transition">How It Works</RouterLink></li>
          <li><RouterLink to="/contact" class="hover:text-ink-accent transition">Contact Us</RouterLink></li>
        </ul>
      </div>

      <!-- Account + Shipping -->
      <div>
        <h4 class="font-semibold mb-4 text-white text-sm">Account</h4>
        <ul class="space-y-2.5 text-sm text-gray-400 mb-6">
          <li><RouterLink to="/login" class="hover:text-ink-accent transition">Login</RouterLink></li>
          <li><RouterLink to="/register" class="hover:text-ink-accent transition">Register</RouterLink></li>
          <li><RouterLink to="/account" class="hover:text-ink-accent transition">My Orders</RouterLink></li>
          <li><RouterLink to="/account/profile" class="hover:text-ink-accent transition">Profile</RouterLink></li>
        </ul>
        <div class="space-y-1.5 text-xs text-gray-600">
          <p>✓ Free shipping over ₹399</p>
          <p>✓ Dispatched in 2–3 days</p>
          <p>✓ Lasts 1–2 weeks</p>
          <p>✓ 100% skin-safe & waterproof</p>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-ink-gray px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
      <p>© 2026 NAQSHINK. All rights reserved.</p>
      <div class="flex items-center gap-4">
        <span>📞 {{ contact.phone }}</span>
        <a :href="`mailto:${contact.emailSupport}`" class="hover:text-ink-accent transition">{{ contact.emailSupport }}</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { contact, whatsappUrl } from '@/lib/contact'

const socials = [
  { label: 'Instagram', icon: '📸', href: contact.instagram },
  { label: 'Facebook',  icon: '👍', href: contact.facebook },
  { label: 'YouTube',   icon: '▶️', href: contact.youtube },
  { label: 'WhatsApp',  icon: '💬', href: whatsappUrl() },
]
</script>
