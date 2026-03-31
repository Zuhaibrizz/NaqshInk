<template>
  <nav class="fixed top-0 w-full z-50 transition-all duration-300"
    :class="scrolled ? 'backdrop-blur-md shadow-lg border-b' : 'bg-transparent'"
    :style="scrolled ? 'background:var(--nav-bg);border-color:var(--border)' : ''">

    <div class="max-w-7xl mx-auto px-4 md:px-8">
      <div class="flex items-center h-16 md:h-20">

        <!-- Logo centered -->
        <RouterLink to="/" class="flex flex-col items-center group absolute left-1/2 -translate-x-1/2">
          <span class="font-display text-2xl md:text-3xl font-bold tracking-[0.15em] leading-none transition-all duration-500 group-hover:tracking-[0.2em]"
            style="color:var(--accent)">NAQSHINK</span>
          <span class="hidden md:block text-[10px] tracking-[0.3em] uppercase mt-0.5 transition-colors duration-500"
            style="color:var(--text-faint)">Crafting Art with Tradition</span>
        </RouterLink>

        <!-- Right actions -->
        <div class="flex items-center gap-1 ml-auto">
          <!-- Search -->
          <button @click="$emit('openSearch')" class="p-2.5 rounded-full transition-colors duration-200" style="color:var(--text-muted)" aria-label="Search">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>

          <!-- Cart -->
          <button @click="cart.isOpen = true" class="relative p-2.5 transition-colors duration-200" style="color:var(--text-muted)" aria-label="Cart">
            <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <span v-if="cart.count > 0"
              class="absolute -top-0.5 -right-0.5 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              style="background:var(--accent);color:#0a0a0a">{{ cart.count }}</span>
          </button>

          <!-- Theme toggle (desktop) -->
          <button @click="theme.toggle()" class="hidden md:flex p-2 rounded-full transition-all duration-200 text-base" style="color:var(--text-muted);background:var(--bg-input)" aria-label="Toggle theme">
            {{ theme.isDark ? '☀️' : '🌙' }}
          </button>

          <!-- User (desktop) -->
          <div class="hidden md:block relative" ref="userMenuRef">
            <RouterLink v-if="!auth.isLoggedIn" to="/login"
              class="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition-all duration-200"
              style="color:var(--text-muted)">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Login
            </RouterLink>
            <button v-else @click="userMenuOpen = !userMenuOpen"
              class="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200"
              style="color:var(--text)">
              <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border"
                style="background:rgba(200,169,110,0.15);border-color:rgba(200,169,110,0.4);color:var(--accent)">
                {{ auth.user?.name?.[0]?.toUpperCase() }}
              </div>
              <span class="text-sm max-w-[80px] truncate">{{ auth.user?.name?.split(' ')[0] }}</span>
              <svg class="w-3 h-3 transition-transform duration-200" :class="userMenuOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <Transition name="dropdown">
              <div v-if="userMenuOpen && auth.isLoggedIn"
                class="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-2xl overflow-hidden py-2 z-50"
                style="background:var(--bg-card);border:1px solid var(--border)">
                <div class="px-4 py-3" style="border-bottom:1px solid var(--border)">
                  <p class="text-sm font-semibold" style="color:var(--text)">{{ auth.user?.name }}</p>
                  <p class="text-xs truncate" style="color:var(--text-faint)">{{ auth.user?.email }}</p>
                </div>
                <RouterLink v-for="item in userMenuItems" :key="item.to" :to="item.to" @click="userMenuOpen=false"
                  class="flex items-center gap-3 px-4 py-2.5 text-sm transition"
                  style="color:var(--text-muted)">
                  <span>{{ item.icon }}</span> {{ item.label }}
                </RouterLink>
                <div style="border-top:1px solid var(--border)" class="mt-2 pt-2">
                  <button @click="auth.logout();$router.push('/');userMenuOpen=false"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 w-full transition hover:bg-red-900/20">
                    <span>⏻</span> Logout
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Admin badge -->
          <RouterLink v-if="auth.isAdmin" to="/admin/overview"
            class="hidden md:flex items-center gap-1 text-xs px-3 py-1.5 rounded-full ml-1 transition"
            style="background:rgba(234,179,8,0.1);color:#facc15;border:1px solid rgba(234,179,8,0.3)">
            ⚙ Admin
          </RouterLink>

          <!-- Hamburger -->
          <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2.5 flex flex-col justify-center gap-1.5 w-9 h-9" style="color:var(--text-muted)">
            <span class="block h-0.5 bg-current rounded transition-all duration-300 origin-center" :class="mobileOpen ? 'rotate-45 translate-y-2' : ''"></span>
            <span class="block h-0.5 bg-current rounded transition-all duration-300" :class="mobileOpen ? 'opacity-0 scale-x-0' : ''"></span>
            <span class="block h-0.5 bg-current rounded transition-all duration-300 origin-center" :class="mobileOpen ? '-rotate-45 -translate-y-2' : ''"></span>
          </button>
        </div>
      </div>

      <!-- Desktop nav row -->
      <div class="hidden md:flex items-center justify-center gap-1 pb-3">
        <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to"
          class="relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200"
          :style="isActive(link.to) ? 'color:var(--accent)' : 'color:var(--text-muted)'">
          <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-300"
            :style="isActive(link.to) ? 'background:var(--accent);opacity:1' : 'opacity:0'"></span>
          {{ link.label }}
        </RouterLink>
        <RouterLink to="/custom-studio"
          class="relative px-5 py-1.5 text-sm font-semibold rounded-full ml-2 overflow-hidden group transition-all duration-300"
          style="background:var(--accent);color:#0a0a0a">
          <span class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></span>
          <span class="relative">✏️ Custom Studio</span>
        </RouterLink>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="mobile-menu">
      <div v-if="mobileOpen" class="md:hidden backdrop-blur-md border-t" style="background:var(--bg-card);border-color:var(--border)">
        <div class="px-4 py-4 space-y-1">
          <RouterLink v-for="link in allMobileLinks" :key="link.to" :to="link.to" @click="mobileOpen=false"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
            :style="isActive(link.to) ? 'background:rgba(200,169,110,0.1);color:var(--accent)' : 'color:var(--text-muted)'">
            <span class="w-5 text-center">{{ link.icon }}</span>
            <span>{{ link.label }}</span>
          </RouterLink>
          <!-- Theme + auth -->
          <div class="pt-3 mt-2" style="border-top:1px solid var(--border)">
            <button @click="theme.toggle()" class="flex items-center gap-2 px-4 py-3 text-sm w-full rounded-xl transition" style="color:var(--text-muted)">
              <span>{{ theme.isDark ? '☀️' : '🌙' }}</span>
              {{ theme.isDark ? 'Light Mode' : 'Dark Mode' }}
            </button>
            <RouterLink v-if="!auth.isLoggedIn" to="/login" @click="mobileOpen=false"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition" style="color:var(--text-muted)">
              <span>👤</span> Login / Register
            </RouterLink>
            <template v-else>
              <RouterLink to="/account/profile" @click="mobileOpen=false"
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition" style="color:var(--text-muted)">
                <div class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style="background:rgba(200,169,110,0.2);color:var(--accent)">
                  {{ auth.user?.name?.[0] }}
                </div>
                {{ auth.user?.name }}
              </RouterLink>
              <button @click="auth.logout();$router.push('/');mobileOpen=false"
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 w-full transition hover:bg-red-900/20">
                <span>⏻</span> Logout
              </button>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

defineEmits(['openSearch'])

const cart = useCartStore()
const auth = useAuthStore()
const theme = useThemeStore()
const route = useRoute()
const mobileOpen = ref(false)
const userMenuOpen = ref(false)
const scrolled = ref(false)
const userMenuRef = ref(null)

function onScroll() { scrolled.value = window.scrollY > 30 }
function onClickOutside(e) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target)) userMenuOpen.value = false
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onClickOutside)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onClickOutside)
})

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const userMenuItems = computed(() => {
  const items = [
    { to: '/account/profile', icon: '👤', label: 'My Profile' },
    { to: '/account', icon: '📦', label: 'My Orders' },
    { to: '/account/custom-order', icon: '✏️', label: 'Custom Design' },
  ]
  if (auth.isAdmin) items.push({ to: '/admin/overview', icon: '⚙️', label: 'Admin Panel' })
  return items
})

const allMobileLinks = computed(() => {
  const links = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/shop', label: 'Shop', icon: '🛍️' },
    { to: '/custom-studio', label: 'Custom Studio', icon: '✏️' },
    { to: '/how-it-works', label: 'How It Works', icon: '📋' },
    { to: '/about', label: 'About Us', icon: 'ℹ️' },
    { to: '/contact', label: 'Contact', icon: '💬' },
  ]
  if (auth.isLoggedIn && !auth.isAdmin) {
    links.push({ to: '/account', label: 'My Orders', icon: '📦' })
    links.push({ to: '/account/profile', label: 'Profile', icon: '👤' })
  }
  if (auth.isAdmin) links.push({ to: '/admin/overview', label: 'Admin Panel', icon: '⚙️' })
  return links
})
</script>

<style scoped>
.mobile-menu-enter-active { transition: max-height 0.35s cubic-bezier(.22,1,.36,1), opacity 0.25s ease; }
.mobile-menu-leave-active { transition: max-height 0.25s cubic-bezier(.55,0,1,.45), opacity 0.2s ease; }
.mobile-menu-enter-from, .mobile-menu-leave-to { max-height: 0; opacity: 0; overflow: hidden; }
.mobile-menu-enter-to, .mobile-menu-leave-from { max-height: 600px; opacity: 1; }
.dropdown-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.dropdown-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-8px) scale(0.97); }
</style>
