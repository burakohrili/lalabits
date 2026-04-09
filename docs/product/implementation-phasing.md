# Implementation Phasing — lalabits.art Phase 1

> **Status:** Approved
> **Version:** v1.0
> **Scope:** Phase 1 MVP
> **Authority level:** Canonical
>
> **Authority files:** CLAUDE.md · page-requirements.md · permission-matrix.md ·
> data-model.md · api-surface.md · billing-lifecycle.md · moderation-trust-rules.md
>
> **Scope:** This document defines the Phase 1 build order and implementation phasing.
> It does not contain code, sprint tickets, or project-management plans.

---

## 1. Document Purpose

This document defines the recommended Phase 1 build order for lalabits.art. It is derived
from the full approved planning stack:

- `data-model.md` — entity dependencies and state machine sequencing
- `api-surface.md` — API family groupings and cross-cutting prerequisites
- `billing-lifecycle.md` — checkout → webhook → entitlement activation sequence
- `moderation-trust-rules.md` — creator review, moderation, and trust infrastructure order
- `page-requirements.md` and `page-requirements-outline.md` — 24-family launch scope
- `launch-critical-pages.md` — MVP page designations and deferred items
- `permission-matrix.md` — role and visibility prerequisites

**Does not contain:**
- Code, implementation tickets, sprint plans, or story points
- Architecture decisions beyond what is grounded in approved docs
- Features outside the approved 24-family Phase 1 scope

**How to use this document:**
- Use it as the sequencing authority when deciding what to build next
- Use it alongside the approved planning docs — it references them, not replaces them
- Use the Launch Blockers section (§10) as the go/no-go gate before public launch
- Use the Integration Milestones section (§9) to verify readiness at each phase boundary

---

## 2. Phasing Principles

Seven principles govern Phase 1 implementation sequencing.

**1. Build dependency-first.** Never build a surface before the layer it depends on exists.
Auth before profiles. Profiles before onboarding. Approval before content publishing.
Content before checkout. Checkout before library. No shortcuts.

**2. Prioritize end-to-end functional slices over isolated UI surfaces.** A working
creator-applies → admin-approves → creator-publishes slice is more valuable than having all
creator dashboard pages scaffolded but none of them connected to real data. Prefer thin
vertical slices to broad horizontal layers.

**3. Unlock internal admin and trust controls before public-facing content.** Admin creator
review and the moderation authorization layer must be functional before any creator content
is publicly reachable. The platform cannot operate safely without them.

**4. Establish entitlement and billing correctness before optimization.** The checkout →
webhook → subscription/purchase → entitlement activation sequence must work end-to-end
before any UX polish, loading states, or advanced billing scenarios are added. Correctness
before experience.

**5. Prefer minimum viable operational tooling over broad tooling.** Admin review queue
(Family 20) and moderation queue (Family 21) are launch-critical; audit log UI, user
management UI, and admin billing ops are explicitly deferred. Build only what is needed to
safely operate at launch.

**6. Sequence public launch features only after creator, billing, and moderation foundations
are stable.** Discovery (Family 2) and the full public creator page (Family 8) require
creators, content, and trust infrastructure to be in place first. Public-facing surfaces
should be the last thing fully wired — not the first.

**7. Avoid premature analytics, advanced settings, or notification customization work.**
Analytics pages, settings pages, and notification preferences are explicitly deferred.
Basic in-app notifications (Family 15) are launch-critical but should not be built until
the events that trigger them (checkout, renewal, moderation actions) are stable.

---

## 3. Phase 1 Build Strategy Summary

**Five-layer build progression:**

**Layer 1 — Foundations** (Phase 0)
Infrastructure, database, shared services, and scaffold. No user-facing pages. Establish
the platform chassis before any product features are built.

**Layer 2 — Identity and Trust** (Phase 1)
Auth flows, legal consent pages, and core user identity. Nothing can happen without
authenticated users who have accepted legal terms. This layer unlocks all subsequent layers.

**Layer 3 — Creator and Admin Core** (Phase 2–3)
Creator onboarding, admin review queue, creator content creation, and membership/product
configuration. This is the supply side of the platform. The creator must be able to apply,
be reviewed, get approved, and publish monetizable content before any fan flow can be tested
end-to-end.

**Layer 4 — Fan Commerce and Access** (Phase 4–5)
Fan discovery, checkout, billing lifecycle, and entitlement enforcement. The demand side of
the platform. Payment gateway integration, webhook handling, and entitlement authorization
must all work correctly before this layer is complete.

**Layer 5 — Trust Hardening and Launch Readiness** (Phase 6–7)
Full moderation and report queue operational, all integration milestones verified, launch
gate checks passed. This layer converts a working platform into a safe platform.

---

## 4. Dependency Map

### 4.1 Auth and Identity Foundation

All authenticated actions depend on: User entity, JWT/session, email verification,
`email_verified_at`, and `account_status = active` checks.

Depends on: Nothing (starting point after Phase 0 infrastructure).
Required by: Everything.

### 4.2 Legal Consent Prerequisites

`ConsentRecord` for `terms_of_service` and `privacy_policy` must be captured at fan/creator
registration. Legal pages (Families 22, 23, 24) must render before auth flows can reference
them. Creator Agreement (`ConsentRecord` for `creator_agreement`) must be accepted at
onboarding step 5 before a creator application can be submitted.

Depends on: Legal page content exists (Families 22, 23, 24).
Required by: Fan registration (Family 4), Creator signup (Family 5), Creator onboarding
step 5 (Family 7).

### 4.3 Creator Profile and Approval Prerequisites

A creator cannot publish content, configure tiers, or receive payments until
`CreatorProfile.status = approved`. Approval requires: creator onboarding completed,
`CreatorApplication` submitted, admin review action taken (Family 20).

Depends on: Auth (§4.1), Legal consent (§4.2), Creator Agreement page (Family 24).
Required by: Creator dashboard (Family 9), Posts (10), Plans (11), Products/Collections
(12), public creator page (Family 8), all checkout flows (16, 17, 18).

### 4.4 Content and Access Model Prerequisites

Content (Post, Product, Collection) must exist and be published for fan discovery and
checkout to work. The dual-status visibility layer (`publish_status` + `moderation_status`)
must be in the authorization layer from the moment any content is first served publicly.

Depends on: Approved creator (§4.3), dual-status enforcement in authorization layer.
Required by: Creator public page (Family 8 — meaningful), Discovery (Family 2), all
checkout flows (16, 17, 18), Library (Family 13).

### 4.5 Billing and Entitlement Prerequisites

Billing requires: payment gateway integrated, `Order` created at checkout, webhook handler
operational for `payment_succeeded` and `payment_failed`. Entitlement evaluation requires:
`MembershipSubscription`, `ProductPurchase`, `CollectionPurchase` records created by
webhook; authorization layer checks these at request time.

Depends on: Content exists (§4.4), payment gateway integrated (external dependency).
Required by: All checkout flows (16, 17, 18), Cancellation (19), Fan memberships and
billing (14), Library (13), renewal/grace period lifecycle (scheduled jobs).

### 4.6 Admin Moderation Prerequisites

`ModerationAction` audit trail infrastructure must ship with the first admin action (creator
review in Phase 2). The content moderation queue (Family 21) requires: Report entity,
content entities with `moderation_status`, admin auth gate (`is_admin = true`).

Depends on: Content exists (§4.4), Report entity and API operational.
Required by: Safe public operation; no launch without Family 21 functional.

### 4.7 Legal/Consent Prerequisites Summary

| Consent type | When captured | Page dependency |
|---|---|---|
| `terms_of_service` | Fan/creator registration | Family 22 must render |
| `privacy_policy` | Fan/creator registration | Family 23 must render |
| `creator_agreement` | Onboarding step 5 | Family 24 must render |

### 4.8 Notification Prerequisites

Notification entity must be created as side effects of: checkout confirmation, renewal
success/failure, cancellation, membership expiry, creator approval/rejection, content
moderation actions. Notification delivery infrastructure (in-app + email) must exist before
events that trigger notifications are operational. Family 15 depends on notifications
existing from billing (Phase 4) and moderation (Phase 2+).

### 4.9 Public Discovery Dependencies

Family 1 (Home) can be scaffolded early as a static marketing page but is meaningless until
creators and content exist. Family 2 (Discovery) requires approved creators with published
content and `moderation_status = clean`. Both are fully wired in Phase 4.

Depends on: Approved creators with published content (§4.3, §4.4).
Required by: Fan acquisition funnel; cannot convert fans without a landing surface.

---

## 5. Recommended Build Phases

---

### Phase 0: Platform Foundations

**Goal:** Establish the technical chassis — no user-facing pages ship in this phase.

**Included systems:**
- NestJS backend scaffold (module structure, middleware, exception filters)
- Next.js frontend scaffold (app router, layout system, environment config)
- PostgreSQL schema migrations (all approved entities from data-model.md)
- Redis setup (session caching, queue infrastructure)
- Object storage integration (file upload/download service layer)
- Email delivery service integration (transactional email infrastructure)
- Base authentication middleware (JWT strategy, guard infrastructure)
- Admin auth gate (`is_admin = true` guard — enforced from Phase 1 onward)
- Environment configuration and secrets management
- CI/CD pipeline

**Why first:** All subsequent phases depend on this chassis. No feature can be built without
a working database schema, service scaffold, and infrastructure integrations.

**Prerequisites:** None.

**Outputs:** Running local and staging environments; all 25 data model entities migrated;
auth/session infrastructure ready; file storage and email service connected.

**Not included yet:** Any user-facing page, any API endpoint, any business logic.

---

### Phase 1: Auth + Legal + Core Identity

**Goal:** Users can register, log in, reset passwords, and see legal pages. Legal consent is
captured at registration. Foundation for all subsequent user-dependent flows.

**Included systems:**
- User registration (fan and creator paths — Families 4, 5 entry point)
- Email/password login and session management (Family 3)
- Email verification flow (`email_verified_at`)
- Password reset (Family 6)
- `ConsentRecord` creation at registration (`terms_of_service`, `privacy_policy`)
- Legal pages rendered (Families 22, 23, 24)
- Creator Agreement page rendered (Family 24)
- Transactional email delivery operational (verification, password reset)

**Why after Phase 0:** Requires auth middleware, database schema, and email infrastructure
from Phase 0.

**Prerequisites:** Phase 0 complete; User entity migrated; email service connected.

**Outputs:**
- Fan can register, verify email, log in, and reset password
- Creator can register at entry point (dashboard access not yet available)
- Legal pages render correctly and are linked from auth flows
- `ConsentRecord` captured at every registration

**Page families delivered:** 3, 4, 5 (entry point only), 6, 22, 23, 24

**Not included yet:** Creator onboarding wizard, creator dashboard, content, admin, billing.

---

### Phase 2: Creator Onboarding + Admin Review

**Goal:** Creator can complete onboarding and submit application. Admin can review, approve,
reject, or suspend. `ModerationAction` audit trail is operational from this phase forward.
First vertical slice: creator applies → admin approves.

**Included systems:**
- Creator onboarding wizard, all 6 steps (Family 7):
  profile, category, tier configuration, IBAN capture, agreement acceptance, confirmation
- `CreatorProfile`, `CreatorApplication`, `MembershipPlan` entities operational
- `ConsentRecord` for `creator_agreement` created at onboarding step 5
- IBAN format validation (`iban_format_valid`); full IBAN encrypted at rest
- Admin overview dashboard (`/admin`) with operational counters (Family 20 entry)
- Creator review queue (`/admin/yaraticilar/inceleme`) with inline review panel (Family 20)
- Admin approve / reject / suspend actions
- `ModerationAction` audit trail — ships in this phase (non-deferrable)
- Creator approval, rejection, and suspension notification emails
- `/dashboard` route gated: accessible only when `CreatorProfile.status = approved`
- `/@[username]` public page returns `404` for non-approved creators

**Why after Phase 1:** Requires authenticated users (Phase 1). Requires Creator Agreement
page (Family 24, Phase 1). Admin review requires `ModerationAction` infrastructure.

**Prerequisites:** Phase 1 complete; Creator Agreement renders; `is_admin = true` guard
active.

**Outputs:**
- Creator can complete 6-step onboarding and submit application
- Admin can review and take approve/reject/suspend actions
- Every admin action creates a `ModerationAction` record
- Approved creator gains `/dashboard`; non-approved sees pending state
- Rejected creator sees rejection reason and resubmission CTA
- Creator public page `/@[username]` returns `404` for non-approved creators

**Page families delivered:** 7 (onboarding), 20 (creator review — fully operational)

**Not included yet:** Content creation, fan-facing surfaces, billing, checkout, Family 21.

---

### Phase 3: Creator Content + Monetization Setup

**Goal:** Approved creators can publish posts, configure plans, upload products, and create
collections. The dual-status visibility layer is operational in the authorization layer.
Creator public page renders with real content.

**Included systems:**
- Post creation, editing, publishing, scheduling, archiving (Family 10)
- Post access levels: `public`, `free_member`, `tier_gated`, `premium`
- `PostAttachment` and file upload to object storage (signed URL generation)
- `MembershipPlan` publishing and editing (Family 11)
- `Product` creation, upload, pricing, `publish_status` management (Family 12)
- `Collection` creation, item assignment, `access_type` configuration (Family 12)
- Creator public page — full implementation with tab structure (Family 8):
  feed, tiers, shop, and collections as sub-states of `/@[username]`
- Creator dashboard overview with real data (Family 9): revenue stub, member count
- **Dual-status authorization layer:** all content reads evaluate both `publish_status`
  AND `moderation_status`; `removed` = absolute override; suspended creator = all content
  `404`
- Storage keys never returned raw; signed URLs served after visibility/entitlement check

**Why after Phase 2:** Requires approved creator status (Phase 2). Content cannot be
published without an approved creator. The authorization layer can only be implemented once
content entities and their status fields exist.

**Prerequisites:** Phase 2 complete; approved creator exists; content entities migrated;
object storage operational.

**Outputs:**
- Approved creator can publish posts (all access levels), products, and collections
- Creator public page renders live content at `/@[username]`
- Dual-status content visibility enforced at API level
- Gated content shows paywall/CTA; checkout not yet wired
- Non-approved creator public page still returns `404`

**Page families delivered:** 8 (creator public page — full), 9 (dashboard — real data),
10 (posts), 11 (membership plans), 12 (products & collections)

**Not included yet:** Fan discovery, checkout, billing, fan library, notifications,
Family 21.

---

### Phase 4: Fan Discovery + Checkout + Billing

**Goal:** Fan can discover creators, initiate checkout, and complete payment. Billing
lifecycle works end-to-end: checkout → webhook → subscription/purchase record creation →
entitlement activation.

**Included systems:**
- Home page (Family 1) — fully wired to live creator and content data
- Discovery page (Family 2) — creator browsing with category/filter
- Payment gateway integration (external provider; production-ready)
- `BillingCustomer` creation on first checkout
- Membership checkout flow (Family 16):
  - `POST /checkout/membership` → `Order (pending)` → gateway payment intent
  - Webhook `payment_succeeded` → `MembershipSubscription (active)` + `Invoice`
  - Webhook `payment_failed` → `Order (failed)`
  - Confirmation page (`/checkout/onay/[order-id]`), error page (`/checkout/hata/[order-id]`)
  - Polling: `GET /checkout/orders/:order-id`
- Product checkout flow (Family 17) — same pattern with `ProductPurchase`
- Collection checkout flow (Family 18) — same pattern with `CollectionPurchase`
- Cancellation flow (Family 19):
  - Preview → consequence disclosure → confirm cancel
  - `MembershipSubscription.status → cancelled`; access retained to `current_period_end`
- Webhook handler (`POST /webhooks/billing`):
  - Signature validation; `event_id` idempotency deduplication
  - Renewal `payment_succeeded` → period update + Invoice
  - Renewal `payment_failed` → `status → grace_period` + `grace_period_ends_at`
- Scheduled jobs: `cancelled → expired`; `grace_period → expired`
- Billing notification emails: `order_confirmed`, `membership_renewal_success`,
  `membership_renewal_failed`, `membership_cancelled_confirmed`, `membership_expired`
- Pre-checkout guards: email verified, creator `approved`, plan `published`,
  `SUBSCRIPTION_EXISTS` duplicate check

**Why after Phase 3:** Checkout requires published plans and products (Phase 3). Payment
gateway integration requires `BillingCustomer` + content entities from Phase 3.

**Prerequisites:** Phase 3 complete; payment gateway configured; webhook endpoint reachable;
email delivery operational for billing notifications.

**Outputs:**
- Fan can complete membership checkout; subscription activates via webhook
- Fan can purchase products and collections
- Fan can cancel subscription; access continues to period end
- Grace period and expiry lifecycle operational
- Renewal webhook processing works
- Entitlement checks evaluate live subscription and purchase record states

**Page families delivered:** 1 (home — full), 2 (discovery), 16 (membership checkout),
17 (product checkout), 18 (collection checkout), 19 (cancellation)

**Not included yet:** Fan library, fan account/billing views, in-app notifications,
content moderation queue (Family 21).

---

### Phase 5: Fan Account + Library + Notifications

**Goal:** Fan can access their entitlements, see billing history, update payment method, and
receive in-app notifications. The full fan-side experience is complete.

**Included systems:**
- Fan library page (Family 13): unlocked posts, purchased products (signed URL after
  entitlement check), purchased collections
- Fan memberships and billing page (Family 14):
  - Active subscriptions view (`status`, `current_period_end`, billing interval)
  - Billing history — Invoice records
  - `PaymentMethodSummary` display and update
  - Cancellation flow link to Family 19
- Entitlement enforcement fully operational:
  - Product download: `ProductPurchase.access_revoked_at IS NULL` AND
    `moderation_status != removed`
  - Tier-gated post: `MembershipSubscription.status` in (`active`, `cancelled` within
    period, `grace_period` within grace) AND tier match
  - Collection access: `CollectionPurchase.access_revoked_at IS NULL`
- In-app notification center (Family 15):
  - Displays all `Notification` records for authenticated user
  - Mark-as-read; billing and moderation notification events covered
- Report submission: `POST /reports` operational; duplicate guard enforced
  (backend only in this phase; moderation queue UI is Phase 6)

**Why after Phase 4:** Library requires purchase records from Phase 4. Entitlement
enforcement requires subscription/purchase records. In-app notifications require billing
events from Phase 4.

**Prerequisites:** Phase 4 complete; purchase/subscription records exist; notification
infrastructure operational.

**Outputs:**
- Fan can access library; download purchased products; access gated posts
- Fan can see billing history and active subscription status
- Fan can update payment method
- In-app notifications render for billing and moderation events
- Report submission API operational
- Full fan-side experience is end-to-end functional

**Page families delivered:** 13 (library), 14 (memberships & billing), 15 (notifications)

**Not included yet:** Admin moderation queue UI (Family 21).

---

### Phase 6: Admin Moderation Hardening

**Goal:** Admin can review and action all reports, manage flagged content, and take all
moderation actions. The full trust and safety operational surface is complete. Platform is
operationally safe to run publicly.

**Included systems:**
- Moderation hub (`/admin/moderasyon`) — navigation entry (Family 21)
- Report queue (`/admin/moderasyon/raporlar`) — filterable report table (Family 21)
- Report detail (`/admin/moderasyon/raporlar/[report-id]`) — full context, action history,
  action panel (Family 21)
- Flagged content queue (`/admin/moderasyon/icerik`) — Remove/Clear per item (Family 21)
- All moderation actions fully operational: warn, flag, clear flag, remove content,
  restrict creator, suspend creator, dismiss report — each creates `ModerationAction`
- Admin overview counters (Family 20) fully populated: open reports + flagged content
- Creator suspension end-to-end verified: all content `→ 404`; fan access blocked
- Moderation notification emails: removal, restriction, suspension

**Why after Phase 5:** Report queue is only meaningful once reports exist (fans submit in
Phase 5). Moderation actions on content require content to exist (Phase 3). Full moderation
hardening is the last trust layer before public launch.

**Prerequisites:** Phase 5 complete; Report entity operational; `ModerationAction`
infrastructure from Phase 2; content entities with `moderation_status` from Phase 3.

**Outputs:**
- Admin can action all user-submitted reports
- Admin can flag, remove, or clear content from the flagged content queue
- Admin can restrict or suspend creators with immediate effect
- All moderation actions create `ModerationAction` records
- Platform is operationally safe: no content can remain live without an admin action path

**Page families delivered:** 21 (moderation & reports — full)

---

### Phase 7: Integration QA + Launch Readiness

**Goal:** All integration milestones verified, all launch gate checks passed. Platform ready
for public launch.

**Included systems:**
- End-to-end billing lifecycle testing (checkout → webhook → subscription → renewal →
  grace period → expiry → re-subscribe)
- End-to-end moderation lifecycle testing (report → admin action → visibility change →
  notification)
- Legal consent verification at all registration and onboarding entry points
- Cross-browser and cross-device responsiveness for all 24 families
- Payment gateway production configuration verification (Turkish provider, production
  webhook endpoint, production keys)
- Scheduled job verification in production
- Email delivery verification in production
- All §10 launch blockers resolved and verified

**Prerequisites:** Phases 0–6 complete.

**Outputs:** Platform cleared for public launch.

**Page families verified:** All 24.

---

## 6. Build Order by Page Family

| # | Family Name | Phase | Reason for Placement | Key Dependencies |
|---|---|---|---|---|
| 22 | Terms of Service | 1 | Referenced at fan/creator registration; must render before any account creation | Phase 0 infra |
| 23 | Privacy Policy | 1 | Required at registration for KVKK compliance | Phase 0 infra |
| 24 | Creator Agreement | 1 | Required at onboarding step 5; must render before onboarding submits | Phase 0 infra |
| 3 | Login | 1 | Core auth flow; depends on User entity and session infrastructure | Phase 0 |
| 4 | Fan Signup | 1 | Fan registration with `ConsentRecord` capture | Phase 0; Families 22, 23 render |
| 5 | Creator Signup | 1 | Entry point to onboarding; full onboarding is Phase 2 | Phase 0; Families 22, 23 render |
| 6 | Password Reset | 1 | Auth dependency; email delivery required | Phase 0; email service |
| 7 | Creator Onboarding | 2 | Requires auth (Phase 1); co-dependent with admin review queue | Phase 1; Family 24 renders |
| 20 | Creator Review Queue | 2 | Co-dependent with onboarding; admin must act as creators apply | Phase 1; `ModerationAction` infra |
| 8 | Creator Public Page | 3 | Needs approved creator (Phase 2) and published content to be meaningful | Phase 2; Phase 3 content |
| 9 | Creator Dashboard | 3 | Requires approved creator; real data requires content + plan entities | Phase 2 (approval gate); Phase 3 content |
| 10 | Posts Management | 3 | Requires approved creator; Post entity + file upload operational | Phase 2; object storage |
| 11 | Membership Plans | 3 | Requires approved creator; `MembershipPlan` entity operational | Phase 2 |
| 12 | Products & Collections | 3 | Requires approved creator; Product, Collection entities operational | Phase 2; object storage |
| 1 | Home | 4 | Scaffold buildable earlier; fully meaningful only when creators and content exist | Phase 3 (creators + content) |
| 2 | Discovery | 4 | Requires approved creators with published content | Phase 3; content exists |
| 16 | Membership Checkout | 4 | Requires published plans, payment gateway, webhook handler | Phase 3 + payment gateway |
| 17 | Product Checkout | 4 | Requires published products, payment gateway, webhook handler | Phase 3 + payment gateway |
| 18 | Collection Checkout | 4 | Requires published collections, payment gateway, webhook handler | Phase 3 + payment gateway |
| 19 | Cancellation Flow | 4 | Requires active `MembershipSubscription` from checkout | Phase 4 (checkout works) |
| 13 | Library | 5 | Requires purchase/subscription records from Phase 4 | Phase 4; entitlement enforcement |
| 14 | Memberships & Billing | 5 | Requires subscriptions, invoices, payment method records | Phase 4 |
| 15 | Notifications | 5 | Requires notification events from billing (Phase 4) and moderation (Phase 2+) | Phase 4; notification infra |
| 21 | Moderation & Reports | 6 | Requires content (Phase 3), report submissions (Phase 5), `ModerationAction` infra (Phase 2) | Phase 5 |

---

## 7. Backend-First System Order

The recommended order for backend service and domain implementation:

### 7.1 Auth / Session (Phase 0–1)

JWT strategy; session middleware; User entity CRUD; email verification token flow;
password reset token flow; `is_admin = true` guard infrastructure.

### 7.2 Legal Consent Capture (Phase 1)

`ConsentRecord` entity; `consent_type` enum; consent creation at registration and
onboarding step 5; `LegalDocumentVersion` tracking.

### 7.3 User / Creator Profile Domain (Phase 1–2)

User entity (`account_status`, `email_verified_at`, soft delete); `CreatorProfile` entity
(status enum, state machine); `CreatorProfile.status` gate on all `/dashboard/*` routes;
`/@[username]` public page — `status = approved` required to render.

### 7.4 Creator Application / Review Domain (Phase 2)

`CreatorApplication` entity (decision enum, IBAN encrypted at rest); creator onboarding API
(6-step wizard endpoints); admin creator review API (approve, reject, suspend); `ModerationAction`
entity — ships in this phase (non-deferrable); audit trail: every admin write creates
`ModerationAction` or rolls back; creator notification emails (approval, rejection,
suspension).

### 7.5 Content Domain (Phase 3)

`Post` entity (`publish_status`, `moderation_status`, `access_level`, scheduling);
`PostAttachment` entity (storage_key never returned raw; signed URL service);
`MembershipPlan` entity (status, pricing, perk list);
`Product` entity (`publish_status`, `moderation_status`, `file_storage_key`);
`Collection` entity (`access_type`, `publish_status`, `moderation_status`);
`CollectionItem` join entity;
**Dual-status authorization layer:** all content read endpoints evaluate both
`publish_status` AND `moderation_status`; `removed` = absolute override; suspended
creator = all content `404`.

### 7.6 Billing / Checkout Domain (Phase 4)

`BillingCustomer`; `PaymentMethodSummary` (display data only; no raw card data);
`Order` entity (`status` enum, `order_type`, `gateway_transaction_id`);
`Invoice` entity (`invoice_type`, `status`, immutable after creation);
`MembershipSubscription` entity (full state machine — `active → cancelled → expired`;
`grace_period` flow);
`ProductPurchase`, `CollectionPurchase`, `PostPurchase` entities;
payment gateway integration (checkout initiation → payment intent);
webhook handler (`POST /webhooks/billing`) with:
  - signature validation
  - `event_id` idempotency deduplication
  - `payment_succeeded` (initial): Order → completed; subscription/purchase record created active
  - `payment_failed` (initial): Order → failed
  - `payment_succeeded` (renewal): period update; Invoice
  - `payment_failed` (renewal): `status → grace_period`; `grace_period_ends_at` set
scheduled jobs: `cancelled → expired`; `grace_period → expired`;
checkout pre-condition guards (email verified, creator `approved`, plan `published`, dedup).

### 7.7 Notification Domain (Phase 4–5)

`Notification` entity (`event_type`, recipient, `is_read`); notification creation as side
effects of billing events (Phase 4) and moderation events (Phases 2, 6); in-app
notification API (list, mark-read); email notification delivery.

### 7.8 Entitlement Enforcement (Phase 5)

Signed URL generation for Product downloads (after entitlement check); entitlement
evaluation at request time from live entity state:
- `MembershipSubscription.status` and period dates (tier match required for tier-gated
  content)
- `ProductPurchase.access_revoked_at IS NULL`
- `CollectionPurchase.access_revoked_at IS NULL`

Dual-status moderation override already in authorization layer from Phase 3.
Library aggregation API (fan's purchases and active subscriptions in one view).

### 7.9 Report / Moderation Domain (Phase 5–6)

`Report` entity (`target_type`, `reason_code`, status state machine); `POST /reports`
with 24-hour duplicate guard (same reporter + same target → `409 CONFLICT`); admin report
queue API (filterable, paginated); admin report detail API (reporter info, target state,
`ModerationAction` history); all moderation actions: flag, clear flag, remove content,
restrict creator, warn user — all create `ModerationAction` records (`ModerationAction`
infrastructure from Phase 2 already in place); flagged content queue API; creator
suspension end-to-end verified.

### 7.10 Admin Operations Surface (Phase 2, extended Phase 6)

Phase 2: Creator review API (approve, reject, suspend).
Phase 6: Report action API (warn, remove, restrict, dismiss, close); content moderation
API (flag, clear, remove).
All admin endpoints: `is_admin = true` required; `403` for any non-admin caller.

---

## 8. Frontend-First Surface Order

### 8.1 What Can Be Scaffolded Early

These surfaces have minimal backend dependencies and can be scaffolded as static or
near-static pages before full backend readiness:

- **Legal pages (Families 22, 23, 24):** Static content; render as soon as content is
  written
- **Home page (Family 1):** Marketing scaffold; wire to live creator data in Phase 4
- **Auth pages (Families 3, 4, 5, 6):** Forms with well-defined API shapes; buildable once
  auth backend is ready (Phase 1)

### 8.2 Surfaces That Must Wait for Backend Readiness

| Surface (Family) | Must wait for |
|---|---|
| Creator Onboarding (7) | Phase 2 backend; creator application API |
| Creator Public Page (8) | Phase 3 content; approved creator; published content |
| Creator Dashboard (9) | Phase 2 approval gate; Phase 3 for real data |
| Posts Management (10) | Phase 3 content domain; file upload service |
| Membership Plans (11) | Phase 3; plan entity |
| Products & Collections (12) | Phase 3; product/collection entities; file upload |
| Admin Creator Review (20) | Phase 2 admin API |
| Checkout Flows (16, 17, 18) | Phase 4; payment gateway; Order/webhook flow |
| Cancellation (19) | Phase 4; active subscription exists |
| Library (13) | Phase 5; purchase records; entitlement enforcement |
| Memberships & Billing (14) | Phase 5; subscription + invoice records |
| Notifications (15) | Phase 5; notification records from billing events |
| Admin Moderation (21) | Phase 6; report backend; content with `moderation_status` |
| Discovery (2) | Phase 4 (fully meaningful); Phase 3 content required |

### 8.3 Recommended Frontend Implementation Order

1. **Phase 1:** Legal pages (22, 23, 24) → Login (3) → Fan Signup (4) → Creator Signup
   entry point (5) → Password Reset (6)
2. **Phase 2:** Creator Onboarding wizard all 6 steps (7) → Admin creator review queue (20)
3. **Phase 3:** Creator Dashboard shell with approval gate (9) → Posts management (10) →
   Plans management (11) → Products & Collections management (12) → Creator public page
   full tab structure (8)
4. **Phase 4:** Home wired to live content (1) → Discovery (2) → Membership checkout +
   confirmation + error (16) → Product checkout (17) → Collection checkout (18) →
   Cancellation flow (19)
5. **Phase 5:** Fan Library (13) → Fan Memberships & Billing (14) → Notifications center (15)
6. **Phase 6:** Admin Moderation hub → Report queue → Report detail → Flagged content
   queue (21)

---

## 9. Integration Milestones

### Milestone 1 — Identity Foundation Ready (Phase 1 complete)

- Fan can register, verify email, log in, and reset password
- Legal consent captured in `ConsentRecord` at every registration
- Legal pages 22, 23, 24 render correctly and are linked from auth flows

### Milestone 2 — Creator Can Apply and Be Approved (Phase 2 complete)

- Creator can complete all 6 onboarding steps and submit application
- Admin can view application in review queue and take approve/reject/suspend action
- Every admin action creates a `ModerationAction` record
- Approved creator gains `/dashboard`; non-approved creator does NOT
- Approval and rejection emails delivered correctly
- Creator public page `/@[username]` is NOT publicly accessible for non-approved creators

### Milestone 3 — Creator Can Publish Monetizable Content (Phase 3 complete)

- Approved creator can create and publish posts (all access levels)
- Approved creator can configure and publish membership plans
- Approved creator can upload and publish digital products
- Approved creator can create and publish collections
- Creator public page renders live content at `/@[username]`
- Dual-status content visibility enforced: `removed` content returns `404`/`403`
- Non-approved creator public page still returns `404`

### Milestone 4 — Fan Can Subscribe and Purchase (Phase 4 complete)

- Fan can discover creators on Home and Discovery pages
- Fan can initiate membership checkout, complete payment, subscription activates via webhook
- Verified: `payment_succeeded` → `MembershipSubscription (active)` + `Invoice` created
- Fan can purchase a product and a collection
- `payment_failed` → `Order (failed)`; no `MembershipSubscription` and no `Invoice` created
- Fan can cancel subscription; `status → cancelled`; access continues to `current_period_end`
- Renewal `payment_failed` webhook → `status → grace_period` with correct `grace_period_ends_at`
- Scheduled expiry job transitions `cancelled → expired` after `current_period_end`
- Billing notification emails delivered correctly

### Milestone 5 — Fan Can Access Entitlements (Phase 5 complete)

- Fan can access tier-gated posts when subscription is active/cancelled within period
- Fan can download purchased product via signed URL (entitlement-gated)
- Fan can access purchased collection
- `moderation_status = removed` blocks all access regardless of purchase/subscription
- Fan sees correct billing history and subscription status in account pages
- In-app notifications render for billing events
- Fan can submit a report

### Milestone 6 — Admin Can Moderate Safely (Phase 6 complete)

- Admin can see all submitted reports in the moderation queue
- Admin can take all moderation actions: warn, flag, clear, remove, restrict, suspend,
  dismiss
- Content removal immediately blocks all access (verified against active entitlements)
- Creator suspension hides all creator content across all public pages
- All moderation actions create `ModerationAction` records
- Moderation notification emails delivered: removal, restriction, suspension

### Milestone 7 — Launch Ready (Phase 7 complete)

- All 6 milestones above pass in production environment
- All 24 page families render correctly across desktop, tablet, and mobile breakpoints
- Payment gateway production configuration verified; production webhook endpoint confirmed
- At least one real-money transaction completed in Turkish payment context (TRY)
- All scheduled jobs verified in production
- All §10 launch blockers resolved

---

## 10. Launch Blockers / Gate Checks

All conditions must be true before public launch. Any single unresolved blocker is
sufficient to delay launch.

**Identity and Legal**
- [ ] Fan cannot create an account without accepting Terms of Service and Privacy Policy
- [ ] Creator cannot submit application without accepting Creator Agreement
- [ ] `email_verified_at IS NOT NULL` enforced on checkout and all sensitive API calls

**Creator Gating**
- [ ] No creator's public page (`/@[username]`) is accessible unless
  `CreatorProfile.status = approved`
- [ ] No creator can publish content while `status` is `pending_review`, `rejected`, or
  `suspended`
- [ ] No creator can receive payments before `status = approved`

**Billing and Entitlement**
- [ ] `MembershipSubscription` is only created by webhook `payment_succeeded` — never by
  checkout initiation
- [ ] Failed initial payment leaves no `MembershipSubscription` and no `Invoice`
- [ ] Webhook idempotency (`event_id` deduplication) prevents duplicate records on retry
- [ ] Entitlement is evaluated at request time from live entity state — never cached
- [ ] `moderation_status = removed` blocks all content access regardless of subscription or
  purchase record
- [ ] Grace period and expiry scheduled jobs are running and verified in production

**Moderation and Trust**
- [ ] Admin can receive and action all report types before platform goes public
- [ ] Creator suspension immediately hides all creator content (no delay)
- [ ] Every admin action creates a `ModerationAction` record; no silent admin actions
- [ ] `admin_note` is never returned in any non-admin API response

**Open Decisions That Are Launch Blockers**
- [ ] M1 resolved (flagged content auto-hide behavior defined — moderation-trust-rules.md §13)
- [ ] M4 resolved (report reason taxonomy finalized and legally reviewed)
- [ ] M7 resolved (gateway renewal behavior on creator suspension defined)
- [ ] M8 resolved (`restrict_creator` data model implementation decided)
- [ ] B1 resolved (grace period duration configured as billing config value)
- [ ] B5 resolved (payment gateway provider selected and integrated)
- [ ] D1 resolved (unpublish access policy for prior purchasers defined)
- [ ] B9 resolved (minimum refund policy defined for legal compliance)

**Infrastructure**
- [ ] Payment gateway production configuration verified with real transaction (TRY)
- [ ] Transactional email delivery verified in production environment
- [ ] File storage and signed URL generation operational in production
- [ ] Scheduled jobs running and verified in production

---

## 11. Deferred Implementation Areas

The following should not be built during the initial Phase 1 implementation push. Any work
in these areas is explicitly post-launch unless the scope is formally extended.

| Area | Reason Deferred |
|---|---|
| Chat (1:1 and group) | Explicitly excluded from Phase 1 launch scope (CLAUDE.md; launch-critical-pages.md) |
| Livestream | Excluded per CLAUDE.md |
| Advanced analytics pages (`/dashboard/analitik/*`) | Basic revenue view sufficient for launch |
| Creator audience management (`/dashboard/kitle/*`) | Post-launch |
| Advanced creator settings (`/dashboard/ayarlar/*`) | Post-launch |
| Fan account settings (`/account/ayarlar/*`) | Post-launch |
| Account hub page (`/account`) | Redundant at launch; library and memberships cover it |
| Admin billing operations (`/admin/fatura/*`) | Gateway handles disputes directly at MVP |
| Admin user management (`/admin/kullanicilar/*`) | Report-based moderation sufficient at MVP |
| Admin creator detail full page (`/admin/yaraticilar/[creator-id]`) | Inline panel sufficient |
| Audit log viewer (`/admin/denetim-gunlugu`) | Data captured; UI post-launch |
| DMCA / copyright claim UI (`/admin/telif-hakki/*`) | Email-based at MVP |
| Creator reinstatement tooling | DB intervention at MVP |
| Tier upgrade / downgrade flows (`/uyelik/[id]/yuksel`, `/dusur`) | Cancellation only at MVP |
| Subscription pause | Not in Phase 1 scope |
| Gifted memberships | Not in Phase 1 scope |
| Per-invoice PDF receipts | Post-launch |
| Appeals portal | Post-launch |
| Automated content scoring / AI moderation | Post-launch |
| Age verification | Not in Phase 1 scope |
| Affiliate / sponsorship / referral systems | Excluded per CLAUDE.md |
| Payout settlement operations UI | IBAN captured; payout mechanism post-launch |
| Advanced notification preferences | Post-launch |
| Public marketing sub-pages (`/ozellikler`, `/fiyatlar`, `/yaraticilar`, `/hakkimizda`) | Post-launch |
| Resources / blog / changelog (`/kaynaklar/*`, `/guncellemeler/*`) | Post-launch |
| Cookie policy, DMCA policy, Trust & Safety policy pages | Post-launch |
| Post detail page (`/@[username]/gonderi/[post-id]`) | Sub-state of creator page; post-launch |
| Premium post checkout UI | Entity modeled in data-model.md; checkout UI explicitly deferred |
| Community / group systems | Post-launch |

---

## 12. Assumptions / Open Sequencing Decisions

| # | Decision | Impact on Phasing |
|---|---|---|
| S1 | Whether Home page (Family 1) should be scaffolded as a static placeholder in Phase 1 or wait until Phase 4 | Building it early in Phase 1 is low-cost; wiring to live data must wait for Phase 3 content. Recommendation: scaffold shell in Phase 1; wire fully in Phase 4. |
| S2 | Whether product/collection checkout (Families 17, 18) can begin simultaneously with membership checkout (Family 16) in Phase 4, or must be sequenced | They share checkout infrastructure. Recommendation: prove membership checkout gateway integration first, then add product/collection checkout in the same phase. |
| S3 | Whether notification infrastructure ships in Phase 4 (alongside billing events) or as a standalone service in Phase 5 | Billing notification emails are Phase 4 dependencies. In-app notification center UI (Family 15) can wait for Phase 5. Infrastructure must ship with billing events in Phase 4. |
| S4 | Whether Discovery (Family 2) can begin development in Phase 3 or must wait until Phase 4 | Can be scaffolded in Phase 3 once creator content exists, but should not be in public navigation until Phase 4 when the full fan-side experience is ready. |
| S5 | If open decisions M1, M4, M7, M8 remain unresolved at Phase 6 entry | Phase 6 must ship with conservative defaults (M1: flagged content visible; M4: placeholder taxonomy) and be updated at launch readiness. All must be resolved before Milestone 7. |
| S6 | Whether phase boundaries represent sequential team gates or overlapping workstreams | This document assumes sequential phases for dependency clarity. In practice, infrastructure work for a later phase may begin while an earlier phase is being finalized. Integration milestones (§9) are the gates, not phase calendar dates. |

---

## 13. Validation Checklist

- [ ] All 24 page families placed in exactly one recommended phase in §6
- [ ] No page family appears in more than one phase in §6
- [ ] Families 22, 23, 24 (legal) placed in Phase 1 — before auth flows that reference them
- [ ] Families 7 (onboarding) and 20 (admin review) placed in the same phase (Phase 2)
- [ ] Ordering in §5 and §6 aligns with data-model.md entity dependencies
- [ ] Ordering aligns with api-surface.md (API families gated by backend prerequisites)
- [ ] Billing lifecycle ordering aligns with billing-lifecycle.md (checkout → webhook →
  entitlement activation sequence preserved)
- [ ] Dual-status authorization layer placed in Phase 3 (before content is publicly served)
- [ ] `ModerationAction` audit trail placed in Phase 2 (ships with first admin action)
- [ ] Creator approval gate enforced before content publishing and before public page renders
- [ ] Admin moderation queue (Family 21) placed in Phase 6 (requires content and reports
  from earlier phases)
- [ ] All launch blockers in §10 listed including all unresolved open decisions
- [ ] Deferred areas from billing-lifecycle.md §11 and moderation-trust-rules.md §12
  included in §11
- [ ] Chat explicitly absent from all phase descriptions
- [ ] No code, implementation tickets, or project-management fluff produced
