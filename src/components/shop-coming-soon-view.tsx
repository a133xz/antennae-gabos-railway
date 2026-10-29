/** Centered placeholder — layout matches empty cart (`cart-view.tsx`). */
export function ShopComingSoonView() {
  return (
    <div className="store-cart shop-coming-soon flex min-h-0 flex-1 flex-col">
      <p className="mx-auto w-[min(909px,90vw)] text-center text-[32px] uppercase leading-none md:fixed md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
        coming soon
      </p>
    </div>
  )
}
