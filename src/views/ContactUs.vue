<template>
  <div class="page-top min-h-screen">
    <!-- Hero -->
    <section class="relative py-20 px-4 text-center overflow-hidden" style="background:var(--bg-card)">
      <div class="absolute inset-0 opacity-10" style="background:radial-gradient(circle at 50% 0%,#c8a96e,transparent 60%)"></div>
      <div class="relative max-w-2xl mx-auto" data-reveal>
        <span class="badge mb-4 inline-block">Get In Touch</span>
        <h1 class="font-display text-5xl font-bold mb-4">Contact <span class="text-ink-accent">Us</span></h1>
        <p class="text-gray-400">For order queries, collaborations, or just to say hi — we're here.</p>
      </div>
    </section>

    <div class="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">

      <!-- Contact info -->
      <div class="space-y-6" data-reveal="left">
        <div class="card p-6 space-y-5">
          <h2 class="font-display text-2xl font-bold mb-2">Reach Us Directly</h2>
          <div v-for="c in contacts" :key="c.label" class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-ink-accent/10 border border-ink-accent/20 flex items-center justify-center text-xl flex-shrink-0">
              {{ c.icon }}
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-0.5">{{ c.label }}</p>
              <a v-if="c.href" :href="c.href" class="text-sm hover:text-ink-accent transition" style="color:var(--text)">{{ c.value }}</a>
              <p v-else class="text-sm" style="color:var(--text)">{{ c.value }}</p>
            </div>
          </div>
        </div>

        <!-- Collaboration types -->
        <div class="card p-6">
          <h3 class="font-semibold mb-4 text-ink-accent">Collaborations & Partnerships</h3>
          <div class="flex flex-wrap gap-2">
            <span v-for="c in collabs" :key="c"
              class="text-xs px-3 py-1.5 rounded-full transition cursor-default"
              style="background:var(--bg-input);border:1px solid var(--border);color:var(--text-muted)">
              {{ c }}
            </span>
          </div>
          <p class="text-xs text-gray-500 mt-4">Email: <a :href="`mailto:${contact.emailPartner}`" class="text-ink-accent hover:underline">{{ contact.emailPartner }}</a></p>
        </div>

        <!-- WhatsApp CTA -->
        <a :href="whatsappUrl()"
          target="_blank"
          class="flex items-center gap-4 card p-5 hover:border-green-500 transition-all duration-300 group">
          <div class="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/30 transition">
            <svg class="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div>
            <p class="font-semibold text-green-400">Chat on WhatsApp</p>
            <p class="text-xs text-gray-500">Fastest response — usually within minutes</p>
          </div>
          <svg class="w-4 h-4 text-gray-600 ml-auto group-hover:text-green-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </a>
      </div>

      <!-- Contact form -->
      <div class="card p-8" data-reveal="right">
        <h2 class="font-display text-2xl font-bold mb-6">Send a Message</h2>
        <form @submit.prevent="submit" class="space-y-4">
          <input v-model="form.name" placeholder="Your Name" class="input" required />
          <input v-model="form.email" type="email" placeholder="Email Address" class="input" required />
          <input v-model="form.phone" type="tel" placeholder="Phone Number" class="input" />
          <select v-model="form.subject" class="input">
            <option value="">Select Subject</option>
            <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
          </select>
          <textarea v-model="form.message" placeholder="Your message..." class="input h-32 resize-none" required></textarea>
          <p v-if="sent" class="text-green-400 text-sm bg-green-900/20 rounded-lg px-3 py-2">
            ✓ Message sent! We'll get back to you within 24 hours.
          </p>
          <button type="submit" class="btn-primary w-full text-center">Send Message</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { contact, whatsappUrl } from '@/lib/contact'
useScrollReveal()

const sent = ref(false)
const form = ref({ name: '', email: '', phone: '', subject: '', message: '' })

const contacts = [
  { icon: '📞', label: 'Phone',            value: contact.phone,        href: contact.phoneHref },
  { icon: '📧', label: 'Customer Support', value: contact.emailSupport, href: `mailto:${contact.emailSupport}` },
  { icon: '📧', label: 'Customer Care',    value: contact.emailCare,    href: `mailto:${contact.emailCare}` },
]

const collabs = ['B2B', 'Franchise Partner', 'Brand Ambassador', 'Bulk Orders', 'Social Media Collab', 'College Events', 'Sponsorship', 'Become an Artist', 'Concerts', 'Hiring']

const subjects = ['Order Query', 'Shipping Issue', 'Custom Design', 'Collaboration', 'Bulk Order', 'Other']

function submit() {
  // In production, POST to your backend/email service
  sent.value = true
  form.value = { name: '', email: '', phone: '', subject: '', message: '' }
  setTimeout(() => sent.value = false, 5000)
}
</script>
