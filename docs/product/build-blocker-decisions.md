# Build-Blocker Decision Closeout Brief — lalabits.art Phase 1

> **Status:** Approved
> **Version:** v1.0
> **Scope:** Phase 1 MVP
> **Authority level:** Canonical
>
> **Derived from:** open-decisions-register.md · implementation-phasing.md ·
> workstream-breakdown.md · billing-lifecycle.md · moderation-trust-rules.md ·
> data-model.md · api-surface.md · permission-matrix.md

---

## §1 — Document Purpose

This brief extracts the subset of open decisions from `open-decisions-register.md`
that must be resolved before or during early implementation phases. It is not a
replacement for the full register. It is a focused, execution-ready gate instrument.

**What this document is for:**
- Unblocking Phase 2–6 start by naming what must be decided first
- Providing recommended defaults so that teams can start with a working assumption
  and get explicit confirmation (or override) from the appropriate owner
- Preventing mid-build rework by surfacing decisions whose late resolution changes
  schema, auth infrastructure, or entitlement architecture

**What this document is not:**
- A full restatement of all 35 open decisions (see `open-decisions-register.md`)
- A scope change, new feature list, or product decision document
- A code specification or implementation plan
- A replacement for legal or business review on items that require them

**Relationship to the full register:**
The 10 primary build blockers in §3 are a strict subset of the 35 decisions in
`open-decisions-register.md`. Every ID used here (OD-##) maps to the same entry in
that register. Resolution must be recorded there, not here.

---

## §2 — Selection Criteria for Build-Blocker Decisions

A decision qualifies as a build blocker if it meets at least one of:

1. **Schema criteria** — resolving it differently after implementation begins requires
   a schema migration or a data backfill. Example: admin identity model (`is_admin`
   flag vs. separate table) determines the `users` table structure from Phase 0.

2. **Auth infrastructure criteria** — resolving it differently rebuilds the auth
   middleware layer. Example: session mechanism (JWT vs. cookie) affects every
   protected endpoint from Phase 2 onward.

3. **Entitlement architecture criteria** — resolving it differently rewrites the
   core entitlement evaluation logic. Example: tier-gated access model (exact match
   vs. hierarchical) changes every entitlement query across WS6.

4. **Checkout integration criteria** — resolving it is a prerequisite for beginning
   the checkout workstream. Example: payment gateway selection. WS6 cannot begin
   without a selected provider.

5. **Content access gate criteria** — the decision controls what content is accessible
   to whom, and the wrong default creates a security or billing correctness failure that
   is hard to patch post-launch.

**Explicitly excluded from this brief:**
- Decisions where the recommended default is already stable and confirmed in source
  documents and requires only a confirmation acknowledgement (e.g., OD-23 polling,
  OD-25 dedup, OD-34 WS4 ownership) — treat these as confirmed unless overridden.
- Notification preference decisions (OD-09, OD-10, OD-11, OD-13, OD-14) — additive
  scope; exclusion creates no rework.
- Admin UX calibration decisions (OD-30) — operational tuning, zero rework risk.
- Team and org decisions (OD-31, OD-32, OD-33, OD-35) — tracked separately from
  product and technical decisions.

---

## §3 — Build-Blocker Decisions Table

Ten decisions meet the selection criteria above. They are ordered by the phase gate
at which they must be resolved, earliest first.

---

### BB-01 · Admin Identity Model and Login Endpoint

| Field | Value |
|---|---|
| **OD-## reference** | OD-22 |
| **Category** | Technical & Infrastructure |
| **Must resolve by** | Before Phase 2 begins |
| **Recommended default** | `User.is_admin = true` boolean flag on the shared `users` table; separate `/admin/auth/login` endpoint with admin-scoped session |
| **Current assumption** | `User.is_admin = true` assumed in `data-model.md (D11)` and `permission-matrix.md (A3)`; admin login endpoint TBD |
| **Options** | A — `is_admin` flag + separate admin login endpoint (recommended); B — separate admin identity table; C — role-elevation on existing user |
| **Why it blocks build** | WS2 (auth infrastructure) is built in Phase 2. The auth middleware and admin guard logic are both written to one model. If model changes after Phase 2, the auth layer must be rebuilt and every admin-protected route must be retested. Also affects the `users` table schema laid in Phase 0. |
| **Risk if unresolved** | WS2 and WS7 implement conflicting admin guard assumptions; admin route protection is wrong at launch; security gap if admin and fan sessions share the same scope |
| **Source documents** | data-model.md (D11) · api-surface.md (A9) · permission-matrix.md (A3) |

---

### BB-02 · Session Mechanism

| Field | Value |
|---|---|
| **OD-## reference** | OD-20 |
| **Category** | Technical & Infrastructure |
| **Must resolve by** | Before Phase 2 begins |
| **Recommended default** | JWT bearer token — consistent with `api-surface.md` assumption throughout; standard for NestJS/Next.js split architecture |
| **Current assumption** | JWT bearer token assumed in all API surface documentation |
| **Options** | A — JWT bearer token (recommended); B — signed HttpOnly session cookie |
| **Why it blocks build** | Auth middleware, token refresh endpoint, session invalidation, and `Authorization` header format all differ by choice. Auth infrastructure is built once in Phase 2 and underlies every subsequent workstream. Switching later requires rebuilding auth middleware and retesting all 24 page families. |
| **Risk if unresolved** | Auth infrastructure built on a working assumption that gets overridden mid-build; token lifecycle and logout behavior undefined; downstream WS2–WS9 all depend on this layer |
| **Source documents** | api-surface.md (A1) |

---

### BB-03 · Tier-Gated Access Model

| Field | Value |
|---|---|
| **OD-## reference** | OD-06 |
| **Category** | Product & Policy |
| **Must resolve by** | Before Phase 3 begins |
| **Recommended default** | Exact match — fan must hold the specific tier to access tier-gated content; no hierarchical inheritance between tiers |
| **Current assumption** | Exact match assumed at MVP across `data-model.md (D2)` and `permission-matrix.md (A13)` |
| **Options** | A — exact match only (recommended); B — higher tier includes lower tier (Tier 2 fan can access Tier 1 content) |
| **Why it blocks build** | WS4 builds the dual-status authorization layer in Phase 3. All entitlement queries across WS6 (checkout) and WS5 (library) are written to one access model. If the model changes after Phase 3, the entitlement evaluation layer must be rewritten and all entitlement tests regenerated. `MembershipPlan.tier_rank` field usage also differs by choice. |
| **Risk if unresolved** | Entitlement layer built to wrong model; subscribers locked out of content they should access, or granted content they should not; billing and access correctness at risk |
| **Source documents** | data-model.md (D2) · permission-matrix.md (A13) |

---

### BB-04 · File Upload Mechanism

| Field | Value |
|---|---|
| **OD-## reference** | OD-21 |
| **Category** | Technical & Infrastructure |
| **Must resolve by** | Before Phase 3 begins |
| **Recommended default** | Presigned PUT URL — client uploads directly to object storage; consistent with `api-surface.md` assumption; avoids backend bandwidth overhead |
| **Current assumption** | Presigned PUT assumed in `api-surface.md (A2)` |
| **Options** | A — presigned PUT URL (recommended); B — server-side upload proxy |
| **Why it blocks build** | WS4 implements product and post attachment upload in Phase 3. Storage CORS configuration, the `/dashboard/products/:id/file-upload-url` endpoint response shape, and frontend upload flow all depend on this choice. If changed after Phase 3, storage infrastructure and the frontend upload component both require rework. |
| **Risk if unresolved** | Storage CORS configured for wrong model; upload endpoint built to wrong shape; backend streaming infrastructure built unnecessarily if proxy is chosen |
| **Source documents** | api-surface.md (A2) |

---

### BB-05 · Unpublish Access Policy for Prior Purchasers

| Field | Value |
|---|---|
| **OD-## reference** | OD-01 |
| **Category** | Product & Policy |
| **Must resolve by** | Before Phase 3 begins (creator content management endpoints); must be confirmed before Phase 5 |
| **Recommended default** | Retain access — do not set `access_revoked_at` when creator unpublishes; fan paid in good faith and retains access |
| **Current assumption** | None settled across any source document |
| **Options** | A — set `access_revoked_at` on creator unpublish (revoke access); B — retain access for prior purchasers (recommended) |
| **Why it blocks build** | Phase 3 builds the creator content management endpoints including publish/unpublish. The write behavior of `access_revoked_at` must be known at this point — the endpoint either sets it on unpublish or does not. If resolved differently after Phase 5 (fan library), the entitlement evaluation logic and library view must both be rewritten. The `access_revoked_at` field exists in the data model regardless; the question is when and whether the platform writes it. |
| **Risk if unresolved** | Unpublish action built with wrong behavior; fans lose access to content they purchased, or retain access when the intended policy was revoke; legal exposure if either case is implemented without a deliberate policy decision |
| **Source documents** | data-model.md (D1) · billing-lifecycle.md (B2) · api-surface.md · permission-matrix.md (A4) · page-requirements.md (Assumption 8) |

---

### BB-06 · Flagged Content Visibility

| Field | Value |
|---|---|
| **OD-## reference** | OD-02 |
| **Category** | Product & Policy |
| **Must resolve by** | Before Phase 3 begins — the dual-status authorization layer ships in Phase 3 (WS4); the `flagged` state must be handled correctly from the moment the layer is written |
| **Recommended default** | Remain visible until explicitly removed — consistent with the source document default across `moderation-trust-rules.md` and `api-surface.md` |
| **Current assumption** | Visible until explicitly removed (stated default in source documents) |
| **Options** | A — remain visible until removed (recommended); B — auto-hidden when `moderation_status = flagged` |
| **Why it blocks build** | WS4 builds the dual-status authorization layer in Phase 3. This layer evaluates both `publish_status` and `moderation_status` on every content access request. If `flagged` auto-hides (Option B), the visibility matrix and the entitlement guard must implement that behavior from Phase 3. If Option A is used in Phase 3 and changed to B later in Phase 6 (when the flagging admin action ships), the dual-status layer must be patched. The `open-decisions-register.md` states "Before Phase 6" but the dual-status layer design is a Phase 3 concern. **Recommendation: resolve before Phase 3 to avoid a mid-build patch.** |
| **Risk if unresolved** | Flagged content either exposes or hides content incorrectly; dual-status layer logic is ambiguous; moderation tooling built in Phase 6 assumes a visibility rule that was never set |
| **Source documents** | moderation-trust-rules.md (M1) · api-surface.md (A5) |

---

### BB-07 · Payment Gateway Provider

| Field | Value |
|---|---|
| **OD-## reference** | OD-19 |
| **Category** | Technical & Infrastructure |
| **Must resolve by** | Before Phase 4 begins — this is the hard prerequisite for WS6 (Checkout/Billing/Entitlements) |
| **Recommended default** | No default — this is a business and vendor selection decision. Turkish payment processor required (iyzico, PayTR, Stripe with Turkish acquiring, or equivalent). |
| **Current assumption** | Provider TBD across all billing and API documents |
| **Options** | Select a Turkish-compliant payment processor. Decision factors: TRY settlement, webhook reliability, hosted payment form quality, TRY card tokenization, sandbox completeness |
| **Why it blocks build** | WS6 cannot begin checkout integration work without a selected provider. Webhook event shapes, hosted payment form, `gateway_customer_id` format, `gateway_subscription_id` format, and the payment SDK are all provider-specific. Every WS6 deliverable depends on this selection. This is the single highest-urgency unresolved decision for Phase 4 readiness. |
| **Risk if unresolved** | Phase 4 cannot start; WS6 is idle; entire checkout, subscription, and entitlement chain is blocked; launch timeline at risk |
| **Source documents** | billing-lifecycle.md (B5) · data-model.md (D4) · api-surface.md (A3) |

---

### BB-08 · Platform Fee Percentage

| Field | Value |
|---|---|
| **OD-## reference** | OD-27 |
| **Category** | Operational |
| **Must resolve by** | Before Phase 4 begins |
| **Recommended default** | No default — business decision. Set as a billing configuration value (not hardcoded in entities). Store in a config table or environment-level config keyed as `PLATFORM_FEE_PERCENT`. |
| **Current assumption** | Percentage TBD; stored in billing config (confirmed in data-model.md D10) |
| **Options** | Percentage value is a business decision. Implementation assumption: stored in config, not in the Invoice or MembershipSubscription entities. |
| **Why it blocks build** | WS6 invoice generation logic computes `platform_fee_amount = gross_amount × fee_percent` and `creator_earnings = gross_amount - platform_fee_amount`. Without a confirmed value, Invoice records cannot be generated correctly in Phase 4, and the creator dashboard revenue figure in Phase 3 (WS4) is undefined. Also required for OD-29 (dashboard display pre-fee vs. post-fee). |
| **Risk if unresolved** | Invoice records generated with wrong or zero fee split; creator dashboard shows incorrect earnings; creator trust at risk if displayed figures are later corrected |
| **Source documents** | billing-lifecycle.md (B4) · data-model.md (D10) |

---

### BB-09 · Creator Restriction Data Model

| Field | Value |
|---|---|
| **OD-## reference** | OD-24 |
| **Category** | Technical & Infrastructure |
| **Must resolve by** | Before Phase 6 begins — schema migration for `CreatorProfile` must precede WS7 moderation work |
| **Recommended default** | Boolean flag — add `is_restricted boolean DEFAULT false` to `CreatorProfile`; keeps the `status` enum clean for primary workflow states (pending_review, approved, rejected, suspended); restriction can coexist with any primary status |
| **Current assumption** | `CreatorProfile.status` enum does not include `restricted`; implementation unsettled in `data-model.md` |
| **Options** | A — add `restricted` to the `CreatorProfile.status` enum; B — add `is_restricted` boolean flag (recommended) |
| **Why it blocks build** | WS7 implements the `restrict_creator` moderation action in Phase 6. The schema must be migrated before any moderation code for restriction ships. If Option A is chosen, the `status` enum must be extended, which also touches every status-based query and guard. If Option B, it is an additive schema change. Either way, the schema must be decided before WS7 builds the restriction capability. |
| **Risk if unresolved** | WS7 implements restriction against the wrong schema; later migration touches enum values in production; every status-based guard must be reviewed if enum expands |
| **Source documents** | moderation-trust-rules.md (M8) · data-model.md |

---

### BB-10 · Report Reason Taxonomy

| Field | Value |
|---|---|
| **OD-## reference** | OD-05 |
| **Category** | Product & Policy |
| **Must resolve by** | Before Phase 6 begins — report intake UI and `Report.reason_code` enum cannot be finalized without this |
| **Recommended default** | No default — requires legal/ops input. Must align with Turkish regulatory requirements for content moderation and platform liability. Placeholder taxonomy in source documents is not suitable for production. |
| **Current assumption** | Placeholder taxonomy only across `data-model.md (D7)` and `page-requirements.md (Assumption 22)` |
| **Options** | Finalize specific enum values (e.g., harassment, misinformation, copyright, illegal content, other) aligned with Turkish law. Ops and legal must confirm. |
| **Why it blocks build** | `Report.reason_code` is a typed enum field in the data model. The report intake UI (Phase 6) cannot be finalized without the values. Admin moderation analytics on report types is meaningless without consistent taxonomy. Changing enum values after Phase 6 ships requires a migration and updates to any analytics built against the reason_code field. |
| **Risk if unresolved** | Report intake UI built with placeholder values that do not match legal requirements; reporting is a trust feature — wrong taxonomy creates regulatory and operational risk |
| **Source documents** | moderation-trust-rules.md (M4) · data-model.md (D7) · page-requirements.md (Assumption 22) |

---

## §4 — Recommended Defaults

Where a default is available and recommended, teams may proceed with the following
working assumptions. These must be explicitly confirmed (or overridden) before the
owning workstream begins implementation. A confirmed default that is later changed
triggers rework — treat these as candidate decisions, not settled ones.

| Decision | Recommended Default | Confirm Before | Rework Risk if Changed |
|---|---|---|---|
| BB-01: Admin identity model | `User.is_admin = true` + separate `/admin/auth/login` | Phase 2 | High — schema + auth guard rebuild |
| BB-02: Session mechanism | JWT bearer token | Phase 2 | High — auth middleware rebuild |
| BB-03: Tier-gated access model | Exact match only | Phase 3 | High — entitlement layer rewrite |
| BB-04: File upload mechanism | Presigned PUT URL | Phase 3 | Medium — storage CORS + upload component rework |
| BB-05: Unpublish access policy | Retain access (do not set `access_revoked_at`) | Phase 3 | Medium — entitlement + library logic rework |
| BB-06: Flagged content visibility | Remain visible until explicitly removed | Phase 3 | Medium — dual-status layer patch |
| BB-07: Payment gateway | No default — must be selected | Phase 4 | N/A — Phase 4 cannot begin without this |
| BB-08: Platform fee percentage | No default — must be set as config value | Phase 4 | Low if stored in config; high if hardcoded |
| BB-09: Creator restriction data model | `is_restricted` boolean flag | Phase 6 | Medium — schema migration + guard review |
| BB-10: Report reason taxonomy | No default — legal/ops input required | Phase 6 | Medium — enum migration + UI rework |

---

## §5 — Decisions That Can Wait Until Mid-Build

These decisions have working defaults or are additive scope. They do not block
any phase from starting and carry low rework risk if resolved late.

| ID | Title | Resolve Before | Reason Safe to Defer |
|---|---|---|---|
| OD-07 | Creator self-subscription | Phase 4 | Simple checkout guard (`403 SELF_SUBSCRIPTION_BLOCKED`); recommended default is block; one-line guard |
| OD-15 | Post access level change immediacy | Phase 3 | Immediate enforcement is the assumed default; grace period is an additive state |
| OD-23 | Order confirmation mechanism | Phase 4 | Polling already confirmed in `api-surface.md`; SSE/WebSocket are deferred; confirm the assumption |
| OD-25 | Idempotency-key header | Phase 4 | Business-rule dedup already confirmed; client idempotency keys are additive |
| OD-26 | Grace period duration | Phase 4 | Config value — 7 days recommended; low rework risk if changed |
| OD-28 | Stale Order cleanup timeout | Phase 4 | Config value; depends on OD-19 gateway selection; 30 minutes is standard |
| OD-29 | Dashboard revenue display | Phase 3 | `GET /dashboard/overview` response shape differs by choice; depends on OD-27; decide pre-fee vs. post-fee when platform fee is confirmed |
| OD-03 | Creator restriction de-listing | Phase 6 | Behavioral scope of restriction action; content remaining accessible is the safer default |
| OD-04 | Creator edit flagged post | Phase 6 | Editing allowed is the safer default (enables voluntary remediation); single guard on post-edit endpoint |
| OD-12 | Creator notification timing | Phase 6 | Notification event timing; on-removal-only is simpler default; additive to notify on flag |
| OD-09 | Price change subscriber notification | Phase 4 | Additive notification event; exclusion creates no rework |
| OD-10 | Pre-renewal reminder | Phase 4 | Additive notification event; exclusion creates no rework |
| OD-11 | Creator notification on new subscription | Phase 4 | Additive notification event; exclusion creates no rework |
| OD-13 | Retention offer on cancellation | Phase 4 | No offer is the confirmed MVP default; any offer is additive scope |
| OD-14 | Fan notification on creator suspension | Phase 6 | Additive notification event |
| OD-30 | Admin dashboard warning thresholds | Phase 6 | Operational calibration; no architectural impact |

---

## §6 — Decisions That Can Wait Until Pre-Launch

These decisions are genuine launch blockers but do not block any implementation
phase from beginning. They are assigned to WS9 (Launch Readiness).

| ID | Title | Why It Can Defer | Risk If Not Resolved at Launch |
|---|---|---|---|
| OD-08 | Billing behavior when creator suspended | Suspension with active subscribers is a rare scenario before significant creator activity exists; behavior can be defined during WS9 | Fans charged for inaccessible content; no compensation policy defined; legal and trust exposure |
| OD-16 | Annual cancellation — KVKK / Turkish consumer rights | Legal review can proceed in parallel with build; if annual plans are excluded from initial launch, defers slightly; must be resolved before annual plans are enabled | Platform may operate in violation of Turkish consumer protection law; proration or refund requirement unmet |
| OD-17 | Minimum refund policy | No-refund is the current MVP assumption; any refund capability is additive infrastructure | No policy in place for disputes from fans affected by content removal or creator suspension; legal and operational risk |
| OD-18 | Legal document re-acceptance on update | Deferred if legal documents are static at launch; must be resolved before any policy document is updated in production | Re-acceptance flow undefined; existing users may not be shown updated terms; legal exposure if required by Turkish law |

---

## §7 — Immediate Resolution Order

The table below defines the order in which build-blocker decisions should be closed out.
Dependencies between decisions are noted where they exist.

| Priority | Decision | Depends On | Owner Type | Target |
|---|---|---|---|---|
| 1 | **BB-07: Payment gateway (OD-19)** | Nothing | Executive / Business | Resolve immediately; Phase 4 cannot begin without it |
| 2 | **BB-08: Platform fee % (OD-27)** | Nothing (set as config) | Executive / Business | Resolve alongside OD-19; needed before any invoice logic is written |
| 3 | **BB-01: Admin identity model (OD-22)** | Nothing | Engineering (Backend) | Confirm default before Phase 2 begins |
| 4 | **BB-02: Session mechanism (OD-20)** | Nothing | Engineering (Backend) | Confirm JWT default before Phase 2 begins |
| 5 | **BB-03: Tier-gated access model (OD-06)** | Nothing | Product | Confirm exact-match default before Phase 3 begins |
| 6 | **BB-06: Flagged content visibility (OD-02)** | Nothing | Product / Trust & Safety | Resolve before Phase 3 begins (dual-status layer) |
| 7 | **BB-05: Unpublish access policy (OD-01)** | Nothing | Product / Legal | Resolve before Phase 3 content management endpoints |
| 8 | **BB-04: File upload mechanism (OD-21)** | Nothing | Engineering (Backend) | Confirm presigned PUT default before Phase 3 |
| 9 | **BB-09: Creator restriction schema (OD-24)** | Nothing | Engineering + Product | Decide schema before Phase 6 begins |
| 10 | **BB-10: Report reason taxonomy (OD-05)** | Legal / Ops input | Product / Legal / Ops | Resolve before Phase 6 begins |

**Cascade note:** OD-19 (gateway) gates OD-28 (stale Order timeout) because the timeout
should align with the gateway's payment session window. Resolve OD-19 first, then set
OD-28. OD-27 (platform fee) gates OD-29 (dashboard revenue display). Resolve OD-27
first, then confirm OD-29 display choice.

---

## §8 — Validation Checklist

Use this checklist before declaring the build-blocker brief complete and before
opening any Phase 2+ workstream.

**Coverage:**
- [ ] All 10 build-blocker decisions are present and mapped to a canonical OD-## entry
- [ ] No decision in §3 introduces new scope not traceable to a source planning document
- [ ] Every decision in §5 and §6 has a reason for deferral, not just an assertion

**Resolution readiness:**
- [ ] OD-19 (payment gateway) has a named decision owner and target resolution date
- [ ] OD-27 (platform fee) has a named decision owner and target resolution date
- [ ] OD-22 and OD-20 are confirmed before Phase 2 scope planning begins
- [ ] OD-06, OD-02, OD-01, OD-21 are confirmed before Phase 3 scope planning begins
- [ ] OD-24 and OD-05 are on the Phase 5 → 6 transition checklist

**Alignment with source documents:**
- [ ] All 10 BB-## decisions appear in `open-decisions-register.md` with the same recommended default
- [ ] Decisions confirmed as defaults here are recorded as resolved in `open-decisions-register.md`
- [ ] No decision confirmed here contradicts an explicit constraint in `billing-lifecycle.md`,
      `moderation-trust-rules.md`, `permission-matrix.md`, or `data-model.md`

**Out-of-scope check:**
- [ ] No code, sprint tickets, or implementation patterns in this document
- [ ] No new features or product decisions introduced
- [ ] §5 deferred list does not include any decision that has a schema or entitlement impact
      requiring earlier resolution
