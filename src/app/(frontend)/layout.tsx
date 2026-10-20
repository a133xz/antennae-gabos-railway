import type { Metadata } from 'next'
import { CartProvider } from '@/lib/cart'
import './globals.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: "Gabo's",
    template: "%s — Gabo's",
  },
  description:
    "Gabo's is a New York-inspired supper club and cocktail bar in Madrid offering late-night dining, vinyl music, and classic American bites.",
  icons: {
    icon: '/favicon.jpg',
    apple: '/apple-favicon.jpg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
