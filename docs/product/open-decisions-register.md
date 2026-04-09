# Open Decisions Register — lalabits.art Phase 1

> **Status:** Approved
> **Version:** v1.0
> **Scope:** Phase 1 MVP
> **Authority level:** Canonical

---

## §1 — Document Purpose

This register consolidates all unresolved product, policy, legal, technical, operational,
and execution decisions that remain open across the seven approved Phase 1 planning
documents. It is the single source of truth for what still requires explicit confirmation
before or during implementation.

**Source documents:**

| Document | Local Decision IDs | Count |
|---|---|---|
| `billing-lifecycle.md` | B1–B10 | 10 |
| `data-model.md` | D1–D11 | 11 |
| `api-surface.md` | A1–A10 | 10 |
| `moderation-trust-rules.md` | M1–M9 | 9 |
| `permission-matrix.md` | Assumptions A1–A14 (open subset) | 7 |
| `page-requirements.md` | Assumptions 1–25 (open subset) | 9 |
| `workstream-breakdown.md` | E1–E5 | 5 |

Many of these decisions are the same decision referenced from multiple documents under
different local IDs. This register deduplicates them into 35 canonical entries.

**What this register does NOT include:**
- Settled decisions and assumptions that are already resolved (see §2)
- Deferred features and excluded scope (see `workstream-breakdown.md §11`)
- Code, implementation patterns, sprint plans, or ticket breakdowns
- New scope or decisions not traceable to a source planning document

---

## §2 — How to Use This Register

**Reading the table:** Each decision has a canonical ID (OD-01 through OD-35), a title,
the source document IDs from which it was drawn, the current assumption in the planning
documents (if any), the available options, a recommended default where one exists, the
impact if it remains unresolved, and the latest point by which it must be decided.

**Decision ID scheme:** IDs are assigned OD-## in rough resolution-urgency order within
each category. The OD-## ID is canonical. Source IDs (B1, D4, M7, etc.) remain
authoritative in their source documents and are preserved for traceability in §8.

**Launch-blocker decisions** are marked with `[LAUNCH BLOCKER]` in the Resolve By column.
These must be resolved before the platform goes public. They correspond to the decisions
named in `workstream-breakdown.md §10 (L12)` and `implementation-phasing.md §10`.

**Owner assignment:** §9 suggests a decision owner type for each entry. No person names
are assigned here — that is an execution planning step outside this document's scope.
Each decision should have one named owner assigned before Phase 4 begins.

**Resolution workflow:** When a decision is resolved, update the relevant source document's
open decisions table with the chosen option and rationale. Mark the decision as resolved
in this register. Do not delete closed decisions — preserve the record.

**Excluded from this register (already settled):**
The following items appear as assumptions in source documents and are treated as closed:
dual-role coexistence (fan + creator on one identity); email verification gates checkout
not browsing; tier price changes at next billing cycle only; admin accounts provisioned
separately (not via public signup); creator approval notification via email (in-app deferred);
API route paths in English; MVP uses client polling for order confirmation; no chat; no
livestream; WS4 owns the dual-status layer (not WS7).

---

## §3 — Decision Categories

| Category | Code | Description | Count |
|---|---|---|---|
| Product & Policy | P | Behavioral rules for how the platform works for users and creators | 15 |
| Legal & Compliance | L | Decisions requiring legal review or Turkish regulatory alignment | 3 |
| Technical & Infrastructure | T | Implementation choices that affect system architecture | 7 |
| Operational | O | Configuration values and operational thresholds | 5 |
| Execution & Team | E | Team structure and workstream coordination decisions | 5 |
| **Total** | | | **35** |

---

## §4 — Open Decisions Table

The table is split by category. Each section lists the category name and decisions
belonging to it. Source IDs are the original IDs from the planning documents that this
entry consolidates. If a cell contains "—" the field does not apply.

---

### Category P — Product & Policy

| ID | Title | Source IDs | Current Assumption | Options | Recommended Default | Impact if Unresolved | Resolve By |
|---|---|---|---|---|---|---|---|
| OD-01 | Unpublish access policy for prior purchasers | D1, B2, A4-perm, Assumption 8 | None settled | A — revoke `access_revoked_at` on creator unpublish; B — retain access for prior purchasers | B (retain) — fan paid in good faith; revoke is punitive | Cannot implement `access_revoked_at` write logic in WS6; library entitlement rules incomplete | Before Phase 5 **[LAUNCH BLOCKER]** |
| OD-02 | Flagged content visibility: auto-hide vs. remain visible | M1, A5-api | Visible until explicitly removed (source document default) | A — remain visible until removed (current default); B — auto-hidden when `flagged` | A (remain visible) — consistent with source document default | If B chosen: `flagged` becomes access-blocking state; dual-status layer in WS4 must handle it; changes visibility matrix | Before Phase 6 **[LAUNCH BLOCKER]** |
| OD-03 | Creator restriction — content de-listing for existing fans | M2 | None settled | A — content remains accessible to existing subscribers; B — content de-listed from fan library and feeds when creator restricted | A (access continues) — restriction is a warning level; suspension handles de-listing | WS7 moderation "restrict_creator" action has ambiguous behavioral scope; fan library state during restriction undefined | Before Phase 6 |
| OD-04 | Creator ability to edit flagged post while under review | M3 | None settled | A — creator can edit or delete while post is flagged; B — editing locked during admin review | A (editing allowed) — enables voluntary remediation before admin action | WS4 post-edit endpoint must block or allow edits on flagged posts; guard logic differs | Before Phase 6 |
| OD-05 | Report reason taxonomy (`reason_code` values) | M4, D7, Assumption 22 | Placeholder taxonomy only; final values TBD | Finalize enum values aligned with Turkish legal and regulatory requirements | — (requires legal/ops input) | `Report.reason_code` cannot be typed; report intake UI cannot be finalized; analytics on report types meaningless | Before Phase 6 **[LAUNCH BLOCKER]** |
| OD-06 | Tier-gated access model: exact match vs. hierarchical | D2, A13-perm | Exact match assumed at MVP | A — exact match only (fan must have the specific tier); B — higher-tier-includes-lower (Tier 2 fan accesses Tier 1 content) | A (exact match) — simpler; most common MVP pattern | Entitlement query logic in WS6 differs substantially; `MembershipPlan.tier_rank` field usage changes | Before Phase 3 |
| OD-07 | Creator self-subscription | D8, A10-api, A12-perm | None settled | A — blocked (`403 SELF_SUBSCRIPTION_BLOCKED`); B — allowed | A (blocked) — prevents manipulation of member counts and revenue metrics | `POST /checkout/membership` guard logic must enforce or skip the check; creator dashboard member count integrity affected | Before Phase 4 |
| OD-08 | Billing behavior when creator is suspended | M7, A11-perm | None settled | A — renewals continue unchanged (fans charged; content inaccessible); B — pending renewals paused; C — active subscriptions cancelled | — (significant legal/ops implications) | Fans may be charged for periods of inaccessible content; fan compensation policy undefined; WS6 scheduled jobs must handle suspension state | Before launch **[LAUNCH BLOCKER]** |
| OD-09 | Price change subscriber notification | B7 | None settled | A — notify existing subscribers before next renewal takes effect at new price; B — no advance notification | A (notify) — reduces billing disputes | Notification event for price change must be added to WS5 notification infrastructure if chosen; otherwise no action needed | During build (Phase 3) |
| OD-10 | Pre-renewal reminder notification | B8 | None settled | A — send reminder N days before renewal (e.g., 3 days); B — no reminder | A (send) — reduces involuntary churn from stale payment methods | If chosen: scheduled reminder job must be added to WS6; notification type added to WS5 | During build (Phase 4) |
| OD-11 | Creator notification on new subscription | B10 | Not in approved notification event set | A — notify creator when new fan subscribes; B — no per-subscription notification | A (notify) — low implementation cost; high creator engagement value | If chosen: notification event added to WS6 webhook handler; otherwise excluded | During build (Phase 4) |
| OD-12 | Creator notification timing: on flag vs. on removal only | M6 | None settled | A — notify creator when their content is flagged (earlier visibility); B — notify only on removal | B (on removal only) — simpler; avoids premature creator anxiety during admin review | WS7 moderation action must emit notification event at different stage depending on choice | Before Phase 6 |
| OD-13 | Retention offer on cancellation flow | D5, A9-perm, Assumption 17 | No offer at MVP (source document assumption) | A — no offer (MVP default); B — show discount/retention offer in cancellation consequence-disclosure step | A (no offer at MVP) — source documents confirm this as the current assumption | If B chosen: offer business rules, eligibility logic, and discount config must be defined; cancellation flow extended | During build (Phase 4); safe to defer if MVP default confirmed |
| OD-14 | Fan notification when subscribed creator suspended | M9 | None settled | A — proactively notify affected fans; B — no proactive notification | A (notify) — trust and transparency; prevents unpleasant surprise at next renewal attempt | If chosen: notification event for creator suspension added to WS7/WS5; otherwise fans discover suspension organically | During build (Phase 6) |
| OD-15 | Post access level change: immediacy of enforcement | A6-perm | Immediate enforcement assumed; flagged for policy review | A — immediate: viewers who no longer qualify lose access when creator changes access level; B — grace period before enforcement | A (immediate) — consistent with dual-status enforcement model | If grace period: additional state tracking required; grace period duration must be defined | Before Phase 3 |

---

### Category L — Legal & Compliance

| ID | Title | Source IDs | Current Assumption | Options | Recommended Default | Impact if Unresolved | Resolve By |
|---|---|---|---|---|---|---|---|
| OD-16 | Annual cancellation — KVKK / Turkish consumer rights | B3, D9, A7-perm, Assumption 15 | End-of-period only; no prorated refund at MVP | A — end-of-period only (no proration); B — prorated refund required by KVKK | Legal review required | If B: cancellation flow must compute and issue refund; invoice entities must support it; refund gateway API must be integrated | Before Phase 4 **[LAUNCH BLOCKER]** |
| OD-17 | Minimum refund policy | B9 | No-refund MVP assumed; deferred | A — no-refund policy; B — partial refund for fans affected by content removal or creator suspension | Legal review required | Affects cancellation flow, moderation tooling, and fan-facing communication; unresolved = operational risk at any refund dispute | Before launch **[LAUNCH BLOCKER]** |
| OD-18 | Legal document re-acceptance behavior on update | D6, A14-perm, Assumption 25 | None settled | A — re-acceptance prompt (block access until re-accepted); B — notification only; C — new ConsentRecord on next organic acceptance | Legal review required | ConsentRecord trigger logic; user-facing re-acceptance flow required if A chosen | Before any legal document updated in production (deferred if policies static at launch) |

---

### Category T — Technical & Infrastructure

| ID | Title | Source IDs | Current Assumption | Options | Recommended Default | Impact if Unresolved | Resolve By |
|---|---|---|---|---|---|---|---|
| OD-19 | Payment gateway provider | B5, D4, A3-api | **Resolved 2026-03-27 — iyzico confirmed.** Native recurring subscription API; gateway manages renewal scheduling autonomously. Webhook handler written to iyzico event format. `gateway_subscription_id` on `MembershipSubscription` used for renewal reconciliation. No platform-side renewal scheduler job required. Gateway onboarding to be initiated immediately. | iyzico ✓ **chosen**; PayTR; Craftgate; Stripe | — | — | ~~Before Phase 4~~ **RESOLVED** |
| OD-20 | Session mechanism: JWT bearer vs. signed session cookie | A1-api | **Resolved 2026-03-27 — Option A confirmed.** JWT bearer token with refresh token. `POST /auth/refresh` added to API surface. `Authorization: Bearer` on all authenticated endpoints. Password reset invalidates all active refresh tokens. Redis-backed HttpOnly session cookies not used in Phase 1. | A — JWT bearer token ✓ **chosen**; B — signed HttpOnly session cookie | A (JWT bearer) | — | ~~Before Phase 2~~ **RESOLVED** |
| OD-21 | File upload mechanism: presigned PUT vs. server-side proxy | A2-api | Presigned PUT URL assumed in `api-surface.md` | A — presigned PUT URL (client uploads directly to storage); B — server-side upload proxy | A (presigned PUT) — consistent with api-surface.md; avoids backend bandwidth overhead | `/dashboard/products/:id/file-upload-url` response shape; storage CORS config; backend streaming infra needed if B | Before Phase 3 |
| OD-22 | Admin account identity model and login endpoint | D11, A9-api, A3-perm, Assumption 19 | **Resolved 2026-03-27 — Option A confirmed.** `User.is_admin = true` flag on shared `users` table. Separate `POST /admin/auth/login` endpoint added to API surface. Admin token carries `scope: admin` claim. No separate `admins` table; no roles-array model. Separate `admins` table and role-elevation excluded from Phase 1. | A — `is_admin` flag + separate admin login endpoint ✓ **chosen**; B — separate admin identity table; C — role-elevation on existing user | A (is_admin flag + separate endpoint) | — | ~~Before Phase 2~~ **RESOLVED** |
| OD-23 | Order confirmation: client polling vs. server-sent events | A4-api | Client polling with exponential backoff assumed at MVP | A — polling via `GET /checkout/orders/:order-id` (current assumption); B — server-sent events; C — WebSocket | A (polling) — consistent with `api-surface.md` MVP assumption; SSE and WebSocket deferred | Frontend checkout confirmation UX differs; B or C require additional backend infrastructure; MVP polling is safe default | Before Phase 4; confirm MVP assumption |
| OD-24 | Creator restriction data model (`status` enum vs. boolean flag) | M8 | `CreatorProfile.status` enum does not include `restricted`; implementation unsettled | A — add `restricted` to `CreatorProfile.status` enum; B — add `is_restricted` boolean flag to `CreatorProfile` | B (boolean flag) — keeps status enum clean for primary workflow states; restriction can coexist with other statuses | Schema migration required before WS7 Phase 6 ships; moderation action API behavior differs by choice | Before Phase 6 schema **[LAUNCH BLOCKER]** |
| OD-25 | Idempotency-key header requirement | A7-api | Business-rule dedup only: webhook `event_id` dedup + `SUBSCRIPTION_EXISTS` checkout guard | A — business-rule dedup only (current assumption); B — require client-generated `Idempotency-Key` header on checkout requests | A (business-rule dedup) — consistent with `api-surface.md`; simpler for frontend | If B: frontend checkout must generate and transmit idempotency keys; header validation required at API | Before Phase 4; confirm MVP assumption |

---

### Category O — Operational

| ID | Title | Source IDs | Current Assumption | Options | Recommended Default | Impact if Unresolved | Resolve By |
|---|---|---|---|---|---|---|---|
| OD-26 | Grace period duration (days) | B1, D3, A8-perm | Duration TBD; grace period behavior defined (access continues), duration is not | 3 days; 5 days; 7 days — longer = more fan-friendly, more revenue risk | 7 days — common industry standard; sufficient for payment method update | `grace_period_ends_at` computation in webhook handler; scheduled expiry job timing; fan-facing messaging cannot be finalized | Before Phase 4 |
| OD-27 | Platform fee percentage | B4, D10 | **Resolved 2026-03-27 — 10% of gross transaction value. Fee split computed at reporting time from config (`PLATFORM_FEE_PERCENT = 0.10`). `Invoice.amount_try` stores gross amount only; no fee split fields added to Invoice entity. `creator_earnings = amount_try × 0.90` computed in reporting queries and dashboard aggregates. No Invoice schema change required. OD-29 (dashboard pre-fee vs. post-fee display) is now unblocked.** | Option A — compute at reporting time ✓ **chosen**; Option B — record per Invoice | Option A | — | ~~Before Phase 4~~ **RESOLVED** |
| OD-28 | Stale pending Order cleanup timeout | B6 | Timeout TBD; pending Order cleanup job must run | 15 minutes; 30 minutes; 60 minutes — align with chosen gateway's payment session timeout | 30 minutes — standard gateway session window; confirm against OD-19 selection | Reconciliation job interval and Order state machine cannot be finalized; dependent on gateway selection (OD-19) | Before Phase 4; resolve after OD-19 |
| OD-29 | Dashboard revenue display: pre-fee vs. post-fee | A6-api | None settled | A — pre-fee (gross, before platform fee); B — post-fee (net to creator) | B (post-fee / net) — creator sees actual earnings; simpler UX | `GET /dashboard/overview` response shape and Invoice aggregate logic in WS4 differ; dependent on OD-27 (platform fee) | Before Phase 3 |
| OD-30 | Admin dashboard warning thresholds | M5 | None settled | Specific count values for pending creator applications and open reports that trigger warning visual state (e.g., >10, >25) | — (operational calibration based on platform volume) | Admin overview dashboard counter visual states cannot be finalized; low urgency — minor UX impact only | During build (Phase 6) |

---

### Category E — Execution & Team

| ID | Title | Source IDs | Current Assumption | Options | Recommended Default | Impact if Unresolved | Resolve By |
|---|---|---|---|---|---|---|---|
| OD-31 | WS3 and WS7 as single or separate teams | E1 | ~~None settled~~ **Resolved 2026-03-27 — Option A confirmed. Single team owns both WS3 and WS7 Phase 2 deliverables. No API contract coordination required. Wave 02 assigns unified batch ownership across WS3 and WS7 Phase 2.** | A — single team owns both WS3 and WS7 Phase 2 deliverables; B — separate teams with API contract coordination | A (single team for Phase 2) — reduces coordination overhead for the co-dependent deliverable | If separate: API contract for creator application → review cycle must be agreed before Phase 2 begins; highest coordination risk in Phase 2 | Before Phase 2 planning |
| OD-32 | WS6 and WS5 parallel vs. sequential start | E2 | None settled | A — parallel start in Phase 4; B — WS6 proves checkout end-to-end first, then WS5 library wires against real purchase data | B (sequential recommendation) — WS5 library entitlement depends on WS6 purchase records; parallel risks WS5 testing against stubs | Phase 4 team allocation and timeline differ; WS5 library cannot be fully integration-tested without WS6 purchase data | Before Phase 4 planning |
| OD-33 | WS8 team model: embedded vs. separate frontend | E3 | None settled | A — frontend engineers embedded in each domain workstream (vertical slice); B — dedicated WS8 frontend team | A (embedded) — preferred for vertical slice delivery per `workstream-breakdown.md` | If separate: formal API contract readiness signals required between domain WS and WS8; sprint planning coordination differs materially | Before Phase 1 planning |
| OD-34 | WS4 dual-status layer ownership: inline vs. shared service | E4 | WS4 owns inline (established in `workstream-breakdown.md`) | A — inline in WS4 (current assumption); B — extracted as shared authorization service | A (inline in WS4) — already established; must ship Phase 3 with WS4 content | If B: shared service is still WS4 Phase 3 responsibility; extraction cannot be deferred; architectural overhead without benefit | Before Phase 3 planning |
| OD-35 | Decision owner assignment for launch-blocker decisions | E5 | No owners assigned | Assign named decision owner for each of: OD-01, OD-02, OD-05, OD-08, OD-16, OD-17, OD-19, OD-24 | — (must be assigned; no default) | Unresolved launch-blocker decisions at start of WS9 are most likely launch gate failure; unowned decisions remain unresolved | Before Phase 4 begins |

---

## §5 — Decisions That Must Be Resolved Before Build

These decisions must be confirmed before implementation begins. Building on unsettled
foundations here will cause rework in later phases.

**Before Phase 1 planning (team and scaffold):**

- **OD-33** — WS8 team model (embedded vs. separate frontend) must be known before the
  Phase 1 scaffold is scoped and staffed. The answer determines how frontend work is
  organized across all phases.

**Before Phase 2 (Auth and Admin guard):**

- **OD-20** — Session mechanism (JWT bearer vs. signed session cookie). The auth
  middleware in WS2 is built once; switching session strategy later requires rebuilding
  auth infrastructure. Confirm the JWT bearer assumption from `api-surface.md`.

- **OD-22** — Admin account identity model and login endpoint. WS2 (auth) and WS7
  (admin guard) both depend on this. `User.is_admin = true` with a separate
  `/admin/auth/login` endpoint is the documented assumption; confirm before implementation.

**Before Phase 2 planning (team coordination):**

- **OD-31** — WS3 and WS7 as single or separate teams. The Phase 2 deliverable is
  co-dependent (creator application + admin review queue). Team structure determines
  whether a shared API contract must be agreed before Phase 2 begins.

---

## §6 — Decisions That Must Be Resolved During Build

Grouped by the phase gate that each decision must clear before. The phase gate is the
point at which the decision's owning workstream begins the affected implementation.

**Before Phase 3 (Content — WS4 entry):**

- **OD-06** — Tier-gated access model (exact match vs. hierarchical). Entitlement
  query logic in WS6 is written to one model. If the model changes after Phase 3,
  the entitlement layer must be rewritten. Confirm the exact-match MVP default.

- **OD-15** — Post access level change immediacy. WS4's content read endpoint must
  enforce the correct policy from the moment gated content goes live in Phase 3.

- **OD-21** — File upload mechanism (presigned PUT vs. server-side proxy). WS4
  implements product and post attachment upload in Phase 3. Confirm the presigned PUT
  assumption from `api-surface.md`.

- **OD-29** — Dashboard revenue display (pre-fee vs. post-fee). WS4 wires the
  dashboard overview API in Phase 3. The response shape differs by choice. Also
  depends on OD-27 (platform fee percentage).

**Before Phase 3 planning:**

- **OD-34** — WS4 dual-status layer ownership. Must be confirmed as inline in WS4
  before Phase 3 scope is defined. This decision is already established in
  `workstream-breakdown.md`; confirm it is not being revisited.

**Before Phase 4 (Checkout — WS6 entry):**

- **OD-07** — Creator self-subscription. WS6 checkout guard logic must enforce or
  skip the self-subscription check from day one.

- **OD-19** — Payment gateway provider. WS6 cannot begin integration work without a
  selected provider. This is the highest-priority decision for Phase 4 readiness.

- **OD-23** — Order confirmation mechanism. Confirm the polling assumption from
  `api-surface.md` before WS6 implements the checkout confirmation flow.

- **OD-25** — Idempotency-key header requirement. Confirm business-rule deduplication
  is sufficient before WS6 implements the checkout endpoint.

- **OD-26** — Grace period duration. The `grace_period_ends_at` timestamp computation
  in the WS6 webhook handler requires a defined number of days.

- **OD-27** — Platform fee percentage. WS6 billing and invoice logic requires the
  platform fee to be defined before invoices can be generated correctly.

- **OD-28** — Stale pending Order cleanup timeout. The reconciliation job interval
  cannot be set without this value. Resolve after OD-19 (gateway selection).

**Before Phase 4 planning:**

- **OD-32** — WS6 and WS5 parallel vs. sequential. Phase 4 sprint planning requires
  a decision on team sequencing for checkout vs. fan access work.

- **OD-35** — Decision owner assignment. All launch-blocker decisions (OD-01, OD-02,
  OD-05, OD-08, OD-16, OD-17, OD-19, OD-24) must have named owners before Phase 4
  begins. Unowned decisions will not be resolved in time for WS9.

**Before Phase 5 (Fan Library — WS5 library entry):**

- **OD-01** — Unpublish access policy for prior purchasers. WS6 entitlement enforcement
  and the WS5 library view both depend on whether `access_revoked_at` is set when
  a creator unpublishes. This must be resolved before library entitlement is implemented.

**Before Phase 6 (Moderation — WS7 Phase 6 entry):**

- **OD-02** — Flagged content visibility. The visibility matrix in WS4's dual-status
  layer must be updated if auto-hide is chosen. This must be decided before WS7's
  moderation queue ships.

- **OD-03** — Creator restriction content de-listing. WS7's restrict_creator moderation
  action has different behavioral scope depending on this decision.

- **OD-04** — Creator ability to edit flagged post. WS4's post-edit endpoint must
  enforce or allow edits on flagged posts.

- **OD-05** — Report reason taxonomy. The moderation queue and report intake UI cannot
  be finalized without the `reason_code` enum values.

- **OD-12** — Creator notification timing (flag vs. removal). WS7 must emit the
  notification event at the correct point.

- **OD-24** — Creator restriction data model. Schema migration for the restriction
  state must precede WS7 Phase 6 implementation. `CreatorProfile` schema change
  required before any moderation code for restriction ships.

**During Phase 6 build:**

- **OD-09** — Price change subscriber notification. Notification event type must be
  confirmed or excluded before WS5 notification infrastructure is finalized.

- **OD-10** — Pre-renewal reminder notification. Scheduled reminder job and
  notification type must be confirmed or excluded.

- **OD-11** — Creator notification on new subscription. Notification event type
  confirmed or excluded.

- **OD-13** — Retention offer on cancellation. If no offer at MVP is confirmed,
  no action needed; otherwise scope must be defined before Phase 4 cancellation
  flow ships.

- **OD-14** — Fan notification on creator suspension. Notification event confirmed
  or excluded in WS7/WS5.

- **OD-30** — Admin dashboard warning thresholds. Operational calibration; low
  urgency; can be set during Phase 6 build.

---

## §7 — Decisions That Can Be Deferred Until Pre-Launch

These decisions are not needed for any specific build phase but must be resolved
before the platform goes public. They are assigned to WS9 (Launch Readiness).

- **OD-08** — Billing behavior when creator suspended. Must be resolved before
  public launch because suspended creators with active subscribers is a real scenario
  from day one. The policy must be in place before the platform operates publicly.

- **OD-16** — Annual cancellation KVKK / Turkish consumer rights. Legal review
  must be complete before checkout ships annual plans. If annual plans are excluded
  from the initial launch, this can defer slightly — but must be resolved before
  annual plans are enabled.

- **OD-17** — Minimum refund policy. No-refund is the current MVP assumption. If
  the policy allows partial refunds under any condition (removal, suspension), the
  billing module must support it before launch.

- **OD-18** — Legal document re-acceptance behavior on update. This is deferred
  because legal documents are expected to be static at launch. If a policy document
  is updated before launch, this decision must be made first.

---

## §8 — Cross-Document References

Use this table to find the canonical register entry (OD-##) when reading a source
document. Source documents use their own local ID schemes.

| Source ID | Source Document | Canonical Register Entry |
|---|---|---|
| B1 | billing-lifecycle.md | OD-26 (Grace period duration) |
| B2 | billing-lifecycle.md | OD-01 (Unpublish access policy) |
| B3 | billing-lifecycle.md | OD-16 (Annual cancellation KVKK) |
| B4 | billing-lifecycle.md | OD-27 (Platform fee percentage) |
| B5 | billing-lifecycle.md | OD-19 (Payment gateway provider) |
| B6 | billing-lifecycle.md | OD-28 (Stale Order cleanup timeout) |
| B7 | billing-lifecycle.md | OD-09 (Price change notification) |
| B8 | billing-lifecycle.md | OD-10 (Pre-renewal reminder) |
| B9 | billing-lifecycle.md | OD-17 (Minimum refund policy) |
| B10 | billing-lifecycle.md | OD-11 (Creator notification on new subscription) |
| D1 | data-model.md | OD-01 (Unpublish access policy) |
| D2 | data-model.md | OD-06 (Tier-gated access model) |
| D3 | data-model.md | OD-26 (Grace period duration) |
| D4 | data-model.md | OD-19 (Payment gateway provider) |
| D5 | data-model.md | OD-13 (Retention offer on cancellation) |
| D6 | data-model.md | OD-18 (Legal re-acceptance behavior) |
| D7 | data-model.md | OD-05 (Report reason taxonomy) |
| D8 | data-model.md | OD-07 (Creator self-subscription) |
| D9 | data-model.md | OD-16 (Annual cancellation KVKK) |
| D10 | data-model.md | OD-27 (Platform fee percentage) |
| D11 | data-model.md | OD-22 (Admin identity model) |
| A1 | api-surface.md | OD-20 (Session mechanism) |
| A2 | api-surface.md | OD-21 (File upload mechanism) |
| A3 | api-surface.md | OD-19 (Payment gateway provider) |
| A4 | api-surface.md | OD-23 (Order confirmation mechanism) |
| A5 | api-surface.md | OD-02 (Flagged content visibility) |
| A6 | api-surface.md | OD-29 (Dashboard revenue display) |
| A7 | api-surface.md | OD-25 (Idempotency-key header) |
| A9 | api-surface.md | OD-22 (Admin login endpoint) |
| A10 | api-surface.md | OD-07 (Creator self-subscription) |
| M1 | moderation-trust-rules.md | OD-02 (Flagged content visibility) |
| M2 | moderation-trust-rules.md | OD-03 (Creator restriction de-listing) |
| M3 | moderation-trust-rules.md | OD-04 (Creator edit flagged post) |
| M4 | moderation-trust-rules.md | OD-05 (Report reason taxonomy) |
| M5 | moderation-trust-rules.md | OD-30 (Admin warning thresholds) |
| M6 | moderation-trust-rules.md | OD-12 (Creator notification on flag) |
| M7 | moderation-trust-rules.md | OD-08 (Billing on creator suspension) |
| M8 | moderation-trust-rules.md | OD-24 (Creator restriction data model) |
| M9 | moderation-trust-rules.md | OD-14 (Fan notification on creator suspension) |
| A4-perm | permission-matrix.md | OD-01 (Unpublish access policy) |
| A6-perm | permission-matrix.md | OD-15 (Post access level change immediacy) |
| A7-perm | permission-matrix.md | OD-16 (Annual cancellation KVKK) |
| A8-perm | permission-matrix.md | OD-26 (Grace period duration) |
| A9-perm | permission-matrix.md | OD-13 (Retention offer on cancellation) |
| A11-perm | permission-matrix.md | OD-08 (Billing on creator suspension) |
| A12-perm | permission-matrix.md | OD-07 (Creator self-subscription) |
| A13-perm | permission-matrix.md | OD-06 (Tier-gated access model) |
| A14-perm | permission-matrix.md | OD-18 (Legal re-acceptance behavior) |
| A3-perm | permission-matrix.md | OD-22 (Admin identity model) |
| Assumption 8 | page-requirements.md | OD-01 (Unpublish access policy) |
| Assumption 15 | page-requirements.md | OD-16 (Annual cancellation KVKK) |
| Assumption 17 | page-requirements.md | OD-13 (Retention offer on cancellation) |
| Assumption 19 | page-requirements.md | OD-22 (Admin identity model) |
| Assumption 22 | page-requirements.md | OD-05 (Report reason taxonomy) |
| Assumption 25 | page-requirements.md | OD-18 (Legal re-acceptance behavior) |
| E1 | workstream-breakdown.md | OD-31 (WS3/WS7 team structure) |
| E2 | workstream-breakdown.md | OD-32 (WS6/WS5 sequencing) |
| E3 | workstream-breakdown.md | OD-33 (WS8 team model) |
| E4 | workstream-breakdown.md | OD-34 (WS4 dual-status layer) |
| E5 | workstream-breakdown.md | OD-35 (Decision owner assignment) |

---

## §9 — Owner / Decision Type Suggestions

Suggested decision owner type for each entry. No person names are assigned here;
this column suggests the function that should make each decision. Assign a named
owner to each before Phase 4 begins.

| ID | Title | Suggested Owner Type | Decision Nature |
|---|---|---|---|
| OD-01 | Unpublish access policy | Product / Legal | Product + legal policy |
| OD-02 | Flagged content visibility | Product / Trust & Safety | Platform moderation policy |
| OD-03 | Creator restriction de-listing | Product / Trust & Safety | Platform moderation policy |
| OD-04 | Creator edit flagged post | Product / Trust & Safety | Platform moderation policy |
| OD-05 | Report reason taxonomy | Product / Legal / Ops | Legal + ops alignment |
| OD-06 | Tier-gated access model | Product | Product rule |
| OD-07 | Creator self-subscription | Product | Business rule |
| OD-08 | Billing on creator suspension | Product / Legal / Ops | Legal + billing policy |
| OD-09 | Price change notification | Product | Product rule |
| OD-10 | Pre-renewal reminder | Product | Product rule |
| OD-11 | Creator notification on new subscription | Product | Product rule |
| OD-12 | Creator notification on flag | Product / Trust & Safety | Moderation + product rule |
| OD-13 | Retention offer on cancellation | Product / Business | Business strategy |
| OD-14 | Fan notification on creator suspension | Product / Trust & Safety | Platform policy |
| OD-15 | Post access level change immediacy | Product | Product rule |
| OD-16 | Annual cancellation KVKK | Legal / Product | Legal compliance — Turkey |
| OD-17 | Minimum refund policy | Legal / Product | Legal compliance |
| OD-18 | Legal re-acceptance behavior | Legal / Engineering | Legal + backend decision |
| OD-19 | Payment gateway provider | Executive / Business | Business + vendor selection |
| OD-20 | Session mechanism | Engineering (Backend) | Infrastructure decision |
| OD-21 | File upload mechanism | Engineering (Backend) | Infrastructure decision |
| OD-22 | Admin identity model | Engineering (Backend) | Infrastructure + security |
| OD-23 | Order confirmation mechanism | Engineering (Full-stack) | Infrastructure decision |
| OD-24 | Creator restriction data model | Engineering (Backend) + Product | Schema + policy co-decision |
| OD-25 | Idempotency-key header | Engineering (Backend) | Infrastructure decision |
| OD-26 | Grace period duration | Product / Ops | Billing configuration |
| OD-27 | Platform fee percentage | Executive / Business | Business decision |
| OD-28 | Stale Order cleanup timeout | Engineering (Backend) / Ops | Operational configuration |
| OD-29 | Dashboard revenue display | Product / Ops | Product + billing config |
| OD-30 | Admin dashboard warning thresholds | Ops / Product | Operational calibration |
| OD-31 | WS3/WS7 team structure | Engineering Leadership | Team organization |
| OD-32 | WS6/WS5 sequencing | Engineering Leadership | Sprint planning |
| OD-33 | WS8 team model | Engineering Leadership | Team organization |
| OD-34 | WS4 dual-status layer ownership | Engineering (Backend) | Architecture decision |
| OD-35 | Decision owner assignment | Product / Engineering Leadership | Governance |

---

## §10 — Validation Checklist

Use this checklist to verify that the register is complete and internally consistent
before implementation begins.

**Source document coverage:**
- [ ] All B1–B10 from `billing-lifecycle.md` mapped to a canonical OD-## entry in §8
- [ ] All D1–D11 from `data-model.md` mapped to a canonical OD-## entry in §8
- [ ] All A1–A10 from `api-surface.md` mapped to a canonical OD-## entry in §8
- [ ] All M1–M9 from `moderation-trust-rules.md` mapped to a canonical OD-## entry in §8
- [ ] Open assumptions from `permission-matrix.md` mapped to canonical OD-## entries in §8
- [ ] Open assumptions from `page-requirements.md` mapped to canonical OD-## entries in §8
- [ ] E1–E5 from `workstream-breakdown.md` mapped to canonical OD-## entries in §8

**Completeness:**
- [ ] 35 total decisions in register (15 Product & Policy, 3 Legal, 7 Technical, 5 Operational, 5 Execution)
- [ ] Every OD-## entry has: source IDs, current assumption, options, impact, and resolve-by phase

**Launch-blocker alignment:**
- [ ] OD-01 (D1/B2), OD-02 (M1), OD-05 (M4), OD-08 (M7), OD-16 (B3), OD-17 (B9), OD-19 (B5), OD-24 (M8) are all marked `[LAUNCH BLOCKER]`
- [ ] Launch-blocker set matches `workstream-breakdown.md §10 (L12)` and `implementation-phasing.md §10`

**Exclusion verification:**
- [ ] No settled decisions appear in the register (see §2 exclusion list)
- [ ] No new scope or features introduced by any decision entry
- [ ] Chat, livestream, and post-launch features do not appear as decision items
- [ ] No code, UI specifications, or implementation detail in any decision row

**Owner readiness:**
- [ ] Named owner assigned for each OD-## entry before Phase 4 begins
- [ ] OD-35 (decision owner assignment) is itself assigned to an owner
- [ ] All launch-blocker decisions (8 items) have named owners assigned before Phase 4
