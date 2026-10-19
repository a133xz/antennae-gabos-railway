import type { Metadata } from 'next'
import { CurtainContactContent } from '@/components/curtain-contact-content'
import { GabosCurtainShell } from '@/components/gabos-curtain-shell'
import { LandingFooter } from '@/components/landing-footer'
import { getSettings } from '@/content/site'

export const metadata: Metadata = { title: 'Contact' }

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <GabosCurtainShell>
      <CurtainContactContent settings={settings} />
      <div className="w-full self-stretch px-[var(--gutter-inline)] pb-[var(--gutter-bottom)]">
        <LandingFooter settings={settings} />
      </div>
    </GabosCurtainShell>
  )
}
