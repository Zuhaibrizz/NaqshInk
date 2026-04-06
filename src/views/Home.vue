<template>
  <div class="overflow-x-hidden">

    <!-- ── HERO ── -->
    <section class="min-h-screen flex items-center justify-center relative overflow-hidden bg-ink-black">
      <!-- Animated gradient orbs -->
      <div class="absolute w-[600px] h-[600px] rounded-full opacity-10 blur-3xl animate-pulse-glow"
        style="background:radial-gradient(circle,#c8a96e,transparent 70%);top:-10%;left:-10%"></div>
      <div class="absolute w-[400px] h-[400px] rounded-full opacity-8 blur-3xl"
        style="background:radial-gradient(circle,#c8a96e,transparent 70%);bottom:0;right:5%;animation:float 6s ease-in-out infinite"></div>

      <!-- Floating particles -->
      <div v-for="p in particles" :key="p.id" class="hero-particle pointer-events-none"
        :style="{ width: p.size+'px', height: p.size+'px', top: p.top+'%', left: p.left+'%', opacity: p.opacity, animationDelay: p.delay+'s', animationDuration: p.dur+'s' }">
      </div>

      <div class="relative text-center px-4 max-w-4xl mx-auto">
        <!-- Animated pills -->
        <div class="flex flex-wrap justify-center gap-3 mb-10 animate-fade-in" style="animation-delay:0.1s">
          <span v-for="(f,i) in features" :key="f"
            class="text-xs px-4 py-1.5 rounded-full backdrop-blur"
            style="background:rgba(200,169,110,0.12);border:1px solid rgba(200,169,110,0.25);color:rgba(255,255,255,0.8)"
            :style="{ animationDelay: (i*0.05)+'s' }">{{ f }}</span>
        </div>

        <h1 class="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-up" style="animation-delay:0.2s">
          Your skin,<br />
          <span class="text-ink-accent relative">
            your canvas
            <svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
              <path d="M2 8 Q75 2 150 8 Q225 14 298 8" stroke="#c8a96e" stroke-width="2.5" stroke-linecap="round" class="animate-fade-in" style="animation-delay:0.8s"/>
            </svg>
          </span>
        </h1>

        <p class="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style="animation-delay:0.35s">
          NAQSHINK gives you the real tattoo look — without the lifetime commitment.
          Semi-permanent designs that last 1–2 weeks and fade naturally.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style="animation-delay:0.5s">
          <RouterLink to="/shop" class="btn-primary text-base px-8 py-4 animate-pulse-glow">Shop Now</RouterLink>
          <RouterLink to="/custom-studio" class="btn-outline text-base px-8 py-4">✏️ Custom Studio</RouterLink>
        </div>

        <!-- Animated counters -->
        <div class="flex flex-wrap justify-center gap-8 mt-14 animate-fade-up" style="animation-delay:0.65s">
          <div v-for="c in counters" :key="c.label" class="text-center">
            <p class="font-display text-3xl font-bold text-ink-accent">{{ c.value }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ c.label }}</p>
          </div>
        </div>
      </div>


    </section>

    <!-- ── MARQUEE STRIP ── -->
    <div class="bg-ink-accent py-3 overflow-hidden">
      <div class="marquee-track">
        <span v-for="i in 2" :key="i" class="flex gap-12 pr-12">
          <span v-for="f in marqueeItems" :key="f+i" class="text-ink-black font-semibold text-sm whitespace-nowrap flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-ink-black inline-block"></span> {{ f }}
          </span>
        </span>
      </div>
    </div>

    <!-- ── HOW IT WORKS (animated steps) ── -->
    <section class="py-24 max-w-6xl mx-auto px-4">
      <div class="text-center mb-16" data-reveal>
        <span class="badge mb-3 inline-block">Simple Process</span>
        <h2 class="font-display text-4xl font-bold">How It Works</h2>
      </div>
      <div class="grid md:grid-cols-4 gap-6">
        <div v-for="(step, i) in howItWorks" :key="step.title"
          class="relative text-center card p-8 group"
          data-reveal :data-delay="i * 120">
          <div class="w-16 h-16 rounded-2xl bg-ink-accent/10 border border-ink-accent/30 flex items-center justify-center text-3xl mx-auto mb-5 group-hover:bg-ink-accent group-hover:scale-110 transition-all duration-300">
            {{ step.icon }}
          </div>
          <div class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-ink-accent text-ink-black text-sm font-bold flex items-center justify-center">
            {{ i + 1 }}
          </div>
          <h3 class="font-semibold mb-2">{{ step.title }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ── VIDEO DEMO SECTION ── -->
    <section class="py-20" style="background:var(--bg-card)">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-14" data-reveal>
          <span class="badge mb-3 inline-block">See It In Action</span>
          <h2 class="font-display text-4xl font-bold mb-3">Real Results. Real People.</h2>
          <p class="text-gray-400 max-w-xl mx-auto text-sm">Watch how our semi-permanent tattoos look and apply — straight from our customers.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="(vid, i) in videos" :key="vid.id"
            class="relative rounded-2xl overflow-hidden cursor-pointer group video-glow transition-all duration-300"
            style="border:1px solid var(--border)"
            data-reveal :data-delay="i * 150"
            @click="openVideo(vid)"
            @mouseenter="e=>e.currentTarget.style.borderColor='var(--accent)'"
            @mouseleave="e=>e.currentTarget.style.borderColor='var(--border)'">
            <!-- Thumbnail -->
            <div class="aspect-[9/16] bg-ink-gray relative overflow-hidden">
              <img :src="vid.thumb" :alt="vid.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <!-- Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <!-- Play button -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-16 h-16 rounded-full bg-ink-accent/90 flex items-center justify-center group-hover:scale-110 group-hover:bg-ink-accent transition-all duration-300 shadow-lg">
                  <svg class="w-6 h-6 text-ink-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <!-- Label -->
              <div class="absolute bottom-4 left-4 right-4">
                <p class="font-semibold text-sm">{{ vid.title }}</p>
                <p class="text-gray-400 text-xs mt-0.5">{{ vid.duration }}</p>
              </div>
              <!-- Views badge -->
              <div class="absolute top-3 right-3 bg-black/60 rounded-full px-2 py-1 text-xs text-gray-300 flex items-center gap-1">
                👁 {{ vid.views }}
              </div>
            </div>
          </div>
        </div>

        <!-- Video modal -->
        <Transition name="modal">
          <div v-if="activeVideo" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" @click.self="activeVideo=null">
            <div class="relative w-full max-w-2xl">
              <button @click="activeVideo=null" class="absolute -top-10 right-0 text-gray-400 hover:text-white text-sm flex items-center gap-1">
                ✕ Close
              </button>
              <div class="rounded-2xl overflow-hidden aspect-video bg-ink-dark">
                <iframe :src="activeVideo.embedUrl" class="w-full h-full" frameborder="0"
                  allow="autoplay; fullscreen" allowfullscreen></iframe>
              </div>
              <p class="text-center text-gray-400 text-sm mt-3">{{ activeVideo.title }}</p>
            </div>
          </div>
        </Transition>
      </div>
    </section>

    <!-- ── BESTSELLERS ── -->
    <section class="py-20 max-w-7xl mx-auto px-4">
      <div class="flex items-end justify-between mb-12" data-reveal>
        <div>
          <span class="badge mb-2 inline-block">Top Picks</span>
          <h2 class="font-display text-4xl font-bold">Bestsellers</h2>
        </div>
        <RouterLink to="/shop" class="btn-outline text-sm hidden md:inline-block">View All →</RouterLink>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div v-for="(p, i) in bestsellers" :key="p.id" data-reveal :data-delay="i * 100">
          <ProductCard :product="p" />
        </div>
      </div>
      <div class="text-center mt-10 md:hidden">
        <RouterLink to="/shop" class="btn-outline">View All Designs</RouterLink>
      </div>
    </section>

    <!-- ── CUSTOM STUDIO CTA ── -->
    <section class="py-20 px-4" data-reveal>
      <div class="max-w-5xl mx-auto rounded-3xl p-10 md:p-16 border border-ink-accent/30 relative overflow-hidden"
        style="background:var(--bg-card)">
        <!-- Glow -->
        <div class="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
          style="background:radial-gradient(circle,#c8a96e,transparent 70%)"></div>
        <div class="relative flex flex-col md:flex-row items-center gap-10">
          <div class="flex-1 text-center md:text-left">
            <span class="badge mb-4 inline-block">Custom Studio</span>
            <h2 class="font-display text-3xl md:text-4xl font-bold mb-4">
              Upload any image.<br/><span class="text-ink-accent">Wear it as a tattoo.</span>
            </h2>
            <p class="text-gray-400 mb-8 leading-relaxed">
              Portraits, logos, signatures, pet photos, QR codes — anything. We print it on skin-safe transfer paper and ship in 2–3 days.
            </p>
            <RouterLink to="/custom-studio" class="btn-primary text-base px-8 py-4">
              Open Custom Studio →
            </RouterLink>
          </div>
          <div class="grid grid-cols-2 gap-3 flex-shrink-0">
            <div v-for="(t, i) in studioTypes" :key="t"
              class="rounded-xl px-4 py-3 text-center text-sm transition cursor-default"
              style="background:var(--bg-input);color:var(--text-muted);border:1px solid var(--border)"
              :style="{ animationDelay: i*0.1+'s' }">
              {{ t }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── ABOUT CARDS ── -->
    <section id="about" class="py-16 max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6">
      <div v-for="(card, i) in aboutCards" :key="card.title"
        class="card p-8 group hover:scale-[1.02] transition-transform duration-300"
        data-reveal :data-delay="i * 120">
        <div class="text-4xl mb-4 group-hover:animate-float inline-block">{{ card.icon }}</div>
        <h3 class="font-display text-xl font-semibold mb-3 text-ink-accent">{{ card.title }}</h3>
        <p class="text-gray-400 text-sm leading-relaxed">{{ card.text }}</p>
      </div>
    </section>

    <!-- ── TESTIMONIALS ── -->
    <section class="py-20 overflow-hidden" style="background:var(--bg-card)">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-14" data-reveal>
          <span class="badge mb-3 inline-block">Reviews</span>
          <h2 class="font-display text-4xl font-bold">What People Say</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="(t, i) in testimonials" :key="t.name"
            class="card p-6 hover:scale-[1.02] transition-transform duration-300"
            data-reveal :data-delay="i * 100">
            <div class="flex gap-1 mb-3">
              <span v-for="s in 5" :key="s" class="text-ink-accent text-lg">★</span>
            </div>
            <p class="text-gray-300 text-sm leading-relaxed mb-4">"{{ t.text }}"</p>
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-ink-accent/20 flex items-center justify-center text-ink-accent font-bold text-sm">
                {{ t.name[0] }}
              </div>
              <p class="text-ink-accent font-semibold text-sm">{{ t.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FINAL CTA ── -->
    <section class="py-28 text-center px-4 relative overflow-hidden">
      <div class="absolute inset-0 opacity-5"
        style="background-image: radial-gradient(circle at 50% 50%, #c8a96e 0%, transparent 60%)"></div>
      <div data-reveal class="relative">
        <h2 class="font-display text-5xl font-bold mb-4">Ready to wear your story?</h2>
        <p class="text-gray-400 mb-10 text-lg">No pain. No needles. No regret.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink to="/shop" class="btn-primary text-lg px-10 py-4">Explore Designs</RouterLink>
          <RouterLink to="/custom-studio" class="btn-outline text-lg px-10 py-4">Custom Studio</RouterLink>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { useProductStore } from '@/stores/products'
import { useScrollReveal } from '@/composables/useScrollReveal'

useScrollReveal()

const store = useProductStore()
const bestsellers = computed(() => store.products.filter(p => p.tags.includes('bestseller')).slice(0, 4))
const activeVideo = ref(null)

const features = ['Pain Free', 'Custom', 'Easy Application', 'Skin Safe', 'Waterproof', 'Lasts 1–2 Weeks']

const marqueeItems = [
  'Pain Free', 'Waterproof', 'Lasts 1–2 Weeks', 'Skin Safe', 'No Needles',
  'Custom Designs', 'Ships in 2–3 Days', 'Trusted by 1 Lakh+', 'Hyper Realistic', 'Easy Apply'
]

const counters = [
  { value: '1L+', label: 'Happy Customers' },
  { value: '500+', label: 'Designs Available' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '2 Wks', label: 'Lasts Up To' },
]

// Floating particles config
const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  top: Math.random() * 100,
  left: Math.random() * 100,
  opacity: Math.random() * 0.3 + 0.05,
  delay: Math.random() * 4,
  dur: Math.random() * 3 + 3,
}))

const howItWorks = [
  { icon: '🖼️', title: 'Choose or Upload', desc: 'Pick from 500+ designs or upload your own image to the Custom Studio.' },
  { icon: '🛒', title: 'Add to Cart', desc: 'Select your size, placement, and quantity. Checkout in seconds.' },
  { icon: '🖨️', title: 'We Print & Ship', desc: 'Our team prints your design on skin-safe paper and ships in 2–3 days.' },
  { icon: '✨', title: 'Apply & Wear', desc: 'Wet, press, peel — looks real instantly. Lasts 1–2 weeks.' },
]

// Demo videos — using the real application tutorial
const videos = [
  {
    id: 1,
    title: 'How to Apply Your Tattoo',
    duration: '1:02',
    views: '12K',
    thumb: 'https://img.youtube.com/vi/27A4T0kYdhI/hqdefault.jpg',
    embedUrl: 'https://www.youtube.com/embed/27A4T0kYdhI?autoplay=1',
  },
  {
    id: 2,
    title: 'Custom Portrait Tattoo Result',
    duration: '1:10',
    views: '8.4K',
    thumb: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&q=80',
    embedUrl: 'https://www.youtube.com/embed/27A4T0kYdhI?autoplay=1',
  },
  {
    id: 3,
    title: 'Before & After — Real Skin',
    duration: '0:30',
    views: '21K',
    thumb: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&q=80',
    embedUrl: 'https://www.youtube.com/embed/27A4T0kYdhI?autoplay=1',
  },
]

function openVideo(vid) { activeVideo.value = vid }

const aboutCards = [
  { icon: '🎯', title: 'The Problem We Solve', text: 'Tattoos are powerful — but permanent ink isn\'t for everyone. NAQSHINK gives you the same bold look, without lifetime pressure.' },
  { icon: '💡', title: 'Our Innovation', text: 'NAQSHINK tattoos are skin-safe and needle-free. They look real, fade naturally, and leave no regret.' },
  { icon: '🌱', title: 'Our Vision', text: 'Tattoos aren\'t just body art — they\'re self-expression. We\'re building ink that evolves with you.' },
]

const testimonials = [
  { name: 'Priya S.', text: 'Wore it with my college outfit and it instantly upgraded my look. So cool.' },
  { name: 'Rahul M.', text: 'Such a unique concept. Looked super realistic and sharp.' },
  { name: 'Ananya K.', text: 'Got this for a bachelor party and it was a hit. Everyone thought it was real.' },
  { name: 'Dev P.', text: 'Looks like real ink, not a sticker. Lasted almost 2 weeks.' },
  { name: 'Sneha R.', text: 'Easy to apply and the result looked clean and realistic.' },
  { name: 'Arjun T.', text: 'Tried a custom tattoo and the detailing surprised me. Very premium.' },
]

const studioTypes = ['🤳 Portraits', '✍️ Signatures', '🐾 Pet Photos', '🎨 Artwork', '📝 Text & Quotes', '📱 QR Codes']
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
