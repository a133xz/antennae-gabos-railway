import { StoreNotFoundView } from '@/components/store-not-found-view'

/** Avoid build-time Payload/DB access; root not-found sits outside `(frontend)` layout. */
export const dynamic = 'force-dynamic'

export default function RootNotFound() {
  return <StoreNotFoundView />
}
