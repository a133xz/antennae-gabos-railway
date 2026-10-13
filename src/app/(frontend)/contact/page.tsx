import type { Metadata } from 'next'
import { CurtainContactContent } from '@/components/curtain-contact-content'
import { CurtainStage } from '@/components/curtain-stage'
import { getSettings } from '@/content/site'

export const metadata: Metadata = { title: 'Contact' }

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <CurtainStage>
      <CurtainContactContent settings={settings} />
    </CurtainStage>
  )
}
