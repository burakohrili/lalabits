# Execution Wave 01 — Foundations & Auth/Identity
## lalabits.art Phase 1

> **Status:** Active — execution in progress
> **Version:** v1.0
> **Scope:** WS1 (Foundations & Platform Core) + WS2 (Auth, Identity & Legal Consent)
> **Authority level:** Canonical
>
> **Derived from:** implementation-phasing.md · workstream-breakdown.md ·
> data-model.md · api-surface.md · permission-matrix.md · decision-closeout-session-01.md

---

## §1 — Wave Objective

Establish the technical chassis and deliver a working identity layer. At the end of
Wave 01, authenticated users can register, verify email, log in, reset passwords, and
view legal pages. Legal consent is captured for every registration. The admin auth gate
is active and enforced. No business logic, content, billing, or creator-specific flows
are included.

**Wave 01 completes when Milestone 1 passes:**
> Fan can register → verify email → log in → reset password.
> `ConsentRecord` rows present in DB after each registration.
> Legal pages 22, 23, 24 accessible and linked from auth flows.

**What WS3 is waiting for from this wave:** an authenticated, email-verified user
account and a working admin auth gate. WS3 cannot begin until both are confirmed.

---

## §2 — Included Systems

**WS1 — Foundations & Platform Core (Phase 0)**

| System | Scope |
|---|---|
| NestJS backend scaffold | Module structure, middleware, exception filters, global validation pipeline, CORS |
| Next.js frontend scaffold | App Router, layout system, TypeScript config, environment config |
| PostgreSQL | Database module, connection pool, all 25 entities migrated, seed data |
| Redis | Connection, cache module — for refresh token storage and later job queues |
| Object storage | Service layer: presigned PUT URL generation, signed GET URL generation, test upload/download verified |
| Email delivery | Transactional email provider integration; test sends verified; template infrastructure |
| JWT auth infrastructure | JWT strategy, JWT guard, optional-auth decorator, refresh token storage mechanism |
| Admin auth gate | `is_admin = true` + `scope: admin` claim guard — enforced from this phase onward |
| CI/CD pipeline | Build, test, lint, deploy stages; secrets management established |

**WS2 — Auth, Identity & Legal Consent (Phase 1)**

| System | Scope | Page families |
|---|---|---|
| Legal pages | Families 22, 23, 24 rendered and publicly accessible | 22, 23, 24 |
| Fan registration | `POST /auth/register/fan`; User + ConsentRecords + EmailVerificationToken; verification email sent | 4 |
| Creator signup entry | `POST /auth/register/creator`; User + CreatorProfile (status=onboarding) + ConsentRecords; entry point to WS3 | 5 (entry only) |
| Email verification | `GET /auth/email-verify/:token`; sets `User.email_verified_at`; resend endpoint (rate-limited) | 4 post-signup |
| Login and session | `POST /auth/login`; `POST /auth/refresh`; `DELETE /auth/logout`; `GET /auth/me` | 3 |
| Password reset | `POST /auth/password-reset/request` and `/confirm`; token expiry; all refresh tokens invalidated on reset | 6 |
| Admin login | `POST /admin/auth/login`; issues token with `scope: admin` claim | (admin, no family) |
| Consent capture | `ConsentRecord` created for `terms_of_service` + `privacy_policy` at every registration | — |
| Transactional emails | Verification email, password reset email operational in production-equivalent environment | — |

**Confirmed decisions already applied to this wave:**
- OD-20: JWT bearer + refresh token (`POST /auth/refresh` included)
- OD-22: `User.is_admin = true` + `POST /admin/auth/login` with `scope: admin` claim

---

## §3 — Excluded Systems

The following are explicitly outside Wave 01. Do not pull any of these forward.

| System | Reason excluded |
|---|---|
| Creator onboarding wizard (Family 7) | WS3 — requires Wave 01 complete |
| Creator dashboard (Family 9) | WS3 + WS4 |
| Admin creator review queue (Family 20) | WS7 Phase 2 — requires WS3 output |
| Any content management (Posts, Products, Collections) | WS4 Phase 3 |
| Checkout and billing | WS6 Phase 4 |
| Fan library, memberships, notifications | WS5 Phase 4–5 |
| Admin moderation queue (Family 21) | WS7 Phase 6 |
| Home page live wiring (Family 1) | Phase 4 — scaffold only acceptable |
| Discovery page (Family 2) | Phase 4 — scaffold only acceptable |
| Google OAuth (`POST /auth/google`) | In API surface but dependent on OAuth client provisioning lead time — treat as Phase 1 stretch; password auth must be complete and solid without it |
| Notification infrastructure | WS5 — notification events are Phase 4+ |
| Report submission | Phase 5 |

---

## §4 — Prerequisites Already Satisfied

The following decisions and constraints are resolved before Wave 01 begins and require
no further confirmation:

| Prerequisite | Source |
|---|---|
| Session mechanism: JWT bearer + refresh token | OD-20 confirmed 2026-03-27 |
| Admin identity: `User.is_admin = true` + `/admin/auth/login` | OD-22 confirmed 2026-03-27 |
| All 25 data model entities approved | data-model.md v1.0 |
| Auth API surface defined (all endpoints in this wave) | api-surface.md v1.0 |
| Legal page families (22, 23, 24) approved | page-requirements.md v1.0 |
| Consent capture model (`ConsentRecord`, `LegalDocumentVersion`) defined | data-model.md Entities 20, 21 |
| `email_verified_at` gate on checkout and sensitive endpoints confirmed | implementation-phasing.md §10 |
| Role model: `has_fan_role`, `is_admin` on `User`; `CreatorProfile` separate | data-model.md Entity 1 |

---

## §5 — Remaining Risks

| Risk | Severity | Mitigation |
|---|---|---|
| No `RefreshToken` entity in the 25 approved data model entities | Medium | Refresh token storage is an infrastructure decision. Use Redis keys keyed by `user_id` (or a token hash) — this is consistent with the approved Redis setup in WS1 and requires no new DB entity. Confirm this storage approach before Batch 1.4. |
| Legal document text not yet written | Medium | `LegalDocumentVersion` seed records require actual ToS, Privacy Policy, and Creator Agreement content to seed. Engineering can seed placeholder text and migrate to final text; but final legal text must be available before any real user registration occurs. Track as a non-engineering dependency. |
| Email delivery domain verification lead time | Medium | SPF, DKIM, and DMARC verification for the production sending domain can take 24–72 hours. Start the email provider setup and domain verification in Batch 1.2, not at the end of the wave. |
| Google OAuth client provisioning | Low | `OAuthAccount` entity and `POST /auth/google` endpoint are in scope, but Google OAuth requires an OAuth 2.0 client to be created in Google Cloud Console and redirect URIs to be configured. This has no implementation blocker but has a setup dependency. Do not let it block password auth completion. |
| Object storage CORS for presigned PUT (needed in WS3) | Low | CORS must be configured on the object storage bucket to allow `PUT` from the Next.js frontend origin. Not needed for Wave 01 download testing, but must be in place before WS3 (file upload in onboarding step 1). Set up in Batch 1.2 alongside the object storage integration. |
| OD-29 (dashboard revenue display: pre-fee vs. post-fee) unresolved | Low | Not a Wave 01 concern. Phase 3 gate. Note: recommended default is post-fee (net to creator). Confirm before WS4 dashboard overview API is built. |

---

## §6 — Implementation Batches

Batches are ordered by dependency. Within a batch, backend and frontend work can run
in parallel where noted.

---

### Batch 1.1 — Project Scaffold and CI/CD

**Goal:** Two runnable projects and a passing pipeline. No business logic.

**Backend (NestJS):**
- Project init: module structure (`AppModule`, `ConfigModule`, `DatabaseModule`)
- Global exception filter: structured error responses
- Global validation pipe: class-validator DTO validation
- CORS configuration: allow Next.js frontend origin
- Health check endpoint: `GET /health` returns 200

**Frontend (Next.js):**
- Project init: App Router, TypeScript config, base layout
- Environment config: `.env.local` structure; API base URL from env
- Root layout with font and base CSS tokens established

**CI/CD:**
- Build, lint, and test stages passing on main branch
- Environment variables and secrets management pattern established (never committed to repo)
- Staging deployment pipeline passing

**Output gate:** Both projects build and deploy to staging without errors. `GET /health` returns 200.

**Depends on:** Nothing.

---

### Batch 1.2 — Service Integrations

**Goal:** All four infrastructure services connected and verified with test operations.

**PostgreSQL:**
- Database module with connection pool
- TypeORM (or chosen ORM) configured and connected
- Migration tooling set up (migration runner command)

**Redis:**
- Cache module configured and connected
- Verify: set and get a test key successfully

**Object storage:**
- S3-compatible service layer
- Presigned PUT URL generation: generate a URL, upload a test file via PUT, verify the file exists in storage
- Signed GET URL generation: generate a signed URL for the test file, verify download succeeds
- CORS configuration on storage bucket: allow PUT from the frontend origin (needed for WS3)

**Email delivery:**
- Transactional email provider selected and integrated (e.g., Resend, Postmark, AWS SES)
- Sending domain configured; SPF/DKIM/DMARC verification initiated (start this day 1 — it takes time)
- Test email send verified: an email lands in a test inbox
- Template infrastructure: base email template structure (plain text + HTML), Turkish locale

**Output gate:** Each service has a passing test: DB connects; Redis get/set works; file upload → signed URL download round-trip succeeds; test email delivered.

**Depends on:** Batch 1.1.

---

### Batch 1.3 — Database Schema Migration and Seed Data

**Goal:** All 25 approved entities exist in the staging and production-equivalent databases
with correct columns, types, foreign keys, indexes, and enums. Seed data that Wave 01
depends on is present.

**Schema migrations (all 25 entities from data-model.md):**

| Entity group | Entities |
|---|---|
| Auth / Identity | User, OAuthAccount, PasswordResetToken, EmailVerificationToken |
| Creator | CreatorProfile, CreatorApplication, MembershipPlan |
| Content | Post, PostAttachment, Product, Collection, CollectionItem |
| Billing | MembershipSubscription, Order, Invoice, ProductPurchase, CollectionPurchase, PostPurchase, BillingCustomer, PaymentMethodSummary |
| Legal / Consent | LegalDocumentVersion, ConsentRecord |
| Trust / Moderation | Report, ModerationAction, Notification |

**Critical schema constraints to verify:**
- `User.is_admin DEFAULT false` — confirm field present
- `User.email_verified_at` nullable — confirm
- `ConsentRecord` references `LegalDocumentVersion` via FK — confirm
- `CreatorProfile.status` enum includes all 5 states: `onboarding`, `pending_review`, `approved`, `rejected`, `suspended`
- `CreatorApplication.iban_encrypted` — confirm field is not indexed and is never returned in any query result set
- All `storage_key` and `file_storage_key` fields — confirm they are never included in any default SELECT *

**Seed data required before Wave 01 can complete:**
- `LegalDocumentVersion` records for: `terms_of_service`, `privacy_policy`, `creator_agreement` — each with `is_current = true`
- Legal document text can be placeholder at this stage but the records must exist for `ConsentRecord` FK writes to succeed
- Admin user: at least one `User` record with `is_admin = true` provisioned for testing the admin auth gate

**Output gate:** `\dt` (or equivalent) shows all 25 tables; FK constraints verified with a test insert/join; seed records present for all three `LegalDocumentVersion` types; `is_current = true` on each.

**Depends on:** Batch 1.2 (DB connection).

---

### Batch 1.4 — JWT Auth Infrastructure

**Goal:** JWT strategy, guards, and refresh token storage are operational. No user-facing
endpoints yet — only the auth middleware layer.

**JWT strategy (NestJS Passport):**
- `JwtStrategy`: validates `Authorization: Bearer <token>`; attaches decoded payload to `request.user`
- Token payload shape: `{ sub: userId, is_admin: boolean, email_verified_at: timestamp | null, scope?: 'admin' }`
- Access token expiry: configurable via env (recommend 15 minutes)
- Secret: from env; never hardcoded

**Guards:**
- `JwtAuthGuard`: requires valid access token; returns `401` on missing or invalid token
- `OptionalJwtAuthGuard`: attaches user if token present; does not reject unauthenticated requests; used on public endpoints that return richer data when authenticated
- `AdminGuard`: requires valid token AND `is_admin = true` AND `scope = 'admin'` in token payload; returns `403 NOT_ADMIN` otherwise; used on all `/admin/*` routes

**Refresh token storage:**
- Store refresh tokens as Redis keys: key = `refresh:<token_hash>`, value = `user_id`, TTL = refresh token expiry (e.g., 30 days)
- On refresh: validate token hash exists in Redis; rotate (delete old key, issue new access + refresh token pair)
- On logout: delete the Redis key for the requesting refresh token
- On password reset: delete all `refresh:<user_id>:*` keys for the user (revoke all sessions)
- This approach requires no new DB entity — consistent with the approved data model

**Admin token issuance:**
- `POST /admin/auth/login` will issue a token where `scope = 'admin'`
- `POST /auth/login` (fan/creator) issues tokens where `scope` is absent or `= 'user'`
- `AdminGuard` rejects any token that does not have `scope = 'admin'` even if `is_admin = true` in payload

**Output gate:** Unit test confirms: valid JWT passes `JwtAuthGuard`; missing token returns 401; non-admin token fails `AdminGuard` with 403; admin token (is_admin + scope:admin) passes `AdminGuard`; refresh token lookup in Redis works; refresh token rotation deletes old key and issues new one.

**Depends on:** Batch 1.3 (User entity must exist for JWT payload to reference).

---

### Batch 2.1 — Legal Pages (Frontend)

**Goal:** Families 22, 23, 24 render and are publicly accessible. Can run in parallel
with Batches 2.2–2.7.

**Frontend:**
- `/legal/kullanim-kosullari` — Terms of Service (Family 22)
- `/legal/gizlilik-politikasi` — Privacy Policy (Family 23)
- `/legal/yaratici-sozlesmesi` — Creator Agreement (Family 24)
- All three: publicly accessible without auth; no redirect on unauthenticated access
- Rendered from `LegalDocumentVersion` content (or static for now; must be wired to real content before production)
- Mobile-responsive layout; readable typography

**Backend (minimal):**
- `GET /legal/terms-of-service` — returns current `LegalDocumentVersion` content for ToS
- `GET /legal/privacy-policy` — returns current `LegalDocumentVersion` content for Privacy Policy
- `GET /legal/creator-agreement` — returns current `LegalDocumentVersion` content for Creator Agreement
- Returns `{ document_type, version, content, updated_at }` — no auth required

**Output gate:** All three pages return 200 without auth; content renders; pages are reachable from direct URL.

**Depends on:** Batch 1.3 (LegalDocumentVersion seed data).
**Can run in parallel with:** Batches 2.2–2.7.

---

### Batch 2.2 — User Registration (Fan and Creator Entry)

**Goal:** `POST /auth/register/fan` and `POST /auth/register/creator` operational.
`ConsentRecord` written at both. Email verification triggered.

**Backend:**
- `POST /auth/register/fan`:
  - Creates `User` (email, password_hash, display_name, `has_fan_role = true`)
  - Creates two `ConsentRecord` records: `terms_of_service` + `privacy_policy`, both referencing the current `LegalDocumentVersion`
  - Creates `EmailVerificationToken` (token_hash, expires_at = now + 24h)
  - Sends verification email with token link
  - Returns `201`; does not return password_hash; does not log in the user (login is a separate step)
  - Errors: `409 EMAIL_EXISTS`; `422 VALIDATION_ERROR`

- `POST /auth/register/creator`:
  - Same as fan registration plus:
  - Creates `CreatorProfile` (status = `onboarding`, onboarding_last_step = 0)
  - Username not set at registration; set in onboarding step 1
  - Same ConsentRecords and email verification as fan path
  - Returns `201`

- Both endpoints: `account_status = active` on creation; email is not yet verified
- Both endpoints: rate-limited; no captcha at MVP

**Frontend:**
- Fan signup form (Family 4): email, display name, password, ToS acceptance checkbox with link to Family 22 + 23
- Creator signup entry (Family 5): email, display name, password, ToS acceptance checkbox — then routes to onboarding wizard (WS3)
- Both: post-registration state shows "check your email" prompt
- Both: link to login page for existing users

**Output gate:**
- `POST /auth/register/fan` returns 201; `User` row in DB; two `ConsentRecord` rows in DB; `EmailVerificationToken` row in DB; verification email delivered to test inbox
- `POST /auth/register/creator` returns 201; `User` + `CreatorProfile (status=onboarding)` + `ConsentRecord` rows in DB; verification email delivered
- Duplicate email returns 409

**Depends on:** Batches 1.4 (auth guard available), 1.3 (User + ConsentRecord + LegalDocumentVersion entities), 1.2 (email delivery), 2.1 (legal pages must render before registration form links to them).

---

### Batch 2.3 — Email Verification

**Goal:** `User.email_verified_at` can be set. Verification link works. Resend works.

**Backend:**
- `GET /auth/email-verify/:token`:
  - Looks up `EmailVerificationToken` by token_hash; checks `expires_at` and `used_at IS NULL`
  - Sets `User.email_verified_at = now()`; sets `used_at = now()` on token
  - Returns `200`
  - Errors: `400 INVALID_OR_EXPIRED_TOKEN`; `409 ALREADY_VERIFIED`
- `POST /auth/email-verify/resend`:
  - Requires valid JWT session (user must be logged in or use a pre-auth token)
  - Creates a new `EmailVerificationToken`; sends new verification email
  - Rate-limited: max 3 resend attempts per hour
  - Returns `204`
  - Errors: `409 ALREADY_VERIFIED`; `429 RATE_LIMIT`

**Frontend:**
- Post-registration "check your email" page with resend option
- Verification success page: prompt to log in

**Output gate:** Click verification link → `User.email_verified_at` set in DB; expired token rejected with 400; already-verified returns 409; resend delivers a new email.

**Depends on:** Batch 2.2.

---

### Batch 2.4 — Login, Token Refresh, and Logout

**Goal:** Full session lifecycle operational. JWT issued on login; refreshed without re-login;
revoked on logout.

**Backend:**
- `POST /auth/login`:
  - Validates email + password_hash; checks `account_status` (suspended → 403)
  - Returns `{ access_token, refresh_token, expires_in }`
  - Stores refresh token in Redis (key = `refresh:<token_hash>`, value = userId, TTL = 30 days)
  - Returns `401 INVALID_CREDENTIALS`; `403 ACCOUNT_SUSPENDED`
- `POST /auth/refresh`:
  - Accepts refresh token in request body or HttpOnly cookie (implementation choice)
  - Validates token exists in Redis and has not expired
  - Issues new access token; rotates refresh token (delete old Redis key, create new)
  - Returns `{ access_token, refresh_token, expires_in }`
  - Returns `401 INVALID_OR_EXPIRED_REFRESH_TOKEN`
- `DELETE /auth/logout`:
  - Requires valid access token (JwtAuthGuard)
  - Deletes the refresh token Redis key for this session
  - Returns `204`
- `GET /auth/me`:
  - Requires valid access token
  - Returns `User` record + `CreatorProfile` summary (id, status, username) if exists
  - Returns `401`

**Frontend:**
- Login page (Family 3): email + password form; "Forgot password" link; link to signup
- Post-login redirect: fan → home; creator (onboarding) → onboarding wizard (WS3); creator (approved) → dashboard (WS3+)
- Token storage: access token in memory; refresh token in HttpOnly cookie (standard Next.js pattern)
- Silent refresh: Next.js middleware or API route intercepts 401 and attempts refresh before propagating

**Output gate:** Login returns tokens; `GET /auth/me` with access token returns user data; refresh rotates tokens and Redis key; logout deletes Redis key; subsequent refresh with revoked token returns 401.

**Depends on:** Batch 2.2 (users exist), Batch 1.4 (JWT infrastructure).

---

### Batch 2.5 — Password Reset

**Goal:** Full password reset flow operational. All sessions revoked on successful reset.

**Backend:**
- `POST /auth/password-reset/request`:
  - Looks up User by email; creates `PasswordResetToken` (token_hash, expires_at = now + 1h)
  - Sends password reset email with token link
  - Account enumeration protected: always returns `200` regardless of whether email exists
  - Rate-limited: max 3 requests per email per hour
- `POST /auth/password-reset/confirm`:
  - Validates token (hash lookup, `expires_at`, `used_at IS NULL`)
  - Sets new `password_hash`; sets `used_at = now()` on token
  - **Revokes all refresh tokens for the user:** delete all `refresh:*` Redis keys where value = userId
  - Returns `200`
  - Errors: `400 INVALID_OR_EXPIRED_TOKEN`

**Frontend:**
- Password reset request page (Family 6, step A): email input
- "Check your email" confirmation state
- Password reset confirm page (Family 6, step B): new password + confirm; uses token from URL
- Success state: prompt to log in

**Output gate:** Reset email delivered; clicking link sets new password; old refresh tokens in Redis are deleted; login with new password succeeds; login with old password fails.

**Depends on:** Batch 2.4 (refresh token revocation uses the same Redis mechanism).

---

### Batch 2.6 — Admin Login

**Goal:** Admin can log in via a separate endpoint and receive a token scoped to admin
operations. Fan-issued tokens are rejected on admin routes.

**Backend:**
- `POST /admin/auth/login`:
  - Validates email + password_hash against `User` where `is_admin = true`
  - Issues token with `scope: admin` claim in addition to standard claims
  - Stores refresh token in Redis (same mechanism as fan login; admin sessions revocable)
  - Returns `{ access_token, refresh_token, expires_in }`
  - Returns `401 INVALID_CREDENTIALS`; `403 NOT_ADMIN` (user exists but is_admin = false)
- Verification: `POST /auth/login` (fan endpoint) with admin credentials issues a token WITHOUT `scope: admin`; this token is rejected by `AdminGuard` on any `/admin/*` route

**Output gate:** Admin login returns token with `scope: admin` claim; that token passes `AdminGuard`; fan login with the same credentials issues a token that fails `AdminGuard`.

**Depends on:** Batch 1.4 (AdminGuard), Batch 1.3 (admin User seed record).

---

### Batch 2.7 — Frontend Integration and End-to-End Verification

**Goal:** All auth flows wired end-to-end. Legal page links present in auth flows. Milestone 1
conditions verifiable.

**Frontend completion:**
- All auth form error states wired: field validation, API error responses displayed correctly in Turkish
- Legal page links present at correct points:
  - Fan signup (Family 4): links to Family 22 (ToS) and Family 23 (Privacy Policy)
  - Creator signup (Family 5): same links
  - Creator onboarding step 5 will link to Family 24 (WS3 — not this wave)
- Post-login routing correct per user state:
  - Unverified fan → verification prompt
  - Verified fan → Home (Family 1)
  - Creator (onboarding) → onboarding entry (WS3 handoff)
  - Admin → admin overview (WS7 handoff; page may be a stub until WS7 ships)
- `GET /auth/me` wired to populate session context client-side
- Google OAuth entry point stubbed if OAuth client not yet provisioned (does not block password auth)

**Output gate:** Complete Milestone 1 walkthrough: register fan → verify email → log in → reset password → log in again → `ConsentRecord` rows confirmed in DB → legal pages accessible from signup flow.

**Depends on:** All prior batches in Wave 01 complete.

---

## §7 — Dependencies Between Batches

```
1.1 → 1.2 → 1.3 → 1.4
                  ↓
             2.1 (parallel)
             2.2 → 2.3
             2.2 → 2.4 → 2.5
             1.4 → 2.6
             [all 2.x] → 2.7
```

**Notes:**
- Batch 2.1 (legal pages frontend) can run in parallel with all WS2 backend batches after 1.3
- Batches 2.2 and 2.6 share the same Redis + JWT infrastructure from 1.4 and can be built simultaneously by separate engineers
- Batch 2.5 depends on 2.4 only for the Redis refresh token revocation mechanism — the reset flow itself is independent
- No batch in Wave 01 depends on iyzico or platform fee configuration (OD-19, OD-27 are Phase 4 concerns)

---

## §8 — Validation Checkpoints

### Checkpoint A — WS1 Complete (after Batch 1.4)

All infrastructure and schema in place before any user-facing work begins.

- [ ] NestJS and Next.js both build and deploy to staging without errors
- [ ] `GET /health` returns 200 in staging
- [ ] All 25 entities present in staging DB with correct columns, FK constraints, and enums verified
- [ ] `LegalDocumentVersion` seed records present for all three document types; `is_current = true`
- [ ] Admin `User` seed record present with `is_admin = true`
- [ ] Redis: get/set test key succeeds
- [ ] Object storage: test file upload via presigned PUT → signed GET round-trip succeeds
- [ ] Email: test send delivered to inbox
- [ ] JWT guard: request with valid token passes; request without token returns 401
- [ ] Admin guard: admin token (scope:admin + is_admin) passes; fan token fails with 403

### Checkpoint B — Registration and Consent (after Batch 2.2)

The most critical legal invariant in the system: no user exists without consent.

- [ ] `POST /auth/register/fan` creates User + 2 ConsentRecord rows (ToS + Privacy Policy) in single transaction
- [ ] `POST /auth/register/creator` creates User + CreatorProfile (status=onboarding) + 2 ConsentRecord rows
- [ ] Duplicate email registration returns 409; no partial records created
- [ ] Verification email delivered with working token link
- [ ] No `ConsentRecord` row can be created without a valid `LegalDocumentVersion` FK (FK constraint verified)

### Checkpoint C — Milestone 1 (after Batch 2.7)

The formal Phase 1 completion gate from `implementation-phasing.md §9`.

- [ ] Fan registers with email/password → receives verification email → clicks link → `email_verified_at` set in DB
- [ ] Fan logs in → receives JWT access + refresh token pair
- [ ] `POST /auth/refresh` rotates tokens; old refresh token invalidated in Redis
- [ ] Fan requests password reset → receives email → resets password → old sessions invalidated in Redis
- [ ] Fan logs in with new password → succeeds
- [ ] `GET /auth/me` returns correct user data with valid token; returns 401 with invalid token
- [ ] Legal pages `/legal/kullanim-kosullari`, `/legal/gizlilik-politikasi`, `/legal/yaratici-sozlesmesi` return 200 without auth
- [ ] Fan signup form links to correct legal pages
- [ ] Admin login via `POST /admin/auth/login` returns token with `scope: admin`; that token passes `AdminGuard`; fan token rejected by `AdminGuard`
- [ ] DB inspection: every registered user has corresponding `ConsentRecord` rows — zero exceptions

---

## §9 — What Must Be True Before WS3 Can Begin

WS3 (Creator Domain & Onboarding) and WS7 Phase 2 (Creator Review Queue) are co-dependent
and start together. Neither can begin until all of the following are confirmed:

**From Wave 01:**

| Condition | Verified by |
|---|---|
| Fan can register, verify email, and log in | Checkpoint C |
| Creator can register at entry point (Family 5); `CreatorProfile` created with `status = onboarding` | Checkpoint B |
| `ConsentRecord` written for ToS + Privacy Policy at every registration | Checkpoint B |
| Legal pages 22, 23, and 24 render and are publicly accessible | Checkpoint A / C |
| Family 24 (Creator Agreement) specifically renders — WS3 onboarding step 5 links to it | Checkpoint C |
| `email_verified_at` guard operational: routes requiring verified email return 403 for unverified users | Checkpoint C |
| Admin auth gate active: `POST /admin/auth/login` issues admin-scoped token; all `/admin/*` routes return 403 without it | Checkpoint A |
| All 25 entities in DB — WS3 will write to `CreatorProfile`, `CreatorApplication`, `MembershipPlan`, `ModerationAction`, `ConsentRecord` | Checkpoint A |

**Open decisions WS3 depends on (must be resolved before WS3 scope is opened):**

| Decision | Status | Note |
|---|---|---|
| OD-22: Admin identity model | Resolved | Option A confirmed — already applied in Wave 01 |
| OD-20: Session mechanism | Resolved | JWT bearer confirmed — already applied in Wave 01 |
| OD-06: Tier-gated access model | Open | Phase 3 gate; WS3 can start without it; must be resolved before Phase 3 |
| OD-01: Unpublish access policy | Open | Phase 3 gate; not needed for WS3 onboarding work |

No other build-blocker decisions affect WS3 start. WS3 can begin the moment Checkpoint C passes and the WS3/WS7 team structure is confirmed (OD-31).
