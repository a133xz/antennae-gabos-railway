import { GabosStoreShell } from '@/components/gabos-store-shell'

export function StoreNotFoundView() {
  return (
    <GabosStoreShell>
      <div className="flex-1">
        <p className="fixed left-1/2 top-1/2 w-[min(909px,90vw)] -translate-x-1/2 -translate-y-1/2 text-center text-[32px] uppercase leading-none">
          page not found
        </p>
      </div>
    </GabosStoreShell>
  )
}
