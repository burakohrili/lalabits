# Decision Closeout Session 01 — lalabits.art Phase 1

> **Status:** Fully resolved — all four decisions confirmed 2026-03-27
> **Version:** v1.0
> **Scope:** Phase 1 MVP · Session 01 of build-blocker closeout
> **Authority level:** Canonical (upon decisions being recorded)
>
> **Derived from:** build-blocker-decisions.md · open-decisions-register.md ·
> data-model.md · api-surface.md · billing-lifecycle.md

---

## §1 — Session Objective

Resolve the four decisions that must be confirmed before Phase 2 and Phase 4 can
begin. Two decisions affect auth infrastructure (Phase 2 gate); two decisions affect
billing integration and invoice correctness (Phase 4 gate). None of these four
decisions can be defaulted away without explicit confirmation — each one has an
existing working assumption, but that assumption has never been formally accepted.

This session should produce four confirmed decisions. Each confirmed decision unblocks
a specific workstream start gate.

**What this session does NOT do:**
- Open new scope
- Revisit planning documents
- Produce code or implementation detail
- Cover the remaining six build blockers (those are Session 02+)

---

## §2 — Decision Order

Address decisions in this order. Decisions 1 and 2 have no dependencies between them
and can be resolved in parallel if separate owners are in the room. Decisions 3 and 4
also have no dependencies between them. However, decision 4 (platform fee) should be
resolved before the dashboard revenue display choice is made (OD-29, deferred).

| # | Decision | BB-## / OD-## | Phase Gate | Rework Risk if Changed Later |
|---|---|---|---|---|
| 1 | Admin identity model | BB-01 / OD-22 | Before Phase 2 | High — auth guard rebuild |
| 2 | Session mechanism | BB-02 / OD-20 | Before Phase 2 | High — auth middleware rebuild |
| 3 | Payment gateway provider | BB-07 / OD-19 | Before Phase 4 | N/A — Phase 4 cannot start |
| 4 | Platform fee percentage | BB-08 / OD-27 | Before Phase 4 | Low if stored in config |

---

## §3 — Pre-Read List

Bring or have read before the session:

- `data-model.md` §3 Entity 1 (User) — `is_admin` field confirmed at line 130
- `data-model.md` §10 D10, D11 — platform fee and admin model open decision notes
- `api-surface.md` §6.1 — session mechanism note (decision A1)
- `api-surface.md` §10 A1, A9 — open decision entries for session mechanism and admin endpoint
- `billing-lifecycle.md` §8.5 B4, B5 — platform fee and gateway open decision entries
- `build-blocker-decisions.md` §3 BB-01, BB-02, BB-07, BB-08 — full consequence tables

---

## §4 — Decisions

---

### Decision 1 — Admin Identity Model and Login Endpoint
**BB-01 / OD-22 · Technical & Infrastructure · Phase 2 gate**

**What must be decided:**
Whether admin identity is a flag on the shared `User` table, a separate admin
identity table, or a role elevation on the user record — and whether admin login
uses a separate endpoint (`/admin/auth/login`) or the shared `/auth/login`.

**Current assumption:**
`User.is_admin = true` boolean flag is already present in the approved data model
(`data-model.md`, Entity 1). The `is_admin` field exists in the `users` table schema.
A separate `/admin/auth/login` endpoint is assumed in `api-surface.md (A9)` but not
yet confirmed. The field, but not the endpoint, is already in the approved schema.

**Recommended default:**
Option A — confirm the existing `is_admin` flag model; add a separate
`POST /admin/auth/login` endpoint that issues an admin-scoped session.

**Options and exact consequences:**

**Option A — `User.is_admin = true` + separate `/admin/auth/login` (recommended)**
- `users` table keeps the existing `is_admin boolean DEFAULT false` field.
- Admin is provisioned by setting `is_admin = true` directly (no public signup path).
- `POST /admin/auth/login` is a separate endpoint from `POST /auth/login`.
- Admin session carries the same user identity but can be scoped differently
  (e.g., shorter expiry, separate token claim, separate Redis key prefix).
- Every admin-protected route guard checks: valid session AND `user.is_admin = true`.
- Fan and creator sessions issued via `/auth/login` cannot access admin routes even
  if a user somehow has `is_admin = true` and logs in via the fan endpoint.
- **Schema impact:** None — `is_admin` field is already in the approved data model.
- **Auth module impact:** One additional login endpoint + admin guard middleware.
- **Security note:** Admin access is bounded by the `is_admin` flag. If the flag is
  incorrectly set, admin access is granted. Provisioning must be tightly controlled.

**Option B — Separate `admins` table**
- New table independent of `users`. Admin identity does not share the `User` record.
- Completely separate auth module for admin: separate registration, login, sessions.
- `ModerationAction.admin_user_id` would reference the `admins` table, not `users`.
- Eliminates any path from fan account escalation to admin access.
- **Schema impact:** New `admins` table; FK references from `ModerationAction` and
  other admin-audit entities change to reference `admins` instead of `users`.
  Requires updates to `data-model.md` and `permission-matrix.md`.
- **Auth module impact:** Separate auth module, session store, and guard chain.
- **Implementation cost:** Materially higher. Separate auth system maintained alongside
  fan/creator auth.

**Option C — Role enum or roles array on `User`**
- Admin is one role among others (`fan`, `creator`, `admin`) on a shared `User`.
- `POST /auth/login` issues a token containing the user's roles.
- Admin routes check for `admin` in roles array.
- **Schema impact:** Replace or extend `is_admin` boolean with a roles structure.
  Requires a data model change from the approved `is_admin` boolean.
- **Auth module impact:** Role-based guard; more flexible but more surface area.
- **Not recommended:** Introduces role management complexity at MVP without benefit.

**Documents to update after this decision:**
- `open-decisions-register.md` — mark OD-22 as resolved with chosen option
- `data-model.md` — confirm or update Entity 1 (User) fields for Option B or C;
  no change needed for Option A
- `api-surface.md` — add `/admin/auth/login` endpoint to Family 1 (Auth) table
  if Option A confirmed; update §6.1 and §10 A9 with resolution note
- `permission-matrix.md` — confirm or update admin session scope definition

**Latest safe decision point:** Before Phase 2 begins. WS2 (auth infrastructure)
builds the auth module and admin guard in Phase 2. This decision must be confirmed
before that work scopes.

**Recommended final choice:** Option A. The `is_admin` flag is already in the approved
data model. Deviating to Option B requires a schema change and a materially more
complex auth implementation with no Phase 1 benefit. Option C adds unnecessary role
management complexity. Confirm Option A and add the `/admin/auth/login` endpoint.

---

### Decision 2 — Session Mechanism
**BB-02 / OD-20 · Technical & Infrastructure · Phase 2 gate**

**What must be decided:**
Whether the platform uses JWT bearer tokens (access + refresh token pair) or signed
HttpOnly session cookies backed by a server-side session store (Redis).

**Current assumption:**
JWT bearer token is assumed throughout `api-surface.md`. Every endpoint table shows
`Auth: Yes` meaning "requires a valid session" without specifying the mechanism.
`api-surface.md §6.1` explicitly names this as open decision A1. The assumption is
JWT, but it has not been formally confirmed.

**Recommended default:**
Option A — JWT bearer token with a short-lived access token and a refresh token.
Consistent with all api-surface.md assumptions and standard for NestJS/Next.js
split architecture.

**Options and exact consequences:**

**Option A — JWT bearer token (recommended)**
- Login returns `{ access_token, refresh_token, expires_in }`.
- All authenticated API calls include `Authorization: Bearer <access_token>` header.
- Access token: short-lived (e.g., 15 minutes). Refresh token: longer-lived (e.g.,
  7–30 days), stored securely by client.
- `POST /auth/refresh` endpoint required (not currently listed in api-surface.md;
  must be added if this option is confirmed).
- Logout: client discards tokens; optionally server-side refresh token blacklist in
  Redis (or short expiry makes blacklist less critical).
- Password reset invalidates all refresh tokens for the user.
- Token payload carries `user_id`, `is_admin`, and `email_verified_at` — guards can
  evaluate these claims without a DB lookup on every request.
- **CORS:** Simpler — no credential cookies, no `SameSite` configuration.
- **Admin session scope:** Admin login via `/admin/auth/login` can issue a JWT with
  a distinct `scope: admin` claim, allowing guard to distinguish admin vs. fan tokens
  even if the same user has both.
- **Infrastructure:** No server-side session storage required for auth itself (Redis
  is still used for other purposes, but not as the session store).
- **Frontend impact:** Next.js must store tokens securely (memory + HttpOnly refresh
  cookie is the standard pattern for Next.js).

**Option B — Signed HttpOnly session cookie**
- Login sets an HttpOnly, Secure, SameSite=Strict cookie containing a session ID.
- Server-side session record in Redis maps session ID → user data.
- All authenticated API calls send the cookie automatically (browser handles this).
- `POST /auth/refresh` not needed — session is renewed server-side.
- Logout: DELETE the Redis session key. Session is immediately invalid. No token
  expiry window during which a stolen token is usable.
- Password reset: delete all Redis sessions for the user_id.
- **CORS:** More complex — `credentials: 'include'` required on all API calls from
  the Next.js frontend; CORS `allowedOrigins` must be exact and cannot be wildcard.
- **Admin session scope:** Cookie-based sessions can carry `is_admin` in the session
  payload in Redis. Admin-scoped sessions must be explicitly structured in Redis.
- **Infrastructure:** Redis is now the auth session store. Redis failure = auth
  failure for all users.
- **Cross-domain consideration:** If the Next.js frontend and NestJS API are on
  different subdomains, SameSite cookie behavior requires careful CORS + cookie
  domain configuration.

**Documents to update after this decision:**
- `open-decisions-register.md` — mark OD-20 as resolved with chosen option
- `api-surface.md` — add `POST /auth/refresh` to Family 1 Auth table if Option A;
  update §6.1 with resolution note; update §10 A1
- `permission-matrix.md` — update session scope description to reflect mechanism

**Latest safe decision point:** Before Phase 2 begins. The auth module is built
in Phase 2 and is the foundation every subsequent workstream depends on.

**Recommended final choice:** Option A. JWT bearer token is already assumed in all
planning documents. Option B is not better for Phase 1 — it adds infrastructure
complexity (Redis as auth session store, CORS credential handling) without a
meaningful security benefit at MVP scale. Confirm Option A and add `POST /auth/refresh`
to the API surface.

---

### Decision 3 — Payment Gateway Provider
**BB-07 / OD-19 · Technical & Infrastructure · Phase 4 gate**

**What must be decided:**
Which payment gateway provider will process TRY transactions. This is a business and
vendor selection decision. The technical team cannot make this decision — it requires
executive or business owner sign-off.

**Current assumption:**
Provider TBD. All billing planning documents treat the gateway as unknown.
`billing-lifecycle.md (B5)`, `data-model.md (D4)`, and `api-surface.md (A3)` all
flag this as unresolved.

**Recommended default:**
None. A provider must be selected. There is no safe default for a payment provider.

**Options and exact consequences for the build:**

The provider selection affects the following implementation areas. Each area has a
different consequence depending on the provider chosen:

**Webhook event shapes:**
- The `POST /webhooks/billing` handler is written to a specific provider's event
  format. Event types (e.g., `payment_succeeded`, `payment_failed`, `subscription_renewed`)
  have different names and payload structures per provider.
- Selecting a provider determines the exact event names WS6 must handle.
- **Consequence of not deciding:** WS6 cannot write a single line of webhook handler code.

**Gateway identifier fields in the data model:**
- `BillingCustomer.gateway_customer_id` — format depends on provider (e.g., `cst_xxx` for iyzico, `cus_xxx` for Stripe)
- `MembershipSubscription.gateway_subscription_id` — provider-specific format
- `Order.gateway_transaction_id` — provider-specific format
- `Invoice.gateway_invoice_id` — provider-specific format
- **Consequence:** These are string fields — format does not affect schema, but
  knowing the format matters for debugging and gateway reconciliation.

**Checkout initiation:**
- `POST /checkout/membership` must return a payment initiation response to the
  frontend. The response shape (hosted payment form URL, payment token, embedded
  form parameters) is entirely provider-specific.
- **Consequence:** The checkout frontend component cannot be built until this is known.

**Subscription management:**
- Some providers (iyzico, Stripe) support native recurring subscription APIs.
  Others require the platform to manage renewal scheduling and charge the stored
  payment method via API.
- If the provider manages renewals natively: gateway sends `payment_succeeded` webhook
  at each renewal cycle automatically.
- If not: the platform must build a scheduled job to trigger renewal charges.
- **Consequence:** This determines whether WS6 includes a renewal scheduler job or delegates to the gateway.

**Turkish compliance:**
- The provider must support TRY settlement and Turkish card issuers. Not all
  international processors support Turkish acquiring natively.
- BDDK (Turkish banking regulator) compliance requirements apply.
- **Consequence of choosing a non-compliant provider:** Regulatory and operational
  risk; may require a provider switch after implementation begins.

**Sandbox availability:**
- Phase 4 testing requires a sandbox environment with test cards, webhook simulation,
  and subscription lifecycle simulation.
- **Consequence of a weak sandbox:** WS6 integration testing is impaired; end-to-end
  billing milestone (Milestone 4) cannot be verified.

**Documents to update after this decision:**
- `open-decisions-register.md` — mark OD-19 as resolved with selected provider
- `data-model.md` — add gateway provider name as a note to `BillingCustomer`,
  `MembershipSubscription`, `Order`, and `Invoice` gateway ID fields
- `api-surface.md` — update §10 A3 with gateway name; note checkout response shape
- `billing-lifecycle.md` — update §10 B5 with selected provider and subscription
  management model (native recurring vs. platform-managed)

**Latest safe decision point:** Before Phase 4 begins. This is the single highest-
urgency unresolved decision for the Phase 4 start gate. Phase 4 (WS6) cannot begin
checkout integration without a selected provider.

**Recommended final choice:** None from this document. Business / executive decision
required. When selecting, verify: TRY settlement, Turkish card support, webhook
reliability, native recurring subscription support, sandbox quality, BDDK compliance,
and contract / onboarding timeline (gateway onboarding can take 2–4 weeks).

---

### Decision 4 — Platform Fee Percentage
**BB-08 / OD-27 · Operational · Phase 4 gate**

**What must be decided:**
The percentage the platform retains from each transaction. This is a business
decision. The implementation is settled (stored in billing config, not hardcoded)
— only the value is open.

**Current assumption:**
Percentage TBD. `data-model.md (D10)` confirms it is stored in config, not in
entity fields. The `Invoice` entity in the current data model has a single
`amount_try` field — there are no `platform_fee_amount_try` or
`creator_earnings_amount_try` fields.

**This creates a secondary implementation decision** that must be confirmed at the
same time: whether the fee split is recorded per-Invoice, or computed at reporting
time from the config value.

**Recommended default:**
- Fee percentage: No default — business decision.
- Fee split storage: Compute at reporting time from config. Do not add fee split
  fields to the `Invoice` entity at Phase 1. Rationale: if the fee percentage
  changes, per-Invoice fee fields create historical inconsistency. Reporting queries
  apply the config value to `amount_try` to compute earnings. If per-invoice
  recording is required for creator payouts later, add the fields at that point.

**Options and exact consequences:**

**Option A — Compute fee split at reporting time from config (recommended)**
- `Invoice.amount_try` stores gross charge amount only.
- `creator_earnings = amount_try × (1 - PLATFORM_FEE_PERCENT)` computed in
  reporting queries and dashboard aggregates.
- `GET /dashboard/overview` computes and returns the net figure to the creator.
- Changing the fee percentage in config affects future reporting but not
  Invoice records (which store only the gross amount).
- **Schema impact:** No change to Invoice entity. No migration needed.
- **Risk:** If the fee percentage ever changes mid-subscription-period, historical
  Invoice records do not carry the fee that applied at time of charge. This is
  acceptable at Phase 1 — creator payout UI is explicitly deferred.

**Option B — Record fee split per Invoice**
- Add `platform_fee_amount_try` and `creator_earnings_amount_try` to `Invoice`.
- These are computed and stored at invoice creation time (webhook handler).
- Historical accuracy: each Invoice carries the exact fee split that applied
  to that specific charge.
- **Schema impact:** Two additional fields on `Invoice`. Requires a data model
  update and migration.
- **Implementation cost:** Webhook handler computes the split at invoice creation.
  Config must be available to the webhook handler at runtime.
- **Recommended if:** Creator payout operations or creator trust requires per-invoice
  fee transparency. For Phase 1 MVP with deferred payout UI, this is premature.

**Fee percentage value — implementation notes regardless of which option:**
- Store as `PLATFORM_FEE_PERCENT` in application config or a `billing_config` table.
- If stored in a `billing_config` table, the webhook handler reads it at runtime.
- Common SaaS range: 5–15% of gross transaction value.
- Dashboard display of creator earnings (OD-29) depends on this value being set.
  OD-29 (pre-fee vs. post-fee display) should be confirmed after this value is known.

**Documents to update after this decision:**
- `open-decisions-register.md` — mark OD-27 as resolved with confirmed percentage
  and fee split recording approach
- `data-model.md` — if Option B: update Invoice entity with two new fields; update D10
- `billing-lifecycle.md` — update §10 B4 with fee percentage; note invoice
  computation approach; update Invoice creation steps in §5.3–§5.5 if Option B
- `api-surface.md` — update §10 A6 (dashboard revenue display) once fee is confirmed;
  resolve OD-29 immediately after

**Latest safe decision point:** Before Phase 4 begins. Invoice records cannot be
generated correctly without a fee value. Creator dashboard revenue figures in Phase 3
(WS4 overview API) also depend on this being defined.

**Recommended final choice on fee split storage:** Option A (compute at reporting
time). Do not add fee split fields to Invoice at Phase 1. Fee percentage value
is a business decision — provide it as a config value before Phase 4 begins.

---

## §5 — Decisions Intentionally Not in This Session

The following build blockers are tracked in `build-blocker-decisions.md` but are
deliberately excluded from Session 01. They have later phase gates and do not block
Phase 2 or Phase 4 from beginning.

| Decision | BB-## / OD-## | Why Excluded from This Session |
|---|---|---|
| Tier-gated access model | BB-03 / OD-06 | Phase 3 gate; Phase 2 can begin without it |
| File upload mechanism | BB-04 / OD-21 | Phase 3 gate; confirmed default (presigned PUT) is stable |
| Unpublish access policy | BB-05 / OD-01 | Phase 3 gate; requires product + legal alignment |
| Flagged content visibility | BB-06 / OD-02 | Phase 3 gate; recommended default is stable |
| Creator restriction schema | BB-09 / OD-24 | Phase 6 gate; no urgency yet |
| Report reason taxonomy | BB-10 / OD-05 | Phase 6 gate; requires legal/ops input |

These six decisions are covered in Session 02 (Phase 3 gate decisions) and
Session 03 (Phase 6 gate decisions). Do not open them in this session.

---

## §6 — Post-Session Update Checklist

Complete these updates after the session, before Phase 2 scope planning begins.

**For each confirmed decision:**
- [ ] Resolution recorded in `open-decisions-register.md` — chosen option, brief rationale
- [ ] Relevant source document updated with resolution note (see "Documents to update"
      in each decision above)

**Decision 1 (Admin identity — OD-22):**
- [ ] `data-model.md` Entity 1 confirmed or updated
- [ ] `api-surface.md` Family 1 Auth table updated with `/admin/auth/login` endpoint
      (if Option A confirmed)
- [ ] `permission-matrix.md` admin session scope confirmed

**Decision 2 (Session mechanism — OD-20):**
- [ ] `api-surface.md` Family 1 Auth table updated with `POST /auth/refresh` endpoint
      (if Option A confirmed)
- [ ] `api-surface.md §6.1` updated with resolution note
- [ ] `permission-matrix.md` session mechanism confirmed

**Decision 3 (Payment gateway — OD-19):**
- [ ] Gateway provider name recorded in `open-decisions-register.md`
- [ ] `billing-lifecycle.md §10 B5` updated with provider name and subscription model
- [ ] `api-surface.md §10 A3` updated with provider name
- [ ] Gateway sandbox access obtained; credentials confirmed
- [ ] Gateway onboarding initiated if not already (allow 2–4 weeks)

**Decision 4 (Platform fee — OD-27):**
- [ ] Fee percentage recorded in `open-decisions-register.md`
- [ ] `billing-lifecycle.md §10 B4` updated with fee percentage
- [ ] `data-model.md D10` updated with confirmed storage approach
- [ ] OD-29 (dashboard display pre-fee vs. post-fee) confirmed immediately after
      (it is unblocked once OD-27 is resolved)

**Phase 2 readiness gate:**
- [ ] OD-22 resolved → WS2 auth module scope can be opened
- [ ] OD-20 resolved → WS2 auth module scope can be opened
- [ ] Both confirmed before Phase 2 sprint planning begins

**Phase 4 readiness gate (set target resolution date today):**
- [ ] OD-19 — named owner assigned; target resolution date set
- [ ] OD-27 — named owner assigned; target resolution date set
- [ ] Both confirmed before Phase 4 sprint planning begins
