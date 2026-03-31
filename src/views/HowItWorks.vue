<template>
  <div class="page-top min-h-screen">
    <!-- Hero -->
    <section class="relative py-20 px-4 text-center overflow-hidden" style="background:var(--bg-card)">
      <div class="absolute inset-0 opacity-10" style="background:radial-gradient(circle at 50% 0%,#c8a96e,transparent 60%)"></div>
      <div class="relative max-w-3xl mx-auto" data-reveal>
        <span class="badge mb-4 inline-block">Application Guide</span>
        <h1 class="font-display text-5xl font-bold mb-4">How It <span class="text-ink-accent">Works</span></h1>
        <p class="text-gray-400 text-lg">Semi-permanent, skin-safe tattoos that develop on your skin and last 10–14 days.<br/>No pain. No needles. No commitment.</p>
      </div>
    </section>

    <!-- Video tutorial -->
    <section class="py-16 max-w-4xl mx-auto px-4" data-reveal>
      <div class="text-center mb-8">
        <span class="badge mb-3 inline-block">Watch & Learn</span>
        <h2 class="font-display text-3xl font-bold">See How to Apply</h2>
      </div>
      <div class="relative rounded-3xl overflow-hidden video-glow border border-ink-accent/30 bg-ink-dark">
        <div class="aspect-video">
          <iframe
            src="https://www.youtube.com/embed/27A4T0kYdhI?si=CY_l6KOnwUp9Xtiu"
            class="w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>
      </div>
      <p class="text-center text-gray-500 text-sm mt-4">Official application tutorial — takes less than 2 minutes</p>
    </section>

    <!-- What you get -->
    <section class="py-12 max-w-4xl mx-auto px-4" data-reveal>
      <h2 class="font-display text-2xl font-bold mb-6 text-center">What's In The Box</h2>
      <div class="grid grid-cols-3 gap-4">
        <div v-for="item in inbox" :key="item.label" class="card p-6 text-center">
          <div class="text-4xl mb-3">{{ item.icon }}</div>
          <p class="font-semibold text-sm">{{ item.label }}</p>
          <p class="text-gray-500 text-xs mt-1">{{ item.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 4 Steps -->
    <section class="py-16" style="background:var(--bg-card)">
      <div class="max-w-5xl mx-auto px-4">
        <div class="text-center mb-14" data-reveal>
          <span class="badge mb-3 inline-block">Step by Step</span>
          <h2 class="font-display text-4xl font-bold">Apply in 4 Steps <span class="text-gray-500 text-2xl font-normal">(~2 minutes)</span></h2>
        </div>
        <div class="grid md:grid-cols-2 gap-6">
          <div v-for="(step, i) in steps" :key="step.title"
            class="card p-8 flex gap-5 group hover:border-ink-accent transition-all duration-300"
            data-reveal :data-delay="i*100">
            <div class="w-12 h-12 rounded-2xl bg-ink-accent text-ink-black font-display text-xl font-bold flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              {{ i + 1 }}
            </div>
            <div>
              <h3 class="font-semibold text-lg mb-2">{{ step.title }}</h3>
              <p class="text-gray-400 text-sm leading-relaxed">{{ step.desc }}</p>
            </div>
          </div>
        </div>
        <div class="mt-8 card p-6 border-ink-accent/30 text-center" data-reveal>
          <p class="text-ink-accent font-semibold mb-1">⏳ Let it develop</p>
          <p class="text-sm" style="color:var(--text-muted)">Looks light at first — reaches full colour in <strong style="color:var(--text)">10–24 hours</strong>. Keep dry for the first 8 hours.</p>
        </div>
      </div>
    </section>

    <!-- Make it last + Quick fixes -->
    <section class="py-16 max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-8">
      <div class="card p-8" data-reveal="left">
        <h3 class="font-display text-2xl font-bold mb-6 text-ink-accent">Make It Last</h3>
        <ul class="space-y-3">
          <li v-for="tip in lastTips" :key="tip" class="flex items-start gap-3 text-sm" style="color:var(--text-muted)">
            <span class="text-ink-accent mt-0.5">✓</span> {{ tip }}
          </li>
        </ul>
      </div>
      <div class="card p-8" data-reveal="right">
        <h3 class="font-display text-2xl font-bold mb-6 text-yellow-400">Quick Fixes</h3>
        <ul class="space-y-3">
          <li v-for="fix in fixes" :key="fix.q" class="text-sm">
            <p class="font-medium" style="color:var(--text)">{{ fix.q }}</p>
            <p class="mt-0.5" style="color:var(--text-faint)">{{ fix.a }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-16" style="background:var(--bg-card)">
      <div class="max-w-3xl mx-auto px-4">
        <h2 class="font-display text-3xl font-bold text-center mb-10" data-reveal>Fast Answers</h2>
        <div class="space-y-3">
          <div v-for="(faq, i) in faqs" :key="faq.q"
            class="card overflow-hidden" data-reveal :data-delay="i*80">
            <button @click="openFaq = openFaq === i ? null : i"
              class="w-full flex items-center justify-between p-5 text-left transition"
              style="color:var(--text)">
              <span class="font-medium">{{ faq.q }}</span>
              <span class="transition-transform duration-300 flex-shrink-0 ml-4" style="color:var(--accent)"
                :class="openFaq === i ? 'rotate-45' : ''">+</span>
            </button>
            <Transition name="faq">
              <div v-if="openFaq === i" class="px-5 pb-5 text-sm leading-relaxed" style="border-top:1px solid var(--border);color:var(--text-muted)">
                <p class="pt-4">{{ faq.a }}</p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 text-center px-4" data-reveal>
      <h2 class="font-display text-4xl font-bold mb-4">Ready to try it?</h2>
      <p class="text-gray-400 mb-8">Browse 500+ designs or upload your own.</p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <RouterLink to="/shop" class="btn-primary px-10 py-4">Shop Designs</RouterLink>
        <RouterLink to="/custom-studio" class="btn-outline px-10 py-4">Custom Studio</RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
useScrollReveal()

const openFaq = ref(null)

const inbox = [
  { icon: '🎨', label: 'Tattoo Sheet', desc: 'Your design or custom print' },
  { icon: '🧴', label: 'Skin-Prep Wipe', desc: 'Cleans & preps the area' },
  { icon: '📋', label: 'How-to Guide', desc: 'Step-by-step instructions' },
]

const steps = [
  { title: 'Prep Your Skin', desc: 'Wash the area, dry completely, then use the prep wipe. Skin must be clean and oil-free.' },
  { title: 'Place the Design', desc: 'Peel the backing, align the tattoo face-down on your skin, press flat with no air bubbles.' },
  { title: 'Press Firmly', desc: 'Apply firm, even pressure for 60–90 seconds. Pay extra attention to the edges.' },
  { title: 'Peel Slowly', desc: 'Remove the sheet slowly at a low angle. Keep the area still for 15 minutes after.' },
]

const lastTips = [
  'Use gentle soap only — pat dry, never rub',
  'Apply light, unscented moisturizer daily',
  'Skip scrubs, oils, and harsh cleansers on the tattoo',
  'UV fades faster — apply SPF over it outdoors',
]

const fixes = [
  { q: 'Edges lifting?', a: 'Re-press with the sheet firmly and hold for 30 seconds.' },
  { q: 'Too light or patchy?', a: 'Next time press longer and ensure skin is fully dry before applying.' },
  { q: 'Want it gone sooner?', a: 'Warm water + soap + gentle daily exfoliation + a light oil speeds up fading.' },
]

const faqs = [
  { q: 'Is it waterproof?', a: 'Yes — after the first 8 hours it\'s fully waterproof. Avoid water and sweat for the first 8 hours after application.' },
  { q: 'Can I work out with it?', a: 'Light activity is fine after 8 hours. Avoid heavy sweating for the first 24 hours.' },
  { q: 'Is it safe for sensitive skin?', a: 'Yes, all ingredients are skin-safe and organic. We recommend doing a patch test on a small corner first.' },
  { q: 'How long does it last?', a: 'Typically 10–14 days depending on placement, skin type, and care routine.' },
  { q: 'Can I apply it anywhere on my body?', a: 'Yes — works on arms, wrists, neck, chest, back, ankles, and more. Avoid joints that flex a lot for best longevity.' },
]
</script>

<style scoped>
.faq-enter-active, .faq-leave-active { transition: max-height 0.3s ease, opacity 0.2s ease; overflow: hidden; }
.faq-enter-from, .faq-leave-to { max-height: 0; opacity: 0; }
.faq-enter-to, .faq-leave-from { max-height: 200px; opacity: 1; }
</style>
