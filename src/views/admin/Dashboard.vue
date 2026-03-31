<template>
  <div class="min-h-screen flex bg-ink-black">
    <!-- Sidebar -->
    <aside class="w-64 bg-ink-dark border-r border-ink-gray flex flex-col fixed h-full z-30">
      <div class="px-6 py-5 border-b border-ink-gray">
        <p class="font-display text-xl font-bold text-ink-accent">NAQSHINK</p>
        <p class="text-xs text-gray-500 mt-0.5">Admin Panel</p>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <RouterLink
          v-for="link in links" :key="link.to" :to="link.to"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
          :class="isActive(link.to)
            ? 'bg-ink-accent text-ink-black'
            : 'text-gray-400 hover:bg-ink-gray hover:text-white'">
          <span class="text-base">{{ link.icon }}</span>
          <span>{{ link.label }}</span>
          <span v-if="link.badge" class="ml-auto text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5">{{ link.badge }}</span>
        </RouterLink>
      </nav>

      <div class="p-4 border-t border-ink-gray space-y-2">
        <RouterLink to="/" class="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition px-2 py-1.5 rounded-lg hover:bg-ink-gray">
          ← Back to Store
        </RouterLink>
        <button @click="auth.logout(); $router.push('/login')"
          class="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition px-2 py-1.5 rounded-lg hover:bg-red-900/20 w-full">
          ⏻ Logout
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="ml-64 flex-1 flex flex-col min-h-screen">
      <!-- Top bar -->
      <header class="h-14 bg-ink-dark border-b border-ink-gray flex items-center justify-between px-6 sticky top-0 z-20">
        <h2 class="text-sm font-medium text-gray-400">
          {{ currentPageTitle }}
        </h2>
        <div class="flex items-center gap-3 text-sm">
          <span class="text-gray-500">Logged in as</span>
          <span class="text-ink-accent font-semibold">{{ auth.user?.name }}</span>
        </div>
      </header>

      <main class="flex-1 p-6 overflow-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/orders'
import { useCustomOrderStore } from '@/stores/customOrders'

const route = useRoute()
const auth = useAuthStore()
const orderStore = useOrderStore()
const customStore = useCustomOrderStore()

const pendingCustom = computed(() => customStore.submissions.filter(s => s.printStatus === 'pending').length)
const pendingOrders = computed(() => orderStore.orders.filter(o => o.status === 'confirmed').length)

const links = computed(() => [
  { to: '/admin/overview', icon: '📊', label: 'Overview' },
  { to: '/admin/products', icon: '🎨', label: 'Products' },
  { to: '/admin/orders', icon: '📦', label: 'Orders', badge: pendingOrders.value || null },
  { to: '/admin/custom-orders', icon: '✏️', label: 'Custom Orders', badge: pendingCustom.value || null },
  { to: '/admin/offers', icon: '🏷️', label: 'Offers & Coupons' },
  { to: '/admin/customers', icon: '👥', label: 'Customers' },
])

const pageTitles = {
  '/admin/overview': 'Dashboard Overview',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
  '/admin/custom-orders': 'Custom Design Orders',
  '/admin/offers': 'Offers & Coupons',
  '/admin/customers': 'Customers',
}

const currentPageTitle = computed(() => pageTitles[route.path] || 'Admin')

function isActive(path) {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>
