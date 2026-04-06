import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  { path: '/shop', component: () => import('@/views/Shop.vue') },
  { path: '/custom-studio', component: () => import('@/views/CustomStudio.vue') },
  { path: '/product/:id', component: () => import('@/views/Product.vue') },
  { path: '/cart', component: () => import('@/views/Cart.vue') },
  { path: '/checkout', component: () => import('@/views/Checkout.vue'), meta: { requiresAuth: true } },
  { path: '/order-success', component: () => import('@/views/OrderSuccess.vue') },
  { path: '/login', component: () => import('@/views/Login.vue') },
  { path: '/register', component: () => import('@/views/Register.vue') },
  { path: '/forgot-password', component: () => import('@/views/ForgotPassword.vue') },
  { path: '/about', component: () => import('@/views/AboutUs.vue') },
  { path: '/how-it-works', component: () => import('@/views/HowItWorks.vue') },
  { path: '/contact', component: () => import('@/views/ContactUs.vue') },
  // Account
  { path: '/account', component: () => import('@/views/account/MyOrders.vue'), meta: { requiresAuth: true } },
  { path: '/account/profile', component: () => import('@/views/account/Profile.vue'), meta: { requiresAuth: true } },
  { path: '/account/custom-order', component: () => import('@/views/account/CustomOrderForm.vue'), meta: { requiresAuth: true } },
  // Admin
  {
    path: '/admin',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: { requiresAdmin: true },
    children: [
      { path: '', redirect: '/admin/overview' },
      { path: 'overview', component: () => import('@/views/admin/Overview.vue') },
      { path: 'products', component: () => import('@/views/admin/Products.vue') },
      { path: 'orders', component: () => import('@/views/admin/Orders.vue') },
      { path: 'customers', component: () => import('@/views/admin/Customers.vue') },
      { path: 'custom-orders', component: () => import('@/views/admin/CustomOrders.vue') },
      { path: 'offers', component: () => import('@/views/admin/Offers.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

let authReady = false

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Refresh on first load OR on every protected route navigation
  if (!authReady || to.meta.requiresAdmin || to.meta.requiresAuth) {
    await auth.refreshUser()
    authReady = true
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn) return '/login'
  if (to.meta.requiresAdmin && !auth.isAdmin) return '/'
})

export default router
