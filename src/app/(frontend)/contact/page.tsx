import type { Metadata } from 'next'
import { CurtainContactContent } from '@/components/curtain-contact-content'
import { GabosCurtainShell } from '@/components/gabos-curtain-shell'
import { settings as siteCopy } from '@/content/records'
import { getSettings } from '@/content/site'

export const metadata: Metadata = { title: 'Contact' }

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <GabosCurtainShell>
      <CurtainContactContent
        settings={{
          ...settings,
          contactIntro: siteCopy.contactIntro,
          contactPhone: siteCopy.contactPhone,
          contactPhoneHours: siteCopy.contactPhoneHours,
        }}
      />
    </GabosCurtainShell>
  )
}
