# Permission Matrix — lalabits.art

> **Status:** Approved
> **Version:** v1.0
> **Scope:** Phase 1 MVP
> **Authority level:** Supporting
>
> This is the canonical access-control reference for lalabits.art Phase 1 MVP. It normalizes
> all permission, role, entitlement, and billing-access rules from
> [`page-requirements.md`](./page-requirements.md) into one implementation-ready authority. It
> defines who can see, act on, and be redirected from every approved page family. It must be
> consulted alongside `page-requirements.md` — it does not replace it. Backend API guards,
> frontend route guards, and entitlement enforcement logic should derive from this document.
>
> Scope: web-only · 24 launch-critical page families · no chat · no livestream · no mobile-specific screens

---

## 1. Document Purpose

This document is the single source of truth for access control across all 24 Phase 1 page
families. Where `page-requirements.md` defines what each page contains and how it behaves,
this document defines who is allowed in, under what conditions, and what they can do.

Use this document to:
- Implement route guards on both the frontend (Next.js middleware) and backend (NestJS guards)
- Define API authorization rules per endpoint group
- Design the entitlement service that evaluates content-level access
- Verify that moderation and billing states correctly affect access
- Identify open policy decisions that must be resolved before launch

This document does not define data models, API shape, or implementation code.

---

## 2. Role Definitions

### 2.1 User Roles

The minimum set of roles needed for Phase 1. No additional roles are introduced.

| Role Key | Name | Description |
|---|---|---|
| `anonymous` | Anonymous Visitor | No session. No account. |
| `fan` | Authenticated Fan | Logged in with fan role. May be email-unverified. Dual-role with creator is possible (see note below). |
| `creator:onboarding` | Creator Applicant | Creator account created; onboarding wizard not yet completed. |
| `creator:pending` | Creator Pending Review | Onboarding completed and submitted; awaiting admin approval. |
| `creator:approved` | Approved Creator | Admin-approved. Can publish content and receive payments. |
| `creator:rejected` | Creator Rejected | Application rejected. Can view rejection state and resubmit. Has creator role but no publish access. |
| `creator:suspended` | Creator Suspended | Previously approved; now suspended or restricted by admin. No publish access; all content hidden from public. |
| `admin` | Admin | Internal operations and moderation role. Provisioned separately — not created via public signup (see Assumption A3). |

**Dual-role note:** A single account may simultaneously hold a `fan` role and any `creator:*`
role (Assumption A1). Fan capabilities are never revoked by creator status changes. A creator
who is rejected or suspended retains their fan role and can subscribe to other creators.

**Admin separation note (resolved OD-22 — 2026-03-27):** Admin identity uses `User.is_admin = true`
on the shared `users` table. Admin login uses a separate `POST /admin/auth/login` endpoint that
issues a token with a `scope: admin` claim. Fan-issued tokens from `POST /auth/login` cannot
satisfy admin route guards even if the user has `is_admin = true`. No separate `admins` table
and no roles-array model in Phase 1.

### 2.2 Account and Content States

These states modify what a role can access. They are runtime conditions, not roles.

**Account / membership states:**

| State Key | Description | Access Impact |
|---|---|---|
| `email:unverified` | Fan registered; email not yet confirmed | Blocks checkout and gated content download. Public browsing allowed. |
| `email:verified` | Email confirmed | Full fan access enabled. |
| `membership:active` | Recurring subscription current and paid | Full tier-entitled access. |
| `membership:cancelled` | Cancelled by fan; billing period still running | Access continues through billing period end date. |
| `membership:grace` | Renewal payment failed; grace period active | Access continues while grace period runs. "Ödeme Yöntemini Güncelle" CTA shown. |
| `membership:expired` | Grace period ended without payment resolution | Access revoked. Re-subscribe required. |
| `product:purchased` | One-time product purchase completed | Download access granted. |
| `collection:purchased` | Collection purchased | Full collection access. |
| `collection:tier_access` | Collection access granted via qualifying membership tier | Access via active tier; follows tier cancellation/expiry rules. |
| `collection:locked` | No purchase and no qualifying tier | Preview only. |

**Content states:**

| State | Visibility to Roles |
|---|---|
| `draft` | Owning creator only (via dashboard). Not visible to any visitor, fan, or member via `/@[username]`. |
| `published` | Visible per access level rules for the specific post/product/collection type. |
| `scheduled` | Not visible until scheduled publish time. Treated as `draft` until then. |
| `archived` | Not visible publicly. Owning creator may access via dashboard for reference. |
| `flagged` | Visible to owning creator and admin. Admin may optionally hide from public at point of flagging. |
| `removed` | Not visible to anyone. Creator sees a "kaldırıldı" (removed by moderation) placeholder in dashboard. |

**Creator account states:**

| Creator State | Dashboard Access | Content Visible on Public Page |
|---|---|---|
| `onboarding` | `/onboarding/*` only | No — not visible to anyone |
| `pending_review` | `/onboarding/inceleme` only | No — not visible to anyone |
| `approved` | Full `/dashboard/*` access | Yes — published content visible per access rules |
| `rejected` | `/onboarding` resubmit view only | No — not visible to anyone |
| `suspended` | No dashboard access | No — all content hidden from all roles |

---

## 3. Permission Matrix by Page Family

### Quick-Reference Summary Table

| # | Family | Primary Route(s) | Min Role to Access | Email Verified Required | Denied → Redirect |
|---|---|---|---|---|---|
| 1 | Ana Sayfa | `/` | None (public) | No | — |
| 2 | Keşfet | `/kesfet` | None (public) | No | Auth redirect for subscribe/follow action only |
| 3 | Giriş Yap | `/auth/giris` | None (public) | No | Authenticated users → role-home |
| 4 | Fan Kaydı | `/auth/kayit/fan` | None (public) | No | Authenticated users → role-home |
| 5 | Yaratıcı Başvurusu | `/auth/kayit/yaratici` | None (public) | No | `creator:onboarding+` → `/onboarding` |
| 6 | Şifre Sıfırlama | `/auth/sifre-sifirla` · `/auth/sifre-sifirla/[token]` | None (public) | No | Authenticated users → role-home |
| 7 | Creator Onboarding Flow | `/onboarding` → `/onboarding/inceleme` | `creator:onboarding` / `creator:pending` / `creator:rejected` | No | `fan`-only → 403; `creator:approved` → `/dashboard` |
| 8 | Creator Public Page | `/@[username]` + sub-routes | None for public content; `fan` + `email:verified` for checkout | Yes (checkout only) | `anonymous` attempting checkout → `/auth/giris?return=` |
| 9 | Creator Dashboard Overview | `/dashboard` | `creator:approved` | No | Others → `/onboarding` or role-home |
| 10 | Posts Management | `/dashboard/gonderiler` + `/yeni` + `/[id]/duzenle` | `creator:approved` | No | Others → role-home |
| 11 | Membership Plans | `/dashboard/uyelik-planlari` + `/yeni` + `/[id]/duzenle` | `creator:approved` | No | Others → role-home |
| 12 | Products & Collections Mgmt | `/dashboard/magaza` · `/dashboard/koleksiyonlar` + sub-routes | `creator:approved` | No | Others → role-home |
| 13 | Library | `/account/kutuphane` · `/account/satin-almalar` | `fan` | No | `anonymous` → `/auth/giris?return=` |
| 14 | Memberships & Billing | `/account/uyeliklerim` + `/[membership-id]` + `/account/fatura` | `fan` (owns resource) | No | Wrong owner → 404; `anonymous` → `/auth/giris` |
| 15 | Notifications | `/account/bildirimler` | `fan` or `creator:approved` | No | `anonymous` → `/auth/giris` |
| 16 | Membership Checkout | `/checkout/uyelik/[creator-username]/[tier-id]` | `fan` + `email:verified` | Yes | `anonymous` → `/auth/giris?return=`; unverified → banner |
| 17 | Product Checkout | `/checkout/urun/[product-id]` | `fan` + `email:verified` | Yes | Same as Family 16 |
| 18 | Collection Checkout | `/checkout/koleksiyon/[collection-id]` | `fan` + `email:verified` | Yes | Same as Family 16 |
| 19 | Cancellation Flow | `/uyelik/[membership-id]/iptal` | `fan` (owns membership) | No | Wrong owner → 404; `anonymous` → `/auth/giris` |
| 20 | Creator Review Queue | `/admin` · `/admin/yaraticilar/inceleme` | `admin` | — | Non-admin → admin login |
| 21 | Moderation & Reports | `/admin/moderasyon/raporlar` + `/[report-id]` + `/admin/moderasyon/icerik` | `admin` | — | Non-admin → admin login |
| 22 | Terms of Service | `/legal/kullanim-kosullari` | None (public) | No | — |
| 23 | Privacy Policy | `/legal/gizlilik-politikasi` | None (public) | No | — |
| 24 | Creator Agreement | `/legal/yaratici-sozlesmesi` | None (public) | No | — |

---

### Per-Family Detail Blocks

Each block uses 11 standard fields: **Allowed Roles** · **Blocked Roles** · **Visibility Rules** · **Primary Actions Allowed** · **Restricted Actions** · **Entitlement Requirements** · **Admin Override Rules** · **Billing-Related Access Rules** · **Denied Access Redirect** · **Audit / Logging** · **Notes**

---

### Family 1 — Ana Sayfa

**Route:** `/`

**Allowed Roles:** All roles — no restriction.

**Blocked Roles:** None. Page is always accessible regardless of session state.

**Visibility Rules:** CTA labels and destinations adapt by role:
- `anonymous` / unauthenticated: "Başla" → `/auth/kayit/fan` and "Yaratıcı Ol" → `/auth/kayit/yaratici`
- `fan`: "Kütüphaneme Git" → `/account/kutuphane`
- `creator:approved`: "Dashboard'a Git" → `/dashboard`
Featured creators strip: only creators with `status = approved` appear.

**Primary Actions Allowed:** All roles: view page, click CTAs (destinations vary by role).

**Restricted Actions:** None.

**Entitlement Requirements:** None. Page is fully static in terms of access.

**Admin Override Rules:** No admin authority applies to this page.

**Billing-Related Access Rules:** None.

**Denied Access Redirect:** N/A — page is always accessible.

**Audit / Logging:** `home_page_viewed` (with `is_authenticated`, `user_role`, `referrer`).

**Notes:** Featured creators query must enforce `status = approved` server-side. Zero approved
creators at launch is a valid early-state; featured strip shows fallback CTA to `/kesfet`.

---

### Family 2 — Keşfet

**Route:** `/kesfet`

**Allowed Roles:** All roles — no restriction to browse.

**Blocked Roles:** `creator:suspended` and `creator:pending/onboarding/rejected` creators are
excluded from search results (server-side query enforcement). They can still visit the page as
browsers/fans.

**Visibility Rules:** All roles see the same discovery page. Subscribe/follow CTAs on creator
cards are visible to all but require auth to complete.

**Primary Actions Allowed:** All roles: browse, search, filter, view creator cards, navigate
to `/@[username]`. Authenticated fans: initiate subscribe/follow from CTA (if surfaced on card).

**Restricted Actions:** Subscribe/follow action for `anonymous` → triggers redirect to
`/auth/giris?return=/@[username]`. No direct blocking — redirect handles it.

**Entitlement Requirements:** None for browsing. Only `approved` creators may appear in results.

**Admin Override Rules:** No admin UI on this page. Admin can browse as a visitor but this is
not an admin tool.

**Billing-Related Access Rules:** None.

**Denied Access Redirect:** `anonymous` clicking subscribe/follow → `/auth/giris?return=/@[username]`.

**Audit / Logging:** `discovery_page_viewed`, `search_performed`, `filter_applied`,
`creator_card_clicked`.

**Notes:** `suspended` and `pending` creator exclusion is a backend enforcement requirement —
the frontend query must not rely on client-side filtering to exclude these creators.

---

### Family 3 — Giriş Yap

**Route:** `/auth/giris`

**Allowed Roles:** `anonymous`. Unverified fans returning after signup email may also reach
this page via redirect.

**Blocked Roles:** Any already-authenticated user → redirect before login form renders.

**Visibility Rules:** All allowed roles see the same login form. Role detection happens
post-login during redirect resolution, not on this page.

**Primary Actions Allowed:** Submit email/password credentials; initiate Google OAuth flow;
navigate to password reset; navigate to fan signup; navigate to creator signup.

**Restricted Actions:** Form submission blocked during in-flight request (UX guard). Admin
login is a separate flow — not documented here (Assumption A3).

**Entitlement Requirements:** None — page is fully public.

**Admin Override Rules:** Admin login uses a separate flow. The admin role is not addressed
by this page.

**Billing-Related Access Rules:** None.

**Denied Access Redirect:**
- Authenticated `fan` → `/account/kutuphane`
- `creator:approved` → `/dashboard`
- `creator:onboarding` / `creator:pending` / `creator:rejected` → `/onboarding` at last completed step
- `?return=` URL applied after successful login (same-origin validation required server-side)

**Audit / Logging:** `login_succeeded` (with `user_role`, `redirect_destination`),
`login_failed` (with `error_type: 'invalid_credentials' | 'unverified' | 'suspended' | 'rate_limited' | 'network'`).

**Notes:** Return URL must be validated server-side as a same-origin relative path before
redirect is performed (Assumption 5 / global assumption 5 from `page-requirements.md`).
All active sessions must be invalidated after a successful password reset (enforced server-side,
not on this page — see Family 6).

---

### Family 4 — Fan Kaydı

**Route:** `/auth/kayit/fan`

**Allowed Roles:** `anonymous`. An already-authenticated `fan` applying to become a creator
(per Assumption A1) may also initiate the creator signup path from this page, but would
typically navigate directly to `/auth/kayit/yaratici`.

**Blocked Roles:**
- `fan` (with no creator role) who is already authenticated → `/account/kutuphane`
- `creator:approved` → `/dashboard`
- Other authenticated creator states → `/onboarding`

**Visibility Rules:** Form always renders for allowed roles. Google OAuth path rendered
conditionally based on launch configuration.

**Primary Actions Allowed:** Submit registration form; accept terms and privacy policy;
initiate Google OAuth.

**Restricted Actions:** Form submission blocked if terms checkbox unchecked. Submission
blocked during in-flight request.

**Entitlement Requirements:** None for page access. Post-registration:
- `email:unverified` state blocks checkout and gated content download but does not block
  browsing public pages or creator profiles.

**Admin Override Rules:** No admin authority applies.

**Billing-Related Access Rules:** Post-registration: `email:unverified` state blocks
checkout (Families 16–18).

**Denied Access Redirect:** Already-authenticated user → role-appropriate home (see above).

**Audit / Logging:** `fan_signup_succeeded` (with `method: 'email' | 'google'`),
`fan_signup_failed` (with `error_type`), `terms_link_clicked`.

**Notes:** Legal consent (terms + privacy) captured at registration. Consent record must
reference the current version of the legal pages at time of acceptance (Assumption A14 /
global assumption 25). Google OAuth accounts are marked as email-verified automatically
(Google has already verified the email) — no verification step needed for OAuth registrations.

---

### Family 5 — Yaratıcı Başvurusu

**Route:** `/auth/kayit/yaratici`

**Allowed Roles:** `anonymous`. An already-authenticated `fan` (without a creator role) may
reach this page to initiate a creator application — their fan role persists (Assumption A1).

**Blocked Roles:**
- `creator:onboarding` / `creator:pending` / `creator:rejected` / `creator:suspended` → `/onboarding`
- `creator:approved` → `/dashboard`

**Visibility Rules:** Form rendered the same for all allowed roles.

**Primary Actions Allowed:** Submit creator registration form with username; accept terms;
initiate Google OAuth.

**Restricted Actions:** Cannot submit without terms acceptance. Username conflict checked
server-side.

**Entitlement Requirements:** Creator accounts require admin approval before the creator
can access `/dashboard`, publish content, or receive payments.

**Admin Override Rules:** No admin authority applies to this page. The submitted application
arrives in the admin review queue (Family 20).

**Billing-Related Access Rules:** None at this step.

**Denied Access Redirect:** Creator states → `/onboarding`; `creator:approved` → `/dashboard`.

**Audit / Logging:** `creator_signup_succeeded`, `creator_signup_failed` (with `error_type`).

**Notes:** Username chosen here is permanent. Reserved username conflicts handled server-side.
The creator role is attached to the existing account if the user is already a `fan` (dual-role
coexistence per Assumption A1).

---

### Family 6 — Şifre Sıfırlama

**Routes:** `/auth/sifre-sifirla` (State A — request) · `/auth/sifre-sifirla/[token]` (State B — set new password)

**Allowed Roles:** `anonymous` only. Both states are accessible without authentication.

**Blocked Roles:** Authenticated users → redirect before form renders (same pattern as
Families 3–5).

**Visibility Rules:** State A: email input field only. State B: new password and confirm
password fields. No user-identifying content is shown on either state.

**Primary Actions Allowed:** State A: submit email to request reset link. State B: submit
new password to complete the reset.

**Restricted Actions:**
- State A must not reveal whether a given email address has a registered account (enumeration
  protection — global assumption 4 in `page-requirements.md`).
- Token in the reset URL is single-use and expires in 1 hour; enforced server-side only.
- After successful password update (State B): all active sessions for the account must be
  invalidated — server-side requirement.

**Entitlement Requirements:** None — both states are fully public.

**Admin Override Rules:** No admin authority applies.

**Billing-Related Access Rules:** None.

**Denied Access Redirect:** Authenticated user → role-appropriate home.

**Audit / Logging:** `password_reset_requested`, `password_reset_completed`.

**Notes:** Google OAuth accounts see a clarifying message ("bu hesap Google ile bağlı") after
State A submission. This is a minor account-existence disclosure — flag for security review
before launch (global assumption 6 in `page-requirements.md`).

---

### Family 7 — Creator Onboarding Flow

**Routes:** `/onboarding` (steps 1–5) → `/onboarding/inceleme` (step 6 — submitted/waiting)

**Allowed Roles:**
- `creator:onboarding` — in-progress wizard
- `creator:pending` — submitted, at waiting screen
- `creator:rejected` — resubmission path

**Blocked Roles:**
- `anonymous` → `/auth/giris`
- `fan` with no creator role → 403 or redirect to `/account/kutuphane`
- `creator:approved` → `/dashboard`
- `creator:suspended` → blocked; no access

**Visibility Rules:** Sequential wizard — each step shows only the current step's form.
Steps are locked; deep-linking to a later step is not permitted. Progress through completed
steps is shown as read-only summary.

**Primary Actions Allowed:**
- `creator:onboarding`: complete each step, upload avatar and cover image, create initial
  membership tiers, enter IBAN, accept Creator Agreement, submit for review
- `creator:pending`: view waiting/confirmation screen only
- `creator:rejected`: view rejection state with reason, edit and resubmit application

**Restricted Actions:**
- `creator:approved` cannot re-enter or re-submit the onboarding flow
- `creator:suspended` has no access to any `/onboarding` route
- Step navigation is sequential — no arbitrary step jumping

**Entitlement Requirements:**
- All `/onboarding/*` routes require an authenticated session with a `creator:*` role.
- IBAN format-validated only at MVP; no bank verification (Assumption A3 / global assumption 7).

**Admin Override Rules:** Admin does not access `/onboarding` routes. The submitted application
appears in the admin review queue (Family 20).

**Billing-Related Access Rules:** Payout IBAN captured at onboarding step 4; not verified
against a bank at MVP. Payout functionality is deferred (see Section 7).

**Denied Access Redirect:** See Blocked Roles above.

**Audit / Logging:** `onboarding_step_completed` (per step, with `step_name`),
`onboarding_submitted`.

**Notes:** Creator Agreement acceptance at step 5 must record the version identifier of
`/legal/yaratici-sozlesmesi` at the time of acceptance (global assumption 25).

---

### Family 8 — Creator Public Page

**Routes:** `/@[username]` · `/@[username]/gonderi/[post-id]` · `/@[username]/uyelik` ·
`/@[username]/magaza` · `/@[username]/magaza/[product-id]` · `/@[username]/koleksiyonlar` ·
`/@[username]/koleksiyonlar/[collection-id]`

**Allowed Roles:** All roles — for public content. Checkout and gated content access require
additional conditions (see Entitlement Requirements).

**Blocked Roles:**
- Content on `creator:suspended` pages → not visible to any role (page shows suspension state)
- Content on `creator:pending/onboarding/rejected` pages → not visible to any visitor, fan,
  or member; visible only to the creator themselves (via their own session)

**Visibility Rules — Content Entitlement Matrix:**

| Content Type | `anonymous` | `fan` (unverified) | `fan` (verified, no membership) | `fan` (active member, matching tier) | `creator:approved` (own page) |
|---|---|---|---|---|---|
| Public post | Full access | Full access | Full access | Full access | Full access |
| Member-only post | Paywall | Paywall | Full access (if free tier exists) | Full access | Full access |
| Tier-gated post | Paywall | Paywall | Paywall | Full access | Full access |
| Premium post | Preview + purchase CTA | Preview + purchase CTA | Preview + purchase CTA | Preview + purchase CTA | Full access |
| Product listing | Visible + "Satın Al" | Visible + "Satın Al" | Visible + "Satın Al" | Visible + "Satın Al" | Full access |
| Purchased product | N/A | N/A | "İndir" (if purchased) | "İndir" (if purchased) | Full access |
| Collection (purchase) | Visible + "Satın Al" | Visible + "Satın Al" | Visible + "Satın Al" | Visible + "Satın Al" | Full access |
| Collection (tier-gated) | Locked preview | Locked preview | Locked preview | Full access (qualifying tier) | Full access |

Member count and tier prices are always publicly visible to all roles.

**Primary Actions Allowed:**
- All roles: view public content, browse tier listings, view product/collection listings
- `fan` (email-verified): subscribe to tier, purchase product, purchase collection
- `creator:approved` on own page: view own published content as a visitor would see it

**Restricted Actions:**
- `anonymous` and `email:unverified` fan cannot initiate checkout — redirect to auth/verification
- Suspended creator content not accessible by any role

**Entitlement Requirements:**
- Gated content: active membership at matching or higher tier
- Premium posts: `product:purchased` record
- Products: `product:purchased` record
- Collections (purchase type): `collection:purchased` record
- Collections (tier-gated): active membership at qualifying tier
- Full entitlement rules in Section 4

**Admin Override Rules:** Admin can view suspended creator pages (not blocked). Admin can
view flagged content regardless of its public-hidden status.

**Billing-Related Access Rules:**
- `membership:cancelled`: access continues through billing period end date
- `membership:grace`: access continues while grace period runs
- `membership:expired`: access revoked; paywall shown with re-subscribe CTA

**Denied Access Redirect:** `anonymous` clicking subscribe/purchase CTA →
`/auth/giris?return=[checkout-or-content-url]`.

**Audit / Logging:** `creator_page_viewed`, `tier_selected`, `subscribe_cta_clicked`,
`post_preview_shown`, `purchase_cta_clicked`.

**Notes:** Creator cannot subscribe to their own tiers (open question A12 — billing module
decision). Draft and scheduled posts are never visible on `/@[username]` — dashboard only.

---

### Family 9 — Creator Dashboard Overview

**Route:** `/dashboard`

**Allowed Roles:** `creator:approved` only, for their own dashboard.

**Blocked Roles:**
- `anonymous` → `/auth/giris`
- `fan` without a creator role → `/account/kutuphane` (or 403)
- `creator:onboarding` / `creator:pending` / `creator:rejected` → `/onboarding` at last step
- `creator:suspended` → blocked (403 or redirect to `/`)

**Visibility Rules:** Revenue, member stats, and payout summaries visible only to the owning
creator. Cross-creator data never returned. No creator can view another creator's dashboard.

**Primary Actions Allowed:** View revenue summary (period-based), view member count and tier
breakdown, view recent activity, navigate via quick-action links to content management sections.

**Restricted Actions:** No fan or other creator can access any `/dashboard/*` route.
`creator:suspended` has no access.

**Entitlement Requirements:** Approved creator status required. Creator may hold a `fan` role
simultaneously but that does not change dashboard access rules.

**Admin Override Rules:** No admin UI on this page. Admin tools are in Families 20 and 21.

**Billing-Related Access Rules:** Revenue data sourced from billing module; period-based
summaries only at MVP (no real-time figures).

**Denied Access Redirect:** See Blocked Roles above.

**Audit / Logging:** `dashboard_overview_viewed`.

**Notes:** Revenue and payout data must be scoped to the authenticated creator's account at
the API level — not just filtered client-side. Never return another creator's financial data.

---

### Family 10 — Posts Management

**Routes:** `/dashboard/gonderiler` · `/dashboard/gonderiler/yeni` · `/dashboard/gonderiler/[post-id]/duzenle`

**Allowed Roles:** `creator:approved` — the post's owning creator only.

**Blocked Roles:** Same as Family 9.

**Visibility Rules:** Only the owning creator's posts are shown. No cross-creator post lists.

**Primary Actions Allowed:** Create, edit, publish, unpublish, schedule, delete own posts;
set access level (public / member-only / tier-gated / premium) per post; attach files.

**Restricted Actions:**
- Posts with `draft` or `scheduled` status are not visible on `/@[username]` to any viewer
- Access level changes on published posts are immediately enforced (Assumption A6 — flag for
  policy review)
- File attachments are served as authenticated signed URLs to entitled users — storage layer
  enforces entitlement; this page manages the metadata only

**Entitlement Requirements:** Approved creator status required.

**Admin Override Rules:** Admin moderation actions (flag, remove) are performed via Family 21,
not via this page.

**Billing-Related Access Rules:** Premium post pricing must be > 0. Platform fee applies to
premium post purchases (billing module concern).

**Denied Access Redirect:** Same as Family 9.

**Audit / Logging:** `post_created`, `post_published`, `post_access_level_changed`,
`post_deleted`.

**Notes:** Changing a published post's access level from free to gated immediately revokes
access for viewers who no longer qualify (Assumption A6). This is a policy decision — flag
for review before launch.

---

### Family 11 — Membership Plans

**Routes:** `/dashboard/uyelik-planlari` · `/dashboard/uyelik-planlari/yeni` · `/dashboard/uyelik-planlari/[tier-id]/duzenle`

**Allowed Roles:** `creator:approved` — the tier's owning creator only.

**Blocked Roles:** Same as Family 9.

**Visibility Rules:** Only the owning creator's tiers are shown. Hidden tiers (`gizli` status)
appear in the dashboard list but not on the creator's public page.

**Primary Actions Allowed:** Create, edit, publish, hide, delete own tiers; set price, name,
perk list, and billing interval.

**Restricted Actions:**
- Deleting a tier requires zero active subscribers — enforced by the membership module
- Price changes take effect at the next billing cycle only; no proration (Assumption A5)
- No hard tier count cap at MVP; UI guidance suggests max ~5 (global assumption 12)
- Hidden tier: existing subscriptions remain active; new subscriptions not possible

**Entitlement Requirements:** Approved creator status required.

**Admin Override Rules:** No admin UI on this page.

**Billing-Related Access Rules:** Price changes are prospective; existing subscribers not
affected until their next billing cycle (Assumption A5).

**Denied Access Redirect:** Same as Family 9.

**Audit / Logging:** `tier_created`, `tier_published`, `tier_price_changed`, `tier_hidden`,
`tier_deleted`.

**Notes:** If a tier is deleted, any tier-gated collections referencing it must be updated —
they cannot remain in published status with a deleted tier (Family 12 dependency).

---

### Family 12 — Products & Collections Management

**Routes:** `/dashboard/magaza` · `/dashboard/magaza/yeni` · `/dashboard/magaza/[product-id]/duzenle` ·
`/dashboard/koleksiyonlar` · `/dashboard/koleksiyonlar/yeni` · `/dashboard/koleksiyonlar/[collection-id]/duzenle`

**Allowed Roles:** `creator:approved` — the owning creator only.

**Blocked Roles:** Same as Family 9.

**Visibility Rules:** Creator sees only their own products and collections. Draft items not
visible on `/@[username]`.

**Primary Actions Allowed:** Create, edit, publish, unpublish, archive, delete own products
and collections; assign tier gate to collections; upload and replace files.

**Restricted Actions:**
- Draft products and collections are not visible publicly
- Tier-gated collection must reference a valid, published tier — if the tier is deleted, the
  collection must be taken off published status before the tier can be deleted
- Purchaser entitlement for products/collections is managed by the entitlement service, not
  this page; this page manages metadata and access rules only

**Entitlement Requirements:** Approved creator status required. File downloads are served via
authenticated storage URLs — the storage layer checks purchase or membership records before
granting a signed URL.

**Admin Override Rules:** Admin moderation can flag or remove products via Family 21.

**Billing-Related Access Rules:** Product unpublish policy for prior purchasers is unresolved
(Assumption A4 — Option A: revoke access; Option B: retain access). Do not implement a
default until this decision is made.

**Denied Access Redirect:** Same as Family 9.

**Audit / Logging:** `product_created`, `product_published`, `product_unpublished`,
`collection_created`, `collection_tier_gate_set`.

**Notes:** Assumption A4 (product unpublish access policy) must be resolved before launch.
It affects Families 12, 13, 17, and 18.

---

### Family 13 — Library

**Routes:** `/account/kutuphane` · `/account/satin-almalar`

**Allowed Roles:** `fan` (any email verification state). A `creator:approved` who also holds
a `fan` role may access these routes.

**Blocked Roles:**
- `anonymous` → `/auth/giris?return=/account/kutuphane`
- Admin cannot access fan account routes through these URLs

**Visibility Rules:** Content is scoped strictly to the authenticated fan's entitlements.
No fan can see another fan's library or purchases.

**Primary Actions Allowed:** View unlocked posts (via membership), view purchased products
and collections, download purchased files, navigate to creator page from library item.

**Restricted Actions:**
- No fan can view another fan's library
- Expired membership content not shown (access revoked at billing period end)

**Entitlement Requirements:**
- Tier-gated content: visible only if fan's active tier on the relevant creator meets or
  exceeds the required tier
- Cancelled membership (`membership:cancelled`): content visible through billing period end
- Grace period membership (`membership:grace`): content visible while grace period runs
- Expired membership (`membership:expired`): content no longer shown; re-subscribe CTA only
- Purchased products/collections: `product:purchased` or `collection:purchased` record required

**Admin Override Rules:** Admin does not access fan libraries through these routes.
Separate admin user management tooling is deferred (see Section 7).

**Billing-Related Access Rules:**
- `membership:cancelled`: library shows entitled content through period end
- `membership:grace`: library shows content while grace period runs
- `membership:expired`: content no longer accessible; re-subscribe CTA shown
- `product:purchased`: download access permanent (subject to Assumption A4)

**Denied Access Redirect:** `anonymous` → `/auth/giris?return=/account/kutuphane`.

**Audit / Logging:** `library_viewed`, `purchased_item_downloaded`.

**Notes:** Download URL generation is a storage-layer concern. Platform checks entitlement
record first, then generates a signed URL. URL expiry policy is an infrastructure decision.

---

### Family 14 — Memberships & Billing

**Routes:** `/account/uyeliklerim` · `/account/uyeliklerim/[membership-id]` · `/account/fatura`

**Allowed Roles:** `fan` — who owns the referenced membership and billing resources.

**Blocked Roles:**
- `anonymous` → `/auth/giris`
- Another fan's `[membership-id]` → 404 (ownership enforced server-side)
- Creator-only accounts (no fan role) → redirect to role-home
- Admin cannot access fan billing pages through these routes

**Visibility Rules:** Fan sees only their own memberships and billing data. Payment card data
is displayed as a summary proxy only (card type + last 4 digits + expiry) — raw card data is
never returned to the frontend (gateway embeds — global assumption 13).

**Primary Actions Allowed:** View active and past memberships; view membership detail (status,
next billing date, tier name); view billing history; view/update payment method; navigate to
cancellation flow (Family 19).

**Restricted Actions:**
- Cannot view another fan's membership detail (ownership enforced)
- Raw payment card data never exposed to frontend
- Admin billing operations deferred (see Section 7)

**Entitlement Requirements:** Membership ownership enforced at route level.

**Admin Override Rules:** Admin billing operations are deferred. No admin UI on these pages.

**Billing-Related Access Rules:**
- `membership:active`: all actions available
- `membership:cancelled`: view detail; no payment method update; shows period end date
- `membership:grace`: "Ödeme Yöntemini Güncelle" is the primary CTA
- `membership:expired`: shows expired state; re-subscribe CTA only

**Denied Access Redirect:** Wrong `[membership-id]` → 404; `anonymous` → `/auth/giris`.

**Audit / Logging:** `memberships_page_viewed`, `billing_page_viewed`,
`payment_method_update_initiated`.

**Notes:** Cancellation action navigates fan to `/uyelik/[membership-id]/iptal` (Family 19).
Payment method update navigates to the payment gateway's hosted interface.

---

### Family 15 — Notifications

**Route:** `/account/bildirimler`

**Allowed Roles:** Any authenticated user: `fan`, `creator:approved`, or dual-role.
`creator:suspended` may view their notifications (account-status notifications only).

**Blocked Roles:** `anonymous` → `/auth/giris`.

**Visibility Rules:** Notifications are scoped to the authenticated user's identity. Dual-role
users see events from both their fan and creator roles in a unified feed. Fan-role events are
only generated for fan activity; creator-role events only for creator activity.

**Primary Actions Allowed:** View notification list; mark individual notifications as read;
mark all as read.

**Restricted Actions:**
- No user can view another user's notifications
- Admin broadcast notifications are visible but not deletable by the receiving user

**Entitlement Requirements:** Authenticated session required.

**Admin Override Rules:** Admin can send broadcast notifications to user segments
(infrastructure concern). Admin cannot read individual user notifications through this page.

**Billing-Related Access Rules:** Billing events (renewal failure notice, cancellation
confirmation, successful charge) appear as fan-role notifications.

**Denied Access Redirect:** `anonymous` → `/auth/giris`.

**Audit / Logging:** `notifications_page_viewed`, `notification_marked_read`.

**Notes:** Creator approval and rejection notifications are delivered via transactional email
first. In-app notification delivery for these events depends on this module being available
when the onboarding module ships (global assumption 11).

---

### Family 16 — Membership Checkout

**Routes:** `/checkout/uyelik/[creator-username]/[tier-id]` · `/checkout/onay/[order-id]` · `/checkout/hata/[order-id]`

**Allowed Roles:** `fan` with `email:verified` and no existing active subscription to the
same tier. A dual-role user (fan + creator) is allowed on the fan side.

**Blocked Roles:**
- `anonymous` → `/auth/giris?return=[checkout-url]`
- `fan` with `email:unverified` → verification banner shown; payment form blocked until verified
- Fan with an existing `membership:active` subscription to the same tier → "Zaten bu plana
  üyesiniz" notice shown instead of checkout form
- `admin` is not expected on checkout pages

**Visibility Rules:** Tier summary and creator context visible to all roles who reach the URL.
Checkout payment form visible only to eligible fans.

**Primary Actions Allowed:** View tier summary; enter payment via gateway embed; submit
checkout; receive confirmation.

**Restricted Actions:**
- Payment form blocked for `email:unverified` fans
- Duplicate active subscription to same tier blocked
- Raw card data never handled by platform — gateway embeds (global assumption 13)

**Entitlement Requirements:** `email:verified` required. Duplicate-subscription check required.

**Admin Override Rules:** No admin UI on checkout pages.

**Billing-Related Access Rules:**
- Annual membership checkout: same flow; billing interval selected at this step
- "Zaten üyesiniz" guard applies to same tier at any billing interval (monthly or annual)
- Success state (`/checkout/onay/[order-id]`) and error state (`/checkout/hata/[order-id]`)
  also require auth; `order-id` must belong to the authenticated fan — other fans see 404

**Denied Access Redirect:** `anonymous` → `/auth/giris?return=[checkout-url]`; success →
`/checkout/onay/[order-id]`; failure → `/checkout/hata/[order-id]`.

**Audit / Logging:** `checkout_started` (with `checkout_type: 'membership'`),
`checkout_completed`, `checkout_failed` (with `error_type`).

**Notes:** `[order-id]` on confirmation and error pages scoped to the authenticated fan.
Any other fan gets a 404. Shared confirmation/error route for all three checkout types
(global assumption 18).

---

### Family 17 — Product Checkout

**Routes:** `/checkout/urun/[product-id]` · `/checkout/onay/[order-id]` · `/checkout/hata/[order-id]`

**Allowed Roles:** `fan` with `email:verified` and no prior purchase of the same product.

**Blocked Roles:**
- Same guards as Family 16
- Fan with prior purchase (`product:purchased`) → "Bu ürünü zaten satın aldınız" notice +
  link to library

**Visibility Rules:** Product summary visible to all roles who reach the URL. Checkout form
visible to eligible fans only.

**Primary Actions Allowed:** View product summary; enter payment via gateway embed; submit
checkout; receive confirmation with download access.

**Restricted Actions:** Same as Family 16. Additionally: duplicate purchase blocked.

**Entitlement Requirements:** `email:verified` required. No prior purchase of this product.

**Admin Override Rules:** No admin UI on checkout pages.

**Billing-Related Access Rules:** One-time purchase; no recurring billing. Signed download
URL generated post-purchase by the storage layer.

**Denied Access Redirect:** Same pattern as Family 16.

**Audit / Logging:** `checkout_started` (with `checkout_type: 'product'`),
`checkout_completed`, `checkout_failed`.

**Notes:** Download URL is signed and time-limited. URL sharing grants temporary access
limited by expiry policy — an infrastructure decision. Product unpublish access policy is
open (Assumption A4).

---

### Family 18 — Collection Checkout

**Routes:** `/checkout/koleksiyon/[collection-id]` · `/checkout/onay/[order-id]` · `/checkout/hata/[order-id]`

**Allowed Roles:** `fan` with `email:verified`, no prior purchase of the collection, and
no active qualifying membership tier that already grants access.

**Blocked Roles:**
- Same guards as Families 16–17
- Fan with existing tier access (`collection:tier_access`) or prior purchase
  (`collection:purchased`) → "Bu koleksiyona zaten erişiminiz var" notice

**Visibility Rules:** Collection summary visible to all roles. Checkout form to eligible
fans only.

**Primary Actions Allowed:** View collection summary; enter payment; submit checkout;
receive confirmation with collection access.

**Restricted Actions:**
- Same as Family 16
- This checkout route is only valid for purchase-type collections. Tier-gated-only collections
  are not purchasable via this route — access is granted through membership only.

**Entitlement Requirements:** `email:verified` required. No existing access to this collection.

**Admin Override Rules:** No admin UI on checkout pages.

**Billing-Related Access Rules:** One-time purchase. Collection access record created
post-purchase; enforced by entitlement service.

**Denied Access Redirect:** Same pattern as Family 16. Tier-gated-only collection accessed
via this route → 404 or redirect to creator page.

**Audit / Logging:** `checkout_started` (with `checkout_type: 'collection'`),
`checkout_completed`, `checkout_failed`.

**Notes:** Tier-gated collections return 404 or redirect to creator page if accessed via
this checkout route. Collection unpublish access policy is open (Assumption A4).

---

### Family 19 — Cancellation Flow

**Route:** `/uyelik/[membership-id]/iptal`

**Allowed Roles:** `fan` who owns the membership identified by `[membership-id]`.

**Blocked Roles:**
- `anonymous` → `/auth/giris`
- Any fan accessing another fan's `[membership-id]` → 404 (ownership enforced server-side)
- `creator:approved` cannot cancel a fan's membership through this route

**Visibility Rules:** Fan sees their own membership details, current billing period end date,
consequence disclosure (what they lose on cancellation), and optional retention offer block
(if enabled — Assumption A9).

**Primary Actions Allowed:** Confirm cancellation intent (multi-step with consequence
disclosure); submit cancellation.

**Restricted Actions:**
- Creator-side or admin-side cancellation of a fan's membership is a separate operation
  not accessible via this route
- Cancellation cannot be undone via UI at MVP

**Entitlement Requirements:** Fan must own the membership being cancelled.

**Admin Override Rules:** No admin UI on this page. Admin-side membership cancellation is a
deferred admin billing operation (see Section 7).

**Billing-Related Access Rules:**
- Post-cancellation: access continues through billing period end date (Assumption A7 global /
  global assumption 14)
- Annual memberships: same end-of-period policy; no proration (Assumption A7 / global
  assumption 15)
- Retention offer block: optional conditional section; business rules deferred (Assumption A9
  / global assumption 17)

**Denied Access Redirect:** Wrong `[membership-id]` → 404; `anonymous` → `/auth/giris`.

**Audit / Logging:** `cancellation_flow_started`, `cancellation_confirmed`,
`cancellation_abandoned`.

**Notes:** Annual cancellation and the KVKK/Turkish consumer rights implications must be
reviewed by legal before launch (global assumption 15).

---

### Family 20 — Creator Review Queue

**Routes:** `/admin` · `/admin/yaraticilar/inceleme`

**Allowed Roles:** `admin` only.

**Blocked Roles:** All non-admin roles (any `fan`, any `creator:*` state, `anonymous`) →
redirect to admin login page (separate from `/auth/giris` — Assumption A3).

**Visibility Rules:** Admin sees all creator applications at `pending_review` status. Inline
panel shows: creator profile, tier list, IBAN format validity status (not full IBAN value),
agreement acceptance status. Full IBAN values are stored encrypted and never returned to
the frontend.

**Primary Actions Allowed:** Approve creator; reject creator (with reason); suspend creator;
view inline application detail.

**Restricted Actions:**
- Full IBAN values never returned to frontend
- Admin cannot undo approve/reject/suspend via UI at MVP — these actions are irreversible
  through this interface
- All actions require a reason or note entry

**Entitlement Requirements:** Admin role required. Admin identity must be logged with every
action (global assumption 21).

**Admin Override Rules:** Admin has full authority over creator approval decisions on this
page. Approval gates creator's access to `/dashboard`, publish capability, and payment
receipt capability.

**Billing-Related Access Rules:** No billing data displayed on this page.

**Denied Access Redirect:** Non-admin → admin login (separate from public `/auth/giris`).

**Audit / Logging:** `creator_approved`, `creator_rejected`, `creator_suspended` — each with
`admin_id`, `creator_id`, `reason`, `timestamp`.

**Notes:** Admin actions are irreversible through the UI at MVP — direct database intervention
required for corrections. Audit trail infrastructure must exist before admin tools go to
production (global assumption 21).

---

### Family 21 — Moderation & Reports

**Routes:** `/admin/moderasyon/raporlar` · `/admin/moderasyon/raporlar/[report-id]` · `/admin/moderasyon/icerik`

**Allowed Roles:** `admin` only.

**Blocked Roles:** Same redirect behavior as Family 20.

**Visibility Rules:** Admin sees the reports queue, individual report detail, and flagged
content queue. Reported and flagged content is visible to admin regardless of its public
visibility status (including content that has been hidden from the public by a prior admin
action).

**Primary Actions Allowed:** Warn user; restrict account (limits publishing); remove content;
dismiss report; add internal action notes.

**Restricted Actions:**
- Action notes are Admin-only — never surfaced to the reporter or the target of moderation
- Content removal and account restriction are irreversible through the UI at MVP
- Admins cannot act anonymously — identity logged with every action (global assumption 21)
- Admin cannot access private messages through this page (not in scope)
- Admin cannot view fan billing details through this page (deferred)

**Entitlement Requirements:** Admin role required.

**Admin Override Rules:** Admin has full content and account action authority within this
queue. Removed content (`status: removed`) is not visible to any non-admin user, regardless
of their entitlement (purchase or membership). This overrides all user-level entitlement rules.

**Billing-Related Access Rules:** No direct billing access. Reports related to billing
disputes should be referred to the gateway or deferred admin billing operations (Section 7).

**Denied Access Redirect:** Non-admin → admin login.

**Audit / Logging:** `report_actioned`, `content_removed`, `account_restricted`,
`report_dismissed` — each with `admin_id`, `target_id`, `action_type`, `timestamp`.

**Notes:** Report reason taxonomy is a product decision using placeholder labels at MVP
(global assumption 22). Finalize taxonomy before moderation tools ship. Flagged content
sources include user reports, system flags, and manual admin flags (global assumption 23).

---

### Family 22 — Terms of Service

**Route:** `/legal/kullanim-kosullari`

**Allowed Roles:** All roles — fully public.

**Blocked Roles:** None. Must not be behind any authentication gate.

**Visibility Rules:** Same document served to all visitors and users. No user-specific
content is injected.

**Primary Actions Allowed:** Read; navigate internal links; print or copy content.

**Restricted Actions:** No acceptance mechanism exists on this page. Acceptance is captured
at fan signup (Family 4), creator signup (Family 5), and creator onboarding (Family 7).

**Entitlement Requirements:** None.

**Admin Override Rules:** Content is maintained by the platform operator's legal team, not
via admin UI at launch (global assumption 24). No admin authority applies to this page's access.

**Billing-Related Access Rules:** None.

**Denied Access Redirect:** N/A — always accessible.

**Audit / Logging:** `legal_page_viewed` (with `page: 'terms'`).

**Notes:** Must be versioned with "Son güncelleme: [tarih]" and a machine-readable version
identifier. Consent records at signup and onboarding reference this version (global assumption 25).
Page must not be behind any auth gate — it is linked from pre-auth flows.

---

### Family 23 — Privacy Policy

**Route:** `/legal/gizlilik-politikasi`

**Allowed Roles:** All roles — fully public.

**Blocked Roles:** None. Must not be behind any authentication gate.

**Visibility Rules:** Same document served to all. No user-specific content.

**Primary Actions Allowed:** Read; navigate internal links; print or copy content.

**Restricted Actions:** No acceptance mechanism on this page. Acceptance captured at signup.

**Entitlement Requirements:** None.

**Admin Override Rules:** Content maintained by legal team (global assumption 24).

**Billing-Related Access Rules:** None.

**Denied Access Redirect:** N/A — always accessible.

**Audit / Logging:** `legal_page_viewed` (with `page: 'privacy'`).

**Notes:** KVKK compliance requirement. Must not be behind any auth gate. Must be versioned
(global assumption 25). Re-acceptance behavior when policy updates is a legal/backend decision
not defined here (Assumption A14).

---

### Family 24 — Creator Agreement

**Route:** `/legal/yaratici-sozlesmesi`

**Allowed Roles:** All roles — fully public.

**Blocked Roles:** None. Must not be behind any authentication gate.

**Visibility Rules:** Same document served to all. No user-specific content.

**Primary Actions Allowed:** Read; navigate internal links; print or copy content.

**Restricted Actions:** No acceptance mechanism exists on this page. Acceptance is captured
server-side at onboarding step 5 (Family 7).

**Entitlement Requirements:** None.

**Admin Override Rules:** Content maintained by legal team (global assumption 24).

**Billing-Related Access Rules:** None.

**Denied Access Redirect:** N/A — always accessible.

**Audit / Logging:** `legal_page_viewed` (with `page: 'creator_agreement'`).

**Notes:** Acceptance record at onboarding must reference the version identifier of this
document at the time of acceptance (global assumption 25). Must not be behind any auth gate —
creators must be able to read it before applying.


---

## 4. Entitlement Rules

Entitlement rules define content-level access conditions that apply within and across page
families. These rules are enforced by the entitlement service at the API level — not by
frontend filtering alone.

### 4.1 Public Post Access

- Visible to all roles including `anonymous`, but only for **`creator:approved`** creators.
- No login required to read public posts.
- Pre-approval creator content is **not publicly visible to anyone** — not to visitors, fans,
  or members. The creator can access their own drafts only through their dashboard, not via
  their public `/@[username]` page. Content becomes publicly accessible only once the creator
  reaches `approved` status.
- Removed posts (`status: removed`): not visible to anyone. Creator sees a "kaldırıldı"
  (removed by moderation) placeholder in their post list.

### 4.2 Member-Only Post Access

- Requires an authenticated fan with at least a free-tier membership (follow) to the creator.
- If the creator has no free tier, any paid active membership qualifies.
- `anonymous` visitors see a paywall with subscribe CTAs.
- `email:unverified` fans see a paywall — email must be verified before accessing gated content.
- `membership:cancelled`: accessible through billing period end date.
- `membership:grace`: accessible while grace period runs.
- `membership:expired`: paywall shown; re-subscribe CTA.

### 4.3 Tier-Gated Post Access

- Requires an authenticated fan whose **active** membership tier matches or exceeds the post's
  required tier.
- Default tier-matching rule at MVP: fan must hold the exact required tier or higher.
  Whether "higher" means a higher-ranked tier automatically includes lower-tier content is an
  open policy decision (Assumption A13). The default at MVP is to require the exact matching
  tier unless the creator explicitly configures tier inclusion.
- `membership:cancelled`: accessible through billing period end date.
- `membership:grace`: accessible while grace period runs.
- `membership:expired`: access revoked; paywall shown with re-subscribe CTA.

### 4.4 Premium Post Access

- Individual purchase required, regardless of membership tier.
- Fan must be authenticated and `email:verified` to initiate purchase.
- After purchase: `product:purchased` record created; access is permanent (no expiry on
  the entitlement itself — subject to Assumption A4 for unpublish behavior).
- `creator:suspended`: access to previously purchased premium posts follows the same
  unresolved policy as product unpublish (Assumption A4).

### 4.5 Digital Product Download Access

- Requires a `product:purchased` record for the authenticated fan.
- Download served via a signed, time-limited URL from the storage layer.
- Platform checks the purchase record before generating the signed URL — entitlement check
  happens server-side, not client-side.
- URL expiry policy (e.g., 24-hour signed URLs) is an infrastructure decision.
- Product unpublished by creator: access policy for prior purchasers is unresolved
  (Assumption A4 — Option A: revoke access; Option B: retain access). Do not implement a
  default until this decision is made.

### 4.6 Collection Access — Purchase Type

- Requires a `collection:purchased` record for the authenticated fan.
- Fan must be authenticated and `email:verified` to initiate purchase.
- After purchase: access is permanent (subject to Assumption A4 for unpublish behavior).
- Collection unpublished by creator: same open question as product (Assumption A4).

### 4.7 Collection Access — Tier-Gated Type

- Requires an active membership at the qualifying tier.
- Same cancellation, grace period, and expiry rules as tier-gated posts (§4.3).
- Tier-gated collections cannot be purchased via `/checkout/koleksiyon/` — access is granted
  only through active membership. If a fan with tier access reaches the collection checkout
  route, they see an "already have access" notice.
- If the qualifying tier is deleted: the collection cannot remain in published status. The
  creator must update the collection before the tier can be deleted (enforced by membership
  module).

### 4.8 Cancellation and Grace Period Behavior

- Cancellation does not revoke access immediately under any circumstances.
- Access continues through the billing period end date (global assumption 14).
- Annual memberships follow the same end-of-period policy; no proration (global assumption 15).
  This requires legal review before launch (KVKK / Turkish consumer rights — Assumption A7).
- Grace period (renewal payment failure): access continues while the grace period runs.
  Grace period duration (e.g., 3–7 days) is a billing module decision (global assumption 16).
- After grace period expires without payment resolution: membership transitions to `expired`;
  all tier-gated and member-only access is revoked immediately.

### 4.9 Creator Unpublish Edge Cases (Unresolved — Assumption A4)

When a creator unpublishes a product or collection, the access policy for prior purchasers
is **not defined** at MVP. Two options are in scope:

- **Option A — Revoke access:** Prior purchasers lose download access when the product or
  collection is unpublished. Creator has full control; stricter enforcement.
- **Option B — Retain access:** Prior purchasers retain download access; only new purchases
  are blocked. Fan-friendly; more complex entitlement logic.

This decision affects Families 12, 13, 17, and 18. The entitlement service implementation
must not assume a default. Resolution required before launch.

### 4.10 Moderation Override of Entitlements

Moderation state overrides all user-level entitlement rules:

- **Content `status: removed`**: not accessible to any user under any entitlement. Purchase
  records and membership records still exist in the database for audit purposes — they do
  not grant access to removed content. Creator sees a "kaldırıldı" placeholder.
- **Content `status: flagged`**: visible to owning creator and admin. Admin may optionally
  hide from public at the point of flagging. If hidden from public: entitlement rules are
  suspended for the duration of the flag review.
- **`creator:suspended`**: all of the creator's content is hidden from all visitors, fans,
  and members — regardless of purchase, membership, or subscription status. Creator cannot
  publish new content. Existing subscribers' entitlement records are preserved but content
  is inaccessible while the creator is suspended.

Refund policy for fans who lose access to removed or suspended-creator content is outside the
scope of this document.

---

## 5. Admin Authority Rules

### 5.1 Creator Review Queue Authority

- **Can:** Approve creator; reject creator (with written reason); suspend creator.
- **Cannot:** Undo approve/reject/suspend through the UI at MVP — these are irreversible via
  the interface. Direct database intervention is required for corrections.
- **Sees:** Creator profile, tier list, IBAN format validity (not the IBAN value itself),
  agreement acceptance timestamp, and which version of the Creator Agreement was accepted.
- **Does not see:** Full IBAN values — stored encrypted; never returned to the frontend.
- **Logging requirement:** Every action is logged with the admin's identity, the creator's
  identity, the action type, a written reason, and a timestamp (global assumption 21).
- **Effect:** Approval removes the creator from the pending queue and grants access to
  `/dashboard`, publish capabilities, and payment receipt. Rejection returns the creator to
  the onboarding resubmit state. Suspension hides all content and blocks dashboard access.

### 5.2 Moderation / Report Queue Authority

- **Can:** Warn user; restrict account (limits publishing); remove content; dismiss report;
  add internal action notes.
- **Cannot:** Access private messages (not in scope); view fan billing details (deferred);
  undo actions through the UI at MVP.
- **Sees:** Report details, reported content (regardless of public visibility), reporter
  identity, target identity, prior moderation history on the target.
- **Action notes:** Admin-only field — never surfaced to the reporter or the target.
- **Logging requirement:** Every action logged with admin identity (global assumption 21).

### 5.3 Content Visibility for Admin

- Admin can view: suspended creator pages (not blocked from viewing); flagged content
  (regardless of whether it has been hidden from the public); removed content (only in
  moderation tools, not via the public-facing routes).
- Admin cannot: access fan library pages (`/account/kutuphane`, `/account/satin-almalar`)
  through admin routes at MVP. Separate admin user management tooling is deferred (Section 7).
- Admin can: view creator applications in the review queue regardless of the creator's
  onboarding status (pending, rejected, etc.).

### 5.4 Admin Approval Gate

Until a creator reaches `creator:approved` status, the following are all blocked:
- Access to `/dashboard/*` routes
- Appearance in `/kesfet` search results
- Publishing of any content (posts, products, collections)
- Receipt of membership payments

Approval event: triggers a transactional email to the creator. In-app notification delivery
depends on the Notifications module (Family 15) being available when the creator review
tools ship (global assumption 11).

### 5.5 Deferred Admin Authority — Not Phase 1

The following admin capabilities are explicitly out of scope for Phase 1:

| Capability | Deferred Route | Reason |
|---|---|---|
| Billing operations and dispute handling | `/admin/fatura` | Payment gateway handles disputes directly at launch |
| Audit log UI | `/admin/denetim-gunlugu` | Logging infrastructure ships; UI is post-launch |
| User management list | `/admin/kullanicilar` | Post-launch |
| Individual creator detail view | `/admin/yaraticilar/[creator-id]` | Inline queue review is sufficient at launch |
| Copyright / DMCA claim queue | `/admin/telif-hakki` | Email-based DMCA process covers launch |
| Admin-side membership cancellation | — | Deferred admin billing operation |
| CMS for platform resources/updates | `/admin/icerik-yonetimi` | Post-launch |

---

## 6. Cross-Cutting Access Rules

### 6.1 Anonymous-to-Auth Redirects

Any gated action (subscribe, purchase, access gated content, access account pages) by an
`anonymous` visitor triggers a redirect to `/auth/giris?return=[current-url]`.

Rules:
- The `return` URL must be a same-origin relative path — validated server-side before redirect
  is performed (global assumption 5).
- Absolute URLs and cross-origin paths in `?return=` are rejected; user is redirected to
  their role-appropriate home instead.
- The `return` URL survives through the email verification step: if the fan arrives at signup
  with a `?return=` value, that URL is applied after verification completes.

### 6.2 Fan-to-Creator Upgrade Path

- An authenticated `fan` can initiate a creator application by navigating to
  `/auth/kayit/yaratici`.
- The creator role is attached to the existing account — no new account is created
  (Assumption A1 — dual-role).
- Fan capabilities (library, active memberships, checkout) are fully preserved and are not
  affected by any creator status change.
- The creator role does not elevate fan privileges. A fan who applies as a creator still
  requires `email:verified` for checkout (if their email was not already verified).

### 6.3 Creator Self-Access vs. Public Access

- An `creator:approved` creator visiting `/@[username]` (their own page) sees their
  published content as any visitor would — they do not see drafts or scheduled posts on the
  public page.
- Drafts and scheduled posts are accessible only via `/dashboard/gonderiler` (Family 10).
- Member count and tier prices are always publicly visible — the creator cannot hide these
  on their public page.
- Whether a creator can subscribe to their own membership tiers is an open question
  (Assumption A12 — billing module decision).

### 6.4 Suspended / Restricted Creator Behavior

When a creator is moved to `creator:suspended`:
- Dashboard access is blocked immediately.
- All content is hidden from all visitors, fans, and members on `/@[username]`.
- The creator is removed from `/kesfet` results.
- The creator cannot publish new content, receive new subscriptions, or receive new purchases.
- **Fan role:** unaffected. The suspended creator can still subscribe to other creators as a fan.
- **Existing subscribers:** memberships continue to bill (no automatic cancellation triggered by
  suspension). However, content is inaccessible while the creator is suspended — subscribers
  cannot access content they were previously entitled to. Whether billing should pause or stop
  during suspension is an open operational/legal question (Assumption A11).

### 6.5 Flagged and Removed Content Behavior

**`status: flagged`:**
- Visible to the owning creator and admin.
- Admin may optionally hide from public at the point of flagging.
- If hidden from public: entitlement rules are suspended; all roles (including members and
  purchasers) see the content as unavailable until the flag is resolved.
- If not hidden from public: normal entitlement rules apply while under review.
- Entitlement records (purchase and membership) are preserved regardless of flagged state.

**`status: removed`:**
- Not visible to any role — not to the creator, fans, members, or visitors through any public
  route.
- Creator sees a "kaldırıldı" placeholder in their dashboard post list.
- Fans who purchased or subscribed see the content as unavailable; entitlement records remain
  in the database for audit purposes but do not grant access.
- Removal is irreversible through the UI at MVP.

### 6.6 Legal Consent Dependencies

The following access gates depend on legal page consent:

| Consent Point | Where Captured | Legal Document Referenced |
|---|---|---|
| Fan account creation | Family 4 — Fan Kaydı | Terms of Service (Family 22) + Privacy Policy (Family 23) |
| Creator account creation | Family 5 — Yaratıcı Başvurusu | Terms of Service (Family 22) + Privacy Policy (Family 23) |
| Creator Agreement acceptance | Family 7 — Onboarding step 5 | Creator Agreement (Family 24) |

Rules:
- Legal pages (Families 22–24) must not be behind any authentication gate at any time.
- Consent records must reference the version identifier of the legal document at the time
  of acceptance (global assumption 25).
- If a legal page is updated after a user has already accepted, whether to require re-acceptance
  or send a notification is a legal and backend decision not defined in this document
  (Assumption A14).

---

## 7. Deferred / Out of Scope

The following permission areas are explicitly not covered in Phase 1. They must not be
introduced into the permission matrix or the codebase without an explicit scope change.

| Permission Area | Why Deferred | Notes |
|---|---|---|
| Chat permissions (1:1 and group) | Explicitly excluded from Phase 1 launch scope | All `/mesajlar/*` and `/grup-sohbet/*` routes deferred |
| Livestream permissions | Excluded from Phase 1 entirely | No livestream features in any form |
| Mobile app permissions | Web-only in Phase 1 | No native app permission models |
| Tier upgrade / downgrade flows | Deferred post-launch | Only cancellation at MVP; `/uyelik/[id]/yuksel` and `/dusur` deferred |
| Admin billing operations | Deferred; payment gateway handles disputes | `/admin/fatura` and sub-pages not in scope |
| Admin audit log UI | Logging infrastructure ships first; UI is post-launch | `/admin/denetim-gunlugu` deferred |
| Admin user management | Post-launch | `/admin/kullanicilar` deferred |
| Admin creator detail page | Inline queue review sufficient at MVP | `/admin/yaraticilar/[creator-id]` deferred |
| Copyright / DMCA claim queue | Email-based process covers launch | `/admin/telif-hakki` deferred |
| Advanced notification preferences | Post-launch | `/account/ayarlar/bildirimler` deferred |
| Account settings | Post-launch | `/account/ayarlar` deferred |
| Creator payout operations (dashboard) | Post-launch | `/dashboard/odeme` deferred |
| Advanced creator analytics | Post-launch | `/dashboard/analitik/*` deferred |
| Community / group room permissions | No group chat in Phase 1 | Deferred with all chat |
| Physical product permissions | Excluded from Phase 1 | No physical goods marketplace |
| Affiliate / referral permissions | Excluded from Phase 1 | No referral or affiliate program |
| Admin-side membership cancellation | Deferred admin billing operation | No admin cancel-on-behalf-of-fan at MVP |

---

## 8. Assumptions / Open Decisions

The following are permission-specific assumptions and unresolved policy decisions that require
product confirmation before the affected features can be fully implemented.

| # | Assumption | Impact on Access Control |
|---|---|---|
| A1 | Dual-role coexistence: fan and creator on one identity | All auth guards must preserve fan capabilities when creator status changes; role checks must evaluate fan and creator roles independently |
| A2 | Email verification gates checkout and gated content download, not browsing | Families 4, 16, 17, 18 — unverified fans can browse but not transact |
| A3 | ~~Admin accounts provisioned separately; separate login flow~~ **Resolved 2026-03-27 — `POST /admin/auth/login` confirmed. `User.is_admin = true` flag on shared `users` table. Admin token carries `scope: admin` claim. Fan tokens cannot access admin routes.** | Families 20, 21 — admin guard checks both valid session and `is_admin = true` in token |
| A4 | Product and collection unpublish policy for prior purchasers is unresolved (Option A vs. B) | Families 12, 13, 17, 18 — entitlement service cannot assume a default until this is decided |
| A5 | Tier price changes take effect at next billing cycle; no proration | Family 11 — billing module enforces prospective pricing; existing subscriptions unaffected until renewal |
| A6 | Post access level change from free to gated is immediately enforced | Family 10 — viewers who no longer qualify lose access immediately; flag for policy review |
| A7 | Annual cancellation follows end-of-period policy; no proration | Family 19 — requires legal review (KVKK / Turkish consumer rights) before launch |
| A8 | Renewal failure grace period duration is TBD | Family 14 — entitlement during grace period is defined (access continues); duration is a billing module decision |
| A9 | Retention offer on cancellation is optional and undecided | Family 19 — cancellation flow accommodates the offer block but does not require it |
| A10 | Creator approval notification delivered via email; in-app notification deferred | Families 7, 20 — in-app delivery depends on Notifications module (Family 15) being available |
| A11 | Whether suspended creator's subscribers continue billing while content is inaccessible | Cross-cutting — operational/legal policy decision; affects billing module and moderation behavior |
| A12 | Whether a creator can subscribe to their own membership tiers | Cross-cutting — billing module decision; affects Family 8 (creator self-access) and Family 16 |
| A13 | Tier-gated access model: exact match vs. higher-tier-includes-lower-tier | Families 8, 13 — entitlement service implementation depends on this policy; default at MVP: exact match unless creator configures otherwise |
| A14 | Re-acceptance prompt vs. notification when a legal page is updated after prior acceptance | Families 22–24 — legal and backend decision; not defined in this document |

---

## Validation Checklist

- [x] All 24 page families are covered in the permission matrix (Section 3)
- [x] No out-of-scope features (chat, livestream, mobile, physical products) are included in
      the functional sections — they appear only in Section 7 (Deferred)
- [x] Role naming is consistent with Section 2 throughout the document
- [x] Entitlement rules (Section 4) are consistent with the entitlement requirements fields
      in each per-family detail block (Section 3)
- [x] Admin authority (Section 5) does not exceed the deferred scope listed in Section 7
- [x] All 6 cross-cutting rules (Section 6) are grounded in `page-requirements.md` definitions
- [x] Open decisions (Section 8) are flagged, not assumed or resolved
- [x] No new routes, pages, or roles were invented beyond the approved 24-family scope

---

*This document is part of the lalabits.art product documentation. Root project context lives
in [CLAUDE.md](../../CLAUDE.md). Page-level requirements live in
[page-requirements.md](./page-requirements.md). Sitemap and route authority lives in
[sitemap.md](./sitemap.md).*
