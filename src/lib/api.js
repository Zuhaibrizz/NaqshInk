/**
 * Central API client — all backend calls go through here.
 * Automatically attaches JWT token from localStorage.
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

async function request(method, path, body, isFormData = false) {
  const token = localStorage.getItem('naqshink_token')
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!isFormData) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`)
  return data
}

export const api = {
  get:    (path)         => request('GET',    path),
  post:   (path, body)   => request('POST',   path, body),
  patch:  (path, body)   => request('PATCH',  path, body),
  delete: (path)         => request('DELETE', path),
  upload: (path, form)   => request('POST',   path, form, true),
}

// ── Auth ──
export const authApi = {
  login:    (email, password)              => api.post('/auth/login', { email, password }),
  register: (name, email, password)        => api.post('/auth/register', { name, email, password }),
  me:       ()                             => api.get('/auth/me'),
  profile:  (data)                         => api.patch('/auth/profile', data),
  password: (current, newPassword)         => api.patch('/auth/password', { current, newPassword }),
}

// ── Products ──
export const productApi = {
  list:   (params = {}) => api.get('/products?' + new URLSearchParams(params)),
  get:    (id)          => api.get(`/products/${id}`),
  create: (data)        => api.post('/products', data),
  update: (id, data)    => api.patch(`/products/${id}`, data),
  remove: (id)          => api.delete(`/products/${id}`),
}

// ── Orders ──
export const orderApi = {
  all:        ()           => api.get('/orders'),
  mine:       ()           => api.get('/orders/my'),
  get:        (id)         => api.get(`/orders/${id}`),
  create:     (data)       => api.post('/orders', data),
  setStatus:  (id, status) => api.patch(`/orders/${id}/status`, { status }),
}

// ── Custom Orders ──
export const customOrderApi = {
  all:    ()       => api.get('/custom-orders'),
  mine:   ()       => api.get('/custom-orders/my'),
  create: (data)   => api.post('/custom-orders', data),
  update: (id, d)  => api.patch(`/custom-orders/${id}`, d),
  remove: (id)     => api.delete(`/custom-orders/${id}`),
}

// ── Offers ──
export const offerApi = {
  active:   ()                              => api.get('/offers'),
  all:      ()                              => api.get('/offers/all'),
  validate: (code, cartTotal, cartCount, cartItems) => api.post('/offers/validate', { code, cartTotal, cartCount, cartItems }),
  create:   (data)                          => api.post('/offers', data),
  update:   (id, data)                      => api.patch(`/offers/${id}`, data),
  remove:   (id)                            => api.delete(`/offers/${id}`),
}

// ── Payments ──
export const paymentApi = {
  createOrder: (amount)  => api.post('/payments/create-order', { amount }),
  verify:      (data)    => api.post('/payments/verify', data),
}

// ── Customers ──
export const customerApi = {
  list:       ()           => api.get('/customers'),
  setRole:    (id, role)   => api.patch(`/customers/${id}/role`, { role }),
}

// ── Upload ──
export const uploadApi = {
  tattoo: (file) => {
    const form = new FormData()
    form.append('image', file)
    return api.upload('/upload/tattoo', form)
  }
}
