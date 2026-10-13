import Link from 'next/link'
import type { SiteSettings } from '@/content/types'

export function GabosStoreFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-auto grid gap-10 px-[var(--gutter)] pb-10 pt-16 md:grid-cols-[1fr_auto] md:items-end">
      <Link href="/" className="w-fit">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-gabos.svg" alt="Gabos" width={234} height={175} className="h-[117px] w-auto max-w-[712px]" />
      </Link>
      <div className="text-right text-[21px] uppercase md:justify-self-end">
        <p>follow</p>
        <a href={settings.socialUrl} className="transition-opacity hover:opacity-70" target="_blank" rel="noreferrer">
          {settings.socialHandle}
        </a>
      </div>
    </footer>
  )
}
