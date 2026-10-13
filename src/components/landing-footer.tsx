import Link from 'next/link'
import type { SiteSettings } from '@/content/types'

export function LandingFooter({ settings }: { settings: SiteSettings }) {
  const place = (settings.originPlace || 'New York').replace(/\s+/g, '')
  const address = settings.storeAddress || 'Calle Prim 5, Madrid, Spain 28004'

  return (
    <footer className="mt-[clamp(96px,12vh,200px)] grid grid-cols-1 items-end gap-10 text-center md:grid-cols-[1fr_auto_1fr] md:gap-6">
      <Link href="/" className="justify-self-center md:justify-self-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-gabos.svg" alt="Gabos" width={234} height={175} className="h-[175px] w-auto" />
      </Link>
      <p className="grid justify-items-center gap-2 text-[21px] uppercase">
        <span>{settings.originKicker}</span>
        <span className="mr-[-31.5px] tracking-[31.5px]">{place}</span>
      </p>
      <p className="grid justify-items-center gap-2 text-[21px] uppercase md:justify-items-end md:text-right">
        <span>{settings.copyright}</span>
        <span>{address}</span>
      </p>
    </footer>
  )
}
