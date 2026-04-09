# Workstream Breakdown — lalabits.art Phase 1

> **Status:** Approved
> **Version:** v1.0
> **Scope:** Phase 1 MVP
> **Authority level:** Canonical

---

## §1 — Document Purpose

This document translates the approved Phase 1 planning set into a concrete workstream
structure for implementation execution. It is derived from all seven approved planning
documents and references `implementation-phasing.md` as the sequencing authority.

This document does not contain code, tickets, or sprint plans. It is the basis for:
- Team track assignments
- Sprint planning inputs
- Workstream-level progress tracking
- Execution dependency conversations

**Upstream documents this workstream breakdown is derived from:**
- `data-model.md` — 25 approved entities and their relationships
- `page-families.md` — 24 approved page families organized into 7 groups
- `permissions-matrix.md` — role and access definitions for all surfaces
- `billing-lifecycle.md` — canonical billing entity state machines and constraints
- `moderation-trust-rules.md` — canonical moderation rules and admin-boundary definitions
- `implementation-phasing.md` — 8 sequential build phases (Phase 0–7) and 7 milestones

**What this document produces:**
- 9 named workstreams (WS1–WS9) with goals, scope, dependencies, and deliverables
- Explicit mapping of all 24 page families to owning workstreams
- Explicit mapping of all 13 backend domain areas to owning workstreams
- Explicit mapping of all 7 frontend surface areas to owning workstreams
- Cross-workstream dependency map
- Launch blocker register by workstream
- Deferred/excluded area list
- Open execution decisions

---

## §2 — Workstream Design Principles

The following eight principles govern how workstreams are structured and how scope
boundaries are drawn.

**Principle 1 — Group by dependency and ownership, not by page or feature.**
A workstream owns a system or domain — not a collection of pages. Pages are the output
of systems, not the unit of organization.

**Principle 2 — Prefer end-to-end vertical slices over broad horizontal layers.**
Each workstream should be capable of delivering a full working capability from backend
to frontend. Horizontal splits (e.g., "backend team" / "frontend team") are an
execution choice, not a workstream structure choice.

**Principle 3 — Separate foundation work from feature-surface work.**
WS1 (Foundations) produces no user-facing output. It exists so that all other
workstreams have a stable, complete technical base to build on. Mixing infrastructure
work into feature workstreams creates drag and dependency uncertainty.

**Principle 4 — Separate core domain work from admin/trust hardening.**
WS7 (Admin Review, Moderation & Trust) must not block WS4 (Content, Memberships &
Commerce). The dual-status authorization layer ships with WS4 in Phase 3. Admin
moderation tooling (Family 21) ships in Phase 6 as hardening, not as a prerequisite
to content publishing.

**Principle 5 — Avoid parallelizing tasks that create entitlement or billing ambiguity.**
WS6 owns the entire checkout → webhook → subscription/purchase → entitlement chain
and must complete it as a coherent unit. Splitting this chain across workstreams would
create gaps in the billing lifecycle that are operationally dangerous.

**Principle 6 — Keep launch blockers visible.**
Each workstream explicitly declares what it blocks and what blocks it. Launch blockers
are collected into §10 so that they remain visible during execution planning, not
discovered at the end.

**Principle 7 — Avoid mixing deferred work into active workstreams.**
Chat, livestream, advanced analytics, payout UI, and all post-launch features are
explicitly excluded from all workstreams. If a deferred area is named in any workstream
description, that is an error.

**Principle 8 — WS8 (Frontend) is a coordination workstream, not an owner.**
WS8 implements the frontend layer for all 24 families. It cannot complete a family
until the backend domain workstream owning that family's API has declared readiness.
WS8 is a consumer of API readiness signals, not a source of them.

---

## §3 — Workstream Summary

Nine workstreams cover the full Phase 1 build:

| WS  | Name                                   | Goal                                                              | Primary Phase(s) | Key Output                                         |
|-----|----------------------------------------|-------------------------------------------------------------------|------------------|----------------------------------------------------|
| WS1 | Foundations & Platform Core            | Technical chassis; no user-facing pages                           | Phase 0          | Running infra; all 25 entities migrated            |
| WS2 | Auth, Identity & Legal Consent         | Users can register, log in, see legal pages                       | Phase 1          | Auth flows + consent capture operational           |
| WS3 | Creator Domain & Onboarding            | Creator can apply; apply/approve/reject cycle works               | Phase 2          | Approved creator with dashboard access             |
| WS4 | Content, Memberships & Commerce Domain | Creator can publish all content types; dual-status layer active   | Phase 3          | Live creator public page; gated content visible    |
| WS5 | Fan Access, Library & Notifications    | Fan can discover, access library, see billing, receive notifications | Phase 4–5      | Full fan-side experience operational               |
| WS6 | Checkout, Billing & Entitlements       | Fan can pay; billing lifecycle end-to-end; entitlement correct    | Phase 4          | Checkout → webhook → subscription/purchase → access |
| WS7 | Admin Review, Moderation & Trust       | Admin can review creators and action all reports/content          | Phase 2, Phase 6 | Creator review queue + full moderation queue       |
| WS8 | Frontend Surfaces & Integration        | All 24 families implemented and wired to backend APIs             | Cross-cutting 1–6 | Every page family functional and integrated       |
| WS9 | Launch Readiness & Stabilization       | All milestones pass; all launch blockers resolved                 | Phase 7          | Platform cleared for public launch                 |

---

## §4 — Detailed Workstreams

---

### WS1: Foundations & Platform Core

**Goal:** Establish the technical chassis that all subsequent workstreams depend on.
WS1 produces no business logic, no API endpoints, and no user-facing pages. Its sole
output is a stable, fully provisioned infrastructure and schema base.

**Included systems:**

- NestJS backend scaffold: module structure, middleware, guards, exception filters,
  global validation pipeline
- Next.js frontend scaffold: App Router structure, layout system, environment config,
  base TypeScript config
- PostgreSQL database schema: all 25 approved entities from `data-model.md` migrated
  to staging and production databases
- Redis: session caching configuration; queue infrastructure for background jobs
- Object storage integration: file upload/download service layer operational in test;
  signed URL generation infrastructure ready
- Email delivery service integration: transactional email infrastructure operational;
  test sends working
- Base auth middleware: JWT strategy and guard infrastructure operational; guards
  reject unauthenticated requests with correct status codes
- Admin auth gate: `is_admin = true` guard wired and enforced — this gate is present
  from Phase 1 onward; no admin route is accessible without it
- CI/CD pipeline: build, test, lint, and deploy stages passing; environment
  configuration and secrets management established

**Excluded systems:**
All business logic; all API endpoints; all user-facing pages. The schema exists;
no queries or mutations are written in WS1.

**Major dependencies:** None. WS1 is the starting point.

**Key deliverables:**
- All 25 data model entities present and correctly typed in staging and production DBs
- Auth guard infrastructure operational and testable in isolation
- File storage upload/download working in test environment
- Email delivery sending successfully in test environment
- CI/CD pipeline passing on main branch

**Blocked by:** Nothing.

**Unblocks:** All other workstreams. No workstream can begin meaningful work until
WS1 is complete.

**Main risks:**
- Schema migration errors caught late (after other workstreams have built against
  an incorrect schema)
- Infrastructure provider setup delays (object storage, email provider, Redis)

**Main validation outcomes:**
All 25 entities present in DB with correct columns and foreign keys; test email
delivers successfully; test file upload returns a retrievable object; test file
download via signed URL works; auth guard rejects a request without a valid JWT.

---

### WS2: Auth, Identity & Legal Consent

**Goal:** Users can register, verify email, log in, reset passwords, and view legal
pages. Legal consent is captured at every registration. This layer unlocks all
subsequent user-dependent flows.

**Included systems:**

- User registration: fan entry point (Family 4) and creator entry point (Family 5
  initial step — full onboarding is WS3)
- Email/password login and session management (Family 3): JWT issuance, session
  invalidation, refresh token handling
- Email verification flow: `User.email_verified_at` set on verification; verification
  link delivered via transactional email
- Password reset (Family 6): reset link delivery, token expiry, password update
- `ConsentRecord` creation: at every registration, records created for
  `terms_of_service` and `privacy_policy`; creator agreement consent recorded at
  onboarding step 5 (WS3)
- Legal pages rendered and accessible: Terms of Service (Family 22), Privacy Policy
  (Family 23), Creator Agreement (Family 24); linked from auth flows at correct points
- Transactional emails: email verification, password reset

**Excluded systems:**
Creator dashboard, onboarding wizard, any content management, any billing or checkout
operation.

**Major dependencies:**
WS1 (auth middleware, User entity, ConsentRecord entity, email service, DB schema).

**Key deliverables:**
- Fan can register, receive verification email, verify email, log in, reset password
- `ConsentRecord` records created for `terms_of_service` and `privacy_policy` at
  every registration
- Legal pages 22, 23, 24 render correctly and are linked from auth flows
- Creator signup entry point (Family 5) renders; full onboarding flow is WS3
- Email verification guard enforced on routes that require `email_verified_at IS NOT NULL`

**Blocked by:** WS1 complete.

**Unblocks:**
- WS3: creator onboarding requires an authenticated creator with verified email
- WS6: checkout flow requires `email_verified_at IS NOT NULL` as a pre-checkout guard

**Main risks:**
- Email delivery rate-limiting or deliverability issues in test environment
- Social auth is deferred — ensure password auth is complete and solid; do not leave
  gaps that social auth "will fix later"

**Main validation outcomes:**
Milestone 1 (Identity Foundation Ready) from `implementation-phasing.md §9`:
fan registers → verifies email → logs in → resets password; `ConsentRecord` rows
present in DB after each registration; legal pages 22, 23, 24 accessible and linked.

---

### WS3: Creator Domain & Onboarding

**Goal:** Creator can complete onboarding and submit an application. The first
meaningful vertical slice of the platform: creator applies → admin reviews → admin
approves → creator gains dashboard access.

WS3 and WS7 are co-dependent in Phase 2. WS3 produces the application submission;
WS7 produces the review queue that actions it. Neither is useful without the other.
They must ship together in Phase 2.

**Included systems:**

- Creator onboarding wizard — all 6 steps (Family 7):
  - Step 1: Profile (display name, bio, avatar upload)
  - Step 2: Category selection
  - Step 3: Tier configuration (initial `MembershipPlan` records; not yet published)
  - Step 4: IBAN capture (`iban_format_valid` validation; full IBAN encrypted at rest)
  - Step 5: Creator Agreement acceptance (`ConsentRecord` for `creator_agreement`)
  - Step 6: Confirmation / submission
- `CreatorProfile` entity: status state machine (`draft → pending_review → approved /
  rejected / suspended`); `CreatorProfile.status = approved` is the gate for all
  creator content work in WS4
- `CreatorApplication` entity: decision, admin_note, IBAN encrypted, timestamp
- `MembershipPlan` entity: initial configuration from onboarding step 3; plans are
  not yet published; publishing is WS4
- `ConsentRecord` for `creator_agreement` written at onboarding step 5
- IBAN format validation: `iban_format_valid` boolean set; full IBAN string encrypted
  at rest; raw IBAN never returned to non-admin callers
- `/dashboard` route gate: accessible only when `CreatorProfile.status = approved`;
  pending and rejected states show correct informational views
- `/@[username]` returns `404` for all non-approved creators; this gate must be
  enforced before any creator public page content is served
- Creator dashboard shell (Family 9) — structural scaffold only; gated to approved
  status; real dashboard data is WS4
- Creator signup → onboarding handoff: Family 5 entry point renders and routes to
  Family 7 onboarding wizard after email verification

**Excluded systems:**
Content creation, post management, product management, collection management, any
fan-facing surface, billing, checkout.

**Major dependencies:**
- WS2: authenticated creator with `email_verified_at IS NOT NULL`
- WS7: admin creator review queue must be operational to action submitted applications;
  approved creator is the output of WS3 + WS7 working together
- Family 24 (Creator Agreement) must render: WS2 deliverable

**Key deliverables:**
- Creator completes all 6 onboarding steps and submits application
- `CreatorProfile.status → pending_review` on submission
- Approved creator gains `/dashboard` access with correct permissions
- Non-approved creator sees correct pending/rejected state in dashboard
- `/@[username]` returns `404` for any creator whose `status ≠ approved`
- `ConsentRecord` for `creator_agreement` written at step 5

**Blocked by:**
WS2 complete; WS7 creator review queue operational. WS3 and WS7 deliver Phase 2
together — neither unblocks WS4 without the other.

**Unblocks:**
WS4: creator content creation requires `CreatorProfile.status = approved`.

**Main risks:**
- Multi-step onboarding wizard state management (step persistence, back navigation,
  partial saves)
- IBAN encryption implementation (key management, at-rest encryption correctness)

**Main validation outcomes:**
Milestone 2 (Creator Can Apply and Be Approved) from `implementation-phasing.md §9`.

---

### WS4: Content, Memberships & Commerce Domain

**Goal:** Approved creators can publish all content types, configure and publish
membership plans, upload digital products, and create collections. The dual-status
content visibility authorization layer is active and enforced before any content is
publicly served.

**Included systems:**

- `Post` entity: `publish_status` (draft/scheduled/published/archived),
  `moderation_status` (active/flagged/removed), `access_level` (free/members_only/
  tier_gated), scheduling job for future-published posts
- `PostAttachment` entity: `storage_key` never returned raw; signed URL generation
  for all attachment access
- `MembershipPlan` entity: publish/archive lifecycle; tier price and perk configuration;
  `MembershipPlan.status = published` required for checkout (WS6)
- `Product` entity: `publish_status`, `moderation_status`, `file_storage_key`;
  signed URL generation for product file downloads; `Product.status = published`
  required for product checkout (WS6)
- `Collection` entity: `access_type` (free/paid), `publish_status`, `moderation_status`
- `CollectionItem` join entity: item ordering and membership
- Creator public page — full tab structure (Family 8): feed tab, tiers tab, shop tab,
  collections tab; wired to live published content
- Creator dashboard with real data (Family 9): revenue stub, active member count,
  recent content activity
- Posts management (Family 10): create, edit, publish, schedule, archive
- Membership Plans management (Family 11): create, edit, publish, archive tiers
- Products & Collections management (Family 12): create, upload, publish, manage

- **Dual-status authorization layer** (WS4 responsibility — not WS7):
  All content read endpoints evaluate both `publish_status` AND `moderation_status`
  before returning content:
  - `moderation_status = removed` is an absolute override — content is never served
    regardless of `publish_status` or subscription status
  - `CreatorProfile.status = suspended` causes all of that creator's content to
    return `404` to all non-admin callers immediately
  - The dual-status check precedes entitlement checks (WS6's entitlement layer
    operates on top of this, not instead of it)
  - This layer must be in place before any content is publicly served in Phase 3

**Excluded systems:**
Fan checkout flow (WS6); entitlement enforcement against purchases (WS6); fan library
(WS5); in-app notifications (WS5); admin moderation action UI (WS7) — WS4 enforces
the visibility effects of moderation decisions but does not implement admin tooling.

**Major dependencies:**
- WS3: `CreatorProfile.status = approved` required before any content can be published
- WS1: object storage for file uploads (posts, products)

**Key deliverables:**
- Approved creator can publish posts of all access levels (free, members-only, tier-gated)
- Approved creator can publish products and collections
- Creator public page `/@[username]` renders live published content
- Dual-status authorization layer enforced at API level on all content read endpoints
- Gated content returns paywall/CTA response to unauthorized fans; checkout is not
  yet wired in Phase 3 but the gating is correct
- Storage keys never returned raw to any caller; signed URL service operational
- `/@[username]` still returns `404` for any creator whose `status ≠ approved`
- Scheduled post publishing job running and verified

**Blocked by:**
WS3 Phase 2 complete (approved creator must exist before content can be published).

**Unblocks:**
- WS6: checkout requires published membership plans and published products/collections
- WS5: discovery and library require published content to exist
- WS7 Phase 6: moderation queue requires content with `moderation_status` fields and
  live content to act on

**Main risks:**
- Dual-status authorization layer complexity: many combinations of status values;
  must be exhaustively tested before Phase 3 content goes live
- Scheduled post publishing job timing and reliability
- Signed URL expiry and refresh logic under concurrent access

**Main validation outcomes:**
Milestone 3 (Creator Can Publish Monetizable Content) from `implementation-phasing.md §9`.

---

### WS5: Fan Access, Library & Notifications

**Goal:** Fan can discover creators, access their content library, view and manage
membership and billing status, and receive in-app notifications from billing and
moderation events.

**Included systems:**

- Home page (Family 1): fully wired to live creator and published content data;
  featured and category-organized creator listings
- Discovery page (Family 2): creator browsing with category filter, search, and
  pagination
- Fan library page (Family 13): unlocked posts (free and member-accessible);
  purchased products with signed URL download links; purchased collections;
  entitlement-gated access enforced via WS6 entitlement layer
- Fan memberships and billing page (Family 14): active subscriptions with status
  and renewal date; billing history (Invoice records); `PaymentMethodSummary` display
  and update flow; cancellation flow link (Family 19 is WS6)
- In-app notification center (Family 15): `Notification` records rendered and
  paginated; mark-as-read; notification types include billing events, moderation
  events, and creator approval status changes
- `Notification` entity and delivery infrastructure: in-app notification records
  created by triggering events across workstreams; email notification delivery for
  key events
  - Billing events from WS6: payment succeeded, payment failed, subscription cancelled,
    subscription expired
  - Moderation events from WS7: content removed, creator restricted, creator suspended
  - Creator events from WS3: creator application approved, creator application rejected
- Report submission: `POST /reports` endpoint with 24-hour duplicate guard enforced
  at backend; report submission UI accessible from content surfaces; moderation queue
  UI is WS7

**Excluded systems:**
Checkout flow (WS6); entitlement enforcement server-side logic (WS6); moderation
queue UI (WS7).

**Major dependencies:**
- WS4: published content must exist for discovery and library to be meaningful
- WS6: purchase and subscription records must exist for library entitlement checks
  and billing views; signed URL generation for product downloads requires WS6
  entitlement check to have passed

**Key deliverables:**
- Fan can discover creators on Home and Discovery pages with live data
- Fan can access library: unlocked posts, purchased products (download), purchased
  collections — all entitlement-gated correctly
- Fan sees active subscription status, billing history, and payment method in account
  pages
- In-app notification center renders billing and moderation events correctly
- Fan can submit a report from content surfaces; 24-hour duplicate guard enforced

**Blocked by:**
WS4 (published content) for discovery; WS6 (purchase records and entitlement layer)
for library and billing views.

**Unblocks:**
WS7 Phase 6: the report queue is only meaningful once fans can submit reports via WS5.

**Main risks:**
- Entitlement enforcement correctness is a tight dependency on WS6; library access
  must be verified against all entitlement states before Phase 5 ships
- Fan library UI state when moderation removes previously accessible content (open
  decision M1 / M2 from `moderation-trust-rules.md`)

**Main validation outcomes:**
Milestone 5 (Fan Can Access Entitlements) from `implementation-phasing.md §9`.

---

### WS6: Checkout, Billing & Entitlements

**Goal:** Fan can complete checkout for memberships, products, and collections.
The billing lifecycle works end-to-end: checkout → webhook → subscription/purchase
record → entitlement activation. Cancellation and grace-period lifecycle work correctly.
Entitlement enforcement is correct at every request.

**Included systems:**

- Payment gateway integration: external provider; production-ready configuration;
  webhook endpoint registered (open decision B5 — provider must be selected before
  WS6 can complete)
- `BillingCustomer` entity: created on first checkout; `gateway_customer_id` stored
- `PaymentMethodSummary` entity: display-only data; no raw card data stored by
  lalabits.art at any point
- `Order` entity: status enum (pending/completed/failed/refunded); `order_type`;
  `gateway_transaction_id`; immutable after terminal state
- `Invoice` entity: immutable after creation; linked to subscription renewal events
- `MembershipSubscription` entity: full state machine per `billing-lifecycle.md §4.3`:
  `active → cancelled → expired`; `grace_period` state on renewal failure;
  `grace_period_ends_at` set on `payment_failed` renewal event
- `ProductPurchase` entity: `access_revoked_at` null-checked for entitlement
- `CollectionPurchase` entity: `access_revoked_at` null-checked for entitlement
- `PostPurchase` entity: modeled; premium post checkout UI deferred

Checkout flows:
- Membership checkout (Family 16): initiation → `Order (pending)` created → gateway
  payment intent → fan completes payment on gateway → webhook → confirmation/error
- Product checkout (Family 17): same pattern; `ProductPurchase` created by webhook
- Collection checkout (Family 18): same pattern; `CollectionPurchase` created by webhook
- Cancellation flow (Family 19): cancellation preview → billing disclosure → confirm →
  `MembershipSubscription.status → cancelled`; access to `current_period_end`

Webhook handler (`POST /webhooks/billing`):
- Signature validation on every inbound webhook
- `event_id` idempotency deduplication: duplicate events produce no side effects
- `payment_succeeded` (initial): `Order → completed`; `MembershipSubscription`
  or purchase record created with `status = active`
- `payment_failed` (initial): `Order → failed`
- `payment_succeeded` (renewal): subscription period updated; `Invoice` created
- `payment_failed` (renewal): `MembershipSubscription.status → grace_period`;
  `grace_period_ends_at` set

Scheduled jobs:
- `cancelled → expired`: runs after `MembershipSubscription.current_period_end`
- `grace_period → expired`: runs after `MembershipSubscription.grace_period_ends_at`

Entitlement enforcement (evaluated at request time from live entity state — not cached):
- `MembershipSubscription`: `status = active` AND `current_period_end > now()` AND
  tier-matching for tier-gated content
- `ProductPurchase`: `access_revoked_at IS NULL`
- `CollectionPurchase`: `access_revoked_at IS NULL`
- Moderation override check from WS4 precedes entitlement check — removed content
  is never served even to entitled fans
- Signed URL generation for product downloads: only after entitlement check passes

Pre-checkout guards:
- `User.email_verified_at IS NOT NULL`
- `CreatorProfile.status = approved`
- Plan/product `publish_status = published`
- `SUBSCRIPTION_EXISTS` duplicate check prevents concurrent duplicate subscriptions

**Excluded systems:**
Admin billing operations; refund processing; payout operations; dispute handling;
tax/KDV engine — all explicitly deferred (`billing-lifecycle.md §11`).

**Major dependencies:**
- WS4: published membership plans, products, and collections must exist before
  checkout can be attempted
- WS2: `email_verified_at IS NOT NULL` guard requires WS2's verification flow
- Payment gateway provider must be selected (open decision B5)

**Key deliverables:**
- Membership checkout completes end-to-end; `MembershipSubscription (active)` created
  by webhook — not by checkout initiation
- Product and collection checkouts complete; purchase records created by webhook
- Fan can cancel; `cancelled` status set; access maintained to `current_period_end`
- Renewal webhook processing works: period extended or grace period triggered correctly
- Scheduled expiry jobs running and verified in staging
- Entitlement evaluated correctly at request time under all subscription states

**Blocked by:**
WS4 (published content must exist); payment gateway integration (external dependency
on provider selection).

**Unblocks:**
- WS5: library and billing views require purchase and subscription records to exist
- WS9: launch readiness requires billing lifecycle to be verified end-to-end

**Main risks:**
- Webhook idempotency gaps: duplicate events creating duplicate subscription or
  purchase records
- Grace period and expiry job timing: off-by-one errors on period boundary calculations
- Entitlement evaluation correctness under all subscription state combinations
- Payment gateway production configuration and approval timeline (open decisions B1,
  B5, B6)

**Main validation outcomes:**
Milestone 4 (Fan Can Subscribe and Purchase) and Milestone 5 (Fan Can Access
Entitlements) from `implementation-phasing.md §9`.

---

### WS7: Admin Review, Moderation & Trust

**Goal:** Admin can review creator applications, action all user-submitted reports,
manage flagged content, and take moderation actions on content and accounts. The
platform is operationally safe to run publicly.

WS7 ships in two phases:
- **Phase 2:** Creator review queue (Family 20) — ships with WS3 as a co-dependent
- **Phase 6:** Full moderation hub (Family 21) — ships after content and reports exist

**Included systems:**

Phase 2 (Family 20):
- Admin overview dashboard `/admin`: operational counters; entry to all admin areas
- Creator review queue `/admin/yaraticilar/inceleme`: list of pending applications
  with inline review panel; profile, category, tier config, IBAN visible to admin
- Admin actions on creator applications: approve, reject (with reason), suspend
- `ModerationAction` entity: ships with the **first** admin action in Phase 2;
  non-deferrable; every admin write creates a `ModerationAction` record or the entire
  transaction rolls back
- Audit trail: every admin write that changes system state creates a `ModerationAction`
  record linking `admin_id`, `target_type`, `target_id`, `action_type`,
  `admin_note`, and timestamp
- Creator notification emails: approval (with dashboard link), rejection (with reason
  and resubmit CTA), suspension
- `/@[username]` and all creator content returns `404` immediately on suspension —
  this effect is enforced by WS4's dual-status layer

Phase 6 (Family 21):
- `Report` entity: `status` state machine (open/under_review/resolved/dismissed)
- Moderation hub `/admin/moderasyon`: summary view and navigation
- Report queue `/admin/moderasyon/raporlar`: all open and under-review reports;
  filterable by type and status
- Report detail `/admin/moderasyon/raporlar/[report-id]`: full report context;
  reported content preview; action buttons
- Flagged content queue `/admin/moderasyon/icerik`: content with
  `moderation_status = flagged`; inline action panel
- All moderation actions: warn creator, flag content, clear flag, remove content,
  restrict creator, suspend creator, dismiss report
- Admin overview counters updated: open report count, flagged content count
- `admin_note` on all `ModerationAction` records: never returned to non-admin callers
- Moderation notification emails: content removed, creator restricted, creator suspended

**Excluded systems:**
Admin billing operations; user management list/detail; creator detail full page;
audit log viewer UI; DMCA/copyright claim UI; creator reinstatement tooling — all
explicitly deferred (`moderation-trust-rules.md §11.6, §12`).

**Major dependencies:**

Phase 2:
- WS1: `ModerationAction` entity schema must exist in DB
- WS2: admin auth gate (`is_admin = true` guard) must be enforced

Phase 6:
- WS4: content with `moderation_status` fields must exist and be live
- WS5: `POST /reports` endpoint must be operational; reports must exist in DB

**Key deliverables (Phase 2):**
- Admin can view pending creator applications and action each with approve/reject/suspend
- `ModerationAction` record created for every admin action; rollback if creation fails
- Approved creator gains `/dashboard` access; rejected creator sees reason and resubmit CTA
- Creator suspension hides all creator content immediately (enforced by WS4)

**Key deliverables (Phase 6):**
- Admin can review and action all user-submitted reports
- Admin can flag, clear flag, and remove content from the flagged content queue
- All actions create `ModerationAction` records; `admin_note` never returned to
  non-admin callers

**Blocked by (Phase 2):** WS1 (entity schema), WS2 (admin auth gate).
**Blocked by (Phase 6):** WS4 (live content), WS5 (report submissions operational).

**Unblocks (Phase 2):**
WS3: creator approval from WS7 enables the approved creator state that WS4 requires.

**Unblocks (Phase 6):**
WS9: moderation must be fully operational before launch.

**Main risks:**
- `ModerationAction` transaction atomicity: admin write and audit record must be
  atomic; partial writes are not acceptable
- Concurrent admin actions on the same creator application (two admins actioning
  the same pending application simultaneously)
- Creator suspension propagation: all content endpoints must respond to suspension
  immediately without requiring cache flush

**Main validation outcomes:**
Milestone 2 (Creator Can Apply and Be Approved) for Phase 2; Milestone 6 (Moderation
Queue Operational) for Phase 6, from `implementation-phasing.md §9`.

---

### WS8: Frontend Surfaces & Integration

**Goal:** Implement all 24 approved page families as functional, integrated frontend
surfaces wired to their backend APIs. Ensure responsive behavior across desktop,
tablet, and mobile.

WS8 is a coordination workstream. It does not own any backend domain — it is the
consumer of API readiness signals from WS2–WS7. WS8 cannot mark a family as complete
until the domain workstream owning that family's backend API has declared readiness.

**Included systems:**

- Frontend implementation of all 24 approved page families
- API integration layer: typed API clients; error state handling; loading state
  handling; retry logic for transient failures
- Responsive layout implementation for all approved breakpoints: desktop, laptop,
  tablet, mobile; no critical feature may depend on desktop-only interaction
- Shared UI component system: design system aligned with brand palette from `CLAUDE.md`
  (Lala Turquoise `#008080`; Neon Bit Orange `#FF5722`; Pearl White `#F8F9FA`;
  Charcoal Black `#212121`)
- Turkish-first copy and Turkish route structure throughout

**Excluded systems:**
Any page, route, or feature outside the approved 24 families; chat; livestream;
mobile-specific native app patterns; any new features not in the approved scope.

**Major dependencies:**
All other workstreams. WS8 is progressively unblocked as each domain workstream
declares API readiness for its families.

**Sequencing (aligned with `implementation-phasing.md §8.3`):**

- **Phase 1:** Legal pages (22, 23, 24) → Login (3) → Fan Signup (4) →
  Creator Signup entry (5) → Password Reset (6)
- **Phase 2:** Creator Onboarding wizard (7) → Admin creator review queue (20)
- **Phase 3:** Creator Dashboard (9) → Posts Management (10) → Membership Plans (11)
  → Products & Collections (12) → Creator Public Page (8)
- **Phase 4:** Home (1) → Discovery (2) → Membership Checkout (16) →
  Product Checkout (17) → Collection Checkout (18) → Cancellation Flow (19)
- **Phase 5:** Library (13) → Memberships & Billing (14) → Notifications (15)
- **Phase 6:** Admin Moderation hub, Report queue, Report detail, Flagged content
  queue (all Family 21)

**Blocked by:**
WS1 (scaffold infrastructure and base layout system must exist); then progressively
unblocked by each domain workstream's API readiness signal.

**Unblocks:**
WS9: launch readiness requires all 24 families functional and integrated.

**Main risks:**
- API shape drift between domain workstreams and WS8 integration (API contracts must
  be agreed before WS8 begins wiring each family)
- Responsive behavior gaps discovered late in the build cycle
- TypeScript type mismatches from API contract changes

**Main validation outcomes:**
All 24 families functional in staging; cross-device tested across desktop, tablet,
and mobile; all integration tests passing for each family.

---

### WS9: Launch Readiness & Stabilization

**Goal:** All integration milestones verified, all launch gate checks passed, all
launch-blocker open decisions resolved. Platform cleared for public launch.

WS9 is the terminal workstream. It begins only after all other workstreams declare
their deliverables complete.

**Included systems:**

- End-to-end billing lifecycle test: checkout → webhook → subscription → renewal →
  grace period trigger → expiry job → re-subscribe; verified in staging with real
  gateway event replay
- End-to-end moderation lifecycle test: fan submits report → admin actions report →
  visibility change propagated → fan library state updated
- Legal consent verification: `ConsentRecord` rows present in DB for every test
  registration and onboarding completion
- Cross-browser and cross-device responsiveness: all 24 families tested on desktop,
  tablet, and mobile across major browsers
- Payment gateway production configuration: Turkish provider configured; production
  webhook endpoint registered and verified; webhook signature validation in production
- At least one real-money TRY transaction: subscription purchase completed in
  production environment
- Scheduled job verification in production: expiry and grace-period jobs confirmed
  running on production scheduler
- Email delivery verification in production: transactional emails delivered to real
  addresses from production email service
- All §10 launch blockers from `implementation-phasing.md` resolved and checked
- All launch-blocker open decisions resolved: M1, M4, M7, M8, B1, B5, D1, B9

**Excluded systems:**
Any new features; chat; analytics; post-launch tooling.

**Major dependencies:**
All workstreams WS1–WS8 complete.

**Key deliverables:**
Platform cleared for public launch. All 7 milestones from `implementation-phasing.md §9`
verified in production or production-equivalent staging.

**Blocked by:** All other workstreams.

**Unblocks:** Nothing. WS9 is the terminal workstream.

**Main risks:**
- Open decisions M7 (gateway renewal on suspension), B5 (payment gateway provider),
  D1 (unpublish access policy) not resolved before WS9 begins
- Production environment divergence from staging: environment-specific configuration
  gaps discovered only at production verification
- Payment gateway production approval timeline: provider approval processes may
  extend beyond engineering timelines

**Main validation outcomes:**
All 7 milestones from `implementation-phasing.md §9` verified; all 12 launch
blockers from §10 of this document cleared.

---

## §5 — Mapping to Build Phases

Each workstream maps to one or more build phases from `implementation-phasing.md`.

| WS  | Primary Phase(s)     | Secondary          | Why                                                                     | Enables                          |
|-----|----------------------|--------------------|-------------------------------------------------------------------------|----------------------------------|
| WS1 | Phase 0              | —                  | Starting point; all infra and schema before any feature work can begin  | All WS                           |
| WS2 | Phase 1              | —                  | Auth and legal consent before any user-dependent flow can begin         | WS3, WS6                         |
| WS3 | Phase 2              | Phase 3 (dashboard)| Creator profile gate required before content publishing begins          | WS4                              |
| WS4 | Phase 3              | —                  | Content publishing requires an approved creator from WS3                | WS5, WS6, WS7                    |
| WS5 | Phase 4–5            | —                  | Fan-side requires published content (Phase 3) and purchases (Phase 4)   | WS9                              |
| WS6 | Phase 4              | Phase 5 (entitlement) | Checkout requires published content from WS4                         | WS5, WS9                         |
| WS7 | Phase 2 + Phase 6    | —                  | Creator review ships Phase 2; moderation queue ships Phase 6            | WS3 (Phase 2); WS9 (Phase 6)     |
| WS8 | Cross-cutting 1–6    | —                  | Frontend layer of all domain workstreams; wires each phase as APIs ready | WS9                             |
| WS9 | Phase 7              | —                  | Terminal; verifies all previous phases before launch                    | Launch                           |

---

## §6 — Mapping to Page Families

All 24 approved page families mapped to their primary owning workstream. Secondary
workstream indicates a significant contribution (e.g., frontend wiring or shared
backend dependency), not equal ownership.

| #  | Family Name              | Primary WS | Secondary WS    | Phase |
|----|--------------------------|------------|-----------------|-------|
| 22 | Terms of Service         | WS2        | WS8             | 1     |
| 23 | Privacy Policy           | WS2        | WS8             | 1     |
| 24 | Creator Agreement        | WS2        | WS3, WS8        | 1     |
| 3  | Login                    | WS2        | WS8             | 1     |
| 4  | Fan Signup               | WS2        | WS8             | 1     |
| 5  | Creator Signup           | WS2        | WS3, WS8        | 1–2   |
| 6  | Password Reset           | WS2        | WS8             | 1     |
| 7  | Creator Onboarding       | WS3        | WS8             | 2     |
| 20 | Creator Review Queue     | WS7        | WS8             | 2     |
| 8  | Creator Public Page      | WS4        | WS8             | 3     |
| 9  | Creator Dashboard        | WS4        | WS3, WS8        | 3     |
| 10 | Posts Management         | WS4        | WS8             | 3     |
| 11 | Membership Plans         | WS4        | WS3, WS8        | 3     |
| 12 | Products & Collections   | WS4        | WS8             | 3     |
| 1  | Home                     | WS5        | WS8             | 4     |
| 2  | Discovery                | WS5        | WS8             | 4     |
| 16 | Membership Checkout      | WS6        | WS8             | 4     |
| 17 | Product Checkout         | WS6        | WS8             | 4     |
| 18 | Collection Checkout      | WS6        | WS8             | 4     |
| 19 | Cancellation Flow        | WS6        | WS8             | 4     |
| 13 | Library                  | WS5        | WS6, WS8        | 5     |
| 14 | Memberships & Billing    | WS5        | WS6, WS8        | 5     |
| 15 | Notifications            | WS5        | WS4, WS8        | 5     |
| 21 | Moderation & Reports     | WS7        | WS8             | 6     |

**Notes on secondary ownership:**
- Family 24 (Creator Agreement): WS2 owns rendering; WS3 owns the consent capture
  at onboarding step 5
- Family 5 (Creator Signup): WS2 owns the signup entry point; WS3 owns the handoff
  to onboarding and the full onboarding wizard
- Family 9 (Creator Dashboard): WS3 owns the dashboard shell and access gate;
  WS4 owns the real data wiring in Phase 3
- Family 11 (Membership Plans): WS3 owns initial tier configuration in onboarding;
  WS4 owns the published plan lifecycle and management UI
- Families 13, 14 (Library; Memberships & Billing): WS5 owns the UI; WS6 owns the
  entitlement and purchase record backend that these views depend on

---

## §7 — Mapping to Backend / Domain Areas

Thirteen backend domain areas mapped to their owning workstream(s). Where two
workstreams share ownership, the lead workstream is listed first.

| Domain Area                     | Owning WS   | Key Dependencies                                         | Entities / Systems Touched                          |
|---------------------------------|-------------|----------------------------------------------------------|----------------------------------------------------|
| Auth / session management       | WS2         | WS1 (JWT infra, User entity)                             | User, session tokens, JWT guards                   |
| Legal consent                   | WS2         | WS1 (ConsentRecord entity)                               | ConsentRecord                                      |
| User / profile domain           | WS2, WS3    | WS1 (User entity), WS2 (auth layer)                      | User, CreatorProfile, account_status               |
| Creator application / review    | WS3, WS7    | WS2 (auth), WS1 (ModerationAction entity)                | CreatorApplication, ModerationAction               |
| Posts / content domain          | WS4         | WS3 (approved creator), WS1 (storage)                   | Post, PostAttachment, dual-status layer            |
| Membership plans / subscriptions | WS4, WS6   | WS3 (creator), WS4 (published plans), WS6 (billing)     | MembershipPlan, MembershipSubscription             |
| Products                        | WS4, WS6    | WS3 (creator), WS1 (storage), WS6 (checkout)            | Product, ProductPurchase                           |
| Collections                     | WS4, WS6    | WS3 (creator), WS6 (checkout)                           | Collection, CollectionItem, CollectionPurchase     |
| Notifications                   | WS5         | WS4 (content events), WS6 (billing events), WS7 (mod events) | Notification entity, email delivery           |
| Orders / invoices / webhooks    | WS6         | WS4 (published content), payment gateway                | Order, Invoice, webhook handler                    |
| Entitlement enforcement         | WS6         | WS4 (dual-status layer), WS6 (purchase records)         | Auth layer, signed URL generation                  |
| Moderation / reports            | WS7         | WS4 (content with moderation_status), WS5 (reports)     | Report, ModerationAction                           |
| Admin surfaces                  | WS7         | WS2 (is_admin gate), WS1 (ModerationAction entity)      | Families 20, 21; admin route guards                |

---

## §8 — Mapping to Frontend Surface Areas

Seven frontend surface areas mapped to their primary owning workstream. WS8
implements all 24 families; the owning workstream here refers to the backend domain
that determines API readiness for that surface area.

| Surface Area                                                                | Owning WS           | Backend Dependencies                                                | Sequencing Notes                              |
|-----------------------------------------------------------------------------|---------------------|---------------------------------------------------------------------|-----------------------------------------------|
| Legal / trust surfaces (ToS, Privacy, Creator Agreement)                    | WS2                 | WS1 infra                                                           | Phase 1 — earliest frontend deliverable       |
| Auth surfaces (Login, Fan Signup, Creator Signup entry, Password Reset)     | WS2                 | WS1 (auth middleware, email service)                                | Phase 1                                       |
| Creator onboarding surface                                                  | WS3                 | WS2 (auth, email verified); WS1 (storage for avatar)               | Phase 2                                       |
| Admin creator review surface                                                | WS7                 | WS2 (admin auth gate); WS1 (ModerationAction schema)               | Phase 2 — co-ships with WS3                   |
| Creator content surfaces (Dashboard, Posts, Plans, Products, Public Page)   | WS4                 | WS3 (approved creator); WS1 (storage); WS4 content APIs            | Phase 3                                       |
| Public / discovery surfaces (Home, Discovery)                               | WS5                 | WS4 (published content, approved creators)                          | Phase 4                                       |
| Checkout / billing surfaces (Membership, Product, Collection, Cancellation) | WS6                 | WS6 backend; payment gateway; WS4 (published content)              | Phase 4                                       |
| Fan / member account surfaces (Library, Memberships & Billing, Notifications) | WS5               | WS6 (purchase records, entitlement); WS4 (notification events)     | Phase 5                                       |
| Admin moderation surfaces (Moderation hub, Report queue, Flagged content)   | WS7                 | WS4 (live content with moderation_status); WS5 (reports)           | Phase 6                                       |

---

## §9 — Cross-Workstream Dependencies

Critical dependency relationships that must be respected for execution to succeed.
These are hard gates — not coordination preferences.

**WS1 → ALL**
Nothing can start without the database schema, infrastructure, and auth middleware
from WS1. All other workstreams depend on WS1 being complete before any meaningful
work begins.

**WS2 → WS3**
Creator onboarding requires an authenticated creator with `email_verified_at IS NOT NULL`.
WS2's email verification flow must be complete before WS3's onboarding wizard can
be wired end-to-end.

**WS2 → WS6**
Checkout flow enforces `email_verified_at IS NOT NULL` as a pre-checkout guard.
WS2's verification infrastructure must be in place before WS6's checkout can enforce
this guard correctly.

**WS3 ↔ WS7 (Phase 2) — mutual dependency**
WS3 produces creator applications; WS7 produces the review queue that actions them.
Neither workstream's Phase 2 deliverable is useful without the other. They must
ship together. This is the only bidirectional dependency in the workstream map.

**WS7 (Phase 2) → WS3**
Creator approval from WS7 sets `CreatorProfile.status = approved`. This approved
state is WS3's terminal output and WS4's entry condition. WS4 cannot begin until
at least one approved creator exists — which requires WS7's Phase 2 review queue
to be operational.

**WS3 → WS4**
Content publishing requires `CreatorProfile.status = approved`. WS3's approved
creator output is WS4's entry condition.

**WS4 → WS5**
Discovery and library require published content to exist. Home and Discovery pages
(WS5) return empty or near-empty results until WS4 has published creators and content.
WS5's library entitlement check also requires WS4's dual-status layer to be in place.

**WS4 → WS6**
Checkout requires published membership plans, published products, and published
collections. WS4 must have completed plan and product publishing before WS6's
checkout flows can be fully tested.

**WS4 → WS7 (Phase 6)**
The moderation queue requires content with `moderation_status` fields and live
content to act on. WS7's Phase 6 deliverables cannot be meaningfully tested until
WS4 has live content in the platform.

**WS4 dual-status layer → WS6 entitlement**
The moderation visibility check precedes the entitlement check in the authorization
sequence. WS4's dual-status layer must be in place and correct before WS6's
entitlement logic can be considered correct — a removed-content bypass is a
security issue, not just a UI issue.

**WS6 → WS5**
Fan library and billing views require purchase and subscription records to exist.
WS5's library entitlement checks and billing history rendering require WS6's
purchase records and entitlement layer to be operational.

**WS5 → WS7 (Phase 6)**
The report queue is only meaningful once fans can submit reports. WS5's `POST /reports`
endpoint and report submission UI must be operational before WS7's Phase 6 moderation
queue becomes testable with real data.

**ALL → WS9**
Launch readiness requires all workstreams WS1–WS8 to have declared their deliverables
complete. WS9 cannot begin its verification work until all other workstreams are done.

---

## §10 — Launch Blocker Register

The following workstream deliverables are absolute launch blockers. The platform must
not go live if any of these items is unresolved.

| #  | Blocker                                                         | Owning WS     | Status if Missing                                                     |
|----|-----------------------------------------------------------------|---------------|-----------------------------------------------------------------------|
| L1 | Creator approval flow not operational                           | WS3 + WS7     | Creators cannot go live; no content on platform                       |
| L2 | Dual-status authorization layer not in place                    | WS4           | Removed content could be served to fans                               |
| L3 | `ModerationAction` audit trail not shipping with first action   | WS7           | No audit trail for any admin action from Phase 2 onward               |
| L4 | Checkout → webhook → subscription/purchase creation not working | WS6           | No fan can subscribe or purchase; platform has no revenue             |
| L5 | Webhook idempotency not implemented                             | WS6           | Duplicate subscriptions or purchases on gateway event replay          |
| L6 | Entitlement enforcement not correct at request time             | WS6           | Gated content served without valid subscription or purchase           |
| L7 | Grace period and expiry scheduled jobs not running              | WS6           | Expired subscriptions retain access indefinitely                      |
| L8 | Moderation action path for content missing (Family 21)          | WS7           | No mechanism to remove violating content after launch                 |
| L9 | `/@[username]` accessible for non-approved creators             | WS3           | Pre-approval content or profile data leaks to public                  |
| L10 | Legal consent capture missing at any registration entry point  | WS2           | KVKK compliance gap; all registrations non-compliant                  |
| L11 | Admin auth gate not enforced on all `/admin/*` routes           | WS2 + WS7     | Admin routes publicly accessible without authentication               |
| L12 | Launch-blocker open decisions unresolved                        | WS9 coordination | M1, M4, M7, M8, B1, B5, D1, B9 — see §12 of each source document  |

---

## §11 — Deferred and Excluded Areas

The following areas are explicitly excluded from all workstreams. No workstream
description should reference these areas as in-scope work. Do not mix deferred items
into Phase 1 execution.

| Excluded Area                             | Reason / Authority                                              |
|-------------------------------------------|-----------------------------------------------------------------|
| Chat systems (1:1 and group)              | Explicitly excluded from Phase 1 launch scope per `CLAUDE.md`  |
| Livestream features                       | Excluded per `CLAUDE.md` non-negotiable constraints             |
| Advanced analytics (`/dashboard/analitik/*`) | Post-launch; entity events captured for future use           |
| Creator audience management (`/dashboard/kitle/*`) | Post-launch                                          |
| Advanced creator and fan settings pages   | Post-launch; minimal settings in scope only                     |
| Payout operations UI                      | IBAN captured in onboarding; payout mechanism post-launch       |
| Admin billing operations UI               | Payment gateway handles disputes at MVP                         |
| Admin user management list/detail         | Report-based moderation is sufficient at MVP                    |
| Audit log viewer UI                       | `ModerationAction` data captured; viewer UI post-launch         |
| DMCA / copyright claim UI                 | Email-based claim handling at MVP                               |
| Appeals portal                            | Post-launch                                                     |
| Community / group systems                 | Post-launch                                                     |
| Creator reinstatement tooling             | DB intervention sufficient at MVP; UI post-launch               |
| Tier upgrade / downgrade flows            | Cancellation and re-subscribe only at MVP                       |
| Automated content scoring / AI moderation | Post-launch                                                     |
| Affiliate / sponsorship / referral systems | Excluded per `CLAUDE.md`                                       |
| Mobile-specific native app patterns       | Web-only Phase 1 per `CLAUDE.md`                                |
| Public marketing sub-pages                | Post-launch; home page only in Phase 1                          |
| Premium post checkout UI                  | `PostPurchase` entity modeled; checkout UI deferred             |
| Social auth (OAuth)                       | Email/password only at MVP; social auth post-launch             |
| Refund processing UI                      | Gateway-level refunds at MVP; admin refund tool post-launch     |
| Tax / KDV calculation engine              | Deferred per `billing-lifecycle.md §11`                         |

---

## §12 — Open Execution Decisions

These decisions affect workstream structure and team organization but are not product
or legal decisions. They must be resolved before or during the execution planning
phase. They do not block planning — they do affect sprint structuring.

| #  | Decision                                                                   | Workstream Impact                                                                                                                                                          |
|----|----------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| E1 | Whether WS3 and WS7 are a single team track or two separate teams          | If separate teams: they must agree on the creator application → review cycle API contract before either can complete Phase 2 deliverables. The WS3 ↔ WS7 co-dependency makes this the highest-coordination risk in Phase 2. |
| E2 | Whether WS6 (Checkout) begins before WS5 (Fan Access) or in parallel       | WS6 and WS5 can begin in parallel in Phase 4 if backend dependencies are met. WS5's library work requires WS6's purchase records. Recommended: WS6 proves checkout end-to-end first, then WS5 library wires against real purchase data. |
| E3 | Whether WS8 (Frontend) is a separate frontend-only team or embedded in each domain workstream | Embedded frontend in each WS is preferred for vertical slice delivery. A separate WS8 track requires tighter API contract management and explicit readiness signals between domain WS and WS8. |
| E4 | Whether WS4's dual-status authorization layer is owned directly by WS4 or extracted as a shared service | The dual-status layer must ship in Phase 3 with WS4 content. If extracted to a shared service, that service is still WS4's responsibility in Phase 3. Do not defer it to a later shared-infrastructure effort. |
| E5 | Resolution ownership for launch-blocker open decisions (M1, M4, M7, M8, B1, B5, D1, B9) | These are product and legal decisions, not engineering decisions. Each must be assigned a decision owner before Phase 4 begins. Unresolved open decisions at the start of WS9 are the most likely launch gate failure. |

---

## §13 — Validation Checklist

Use this checklist to verify that the workstream breakdown is internally consistent
and aligned with all upstream planning documents before execution begins.

**Completeness:**
- [ ] All 24 page families have a primary workstream assignment in §6
- [ ] All 24 page families have a phase assignment that matches `implementation-phasing.md §5`
- [ ] All 13 approved backend domain areas have a workstream assignment in §7
- [ ] All 7 frontend surface areas have a workstream assignment in §8

**Alignment with phasing:**
- [ ] Workstream phase assignments in §5 align with `implementation-phasing.md §5 and §6`
- [ ] WS3 and WS7 are co-dependent in Phase 2; neither is listed as completing Phase 2
  without the other
- [ ] WS7 Phase 6 is listed after WS4 (content) and WS5 (reports) — not before

**Billing lifecycle correctness:**
- [ ] WS6 description states that `MembershipSubscription` is created by webhook on
  `payment_succeeded` — not by checkout initiation
- [ ] WS6 description states that entitlement is evaluated at request time from live
  entity state — not from a cache or snapshot
- [ ] WS6 description states that `Order` is created on checkout initiation; not
  subscription or purchase record

**Moderation rules correctness:**
- [ ] WS7 description states that `ModerationAction` ships with the first admin action
  in Phase 2 and is non-deferrable
- [ ] Dual-status authorization layer is assigned to WS4, not WS7, in §7
- [ ] WS7 scope is limited to Families 20 and 21; no other admin surfaces are in scope

**Exclusion verification:**
- [ ] Chat does not appear in any workstream description
- [ ] Livestream does not appear in any workstream description
- [ ] No workstream description references any area listed in §11

**Launch blocker register:**
- [ ] All 12 launch blockers in §10 have an owning workstream assigned
- [ ] All open decisions listed in §12 of source documents that are launch blockers
  appear in L12 of §10

**Quality bar:**
- [ ] No code, ticket-level breakdown, or sprint plan appears in this document
- [ ] Every workstream has: goal, included systems, excluded systems, major dependencies,
  key deliverables, blocked-by, unblocks, main risks, main validation outcomes
