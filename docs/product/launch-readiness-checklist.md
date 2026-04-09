# Launch Readiness Checklist — lalabits.art Phase 1

> **Status:** Approved
> **Version:** v1.0
> **Scope:** Phase 1 MVP
> **Authority level:** Canonical

---

## §1 — Document Purpose

This checklist defines the concrete pre-launch gates that must be true before lalabits.art
Phase 1 can ship safely and coherently. It is derived from and aligned with all seven
approved Phase 1 planning documents.

**What this document is:**
A single-pass gate review instrument used immediately before public launch. Each item
has a severity rating (HARD BLOCK / SOFT BLOCK / MONITOR), a binary pass condition, and
defined evidence so that the review is factual rather than subjective.

**What this document is not:**
It is not a QA test plan, sprint task list, or implementation guide. Items are stated as
outcomes to be confirmed, not as steps to achieve those outcomes.

**Source documents this checklist is derived from:**
- `implementation-phasing.md §9` — 7 integration milestones and §10 launch blockers
- `workstream-breakdown.md §10` — workstream-level launch blocker register (L1–L12)
- `open-decisions-register.md` — 8 launch-blocker open decisions (OD-01, OD-02, OD-05,
  OD-08, OD-16, OD-17, OD-19, OD-24)
- `billing-lifecycle.md §13` — billing lifecycle validation
- `moderation-trust-rules.md §14` — moderation rules validation
- `page-requirements.md` — 24 page family requirements
- `permission-matrix.md` — role and access definitions
- `data-model.md §9` — data model validation
- `api-surface.md §11` — API surface validation

---

## §2 — How to Use This Checklist

**Severity definitions:**

| Severity | Meaning |
|---|---|
| **HARD BLOCK** | Cannot launch. No exception accepted. A single unresolved HARD BLOCK is sufficient to stop launch. |
| **SOFT BLOCK** | Should not launch. Launch is possible only with a written exception documenting the risk, the accepted state, and a post-launch remediation commitment signed off by the relevant owner. |
| **MONITOR** | Launch can proceed. Item must be reviewed at the first scheduled post-launch review (within 2 weeks of launch). |

**How to work through the checklist:**

1. Work through §3 (Hard Launch Gates) first. If any HARD BLOCK fails, stop. Do not
   proceed to §4–§11 until §3 is fully passing. §3 items are cross-cutting and must
   be true regardless of which domain section they also appear in.

2. Work through §4–§11 (domain sections) independently. Each section maps to a set
   of workstream deliverables and integration milestones.

3. For each item, record the outcome (PASS / FAIL / EXCEPTION), the reviewer name,
   and the date. Evidence must be referenced, not summarized in free text.

4. Compile the Go/No-Go summary using §13 format before the launch decision is made.

**Open decision dependency:** Items tagged `[OD-##]` cannot be verified until the
referenced open decision in `open-decisions-register.md` has been resolved. If that
decision is still open when the checklist is run, the item is automatically FAIL.

**Item format used in each section:**

| Field | Meaning |
|---|---|
| ID | Unique checklist item ID |
| Area | The platform domain or capability this item covers |
| Requirement | What must be true — stated as an observable outcome |
| Why It Matters | The failure mode if this item is not true at launch |
| Pass Condition | The binary condition that constitutes a pass |
| Evidence Expected | What the reviewer checks to confirm pass |
| Severity | HARD BLOCK / SOFT BLOCK / MONITOR |

---

## §3 — Hard Launch Gates

These are the absolute cross-cutting blockers. Every item in this section is a HARD BLOCK.
A single failing item here stops launch, regardless of the state of §4–§11.

These items are drawn directly from `implementation-phasing.md §10` and
`workstream-breakdown.md §10 (L1–L12)`.

---

### Identity and Legal Consent

| ID | Area | Requirement | Why It Matters | Pass Condition | Evidence Expected | Severity |
|---|---|---|---|---|---|---|
| LG-01 | Legal Consent | Fan cannot complete registration without accepting Terms of Service and Privacy Policy | KVKK compliance: untracked consent is a legal gap from the first user registered | Zero fan registrations exist without a corresponding ConsentRecord for `terms_of_service` and `privacy_policy` | DB query returning count of Users with no ConsentRecord; result must be 0 | HARD BLOCK |
| LG-02 | Legal Consent | Creator cannot submit onboarding without accepting the Creator Agreement | Legal enforceability of the creator relationship depends on captured consent | Zero creator applications exist without a corresponding ConsentRecord for `creator_agreement` | DB query confirming every CreatorApplication has a linked ConsentRecord for `creator_agreement`; result must be 0 violations | HARD BLOCK |
| LG-03 | Auth | `email_verified_at IS NOT NULL` enforced at checkout and all sensitive API write endpoints | A fan with an unverified email could initiate a financial transaction on an unverified identity | Checkout attempt by a user with `email_verified_at = NULL` returns HTTP 403; subsequent request after verification succeeds | Manual or automated test: unverified user → checkout → 403 confirmed | HARD BLOCK |

---

### Creator Gating

| ID | Area | Requirement | Why It Matters | Pass Condition | Evidence Expected | Severity |
|---|---|---|---|---|---|---|
| LG-04 | Creator Gating | No creator public page is accessible unless `CreatorProfile.status = approved` | Pre-approval content or profile data exposure to the public | `GET /@[username]` for a creator with `status = pending_review`, `rejected`, or `suspended` returns 404 | Test each non-approved status; verify 404 in each case | HARD BLOCK |
| LG-05 | Creator Gating | No creator can publish content while `CreatorProfile.status ≠ approved` | A non-approved creator's content could appear in feeds or discovery before the platform has reviewed them | Post creation and publication API returns 403 for creators with non-approved status | Test pending creator attempts to create post; 403 confirmed | HARD BLOCK |
| LG-06 | Admin Auth | Admin auth gate enforced on every `/admin/*` route | Unprotected admin routes expose creator data, moderation tools, and platform operations to any user | Unauthenticated request and non-admin authenticated request to any `/admin/*` route both return 401 or 403 | Attempt a sample of admin routes as unauthenticated, as fan, as creator; all must be rejected | HARD BLOCK |

---

### Billing and Entitlement

| ID | Area | Requirement | Why It Matters | Pass Condition | Evidence Expected | Severity |
|---|---|---|---|---|---|---|
| LG-07 | Billing Lifecycle | `MembershipSubscription` is created only by webhook `payment_succeeded`, never at checkout initiation | If a subscription is created at checkout initiation, payment failures produce subscriptions with no corresponding payment — a revenue and entitlement integrity failure | DB inspection after checkout initiation and before webhook: no `MembershipSubscription` exists; DB inspection after `payment_succeeded` webhook: `MembershipSubscription (active)` exists | Test sequence: initiate checkout → inspect DB (no subscription) → fire webhook → inspect DB (subscription exists) | HARD BLOCK |
| LG-08 | Billing Lifecycle | Failed initial payment leaves no `MembershipSubscription` and no `Invoice` | A failed payment that creates a subscription grants access without revenue | After `payment_failed` webhook fires for an initial purchase: `Order.status = failed`; zero `MembershipSubscription` and zero `Invoice` records exist for that order | Simulate `payment_failed` webhook; inspect DB for absence of subscription and invoice | HARD BLOCK |
| LG-09 | Billing Lifecycle | Webhook `event_id` idempotency prevents duplicate records on replay | Payment gateways retry webhooks on delivery failure; duplicate events must not create duplicate subscriptions or purchase records | Replaying the same `payment_succeeded` event twice produces identical DB state on both replays — no additional records created by the second replay | Replay same event ID twice; compare DB record counts before and after second replay | HARD BLOCK |
| LG-10 | Entitlement | Entitlement evaluated at request time from live entity state — not from a cache | A cached entitlement decision could grant access after a subscription has expired, been cancelled, or after moderation has removed content | Manually set `MembershipSubscription.status = expired` in DB; next content request is immediately blocked with no cache-serving window | Update subscription state in DB; send content request within seconds; verify 403/404 | HARD BLOCK |
| LG-11 | Entitlement | `moderation_status = removed` blocks all content access regardless of subscription or purchase | Removed content must not be served to any fan regardless of their entitlement status; serves as the absolute override for safety | Fan with active subscription to a creator whose post has `moderation_status = removed` receives 404/403 on that post; subscription remains active for other content | Set content to removed; entitled fan makes request; 403/404 confirmed; other content still accessible | HARD BLOCK |
| LG-12 | Billing Jobs | Grace period and subscription expiry scheduled jobs running and verified in production | Expired subscriptions that continue providing access allow indefinite free access after cancellation or payment failure | Production scheduler logs confirm both jobs (`cancelled → expired` and `grace_period → expired`) have completed at least one successful run | Scheduler run log with timestamps; DB state showing at least one `cancelled → expired` and one `grace_period → expired` transition in production | HARD BLOCK |

---

### Moderation and Trust

| ID | Area | Requirement | Why It Matters | Pass Condition | Evidence Expected | Severity |
|---|---|---|---|---|---|---|
| LG-13 | Moderation | Creator suspension immediately hides all creator content from all non-admin callers — no delay | Suspended creator's content must not remain visible while the moderation action is in effect | Within the same request-response cycle as the suspension action, `GET /@[username]` returns 404; all content endpoints for that creator return 404 to non-admin callers | Suspend creator via admin action; immediately (within seconds) request public page; 404 confirmed; content endpoint confirmed 404 | HARD BLOCK |
| LG-14 | Audit Trail | Every admin write action creates a `ModerationAction` record; no silent admin action | Without an audit trail, the platform has no record of what admin actions were taken and when — a trust and accountability failure from the first admin action | For every admin action (approve, reject, suspend creator; flag, remove, restrict content; dismiss report), a `ModerationAction` record is present in DB; if the audit write fails, the entire action transaction rolls back | Execute each admin action type; verify `ModerationAction` count increments; verify DB state is unchanged if audit write is forced to fail | HARD BLOCK |
| LG-15 | Data Exposure | `admin_note` is never present in any non-admin API response | Admin notes may contain sensitive operational context that must not leak to content creators or fans | Inspect API responses for all content, user, and moderation-related endpoints as a non-admin caller; `admin_note` field absent from all responses | Automated response body inspection across a sample of endpoints; grep-style check for `admin_note` key in non-admin responses | HARD BLOCK |

---

### Open Decisions

| ID | Area | Requirement | Why It Matters | Pass Condition | Evidence Expected | Severity |
|---|---|---|---|---|---|---|
| LG-16 | Open Decisions | All 8 launch-blocker open decisions resolved and documented: OD-01, OD-02, OD-05, OD-08, OD-16, OD-17, OD-19, OD-24 | Unresolved launch-blocker decisions mean the system may have been built to an undefined or wrong behavior in areas that affect safety, billing, and legal compliance | Each of the 8 decisions has a documented resolution (chosen option + rationale) recorded in `open-decisions-register.md`; the implementation reflects the chosen option | Review `open-decisions-register.md` for each of the 8 decisions; verify each shows resolved status; spot-check implementation matches documented choice | HARD BLOCK |

---

### Infrastructure

| ID | Area | Requirement | Why It Matters | Pass Condition | Evidence Expected | Severity |
|---|---|---|---|---|---|---|
| LG-17 | Infrastructure | Payment gateway production configuration verified with a real TRY transaction | A gateway that works in staging may fail in production due to merchant account configuration, live webhook endpoints, or provider approval status | At least one real-money subscription or product purchase completed in production with a real Turkish payment instrument; production Order record with `gateway_transaction_id` exists; webhook processed; subscription or purchase created | Production DB showing `Order.status = completed` with real `gateway_transaction_id`; corresponding `MembershipSubscription` or purchase record active | HARD BLOCK |
| LG-18 | Integration | All 7 integration milestones pass in production or production-equivalent staging | Milestone failures indicate that core user journeys are broken; a platform where fans cannot subscribe or creators cannot publish is not ready to launch | Milestones 1–6 each have a recorded sign-off; Milestone 7 sign-off is the final launch approval | Milestone sign-off records for M1–M6 (staging); M7 review initiated in production | HARD BLOCK |

---

## §4 — Product Surface Readiness

All 24 approved page families must be functional before launch. Items are drawn from
`page-requirements.md` (all 24 families) and `implementation-phasing.md` Milestone 7.

| ID | Area | Requirement | Why It Matters | Pass Condition | Evidence Expected | Severity |
|---|---|---|---|---|---|---|
| PS-01 | All 24 families | Every approved page family accessible at its defined route without a 5xx error | A family that returns 5xx is broken in production | Each of the 24 family URLs returns HTTP 200 (or correct redirect) when accessed in production | Smoke test log: 24 routes, HTTP status for each | HARD BLOCK |
| PS-02 | Responsive Design | All 24 families render without critical layout breakage at desktop (1440px), tablet (768px), and mobile (375px) | The platform is web-only and must be usable across the full breakpoint range; a broken mobile layout at launch blocks the majority of Turkish internet users | No critical layout breakage on any family at any breakpoint — no overlapping elements that hide primary content, no inaccessible primary CTAs | Screenshot or recorded screen review across 3 breakpoints for all 24 families | SOFT BLOCK |
| PS-03 | Turkish Copy | Turkish routes and Turkish-language copy rendered correctly throughout all 24 families; no untranslated placeholder strings visible | The platform is Turkey-first; English placeholders or broken Turkish copy undermine the brand and creator trust | Spot-check of all 24 families: correct Turkish route slugs in address bar; no English placeholder strings in visible UI copy | Manual spot-check across 24 families; list of any untranslated strings | SOFT BLOCK |
| PS-04 | Error Handling | No unhandled 5xx error on any approved page family during smoke test | An unhandled server error on any family means the platform is partially broken at launch | Zero 5xx responses across a full smoke test of all 24 families and their key states | Error monitoring dashboard showing zero 500s during pre-launch smoke test window | HARD BLOCK |
| PS-05 | Auth States | Authenticated and unauthenticated access states correct across all families | A fan who reaches a gated page without auth must be redirected or blocked, not shown broken content | Unauthenticated user accessing gated families is redirected to login or receives 401; authenticated user with correct permissions can access | Manual test: unauthenticated access to library, dashboard, account, checkout — each redirects correctly | HARD BLOCK |
| PS-06 | Creator Gating | Creator public page (`/@[username]`) returns 404 for all non-approved creators | A non-approved creator's page appearing in search or via direct link reveals unreviewed creator content | `GET /@[username]` returns 404 for creators with `status ≠ approved`; returns 200 for approved creator | Test 3 non-approved creator URLs across different statuses; all must be 404 | HARD BLOCK |
| PS-07 | Legal Links | Legal pages (22, 23, 24) linked from fan signup, creator signup, and creator onboarding at the correct steps | KVKK requires that legal pages be accessible at the point of consent; broken links mean consent UI is incomplete | Fan signup, creator signup, and onboarding step 5 each contain working links to the correct legal pages; links load correct content | Click-through test of legal links at each consent point | HARD BLOCK |
| PS-08 | Checkout States | Checkout confirmation surfaces reflect correct post-payment state for success, failure, and pending | A fan who paid but sees a broken or incorrect confirmation state has no trust signal; a fan who failed but sees a success state is misled | Successful payment: confirmation page with subscription/purchase acknowledgment; failed payment: failure page with retry guidance; pending: appropriate waiting state | End-to-end checkout test across success and failure paths | HARD BLOCK |
| PS-09 | Library | Fan library shows only content the fan is entitled to; no over-serving or under-serving | Over-serving grants unpaid access; under-serving blocks paying fans — both are launch-critical failures | Fan with no subscriptions sees only free content; fan with active subscription sees tier-appropriate content; fan with expired subscription loses gated access | Library access test with fans in different entitlement states | HARD BLOCK |
| PS-10 | Admin Routes | Admin surfaces return 401 or 403 to non-admin requests | An accessible admin dashboard exposes all creator applications and moderation data to anyone with a URL | Every `/admin/*` route returns 401 or 403 for unauthenticated and non-admin authenticated requests | Route test across admin URL sample; no 200 returned to non-admin | HARD BLOCK |
| PS-11 | Internal Links | No broken internal navigation links on any of the 24 families | Broken links disrupt user journeys at critical moments (e.g., broken checkout link, broken dashboard navigation) | Link audit across all 24 families: every internal link resolves to a defined route with a valid HTTP response | Automated link checker output; zero 404s on internal links | SOFT BLOCK |
| PS-12 | Empty States | Content-dependent pages show correct empty states when content is not yet available | A blank page or unhandled null state confuses users; correct empty states communicate intent | Home, Discovery, Library, and Dashboard show intentional empty states when no content exists | Manual test with a new account that has no content or entitlements | MONITOR |

---

## §5 — Auth / Consent Readiness

Maps to: **Milestone 1** (Identity Foundation Ready) from `implementation-phasing.md §9`.
Source documents: `page-requirements.md` Families 3–6, 22–24; `billing-lifecycle.md`;
`permission-matrix.md`; `data-model.md`.

| ID | Area | Requirement | Why It Matters | Pass Condition | Evidence Expected | Severity |
|---|---|---|---|---|---|---|
| AC-01 | Fan Consent | Fan registration creates `ConsentRecord` for `terms_of_service` and `privacy_policy` at the point of account creation | Without this record, the platform has no evidence of legal consent from any fan | Every User created via fan signup has a corresponding ConsentRecord for both consent types before any other operation is permitted | DB query: Users with no ConsentRecord — count must be 0 | HARD BLOCK |
| AC-02 | Creator Consent | Creator signup creates `ConsentRecord` for `terms_of_service` and `privacy_policy` | Creator accounts created without consent records are non-compliant from their first action | Every User created via creator signup has a corresponding ConsentRecord for both consent types | DB query: creator-origin Users with no ConsentRecord — count must be 0 | HARD BLOCK |
| AC-03 | Creator Agreement | Creator onboarding step 5 creates `ConsentRecord` for `creator_agreement` at the point of acceptance | The creator agreement is the legal basis for the creator-platform relationship; unrecorded acceptance creates legal exposure | Every `CreatorApplication` has a linked `ConsentRecord` for `creator_agreement` | DB query: CreatorApplications with no linked creator_agreement ConsentRecord — count must be 0 | HARD BLOCK |
| AC-04 | Email Verification | Email verification flow delivers a verification email and sets `User.email_verified_at` upon successful verification | Without working email verification, the checkout `email_verified_at IS NOT NULL` guard cannot be satisfied by legitimate users | Verification email delivered; clicking link sets `email_verified_at`; attempting re-use of verification link returns error | End-to-end verification flow test; confirm `email_verified_at` set in DB; confirm link cannot be reused | HARD BLOCK |
| AC-05 | Login / Logout | Login issues a valid session token (JWT or equivalent); logout invalidates the session | A session that cannot be invalidated means a compromised token has indefinite validity | Login returns a valid session token used by subsequent authenticated requests; logout makes that token invalid on next use | Login → use token → logout → attempt to use same token → 401 confirmed | HARD BLOCK |
| AC-06 | Password Reset | Password reset delivers an email; the reset link sets a new password and expires after use | Without working password reset, users locked out of their accounts have no recovery path | Reset email delivered; link allows password change; second use of same link returns error; login with new password succeeds | Full password reset flow test; confirm link expiry | HARD BLOCK |
| AC-07 | Auth Guard | Unverified fan (`email_verified_at IS NULL`) cannot access checkout or download endpoints | A fan who has not verified their email should not be able to initiate financial transactions | Checkout attempt by unverified fan returns 403 with `EMAIL_NOT_VERIFIED` or equivalent error code | Test checkout with `email_verified_at = NULL`; confirm 403 | HARD BLOCK |
| AC-08 | Admin Auth | Admin login uses a separate endpoint from fan/creator login; admin session is scoped to admin routes only | Admin and fan sessions must be isolated; a leaked fan session must not grant admin access | Admin login at separate endpoint succeeds; admin session token grants access to `/admin/*`; fan session token does not | Test fan token on admin route — must be rejected; test admin token on fan route — validate correct scoping | HARD BLOCK |
| AC-09 | Legal Pages | Legal pages 22 (ToS), 23 (Privacy Policy), 24 (Creator Agreement) render publicly without authentication | Legal pages must be accessible to anyone before they accept consent; authentication-gating them makes consent capture non-functional | All three legal page routes return 200 without an authentication header | Unauthenticated GET to each legal page route; all return 200 | HARD BLOCK |
| AC-10 | Consent Version | `ConsentRecord` version reference matches the currently published version of the legal page at time of registration | If the legal page is updated, old consent records should reference the version that was active at acceptance | `ConsentRecord.document_version` matches the version identifier of the legal page that was live at the time of record creation | DB spot-check: ConsentRecord version fields align with the legal page version history | SOFT BLOCK |

---

## §6 — Creator Onboarding / Review Readiness

Maps to: **Milestone 2** (Creator Can Apply and Be Approved) from `implementation-phasing.md §9`.
Source documents: `page-requirements.md` Families 7, 9, 20; `moderation-trust-rules.md §5`;
`data-model.md`; `workstream-breakdown.md WS3, WS7`.

| ID | Area | Requirement | Why It Matters | Pass Condition | Evidence Expected | Severity |
|---|---|---|---|---|---|---|
| CR-01 | Onboarding Wizard | Creator can complete all 6 onboarding steps (profile, category, tier config, IBAN, agreement, confirmation) and submit application | If the onboarding wizard cannot be completed, no creators can apply and the platform has no content | A new creator account with verified email can navigate and submit all 6 steps without error | End-to-end onboarding flow test from a fresh account | HARD BLOCK |
| CR-02 | Application Submission | `CreatorProfile.status` transitions to `pending_review` on application submission | Without the correct status transition, the application does not appear in the admin review queue | After onboarding submission, `CreatorProfile.status = pending_review` in DB; application appears in admin review queue | DB state check post-submission; admin queue inspection | HARD BLOCK |
| CR-03 | Admin Review Queue | Admin can view submitted application at `/admin/yaraticilar/inceleme` with profile, category, and application data visible | If the admin cannot see the application, the approval cycle cannot function | Admin accessing the review queue sees all `pending_review` applications with relevant details | Admin login → review queue → confirm applications visible with correct data | HARD BLOCK |
| CR-04 | Approve Action | Admin approval: `CreatorProfile.status → approved`; creator receives approval email; `ModerationAction` record created | If approval doesn't work, no creators can go live; missing audit record is an integrity failure | After admin approve action: status is `approved` in DB; creator email received; `ModerationAction` row exists for the action | DB check for all three outcomes; inspect email delivery; confirm ModerationAction row | HARD BLOCK |
| CR-05 | Reject Action | Admin rejection: `CreatorProfile.status → rejected`; creator receives rejection email with reason; `ModerationAction` created | Rejection without a reason leaves the creator with no path to improvement; missing audit record is an integrity failure | After admin reject action: status is `rejected` in DB; rejection email contains reason; `ModerationAction` row exists | DB check; inspect email with reason present; confirm ModerationAction row | HARD BLOCK |
| CR-06 | Suspend Action | Admin suspension: `CreatorProfile.status → suspended`; all creator content immediately returns 404 to non-admin callers; `ModerationAction` created | Suspension that does not propagate immediately to content visibility means illegal or harmful content remains live | After admin suspend action: `GET /@[username]` returns 404; all content endpoints for that creator return 404; `ModerationAction` row exists | Suspend creator; immediately test public page and content URLs; confirm 404; confirm ModerationAction | HARD BLOCK |
| CR-07 | Dashboard Access Gate | Approved creator gains access to `/dashboard`; creator with any other status does not | Creator dashboard access before approval would allow publishing before review | Approved creator: `/dashboard` returns 200; pending/rejected/suspended creator: `/dashboard` returns 401 or redirect | Test each status against dashboard route | HARD BLOCK |
| CR-08 | Public Page Gate | `GET /@[username]` returns 404 for creators with `status = pending_review`, `rejected`, or `suspended` | Pre-approval or post-suspension creator public pages must not be accessible | All three non-approved statuses return 404 on the public page route | Test one creator per non-approved status; confirm 404 in each case | HARD BLOCK |
| CR-09 | IBAN Security | IBAN stored encrypted at rest; admin review panel shows only `iban_last_four` and `iban_format_valid`; full IBAN string never returned in any API response | Full IBAN exposure in any API response is a PII security failure | Admin review panel shows only masked IBAN fields; no API endpoint returns the full IBAN string to any caller | Inspect admin creator review API response; confirm no full IBAN field present | HARD BLOCK |
| CR-10 | Creator Agreement Consent | `ConsentRecord` for `creator_agreement` present in DB after onboarding step 5 acceptance | Without this record, the creator agreement acceptance is untracked | After step 5 of onboarding: `ConsentRecord` with `consent_type = creator_agreement` exists linked to the creator's User record | DB check post-onboarding step 5; ConsentRecord present | HARD BLOCK |
| CR-11 | Rejection UX | Rejected creator sees rejection reason and a resubmit CTA in their dashboard pending state | A creator with no path forward after rejection abandons the platform unnecessarily | After rejection: creator dashboard shows rejection reason text and a link or button to begin a new application | Manual test: reject a creator; inspect rejected creator's dashboard view | SOFT BLOCK |
| CR-12 | Concurrent Actions | Two admin users actioning the same pending application simultaneously does not produce invalid state | Race conditions on the review queue could double-process an application or produce split state | Concurrent approve and reject actions on the same application result in exactly one action taking effect; DB state reflects one outcome only | Concurrent request test; confirm single final state | SOFT BLOCK |

---

## §7 — Commerce / Billing / Entitlement Readiness

Maps to: **Milestones 3, 4, 5** from `implementation-phasing.md §9`.
Source documents: `billing-lifecycle.md` (full); `api-surface.md §7`; `data-model.md`;
`open-decisions-register.md` OD-01, OD-20, OD-26, OD-27.

| ID | Area | Requirement | Why It Matters | Pass Condition | Evidence Expected | Severity |
|---|---|---|---|---|---|---|
| BL-01 | Content Publishing | Published membership plans visible in creator public page tiers tab; published products and collections visible in shop and collections tabs | Without published content, fans have nothing to subscribe to or purchase | Approved creator's public page shows correct published tiers, products, and collections | Inspect public page tabs for a creator with published content | HARD BLOCK |
| BL-02 | Checkout Initiation | Membership checkout initiation creates `Order (pending)` only; no `MembershipSubscription` at this stage | Premature subscription creation creates access without confirmed payment | After `POST /checkout/membership` and before any webhook: `Order.status = pending` in DB; no `MembershipSubscription` exists for this checkout | DB inspection between checkout initiation and webhook firing | HARD BLOCK |
| BL-03 | Payment Success — Membership | `payment_succeeded` webhook (initial): `Order → completed`; `MembershipSubscription (active)` created; `Invoice` created | These three state transitions are the core billing lifecycle for memberships; any missing transition is a billing integrity failure | After `payment_succeeded` webhook: `Order.status = completed`, `MembershipSubscription.status = active`, `Invoice` row exists | DB inspection after webhook fires; verify all three records in correct state | HARD BLOCK |
| BL-04 | Payment Failure — Initial | `payment_failed` webhook (initial): `Order → failed`; no `MembershipSubscription` created; no `Invoice` created | A failed payment that creates a subscription or invoice is an unearned entitlement and a billing record error | After `payment_failed` webhook: `Order.status = failed`; DB contains no `MembershipSubscription` for this checkout attempt; no `Invoice` | DB inspection after failed webhook; confirm absence of subscription and invoice | HARD BLOCK |
| BL-05 | Product Checkout | Product checkout completes end-to-end: `ProductPurchase` record created with `status = active` by `payment_succeeded` webhook | Without product purchase records, fan library entitlement for products cannot be established | After product checkout and webhook: `ProductPurchase` exists with `access_revoked_at = NULL` | End-to-end product checkout test; DB inspection | HARD BLOCK |
| BL-06 | Collection Checkout | Collection checkout completes end-to-end: `CollectionPurchase` record created by `payment_succeeded` webhook | Without collection purchase records, fan library entitlement for collections cannot be established | After collection checkout and webhook: `CollectionPurchase` exists with `access_revoked_at = NULL` | End-to-end collection checkout test; DB inspection | HARD BLOCK |
| BL-07 | Renewal — Success | Renewal `payment_succeeded` webhook: `MembershipSubscription.current_period_end` updated to next period; new `Invoice` created | Without correct renewal processing, the subscription period remains in the past and entitlement enforcement expires active subscribers | After renewal webhook: subscription period extended; new Invoice row exists for the renewal period | Simulate renewal webhook; DB inspection of period dates and invoice count | HARD BLOCK |
| BL-08 | Renewal — Failure | Renewal `payment_failed` webhook: `MembershipSubscription.status → grace_period`; `grace_period_ends_at` set correctly based on configured duration | Grace period without `grace_period_ends_at` means the expiry scheduled job has no target date to work against | After renewal failure webhook: `status = grace_period`; `grace_period_ends_at` is set to a future timestamp consistent with configured grace period duration (OD-26) | Simulate renewal failure webhook; DB inspection of status and grace_period_ends_at | HARD BLOCK |
| BL-09 | Cancellation | Cancellation: `MembershipSubscription.status → cancelled`; fan retains access until `current_period_end`; entitlement enforced correctly during that window | A cancellation that immediately blocks access violates the commitment made at checkout that access continues to the period end | After cancellation: `status = cancelled`; fan can still access tier-gated content within the period; access blocked after `current_period_end` | Cancellation test; verify continued access before period end; verify blocked access after | HARD BLOCK |
| BL-10 | Expiry Job | Scheduled job transitions `MembershipSubscription.status: cancelled → expired` after `current_period_end` (verified in production) | Without this job, cancelled subscriptions retain access indefinitely beyond the period end | Production scheduler log shows job has run; at least one subscription has transitioned `cancelled → expired` in production DB | Production scheduler log; DB state showing expired subscriptions | HARD BLOCK |
| BL-11 | Grace Period Expiry Job | Scheduled job transitions `MembershipSubscription.status: grace_period → expired` after `grace_period_ends_at` | Without this job, subscriptions in grace period retain access indefinitely | Production scheduler log shows job has run; at least one `grace_period → expired` transition confirmed in production | Production scheduler log; DB state | HARD BLOCK |
| BL-12 | Webhook Idempotency | Replaying any webhook event with the same `event_id` produces no additional records — identical DB state on first and second delivery | Payment gateways retry webhooks on delivery failure; duplicate events must not create duplicate subscriptions, invoices, or purchase records | Replay of `payment_succeeded`, `payment_failed` (initial and renewal) with same event_id — DB record count identical before and after second replay | Idempotency test for each webhook event type; compare DB before and after replay | HARD BLOCK |
| BL-13 | Tier Entitlement | Tier-gated content entitlement: fan with active subscription to the correct tier can access the content; fan subscribed to a different tier cannot | Incorrect tier matching grants access to content the fan has not paid for, or blocks access to content they have | Fan subscribed to Tier A can access Tier A content; fan subscribed to Tier B cannot access Tier A content (or can, per OD-06 resolution) | Tier entitlement test using the OD-06 resolved access model | HARD BLOCK |
| BL-14 | Product Entitlement | Fan with `ProductPurchase` where `access_revoked_at IS NULL` can download the product via signed URL after entitlement check | Product download without entitlement check would allow free download | Entitled fan receives a signed download URL; non-entitled fan receives 403; signed URL expires correctly | Entitlement test for product download; confirm 403 for non-entitled fan; confirm URL expiry | HARD BLOCK |
| BL-15 | Collection Entitlement | Fan with `CollectionPurchase` where `access_revoked_at IS NULL` can access collection content | Collection access without entitlement check would allow free access | Entitled fan can access collection items; non-entitled fan receives 403 | Entitlement test for collection access | HARD BLOCK |
| BL-16 | Moderation Override | `moderation_status = removed` blocks all content access regardless of active subscription or purchase record | The moderation override is the safety layer; if removed content is served to paying fans, the platform has no safety enforcement capability | Fan with active, valid subscription cannot access a post/product with `moderation_status = removed`; error response is 404 or 403 | Set content to removed; entitled fan requests content; 403/404 confirmed; subscription remains active for other content | HARD BLOCK |
| BL-17 | Storage Key Security | `storage_key` and `file_storage_key` never returned raw in any API response; all file access via signed URL endpoints only | Raw storage keys expose the object storage hierarchy and allow direct, unauthenticated file access bypassing entitlement | Inspect all API responses for post attachments and product files; no `storage_key` or `file_storage_key` field present; access only via signed URL endpoint | API response inspection for attachment and product detail endpoints | HARD BLOCK |
| BL-18 | Checkout Pre-Guards | All checkout pre-guards enforced: `email_verified_at IS NOT NULL`; creator `status = approved`; plan/product `publish_status = published`; `SUBSCRIPTION_EXISTS` duplicate check | Each guard prevents a specific class of invalid checkout: unverified identity, unapproved creator, unpublished content, duplicate subscription | Each guard condition independently blocks checkout with the correct error code | Test each guard condition in isolation; confirm correct error response for each | HARD BLOCK |
| BL-19 | Card Data | `PaymentMethodSummary` contains display-only data; no raw card number, CVV, or full card data stored by lalabits.art in any entity or API response | Storing raw card data violates PCI-DSS; lalabits.art must not store it under any circumstances | Inspection of `PaymentMethodSummary` API responses confirms only last-four digits, card type, and expiry month/year are present | API response inspection; DB entity inspection for PaymentMethodSummary fields | HARD BLOCK |
| BL-20 | Grace Period Config | Grace period duration configured as a billing module config value; not hardcoded; OD-26 resolved | Without a configured value, `grace_period_ends_at` cannot be correctly computed | OD-26 is resolved and documented; `grace_period_ends_at` computation in production uses the configured value | OD-26 resolution document; billing config value confirmed in production environment | HARD BLOCK |
| BL-21 | Platform Fee Config | Platform fee percentage configured in billing config; OD-27 resolved; invoice amounts computed correctly | Without a platform fee value, invoice amounts and creator earnings figures cannot be computed accurately | OD-27 is resolved; billing config confirms the fee percentage; a test invoice shows correct creator and platform splits | OD-27 resolution document; test invoice amount verification | HARD BLOCK |
| BL-22 | Cancellation Disclosure | Cancellation confirmation step shows correct period-end date and explicitly states that access continues to that date | A fan who does not understand when their access ends will raise unnecessary support issues or disputes | Cancellation flow consequence-disclosure step shows `current_period_end` formatted correctly and states access continues until that date | Manual cancellation flow test; inspect disclosure step copy | SOFT BLOCK |

---

## §8 — Fan Access / Library / Notifications Readiness

Maps to: **Milestone 5** (Fan Can Access Entitlements) from `implementation-phasing.md §9`.
Source documents: `page-requirements.md` Families 1, 2, 13, 14, 15; `api-surface.md §5, §6`.

| ID | Area | Requirement | Why It Matters | Pass Condition | Evidence Expected | Severity |
|---|---|---|---|---|---|---|
| FA-01 | Home Page | Home page renders live approved creator and published content data; no static placeholder content | If the home page shows no creators or content, the platform appears empty at launch | Home page returns real creators with published content; featured and category sections populated | Load home page in production; confirm live creator and content data | HARD BLOCK |
| FA-02 | Discovery | Discovery page renders with category filter and pagination working | Discovery is the primary browsing path for fans; broken filters mean fans cannot find relevant creators | Category filter correctly narrows creator results; pagination loads next page without error | Discovery page interaction test with filter and pagination | HARD BLOCK |
| FA-03 | Library — Entitlement | Fan library shows exactly and only the content the fan is entitled to | Over-serving grants free access to paid content; under-serving blocks fans who have paid | Fan with free account sees only free posts; fan with active subscription sees tier-appropriate content; expired fan sees only free content | Library access test across three entitlement states | HARD BLOCK |
| FA-04 | Product Download | Fan with valid product purchase can download the product via a signed URL after entitlement check | Signed URL generation after entitlement check is the core product-purchase delivery mechanism | Entitled fan receives a signed download URL; URL is time-limited; non-entitled fan receives 403 | Product download test for entitled and non-entitled fan; verify URL expiry | HARD BLOCK |
| FA-05 | Moderation in Library | Content removed by admin is absent from fan library even if the fan holds a valid purchase or subscription | Removed content must not be served regardless of entitlement | Fan with active subscription or purchase cannot access an item with `moderation_status = removed` from their library | Set purchased/subscribed content to removed; access library; confirm content absent | HARD BLOCK |
| FA-06 | Billing View | Memberships & Billing page shows active subscriptions with status and renewal date, billing history with Invoice records, and `PaymentMethodSummary` | Fans must be able to see the status of their financial relationships with the platform | All three data areas render correctly with real data for a fan with an active subscription | Load billing page with an active subscription account; verify all three areas | HARD BLOCK |
| FA-07 | Cancellation Link | Cancellation flow link on the billing page routes correctly to the cancellation flow for the correct membership | A broken cancellation link traps fans in a subscription they cannot exit | Clicking the cancel link on a specific membership routes to the correct cancellation flow URL with the correct `membership-id` | Click-through test from billing page to cancellation flow | HARD BLOCK |
| FA-08 | Notifications | In-app notification center renders billing and moderation event notifications; mark-as-read functions | Notifications are a primary communication channel for billing and moderation events | Notification center shows billing events (payment success, failure) and moderation events; mark-as-read removes notification from unread count | Trigger billing and moderation events; check notification center | SOFT BLOCK |
| FA-09 | Report Submission | Fan can submit a report from a content surface; 24-hour duplicate guard prevents repeat reports on the same target | Report submission is the fan-side input to the moderation system; without it, the moderation queue is empty | `POST /reports` succeeds for an eligible fan; second report on the same target within 24 hours returns `DUPLICATE_REPORT` error | Report submission test; duplicate report test within 24-hour window | HARD BLOCK |
| FA-10 | Unauthenticated Browsing | Unauthenticated fan can browse Home and Discovery but cannot access gated content, account pages, or checkout | Allowing unauthenticated browsing is a conversion pathway; blocking gated content is a business requirement | Unauthenticated GET on Home and Discovery returns 200; unauthenticated GET on library, account, checkout returns 401 or redirect | Unauthenticated access test across public and protected routes | HARD BLOCK |
| FA-11 | Billing Emails | Transactional billing notification emails delivered for payment events (payment success, failure, cancellation) | Billing emails are the primary fan communication channel for payment events | Billing event triggers transactional email delivered to fan's verified address | Trigger each billing event type in staging; verify email delivery | SOFT BLOCK |
| FA-12 | Account Route Auth | Fan account pages (`/account/*`) inaccessible to unauthenticated users | Account pages contain personal and billing data; unauthenticated access is a data exposure risk | Unauthenticated GET on `/account/*` routes returns 401 or redirect to login | Test all `/account/*` routes without auth; confirm no 200 response | HARD BLOCK |

---

## §9 — Moderation / Trust / Admin Readiness

Maps to: **Milestone 6** (Admin Can Moderate Safely) from `implementation-phasing.md §9`.
Source documents: `moderation-trust-rules.md` (full); `api-surface.md §8`;
`page-requirements.md` Families 20–21; `open-decisions-register.md` OD-02–OD-05, OD-08, OD-12, OD-13, OD-24.

| ID | Area | Requirement | Why It Matters | Pass Condition | Evidence Expected | Severity |
|---|---|---|---|---|---|---|
| MT-01 | Admin Dashboard | Admin overview dashboard `/admin` loads with operational counters (pending applications, open reports, flagged content counts) | Without the dashboard, the admin has no visibility into platform operational state at launch | `/admin` returns 200 for admin user; counter values reflect real DB state | Admin login; dashboard load; verify counters are not zero/null if data exists | HARD BLOCK |
| MT-02 | Report Queue | All fan-submitted reports visible in `/admin/moderasyon/raporlar` with correct status | If the report queue is empty or filtered incorrectly, admin cannot action fan reports | Report queue shows all reports with `status = open` and `status = under_review`; report count matches DB | DB count of open reports versus queue display count | HARD BLOCK |
| MT-03 | Report Actions | Admin can dismiss, mark under review, and resolve reports; each action creates a `ModerationAction` record | Without functional report actions, the admin cannot close the moderation loop | Each report action transitions `Report.status` correctly; `ModerationAction` row created for each | Test each report action type; DB inspection of Report.status and ModerationAction | HARD BLOCK |
| MT-04 | Flag Content | Admin can flag content; flagged content behavior is consistent with OD-02 resolution | Flagging is the intermediate moderation state before removal; its behavior must be consistent with the resolved policy | Flagging sets `moderation_status = flagged`; visibility of flagged content (auto-hidden or visible) matches OD-02 resolution | Flag content; verify moderation_status; verify visibility behavior matches documented resolution | HARD BLOCK |
| MT-05 | Remove Content | Admin can remove content; removed content returns 404/403 immediately to all non-admin callers | Content removal is the primary safety response; a delay between admin removal and access block is unacceptable | Admin remove action sets `moderation_status = removed`; within the same request-response cycle, non-admin content request returns 404/403 | Remove content; immediately test public content URL; 404/403 confirmed | HARD BLOCK |
| MT-06 | Warn Creator | Admin can warn a creator; `ModerationAction` created with warn action type | Creator warnings are part of the progressive action catalog; missing warn means the admin cannot take the lightest action | Warn action creates `ModerationAction` row with `action_type = warn`; creator is not suspended or restricted | Warn action test; DB ModerationAction inspection | HARD BLOCK |
| MT-07 | Restrict Creator | Admin can restrict a creator; restriction behavior consistent with OD-03 and OD-24 resolutions; `ModerationAction` created | Creator restriction is an intermediate action between warn and suspend; its data model (OD-24) and content behavior (OD-03) must be consistent with resolved decisions | Restrict action reflects OD-24 schema choice; content de-listing behavior reflects OD-03 resolution; `ModerationAction` created | Restrict creator; verify schema reflects OD-24 choice; verify content behavior reflects OD-03 choice | HARD BLOCK |
| MT-08 | Suspend Creator | Admin can suspend a creator; all creator content returns 404 immediately; `ModerationAction` created | Creator suspension is the strongest content-safety action; any delay or gap in propagation is a safety risk | After suspend action: `CreatorProfile.status = suspended`; `GET /@[username]` returns 404; all content endpoints for creator return 404; `ModerationAction` row exists | Suspend test; immediate public page and content URL test; DB inspection | HARD BLOCK |
| MT-09 | admin_note Security | `admin_note` field absent from all non-admin API responses across all endpoint types | Admin notes may contain sensitive operational intelligence that must not reach content creators or fans | Systematic inspection of non-admin responses for all content, creator, and moderation-related endpoint families confirms no `admin_note` field | Automated or manual response body inspection; no `admin_note` key in non-admin responses | HARD BLOCK |
| MT-10 | Flagged Post Edit | Creator can or cannot edit a flagged post, consistent with OD-04 resolution | The creator's ability to self-remediate flagged content must be explicitly defined before the moderation queue ships | WS4 post-edit endpoint behavior for `moderation_status = flagged` content matches OD-04 documented resolution | Test post-edit on flagged content; behavior matches OD-04 resolution | HARD BLOCK |
| MT-11 | Moderation Emails | Moderation notification emails delivered to creators for removal, restriction, and suspension actions | Creators must be notified when admin actions affect their content or account | Triggering each moderation action sends the correct notification email to the creator's verified address | Test each moderation action type in staging; verify email delivery and content | SOFT BLOCK |
| MT-12 | Notification Timing | Creator notification on flagged content fires at the correct point — on flag, on removal, or never — consistent with OD-12 resolution | Creator notification timing is a product decision (OD-12); inconsistent behavior creates trust issues | Notification event fires at the point defined in OD-12 resolution; no notification fires at any other point | Test flag and removal actions; confirm notification timing matches OD-12 resolution | SOFT BLOCK |
| MT-13 | Report Taxonomy | Report submission form offers reason codes that match the OD-05 resolved taxonomy | An unreleased or placeholder taxonomy produces reports with invalid reason codes that cannot be analyzed | `reason_code` values available in the report submission UI match the OD-05 resolved enum values | Compare UI report reason options against OD-05 resolved values | HARD BLOCK |
| MT-14 | Restriction Schema | `CreatorProfile` restriction state matches the OD-24 resolved data model (status enum or boolean flag) | An unresolved schema choice means the restriction feature is built on an undefined foundation | DB schema for `CreatorProfile` reflects the OD-24 chosen implementation | DB schema inspection; compare against OD-24 resolution | HARD BLOCK |
| MT-15 | Billing on Suspension | Billing behavior on creator suspension matches OD-08 resolution | A suspended creator with active fan subscriptions creates a billing-and-trust problem; the resolved policy must be implemented | Creator suspension triggers the billing action defined in OD-08 resolution (renewals paused, cancelled, or unchanged per resolution) | Suspend creator with active fan subscriptions; verify billing behavior matches OD-08 documented choice | HARD BLOCK |
| MT-16 | Flagged Content Queue | Admin flagged content queue `/admin/moderasyon/icerik` loads and displays content with `moderation_status = flagged` | Without the flagged content queue, admin has no organized view of content requiring review | Queue loads; shows all content with `moderation_status = flagged`; count matches DB | DB flagged content count versus queue display count | HARD BLOCK |

---

## §10 — Legal / Policy Readiness

Source documents: `page-requirements.md` Families 22–24; `permission-matrix.md`;
`open-decisions-register.md` OD-16, OD-17, OD-18; `data-model.md` (ConsentRecord entity).

| ID | Area | Requirement | Why It Matters | Pass Condition | Evidence Expected | Severity |
|---|---|---|---|---|---|---|
| LP-01 | Terms of Service | Terms of Service page (`/legal/kullanim-kosullari`) renders publicly; linked from fan signup and login | Fans must be able to read ToS before accepting it; broken link makes consent flow non-functional | Page returns 200 without auth; link from fan signup and login resolves correctly | GET without auth; click-through from signup; confirm page loads | HARD BLOCK |
| LP-02 | Privacy Policy | Privacy Policy page (`/legal/gizlilik-politikasi`) renders publicly; linked from fan signup and login | KVKK requires privacy policy to be accessible before data is collected | Page returns 200 without auth; link from fan signup resolves correctly | GET without auth; click-through from signup | HARD BLOCK |
| LP-03 | Creator Agreement | Creator Agreement page (`/legal/yaratici-sozlesmesi`) renders publicly; linked from creator onboarding step 5 | Creators must be able to read the agreement before accepting it at step 5 | Page returns 200 without auth; link from onboarding step 5 resolves correctly | GET without auth; click-through from onboarding step 5 | HARD BLOCK |
| LP-04 | Fan Consent Records | `ConsentRecord` rows exist for `terms_of_service` and `privacy_policy` for every registered fan | Zero gap in consent records means KVKK compliance is maintained from the first user | DB query: count of fan Users with no ConsentRecord for both consent types = 0 | DB query result: 0 violations | HARD BLOCK |
| LP-05 | Creator Consent Records | `ConsentRecord` rows exist for `creator_agreement` for every creator who completed onboarding | Creator agreement without a consent record has no legal enforceability | DB query: count of CreatorApplications with no linked ConsentRecord for `creator_agreement` = 0 | DB query result: 0 violations | HARD BLOCK |
| LP-06 | Annual Cancellation Policy | Annual cancellation KVKK compliance confirmed; OD-16 resolved; legal sign-off obtained | Annual plan cancellations may trigger Turkish consumer rights obligations; unresolved policy creates legal exposure on the first annual cancellation | OD-16 has a documented resolution with a stated policy; legal sign-off from counsel is on record; cancellation flow reflects the policy | OD-16 resolution document; legal sign-off record; cancellation flow copy consistent with policy | HARD BLOCK |
| LP-07 | Refund Policy | Minimum refund policy defined; OD-17 resolved; cancellation flow language and any relevant UI copy reflects the policy | An undefined refund policy creates legal ambiguity at the first disputed transaction or content removal | OD-17 has a documented resolution with a stated policy; cancellation flow copy is consistent with the policy; no UI copy contradicts the policy | OD-17 resolution document; cancellation flow copy review | HARD BLOCK |
| LP-08 | Re-acceptance Behavior | If any legal document was updated between initial implementation and launch, re-acceptance behavior (OD-18) is defined and implemented | A user who accepted an earlier version of a policy may have different consent than the current version requires | If no legal document was updated: OD-18 can be conditionally deferred (MONITOR). If any document was updated: OD-18 must be resolved and implemented before launch | Check whether any legal document was updated post-initial publication; if yes, verify OD-18 resolution and implementation | SOFT BLOCK |

---

## §11 — Operational Readiness

Source documents: `implementation-phasing.md §9` Milestone 7; `workstream-breakdown.md WS9`;
`open-decisions-register.md` OD-19, OD-26, OD-27, OD-28.

| ID | Area | Requirement | Why It Matters | Pass Condition | Evidence Expected | Severity |
|---|---|---|---|---|---|---|
| OR-01 | Gateway Webhook | Payment gateway production webhook endpoint registered and receiving events; signature validation active | Without a registered production webhook, no payment event produces a subscription or purchase; the platform has no revenue mechanism | Production webhook endpoint registered with the payment gateway; a test event (or real transaction) is received and processed; signature validation logs confirm a valid signature was checked | Gateway dashboard showing registered production webhook URL; webhook processing log entry | HARD BLOCK |
| OR-02 | Real TRY Transaction | At least one real-money TRY transaction completed end-to-end in production using a real payment instrument | Staging gateway configuration may differ from production in subtle ways (merchant account approval, acquiring bank routing); only a real transaction confirms production readiness | A `MembershipSubscription (active)` or `ProductPurchase` exists in the production DB with a real `Order.gateway_transaction_id`; corresponding webhook log entry present | Production DB: Order record with gateway_transaction_id; subscription or purchase record active | HARD BLOCK |
| OR-03 | Email Delivery | Transactional email delivery verified in production for all email types: fan registration verification, password reset, creator approval, creator rejection, billing events, moderation events | Email is a primary user communication channel; production email service may have different deliverability from staging | One real email of each type delivered successfully in production environment | Production email service delivery log showing successful delivery for each email type | HARD BLOCK |
| OR-04 | File Storage | File upload and signed URL download verified in production; object storage bucket accessible from production environment | If file storage is misconfigured in production, product uploads fail and product downloads return errors | Upload a test file in production; retrieve it via signed URL; file content is correct | Upload log; signed URL request returns correct file content in production | HARD BLOCK |
| OR-05 | Scheduled Jobs | Both scheduled jobs verified as running in production: (1) `cancelled → expired` after `current_period_end`; (2) `grace_period → expired` after `grace_period_ends_at` | Without running jobs, cancelled subscriptions retain access indefinitely and grace-period subscriptions never expire | Production scheduler log confirms both jobs have completed at least one successful run; DB state shows at least one successful state transition per job type | Production scheduler run log with timestamps; DB transition evidence | HARD BLOCK |
| OR-06 | Order Cleanup Job | Stale pending Order cleanup job configured with the resolved OD-28 timeout value; job runs in production | Stale `Order (pending)` records accumulate if no cleanup job runs, creating noise in billing operations | OD-28 is resolved; job is configured with the resolved timeout; production scheduler log confirms job has run | OD-28 resolution document; scheduler log; billing ops DB showing no stale Orders older than timeout | HARD BLOCK |
| OR-07 | Error Monitoring | Error monitoring active in production; critical error alerting configured for the on-call recipient | Without error monitoring, production failures are discovered by users before operations knows about them | Error monitoring service shows production errors; a test alert fires correctly to the configured recipient | Error monitoring dashboard active; test alert received | SOFT BLOCK |
| OR-08 | Admin Operational Readiness | Admin can receive and action reports, review creator applications, and take moderation actions immediately after launch with no additional setup | If admin tooling requires post-launch setup before it is functional, the platform launches with no moderation capability | Admin account exists; admin login works; all admin surfaces are functional; at least one test moderation action performed | Admin end-to-end test covering review queue, moderation queue, and one action of each type | HARD BLOCK |
| OR-09 | Storage CORS | Object storage CORS policy configured for production domain; direct file requests from production frontend are permitted | A CORS misconfiguration blocks file uploads from the browser and breaks the file upload flow for creators | File upload from production frontend domain succeeds; CORS headers present in upload response | Browser-based file upload test in production; inspect CORS headers | HARD BLOCK |
| OR-10 | Platform Fee Config | Platform fee percentage configured in production billing config; OD-27 resolved | Without the fee configured, invoice amounts and creator earnings figures are wrong from the first transaction | OD-27 is resolved; billing config in production contains the fee percentage; test invoice computation is correct | OD-27 resolution; billing config confirmation; test invoice amount check | HARD BLOCK |
| OR-11 | Grace Period Config | Grace period duration configured in production billing config; OD-26 resolved | Without the grace period duration, `grace_period_ends_at` computation is undefined | OD-26 is resolved; billing config in production contains the duration; test renewal failure produces correct `grace_period_ends_at` | OD-26 resolution; billing config confirmation; test webhook result | HARD BLOCK |
| OR-12 | All Launch-Blocker ODs | All 8 launch-blocker open decisions resolved and documented in `open-decisions-register.md` | Unresolved decisions mean the platform may be operating on undefined or incorrect behavior in safety, billing, or legal areas | OD-01, OD-02, OD-05, OD-08, OD-16, OD-17, OD-19, OD-24 each show resolved status in `open-decisions-register.md` with chosen option and rationale | `open-decisions-register.md` review: 8 decisions, all showing resolved; implementation spot-checked against documented choices | HARD BLOCK |

---

## §12 — Deferred Items Confirmed Out of Launch Scope

This section confirms that the following items — all explicitly deferred per
`workstream-breakdown.md §11` — are absent from the production environment.
Each item should be verified as non-functional or non-existent in production.
None of these items being absent constitutes a launch blocker; their presence
would be a scope violation.

| # | Deferred Area | Authority | Verify Absent By |
|---|---|---|---|
| D-01 | Chat systems (1:1 and group) | CLAUDE.md; workstream-breakdown.md §11 | No chat routes or UI components accessible in production |
| D-02 | Livestream features | CLAUDE.md; workstream-breakdown.md §11 | No livestream routes or infrastructure in production |
| D-03 | Advanced analytics dashboard (`/dashboard/analitik/*`) | workstream-breakdown.md §11 | Analytics routes return 404 or are not linked from dashboard navigation |
| D-04 | Creator audience management (`/dashboard/kitle/*`) | workstream-breakdown.md §11 | Audience management routes return 404 or not linked |
| D-05 | Payout operations UI | workstream-breakdown.md §11 | No payout UI routes accessible; IBAN captured but payout mechanism not exposed |
| D-06 | Admin billing operations UI | workstream-breakdown.md §11 | No admin billing route beyond what is scoped in Family 20–21 |
| D-07 | Audit log viewer UI | workstream-breakdown.md §11 | No audit log viewer route; ModerationAction data captured; UI not exposed |
| D-08 | DMCA / copyright claim UI | workstream-breakdown.md §11 | No DMCA claim route or form accessible |
| D-09 | Appeals portal | workstream-breakdown.md §11 | No appeals route accessible |
| D-10 | Creator reinstatement tooling | workstream-breakdown.md §11 | No reinstatement UI; DB intervention is the MVP mechanism |
| D-11 | Tier upgrade / downgrade flows | workstream-breakdown.md §11 | No upgrade/downgrade UI; cancellation and re-subscribe is the MVP mechanism |
| D-12 | Automated content scoring / AI moderation | workstream-breakdown.md §11 | No automated scoring pipeline active |
| D-13 | Affiliate / sponsorship / referral systems | CLAUDE.md; workstream-breakdown.md §11 | No referral or affiliate routes or tracking |
| D-14 | Mobile-specific native app patterns | CLAUDE.md; workstream-breakdown.md §11 | Web-only; no native app or app store submissions |
| D-15 | Social auth (OAuth) | open-decisions-register.md | No OAuth login buttons; email/password only |
| D-16 | Refund processing UI | billing-lifecycle.md §11 | No admin refund route; gateway handles at MVP |
| D-17 | Tax / KDV calculation engine | billing-lifecycle.md §11 | No tax computation in invoice amounts at MVP |
| D-18 | Premium post checkout UI | workstream-breakdown.md §11 | `PostPurchase` entity modeled; no checkout UI for premium posts |
| D-19 | Public marketing sub-pages | workstream-breakdown.md §11 | Marketing sub-pages beyond home page not live at Phase 1 launch |

---

## §13 — Go / No-Go Review Format

The Go/No-Go review is the final pre-launch decision gate. It must be conducted as a
synchronous review with all decision-making parties present or represented.

**Required participants:**
- Product owner (or delegate with authority to approve launch)
- Engineering lead (or lead engineer per workstream)
- Legal representative (for §10 sign-off on LP-06 and LP-07)
- Operations lead (for §11 sign-off on OR-01 through OR-12)

**Review process:**

1. Work through the Hard Launch Gates summary (§3) first. All LG-## items must show
   PASS. Any FAIL in §3 is an immediate No-Go. Do not proceed to domain sections if
   §3 contains any FAIL.

2. Work through §4–§11 in order. For each SOFT BLOCK item that is not PASS, the
   relevant owner must provide a written exception stating:
   - What the current state is
   - What the risk is
   - What the post-launch remediation plan and timeline are
   - Who is accountable for remediating it

3. Record every item as: PASS | FAIL | EXCEPTION (with linked exception note)

4. Compile the summary count:
   - Total HARD BLOCK items: must be 100% PASS
   - Total SOFT BLOCK items: 100% PASS or EXCEPTION with written note and owner
   - Total MONITOR items: noted, no action required at gate

**No-Go triggers:**
- Any HARD BLOCK item is FAIL → No-Go. No exceptions.
- Three or more SOFT BLOCK items are FAIL without accepted exceptions → No-Go.
- Any of the 8 launch-blocker open decisions (OD-01, OD-02, OD-05, OD-08, OD-16, OD-17,
  OD-19, OD-24) is unresolved → No-Go. These are HARD BLOCK by definition.
- Legal sign-off for LP-06 and LP-07 not obtained → No-Go.

**Review record format:**

Each review must produce a dated record containing:
```
Launch Readiness Review
Date: YYYY-MM-DD
Reviewers: [names and roles]

Hard Launch Gates (§3): [PASS ALL / FAIL — item IDs]
Product Surface (§4):   [PASS / SOFT BLOCK exceptions noted]
Auth / Consent (§5):    [PASS / SOFT BLOCK exceptions noted]
Creator Readiness (§6): [PASS / SOFT BLOCK exceptions noted]
Billing / Commerce (§7):[PASS / SOFT BLOCK exceptions noted]
Fan Access (§8):        [PASS / SOFT BLOCK exceptions noted]
Moderation (§9):        [PASS / SOFT BLOCK exceptions noted]
Legal / Policy (§10):   [PASS / SOFT BLOCK exceptions noted]
Operational (§11):      [PASS / SOFT BLOCK exceptions noted]
Deferred Items (§12):   [CONFIRMED OUT]

SOFT BLOCK exceptions:
- [ID]: [state] | [risk] | [remediation plan] | [owner] | [target date]

Decision: GO / NO-GO
Approved by: [name, role, date]
```

**Escalation path:**
If the launch decision is disputed between participants, the product owner has final
authority. Any No-Go decision must name the specific failing item(s) and the owner
responsible for remediating them before the next review.

---

## §14 — Validation Checklist

Use this section to verify that the launch readiness checklist itself is complete and
internally consistent.

**Coverage:**
- [ ] All 7 integration milestones from `implementation-phasing.md §9` (M1–M7) are
  represented by checklist items in the appropriate domain section
- [ ] All 12 launch blockers from `workstream-breakdown.md §10` (L1–L12) map to at
  least one checklist item in §3 or the relevant domain section
- [ ] All 8 launch-blocker open decisions from `open-decisions-register.md` (OD-01, OD-02,
  OD-05, OD-08, OD-16, OD-17, OD-19, OD-24) appear in §3 (LG-16) and in their
  respective domain sections
- [ ] All 24 page families are touched by at least one checklist item across §4–§9

**Severity correctness:**
- [ ] All items in §3 are HARD BLOCK
- [ ] Every HARD BLOCK item has a binary pass condition that can be evaluated as PASS or FAIL
- [ ] Every HARD BLOCK item has defined evidence expected — not free-text assertions
- [ ] SOFT BLOCK items are things that are important but do not create legal, safety, or
  billing integrity risk if deferred to a post-launch fix
- [ ] MONITOR items are things where the risk at launch is low and post-launch observation
  is sufficient

**Scope correctness:**
- [ ] No checklist item references a feature, page, or route outside the approved 24 families
- [ ] No checklist item references chat, livestream, payout UI, or any deferred area
- [ ] Deferred items in §12 match `workstream-breakdown.md §11` exactly
- [ ] No code, implementation steps, or QA test cases appear in any checklist item

**Operability:**
- [ ] Every item has an ID that can be referenced in the Go/No-Go review record
- [ ] Every item has a severity that makes the Go/No-Go decision unambiguous
- [ ] §13 Go/No-Go format includes all HARD BLOCK and SOFT BLOCK sections by ID prefix
- [ ] The total HARD BLOCK count is documented so the reviewer knows how many items must pass

**Item count reference:**

| Section | HARD BLOCK | SOFT BLOCK | MONITOR | Total |
|---|---|---|---|---|
| §3 Hard Launch Gates | 18 | 0 | 0 | 18 |
| §4 Product Surface | 9 | 2 | 1 | 12 |
| §5 Auth / Consent | 9 | 1 | 0 | 10 |
| §6 Creator Onboarding | 10 | 2 | 0 | 12 |
| §7 Commerce / Billing | 21 | 1 | 0 | 22 |
| §8 Fan Access | 9 | 2 | 0 | 11 (FA-07 is HARD; FA-11 SOFT; updated) |
| §9 Moderation / Trust | 14 | 2 | 0 | 16 |
| §10 Legal / Policy | 7 | 1 | 0 | 8 |
| §11 Operational | 11 | 1 | 0 | 12 |
| **Total** | **108** | **12** | **1** | **121** |

Note: §3 Hard Launch Gates are cross-cutting and overlap with domain sections; they are
not additive. The canonical gate check is §3; domain sections provide the detailed
evidence requirements.
