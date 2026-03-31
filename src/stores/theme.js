import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('naqshink_theme') !== 'light')

  function apply() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('naqshink_theme', isDark.value ? 'dark' : 'light')
  }

  function toggle() { isDark.value = !isDark.value }

  watch(isDark, apply, { immediate: true })

  return { isDark, toggle }
})
