# Billing Lifecycle — lalabits.art Phase 1

> **Status:** Approved
> **Version:** v1.0
> **Scope:** Phase 1 MVP
> **Authority level:** Canonical
>
> **Authority files:** CLAUDE.md · page-requirements.md · permission-matrix.md ·
> data-model.md · api-surface.md
>
> **Scope:** This document defines the canonical Phase 1 billing and entitlement lifecycle.
> It does not contain payment gateway integration code, webhook handler code, SQL, or ORM
> definitions.

---

## 1. Document Purpose

This document defines the canonical Phase 1 billing and entitlement lifecycle for
lalabits.art. It is derived from:

- `data-model.md` — entities (Order, Invoice, MembershipSubscription, ProductPurchase,
  CollectionPurchase, PostPurchase), state machines (§4.5–§4.6), entitlement rules (§6)
- `api-surface.md` — checkout flows (§7.2–§7.5), webhook surface (§8)
- `permission-matrix.md` — role and entitlement state definitions
- `page-requirements.md` — fan-facing UX expectations for checkout, billing, cancellation

**Does not contain:**
- Payment gateway integration code
- Webhook handler code
- SQL, ORM, or schema definitions
- OpenAPI/YAML or DTO definitions

**Is the basis for:**
- Backend billing module implementation
- Checkout and payment gateway integration
- Subscription state machine implementation
- Entitlement service implementation
- Notification event trigger mapping
- Fan-facing billing UI state derivation

---

## 2. Lifecycle Design Principles

Eight principles govern Phase 1 billing.

**1. Checkout attempt is separate from entitlement activation.** Creating an `Order` does
not grant any access. Access is granted only when `MembershipSubscription` is created active
(by webhook) or a purchase record exists with `access_revoked_at IS NULL`.

**2. Billing state is separate from subscription entitlement state.** `Order.status` tracks
the payment transaction lifecycle. `MembershipSubscription.status` tracks the subscription
service lifecycle. Entitlement is evaluated from subscription/purchase records, not from Order
or Invoice directly.

**3. Webhook/event confirmation is the source of truth for payment outcomes.**
`MembershipSubscription` creation, `ProductPurchase` creation, period date updates, and
invoice records are all driven by gateway webhook events. Client-side UI receives outcome by
polling `GET /checkout/orders/:order-id`. The webhook is authoritative; the UI reflects it.

**4. User-visible status must not conflict with internal state.** What a fan sees in
`/account/uyeliklerim` (e.g., "Aktif", "İptal Edildi", "Erişim sona erdi") must be derived
deterministically from `MembershipSubscription.status` and period date fields. No separate
display-status field exists.

**5. Cancellation timing is explicit and end-of-period.** Cancellation does not revoke access
immediately. Status transitions to `cancelled` on the API call, but entitlement remains valid
through `current_period_end`. Entitlement check: `status = cancelled AND
current_period_end > NOW()` → access granted.

**6. Grace-period rules are explicit and config-driven.** When renewal fails, the system
enters a defined grace window (`grace_period_ends_at = NOW() + GRACE_DURATION_CONFIG`). During
this window, access is retained. At expiry, status → `expired` and access is revoked. The
grace duration is a configuration value, not hard-coded. (Open decision B1)

**7. Admin moderation overrides all billing-based entitlement.** `moderation_status = removed`
on any content item or `CreatorProfile.status = suspended` revokes access regardless of
subscription status, purchase records, or any billing state. Moderation checks precede
entitlement checks in the authorization stack.

**8. Do not over-design refunds and disputes for Phase 1.** Refund and dispute handling is
deferred. Phase 1 billing is append-only from the platform's perspective: invoices are created,
not reversed through platform UI. Gateway handles disputes directly at launch.

---

## 3. Billing Scope Summary

**Flows in scope:**

| Flow | Entry Point | Key Output |
|---|---|---|
| Membership checkout | `POST /checkout/membership` | Order (pending) → webhook → MembershipSubscription (active) + Invoice |
| Product checkout | `POST /checkout/product` | Order (pending) → webhook → ProductPurchase + Invoice |
| Collection checkout | `POST /checkout/collection` | Order (pending) → webhook → CollectionPurchase + Invoice |
| Premium post purchase | `POST /checkout/post` (UI deferred) | Order (pending) → webhook → PostPurchase + Invoice |
| Subscription renewal | Gateway-initiated | Invoice (renewal) → period update or grace_period |
| Cancellation | `POST /account/subscriptions/:id/cancel` | status → cancelled; access to period end |
| Grace period | Renewal failure webhook | grace_period_ends_at set; fan notified; retry possible |
| Re-subscribe | `POST /checkout/membership` (after expiry) | New Order → new MembershipSubscription |
| Payment method update | `PUT /account/billing/payment-method` | PaymentMethodSummary updated; optional retry trigger |

**Billing objects in scope:**

| Object | Purpose |
|---|---|
| Order | Payment transaction attempt record |
| Invoice | Completed or failed billing event record |
| MembershipSubscription | Recurring subscription lifecycle record |
| ProductPurchase | One-time product entitlement record |
| CollectionPurchase | One-time collection entitlement record |
| PostPurchase | One-time premium post entitlement record |
| BillingCustomer | Fan's gateway customer reference |
| PaymentMethodSummary | Fan's saved payment method display data (no raw card data) |

**Explicitly out of scope at Phase 1:** Refunds, chargeback handling UI, admin billing
operations, payout settlement, tax engine, affiliate revenue share, tier upgrade/downgrade
prorations, subscription pause.

---

## 4. Core Billing Entities in Lifecycle Terms

### 4.1 Order

**Role:** Records a single payment attempt. Is the synchronous response object returned to the
fan at checkout. Used by confirmation and error pages.

**Created when:** Fan calls any checkout endpoint. One Order per initiation. `BillingCustomer`
created at same time if fan's first transaction.

**State changes:**
- `pending` → `completed`: `payment_succeeded` webhook
- `pending` → `failed`: `payment_failed` webhook
- `completed` → `refunded`: refund processed (deferred at MVP)

**Unlocks / affects:** `order.status = completed` triggers creation of the corresponding
purchase record (MembershipSubscription / ProductPurchase / CollectionPurchase / PostPurchase)
plus one Invoice. `GET /checkout/orders/:order-id` determines which outcome page is shown.

**Does NOT belong:** Entitlement state; Invoice data; subscription period dates.

---

### 4.2 Invoice

**Role:** Records every completed billing event — initial charge, renewal, failed renewal.
Powers fan billing history (`/account/fatura`).

**Created when:** Gateway webhook received for payment success, renewal success, renewal
failure. One Invoice per billing event.

**State changes:** Not updated after creation. `status` is set at creation time (`paid`,
`failed`, or `refunded`).

**Unlocks / affects:** Fan billing history display; creator revenue aggregates (paid invoices
only). `invoice_type = one_time_purchase` covers product, collection, and premium post
purchases; `order.order_type` provides type distinction if needed.

**Does NOT belong:** Raw card data; subscription entitlement state; admin moderation
information.

---

### 4.3 MembershipSubscription

**Role:** Central record of a fan's recurring subscription to a creator's tier. Determines
all tier-based entitlement.

**Created when:** Gateway `payment_succeeded` webhook received for a membership checkout.
Created with `status = active` directly. Checkout initiation (the API call) does NOT create
this record. (api-surface.md §7.2; Section 4 Family 14)

**Note:** `status = pending` exists in the data model enum and state machine for potential
future use. In Phase 1 per the approved api-surface.md, the subscription is created active by
the webhook. `pending` is not used in the nominal checkout flow.

**State transitions (data-model.md §4.5):**

```
[pending]      ---(payment_succeeded webhook)-----------> [active]    (N/A in Phase 1 nominal)
[active]       ---(fan cancels via API)-----------------> [cancelled]
[active]       ---(renewal payment_failed webhook)------> [grace_period]
[cancelled]    ---(current_period_end passes)-----------> [expired]   (scheduled job)
[grace_period] ---(payment retry payment_succeeded)-----> [active]
[grace_period] ---(grace_period_ends_at passes)---------> [expired]   (scheduled job)
[expired]      ---(fan re-subscribes, new checkout)-----> [active]    (new record)
```

**Unlocks / affects:**
- `active` → full tier entitlement
- `cancelled` + `current_period_end > NOW()` → access continues
- `grace_period` + `grace_period_ends_at > NOW()` → access retained
- `expired` → no entitlement; library locked; member count decrements

**Does NOT belong:** Payment transaction data; raw card data; creator earnings.

---

### 4.4 ProductPurchase

**Role:** Immutable entitlement record for a fan's one-time product purchase.

**Created when:** `payment_succeeded` webhook for a product checkout Order.

**State changes:** No status field. `access_revoked_at IS NULL` → access valid.
`access_revoked_at IS NOT NULL` → access revoked (D1 Option A policy).

**Unlocks:** Fan can call `GET /products/:id/signed-url` → signed download URL. Fan sees
product in library and purchases list.

**Does NOT belong:** Payment data; product publish status.

---

### 4.5 CollectionPurchase

**Role:** Immutable entitlement record for a fan's one-time collection purchase. Applies only
to `Collection.access_type = purchase` collections. `access_type = tier_gated` uses
MembershipSubscription entitlement.

**Created when:** `payment_succeeded` webhook for a collection checkout Order.

**State changes:** Same `access_revoked_at` pattern as ProductPurchase.

**Unlocks:** Fan can access all items within the collection (subject to individual item
moderation/publish state).

**Does NOT belong:** Tier-gated collection access (governed by MembershipSubscription).

---

### 4.6 PostPurchase

**Role:** Immutable entitlement record for a one-time premium post purchase. Entity modeled
in data-model.md; checkout UI is deferred.

**Created when:** `payment_succeeded` webhook for a premium post Order
(`order_type = premium_post_purchase`).

**State changes:** Same `access_revoked_at` pattern.

**Unlocks:** Fan can access full premium post content and attachments.

---

### 4.7 Billing-Related Notification Events

| Event type | Trigger | Recipient |
|---|---|---|
| `order_confirmed` | `payment_succeeded` webhook (any checkout type) | Fan |
| `membership_renewal_success` | Renewal `payment_succeeded` webhook | Fan |
| `membership_renewal_failed` | Renewal `payment_failed` webhook | Fan |
| `membership_cancelled_confirmed` | `POST /account/subscriptions/:id/cancel` | Fan |
| `membership_expired` | Scheduled job (period end or grace expiry) | Fan |

Creator notification on new subscription (B10 — open decision; not in current approved set).

---

### 4.8 ConsentRecord and Legal Dependencies

`ConsentRecord` is not a billing entity but has billing-adjacent pre-conditions:

- Fan must have accepted `terms_of_service` at registration to reach checkout
- Checkout does NOT create a `ConsentRecord` — it was created at registration
- Email verification gate: `User.email_verified_at IS NOT NULL` required for checkout.
  Returns `403 UNVERIFIED_EMAIL` before any Order is created if not verified.
- Creator agreement acceptance (`ConsentRecord` for `creator_agreement`) is created at
  onboarding submission and is a pre-condition for creator approval and payment receipt.

---

## 5. Membership Billing Lifecycle

### 5.1 Checkout Initiation

**Pre-conditions (enforced by API):**
- Fan authenticated; `account_status = active`; `email_verified_at IS NOT NULL`
- Target creator: `CreatorProfile.status = approved`
- Target plan: `MembershipPlan.status = published`
- No existing non-expired subscription to this tier (`SUBSCRIPTION_EXISTS` if
  `status IN (active, cancelled, grace_period)`)

**Steps:**
1. Fan selects tier + billing interval on `/checkout/uyelik/[creator-username]/[tier-id]`
2. Fan submits `POST /checkout/membership` → `{creator_username, plan_id, billing_interval}`
3. Server: creates `BillingCustomer` if first transaction
4. Server: creates `Order` (`status = pending`, `order_type = membership_checkout`)
5. Server: calls payment gateway → payment intent returned
6. Response: `{order_id, payment_intent, gateway_form_config}`
7. Fan: interacts with gateway UI

**State after initiation:** `Order.status = pending`; no `MembershipSubscription` exists.

---

### 5.2 Payment Pending State

While fan interacts with gateway form:
- `Order.status = pending`
- No subscription, no invoice, no entitlement
- Fan can abandon; no cleanup required immediately
- Pending Orders cleaned up by scheduled reconciliation job after timeout (open decision B6)

---

### 5.3 Successful Payment Confirmation (Webhook: payment_succeeded)

**Trigger:** Gateway sends `payment_succeeded` event to `POST /webhooks/billing`

**Server actions (atomic where possible):**
1. Validate gateway signature
2. Check `event_id` for idempotency — if already processed → 200 no-op
3. `Order.status → completed`; `Order.completed_at = now()`; `Order.gateway_transaction_id`
   stored
4. Create `MembershipSubscription`:
   - `status = active`
   - `current_period_start = now()`
   - `current_period_end = now() + 1 month` (monthly) or `now() + 12 months` (annual)
   - `billing_interval` from checkout request
   - `gateway_subscription_id` from gateway
5. Create `Invoice` (`invoice_type = subscription_charge`, `status = paid`, `paid_at = now()`)
6. Create `Notification` (`order_confirmed`) for fan

**Fan state:** `Order.status = completed`; `MembershipSubscription.status = active`; full tier
entitlement active. `GET /checkout/orders/:order-id` → `completed` → frontend shows
`/checkout/onay/[order-id]`.

---

### 5.4 Failed Initial Payment (Webhook: payment_failed)

**Server actions:**
1. Validate signature; look up Order
2. `Order.status → failed`
3. No `MembershipSubscription` created
4. No `Invoice` created (no charge occurred)

**Fan state:** `Order.status = failed`. `GET /checkout/orders/:order-id` → `failed` →
frontend shows `/checkout/hata/[order-id]`. Fan can retry with new checkout initiation.

---

### 5.5 Subscription Renewal (Webhook: renewal payment_succeeded)

**Trigger:** Gateway initiates renewal at `current_period_end`; `payment_succeeded` webhook
sent. Gateway manages renewal schedule using `gateway_subscription_id`.

**Server actions:**
1. Look up `MembershipSubscription` by `gateway_subscription_id`
2. `current_period_start = new_period_start`; `current_period_end = new_period_end`
3. Create `Invoice` (`invoice_type = subscription_renewal`, `status = paid`)
4. Create `Notification` (`membership_renewal_success`) for fan

**Fan state:** Subscription continues; UI unchanged from active.

---

### 5.6 Renewal Failure (Webhook: renewal payment_failed)

**Server actions:**
1. Look up `MembershipSubscription` by `gateway_subscription_id`
2. `MembershipSubscription.status → grace_period`
3. `grace_period_ends_at = now() + GRACE_DURATION_CONFIG` (open decision B1)
4. Create `Invoice` (`invoice_type = subscription_renewal`, `status = failed`)
5. Create `Notification` (`membership_renewal_failed`) for fan

**Fan state:** Access retained while `grace_period_ends_at > NOW()`. Fan sees renewal failure
banner with "Ödeme yöntemini güncelle" CTA in billing section.

---

### 5.7 Grace Period Resolution

**Success path (payment retry succeeds):**
1. `payment_succeeded` webhook received
2. `status → active`; `grace_period_ends_at` cleared
3. New period dates set
4. `Invoice` (`subscription_renewal`, `paid`) created
5. `Notification` (`membership_renewal_success`)

**Failure path (grace period expires — scheduled job):**
1. Detected: `grace_period_ends_at < NOW()` AND `status = grace_period`
2. `status → expired`
3. `Notification` (`membership_expired`)
4. Fan loses all tier entitlement immediately

---

### 5.8 User Cancellation

**Steps:**
1. Fan: `GET /account/subscriptions/:id/cancellation-preview` → `current_period_end` displayed
2. Fan: confirms on consequence disclosure page (`/uyelik/[membership-id]/iptal`)
3. Fan: `POST /account/subscriptions/:id/cancel` (optional `cancellation_reason`)

**Server actions:**
1. Validate ownership + `status = active`
2. `MembershipSubscription.status → cancelled`
3. `cancelled_at = now()`; `cancellation_reason` stored if provided
4. Platform signals gateway to cancel future renewal scheduling
5. Create `Notification` (`membership_cancelled_confirmed`)

**Idempotency:** Re-submitting on `status = cancelled` → returns 200 with existing
`cancelled_at`; no error; no duplicate notification.

**Fan state after cancellation:** `status = cancelled`; access continues until
`current_period_end`. UI shows "İptal Edildi — Erişiminiz [tarih] tarihine kadar devam eder".
Re-subscribe CTA available.

---

### 5.9 End-of-Period Access Revocation (Scheduled Job)

**Condition:** `status = cancelled AND current_period_end < NOW()`

**Server actions:**
1. `status → expired`
2. `Notification` (`membership_expired`) for fan (open decision B8)

**Fan state:** No entitlement; library content locked; gated posts show paywall.

---

### 5.10 Re-subscribe After Expiry

1. Fan: `POST /checkout/membership` (same tier)
2. `SUBSCRIPTION_EXISTS` check: not triggered for `status = expired` (only
   `active`/`cancelled`/`grace_period` states block re-subscribe)
3. New `Order` created (`pending`)
4. Webhook: new `MembershipSubscription` created (NEW record; prior expired record retained
   for history)
5. Two records exist for same fan + tier: one expired, one active

---

### 5.11 Membership Lifecycle State Summary Table

| Status | Entitlement | Billing active | Exit condition |
|---|---|---|---|
| `pending` | None | Awaiting | `payment_succeeded` webhook → `active` (N/A in Phase 1 nominal flow) |
| `active` | Full tier access | Renewing | Fan cancels → `cancelled`; Renewal fails → `grace_period` |
| `cancelled` | Access until `current_period_end` | Stopped | Period end passes → `expired` |
| `grace_period` | Access until `grace_period_ends_at` | Retrying | Retry succeeds → `active`; Grace expires → `expired` |
| `expired` | None | Stopped | Re-subscribe → new `active` record |

---

## 6. One-Time Purchase Lifecycles

### 6.1 Product Purchase Lifecycle

**Checkout initiation:**
1. `POST /checkout/product` → `{product_id}`
2. Pre-conditions: fan authenticated + email verified; product `publish_status = published` +
   `moderation_status != removed`
3. Duplicate guard: existing `ProductPurchase` for same fan + product → `409 ALREADY_PURCHASED`
4. `Order` created (`pending`, `order_type = product_purchase`)
5. Response: `order_id + payment_intent`

**Payment success (webhook):**
1. `Order.status → completed`
2. `ProductPurchase` created (`fan_user_id`, `product_id`, `order_id`,
   `access_revoked_at = NULL`, `purchased_at = now()`)
3. `Invoice` (`invoice_type = one_time_purchase`, `status = paid`)
4. `Notification` (`order_confirmed`)

**Payment failure:** `Order → failed`; no `ProductPurchase`; no `Invoice`.

**Entitlement:** `ProductPurchase` exists + `access_revoked_at IS NULL` →
`GET /products/:id/signed-url` returns signed download URL. Fan sees product in library.

**Creator unpublish interaction (Decision D1 — unresolved):**
- Option A: set `access_revoked_at = now()` on all existing `ProductPurchase` records →
  prior purchasers lose access
- Option B: leave `access_revoked_at = NULL` → prior purchasers retain access; new purchases
  blocked
- D1 must be resolved before launch (Section 12, B2)

**Moderation removal:** `moderation_status = removed` → signed URL requests return `403` or
`404` regardless of `ProductPurchase.access_revoked_at`. Moderation override is absolute.

---

### 6.2 Collection Purchase Lifecycle

Same pattern as §6.1 with these differences:

- `order_type = collection_purchase`; entitlement record: `CollectionPurchase`
- Applies only to `Collection.access_type = purchase` collections
- `access_type = tier_gated` collections: entitlement from MembershipSubscription, not
  CollectionPurchase
- Collection items with `moderation_status = removed` are inaccessible within the purchased
  collection even though the collection itself is purchased
- D1 open decision applies to `CollectionPurchase.access_revoked_at`

---

### 6.3 Premium Post Purchase Lifecycle

**Scope:** Entity (`PostPurchase`) and `order_type = premium_post_purchase` are modeled in
data-model.md. Checkout UI is deferred per page-requirements-outline.md. This lifecycle is
documented for backend planning completeness. Do not implement the checkout UI until
explicitly requested.

**Flow (when implemented):**
1. `POST /checkout/post` → `{post_id}`
2. `post.access_level = premium` + `publish_status = published` +
   `moderation_status != removed`
3. `Order` created (`order_type = premium_post_purchase`)
4. Webhook: `Order → completed`; `PostPurchase` created; `Invoice`; `Notification`

**Entitlement:** `PostPurchase` exists + `access_revoked_at IS NULL` → fan accesses full post
content and attachments.

D1 open decision applies to `PostPurchase.access_revoked_at`.

---

## 7. Cancellation and Grace-Period Rules

### 7.1 What Happens Immediately on Cancellation

| | What changes | What does NOT change |
|---|---|---|
| MembershipSubscription | `status → cancelled`; `cancelled_at = now()` | `current_period_end`; entitlement |
| Fan-visible UI | "İptal Edildi — Erişim devam eder [tarih]" | Access to posts, library, downloads |
| Gateway | Future renewal scheduling cancelled | No in-period charge affected |

### 7.2 What Remains Active Until Period End

After `status = cancelled`:
- Tier-gated and member-only post access: retained
- Tier-gated collection access: retained
- Library content via this subscription: retained
- Renewal notifications: none

Entitlement check: `status = cancelled AND current_period_end > NOW()`

### 7.3 Grace Period Trigger Conditions

Grace period is triggered exclusively by renewal payment failure:
- Fan cancellation does NOT create a grace period (goes directly to `cancelled`)
- Manual admin actions do NOT create a grace period
- Only gateway renewal `payment_failed` webhook triggers `status → grace_period`

### 7.4 Grace Period End Behavior

**Resolution (success):** `status → active`; `grace_period_ends_at` cleared; new period
dates; Invoice; Notification.

**No resolution (expiry):** scheduled job → `status → expired`; Notification; access revoked.

### 7.5 Annual Plan Cancellation

Same end-of-period behavior as monthly:
- Access continues to annual `current_period_end` (up to ~12 months from subscription start)
- No prorated refund at Phase 1 MVP
- Fan sees: "Erişiminiz [annual period end date] tarihine kadar devam eder"
- KVKK / Turkish consumer protection implications flagged for legal review (open decision B3)

### 7.6 Status Semantic Distinctions

| Status | Entitlement | Billing | Fan-visible label |
|---|---|---|---|
| `active` | Full tier access | Renewal pending | "Aktif" |
| `cancelled` | Access until `current_period_end` | No further charges | "İptal Edildi" + access-until date |
| `grace_period` | Access until `grace_period_ends_at` | Retry active | "Ödeme Bekleniyor" + update CTA |
| `expired` | None | No charges | "Sona Erdi" + re-subscribe CTA |

---

## 8. Webhook / Async Reconciliation Lifecycle

### 8.1 Why Billing Confirmation Is Async

Payment gateway card authorization is not instantaneous. The gateway's hosted form handles
the fan payment interaction outside the platform's synchronous request flow. The checkout API
returns a `payment_intent`; the gateway presents its UI; the gateway processes the charge and
sends a signed webhook to confirm or deny the outcome.

### 8.2 Source-of-Truth Events

The gateway webhook is the authoritative source for all payment outcomes.

| Webhook event | Server action |
|---|---|
| `payment_succeeded` (initial membership checkout) | Order → completed; MembershipSubscription created (active); Invoice; Notification |
| `payment_succeeded` (initial product checkout) | Order → completed; ProductPurchase; Invoice; Notification |
| `payment_succeeded` (initial collection checkout) | Order → completed; CollectionPurchase; Invoice; Notification |
| `payment_failed` (initial checkout, any type) | Order → failed; no purchase/subscription record |
| `payment_succeeded` (renewal) | Period dates updated; Invoice (renewal); Notification |
| `payment_failed` (renewal) | status → grace_period; grace_period_ends_at set; Invoice (failed renewal); Notification |
| `refund.created` | Refund Invoice created or Invoice updated (deferred at MVP) |

### 8.3 Webhook Idempotency

**Handler steps:**
1. Validate gateway signature → 401 if invalid
2. Check if `event_id` already processed → 200 no-op if duplicate
3. Process event; store `event_id` in idempotency log
4. Return 200

Duplicate events (from gateway retries) must not create duplicate subscription, purchase, or
invoice records.

### 8.4 Fan-Side Reconciliation

Fan confirmation and error pages poll `GET /checkout/orders/:order-id`:
- `status = completed` → render confirmation page
- `status = failed` → render error page
- `status = pending` after max poll attempts → show processing indicator + support contact
  (timeout scenario — see Section 10)

SSE / real-time updates: deferred to post-launch (api-surface.md A4).

### 8.5 Notification Triggers

| Webhook / event | Notification type | Recipient |
|---|---|---|
| `payment_succeeded` (any checkout) | `order_confirmed` | Fan |
| Renewal `payment_succeeded` | `membership_renewal_success` | Fan |
| Renewal `payment_failed` | `membership_renewal_failed` | Fan |
| `POST /cancel` (API call) | `membership_cancelled_confirmed` | Fan |
| Scheduled job (period end or grace expiry) | `membership_expired` | Fan |

### 8.6 Audit Trail

- `Invoice` records are immutable; created by webhook events
- `Order.completed_at` and `Order.gateway_transaction_id` provide transaction audit
- `MembershipSubscription.gateway_subscription_id` cross-references gateway subscription
- No `ModerationAction` for billing events — `ModerationAction` is admin-moderation only
- `BillingCustomer.gateway_customer_id` cross-references gateway customer record

---

## 9. Entitlement Effects by Billing Outcome

### 9.1 Entitlement Matrix

| Billing outcome | Member-only posts | Tier-gated posts | Library (subscription) | Tier-gated collections | Product access | Collection access (purchased) | Premium post access |
|---|---|---|---|---|---|---|---|
| Subscription `active` | ✓ | ✓ (tier match) | ✓ | ✓ (tier match) | — | — | — |
| Subscription `cancelled` (within period) | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Subscription `grace_period` (within grace) | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Subscription `expired` | ✗ | ✗ | ✗ | ✗ | — | — | — |
| `ProductPurchase` (`access_revoked_at IS NULL`) | — | — | — | — | ✓ | — | — |
| `CollectionPurchase` (`access_revoked_at IS NULL`) | — | — | — | — | — | ✓ | — |
| `PostPurchase` (`access_revoked_at IS NULL`) | — | — | — | — | — | — | ✓ |
| `moderation_status = removed` (any content) | ✗ override | ✗ override | ✗ override | ✗ override | ✗ override | ✗ override | ✗ override |
| `CreatorProfile.status = suspended` | ✗ override | ✗ override | ✗ override | ✗ override | ✗ override | ✗ override | ✗ override |

`—` = not affected by this billing outcome (different entitlement mechanism)

### 9.2 Creator Dashboard Effects

| Event | Dashboard effect |
|---|---|
| MembershipSubscription created (`active`) | Member count +1; appears in recent activity |
| MembershipSubscription → `cancelled` | No immediate change |
| MembershipSubscription → `expired` | Member count -1 |
| ProductPurchase or CollectionPurchase created | Revenue figures increment; recent activity |
| Invoice (`subscription_renewal`, `paid`) | Revenue figures increment |
| Invoice (`subscription_renewal`, `failed`) | No revenue change; fan in grace period |

### 9.3 Admin Override Cases

**1. Content removed (`moderation_status → removed`):** Signed URL requests and content reads
return `403 CONTENT_REMOVED` or `404`. Purchase records retained for billing history.
Entitlement check skipped — moderation check precedes it.

**2. Creator suspended (`CreatorProfile.status → suspended`):** All creator content → `404`
to all non-admin callers. Subscriptions and purchases not modified. If reinstated
(post-launch), entitlement resumes based on existing records.

**3. Fan account suspended (`User.account_status → suspended`):** Login blocked; no API
access. Subscription and purchase records remain in database.

---

## 10. Failure and Edge-Case Matrix

| Scenario | System behavior | Fan impact | Resolution |
|---|---|---|---|
| Checkout started, fan abandons | `Order` remains `pending`; no subscription/purchase | Fan can re-initiate checkout | Pending Orders cleaned up by reconciliation job after timeout (B6) |
| `payment_succeeded` webhook but UI polling times out | Subscription/purchase IS created; `Order.status = completed` (webhook authoritative) | Fan may not see confirmation page; subscription is live | Fan checks `/account/subscriptions` or email notification |
| `payment_failed` before subscription creation | `Order → failed`; no subscription | Fan sees error page | Fan initiates new checkout |
| Renewal fails after prior active period | `status → grace_period`; fan retains access | Renewal failure notification + payment update CTA | Update payment method → gateway retry |
| Creator unpublishes purchased product | D1 unresolved: Option A revokes; Option B retains | Option A: access revoked; Option B: retained | Resolve D1 before launch (B2) |
| Creator unpublishes purchased collection | Same D1 open decision | Same | Resolve D1 |
| Admin removes content with active entitlement | `moderation_status = removed`; `403`/`404` regardless of purchase | Fan loses access | ModerationAction logged; purchase records retained |
| Admin suspends creator; fans have active subscriptions | All creator content → `404`; subscriptions remain in DB | Cannot access content; billing not auto-stopped | Operational: notify affected fans; manual subscription cancellation (post-launch admin tool) |
| Duplicate `payment_succeeded` webhook | Idempotency check by `event_id`; duplicate is no-op | None | `event_id` stored in idempotency log |
| Stale pending Order (webhook never arrives) | Order stays `pending` indefinitely | Fan's checkout unresolved | Scheduled reconciliation job marks Order `failed` after timeout (B6); fan notified if needed |
| Fan retries after failed payment | New `POST /checkout/membership` → new Order; dedup window clear | New payment intent | Normal checkout flow |
| Fan re-subscribes to same tier after expiry | New checkout permitted (`SUBSCRIPTION_EXISTS` not triggered for `expired`) | New subscription active; old expired record retained | Two records exist: one expired, one active |
| Annual plan cancelled at month 3 | `status → cancelled`; access to annual `current_period_end`; no refund | Access continues ~9 more months | As designed; KVKK implications flagged (B3) |
| Price change on active plan | `MembershipPlan.price_monthly_try` updated; existing subscriptions unaffected until next renewal | Charged new price at next renewal | Notification to subscribers may be required (B7) |
| `payment_succeeded` webhook for Order already `completed` | Idempotency: no-op | None | `event_id` check prevents duplicate subscription/purchase |

---

## 11. Deferred / Out of Scope Billing Areas

| Area | Reason deferred |
|---|---|
| Advanced refund workflows | Gateway handles refunds; no platform UI at MVP |
| Dispute / chargeback UI (`/admin/billing/*`) | Gateway handles disputes; platform surfaces invoice data only |
| Admin billing operations UI | Post-launch |
| Payout settlement operations | IBAN captured; payout mechanism is post-launch |
| Tax / VAT / KDV engine | Turkish tax implications require legal/finance review; not designed at MVP |
| Affiliate / referral revenue share | Excluded per CLAUDE.md Phase 1 scope |
| Sponsorship billing | Excluded per CLAUDE.md Phase 1 scope |
| Wallet / credit systems | No on-platform currency at Phase 1 |
| Mobile in-app purchase flows | Web-only at Phase 1 |
| Tier upgrade / downgrade mid-period | Cancellation only at MVP; no proration |
| Subscription pause | Not in Phase 1 scope |
| Per-invoice PDF receipts | Post-launch |
| Bulk purchase / bundle checkout | Not in Phase 1 scope |
| Gifted memberships | Not in Phase 1 scope |
| Pre-renewal notification reminder | Product decision (B8); timing and content not yet decided |
| Checkout for premium post (UI) | Entity modeled; UI deferred per page-requirements-outline.md |

---

## 12. Assumptions / Open Decisions

| # | Decision | Impact |
|---|---|---|
| B1 | Grace period duration (days) | Affects `grace_period_ends_at` computation; must be a billing config value before launch. data-model.md D3. |
| B2 | Product/collection/post unpublish access policy (D1) | Determines whether `access_revoked_at` is set when creator unpublishes. Must be resolved before launch. data-model.md D1. |
| B3 | Annual cancellation KVKK / Turkish consumer rights implications | May impose legal minimum refund obligations for annual plans. Flagged for legal review. page-requirements.md assumption 15. |
| B4 | ~~Platform fee percentage~~ **Resolved 2026-03-27 — 10% of gross transaction value. Stored in config as `PLATFORM_FEE_PERCENT = 0.10`. Fee split computed at reporting time; not recorded per Invoice. `Invoice.amount_try` stores gross only. `creator_earnings = amount_try × 0.90` computed in reporting queries.** | — |
| B5 | ~~Payment gateway provider~~ **Resolved 2026-03-27 — iyzico. Native recurring subscription API; gateway manages renewal scheduling autonomously. Webhook handler written to iyzico event format. `gateway_subscription_id` on `MembershipSubscription` used for renewal reconciliation. No platform-side renewal scheduler job required for subscription charges.** | — |
| B6 | Stale pending Order cleanup timeout | How long a pending Order is retained before reconciliation job marks it failed. Operational decision. |
| B7 | Price change subscriber notification | Whether existing subscribers are notified of tier price change before it takes effect at next renewal. Product decision. |
| B8 | Pre-renewal reminder notification | Whether and when to send pre-renewal reminder (e.g., "Your membership renews in 3 days"). Product decision. |
| B9 | Minimum refund policy | No-refund vs. partial-refund policy must be defined for legal compliance before launch. Currently deferred. |
| B10 | Creator notification on new subscription | Whether creator receives a Notification when a new fan subscribes. Not in current approved notification event set. |

---

## 13. Validation Checklist

- [ ] Lifecycle consistent with data-model.md entities and state machines (§4.5–§4.6, §6.1–§6.10)
- [ ] Lifecycle consistent with api-surface.md (§7.2–§7.5; checkout creates Order only; webhook creates MembershipSubscription)
- [ ] MembershipSubscription creation timing correct throughout: created active by webhook, not at checkout initiation
- [ ] Billing state (`Order.status`, `Invoice.status`) and entitlement state (`MembershipSubscription.status`) treated as separate concerns throughout
- [ ] All three launch-critical checkout flows covered: membership, product, collection
- [ ] Premium post purchase documented as entity-modeled + UI-deferred
- [ ] Cancellation behavior explicit: `status → cancelled` immediately; access continues to `current_period_end`
- [ ] Grace period behavior explicit: triggered by renewal failure only; access retained during grace window
- [ ] Admin moderation override documented as absolute entitlement override
- [ ] D1 (unpublish access policy) flagged as unresolved in all relevant sections
- [ ] No refund, dispute, payout, or tax workflows introduced in functional sections
- [ ] No payment integration code, webhook handler code, SQL, ORM, or OpenAPI produced
