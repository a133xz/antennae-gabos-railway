import type { Metadata } from 'next'
import { CurtainContactContent } from '@/components/curtain-contact-content'
import { GabosCurtainShell } from '@/components/gabos-curtain-shell'
import { getSettings } from '@/content/site'

export const metadata: Metadata = { title: 'Contact' }

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <GabosCurtainShell>
      <CurtainContactContent settings={settings} />
    </GabosCurtainShell>
  )
}
