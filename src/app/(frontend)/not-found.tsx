import { PageShell } from '@/components/page-shell'
import { TextLink } from '@/components/text-link'

export default function NotFound() {
  return (
    <PageShell>
      <div className="mx-auto max-w-[1920px] px-[var(--gutter)] py-32">
        <h1 className="text-4xl">Page not found</h1>
        <div className="mt-6">
          <TextLink href="/">Home</TextLink>
        </div>
      </div>
    </PageShell>
  )
}
