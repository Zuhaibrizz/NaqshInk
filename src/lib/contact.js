export const contact = {
  phone:          import.meta.env.VITE_PHONE          || '+91 011-6965-6663',
  phoneHref:      import.meta.env.VITE_PHONE_HREF     || 'tel:+910116965663',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '911169656663',
  whatsappMsg:    import.meta.env.VITE_WHATSAPP_MESSAGE || 'Hi%20NAQSHINK%2C%20I%20have%20a%20query',
  emailSupport:   import.meta.env.VITE_EMAIL_SUPPORT  || 'help@naqshink.in',
  emailCare:      import.meta.env.VITE_EMAIL_CARE     || 'customercare.naqshink@gmail.com',
  emailPartner:   import.meta.env.VITE_EMAIL_PARTNER  || 'partner.naqshink@gmail.com',
  instagram:      import.meta.env.VITE_INSTAGRAM      || 'https://www.instagram.com/naqshink_/',
  facebook:       import.meta.env.VITE_FACEBOOK       || 'https://www.facebook.com/naqshink',
  youtube:        import.meta.env.VITE_YOUTUBE        || 'https://www.youtube.com/@naqshink',
}

export const whatsappUrl = (msg = contact.whatsappMsg) =>
  `https://wa.me/${contact.whatsappNumber}?text=${msg}`
