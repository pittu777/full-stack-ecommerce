# 🛒 Full-Stack E-Commerce Platform

A production-oriented, full-stack e-commerce application inspired by platforms such as Amazon and Flipkart.

The project is designed as a **modular monolith** using Next.js as both the frontend and backend. The architecture intentionally separates UI, client state, server actions, API routes, business logic, infrastructure integrations, database access, and external services.

The goal is not just to build screens. The goal is to build a realistic e-commerce system with:

- Authentication
- Product catalog
- Categories and brands
- Product variants
- Inventory management
- Search and filtering
- Cart
- Wishlist
- Checkout
- Coupons and promotions
- Payments
- Orders
- Shipments
- Returns and refunds
- Reviews
- Customer account
- Admin dashboard
- Notifications
- Background jobs
- Audit logs
- Testing
- Production-ready error handling and validation

---

# 1. Project Goals

## Primary Goal

Build a scalable, maintainable e-commerce platform where the frontend and backend live in the same Next.js application.

## Engineering Goals

The project should demonstrate:

1. Strong TypeScript usage
2. Next.js App Router architecture
3. Server Components and Client Components used intentionally
4. Redux Toolkit for client state
5. RTK Query for client-side server/API state
6. Prisma for database access
7. Supabase PostgreSQL as the database
8. Clerk for authentication
9. Proper service-layer architecture
10. Server Actions for internal mutations
11. Route Handlers for HTTP/webhook boundaries
12. Secure payment processing
13. Transaction-safe inventory and order logic
14. Feature-based modular organization
15. Unit, integration, and E2E testing
16. Production-oriented error handling and observability

---

# 2. Core Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

## State Management

- Redux Toolkit
- React Redux
- RTK Query

## Backend

- Next.js Server Actions
- Next.js Route Handlers
- Service layer
- Prisma ORM

## Database

- PostgreSQL
- Supabase
- Prisma

## Authentication

- Clerk

## Validation

- Zod
- React Hook Form
- @hookform/resolvers

## Payments

- Razorpay

## Search

- Meilisearch

## Background Jobs

- Inngest

## Email

- Resend

## Storage

- S3-compatible object storage / MinIO for local development when required

## Testing

- Vitest
- React Testing Library
- Playwright

## Observability

- Sentry
- PostHog

## Utilities

- date-fns
- decimal.js
- sonner
- clsx
- tailwind-merge

---

# 3. Architectural Style

This project uses a **modular monolith**.

We are intentionally NOT starting with microservices.

The application has clear domain boundaries so that individual modules can later be extracted if the system actually requires it.

High-level architecture:

```text
                         Browser
                            │
                            ▼
                      Next.js App
                            │
             ┌──────────────┴──────────────┐
             │                             │
       Server Components             Client Components
             │                             │
             │                       Redux Toolkit
             │                       RTK Query
             │                             │
             ▼                             ▼
       Server Actions                 API Routes
             │                             │
             └──────────────┬──────────────┘
                            ▼
                     Service Layer
                            │
                            ▼
                       Prisma ORM
                            │
                            ▼
                   Supabase PostgreSQL
```

External integrations:

```text
Razorpay
   │
   ▼
Payment Webhook
   │
   ▼
API Route
   │
   ▼
Payment Service
   │
   ▼
Prisma
   │
   ▼
PostgreSQL
```

---

# 4. Important Architecture Rules

These rules should be followed by every developer and coding agent.

## Rule 1 — Components must not directly access Prisma

❌ Do not:

```ts
import prisma from "@/lib/prisma";

const products = await prisma.product.findMany();
```

inside a reusable UI component.

Instead:

```text
Component
   ↓
Server Component / Server Action / API
   ↓
Service
   ↓
Prisma
   ↓
Database
```

---

## Rule 2 — Business logic belongs in services

Examples:

```text
services/cart.service.ts
services/checkout.service.ts
services/order.service.ts
services/payment.service.ts
services/inventory.service.ts
```

A service owns business rules.

For example, checkout service should be responsible for:

- validating the cart
- validating product availability
- validating stock
- calculating totals
- validating coupons
- calculating shipping
- creating payment records
- creating order records where appropriate
- coordinating inventory reservation

---

## Rule 3 — UI should not contain business rules

A component should render UI and handle user interaction.

Do not put:

- tax calculation
- payment verification
- inventory logic
- order creation
- authorization logic
- database queries

inside UI components.

---

## Rule 4 — Never trust client prices

The client can display:

```text
₹1,999
```

but the backend must calculate the final amount again.

Checkout must recalculate:

```text
Product price
× quantity
+ tax
+ shipping
- discount
= final amount
```

The frontend-provided total must never be treated as authoritative.

---

## Rule 5 — Payment confirmation comes from the verified payment flow

Never mark an order as paid only because the browser redirected to a success page.

Payment confirmation must be verified through the payment provider's server-side flow/webhook.

---

## Rule 6 — Use transactions for critical database operations

Examples:

- inventory reservation
- order creation
- stock updates
- refunds
- payment state transitions

---

## Rule 7 — Use TypeScript everywhere

Avoid:

```ts
any
```

unless there is a documented reason.

Prefer:

```ts
unknown
```

and narrow the value.

---

# 5. Folder Structure

The intended structure is:

```text
my-app/
│
├── .agents/
├── .claude/
├── .windsurf/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── assets/
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── src/
│   │
│   ├── app/
│   │   ├── (store)/
│   │   ├── (auth)/
│   │   ├── account/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── shared/
│   │   ├── product/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── order/
│   │   └── admin/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── cart/
│   │   ├── wishlist/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── payments/
│   │   ├── inventory/
│   │   ├── reviews/
│   │   ├── coupons/
│   │   └── users/
│   │
│   ├── store/
│   │   ├── index.ts
│   │   ├── provider.tsx
│   │   ├── hooks.ts
│   │   ├── slices/
│   │   └── services/
│   │
│   ├── services/
│   ├── actions/
│   ├── hooks/
│   ├── types/
│   ├── lib/
│   └── config/
│
├── .env
├── .env.example
├── .gitignore
├── prisma.config.ts
├── package.json
├── tsconfig.json
├── next.config.ts
├── components.json
├── eslint.config.mjs
└── README.md
```

---

# 6. `src/app` — Routing and Application Entry Points

`src/app` is responsible primarily for:

- routes
- layouts
- loading states
- error boundaries
- route-level metadata
- API route handlers

Do not turn `app` into the location for all business logic.

---

## `src/app/(store)`

Public shopping experience.

Example:

```text
(store)/
├── page.tsx
├── products/
├── categories/
├── search/
├── cart/
├── checkout/
└── orders/
```

The `(store)` folder is a Next.js route group.

It does not appear in the URL.

For example:

```text
src/app/(store)/products/page.tsx
```

maps to:

```text
/products
```

---

## `src/app/(auth)`

Authentication-related pages.

```text
(auth)/
├── login/
├── register/
├── forgot-password/
└── verify/
```

Clerk owns authentication mechanics.

Our application should not store passwords.

---

## `src/app/account`

Authenticated customer area.

```text
account/
├── page.tsx
├── orders/
├── addresses/
├── wishlist/
├── reviews/
├── profile/
└── settings/
```

This contains customer-facing account pages.

---

## `src/app/admin`

Admin application.

```text
admin/
├── page.tsx
├── products/
├── categories/
├── brands/
├── orders/
├── customers/
├── inventory/
├── coupons/
├── reviews/
├── returns/
└── analytics/
```

Admin routes must be protected by authorization.

Authentication alone is not enough.

---

## `src/app/api`

HTTP API boundaries.

Use Route Handlers for:

- payment webhooks
- external integrations
- public API endpoints
- search endpoints when required
- upload endpoints
- background-job endpoints

Example:

```text
api/
├── payments/
│   └── webhook/
│       └── route.ts
├── search/
│   └── route.ts
├── upload/
│   └── route.ts
└── inngest/
    └── route.ts
```

---

# 7. `src/components` — Reusable UI

This folder contains presentation-oriented React components.

## `components/ui`

shadcn/ui components.

Examples:

```text
button.tsx
dialog.tsx
input.tsx
select.tsx
table.tsx
sheet.tsx
dropdown-menu.tsx
```

Do not place business-specific logic here.

---

## `components/layout`

Application-wide layout components.

Examples:

```text
Header
Footer
DesktopNavigation
MobileNavigation
AccountSidebar
AdminSidebar
```

---

## `components/shared`

Generic reusable application components.

Examples:

```text
EmptyState
LoadingState
ErrorState
Pagination
ConfirmDialog
PriceDisplay
RatingStars
```

---

## `components/product`

Product-specific UI.

Examples:

```text
ProductCard
ProductGallery
ProductPrice
ProductRating
ProductVariantSelector
AddToCartButton
```

---

## `components/cart`

Cart-specific UI.

Examples:

```text
CartItem
CartSummary
CartDrawer
QuantitySelector
```

---

## `components/checkout`

Checkout UI.

Examples:

```text
AddressForm
ShippingSelector
CouponInput
CheckoutSummary
PaymentSelector
```

---

## `components/order`

Order-related presentation.

Examples:

```text
OrderCard
OrderStatus
OrderTimeline
OrderSummary
ShipmentTracking
```

---

## `components/admin`

Admin-specific UI.

Examples:

```text
AdminDataTable
StatsCard
RevenueChart
InventoryTable
```

---

# 8. `src/features` — Feature Modules

This directory contains feature-specific code that does not fit cleanly into generic shared components.

A feature can contain:

```text
features/products/
├── components/
├── schemas/
├── hooks/
├── types.ts
└── utils.ts
```

Use features when functionality becomes substantial.

The purpose is to keep related logic together.

---

# 9. `src/store` — Redux Toolkit

Redux Toolkit is the application's client-side state management system.

```text
store/
├── index.ts
├── provider.tsx
├── hooks.ts
├── slices/
└── services/
```

---

## `store/index.ts`

Creates and configures the Redux store.

Responsibilities:

- configure reducers
- configure middleware
- register RTK Query APIs

---

## `store/provider.tsx`

Provides Redux to the Next.js client component tree.

It should contain:

```tsx
<Provider store={store}>
  {children}
</Provider>
```

---

## `store/hooks.ts`

Typed Redux hooks.

Prefer typed hooks instead of repeating Redux types throughout components.

Example concept:

```ts
useAppDispatch()
useAppSelector()
```

---

## `store/slices`

Client-side application state.

Potential slices:

```text
cart.slice.ts
checkout.slice.ts
wishlist.slice.ts
ui.slice.ts
filters.slice.ts
```

Do not store every piece of application data in Redux.

---

## `store/services`

RTK Query API definitions.

Examples:

```text
products.api.ts
cart.api.ts
orders.api.ts
users.api.ts
reviews.api.ts
```

RTK Query should be used when client-side fetching/caching is actually needed.

Do not automatically use RTK Query for every Server Component query.

---

# 10. `src/services` — Backend Business Logic

This is one of the most important directories.

```text
services/
├── product.service.ts
├── cart.service.ts
├── checkout.service.ts
├── order.service.ts
├── payment.service.ts
├── inventory.service.ts
├── review.service.ts
└── user.service.ts
```

Services contain backend business rules.

Examples:

## `product.service.ts`

Responsibilities:

- product retrieval
- product creation
- product updates
- category relationships
- variant management
- product availability

## `cart.service.ts`

Responsibilities:

- create cart
- add item
- remove item
- update quantity
- merge guest cart
- validate cart

## `checkout.service.ts`

Responsibilities:

- validate cart
- validate inventory
- calculate totals
- apply coupon
- calculate shipping
- create checkout
- coordinate payment

## `order.service.ts`

Responsibilities:

- create order
- retrieve orders
- cancel order
- status transitions
- order history
- return/refund coordination

## `payment.service.ts`

Responsibilities:

- create payment
- verify payment
- payment state transitions
- refund
- payment provider abstraction

## `inventory.service.ts`

Responsibilities:

- stock availability
- reservation
- release reservation
- stock movement
- stock adjustment

---

# 11. `src/actions` — Server Actions

Server Actions are backend entry points intended primarily for our own Next.js frontend.

Examples:

```text
cart.actions.ts
checkout.actions.ts
order.actions.ts
product.actions.ts
address.actions.ts
```

Typical flow:

```text
Client Component
      ↓
Server Action
      ↓
Validation
      ↓
Authentication / Authorization
      ↓
Service
      ↓
Prisma
      ↓
PostgreSQL
```

Server Actions should be thin.

Do not put large business workflows directly inside action files.

---

# 12. `src/lib` — Infrastructure and Integrations

This directory contains infrastructure helpers and external integrations.

Potential files:

```text
lib/
├── prisma.ts
├── clerk.ts
├── razorpay.ts
├── meilisearch.ts
├── resend.ts
├── inngest.ts
├── storage.ts
├── validations/
├── constants/
└── utils.ts
```

---

## `lib/prisma.ts`

Single application-level Prisma client.

All application database access should go through the configured Prisma client.

---

## `lib/clerk.ts`

Clerk-related helper functions.

Examples:

- current user
- role helpers
- authorization helpers

---

## `lib/razorpay.ts`

Razorpay configuration/client integration.

Do not put complete payment business logic here.

Provider integration belongs here; payment decisions belong in `payment.service.ts`.

---

## `lib/meilisearch.ts`

Meilisearch client configuration.

Search business logic should remain outside this infrastructure file.

---

## `lib/resend.ts`

Email provider configuration.

Email templates/business events should be separated from the provider client.

---

## `lib/inngest.ts`

Inngest configuration and shared client.

Background workflows should live in appropriate feature/job modules.

---

## `lib/storage.ts`

Object storage abstraction.

Used for:

- product images
- review images
- documents
- invoices where required

---

# 13. `src/hooks`

Reusable React hooks.

Examples:

```text
use-cart.ts
use-auth.ts
use-debounce.ts
use-media-query.ts
```

Hooks should not become a dumping ground.

If a hook is specifically tied to one large feature, prefer keeping it inside that feature.

---

# 14. `src/types`

Shared TypeScript types.

Examples:

```text
product.ts
cart.ts
order.ts
payment.ts
user.ts
```

Do not duplicate types unnecessarily.

Prefer types generated by libraries/Prisma where appropriate.

---

# 15. `src/config`

Application configuration.

Examples:

```text
site.ts
navigation.ts
permissions.ts
```

Use this for static configuration rather than business logic.

---

# 16. `prisma/`

Database layer.

```text
prisma/
├── schema.prisma
├── seed.ts
└── migrations/
```

---

## `schema.prisma`

Defines the application's database models.

Expected domains include:

### Identity

```text
User
UserProfile
Address
```

### Catalog

```text
Product
ProductVariant
ProductImage
Category
Brand
ProductAttribute
ProductAttributeValue
```

### Shopping

```text
Cart
CartItem
Wishlist
WishlistItem
```

### Inventory

```text
Inventory
InventoryLocation
InventoryMovement
StockReservation
```

### Orders

```text
Order
OrderItem
OrderAddress
OrderStatusHistory
```

### Payments

```text
Payment
PaymentAttempt
Refund
```

### Shipping

```text
Shipment
ShipmentItem
TrackingEvent
```

### Marketing

```text
Coupon
CouponUsage
Promotion
```

### Reviews

```text
Review
ReviewImage
ReviewVote
```

### Notifications

```text
Notification
NotificationPreference
```

### Administration

```text
AuditLog
Role
Permission
```

The exact schema must be designed carefully before implementation.

---

## `prisma/migrations`

Migration history.

Never manually delete migration history casually.

Development:

```bash
npx prisma migrate dev --name <description>
```

Production:

```bash
npx prisma migrate deploy
```

---

## `prisma/seed.ts`

Development/demo data.

Potential seed data:

- categories
- brands
- products
- variants
- inventory
- test coupons
- test admin configuration

Never seed real production secrets or real customer information.

---

# 17. `public`

Static files that do not require database-backed storage.

Examples:

```text
public/
├── images/
├── icons/
└── assets/
```

Do not store user-uploaded product images here in production.

Use object storage for dynamic uploads.

---

# 18. Environment Variables

`.env` contains secrets and local configuration.

Example categories:

```env
DATABASE_URL=
DIRECT_URL=

NEXT_PUBLIC_APP_URL=

CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

MEILISEARCH_HOST=
MEILISEARCH_API_KEY=

RESEND_API_KEY=

SENTRY_DSN=

INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
```

Never commit `.env`.

Maintain:

```text
.env.example
```

with variable names but no secrets.

---

# 19. Authentication Architecture

Clerk owns:

- login
- registration
- authentication
- sessions
- password/security mechanisms
- supported OAuth providers

Our database owns:

- customer profile
- addresses
- orders
- cart
- wishlist
- reviews
- application-specific roles and data

Relationship:

```text
Clerk
  │
  │ clerkUserId
  ▼
Application User
  │
  ├── Profile
  ├── Address
  ├── Cart
  ├── Wishlist
  ├── Orders
  └── Reviews
```

Never store passwords in PostgreSQL.

---

# 20. State Management Rules

## Redux Toolkit

Use Redux for client-side state such as:

- cart UI state
- checkout UI state
- wishlist interaction
- filters
- modal/drawer state
- client preferences

## RTK Query

Use RTK Query for client-side server/API data when required:

- interactive product searches
- client-side filtering
- order refresh
- customer data refresh
- optimistic updates

## Server Components

Prefer Server Components for:

- product pages
- category pages
- SEO-sensitive catalog pages
- initial server-rendered data

Do not put all application data into Redux.

---

# 21. Data Flow Rules

## Server Component Read

```text
Server Component
      ↓
Service
      ↓
Prisma
      ↓
PostgreSQL
```

## Server Action Mutation

```text
Client Component
      ↓
Server Action
      ↓
Validation
      ↓
Authorization
      ↓
Service
      ↓
Prisma
      ↓
PostgreSQL
```

## RTK Query

```text
Client Component
      ↓
RTK Query
      ↓
Route Handler
      ↓
Service
      ↓
Prisma
      ↓
PostgreSQL
```

## External Webhook

```text
Payment Provider
      ↓
Route Handler
      ↓
Signature Verification
      ↓
Payment Service
      ↓
Prisma
      ↓
PostgreSQL
```

---

# 22. E-Commerce Domain Rules

## Product

A product can have multiple variants.

Example:

```text
Nike Shoe
├── Black / Size 8
├── Black / Size 9
├── Black / Size 10
├── White / Size 8
└── White / Size 9
```

Each sellable variant should have its own SKU and inventory.

---

## Cart

Support:

- guest cart
- authenticated cart
- cart merge after login
- quantity changes
- stock validation
- price revalidation

---

## Checkout

Never trust frontend totals.

Backend recalculates:

```text
Subtotal
+ Tax
+ Shipping
- Discount
= Total
```

---

## Inventory

Inventory should support:

- available stock
- reserved stock
- sold stock
- stock movements
- reservations
- releases

Avoid simple unchecked:

```text
stock--
```

logic for concurrent purchases.

---

## Orders

Order state should be explicit.

Example:

```text
PENDING_PAYMENT
PAYMENT_FAILED
CONFIRMED
PROCESSING
PACKED
SHIPPED
OUT_FOR_DELIVERY
DELIVERED
CANCELLED
RETURN_REQUESTED
RETURN_APPROVED
RETURNED
REFUND_PENDING
REFUNDED
```

The exact state machine should be documented before implementation.

---

# 23. Payment Architecture

Payments should be abstracted behind a provider interface.

Conceptually:

```ts
interface PaymentProvider {
  createPayment(): Promise<unknown>;
  verifyPayment(): Promise<unknown>;
  refundPayment(): Promise<unknown>;
}
```

Razorpay becomes an implementation.

This prevents payment-provider-specific code from spreading throughout the application.

Payment flow:

```text
Checkout
   ↓
Validate cart
   ↓
Validate inventory
   ↓
Calculate totals
   ↓
Create payment
   ↓
Razorpay
   ↓
Customer pays
   ↓
Webhook
   ↓
Verify signature/payment
   ↓
Update payment
   ↓
Confirm order
   ↓
Update inventory
```

---

# 24. Search Architecture

Initially, PostgreSQL can handle:

- category filters
- brand filters
- price ranges
- sorting
- availability

Meilisearch can later provide:

- full-text search
- typo tolerance
- autocomplete
- ranking
- faceted search

Do not introduce Meilisearch until the basic catalog works.

---

# 25. Background Jobs

Inngest can handle asynchronous workflows.

Examples:

```text
Order created
    ├── Send email
    ├── Generate invoice
    ├── Notify admin
    └── Start fulfillment workflow
```

Background jobs should be retryable and idempotent.

---

# 26. Testing Strategy

## Unit Tests

Test pure business logic:

```text
calculateCartTotal()
calculateDiscount()
calculateShipping()
validateCoupon()
calculateTax()
```

## Integration Tests

Test:

```text
service → Prisma → database
```

for critical workflows.

## E2E Tests

The primary golden path:

```text
Register/Login
   ↓
Browse products
   ↓
Product details
   ↓
Add to cart
   ↓
Checkout
   ↓
Payment
   ↓
Order confirmation
   ↓
Order history
```

---

# 27. Security Requirements

Always consider:

- authentication
- authorization
- server-side validation
- rate limiting
- webhook signature verification
- secure cookies/session handling
- environment secrets
- SQL/ORM safety
- XSS prevention
- CSRF considerations
- audit logging
- idempotency
- inventory race conditions
- payment replay protection

Never expose:

```text
CLERK_SECRET_KEY
DATABASE_URL
RAZORPAY_KEY_SECRET
RESEND_API_KEY
```

to the browser.

Only variables intentionally prefixed for public exposure should be available client-side.

---

# 28. Database Development Workflow

## Format

```bash
npx prisma format
```

## Validate

```bash
npx prisma validate
```

## Create migration

```bash
npx prisma migrate dev --name <description>
```

Example:

```bash
npx prisma migrate dev --name create_products
```

## Generate Prisma Client

```bash
npx prisma generate
```

## Check migrations

```bash
npx prisma migrate status
```

## Open Prisma Studio

```bash
npx prisma studio
```

## Reset development database

```bash
npx prisma migrate reset
```

Use only during development.

## Deploy migrations

```bash
npx prisma migrate deploy
```

Production only.

---

# 29. Important Prisma/Supabase Configuration

This project uses a modern Prisma configuration with:

```text
prisma.config.ts
```

The current project setup uses:

```text
DATABASE_URL
DIRECT_URL
```

The Prisma CLI should use the appropriate direct/session connection when required for database administration and migrations, while application runtime can use the pooled connection when appropriate.

Do not blindly copy configuration from older Prisma tutorials.

Always check the installed Prisma version and current project configuration before changing Prisma setup.

---

# 30. Coding Agent Instructions

Any AI coding agent working on this project must follow these rules.

## Before changing code

1. Inspect the existing architecture.
2. Inspect related feature files.
3. Inspect Prisma schema before database-related changes.
4. Inspect Redux state before adding new global state.
5. Reuse existing components/utilities.
6. Do not introduce a new library without a clear reason.

## Before adding a component

Ask:

```text
Can an existing component be reused?
Can shadcn/ui solve this?
Is this component generic or feature-specific?
```

## Before adding Redux state

Ask:

```text
Does this state need to be shared?
Is it actually client state?
Can Server Components handle it?
Should RTK Query own this data?
```

## Before adding an API route

Ask:

```text
Does this need an HTTP endpoint?
Could a Server Action handle it?
Is an external service calling this endpoint?
```

## Before database changes

1. Update `schema.prisma`.
2. Run formatting.
3. Validate schema.
4. Create a migration.
5. Review the migration.
6. Generate Prisma Client if required.
7. Update affected services.
8. Test affected workflows.

---

# 31. Naming Conventions

## Files

Prefer:

```text
product-card.tsx
cart.service.ts
cart.actions.ts
cart.slice.ts
products.api.ts
```

Use kebab-case for filenames.

## React Components

PascalCase:

```tsx
ProductCard
CartSummary
CheckoutForm
```

## Functions

camelCase:

```ts
getProductBySlug()
createOrder()
calculateCartTotal()
```

## Database models

Use Prisma's standard PascalCase model names:

```prisma
model Product {}
model ProductVariant {}
model Order {}
```

## Database fields

Use camelCase:

```prisma
createdAt
updatedAt
productId
userId
```

---

# 32. Error Handling

Do not silently swallow errors.

Bad:

```ts
try {
  await createOrder();
} catch {
}
```

Prefer:

```ts
try {
  await createOrder();
} catch (error) {
  // log/report error
  // return safe user-facing result
}
```

Internal errors should not expose secrets or implementation details.

The UI should receive safe messages.

---

# 33. Loading and Error UI

Important routes should have:

```text
loading.tsx
error.tsx
not-found.tsx
```

Use:

- skeletons for loading
- meaningful empty states
- retry actions where appropriate
- useful error messages

Avoid showing raw server errors to customers.

---

# 34. Performance Principles

Use:

- Server Components by default
- Client Components only where interaction requires them
- Next.js image optimization
- pagination
- database indexes
- selective Prisma queries
- caching where appropriate
- lazy loading
- code splitting
- efficient search
- optimized product images

Do not prematurely cache everything.

---

# 35. SEO

Product and category pages should eventually support:

- metadata
- Open Graph
- canonical URLs
- structured product data
- sitemap
- robots.txt
- SEO-friendly slugs

Example:

```text
/products/iphone-17-pro
/categories/mobile-phones
```

Prefer stable, human-readable URLs.

---

# 36. Development Principles

## Keep services small

Prefer:

```text
checkout.service.ts
payment.service.ts
inventory.service.ts
```

over one giant:

```text
ecommerce.service.ts
```

## Avoid circular dependencies

For example:

```text
product → order → product
```

should be avoided.

## Avoid god components

Don't create:

```text
MegaDashboard.tsx
MegaCheckout.tsx
MegaProductPage.tsx
```

Break them into focused components.

## Avoid premature abstraction

Don't create an abstraction until there is a real reason to reuse or isolate it.

---

# 37. Recommended Implementation Order

Do not build features randomly.

Follow this order:

## Phase 1 — Foundation

- Next.js
- TypeScript
- Tailwind
- shadcn/ui
- Clerk
- Redux Toolkit
- RTK Query
- Prisma
- Supabase

## Phase 2 — Database

- User
- Product
- Category
- Brand
- ProductVariant
- ProductImage
- Inventory
- Cart
- Wishlist
- Address

## Phase 3 — Authentication

- login
- register
- protected routes
- customer profile

## Phase 4 — Catalog

- homepage
- categories
- product listing
- product detail
- variants
- filters
- sorting

## Phase 5 — Cart

- add
- remove
- quantity
- guest cart
- authenticated cart
- cart merge

## Phase 6 — Checkout

- address
- shipping
- coupon
- totals
- validation

## Phase 7 — Payments

- Razorpay
- payment creation
- verification
- webhook
- failure/retry

## Phase 8 — Orders

- order creation
- history
- details
- cancellation
- shipment
- returns
- refunds

## Phase 9 — Admin

- dashboard
- products
- orders
- inventory
- customers
- coupons
- reviews
- analytics

## Phase 10 — Advanced Infrastructure

- Meilisearch
- Inngest
- Resend
- storage
- Sentry
- PostHog

## Phase 11 — Testing

- unit
- integration
- E2E

## Phase 12 — Production

- security
- performance
- monitoring
- CI/CD
- deployment

---

# 38. What We Should NOT Do

Do not:

- add Express just because Next.js is the backend
- add Redux for every value
- put Prisma queries inside components
- trust frontend prices
- store passwords
- mark orders paid from the browser
- use `any` everywhere
- create duplicate utilities
- create unnecessary API routes
- create microservices prematurely
- commit `.env`
- use production database reset commands
- introduce dependencies without a reason
- copy outdated Next.js/Prisma tutorials without checking compatibility

---

# 39. Definition of Done

A feature is not considered complete merely because its page renders.

For a typical feature:

```text
UI
 ↓
Validation
 ↓
Authentication
 ↓
Authorization
 ↓
Server Action/API
 ↓
Service
 ↓
Prisma
 ↓
Database
 ↓
Error handling
 ↓
Loading state
 ↓
Empty state
 ↓
Testing
```

For payment/order functionality additionally:

```text
Idempotency
Webhook verification
Transactions
Failure handling
Retry behavior
Auditability
```

---

# 40. Current Project Status

At the beginning of development:

- Next.js project created
- TypeScript enabled
- Tailwind/shadcn foundation created
- Prisma initialized
- Supabase PostgreSQL project created
- Prisma connection verified
- Database currently has no application tables
- Prisma 7-style configuration is being used
- Redux Toolkit is the chosen global client-state solution
- RTK Query is the chosen API/cache layer

The next major task is to design the **production-grade Prisma ecommerce schema** before implementing the main application features.

---

# 41. Golden Architecture

When in doubt, use this flow:

```text
                         USER
                           │
                           ▼
                    Next.js UI
                           │
             ┌─────────────┴─────────────┐
             │                           │
      Server Component             Client Component
             │                           │
             ▼                           ▼
          Service                 Redux / RTK Query
             │                           │
             │                           ▼
             │                       API Route
             │                           │
             └─────────────┬─────────────┘
                           ▼
                        Service
                           │
                           ▼
                         Prisma
                           │
                           ▼
                   Supabase PostgreSQL
```

External services:

```text
Clerk       → Authentication
Razorpay    → Payments
Meilisearch → Search
Inngest     → Background jobs
Resend      → Email
S3/MinIO    → File storage
Sentry      → Error monitoring
PostHog     → Product analytics
```

---

# 42. Final Principle

The application should be **simple at the boundaries and strict at the core**.

UI should be easy to change.

Services should contain business rules.

Prisma should handle persistence.

PostgreSQL should enforce data integrity.

External integrations should be isolated behind adapters.

Redux should handle only client state.

RTK Query should handle client-side API state.

Server Components should be preferred for server-rendered data.

Every critical business operation should be validated on the server.

The architecture should support the current application without prematurely optimizing for a scale we do not yet have.
