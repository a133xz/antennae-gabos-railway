import { notFound } from 'next/navigation'

/** Unmatched frontend URLs (e.g. /shopss) — route-group not-found only runs via notFound(). */
export default function MissingFrontendPage() {
  notFound()
}
