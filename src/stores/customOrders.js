import { defineStore } from 'pinia'
import { ref } from 'vue'

// Custom tattoo submission by users
// printStatus: 'pending' | 'reviewing' | 'printing' | 'printed' | 'shipped' | 'delivered' | 'rejected'
export const useCustomOrderStore = defineStore('customOrders', () => {
  const submissions = ref(JSON.parse(localStorage.getItem('naqshink_custom_orders') || '[]'))

  function save() { localStorage.setItem('naqshink_custom_orders', JSON.stringify(submissions.value)) }

  function submit({ userId, userName, userEmail, phone, description, imageDataUrl, size, placement, quantity, notes }) {
    const entry = {
      id: 'CUST' + Date.now(),
      userId, userName, userEmail, phone,
      description, imageDataUrl, size, placement, quantity, notes,
      printStatus: 'pending',
      adminNote: '',
      price: null,
      createdAt: new Date().toISOString()
    }
    submissions.value.unshift(entry)
    save()
    return entry
  }

  function updateStatus(id, printStatus, adminNote = '', price = null) {
    const s = submissions.value.find(s => s.id === id)
    if (s) {
      s.printStatus = printStatus
      if (adminNote) s.adminNote = adminNote
      if (price !== null) s.price = price
      save()
    }
  }

  function getByUser(userId) {
    return submissions.value.filter(s => s.userId === userId)
  }

  return { submissions, submit, updateStatus, getByUser }
})
