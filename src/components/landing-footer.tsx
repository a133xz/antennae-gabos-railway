import Link from 'next/link'
import type { SiteSettings } from '@/content/types'

export function LandingFooter({
  settings,
  logo = 'white',
}: {
  settings: SiteSettings
  /** Home sits on the burgundy curtain; shop and cart sit on a light page. */
  logo?: 'white' | 'black'
}) {
  const place = (settings.originPlace || 'New York').replace(/\s+/g, '')
  const address = settings.storeAddress || 'Calle Prim 5, Madrid, Spain 28004'

  return (
    <footer className="landing-footer grid grid-cols-1 items-end gap-10 text-center md:grid-cols-[1fr_auto_1fr] md:gap-6">
      <Link href="/" className="justify-self-center md:justify-self-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-gabos.svg"
          alt="Gabos"
          width={234}
          height={175}
          className={`h-[120px] w-auto md:h-[175px]${logo === 'black' ? ' brightness-0' : ''}`}
        />
      </Link>
      <p className="grid justify-items-center gap-2 uppercase">
        <span>{settings.originKicker}</span>
        <span className="max-md:tracking-[0.35em] md:mr-[-31.5px] md:tracking-[31.5px]">{place}</span>
      </p>
      <p className="grid justify-items-center gap-2 uppercase md:justify-items-end md:text-right">
        <span>{settings.copyright}</span>
        <span>{address}</span>
      </p>
    </footer>
  )
}
