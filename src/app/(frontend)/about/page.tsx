import type { Metadata } from 'next'
import { PageShell } from '@/components/page-shell'
import { getSettings } from '@/content/site'

export const metadata: Metadata = { title: 'About' }

export default async function AboutPage() {
  const settings = await getSettings()

  return (
    <PageShell>
      <div className="mx-auto flex min-h-[68vh] max-w-[58rem] items-center px-[var(--gutter)] py-24">
        <h1 className="mx-auto max-w-[28em] text-center text-[32px]">{settings.statement}</h1>
      </div>
    </PageShell>
  )
}
