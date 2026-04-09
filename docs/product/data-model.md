# Data Model — lalabits.art Phase 1

> **Status:** Approved
> **Version:** v1.0
> **Scope:** Phase 1 MVP
> **Authority level:** Supporting
>
> **Authority files:** [CLAUDE.md](../../CLAUDE.md) · [page-requirements.md](./page-requirements.md) ·
> [permission-matrix.md](./permission-matrix.md) · [sitemap.md](./sitemap.md)
>
> **Scope:** This document defines the canonical domain model for the approved 24 launch-critical
> page families. It does not define schema migrations, ORM code, or API shapes.

---

## 1. Document Purpose

This document is the canonical Phase 1 domain model for lalabits.art. It defines entity
boundaries, key fields, status enums, relationships, state machines, and entitlement-relevant
data rules needed to implement the approved 24 launch-critical page families.

**Derived from:**
- `page-requirements.md` — 24 families; data consumed per page
- `permission-matrix.md` — roles, entitlement states, billing states, moderation states
- `sitemap.md` — route inventory; entity IDs used in URLs
- `page-requirements-outline.md` — deferred scope boundary
- `CLAUDE.md` — constraints, tech defaults (NestJS / Next.js / PostgreSQL)

**Does not contain:**
- Schema migration code
- ORM entity definitions or decorators
- API request/response shapes
- Frontend component structure

**Is the basis for:**
- Backend module design
- Entitlement service implementation
- Billing integration
- Moderation tooling

---

## 2. Modeling Principles

### Principle 1 — One source of truth per entity

User identity lives in User only. Creator profile state lives in CreatorProfile only. Billing
state lives in MembershipSubscription only. Do not replicate state across multiple entities.
If a derived value is needed for query performance, document it explicitly as denormalized and
identify the update trigger.

### Principle 2 — Separate publish status from moderation status

A post has both `publish_status` (creator-controlled: draft/published/scheduled/archived) and
`moderation_status` (admin-controlled: clean/flagged/removed). These are independent fields.
Moderation status overrides publish status for visibility — a published post with
`moderation_status = removed` is not publicly visible. Both fields are necessary and must not
be collapsed into one. This dual-status model applies equally to Post, Product, and Collection.

### Principle 3 — Separate billing state from entitlement state

A subscription's billing state (active/grace_period/expired) is distinct from the entitlement
question of whether a fan can currently access tier-gated content. Entitlement evaluation reads
billing state but is computed separately at read-time, not stored as a denormalized field.

### Principle 4 — Entitlement records are immutable purchase facts

ProductPurchase, PostPurchase, and CollectionPurchase are append-only records of a completed
transaction. They are not edited when a product is unpublished. Access policy on unpublish
(Assumption D1) is evaluated at read-time against the record's `access_revoked_at` field, not
by deleting the record.

### Principle 5 — No raw payment card data on platform

The payment gateway owns card data. The platform stores only summary display data (card brand,
last four digits, expiry month/year) in PaymentMethodSummary. IBAN is stored encrypted at rest
in CreatorApplication and is never returned to the frontend in full.

### Principle 6 — Admin action log is append-only

ModerationAction records are never updated or deleted. Every admin action (approve, reject,
suspend, warn, restrict, remove, dismiss) creates a new immutable log entry. This is the
audit trail for all moderation and creator review decisions.

### Principle 7 — Entity visibility is role + state compound

Visibility of any content item is determined by the intersection of (a) the content's
`publish_status`, (b) the content's `moderation_status`, (c) the creator's account status, and
(d) the requesting user's role and entitlement state. No single field determines visibility
alone.

---

## 3. Core Entities

Each entity is documented with the following standard fields:

- **Purpose** — one-line description
- **Owned by** — which module/system owns this record
- **Key fields** — name, type, constraints, notes
- **Enums** — named status sets and their semantics
- **Required relationships** — FK and cardinality
- **Creation trigger** — what event creates the record
- **Update triggers** — what events mutate it
- **Soft delete / archive behavior** — if applicable
- **Visibility** — who can read this record or field
- **Entitlement** — if relevant to access control
- **Moderation** — if relevant to moderation
- **Billing** — if relevant to billing lifecycle

---

### Entity 1 — User

**Purpose:** Base identity record. Represents every human account on the platform.

**Owned by:** Auth module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key. Stable; used in URLs only for admin |
| `email` | string (unique) | Login credential; used for notifications |
| `password_hash` | string (nullable) | Null for OAuth-only accounts |
| `display_name` | string | Fan-facing name. Creator may override with CreatorProfile.display_name |
| `avatar_url` | string (nullable) | Fan account avatar. Creator page uses CreatorProfile.avatar_url |
| `email_verified_at` | timestamp (nullable) | Null = unverified. Set on verification token use or Google OAuth |
| `has_fan_role` | boolean (default true) | Set on fan registration or creator applying via fan account |
| `is_admin` | boolean (default false) | Admin provisioned flag. Not set via public signup |
| `account_status` | enum | `active` \| `suspended` |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |
| `deleted_at` | timestamp (nullable) | Soft delete; retains records for billing/moderation audit |

**Enums:** `account_status`: `active`, `suspended`

**Required relationships:**
- 0 or 1 CreatorProfile (FK on CreatorProfile.user_id)
- 0 or 1 BillingCustomer (FK on BillingCustomer.user_id)
- many MembershipSubscriptions (fan side)
- many ProductPurchases (fan side)
- many CollectionPurchases (fan side)
- many Notifications (recipient)
- many ConsentRecords

**Creation trigger:** Fan signup (email/password or Google OAuth); Creator signup (attaches fan
role); admin provisioning (sets is_admin = true, no fan role).

**Update triggers:** Email verification; display name change; avatar change; account suspension.

**Soft delete:** `deleted_at` set. Record retained for billing history, consent records, and
audit log references.

**Visibility:** User can view their own record. Admin can view any user record. Users cannot
view other users' records directly.

**Entitlement:** `email_verified_at` and `account_status` are read by the entitlement service
to gate checkout and gated content access.

**Moderation:** `account_status = suspended` blocks login and all authenticated actions.

**Billing:** Email and ID used as billing customer identifier.

---

### Entity 2 — OAuthAccount

**Purpose:** Links a User account to an external OAuth provider (Google at launch).

**Owned by:** Auth module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID (FK → User) | Account owner |
| `provider` | enum | `google` (only provider at launch) |
| `provider_account_id` | string | Provider's unique identifier for this account |
| `created_at` | timestamp | |

**Enums:** `provider`: `google`

**Required relationships:** Many-to-one with User (one user may in theory have multiple OAuth
providers).

**Creation trigger:** Google OAuth registration, or Google OAuth login where email matches an
existing account.

**Update triggers:** None — immutable once created.

**Soft delete:** Not applicable.

**Visibility:** Auth module internal only.

**Entitlement / Moderation / Billing:** None directly.

---

### Entity 3 — PasswordResetToken

**Purpose:** Single-use token for the password reset flow (Family 6).

**Owned by:** Auth module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID (FK → User) | Account owner |
| `token_hash` | string | SHA-256 hash of the token sent to email. Never stored plain. |
| `expires_at` | timestamp | 1 hour from creation |
| `used_at` | timestamp (nullable) | Set on successful use; token is then invalid |
| `created_at` | timestamp | |

**Creation trigger:** Password reset request (State A of Family 6).

**Update triggers:** `used_at` set when token is redeemed. No other updates.

**Soft delete:** Not applicable. Tokens expire naturally; used tokens are ignored.

**Notes:** All existing sessions for the user are invalidated when a reset token is
successfully redeemed.

---

### Entity 4 — EmailVerificationToken

**Purpose:** Single-use token for email verification after registration (Family 4,
post-signup).

**Owned by:** Auth module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID (FK → User) | Account owner |
| `token_hash` | string | SHA-256 hash. Never stored plain. |
| `expires_at` | timestamp | Configurable; e.g., 24 hours |
| `used_at` | timestamp (nullable) | Set when verification completes |
| `created_at` | timestamp | |

**Creation trigger:** Fan signup (email/password path). Re-created on "Yeniden gönder" action.

**Update triggers:** `used_at` set on successful verification. Triggers
`User.email_verified_at` to be set.

**Notes:** Rate-limit re-send requests to prevent abuse.

---

### Entity 5 — CreatorProfile

**Purpose:** Creator-specific profile data. Extends User for accounts that have a creator
role.

**Owned by:** Creator module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID (FK → User, unique) | 1:1 with User |
| `username` | string (unique) | URL handle: `/@[username]`. Permanent once set. |
| `display_name` | string | Creator page display name (may differ from User.display_name) |
| `bio` | text (nullable) | Public-facing bio |
| `avatar_url` | string (nullable) | Creator page avatar. May override User.avatar_url |
| `cover_image_url` | string (nullable) | Creator page cover/banner image |
| `category` | enum | Creator category |
| `content_format_tags` | string array | Selected content format types (e.g., 'pdf', 'audio', 'video') |
| `status` | enum | Creator account status |
| `onboarding_last_step` | integer (0–5) | Last completed onboarding step. 0 = not started; 5 = submitted |
| `approved_at` | timestamp (nullable) | Set when admin approves |
| `suspended_at` | timestamp (nullable) | Set when admin suspends |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Enums:**
- `category`: `writer`, `illustrator`, `educator`, `podcaster`, `musician`, `designer`, `developer`, `other`
- `status`: `onboarding`, `pending_review`, `approved`, `rejected`, `suspended`

**Required relationships:**
- 1 User (FK user_id)
- 1 CreatorApplication per submission cycle (FK on CreatorApplication)
- many MembershipPlans
- many Posts
- many Products
- many Collections
- many MembershipSubscriptions (creator side, denormalized FK)

**Creation trigger:** Creator signup form submission (Family 5). Sets User.has_creator_role
implicitly via the existence of this record.

**Update triggers:** Each onboarding step completed; admin approve/reject/suspend action;
profile edits (post-launch).

**Soft delete:** `status = suspended` is the operational state. Hard deletion is not expected
at MVP.

**Visibility:** Public fields (username, display_name, bio, avatar_url, cover_image_url,
category) visible to all roles when `status = approved`. Not visible to public when status is
`onboarding`, `pending_review`, `rejected`, or `suspended`. Creator accesses their own profile
and content via dashboard while in any status; the public `/@[username]` page is not rendered
for non-approved creators.

**Entitlement:** `status` is the primary gate for all creator content visibility on
`/@[username]`.

**Moderation:** `status = suspended` hides all content platform-wide.

**Billing:** Creator receives payments only when `status = approved`.

---

### Entity 6 — CreatorApplication

**Purpose:** Tracks the review lifecycle for each creator application submission. One record
per submission attempt.

**Owned by:** Creator review module / Admin module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `creator_profile_id` | UUID (FK → CreatorProfile) | Associated creator |
| `submitted_at` | timestamp | When onboarding step 5 ("Kabul Et ve Gönder") was completed |
| `reviewed_at` | timestamp (nullable) | When admin actioned the application |
| `reviewed_by_admin_id` | UUID (nullable, FK → User) | Admin who actioned |
| `decision` | enum | `pending` \| `approved` \| `rejected` |
| `rejection_reason` | text (nullable) | Written reason; required when decision = rejected |
| `iban_encrypted` | string | Full IBAN, encrypted at rest using AES-256-GCM. Stored as `iv + ciphertext`. Key delivered via `IBAN_ENCRYPTION_KEY` env variable (deploy-time secret). No API-layer decryption at Phase 1. Never returned to any caller. |
| `iban_format_valid` | boolean | Result of format validation at submission. Shown to admin. |
| `iban_last_four` | string (4 chars, nullable) | For admin display only |
| `agreement_version_id` | UUID (FK → LegalDocumentVersion) | Version accepted at onboarding |
| `agreement_accepted_at` | timestamp | When creator accepted the Creator Agreement |
| `resubmission_count` | integer (default 0) | Increments each time a rejected creator resubmits |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Enums:** `decision`: `pending`, `approved`, `rejected`

**Required relationships:** Many-to-one with CreatorProfile; one-to-one with
LegalDocumentVersion (agreement version).

**Creation trigger:** Onboarding step 5 submission ("Kabul Et ve Gönder").

**Update triggers:** Admin actions (approve/reject); resubmission increments counter.

**Visibility:** Visible only to admin (Family 20). Creator sees only their own status outcome
(via CreatorProfile.status), not the raw application record. Full IBAN never returned to any
frontend.

**Entitlement / Moderation:** Admin approval of this record triggers
`CreatorProfile.status → approved`.

---

### Entity 7 — MembershipPlan

**Purpose:** A single membership tier defined by a creator. The access unit for tier-gated
content.

**Owned by:** Membership module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key. Used in checkout URL: `/checkout/uyelik/[creator-username]/[tier-id]` |
| `creator_profile_id` | UUID (FK → CreatorProfile) | Owning creator |
| `name` | string | Display name of the tier (e.g., "Destekçi", "Pro Üye") |
| `description` | text (nullable) | Optional tier description |
| `price_monthly_try` | integer | Price in Turkish Lira kuruş (e.g., 5000 = ₺50.00) |
| `price_annual_try` | integer (nullable) | Annual price in kuruş. Null if annual not offered. |
| `currency` | string (default 'TRY') | Always TRY at Phase 1 |
| `tier_rank` | integer | Ordering rank. Higher number = higher tier. Used for tier comparison. |
| `perks` | JSON array | List of perk strings (e.g., ["Exclusive posts", "Monthly Q&A"]) |
| `status` | enum | Tier availability status |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Enums:** `status`: `draft`, `published`, `hidden`, `archived`

Status semantics:
- `draft`: not yet visible on creator's public page; creator still configuring
- `published`: visible on creator page; available for new subscriptions
- `hidden`: existing subscriptions remain active; no new subscriptions; not visible to new visitors
- `archived`: logically deleted; only reachable if zero active subscribers (membership module enforces)

**Required relationships:** Many-to-one with CreatorProfile; one-to-many with
MembershipSubscriptions; referenced by Posts (tier_gated access_level) and Collections
(tier_gated access_type).

**Creation trigger:** Creator creates a tier (onboarding step 3, or dashboard Family 11).

**Update triggers:** Creator edits name/perks/price; creator hides/unhides tier. Price changes
take effect at next billing cycle (Assumption D — see Section 8).

**Soft delete:** `status = archived` is the soft-delete mechanism. Only possible when zero
active subscribers.

**Visibility:** Published tiers visible to all roles on `/@[username]`. Hidden tiers not
visible to new visitors but remain visible on active members' subscription detail.

**Entitlement:** `tier_rank` is the key field for evaluating tier-gated access. At MVP, exact
tier match is the default access model (see Section 8, D2 for the higher-tier-includes-lower
option).

---

### Entity 8 — MembershipSubscription

**Purpose:** Records a fan's recurring membership to a specific creator's tier. The central
billing lifecycle entity.

**Owned by:** Membership / Billing module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key. Used in `/account/uyeliklerim/[membership-id]` and `/uyelik/[membership-id]/iptal` |
| `fan_user_id` | UUID (FK → User) | Subscribing fan |
| `membership_plan_id` | UUID (FK → MembershipPlan) | The tier subscribed to |
| `creator_profile_id` | UUID (FK → CreatorProfile) | Denormalized for query efficiency |
| `billing_interval` | enum | `monthly` \| `annual` |
| `status` | enum | Subscription lifecycle status |
| `current_period_start` | timestamp | Start of the current billing period |
| `current_period_end` | timestamp | End of the current billing period. Entitlement valid through this date when cancelled. |
| `cancelled_at` | timestamp (nullable) | When the fan requested cancellation |
| `cancellation_reason` | text (nullable) | Fan's optional cancellation reason |
| `grace_period_ends_at` | timestamp (nullable) | Set when renewal payment fails; cleared on resolution |
| `gateway_subscription_id` | string | Payment gateway's subscription reference |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Enums:**
- `billing_interval`: `monthly`, `annual`
- `status`: `pending`, `active`, `cancelled`, `grace_period`, `expired`

Status semantics:
- `pending`: checkout submitted; awaiting payment confirmation from gateway
- `active`: current period paid; fan has full tier entitlement
- `cancelled`: fan requested cancellation; access continues until `current_period_end`
- `grace_period`: renewal payment failed; access continues until `grace_period_ends_at`
- `expired`: period ended (cancelled) or grace period ended (renewal failure) without resolution; access revoked

**Required relationships:** Many-to-one with User (fan); many-to-one with MembershipPlan;
many-to-one with CreatorProfile; one-to-many with Invoices.

**Creation trigger:** Successful membership checkout (Family 16). Created with
`status = pending`; transitions to `active` on payment confirmation webhook from gateway.

**Update triggers:** Payment renewal (updates period dates); cancellation request (sets
cancelled_at, status stays active until period end); renewal failure (sets
grace_period_ends_at, status → grace_period); grace period resolution (payment updated →
active, or grace period expires → expired); period end passes while cancelled (→ expired).

**Soft delete:** Not soft-deleted. Expired/cancelled subscriptions are retained for billing
history.

**Entitlement:** `status`, `current_period_end`, and `grace_period_ends_at` are the key
fields for evaluating fan access to tier-gated content. Entitlement service reads these fields
at request time (see Section 6.8).

**Billing:** Central record for recurring billing lifecycle. `gateway_subscription_id` is the
reference for gateway webhook events.

---

### Entity 9 — Post

**Purpose:** A creator's content item. Supports multiple access levels and a dual-status model
(publish status + moderation status).

**Owned by:** Feed / Content module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `creator_profile_id` | UUID (FK → CreatorProfile) | Owning creator |
| `title` | string | Post title |
| `content` | JSON (nullable) | Rich text content (e.g., Tiptap/ProseMirror JSON). Nullable for file-only posts. |
| `publish_status` | enum | Creator-controlled publish state |
| `moderation_status` | enum | Admin-controlled moderation state |
| `access_level` | enum | Content access gate type |
| `required_tier_id` | UUID (nullable, FK → MembershipPlan) | Required when access_level = tier_gated |
| `price_try` | integer (nullable) | Price in kuruş. Required when access_level = premium; must be > 0. |
| `published_at` | timestamp (nullable) | When post became publicly visible |
| `scheduled_at` | timestamp (nullable) | Future publish time when publish_status = scheduled |
| `flagged_at` | timestamp (nullable) | Set when moderation_status → flagged |
| `removed_at` | timestamp (nullable) | Set when moderation_status → removed |
| `moderation_note` | text (nullable) | Admin-only note. Never returned to creator or fans. |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Enums:**
- `publish_status`: `draft`, `published`, `scheduled`, `archived`
- `moderation_status`: `clean`, `flagged`, `removed`
- `access_level`: `public`, `member_only`, `tier_gated`, `premium`

**Required relationships:** Many-to-one with CreatorProfile; one-to-many with PostAttachments;
many PostPurchases (via Order) if access_level = premium; reference from CollectionItems.

**Creation trigger:** Creator creates a post (Family 10, `/dashboard/gonderiler/yeni`).

**Update triggers:** Creator edits content; creator changes publish_status (e.g., draft →
published); access level change; admin flags or removes post.

**Soft delete:** `publish_status = archived` is the creator-side soft delete.
`moderation_status = removed` is the admin-side removal. Neither deletes the record.

**Visibility:** Compound rule: `moderation_status = removed` → not visible to anyone.
`CreatorProfile.status = suspended` → not visible to anyone. Otherwise:
`publish_status = published` required for public visibility; then `access_level` determines
which roles can see full content vs. a paywall prompt.

**Entitlement:** `access_level`, `required_tier_id`, and `price_try` are the fields evaluated
by the entitlement service to determine if a specific fan can access full content.

**Moderation:** Dual status fields are critical. `moderation_note` is admin-only and must
never be included in fan-facing or creator-facing API responses.

---

### Entity 10 — PostAttachment

**Purpose:** A file attached to a post. Served via authenticated signed URLs to entitled
users.

**Owned by:** Content / Storage module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `post_id` | UUID (FK → Post) | Owning post |
| `storage_key` | string | Object storage path/key. Never exposed directly to frontend. |
| `original_filename` | string | Display name for the download |
| `file_size_bytes` | bigint | File size for display |
| `content_type` | string | MIME type |
| `is_downloadable` | boolean (default true) | Whether entitled users can download vs. view only |
| `sort_order` | integer | Order in post's attachment list |
| `created_at` | timestamp | |

**Creation trigger:** File upload during post creation or edit.

**Update triggers:** Minimal. Filename or downloadable flag may be updated.

**Visibility:** `storage_key` never exposed to frontend. Frontend receives a signed,
time-limited URL generated on demand. Signed URL generation requires entitlement check first.

---

### Entity 11 — PostPurchase

**Purpose:** Entitlement record for premium post one-time purchases.

**Owned by:** Purchase / Entitlement module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `fan_user_id` | UUID (FK → User) | Purchasing fan |
| `post_id` | UUID (FK → Post) | Purchased post |
| `order_id` | UUID (FK → Order) | Associated order record |
| `amount_paid_try` | integer | Amount paid in kuruş at time of purchase |
| `purchased_at` | timestamp | |
| `access_revoked_at` | timestamp (nullable) | For D1 Option A (revoke on unpublish). Null = access still valid. |

**Creation trigger:** Successful premium post checkout.

**Update triggers:** `access_revoked_at` set if/when D1 is resolved as Option A.

**Entitlement:** Entitlement service checks this record exists and `access_revoked_at IS NULL`
before granting download access.

---

### Entity 12 — Product

**Purpose:** A creator's digital product (PDF, ZIP, audio, design file, prompt pack, etc.).

**Owned by:** Shop / Content module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key. Used in checkout URL: `/checkout/urun/[product-id]` |
| `creator_profile_id` | UUID (FK → CreatorProfile) | Owning creator |
| `title` | string | Product title |
| `description` | text | Product description |
| `price_try` | integer | Price in kuruş; must be > 0 |
| `currency` | string (default 'TRY') | |
| `publish_status` | enum | Creator-controlled |
| `moderation_status` | enum | Admin-controlled |
| `file_storage_key` | string | Object storage path for the deliverable file. Never exposed raw. |
| `preview_file_storage_key` | string (nullable) | Optional sample/preview file |
| `original_filename` | string | Display name |
| `file_size_bytes` | bigint | |
| `content_type` | string | MIME type |
| `flagged_at` | timestamp (nullable) | |
| `removed_at` | timestamp (nullable) | |
| `moderation_note` | text (nullable) | Admin-only |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Enums:**
- `publish_status`: `draft`, `published`, `archived`
- `moderation_status`: `clean`, `flagged`, `removed`

**Required relationships:** Many-to-one with CreatorProfile; one-to-many with
ProductPurchases; reference from CollectionItems.

**Creation trigger:** Creator creates a product (Family 12, `/dashboard/magaza/yeni`).

**Update triggers:** Creator edits metadata or file; creator publishes/unpublishes; admin
flags/removes.

**Visibility / Moderation:** Same dual-status logic as Post.

**Entitlement:** ProductPurchase record is the access grant. `moderation_status = removed`
overrides all purchase records.

---

### Entity 13 — ProductPurchase

**Purpose:** Entitlement record for a fan's one-time digital product purchase.

**Owned by:** Purchase / Entitlement module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `fan_user_id` | UUID (FK → User) | Purchasing fan |
| `product_id` | UUID (FK → Product) | Purchased product |
| `order_id` | UUID (FK → Order) | Associated order |
| `amount_paid_try` | integer | Amount paid in kuruş at time of purchase |
| `purchased_at` | timestamp | |
| `access_revoked_at` | timestamp (nullable) | For D1 Option A |

**Creation trigger:** Successful product checkout (Family 17).

**Entitlement:** Entitlement service checks this record exists with `access_revoked_at IS NULL`
before generating a signed download URL.

---

### Entity 14 — Collection

**Purpose:** A curated bundle of content items. Supports two access types: purchasable
one-time, or gated behind a membership tier.

**Owned by:** Collections / Content module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key. Used in checkout URL: `/checkout/koleksiyon/[collection-id]` |
| `creator_profile_id` | UUID (FK → CreatorProfile) | |
| `title` | string | |
| `description` | text | |
| `access_type` | enum | `purchase` \| `tier_gated` |
| `price_try` | integer (nullable) | Required when access_type = purchase |
| `required_tier_id` | UUID (nullable, FK → MembershipPlan) | Required when access_type = tier_gated |
| `publish_status` | enum | `draft` \| `published` \| `archived` |
| `moderation_status` | enum | `clean` \| `flagged` \| `removed` |
| `item_count` | integer (denormalized) | Cached count for display; updated on CollectionItem add/remove |
| `flagged_at` | timestamp (nullable) | |
| `removed_at` | timestamp (nullable) | |
| `moderation_note` | text (nullable) | Admin-only |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Enums:**
- `access_type`: `purchase`, `tier_gated`
- `publish_status`: `draft`, `published`, `archived`
- `moderation_status`: `clean`, `flagged`, `removed`

**Constraint:** A `tier_gated` collection must always reference a currently `published`
MembershipPlan. If the referenced tier is deleted or archived, the collection must be moved to
`draft` or updated. The collections module enforces this before tier deletion is permitted.

**Required relationships:** Many-to-one with CreatorProfile; one-to-many with CollectionItems;
one-to-many with CollectionPurchases; optional FK to MembershipPlan.

**Creation trigger:** Creator creates a collection (Family 12).

---

### Entity 15 — CollectionItem

**Purpose:** A content item within a collection. Items are posts or products.

**Owned by:** Collections module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `collection_id` | UUID (FK → Collection) | Owning collection |
| `item_type` | enum | `post` \| `product` |
| `item_id` | UUID | Polymorphic reference to Post.id or Product.id |
| `sort_order` | integer | Display order within the collection |
| `created_at` | timestamp | |

**Creation trigger:** Creator adds a content item to a collection.

**Update triggers:** Creator reorders items.

**Notes:** Polymorphic `item_id` references either Post or Product. Query logic must resolve
item_type before fetching the referenced record. The referenced item's own `publish_status`
and `moderation_status` apply independently.

---

### Entity 16 — CollectionPurchase

**Purpose:** Entitlement record for a fan's one-time collection purchase (purchase-type
collections only).

**Owned by:** Purchase / Entitlement module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `fan_user_id` | UUID (FK → User) | |
| `collection_id` | UUID (FK → Collection) | |
| `order_id` | UUID (FK → Order) | |
| `amount_paid_try` | integer | |
| `purchased_at` | timestamp | |
| `access_revoked_at` | timestamp (nullable) | For D1 |

**Creation trigger:** Successful collection checkout (Family 18).

**Entitlement:** Fan has access if CollectionPurchase exists with `access_revoked_at IS NULL`
(purchase-type), OR if fan has an active MembershipSubscription at or above
`collection.required_tier_id` (for tier_gated collections).

---

### Entity 17 — Notification

**Purpose:** In-app notification for fans and creators. Supports all notification event types
surfaced in Family 15.

**Owned by:** Notification module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `recipient_user_id` | UUID (FK → User) | Target user |
| `notification_type` | enum | Event type key |
| `title` | string | Notification headline |
| `body` | text | Notification body text |
| `action_url` | string (nullable) | In-app link (relative URL). Null for informational notifications. |
| `read_at` | timestamp (nullable) | Null = unread |
| `actor_user_id` | UUID (nullable, FK → User) | Who triggered the event (e.g., creator who published a post) |
| `metadata` | JSON (nullable) | Additional context (e.g., post_id, creator_id, tier_name) |
| `created_at` | timestamp | |

**Minimum `notification_type` enum values:**
`new_post_published`, `new_product_published`, `membership_renewal_success`,
`membership_renewal_failed`, `membership_cancelled_confirmed`, `membership_expired`,
`creator_application_approved`, `creator_application_rejected`, `admin_broadcast`,
`order_confirmed`

**Required relationships:** Many-to-one with User (recipient); optional many-to-one with User
(actor).

**Creation trigger:** Platform event — new post published, renewal processed, order confirmed,
admin action on creator application, admin broadcast.

**Update triggers:** `read_at` set when user marks notification as read.

**Soft delete:** Not soft-deleted. Notifications may be paginated/truncated after a retention
period (infrastructure concern).

**Visibility:** Strictly scoped to `recipient_user_id`. No user can read another user's
notifications.

---

### Entity 18 — Report

**Purpose:** A user-submitted content or account report. Entry point for the moderation queue
(Family 21).

**Owned by:** Moderation / Trust module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `reporter_user_id` | UUID (FK → User) | User who submitted the report |
| `target_type` | enum | What is being reported |
| `target_id` | UUID | ID of the reported object (polymorphic) |
| `reason_code` | string | Selected reason from taxonomy (taxonomy TBD — see Section 8, D7) |
| `details` | text (nullable) | Reporter's optional additional explanation |
| `status` | enum | Report lifecycle status |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Enums:**
- `target_type`: `post`, `product`, `collection`, `user`, `creator_profile`
- `status`: `open`, `under_review`, `actioned`, `dismissed`

**Required relationships:** Many-to-one with User (reporter); polymorphic reference to target;
one-to-many with ModerationActions.

**Creation trigger:** User submits a report from a content page.

**Update triggers:** Status changes as admin actions the report.

**Visibility:** Visible to admin only (in Family 21 queue). Reporter may see their own
submitted reports in a future self-service view (post-launch).

**Moderation:** ModerationAction records reference this Report when the action is triggered
from a report.

---

### Entity 19 — ModerationAction

**Purpose:** An immutable record of every admin moderation action. Audit trail for content
and account decisions.

**Owned by:** Moderation / Admin module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `admin_user_id` | UUID (FK → User) | Admin who performed the action |
| `report_id` | UUID (nullable, FK → Report) | Source report, if action was triggered from a report |
| `target_type` | enum | What is being actioned |
| `target_id` | UUID | Polymorphic ID of the actioned object |
| `action_type` | enum | The action taken |
| `admin_note` | text (nullable) | Admin-only note. Never returned to fans or the target user. |
| `created_at` | timestamp | Immutable. Never updated. |

**Enums:**
- `target_type`: `post`, `product`, `collection`, `user`, `creator_profile`
- `action_type`: `warn_user`, `restrict_creator`, `remove_content`, `dismiss_report`, `approve_creator`, `reject_creator`, `suspend_creator`

**Required relationships:** Many-to-one with User (admin); optional many-to-one with Report;
polymorphic target reference.

**Creation trigger:** Admin performs any action in Family 20 or Family 21. One record per
action.

**Update triggers:** None — append-only, immutable.

**Visibility:** Admin-only. `admin_note` must never be returned in any fan-facing or
creator-facing API response.

**Moderation:** This entity IS the audit trail for admin moderation decisions. It doubles as
the AdminActionLog requirement from the permission matrix.

---

### Entity 20 — LegalDocumentVersion

**Purpose:** A versioned record of each legal document. Enables consent records to reference
the specific version accepted.

**Owned by:** Legal / Platform module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `document_type` | enum | Which legal document |
| `version_identifier` | string | Human-readable version (e.g., "2026-03-01"). Displayed as "Son güncelleme" on legal pages. |
| `effective_date` | date | When this version took effect |
| `is_current` | boolean | Whether this is the live version. Only one per document_type can be current. |
| `created_at` | timestamp | |

**Enums:** `document_type`: `terms_of_service`, `privacy_policy`, `creator_agreement`

**Required relationships:** One-to-many with ConsentRecords.

**Creation trigger:** Legal team publishes a new version of a legal document.

**Update triggers:** `is_current` toggled when a new version replaces the current one.

**Notes:** Content authority is the legal team. This entity stores versioning metadata; the
actual text is hosted separately (CMS or static file — infrastructure decision).

---

### Entity 21 — ConsentRecord

**Purpose:** Immutable record of a user's acceptance of a specific legal document version.
Required for KVKK compliance and general legal auditability.

**Owned by:** Legal / Auth module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID (FK → User) | User who consented |
| `document_type` | enum | Which document was accepted |
| `legal_document_version_id` | UUID (FK → LegalDocumentVersion) | The specific version accepted |
| `consented_at` | timestamp | When acceptance was recorded |
| `consent_method` | enum | Where consent was given |
| `ip_address` | string (nullable) | Client IP at time of consent (KVKK audit) |
| `created_at` | timestamp | Immutable |

**Enums:**
- `document_type`: `terms_of_service`, `privacy_policy`, `creator_agreement`
- `consent_method`: `fan_signup_email`, `fan_signup_google`, `creator_signup_email`, `creator_signup_google`, `onboarding_agreement_step`

**Required relationships:** Many-to-one with User; many-to-one with LegalDocumentVersion.

**Creation trigger:**
- Terms + Privacy: fan signup (Family 4) or creator signup (Family 5)
- Creator Agreement: onboarding step 5 (Family 7)

**Update triggers:** None — append-only. If legal documents update and re-acceptance is
required, new ConsentRecords are created; old records are not modified.

---

### Entity 22 — BillingCustomer

**Purpose:** Links a User account to the payment gateway's customer record. One per user who
transacts.

**Owned by:** Billing module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID (FK → User, unique) | 1:1 — one billing customer per user |
| `gateway_customer_id` | string | Payment gateway's customer identifier |
| `gateway_provider` | string | Gateway name (e.g., "iyzico", "param" — specific provider TBD) |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Creation trigger:** First checkout attempt by a user (created on demand, not at
registration).

**Visibility:** Internal billing module only. `gateway_customer_id` is used only for API
calls to the gateway.

---

### Entity 23 — PaymentMethodSummary

**Purpose:** Display-only record of a fan's saved payment method. Never stores raw card data.

**Owned by:** Billing module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `billing_customer_id` | UUID (FK → BillingCustomer) | |
| `gateway_payment_method_id` | string | Gateway's internal reference for API calls |
| `card_brand` | string | e.g., "Visa", "Mastercard", "Troy" |
| `last_four` | string (4 chars) | Last four digits of card number |
| `expiry_month` | integer (1–12) | |
| `expiry_year` | integer | 4-digit year |
| `is_default` | boolean | Whether this is the active payment method |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

**Notes:** This entity powers the display in Family 14 (billing page: card type + last 4 +
expiry). Raw card data lives in the gateway. `gateway_payment_method_id` is an internal
reference used for gateway API calls only — not exposed to the fan.

**Creation trigger:** Fan saves a payment method at checkout or via billing page payment
method update.

---

### Entity 24 — Order

**Purpose:** A single transaction record for any checkout event (membership, product,
collection, or premium post).

**Owned by:** Billing / Order module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key. Used in `/checkout/onay/[order-id]` and `/checkout/hata/[order-id]` |
| `fan_user_id` | UUID (FK → User) | Fan who placed the order |
| `order_type` | enum | What was purchased |
| `status` | enum | Order lifecycle status |
| `amount_try` | integer | Total amount in kuruş |
| `currency` | string (default 'TRY') | |
| `gateway_transaction_id` | string (nullable) | Gateway's transaction reference. Set on payment attempt. |
| `reference_id` | UUID | ID of the purchased entity (membership_plan_id, product_id, collection_id, or post_id) |
| `created_at` | timestamp | |
| `completed_at` | timestamp (nullable) | Set when status → completed |

**Enums:**
- `order_type`: `membership_checkout`, `product_purchase`, `collection_purchase`, `premium_post_purchase`
- `status`: `pending`, `completed`, `failed`, `refunded`

**Required relationships:** Many-to-one with User (fan); one-to-one with
MembershipSubscription (for membership orders), ProductPurchase, PostPurchase, or
CollectionPurchase depending on order_type.

**Creation trigger:** Fan initiates checkout (any of Families 16, 17, 18, or premium post
purchase). Created with `status = pending`.

**Update triggers:** Payment gateway webhook → `status = completed` or `status = failed`.

**Notes:** The confirmation and error pages require that `order.fan_user_id` matches the
authenticated fan's user ID. For membership checkouts: if `status = failed`, no
MembershipSubscription record is created (see Section 4.5).

---

### Entity 25 — Invoice

**Purpose:** Billing history record for a charge or refund event. Powers the fan billing
history view (Family 14).

**Owned by:** Billing module.

**Key fields:**

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `fan_user_id` | UUID (FK → User) | Fan who was charged |
| `membership_subscription_id` | UUID (nullable, FK → MembershipSubscription) | Set for recurring subscription charges |
| `order_id` | UUID (nullable, FK → Order) | Set for one-time purchases |
| `invoice_type` | enum | Type of billing event |
| `amount_try` | integer | Charge amount in kuruş (positive) or refund (negative or separate record) |
| `currency` | string (default 'TRY') | |
| `status` | enum | Whether payment succeeded |
| `gateway_invoice_id` | string (nullable) | Gateway's invoice/charge reference |
| `issued_at` | timestamp | When the charge was attempted |
| `paid_at` | timestamp (nullable) | When payment was confirmed |
| `created_at` | timestamp | |

**Enums:**
- `invoice_type`: `subscription_charge`, `subscription_renewal`, `one_time_purchase`, `refund`
  - `one_time_purchase` covers all three one-time transaction types: product purchase, collection purchase, and premium post purchase. If per-type distinction is needed for reporting, `order_type` on the referenced Order record provides it.
- `status`: `paid`, `failed`, `refunded`

**Creation trigger:** Every billing event (initial subscription charge, renewal, one-time
purchase, refund) creates an Invoice record. Triggered by gateway webhooks.

**Visibility:** Fan can view their own invoices in Family 14. Creator can view aggregate
revenue but not fan-level invoice detail. Admin billing operations are deferred.

---

## 4. State Models

### 4.1 Creator Account State Machine

```
[onboarding]     ---(onboarding complete, submitted)---> [pending_review]
[pending_review] ---(admin approves)-------------------> [approved]
[pending_review] ---(admin rejects)--------------------> [rejected]
[rejected]       ---(creator resubmits)----------------> [pending_review]
[approved]       ---(admin suspends)-------------------> [suspended]
[suspended]      ---(admin reinstates — post-launch)---> [approved]
```

Stored in: `CreatorProfile.status`

Governed by: Admin actions (Families 20, 21); onboarding submission (Family 7).

Pre-approval state visibility: Creator content is not publicly visible in any pre-approval
state. The `/@[username]` public page is not rendered until `status = approved`. The creator
accesses their own drafts and dashboard content only via authenticated dashboard routes.

---

### 4.2 Post Publish State Machine (Creator-Controlled)

```
[draft]     ---(creator publishes)-----------> [published]
[draft]     ---(creator schedules)-----------> [scheduled]
[scheduled] ---(scheduled time passes)-------> [published]
[published] ---(creator unpublishes)---------> [draft]
[published] ---(creator archives)------------> [archived]
[draft]     ---(creator archives)------------> [archived]
```

---

### 4.3 Post Moderation State Machine (Admin-Controlled, Independent)

```
[clean]   ---(admin flags)------> [flagged]
[flagged] ---(admin removes)----> [removed]
[flagged] ---(admin clears)-----> [clean]
[clean]   ---(admin removes)----> [removed]
```

`removed` is a terminal state at MVP — no undo mechanism in the admin UI.

**Compound visibility rule:**
- `moderation_status = removed` → not visible to anyone, regardless of publish_status
- `publish_status = draft` or `scheduled` → not visible on `/@[username]`, regardless of moderation_status
- `CreatorProfile.status = suspended` → all posts not visible to public, regardless of either status

---

### 4.4 Product State Machine

**Publish status (creator-controlled):**
```
[draft]     ---(creator publishes)-----------> [published]
[published] ---(creator unpublishes)---------> [draft]
[published] ---(creator archives)------------> [archived]
[draft]     ---(creator archives)------------> [archived]
```

**Moderation status (admin-controlled):** Same as §4.3.

**Note:** Product unpublish access policy for prior purchasers is open decision D1 (see
Section 8). The state machine itself is not affected — `ProductPurchase.access_revoked_at`
handles the policy outcome.

---

### 4.5 Membership Subscription State Machine

```
[pending]      ---(payment confirmed via gateway webhook)----> [active]
[active]       ---(fan cancels)----------------------------> [cancelled]
[active]       ---(renewal payment fails)------------------> [grace_period]
[cancelled]    ---(period end date passes)-----------------> [expired]
[grace_period] ---(payment method updated + retry succeeds)-> [active]
[grace_period] ---(grace period expires without resolution)-> [expired]
[expired]      ---(fan re-subscribes)---------------------> [active] (new subscription record)
```

**Initial payment failure:** If the initial checkout payment fails, `Order.status → failed`.
No MembershipSubscription record is created (or a `pending` record is cleaned up if one was
created optimistically). The subscription state machine begins only after payment is confirmed.
`failed` is not a valid `MembershipSubscription.status` — payment failure at initial checkout
is tracked exclusively on the Order entity.

Stored in: `MembershipSubscription.status`

Governed by: Gateway webhook events (pending → active, active → grace_period, grace
resolution); fan action via cancellation flow (active → cancelled); billing period end
(cancelled → expired); grace period expiry (grace_period → expired).

**Entitlement evaluation:**
- Fan has tier access if: `status = active` OR `status = cancelled AND current_period_end > now()` OR `status = grace_period AND grace_period_ends_at > now()`
- Fan does NOT have tier access if: `status = expired` OR `status = pending`

---

### 4.6 Order State Machine

```
[pending]   ---(gateway payment success)---> [completed]
[pending]   ---(gateway payment failure)---> [failed]
[completed] ---(refund processed)----------> [refunded]
```

Stored in: `Order.status`

---

### 4.7 Report State Machine

```
[open]         ---(admin opens for review)-----> [under_review]
[open]         ---(admin actions directly)------> [actioned]
[under_review] ---(admin actions)--------------> [actioned]
[under_review] ---(admin dismisses)-------------> [dismissed]
[open]         ---(admin dismisses)-------------> [dismissed]
```

Stored in: `Report.status`

Each transition that results in an action creates a ModerationAction record.

---

### 4.8 Collection State Machine

Same dual-status model as Post:
- `publish_status`: `draft`, `published`, `archived`
- `moderation_status`: `clean`, `flagged`, `removed`

**Additional constraint:** A tier_gated collection in `published` state requires its
`required_tier_id` to reference a MembershipPlan with `status = published`. If the referenced
tier is archived, the collection must be moved to `draft` before the tier can be archived.
The collections module enforces this ordering.

---

## 5. Relationship Model

### 5.1 User ↔ CreatorProfile

One User has zero or one CreatorProfile (FK on CreatorProfile.user_id). CreatorProfile
existence implies the user has a creator role. User retains `has_fan_role = true` regardless
of creator status changes.

### 5.2 CreatorProfile ↔ MembershipPlans

One CreatorProfile has zero to many MembershipPlans. Each MembershipPlan belongs to exactly
one CreatorProfile. Creator cannot archive a plan while it has active subscribers.

### 5.3 CreatorProfile ↔ Posts

One CreatorProfile has zero to many Posts. Each Post belongs to exactly one CreatorProfile.
`Post.required_tier_id` must reference a MembershipPlan owned by the same creator.

### 5.4 CreatorProfile ↔ Products

One CreatorProfile has zero to many Products. Each Product belongs to exactly one
CreatorProfile.

### 5.5 CreatorProfile ↔ Collections

One CreatorProfile has zero to many Collections. Each Collection belongs to exactly one
CreatorProfile. A tier_gated Collection references one MembershipPlan owned by the same
creator.

### 5.6 Collection ↔ CollectionItems

One Collection has zero to many CollectionItems. Each CollectionItem has an `item_type` +
`item_id` pointing to either a Post or Product. The referenced Post or Product must belong
to the same CreatorProfile as the Collection.

### 5.7 User (Fan) ↔ MembershipSubscriptions

One User may have many MembershipSubscriptions (to different creators). Each
MembershipSubscription references one MembershipPlan and one fan User. A fan may not have
more than one active subscription to the same tier at any time.

### 5.8 User (Fan) ↔ Purchases

One User may have many ProductPurchases, CollectionPurchases, and PostPurchases.
Each purchase record references one purchased entity and one Order. Duplicate purchase
protection is checked before Order creation at checkout.

### 5.9 Fan ↔ Library Access (Derived View)

The fan library (Family 13) is not a stored entity — it is a runtime query combining:
- Active + cancelled (within period) + grace MembershipSubscriptions → tier-gated content access
- ProductPurchases with `access_revoked_at IS NULL` → purchased product access
- CollectionPurchases with `access_revoked_at IS NULL` → purchased collection access
- MembershipSubscriptions qualifying for tier_gated collections → collection access via tier
- PostPurchases with `access_revoked_at IS NULL` → purchased premium post access

### 5.10 Report ↔ Target Object

One Report has one polymorphic target (target_type + target_id). Target types: Post, Product,
Collection, User, CreatorProfile. The referenced entity's existence is checked but no FK
enforcement — the entity may be removed after a report is filed.

### 5.11 ModerationAction ↔ Target Object

Same polymorphic reference as Report. One Report may have zero to many ModerationActions.
ModerationActions may also exist without a Report (admin-initiated outside the report queue).

### 5.12 LegalDocumentVersion ↔ ConsentRecord

One LegalDocumentVersion has zero to many ConsentRecords (one per user per acceptance event).
Each ConsentRecord references exactly one LegalDocumentVersion. When a user must re-accept,
a new ConsentRecord is created; the old one is retained.

---

## 6. Entitlement-Relevant Data Rules

### 6.1 Public Post Access

- **Gate:** `Post.access_level = 'public'`
- **Fields read:** `Post.publish_status`, `Post.moderation_status`, `CreatorProfile.status`
- **Access granted when:** All of:
  - `CreatorProfile.status = 'approved'`
  - `Post.publish_status = 'published'`
  - `Post.moderation_status != 'removed'`
- **No entitlement record needed**

### 6.2 Member-Only Post Access

- **Gate:** `Post.access_level = 'member_only'`
- **Fields read:** Same as §6.1 plus MembershipSubscription
- **Access granted when:** Fan has a qualifying MembershipSubscription for this creator:
  - `MembershipSubscription.creator_profile_id = Post.creator_profile_id`
  - `MembershipSubscription.status IN ('active', 'cancelled', 'grace_period')`
  - If `status = 'cancelled'`: `current_period_end > NOW()`
  - If `status = 'grace_period'`: `grace_period_ends_at > NOW()`
- **Email verification required:** `User.email_verified_at IS NOT NULL`

### 6.3 Tier-Gated Post Access

- **Gate:** `Post.access_level = 'tier_gated'`
- **Fields read:** Same as §6.2 plus `Post.required_tier_id` and `MembershipPlan.tier_rank`
- **Access granted when:** Fan has a qualifying subscription (§6.2 criteria) AND:
  - At MVP default: `MembershipSubscription.membership_plan_id = Post.required_tier_id`
  - Future option (D2): fan's subscribed `tier_rank >= Post's required tier_rank`

### 6.4 Premium Post Access

- **Gate:** `Post.access_level = 'premium'`
- **Fields read:** `PostPurchase`
- **Access granted when:** PostPurchase exists where `fan_user_id = current_user` AND
  `post_id = Post.id` AND `access_revoked_at IS NULL`

### 6.5 Product Download Access

- **Fields read:** `ProductPurchase`
- **Access granted when:** ProductPurchase exists where `fan_user_id = current_user` AND
  `product_id = Product.id` AND `access_revoked_at IS NULL`
- **Storage layer then generates a signed URL** — `Product.file_storage_key` is never
  exposed raw to the frontend

### 6.6 Collection Access — Purchase Type

- **Fields read:** `CollectionPurchase`
- **Access granted when:** CollectionPurchase exists where `fan_user_id = current_user` AND
  `collection_id = Collection.id` AND `access_revoked_at IS NULL`

### 6.7 Collection Access — Tier-Gated Type

- **Fields read:** `MembershipSubscription`, `Collection.required_tier_id`
- **Access granted when:** Fan has a qualifying subscription (§6.3 criteria) where
  `membership_plan_id = Collection.required_tier_id`

### 6.8 Cancellation / Grace Period Entitlement Logic

Entitlement service subscription validity check (applies to §6.2, §6.3, §6.7):

```
is_entitled(subscription) =
  subscription.status = 'active'
  OR (subscription.status = 'cancelled' AND subscription.current_period_end > NOW())
  OR (subscription.status = 'grace_period' AND subscription.grace_period_ends_at > NOW())
```

### 6.9 Admin Restriction Override

`Post.moderation_status = 'removed'`, `Product.moderation_status = 'removed'`, or
`Collection.moderation_status = 'removed'` → access denied to all roles regardless of
entitlement. `CreatorProfile.status = 'suspended'` → all of that creator's content denied
to all roles. These checks are evaluated before any entitlement check.

### 6.10 Creator Unpublish Policy (Decision D1 — Unresolved)

The `access_revoked_at` field on PostPurchase, ProductPurchase, and CollectionPurchase exists
to accommodate both policy options:

- **Option A (revoke on unpublish):** Set `access_revoked_at = NOW()` when creator
  unpublishes. Entitlement check `access_revoked_at IS NULL` denies access.
- **Option B (retain for prior purchasers):** Never set `access_revoked_at` for unpublish
  events. Only moderation removal sets it. Prior purchasers retain access.

Do not implement a default until D1 is resolved.

---

## 7. Deferred / Out of Scope Data

The following entities and areas are outside Phase 1 scope. They must not be modeled in the
functional sections of this document.

| Entity / Area | Why Deferred | Notes |
|---|---|---|
| ChatMessage | Chat excluded from Phase 1 launch | All 1:1 and group chat routes deferred |
| ChatRoom | Chat excluded | — |
| ChatRoomMembership | Chat excluded | — |
| LivestreamSession | Excluded from Phase 1 entirely | No livestream feature |
| AffiliateLink / ReferralRecord | Excluded from Phase 1 | No affiliate program |
| SponsorshipDeal | Excluded from Phase 1 | No brand sponsorship marketplace |
| AnalyticsEventWarehouse schema | Post-launch | Foundation events logged; warehouse design is post-launch |
| AdvancedPayoutOperation | Deferred | IBAN captured; payout operation detail UI is post-launch |
| CreatorEarningsStatement | Deferred | Dashboard shows period summaries; detailed payout statements are post-launch |
| AuditLogUI entity | Post-launch | ModerationAction handles audit trail data; audit log UI (`/admin/denetim-gunlugu`) is deferred |
| UserSetting / NotificationPreference | Post-launch | `/account/ayarlar/bildirimler` deferred |
| PrivacyPreference | Post-launch | `/account/ayarlar/gizlilik` deferred |
| DisputeRecord | Post-launch admin billing ops | `/admin/fatura/anlasmazliklar` deferred |
| CopyrightClaim | Post-launch | Email-based DMCA at MVP |
| AdminBillingOperation | Post-launch | Gateway handles disputes at launch |
| MobileDeviceToken (push notifications) | Web-only in Phase 1 | Browser push only; native device tokens not needed |
| PhysicalProduct / InventoryItem | Excluded | No physical goods marketplace |
| CommunityRoom / GroupMembership | Deferred with chat | No community rooms at launch |
| CreatorAudienceMember (dashboard kitle) | Post-launch | `/dashboard/kitle` deferred |

---

## 8. Assumptions / Open Decisions

| # | Decision | Impact |
|---|---|---|
| D1 | Product/collection/post unpublish policy for prior purchasers (Option A: revoke on unpublish vs. Option B: retain for prior purchasers) | `access_revoked_at` field accommodates both; logic not implemented until resolved |
| D2 | Tier-gated access model: exact match or higher-tier-includes-lower | `MembershipPlan.tier_rank` field supports both; query logic deferred to resolution |
| D3 | Grace period duration (days) for renewal failure | Affects `grace_period_ends_at` computation; duration is billing module config |
| D4 | ~~Specific payment gateway provider~~ **Resolved 2026-03-27 — iyzico. `BillingCustomer.gateway_provider = 'iyzico'`. Native recurring subscriptions; gateway manages renewal scheduling. Webhook handler written to iyzico event format.** | — |
| D5 | Retention offer logic on cancellation | No additional entity needed; offer content is a billing/product config, not a data model change |
| D6 | Re-acceptance behavior when a legal document is updated | New ConsentRecord per re-acceptance event; re-acceptance trigger logic is a product/legal decision |
| D7 | Report reason taxonomy final labels | `Report.reason_code` is a string; taxonomy finalization adds enum values without schema change |
| D8 | Whether a creator can subscribe to their own tiers | Business-rule enforcement at checkout; no data model change needed |
| D9 | Annual cancellation KVKK/consumer rights implications | No data model change; legal review governs policy, not schema |
| D10 | ~~Platform fee percentage~~ **Resolved 2026-03-27 — 10% of gross. Config value `PLATFORM_FEE_PERCENT = 0.10`. Fee split computed at reporting time; not stored in `Invoice` entity fields. No schema change required.** | — |
| D11 | Admin account identity model (separate User records vs. role elevation) | Affects `User.is_admin` flag vs. separate admin identity table; infrastructure decision |

---

## 9. Validation Checklist

- [ ] All data required by the 24 approved page families is covered by at least one entity
- [ ] Entity fields align with `permission-matrix.md` role and state definitions
- [ ] No out-of-scope systems (chat, livestream, mobile, physical products, affiliates) are
  modeled in functional sections
- [ ] No schema migration code, ORM code, or API code was produced
- [ ] Dual-status model (`publish_status` + `moderation_status`) is applied consistently to
  Post, Product, and Collection
- [ ] Entitlement purchase records (PostPurchase, ProductPurchase, CollectionPurchase) are
  defined with `access_revoked_at` to accommodate D1 without a default implementation
- [ ] Billing state and entitlement state are separate: `MembershipSubscription.status`
  drives billing lifecycle; entitlement is evaluated at read-time from that state
- [ ] ModerationAction is append-only, admin-only note, never surfaced to target — doubles as
  AdminActionLog
- [ ] ConsentRecord covers all three legal documents with version references
- [ ] PaymentMethodSummary contains only display data — no raw card data stored on platform
- [ ] IBAN stored encrypted in CreatorApplication — never returned to frontend in full
- [ ] `Order.order_type` includes `premium_post_purchase`; `failed` is not a valid
  `MembershipSubscription.status`
- [ ] 25 entities total documented in Section 3
