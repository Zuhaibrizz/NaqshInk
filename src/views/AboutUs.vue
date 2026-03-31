<template>
  <div class="page-top min-h-screen">
    <!-- Hero -->
    <section class="relative py-24 px-4 text-center overflow-hidden" style="background:var(--bg-card)">
      <div class="absolute inset-0 opacity-10" style="background:radial-gradient(circle at 50% 0%,#c8a96e,transparent 60%)"></div>
      <div class="relative max-w-3xl mx-auto" data-reveal>
        <span class="badge mb-4 inline-block">Our Story</span>
        <h1 class="font-display text-5xl md:text-6xl font-bold mb-6">Redefining Tattoo<br/><span class="text-ink-accent">Culture</span></h1>
        <p class="text-gray-400 text-lg leading-relaxed">For a new generation that wants expression without permanence.</p>
      </div>
    </section>

    <!-- Mission statement -->
    <section class="py-20 max-w-4xl mx-auto px-4 text-center" data-reveal>
      <p class="font-display text-2xl md:text-3xl leading-relaxed" style="color:var(--text-muted)">
        "Tattoos have always been a symbol of identity, belief, and self-expression. But for decades, they've come with fear —
        <span class="text-ink-accent">pain, permanence, and regret.</span>
        NAQSHINK exists to change that."
      </p>
    </section>

    <!-- Problem / Solution grid -->
    <section class="py-16 max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
      <div class="card p-8" data-reveal="left">
        <h2 class="font-display text-2xl font-bold mb-6 text-red-400">The Problem</h2>
        <div class="space-y-4">
          <div v-for="q in problems" :key="q" class="flex items-start gap-3">
            <span class="text-red-400 mt-0.5 flex-shrink-0">✗</span>
            <p class="text-gray-400 text-sm">{{ q }}</p>
          </div>
        </div>
      </div>
      <div class="card p-8 border-ink-accent/30" data-reveal="right">
        <h2 class="font-display text-2xl font-bold mb-6 text-ink-accent">Our Solution</h2>
        <div class="space-y-4">
          <div v-for="s in solutions" :key="s" class="flex items-start gap-3">
            <span class="text-ink-accent mt-0.5 flex-shrink-0">✓</span>
            <p class="text-gray-300 text-sm">{{ s }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="py-16" style="background:var(--bg-card)">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-14" data-reveal>
          <span class="badge mb-3 inline-block">What We Stand For</span>
          <h2 class="font-display text-4xl font-bold">What Makes Us Different</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="(v, i) in values" :key="v.title" class="card p-8 text-center group hover:scale-[1.02] transition-transform duration-300"
            data-reveal :data-delay="i*120">
            <div class="text-5xl mb-5 group-hover:animate-float inline-block">{{ v.icon }}</div>
            <h3 class="font-display text-xl font-semibold mb-3 text-ink-accent">{{ v.title }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed">{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="py-20 max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-8">
      <div class="card p-10" data-reveal="left">
        <div class="text-4xl mb-4">🎯</div>
        <h3 class="font-display text-2xl font-bold mb-4 text-ink-accent">Our Mission</h3>
        <p class="text-gray-400 leading-relaxed">To make tattoos safer, smarter, and more flexible — so anyone can express themselves without pain, regret, or lifelong commitment.</p>
      </div>
      <div class="card p-10" data-reveal="right">
        <div class="text-4xl mb-4">🌟</div>
        <h3 class="font-display text-2xl font-bold mb-4 text-ink-accent">Our Vision</h3>
        <p class="text-gray-400 leading-relaxed">To redefine tattoo culture in India by creating a future where tattoos are fluid, reversible, and personal — just like the people who wear them.</p>
      </div>
    </section>

    <!-- Promise -->
    <section class="py-20 text-center px-4" data-reveal>
      <div class="max-w-2xl mx-auto">
        <h2 class="font-display text-4xl font-bold mb-6">The NAQSHINK Promise</h2>
        <div class="flex flex-wrap justify-center gap-6 mb-10">
          <span v-for="p in promise" :key="p" class="text-lg font-semibold text-ink-accent">{{ p }}</span>
        </div>
        <p class="text-gray-400 mb-8">Just real-looking tattoos, personalised for you.</p>
        <RouterLink to="/shop" class="btn-primary px-10 py-4 text-base">Explore Designs</RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useScrollReveal } from '@/composables/useScrollReveal'
useScrollReveal()

const problems = [
  'What if I change my mind?',
  'What if I outgrow the meaning?',
  'What if I regret the placement?',
  'Pain, needles, and studio costs',
  'Permanent ink demands certainty — life rarely gives it',
]
const solutions = [
  'Hyper-realistic designs that look like real ink',
  'Pain-free — no needles, no studios needed',
  'Lasts 1–2 weeks then fades naturally',
  'Fully customisable — upload any image',
  'Skin-safe, waterproof, and made for everyday wear',
]
const values = [
  { icon: '🎨', title: 'Hyper-Realistic Art', desc: 'Every design is crafted to blend naturally with your skin — indistinguishable from real ink.' },
  { icon: '🌿', title: 'Skin-Safe Always', desc: 'Made with organic, plant-based ingredients. Gentle on all skin types, tested and certified.' },
  { icon: '✨', title: 'Freedom of Expression', desc: 'Change your look as often as your mood. No commitment, no regret, no limits.' },
]
const promise = ['No Pain.', 'No Needles.', 'No Lifetime Pressure.']
</script>
