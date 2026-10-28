import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

const mediaDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public/media')

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ['image/*', 'video/*'],
    staticDir: mediaDir,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
