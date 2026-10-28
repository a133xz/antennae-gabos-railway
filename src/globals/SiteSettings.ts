import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'statement', type: 'textarea', required: true },
    {
      name: 'contactIntro',
      type: 'textarea',
      required: true,
      admin: { description: 'Opening hours and intro copy on the contact page (one line per paragraph).' },
    },
    { name: 'contactPhone', type: 'text', label: 'Contact phone' },
    { name: 'contactPhoneHours', type: 'text', label: 'Contact phone hours' },
    {
      name: 'menuPdfUrl',
      type: 'text',
      required: true,
      label: 'Menu PDF URL',
      admin: { description: 'Direct link to the downloadable menu PDF.' },
    },
    {
      name: 'bookUrl',
      type: 'text',
      required: true,
      label: 'Reservations URL',
      admin: { description: 'Cover Manager or other booking link.' },
    },
    {
      name: 'shopAvailable',
      type: 'checkbox',
      defaultValue: false,
      label: 'Shop available',
      admin: {
        description:
          'When off, /shop and /cart show “coming soon”, the product catalog is hidden, and the cart link is removed. When on, the shop grid, product pages, and cart are live.',
      },
    },
    {
      name: 'emails',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'address', type: 'email', required: true },
      ],
    },
    { name: 'copyright', type: 'text', required: true },
    { name: 'socialHandle', type: 'text', required: true },
    { name: 'socialUrl', type: 'text', required: true },
    { name: 'originKicker', type: 'text', label: 'Origin kicker' },
    { name: 'originPlace', type: 'text', label: 'Origin place' },
    { name: 'storeAddress', type: 'textarea', label: 'Address' },
    { name: 'instagramLabel', type: 'text', label: 'Instagram label' },
    { name: 'editorialImage', type: 'upload', relationTo: 'media' },
  ],
}
