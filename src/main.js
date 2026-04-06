import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// Bootstrap: load products + offers from API on startup
import { useProductStore } from '@/stores/products'
import { useOfferStore } from '@/stores/offers'

const productStore = useProductStore()
const offerStore   = useOfferStore()

Promise.all([
  productStore.fetchAll(),
  offerStore.fetchOffers(),
]).catch(err => console.warn('API bootstrap failed (backend may be offline):', err.message))

app.mount('#app')
