import Link from 'next/link'
import type { SiteSettings } from '@/content/types'

export function LandingFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-[clamp(80px,12vh,160px)] grid grid-cols-1 items-end gap-6 text-center md:grid-cols-[1fr_auto_1fr]">
      <Link href="/" className="justify-self-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-gabos.svg" alt="Gabos" width={234} height={175} className="h-24 w-auto" />
      </Link>
      <p className="grid gap-2.5">
        <span>{settings.originKicker}</span>
        <span className="pl-[1.5em] tracking-[1.5em]">{settings.originPlace}</span>
      </p>
      <p className="grid justify-items-end gap-2.5 text-right md:justify-self-end">
        <span>{settings.copyright}</span>
        <span className="max-w-xs normal-case">{settings.storeAddress}</span>
      </p>
    </footer>
  )
}
