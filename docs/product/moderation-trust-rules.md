# Moderation and Trust Rules — lalabits.art Phase 1

> **Status:** Approved
> **Version:** v1.0
> **Scope:** Phase 1 MVP
> **Authority level:** Canonical
>
> **Authority files:** CLAUDE.md · page-requirements.md · permission-matrix.md ·
> data-model.md · api-surface.md · billing-lifecycle.md
>
> **Scope:** This document defines canonical Phase 1 trust, moderation, creator review,
> report handling, restriction, takedown, visibility, and admin-boundary rules.
> It does not contain policy-enforcement code, SQL, admin implementation code,
> or UI component specifications.

---

## 1. Document Purpose

This document defines the canonical Phase 1 moderation and trust rules for lalabits.art.
It is derived from:

- `data-model.md` — ModerationAction, Report, CreatorApplication, CreatorProfile, User
  entities; moderation state machines (§4.5–§4.6); entitlement rules (§6)
- `api-surface.md` — Families 20–21 (admin creator review, admin moderation/reports);
  cross-cutting visibility and authorization rules (§6)
- `permission-matrix.md` — Role definitions; visibility matrix; admin authority scope
- `page-requirements.md` — Families 20–21 page requirements; admin UX constraints;
  fan/creator-facing moderation state visibility
- `billing-lifecycle.md` — §2 Principle 7; §9.3 Admin Override Cases; §10 edge-case matrix

**Does not contain:**
- Policy-enforcement code or webhook handler code
- SQL, ORM, or schema definitions
- Admin UI component specifications or implementation code
- Legal definitions or formal terms of service language

**Is the basis for:**
- Backend moderation module implementation
- Admin creator review and moderation queue implementation
- Content visibility authorization layer implementation
- Notification event trigger mapping for moderation events
- Operational runbook for admin moderation team

---

## 2. Trust and Moderation Principles

Eight principles govern Phase 1 moderation and trust.

**1. Minimize harm with minimum viable operational complexity.** Phase 1 moderation is
human-reviewed, queue-driven, and synchronous. No automated content scoring, keyword
filtering, or AI moderation at launch. Admin judgment drives all decisions.

**2. Separate creator approval review from content moderation.** Creator application review
(Family 20) and content/account moderation (Family 21) are distinct workflows with distinct
queues, distinct action sets, and distinct audit trails. Creator review decisions do not flow
through the report queue.

**3. Separate moderation restriction from billing state.** `ModerationAction` is never an
input to billing calculations. `MembershipSubscription`, `ProductPurchase`,
`CollectionPurchase`, and `PostPurchase` records are not deleted or modified when moderation
removes content or suspends a creator. Billing records are retained; access is blocked at
runtime by the moderation authorization layer.

**4. Publish status and moderation status are always separate.** `publish_status` is
creator-controlled. `moderation_status` is admin-controlled. They are independent fields on
Post, Product, and Collection. Moderation status overrides publish status for all external
visibility decisions. A published post with `moderation_status = removed` is not visible to
any non-admin caller.

**5. Moderation decisions must be auditable even if audit-log UI is deferred.** Every admin
write operation — approve, reject, suspend, flag, remove, clear, restrict, warn, dismiss —
creates an immutable `ModerationAction` record in the same database transaction or the write
is rolled back. No admin action may succeed silently. The audit-log viewer UI (`/admin/
denetim-gunlugu`) is deferred; the audit logging infrastructure is not.

**6. Restricted or removed content behavior must be explicit.** `moderation_status = removed`
is an absolute visibility and entitlement override. `moderation_status = flagged` keeps
content visible by default at MVP (open decision M1). `CreatorProfile.status = suspended`
hides all of that creator's content to all non-admin callers. These rules are enforced
server-side before any entitlement check runs.

**7. Admin powers must stay bounded to approved Phase 1 scope.** Phase 1 admin authority
covers: creator application review and content/account moderation. Admin billing operations,
user management, DMCA claim processing, and audit log review are deferred. No admin page may
be added outside the two approved admin families without explicit scope extension.

**8. Do not over-design legal escalation workflows.** External law enforcement escalation,
formal DMCA response tooling, graduated multi-stage sanction frameworks, and appeals portals
are out of Phase 1 scope. Email-based DMCA handling and human admin judgment cover MVP
operational needs.

---

## 3. Scope Summary

**Moderation / trust surface in scope for Phase 1:**

| Surface | Entry Point | Notes |
|---|---|---|
| Creator application review | `/admin/yaraticilar/inceleme` (Family 20) | Approve / reject / suspend pending applications |
| Creator approval notification | Triggered by Family 20 admin action | Email to creator; in-app notification per Notifications module |
| Creator rejection notification | Triggered by Family 20 admin action | Email with optional rejection reason |
| Creator suspension notification | Triggered by Family 20 or Family 21 action | Email to creator |
| Report submission | `POST /reports` (any authenticated user) | Fan or creator submits report on content or account |
| Report review queue | `/admin/moderasyon/raporlar` (Family 21) | Admin reviews and triages open reports |
| Report detail | `/admin/moderasyon/raporlar/[report-id]` (Family 21) | Admin views full context and moderation history |
| Content flag | Admin action from Family 21 | Sets `moderation_status = flagged` on Post, Product, Collection |
| Flagged content queue | `/admin/moderasyon/icerik` (Family 21) | Admin reviews flagged content; Remove or Clear |
| Content removal | Admin action from Family 21 | Sets `moderation_status = removed`; creator notified |
| Flag clear | Admin action from Family 21 | Sets `moderation_status = clean`; content restored to visibility |
| Creator restriction | Admin action from Family 21 | Limits creator publishing; existing access rules open decision M2 |
| Creator suspension | Admin action from Family 20 or Family 21 | Hides all creator content; creator cannot publish |
| User warning | Admin action from Family 21 | Platform warning message; content remains live |
| Report dismiss | Admin action from Family 21 | No action on target; closes report |
| Visibility enforcement | Authorization layer (all content endpoints) | Dual-status check before any content read |
| Dual-status read guard | All content/product/collection API reads | `moderation_status` override evaluated before entitlement check |

**Moderation / trust areas explicitly out of scope for Phase 1:**

| Area | Notes |
|---|---|
| Chat moderation | Chat is not in Phase 1 launch scope |
| Livestream moderation | Livestream excluded per CLAUDE.md |
| Comment moderation | Comments not grounded in approved Phase 1 docs |
| Automated content scoring / AI moderation | Human-only review at MVP |
| Keyword/content filtering | Not designed for Phase 1 |
| Appeals portal | Deferred post-launch |
| DMCA / copyright claim workflow UI | Email-based at MVP; UI deferred |
| Admin billing operations | Deferred (billing-lifecycle.md §11) |
| User management list/detail UI | Deferred |
| Audit log viewer UI | Data captured; viewer deferred |
| Age verification flows | Not in Phase 1 scope |
| External law enforcement escalation | Out of scope |
| Bulk moderation operations | Out of scope |
| Admin billing dispute resolution | Gateway handles; no platform UI |

---

## 4. Moderation Subjects

The following objects can be reviewed, flagged, restricted, or removed in Phase 1. Comments
are NOT a moderation subject — comments are not grounded in approved Phase 1 docs and are
not in scope.

---

### 4.1 Post

| Attribute | Detail |
|---|---|
| What can go wrong | Harassment, spam, illegal content, copyright violation, misleading content in post body or attachments |
| Moderation states | `clean` / `flagged` / `removed` |
| Who can act | Admin only |
| Visibility impact (flagged) | Content remains visible to public/fans by default (open decision M1) |
| Visibility impact (removed) | `404` or `403 CONTENT_REMOVED` to all non-admin callers; creator sees read-only view |
| Entitlement impact | `removed` overrides all entitlement — gated or purchased access blocked regardless of subscription or purchase record |
| Billing impact | No change to billing records; purchase/subscription records retained |
| Creator-visible flag indicator | Creator can see flagged state on their own post in dashboard (read-only while flagged — open decision M3) |

---

### 4.2 Product

| Attribute | Detail |
|---|---|
| What can go wrong | Fraudulent digital product, illegal file content, misleading description, copyright violation |
| Moderation states | `clean` / `flagged` / `removed` |
| Who can act | Admin only |
| Visibility impact (flagged) | Product remains visible by default (open decision M1) |
| Visibility impact (removed) | `404`/`403` to all non-admin callers; signed URL requests return `403 CONTENT_REMOVED` |
| Entitlement impact | `removed` overrides `ProductPurchase.access_revoked_at IS NULL`; download access blocked |
| Billing impact | `ProductPurchase` records retained; no billing reversal at MVP |
| Creator-visible indicator | Creator sees removed product in dashboard as read-only |

---

### 4.3 Collection

| Attribute | Detail |
|---|---|
| What can go wrong | Collection contains removed items; collection description or metadata is violating |
| Moderation states | `clean` / `flagged` / `removed` on the Collection entity itself |
| Who can act | Admin only |
| Visibility impact (removed) | Entire collection `404`/`403` to non-admin; all items within it inaccessible |
| Collection item moderation | Individual Post or Product items within a collection are moderated independently. A removed item within a purchased collection is inaccessible even if the collection itself is `clean`. |
| Entitlement impact | `removed` overrides `CollectionPurchase.access_revoked_at IS NULL`; collection access blocked |
| Billing impact | `CollectionPurchase` records retained; no billing reversal at MVP |

---

### 4.4 Creator Profile / Creator Account

| Attribute | Detail |
|---|---|
| What can go wrong | Creator misrepresentation, platform policy violations, identity fraud, repeat abuse |
| Moderation states | `CreatorProfile.status`: `onboarding` / `pending_review` / `approved` / `rejected` / `suspended` |
| Who can act | Admin (Family 20 for review; Family 21 for suspension/restriction post-approval) |
| Visibility impact (non-approved) | Public `/@[username]` page not rendered; creator content not discoverable |
| Visibility impact (suspended) | All creator content `→ 404` to all non-admin callers; creator cannot publish |
| Entitlement impact | Suspension hides all content; existing subscription/purchase records remain; access blocked at runtime |
| Billing impact | Existing fan subscriptions not auto-cancelled; creator cannot receive new payments while suspended |

---

### 4.5 User Account

| Attribute | Detail |
|---|---|
| What can go wrong | Harassment, serial bad-faith reporting, policy violations |
| Moderation states | `User.account_status`: `active` / `suspended` |
| Who can act | Admin (via Family 21 warn/restrict/suspend actions) |
| Visibility impact (suspended) | User blocked from login; all authenticated actions blocked |
| Entitlement impact | Subscription and purchase records retained in DB; account cannot be used to access content |
| Billing impact | Records retained; no automatic billing cancellation |

---

### 4.6 Creator Application

| Attribute | Detail |
|---|---|
| What can go wrong | Incomplete or fraudulent application; IBAN format invalid; agreement not accepted |
| Moderation states | `CreatorApplication.decision`: `pending` / `approved` / `rejected` |
| Who can act | Admin (Family 20) |
| Visibility impact | No public impact until approved; creator sees only their own status outcome |
| Entitlement impact | No content entitlement until `CreatorProfile.status = approved` |
| Billing impact | Creator cannot receive payments until approved |
| Resubmission | Creator can resubmit after rejection; new application record created; `resubmission_count` increments |

---

### 4.7 Report Record

| Attribute | Detail |
|---|---|
| What can go wrong | Spam reporting; bad-faith reports; duplicate reports |
| Moderation states | `Report.status`: `open` / `under_review` / `actioned` / `dismissed` |
| Who can act | Admin (Family 21) |
| Visibility impact | Report record visible to admin only; reporter receives no direct notification on resolution at MVP |
| Entitlement impact | Report itself does not affect entitlement; admin action on the target does |
| Billing impact | None directly |
| Duplicate guard | Same reporter + same target within 24 hours → `409 CONFLICT`; prevents spam-reporting |

---

## 5. Creator Review Rules

### 5.1 Application Intake

A creator application enters the review queue when the creator completes onboarding step 5
("Kabul Et ve Gönder"). At that moment:
- `CreatorProfile.status → pending_review`
- `CreatorApplication.decision = pending`
- `CreatorApplication.submitted_at = now()`
- Admin overview counter increments
- Creator redirected to a "Başvurunuz inceleniyor" waiting state on their dashboard

Pre-conditions enforced by the onboarding API before submission is accepted:
- `User.email_verified_at IS NOT NULL`
- Creator Agreement accepted (`ConsentRecord` for `creator_agreement` exists)
- IBAN format validated (`iban_format_valid = true`)
- At least one `MembershipPlan` submitted

### 5.2 Review Queue Behavior

The review queue (`/admin/yaraticilar/inceleme`) shows all applications with
`CreatorApplication.decision = pending`, sorted ascending by `submitted_at` (oldest first).

Per-row display: creator display name, username, submission date, declared category, tier
count.

Inline review panel (expanded via "İncele" CTA) shows:
- **Profil:** avatar, display name, bio, category badge, content format tags
- **Üyelik Planları:** tier names, prices (TRY), billing intervals, perk count (not full
  perk text)
- **Ödeme Bilgileri:** IBAN format validity (`Geçerli format` / `Geçersiz format`); full
  IBAN never shown to admin frontend (encrypted at rest)
- **Sözleşme:** acceptance status, timestamp, version number

**Concurrent review guard:** If two admins act on the same application simultaneously, the
second admin to submit receives a conflict error: "Bu başvuru zaten işleme alındı." First
action wins; the row disappears from queue on refresh.

### 5.3 Approval Conditions

Admin approves when:
- Profile content is appropriate and consistent with platform guidelines
- At least one published tier with valid price
- IBAN format is valid (real-time bank verification not performed at MVP)
- Creator Agreement accepted at a known version

Admin may approve despite an invalid IBAN format — this field is informational; admin
judgment applies. Approval is irreversible through the UI at MVP.

**Effects of approval:**
- `CreatorProfile.status → approved`; `approved_at = now()`
- `CreatorApplication.decision = approved`; `reviewed_at = now()`; `reviewed_by_admin_id` set
- `ModerationAction` created (`action_type = approve_creator`)
- Creator notified by email (approval confirmation + `/dashboard` link)
- Creator gains full dashboard access and publishing rights

### 5.4 Rejection Conditions

Admin rejects when profile content, tier configuration, or application details are
materially incomplete or violate platform guidelines. Rejection reason text is optional but
strongly recommended to guide resubmission.

**Effects of rejection:**
- `CreatorProfile.status → rejected`
- `CreatorApplication.decision = rejected`; `rejection_reason` stored if provided
- `ModerationAction` created (`action_type = reject_creator`)
- Creator notified by email (rejection status + reason if provided + resubmission guidance)

**Resubmission:** Creator can resubmit after rejection. A new `CreatorApplication` record
is created (same `creator_profile_id`); `resubmission_count` increments;
`CreatorProfile.status → pending_review`.

### 5.5 Suspension During Review

Admin can suspend an inconclusive application without committing to outright rejection.
Suspension is distinct from rejection: the creator is not invited to resubmit immediately
and must contact support. `CreatorProfile.status → suspended` is the same terminal status
as post-approval suspension. Content is hidden; creator cannot publish.

**Effects:**
- `CreatorProfile.status → suspended`; `suspended_at = now()`
- `ModerationAction` created (`action_type = suspend_creator`)
- Creator notified by email (suspension notice + support contact instruction)

Reinstatement is deferred to post-launch tooling (requires DB intervention at MVP).

### 5.6 What Admin Sees

| Data | Visible to Admin? |
|---|---|
| Creator profile (display name, bio, avatar, category) | ✓ |
| Tier names, prices, billing intervals, perk count | ✓ |
| IBAN format validity (`iban_format_valid`, `iban_last_four`) | ✓ |
| Full IBAN number | ✗ (encrypted; never returned to frontend) |
| Creator Agreement acceptance status and version | ✓ |
| Prior `resubmission_count` | ✓ |
| `ModerationAction` history for this creator | ✓ (in review panel history section) |
| Creator's private messages or fan billing data | ✗ |

### 5.7 What Creator Sees While Under Review

| Creator Profile Status | Creator Dashboard | Public `/@[username]` Page | Can Publish |
|---|---|---|---|
| `onboarding` | Setup wizard | ✗ | ✗ |
| `pending_review` | Read-only "Başvurunuz inceleniyor" state | ✗ | ✗ |
| `rejected` | Rejection state + optional reason + resubmission CTA | ✗ | ✗ |
| `suspended` | Read-only suspended state + contact support instruction | ✗ | ✗ |
| `approved` | Full access | ✓ | ✓ |

### 5.8 Notification Effects

| Event | Channel | Recipient | Content |
|---|---|---|---|
| Application submitted | No fan notification; admin counter increments | Admin (counter) | — |
| Approved | Email | Creator | Approval confirmation; link to `/dashboard` |
| Rejected | Email | Creator | Rejection reason (if provided); resubmission guidance |
| Suspended (any stage) | Email | Creator | Suspension notice; contact support instruction |

### 5.9 Deferred Items

- Admin creator detail full page (`/admin/yaraticilar/[creator-id]`): inline panel sufficient
  at MVP; full page deferred
- Real-time bank/IBAN verification: format validation only at MVP
- Formal resubmission limit or cooling-off period after rejection: not designed for Phase 1
- Creator reinstatement tooling: deferred; database intervention required at MVP
- Agreement version compliance enforcement beyond display: deferred

---

## 6. Report Intake and Triage Rules

### 6.1 Who Can Submit Reports

Any authenticated user (fan or creator) can submit a report via `POST /reports`. Anonymous
visitors cannot submit reports. Admin does not submit reports — admin acts via the moderation
queue, not the report flow.

### 6.2 What Can Be Reported

| Target type | `target_type` value | Examples |
|---|---|---|
| Post | `post` | Harassing post, spam, illegal content |
| Product | `product` | Fraudulent or illegal digital product |
| Collection | `collection` | Collection containing violating content |
| User account | `user` | Harassment, impersonation |
| Creator profile | `creator_profile` | Fraudulent creator, impersonation |

### 6.3 Report Reason Taxonomy (Phase 1)

Phase 1 `reason_code` values (open decision M4 — must be finalized before launch):

| Code | Turkish label |
|---|---|
| `spam` | Spam |
| `misleading_content` | Yanıltıcı İçerik |
| `harassment_abuse` | Hakaret / Taciz |
| `copyright_infringement` | Telif Hakkı İhlali |
| `illegal_content` | Yasa Dışı İçerik |
| `other` | Diğer |

`reason_code` is required. `details` (free text) is optional for additional reporter context.

### 6.4 Duplicate and Spam Report Handling

- Same reporter + same target within 24 hours: API returns `409 CONFLICT`; no new record
  created. Reporter sees: "Bu içeriği zaten bildirdiniz."
- Multiple different reporters on the same target: each creates a distinct `Report` record;
  admin sees all individually; no automated deduplication across reporters.
- Prior report count per reporter is visible in the report detail panel to inform admin
  judgment. No automated bad-faith scoring at MVP.

### 6.5 What Enters the Moderation Queue

All successfully submitted reports enter `Report.status = open` and appear in the admin
report queue at `/admin/moderasyon/raporlar`. There is no automated pre-filtering or priority
scoring. All open reports are visible to admin.

Reports submitted against already-removed content enter the queue normally. Admin sees the
removal state in the target section and can dismiss or close without further action.

### 6.6 Triage Priority Expectations

No automated priority ranking at Phase 1. Queue is sorted by submission date ascending
(oldest first). The admin overview dashboard shows open report counts and flagged content
counts as operational pressure indicators. Warning visual state triggers when counts exceed
operational thresholds (open decision M5).

### 6.7 What Evidence / Context Is Visible to Admin (Report Detail)

| Section | Content |
|---|---|
| Reporter | Username, account creation date, prior reports submitted count |
| Target | Content type badge, title, creator name, current visibility status, link to content in context (disabled if removed) |
| Report content | Reason code, optional reporter details text |
| Action history | All prior `ModerationAction` records on the same target (not scoped to this report); reverse-chronological; date, action type, admin username |

### 6.8 When No Action Is Appropriate

Admin dismisses (action: `dismiss_report`) when:
- Report is clearly in bad faith or spam
- Content is within platform guidelines after review
- Report is a duplicate of an already-actioned report
- Target content was already removed by prior action

Dismissed reports move to `Report.status = dismissed`. No notification sent to reporter at
MVP. `ModerationAction` record is created for the dismiss decision.

### 6.9 Report State Machine

```
[open]         ---(admin opens for review)-----> [under_review]
[open]         ---(admin actions directly)------> [actioned]
[open]         ---(admin dismisses)-------------> [dismissed]
[under_review] ---(admin actions)--------------> [actioned]
[under_review] ---(admin dismisses)-------------> [dismissed]
```

All state transitions create a `ModerationAction` record.

---

## 7. Moderation Action Catalog

All actions in this catalog create an immutable `ModerationAction` record in the same
database transaction. All actions are irreversible through the admin UI at MVP.
`admin_note` (optional free-text) is stored in the `ModerationAction` record and is
**never returned to non-admin callers** in any API response.

---

### 7.1 Dismiss Report

| Attribute | Detail |
|---|---|
| `action_type` | `dismiss_report` |
| When used | Report is unfounded, bad faith, duplicate, or target already actioned |
| Who can perform | Admin (Family 21) |
| Visibility change | None |
| Entitlement change | None |
| Creator/fan experience | No change |
| Notification | None |
| Audit | `ModerationAction` created (`action_type = dismiss_report`; `report_id` set) |

---

### 7.2 Warn User

| Attribute | Detail |
|---|---|
| `action_type` | `warn_user` |
| When used | Minor policy violation; content remains live; first-occurrence escalation |
| Who can perform | Admin (Family 21) |
| Visibility change | None; content remains live |
| Entitlement change | None |
| Creator/fan experience | Target receives platform warning notification |
| Notification | Warning notification sent to target user/creator |
| Audit | `ModerationAction` created (`action_type = warn_user`) |

---

### 7.3 Flag Content

| Attribute | Detail |
|---|---|
| `action_type` | `flag_content` |
| When used | Admin marks content for review without immediate removal; further investigation needed |
| Who can perform | Admin (Family 21) |
| Visibility change | `moderation_status → flagged`; `flagged_at = now()`; content remains visible by default (open decision M1) |
| Entitlement change | None while flagged |
| Creator experience | Creator sees flagged indicator on their own content in dashboard |
| Fan experience | No visible change at MVP (open decision M1) |
| Notification | No fan/creator notification required for flagging alone (open decision M6) |
| Audit | `ModerationAction` created (`action_type = flag_content`) |

---

### 7.4 Clear Flag

| Attribute | Detail |
|---|---|
| `action_type` | `clear_flag` |
| When used | Admin reviewed flagged content; no violation found; returns content to clean state |
| Who can perform | Admin (Family 21 — flagged content queue) |
| Visibility change | `moderation_status → clean`; `flagged_at` cleared; full visibility restored |
| Entitlement change | None |
| Creator/fan experience | Creator's flagged indicator removed |
| Notification | Optional (open decision M6) |
| Audit | `ModerationAction` created (`action_type = clear_flag`) |

---

### 7.5 Remove Content

| Attribute | Detail |
|---|---|
| `action_type` | `remove_content` |
| When used | Content violates platform rules; immediate removal required |
| Who can perform | Admin (Family 21) |
| Visibility change | `moderation_status → removed`; `removed_at = now()`; `404`/`403 CONTENT_REMOVED` to all non-admin callers; creator sees read-only view in dashboard |
| Entitlement change | **Absolute override**: all access blocked regardless of subscription status, purchase record, or `access_revoked_at` value |
| Creator experience | Content visible as removed in their dashboard (read-only); cannot edit, publish, or republish removed content |
| Fan experience | `404` or `403 CONTENT_REMOVED` on any access attempt; purchased/subscribed content is inaccessible |
| Notification | Creator notified (email) of content removal |
| Audit | `ModerationAction` created (`action_type = remove_content`) |

---

### 7.6 Restrict Creator

| Attribute | Detail |
|---|---|
| `action_type` | `restrict_creator` |
| When used | Creator violates policy; full suspension not yet warranted; prevents new publishing and new fan purchases |
| Who can perform | Admin (Family 21) |
| Visibility change | Creator's existing published content remains visible (open decision M2); no new content can be published; no new purchases possible |
| Entitlement change | Existing subscriptions and purchases: access policy is open decision M2 |
| Creator experience | Cannot publish new content; cannot onboard new paying fans; receives restriction notification |
| Fan experience | Depends on M2 resolution; existing paid access may be retained or de-listed |
| Notification | Creator notified (email) of restriction |
| Audit | `ModerationAction` created (`action_type = restrict_creator`) |

**Implementation note (open decision M8):** `CreatorProfile.status` enum does not include a
`restricted` value. Implementation requires either adding a new status value or a separate
boolean flag (e.g., `is_restricted`). Must be resolved before implementation.

---

### 7.7 Suspend Creator

| Attribute | Detail |
|---|---|
| `action_type` | `suspend_creator` |
| When used | Serious or repeated policy violations; full removal from public platform required |
| Who can perform | Admin (Family 20 or Family 21) |
| Visibility change | `CreatorProfile.status → suspended`; `suspended_at = now()`; all creator content `→ 404` to all non-admin callers immediately |
| Entitlement change | All subscription and purchase entitlement blocked while suspended; records retained in DB |
| Creator experience | Public page gone; dashboard in read-only suspended state; cannot publish; receives suspension notification |
| Fan experience | All creator content returns `404`; existing paid access blocked while suspended |
| Billing impact | Existing fan subscriptions not auto-cancelled; creator cannot receive new payments; renewals may continue processing (open decision M7) |
| Notification | Creator notified (email) of suspension |
| Audit | `ModerationAction` created (`action_type = suspend_creator`) |

---

### 7.8 Approve / Reject Creator

| Attribute | Detail |
|---|---|
| `action_type` | `approve_creator` / `reject_creator` |
| When used | Creator application review in Family 20 only |
| Who can perform | Admin (Family 20) |
| Visibility change | Approval: creator gains public page + publishing rights. Rejection: no public change. |
| Notification | Approval: email with `/dashboard` link. Rejection: email with optional reason + resubmission guidance. |
| Audit | `ModerationAction` created with appropriate `action_type` |

---

### 7.9 Moderation Action Summary Table

| Action | `action_type` | Content visible after | Entitlement after | Creator notified | Fan notified |
|---|---|---|---|---|---|
| Dismiss report | `dismiss_report` | Unchanged | Unchanged | No | No |
| Warn user | `warn_user` | Unchanged | Unchanged | Yes (warning) | No |
| Flag content | `flag_content` | Yes (default, M1) | Unchanged | No (M6) | No |
| Clear flag | `clear_flag` | Yes (restored) | Unchanged | Optional (M6) | No |
| Remove content | `remove_content` | No (404/403) | Blocked (absolute) | Yes | No |
| Restrict creator | `restrict_creator` | Depends (M2) | Depends (M2) | Yes | No |
| Suspend creator | `suspend_creator` | No (all 404) | Blocked | Yes | No (M9) |
| Approve creator | `approve_creator` | N/A (new approval) | Grants full rights | Yes | No |
| Reject creator | `reject_creator` | N/A (no change) | No change | Yes | No |

---

## 8. Visibility and Access Effects

### 8.1 Content Visibility Matrix by State

| Content State | Public Visitor | Authenticated Fan | Creator (own content) | Admin |
|---|---|---|---|---|
| `publish_status = published` + `moderation_status = clean` + creator `approved` | Full (if public) or entitlement-gated | Per entitlement | Full edit/view | Full view |
| `publish_status = draft` + `moderation_status = clean` | 404 | 404 | Full edit/view | Visible |
| `publish_status = scheduled` + `moderation_status = clean` | 404 | 404 | Visible (can edit) | Visible |
| `publish_status = archived` + `moderation_status = clean` | 404 | 404 | Visible (read-only) | Visible |
| `moderation_status = flagged` (any publish status) | Visible (open decision M1) | Visible (M1) | Visible with flag indicator | Visible in flagged queue |
| `moderation_status = removed` (any publish status) | 404 / 403 | 404 / 403 | Read-only in dashboard | Visible in moderation queue |
| Creator `status = suspended` (any content state) | 404 (all creator content) | 404 (all creator content) | Dashboard read-only; no public page | Full view |
| Creator `status = pending_review` / `rejected` / `onboarding` | 404 (no public page) | 404 | Dashboard accessible | Visible in review queue |

### 8.2 Purchased Content Under Moderation

| Purchase Record | Content Moderation State | Access Result |
|---|---|---|
| `ProductPurchase` exists + `access_revoked_at IS NULL` | `moderation_status = clean` | ✓ Signed URL returned |
| `ProductPurchase` exists + `access_revoked_at IS NULL` | `moderation_status = flagged` | ✓ Access retained (M1) |
| `ProductPurchase` exists + `access_revoked_at IS NULL` | `moderation_status = removed` | ✗ `403 CONTENT_REMOVED` |
| `CollectionPurchase` exists | `moderation_status = clean` | ✓ Collection accessible |
| `CollectionPurchase` exists | `moderation_status = removed` | ✗ Collection inaccessible |
| Item within purchased collection | Item `moderation_status = removed` | ✗ Item inaccessible; rest of collection accessible |
| `PostPurchase` exists + `access_revoked_at IS NULL` | `moderation_status = removed` | ✗ `403 CONTENT_REMOVED` |

### 8.3 Subscription-Gated Content Under Moderation

| Subscription State | Content Moderation State | Access Result |
|---|---|---|
| `active` / `cancelled` (within period) / `grace_period` | `moderation_status = clean` | ✓ Per tier entitlement |
| `active` / `cancelled` (within period) / `grace_period` | `moderation_status = flagged` | ✓ Access retained (M1) |
| `active` / `cancelled` (within period) / `grace_period` | `moderation_status = removed` | ✗ `403 CONTENT_REMOVED` |
| `active` | Creator `status = suspended` | ✗ All creator content `404` |

### 8.4 Creator Dashboard Access Under Moderation

| Creator Profile Status | Dashboard Access | Public Page | Can Publish |
|---|---|---|---|
| `onboarding` | ✓ (setup wizard) | ✗ | ✗ |
| `pending_review` | ✓ (read-only awaiting state) | ✗ | ✗ |
| `approved` | ✓ (full access) | ✓ | ✓ |
| `rejected` | ✓ (rejection state + resubmission CTA) | ✗ | ✗ |
| `suspended` | ✓ (read-only suspended state) | ✗ | ✗ |

### 8.5 Library Visibility vs. Entitlement Record Retention

When content is moderated or a creator is suspended:
- Entitlement records (`ProductPurchase`, `CollectionPurchase`, `PostPurchase`,
  `MembershipSubscription`) are **NOT** deleted or modified
- Fan library page (`/account/kutuphane`) must distinguish between "you own this" and
  "this is currently accessible" — exact UI treatment is a product decision dependent on
  M1/M2/M7 resolution
- Fan billing history (`/account/fatura`) retains all invoice records regardless of
  moderation state
- Admin-only visibility: removed content visible in moderation queue; suspended creator
  content accessible to admin only

### 8.6 Admin-Only Visibility After Restriction/Removal

- Removed content: visible to admin in moderation queue with full context; returns `404`/`403`
  to all non-admin callers
- Flagged content: visible to admin in flagged queue; visible to non-admin by default (M1)
- Suspended creator: all content remains accessible to admin; no public page served for
  non-admin
- `ModerationAction.admin_note`: stored in audit trail; **never returned in any fan-facing or
  creator-facing API response**

---

## 9. Creator Restriction and Suspension Rules

### 9.1 Restricted vs. Suspended Creator

| Dimension | Restricted (`restrict_creator`) | Suspended (`suspend_creator`) |
|---|---|---|
| `CreatorProfile.status` | Remains `approved` + restriction flag (open decision M8) | `suspended` |
| Public page | Remains visible (open decision M2 may affect content) | Gone; `404` to all non-admin |
| Existing published content | Remains visible (open decision M2) | All `404` to non-admin |
| New content publishing | Blocked | Blocked |
| New fan purchases/subscriptions | Blocked | Blocked |
| Existing fan access | Open decision M2 | Blocked while suspended |
| Creator dashboard | Accessible with restriction banner | Read-only suspended state |
| Creator can contact support | Yes | Yes |
| Creator receives notification | Yes (email) | Yes (email) |
| Audit | `ModerationAction` (`restrict_creator`) | `ModerationAction` (`suspend_creator`) |

### 9.2 Impact on Existing Paying Fans

**Restriction:**
- Existing fan entitlement: open decision M2 (whether restriction includes content de-listing)
- No automatic subscription cancellation
- No automatic billing change
- Fan-visible experience depends on M2 outcome

**Suspension:**
- All creator content → `404` while suspended; fans cannot access any content
- `MembershipSubscription` records: retained in DB; not auto-cancelled
- Renewals: may continue to process while creator is suspended (open decision M7)
- Fan library: suspended creator's items show as inaccessible
- Fan billing history: unaffected; all past invoices retained

### 9.3 Impact on Renewals / Cancellation / Billing Display While Suspended

- `MembershipSubscription` records remain unchanged (e.g., still `active` or `cancelled`)
- Fan `/account/uyeliklerim`: subscription record still present but content shows as
  inaccessible
- Gateway renewal scheduling: may continue to attempt renewal (open decision M7)
- Fan cancellation: fans can still cancel their own subscription at any time via
  `POST /account/subscriptions/:id/cancel`
- Creator revenue: creator should not receive payouts while suspended (operational decision;
  deferred to payout mechanism post-launch)

### 9.4 Reinstatement

Creator reinstatement is deferred to post-launch tooling. At MVP, reinstatement requires
direct database intervention. If a creator is reinstated, entitlement resumes based on
existing subscription and purchase records (billing-lifecycle.md §9.3, Case 2).

### 9.5 Intentionally Unresolved / Deferred

- Whether restriction includes content de-listing (open decision M2)
- Whether gateway subscription renewals are paused or cancelled when creator is suspended
  (open decision M7)
- Whether fans are automatically notified when their subscribed creator is suspended (M9)
- Whether any partial refund applies to fans when creator is suspended during their paid
  period (M9 — linked to refund policy B9)
- Formal reinstatement workflow and tooling

---

## 10. Billing and Moderation Interactions

### 10.1 Core Separation Principle

Billing state and moderation state are independent systems. Moderation actions never directly
modify billing records. Billing operations never modify moderation records. Their intersection
is enforced at request-time in the authorization/visibility layer only.

### 10.2 Moderated Content with Active Entitlement

When content a fan has paid for or subscribed to is moderated:

| Moderation Outcome | Entitlement Record | Access | Billing Impact |
|---|---|---|---|
| Content `flagged` | Unchanged | Retained by default (M1) | None |
| Content `removed` | Unchanged | Blocked (`403 CONTENT_REMOVED`) | None at MVP; no automatic refund |
| Creator `suspended` | Unchanged | Blocked (`404` for all creator content) | No automatic subscription cancellation |
| Creator `restricted` | Unchanged | Open decision M2 | None |

### 10.3 Unpublish vs. Moderation Removal Distinction

| Action | Controlled by | Effect on Prior Purchasers | Effect on New Purchases |
|---|---|---|---|
| Creator unpublishes product/collection | Creator (`publish_status → archived`) | Open decision D1 | Blocked (not publicly available) |
| Admin removes content | Admin (`moderation_status → removed`) | Access blocked (absolute override) | Blocked |

These are independent. A creator unpublishing does not set `moderation_status`. An admin
removal does not change `publish_status`. A creator cannot undo a moderation removal by
republishing — `removed` is a terminal state at MVP.

### 10.4 Creator Suspension While Subscriptions Are Active

- Fans cannot access any creator content while suspended (§9.2)
- `MembershipSubscription` records: unchanged; not auto-cancelled
- Gateway renewal scheduling: may continue (open decision M7)
- Fans can cancel their own subscription at any time
- Creator cannot receive new membership revenue while suspended
- Past invoices and purchase records: unchanged and visible in fan billing history

### 10.5 Creator Restriction While Products/Collections Previously Purchased

- Existing purchasers: access policy is open decision M2
- No new purchases or subscriptions can be initiated while restricted
- Past invoices and purchase records: unchanged
- Creator's products/collections remain in fan libraries; accessibility depends on M2

### 10.6 Notifications and UI States for Billing-Moderation Interactions

| Event | Fan Notification | Creator Notification | Fan UI State |
|---|---|---|---|
| Content removed by admin | None at MVP | Email (removal notice) | Content shows as inaccessible/removed |
| Creator suspended | None automatic (M9) | Email (suspension notice) | Creator page `404`; library items inaccessible |
| Content flag cleared | None | Optional (M6) | Restored to normal visibility |
| Creator restricted | None | Email (restriction notice) | Depends on M2 |

### 10.7 Open Billing-Moderation Policy Questions

Open decisions M2, M7, and M9 (see Section 13) govern the behavioral boundaries between
billing and moderation interactions. D1 and B9 are carried from prior documents and directly
affect how moderation-triggered access revocation interacts with purchase entitlement.
All of these must be resolved before the relevant moderation actions are enabled in production.

---

## 11. Admin Boundary Rules

### 11.1 Phase 1 Admin Authority

At Phase 1, the only approved admin workflows are:
1. Creator application review (Family 20)
2. Content moderation and report handling (Family 21)

No other admin pages, tools, or data access patterns are in Phase 1 scope.

### 11.2 Admin Role Definition

| Attribute | Value |
|---|---|
| Role | `admin` (single role at Phase 1; no sub-roles) |
| Provisioning | Accounts provisioned directly by platform operator; NOT via public signup |
| Auth gate | `User.is_admin = true` required for all `/admin/*` routes |
| Non-admin redirect | Any authenticated non-admin on `/admin/*` → redirected to role-appropriate home |
| Unauthenticated redirect | Unauthenticated request on `/admin/*` → admin login page (separate from public `/auth/giris`) |

### 11.3 What Admin Can See

| Data | Can Admin See? |
|---|---|
| Pending creator applications | ✓ |
| Creator profile, tiers, IBAN format validity, agreement acceptance | ✓ |
| Full IBAN number | ✗ (encrypted; `iban_last_four` + `iban_format_valid` only) |
| User reports and report detail | ✓ |
| Reporter identity (username, account creation date, prior report count) | ✓ |
| Target content/account status and moderation history | ✓ |
| Flagged content queue | ✓ |
| Removed content (moderation queue) | ✓ |
| `ModerationAction.admin_note` | ✓ (admin-only field; never returned to non-admin) |
| Fan billing details | ✗ (deferred) |
| Raw payment card data | ✗ (never on platform) |
| Private messages | ✗ (not in Phase 1 scope) |
| Fan account details beyond report context | ✗ (deferred) |

### 11.4 What Admin Can Change

| Action | Permitted at Phase 1? |
|---|---|
| Approve / reject / suspend creator application | ✓ (Family 20) |
| Flag / clear-flag / remove content | ✓ (Family 21) |
| Restrict creator account | ✓ (Family 21) |
| Suspend creator | ✓ (Family 20 or Family 21) |
| Warn user | ✓ (Family 21) |
| Dismiss / close reports | ✓ (Family 21) |
| Reinstate suspended creator through UI | ✗ (deferred; requires DB intervention at MVP) |
| Undo any moderation action through UI | ✗ (all actions irreversible at MVP) |
| Process refunds | ✗ (deferred; gateway-only at MVP) |
| View / manage user billing | ✗ (deferred) |
| Manage user accounts (list/search/edit) | ✗ (deferred) |
| Bulk moderation operations | ✗ (deferred) |
| Act on DMCA/copyright claims through UI | ✗ (email-based at MVP) |

### 11.5 Auditability Requirements

Every admin write operation must create a `ModerationAction` record in the same database
transaction or the write must roll back. Required fields:

| Field | Requirement |
|---|---|
| `admin_user_id` | Identity of admin who took the action; required |
| `action_type` | What was done; required |
| `target_type` + `target_id` | What was acted on; required |
| `report_id` | Set if action triggered from a report; nullable |
| `admin_note` | Stored if provided; never returned to non-admin callers |
| `created_at` | Immutable; set at creation time |

The audit log viewer UI (`/admin/denetim-gunlugu`) is deferred. The `ModerationAction`
table and logging infrastructure are **not deferred** — they ship with the admin tools.

### 11.6 Explicitly Deferred Admin Systems

| System | Why Deferred |
|---|---|
| User management list/detail (`/admin/kullanicilar/*`) | Basic moderation through report flow sufficient at MVP |
| Admin billing operations (`/admin/fatura/*`) | Gateway handles disputes directly; no platform refund UI at MVP |
| Creator detail full page (`/admin/yaraticilar/[creator-id]`) | Inline review panel sufficient at MVP |
| Audit log viewer (`/admin/denetim-gunlugu`) | Logging data captured; viewer is post-launch |
| DMCA/copyright claim tool (`/admin/telif-hakki/*`) | Email-based process covers MVP |
| CMS / resources management (`/admin/icerik-yonetimi/*`) | Post-launch |
| Action reversibility tooling | Post-launch; DB intervention required at MVP |
| Bulk moderation operations | Post-launch |
| Concurrent admin conflict resolution UI | Optimistic locking flagged; not fully specified at MVP |

---

## 12. Deferred / Out of Scope

| Area | Phase 1 Status | Notes |
|---|---|---|
| Chat moderation | Out of scope | Chat is not in Phase 1 launch scope |
| Livestream moderation | Out of scope | Livestream excluded per CLAUDE.md |
| Comment moderation | Out of scope | Comments not grounded in approved Phase 1 docs |
| Automated content scoring / AI moderation | Deferred | Human-only review at MVP |
| Keyword / content filtering | Deferred | Not designed for Phase 1 |
| Appeals portal | Deferred | Post-launch |
| Copyright / DMCA claim workflow UI | Deferred | Email-based at MVP |
| Admin billing operations | Deferred | billing-lifecycle.md §11 |
| User management UI | Deferred | Basic moderation via reports sufficient |
| Audit log viewer UI | Deferred | Data captured; viewer post-launch |
| Action reversibility through UI | Deferred | All actions irreversible at MVP |
| Graduated multi-stage sanction framework | Deferred | Human judgment at MVP |
| Age verification flows | Not designed | Not in Phase 1 scope |
| External law enforcement escalation | Not designed | Out of scope |
| Automated bad-faith reporter detection | Deferred | Prior report count visible; no automation |
| Admin creator detail full page | Deferred | Inline panel sufficient |
| Bulk moderation operations | Deferred | Post-launch |
| Creator reinstatement tooling | Deferred | DB intervention at MVP |
| Subscription auto-cancellation on creator suspension | Deferred | Open decision M7 |
| Fan notification on creator suspension | Deferred | Open decision M9 |
| Refund / compensation for fans affected by suspension or removal | Deferred | Linked to B9 (refund policy) |

---

## 13. Assumptions / Open Decisions

| # | Decision | Impact |
|---|---|---|
| M1 | Whether `flagged` content is auto-hidden from public or remains visible until explicitly removed | Current default: visible until removed. If auto-hide is chosen, `flagged` becomes an access-blocking state. Affects flagged content queue urgency and creator experience. Must be resolved before launch. |
| M2 | Whether `restrict_creator` includes immediate content de-listing for existing fans | Option A: content remains accessible. Option B: content de-listed. Affects fan experience during restriction. Must be resolved before launch. |
| M3 | Whether a creator can edit a `flagged` post while it is under review | If allowed: creator can remove violating content before admin acts. If blocked: creator cannot respond while under review. Must be decided before launch. |
| M4 | Final report reason taxonomy (`reason_code` values) | Placeholder taxonomy in §6.3. Requires legal/ops review and Turkish regulatory alignment before launch. |
| M5 | Admin overview counter warning thresholds | What pending count or open report count triggers the warning visual state on the admin dashboard. Operational/product decision. |
| M6 | Whether creator is notified when their content is flagged (vs. only when removed) | Notification on flag: creator can preemptively respond or remove. Notification only on removal: simpler flow. Product/ops decision. |
| M7 | Whether gateway renewal processing is paused or cancelled when a creator is suspended | If not paused: fans may be charged for a period during which all content is inaccessible. Legal/ops implication. Must be resolved before launch. |
| M8 | Data model implementation of `restrict_creator` state | `CreatorProfile.status` enum does not include `restricted`. Either add a new status value or add a separate `is_restricted` boolean flag. Must be resolved before implementation. |
| M9 | Whether fans are proactively notified when their subscribed creator is suspended | Operational and product decision. Failure to notify may have trust implications. |
| A5 (api-surface.md) | Flagged content auto-hide | Carried forward; same as M1 above. |
| D1 (data-model.md) | Creator unpublish access policy for prior purchasers | Whether `access_revoked_at` is set when creator unpublishes. Must be resolved before launch. billing-lifecycle.md §12. |
| B9 (billing-lifecycle.md) | Minimum refund policy | No-refund vs. partial-refund for fans affected by content removal or creator suspension. Must be resolved before launch. |

---

## 14. Validation Checklist

- [ ] Document aligned with page-requirements.md (Families 20–21 page requirements honored)
- [ ] Document aligned with permission-matrix.md (role definitions and visibility matrix consistent)
- [ ] Document aligned with data-model.md (ModerationAction, Report, CreatorApplication, CreatorProfile, User entities and state machines consistent)
- [ ] Document aligned with api-surface.md (admin endpoint families and cross-cutting rules consistent)
- [ ] Document aligned with billing-lifecycle.md (§2 Principle 7 and §9.3 Admin Override Cases consistent)
- [ ] Creator review and content moderation clearly separated (Families 20 vs. 21 are distinct workflows with distinct action sets)
- [ ] `publish_status` and `moderation_status` treated as separate, independent fields throughout
- [ ] Visibility, entitlement, and billing effects not conflated (billing records not deleted on moderation; entitlement blocked at runtime by authorization layer)
- [ ] `moderation_status = removed` documented as absolute entitlement override throughout
- [ ] `CreatorProfile.status = suspended` documented as absolute content-hide for all non-admin callers
- [ ] Admin boundary explicitly scoped to Families 20–21 only; no out-of-scope admin systems introduced
- [ ] All deferred admin systems listed in §11.6 and §12
- [ ] All open decisions captured in §13 (M1–M9 plus D1, B9, A5 cross-references)
- [ ] `ModerationAction` audit trail requirement documented as non-deferrable
- [ ] `admin_note` documented as admin-only throughout; never returned to non-admin callers
- [ ] No policy-enforcement code, SQL, admin implementation code, or UI component specs produced
