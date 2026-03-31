import { onMounted, onUnmounted } from 'vue'

/**
 * Adds 'revealed' class to elements with [data-reveal] when they enter the viewport.
 * Usage: add data-reveal and data-delay="100" (ms) to any element.
 */
export function useScrollReveal() {
  let observer

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0
            setTimeout(() => {
              entry.target.classList.add('revealed')
            }, Number(delay))
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    document.querySelectorAll('[data-reveal]').forEach((el) => {
      observer.observe(el)
    })
  })

  onUnmounted(() => observer?.disconnect())
}
