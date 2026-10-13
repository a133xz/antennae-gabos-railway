import Link from 'next/link'

type TextLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
}

export function TextLink({ href, children, className }: TextLinkProps) {
  const classes = `inline-flex items-baseline gap-1.5 text-[19px] uppercase transition-opacity hover:opacity-70 ${className ?? ''}`
  const content = (
    <>
      {children}
      <span aria-hidden>&gt;</span>
    </>
  )

  if (href.startsWith('http')) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer">
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}

export function TextAction({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-1.5 text-[19px] uppercase ${className ?? ''}`}>
      {children}
      <span aria-hidden>&gt;</span>
    </span>
  )
}
