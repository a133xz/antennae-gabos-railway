# Stripe checkout for Gabos shop

The shop uses **Stripe Checkout** (hosted payment page). Product copy and images live in **Payload**; prices and tax behavior are controlled by **Stripe Price** objects referenced from each product.

## What is already wired

| Piece | Location |
|---|---|
| Products in CMS | Payload → **Products** (`/admin/collections/products`) |
| Cart (browser) | `src/lib/cart.tsx` — localStorage, size + quantity |
| Checkout API | `POST /api/checkout` — validates Payload, opens Stripe Checkout |
| Webhook stub | `POST /api/webhooks/stripe` — logs `checkout.session.completed` |

There is **no** separate React payment UI: checkout redirects to Stripe’s page (Stripe’s recommended flow for PCI scope).

## 1. Stripe account & keys

1. Create or open a [Stripe Dashboard](https://dashboard.stripe.com) account.
2. Enable **Test mode** while developing.
3. Copy keys from **Developers → API keys** into `.env`:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is reserved for a future embedded flow; Checkout only needs the secret key server-side today.

Restart `npm run dev` after changing env vars.

## 2. Create products in Stripe

For each Payload product you sell:

1. **Product catalog → Add product** (name, description optional).
2. Add a **Price** in **EUR**, one-time payment, amount matching Payload `price` (e.g. €40 → `4000` cents if using decimal input, or €40.00 as displayed).
3. Copy **Product ID** (`prod_…`) and **Price ID** (`price_…`) into the Payload product fields:
   - `stripeProductId`
   - `stripePriceId`

Checkout uses **Price ID** only. Payload `price` is shown on the site and double-checked in `/api/checkout` so the cart cannot drift from CMS.

### Optional: Stripe CLI sync

With [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe login
stripe products create --name="F1 tank top" --description="Black tank"
stripe prices create --product=prod_xxx --unit-amount=4000 --currency=eur
```

Paste the returned IDs into Payload admin.

## 3. Local webhook (optional but recommended)

Stripe sends events when payment succeeds:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

Production: add endpoint `https://your-domain.com/api/webhooks/stripe` in **Developers → Webhooks**, events at least:

- `checkout.session.completed`

Extend `src/app/api/webhooks/stripe/route.ts` to email ops, decrement inventory, or write an **Orders** collection when you are ready.

## 4. Test a purchase

1. Run `npm run dev`, open `/shop`, add a product with a valid `stripePriceId`.
2. Go to `/cart` → **checkout**.
3. Use [Stripe test cards](https://stripe.com/docs/testing) e.g. `4242 4242 4242 4242`.

Success redirects to `/shop?checkout=success`.

## 5. Go live

1. Turn off Test mode in Stripe; use live `sk_live_` / `pk_live_` keys.
2. Recreate or activate live Prices; update Payload Price IDs if they differ from test.
3. Register the production webhook URL and live `STRIPE_WEBHOOK_SECRET`.
4. Confirm business settings (statement descriptor, customer support email) in Stripe Dashboard.

## Payload workflow for editors

1. Upload product images in **Media**.
2. Create **Product**: title, slug, € price, sizes, description, images.
3. After Stripe product/price exist, paste **Stripe Price ID** (required for checkout).
4. Toggle **Published in shop** when ready.

## Troubleshooting

| Symptom | Fix |
|---|---|
| “Stripe is not configured” | Set `STRIPE_SECRET_KEY` and restart dev server |
| “Stripe price ID missing” on PDP | Fill `stripePriceId` in Payload |
| “Product pricing is out of date” | Cart has stale line items; clear cart and re-add |
| Webhook 400 invalid signature | Wrong `STRIPE_WEBHOOK_SECRET` for this endpoint |

## Related packages

- Server: [`stripe`](https://github.com/stripe/stripe-node) (installed)
- Client (future): [`@stripe/stripe-js`](https://stripe.com/docs/stripe-js) if you add Payment Element later — not required for Checkout redirect.
