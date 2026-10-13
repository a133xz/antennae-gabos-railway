import Link from 'next/link'

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Gabos" className={`inline-flex w-fit items-center justify-self-start ${className ?? ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/monogram.svg" alt="" width={48} height={68} className="h-10 w-auto" />
    </Link>
  )
}
