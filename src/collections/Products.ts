import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'stripePriceId', 'order', 'active'],
    description:
      'Shop products. Set Stripe Price ID after creating the product in Stripe (see docs/stripe-setup.md).',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL segment, e.g. f1-shorts-red' },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: { description: 'Display price in euros (whole units, e.g. 40)' },
    },
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'sizes',
      type: 'select',
      hasMany: true,
      required: true,
      options: ['XS', 'S', 'M', 'L', 'XL'],
      defaultValue: ['XS', 'S', 'M', 'L', 'XL'],
    },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Extra images for the product page (first image is the main shot)' },
    },
    {
      name: 'stripeProductId',
      type: 'text',
      admin: { description: 'Stripe Product ID (prod_…)' },
    },
    {
      name: 'stripePriceId',
      type: 'text',
      admin: { description: 'Stripe Price ID (price_…) used at checkout' },
    },
    { name: 'active', type: 'checkbox', defaultValue: true, label: 'Published in shop' },
    { name: 'order', type: 'number', required: true, defaultValue: 0 },
  ],
}
