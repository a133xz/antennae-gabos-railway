import Link from 'next/link'

export function GabosNavLink({
  href,
  label,
  download,
  external,
  className = 'text-[19px] uppercase transition-opacity hover:opacity-70',
}: {
  href: string
  label: string
  download?: boolean
  external?: boolean
  className?: string
}) {
  if (download || external || href.startsWith('http')) {
    return (
      <a
        href={href}
        className={className}
        {...(download ? { download: true } : {})}
        {...(external || href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {label}
      </a>
    )
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}
