# Preview para diseño (sin Payload ni Stripe)

La web pública puede desplegarse en Vercel **sin base de datos ni CMS** para que alguien revise UI, tipografía y layout. El contenido sale de ficheros en el repo, no de Postgres.

Cuando conectes Payload y Stripe, el mismo código pasa al modo “producción” solo con variables de entorno.

## Dos despliegues (recomendado: Vercel + Railway)

| Plataforma | Uso | Variables clave |
|------------|-----|-----------------|
| **Vercel** | Preview estático para diseño | `GABOS_STATIC_PREVIEW=true` (sin CMS) |
| **Railway** | Cliente con `/admin` y Postgres | `PAYLOAD_SECRET` + `DATABASE_URL` (Postgres en Railway); **no** `GABOS_STATIC_PREVIEW` |

Guía paso a paso Railway (CLI, Postgres, seed, volumen media): **[railway-deploy.md](./railway-deploy.md)**.

## Modos de contenido

| Modo | Cuándo | Fuente de datos |
|------|--------|-----------------|
| **Preview estático** | Ver abajo | `src/content/records.ts` + assets en `public/` |
| **CMS (Payload)** | `PAYLOAD_SECRET` definido y preview forzado apagado | Postgres vía Payload (`/admin`) |

La lógica está en `src/content/static-content.ts` y la usan `getSettings`, `getProducts` y `getProduct` en `src/content/site.ts`.

### Cuándo se activa el preview estático

Se sirve contenido estático si **cualquiera** de estas condiciones es cierta:

1. **`GABOS_STATIC_PREVIEW=true`** en el entorno (Vercel, `.env`, etc.) — fuerza preview aunque tengas otras variables.
2. **`PAYLOAD_SECRET` vacío o ausente** — fallback automático para despliegues sin CMS.

En local, con `.env` que incluye `PAYLOAD_SECRET` y Postgres, sigues usando Payload con normalidad.

## Desplegar solo para la diseñadora

1. Sube el código a Git y conecta el proyecto en Vercel.
2. **Opción A (recomendada para preview):** no configures `PAYLOAD_SECRET` ni `DATABASE_URL` en Vercel.
3. **Opción B:** deja esas variables pero añade `GABOS_STATIC_PREVIEW=true` en Production/Preview.
4. Redeploy.

No hace falta Stripe para ver la tienda: carrito, tallas y cantidades funcionan en el navegador; el botón de checkout sigue desactivado hasta configurar Stripe (ver [stripe-setup.md](./stripe-setup.md)).

### Editar textos e imágenes del preview

| Qué | Dónde |
|-----|--------|
| Copy del site, nav, contacto, hero | `src/content/records.ts` → objeto `settings` |
| Productos demo del shop | `src/content/records.ts` → array `products` |
| Imágenes (`/media/...`, `/brand/...`) | `public/media`, `public/brand` (deben estar en git para Vercel) |

Tras cambiar `records.ts`, commit + push + redeploy.

**Nota:** el contenido que ves en local con Payload **no** se sincroniza solo a Vercel en modo preview. Para igualar el preview al CMS local, copia los textos a `records.ts` o pasa ya al modo CMS (siguiente sección).

## Pasar a Payload (CMS + Postgres)

Cuando quieras admin en `/admin` y datos en base de datos:

1. Crea Postgres gestionado (Neon, Supabase, Vercel Postgres, etc.).
2. En Vercel (Production y Preview), configura:
   - `DATABASE_URL` — connection string de Postgres
   - `PAYLOAD_SECRET` — cadena larga aleatoria, p. ej. `openssl rand -base64 32`
3. **Quita** `GABOS_STATIC_PREVIEW` o ponla en `false` si la habías usado para forzar preview.
4. Redeploy.
5. **Una sola vez**, pobla la base de datos desde tu máquina apuntando al mismo `DATABASE_URL`:

   ```bash
   # .env con DATABASE_URL de producción y PAYLOAD_SECRET
   npm run seed
   ```

6. Entra en `https://tu-dominio/admin`, inicia sesión con el usuario del seed (`SEED_EMAIL` / `SEED_PASSWORD` del `.env` usado en el seed).

A partir de ahí, las páginas públicas leen de Payload. Los cambios en `/admin` ya no pasan por `records.ts` (este fichero sigue siendo la plantilla inicial del seed).

### Subidas de media en producción

En local, Payload guarda uploads en `public/media`. En hosting serverless conviene configurar almacenamiento remoto (S3, Vercel Blob, etc.) cuando lo necesites; hasta entonces, asegúrate de que las imágenes del seed o las que subas estén disponibles en la URL que sirve Payload.

## Pasar a Stripe (checkout)

Independiente del CMS: cuando Payload esté activo y los productos tengan **Stripe Price ID**, configura las claves según [stripe-setup.md](./stripe-setup.md).

Resumen:

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET` (webhooks en producción)

Sin la publishable key, la UI de shop/cart sigue en modo “solo preview” del carrito.

## Qué no funciona en preview estático

| Ruta / función | Comportamiento |
|----------------|----------------|
| `/admin` | Requiere Payload; no usar en preview sin CMS |
| `POST /api/checkout` | 503 sin Stripe |
| Webhooks Stripe | Sin secret, no operativos |
| Contenido en vivo del CMS local | No visible en Vercel hasta conectar Postgres + seed |

## Build en Vercel

La página 404 raíz (`src/app/not-found.tsx`) está en `force-dynamic` para no exigir Payload durante el build. En preview estático, el build no necesita `PAYLOAD_SECRET` ni Postgres.

## Checklist rápido

**Solo diseño en Vercel**

- [ ] Sin `PAYLOAD_SECRET` *o* `GABOS_STATIC_PREVIEW=true`
- [ ] Contenido revisado en `src/content/records.ts`
- [ ] Assets en `public/` commiteados

**Producción con CMS**

- [ ] `DATABASE_URL` + `PAYLOAD_SECRET` en Vercel
- [ ] `GABOS_STATIC_PREVIEW` eliminada o `false`
- [ ] `npm run seed` contra la DB de producción (una vez)
- [ ] Admin probado en `/admin`

**Shop con pago**

- [ ] Payload activo y productos con Price ID
- [ ] Variables Stripe + webhook según [stripe-setup.md](./stripe-setup.md)
