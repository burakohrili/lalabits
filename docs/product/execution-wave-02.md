# Execution Wave 02 — Creator Domain & Admin Review
## lalabits.art Phase 1

> **Status:** Active — execution in progress
> **Version:** v1.0
> **Scope:** WS3 (Creator Domain & Onboarding) + WS7 Phase 2 (Admin Creator Review Queue)
> **Authority level:** Canonical
>
> **Derived from:** workstream-breakdown.md · implementation-phasing.md ·
> api-surface.md · data-model.md · open-decisions-register.md ·
> execution-wave-01.md · decision-closeout-session-01.md

---

## §1 — Wave Objective

Deliver the Phase 2 vertical slice in a single coherent unit: a creator applies,
an admin reviews and approves, and the creator gains dashboard access.

Neither side of this slice is useful without the other. WS3 (onboarding wizard,
application submission, status state machine) and WS7 Phase 2 (admin review queue,
approve/reject/suspend actions, audit trail) are co-dependent by design and ship
together. Per OD-31 (confirmed 2026-03-27), a single team owns both workstreams.

**Wave 02 completes when Milestone 2 passes:**
> Creator completes all 6 onboarding steps and submits application.
> Admin views application, takes approve/reject/suspend action.
> Every admin action creates a `ModerationAction` record.
> Approved creator gains `/dashboard`; non-approved creator does NOT.
> Approval and rejection emails delivered correctly.
> `/@[username]` returns 404 for all non-approved creators.

**What WS4 is waiting for from this wave:** at least one creator with
`CreatorProfile.status = approved`. WS4 cannot begin until that exists and the
`/@[username]` 404 gate is active.

---

## §2 — Included Systems

**WS3 — Creator Domain & Onboarding (Phase 2)**

| System | Scope |
|---|---|
| Creator signup → onboarding handoff | Family 5 entry point routes to wizard after email verification; `CreatorProfile` with `status = onboarding` already created at registration (Wave 01) |
| Onboarding wizard — 6 steps | Family 7: profile, category, tier config, IBAN, agreement, confirmation |
| Step 1 — Profile | Display name, bio, avatar upload via presigned PUT URL to object storage; `CreatorProfile` display fields updated |
| Step 2 — Category | Category selection; saved to `CreatorProfile` |
| Step 3 — Tier configuration | Initial `MembershipPlan` records created with `status = draft`; not yet published (publishing is WS4) |
| Step 4 — IBAN capture | IBAN format validation; `iban_format_valid = true/false`; full IBAN encrypted at rest; raw IBAN never returned to any API caller |
| Step 5 — Creator Agreement | Links to Family 24 (must render — delivered by Wave 01); on acceptance: `ConsentRecord` for `creator_agreement` written |
| Step 6 — Submission | Creates `CreatorApplication` (`decision = pending`); transitions `CreatorProfile.status → pending_review`; `ConsentRecord` written atomically with submission |
| Step resume | `GET /onboarding/status` returns current step and all saved data; creator can resume from any step |
| `CreatorProfile` status state machine | `onboarding → pending_review → approved / rejected / suspended`; correct informational views per status |
| `/dashboard` route gate | Approved creator: 200; pending: informational status view; rejected: informational view with rejection reason and resubmit CTA; suspended: blocked |
| `/@[username]` 404 gate | Returns 404 for `status ∈ {onboarding, pending_review, rejected, suspended}`; returns 200 only for `approved` |
| Creator dashboard shell | Family 9: structural scaffold only, gated to `status = approved`; no real dashboard data (data is WS4) |

**WS7 Phase 2 — Admin Creator Review Queue (Phase 2)**

| System | Scope |
|---|---|
| Admin overview dashboard | `/admin`: operational counters including pending creator application count; entry point to all admin areas |
| Creator review queue | `/admin/yaraticilar/inceleme`: paginated list of `pending_review` applications with inline review panel |
| Application detail | Profile, category, tier configuration, IBAN fields visible to admin (`iban_last_four`, `iban_format_valid` only — never full IBAN) |
| Approve action | `CreatorProfile.status → approved`; creator email delivered (approval with dashboard link); `ModerationAction` created |
| Reject action | `CreatorProfile.status → rejected`; creator email delivered (rejection reason + resubmit CTA); `ModerationAction` created |
| Suspend action | `CreatorProfile.status → suspended`; creator email delivered; `ModerationAction` created; all `/@[username]` and content endpoints immediately return 404 |
| `ModerationAction` atomicity | Every admin write creates a `ModerationAction` record within the same DB transaction; if the audit write fails, the entire action rolls back — no silent admin actions |

---

## §3 — Excluded Systems

These are explicitly not part of Wave 02. Do not introduce them.

| Excluded | Authority | When |
|---|---|---|
| Content creation (posts, plans publishing, products, collections) | WS4 — Phase 3 | Wave 03 |
| Creator public page — full tab structure (feed, tiers, shop) | WS4 — Phase 3 | Wave 03 |
| Creator dashboard with real data | WS4 — Phase 3 | Wave 03 |
| Dual-status authorization layer | WS4 — Phase 3 | Wave 03 |
| Fan checkout, billing, subscriptions | WS6 — Phase 4 | Wave 04+ |
| Fan library, discovery, home page wired | WS5 — Phase 4–5 | Wave 04+ |
| Full admin moderation hub (reports, flag/remove, restrict) | WS7 Phase 6 | Wave 06+ |
| In-app notifications | WS5 — Phase 4–5 | Wave 04+ |

---

## §4 — Prerequisites Satisfied by Wave 01

All of the following must be confirmed true (Checkpoint C from Wave 01) before
Wave 02 implementation begins.

| Condition | Source checkpoint |
|---|---|
| Fan can register, verify email, log in, and reset password | Checkpoint C |
| Creator can register at Family 5 entry point; `CreatorProfile` created with `status = onboarding`, `onboarding_last_step = 0` | Checkpoint B |
| `ConsentRecord` for `terms_of_service` + `privacy_policy` written at every registration | Checkpoint B |
| Legal pages 22, 23, 24 render publicly and are linked from auth flows | Checkpoint C |
| Family 24 (Creator Agreement) specifically renders — onboarding step 5 links to it | Checkpoint C |
| `email_verified_at` guard: routes requiring verified email return 403 for unverified users | Checkpoint C |
| Admin auth gate: `POST /admin/auth/login` issues `scope: admin` token; all `/admin/*` routes reject non-admin tokens | Checkpoint A |
| All 25 entities migrated in DB — Wave 02 writes to `CreatorProfile`, `CreatorApplication`, `MembershipPlan`, `ModerationAction`, `ConsentRecord` | Checkpoint A |
| Object storage service layer: presigned PUT URL generation verified — needed for avatar upload in step 1 | Checkpoint A |
| Email delivery: transactional emails working in staging — needed for approval/rejection emails | Checkpoint B |
| OD-31 resolved: single team owns WS3 + WS7 Phase 2 | Confirmed 2026-03-27 |

---

## §5 — Remaining Risks

| Risk | Impact | Mitigation |
|---|---|---|
| ~~**IBAN encryption key management**~~ **Resolved 2026-03-27** — AES-256-GCM; `IBAN_ENCRYPTION_KEY` env variable via deploy-time secret management; no API-layer decryption at Phase 1 | High — resolved before Batch 3.2 begins | Confirmed — see Batch 3.2 notes and `wave-02-prerequisites.md §2` |
| **Multi-step wizard state persistence** — 6 steps with back navigation; step data must survive browser refresh and accidental navigation away | Medium — poor state management creates data loss or confusing UX for creators mid-onboarding | Use `GET /onboarding/status` on wizard mount to rehydrate from server state; do not rely on client-side-only state |
| **Avatar upload CORS** — presigned PUT URL goes directly from browser to object storage; CORS config must allow the production frontend domain | Medium — if CORS is not configured, step 1 avatar upload fails silently or with a network error | Flagged in Wave 01 §5: configure object storage CORS for the production domain in Batch 1.2; verify in Checkpoint A before Wave 02 begins |
| ~~**ModerationAction atomicity failure path**~~ **Resolved 2026-03-27** — single DB transaction; precondition check inside transaction; full rollback if `ModerationAction` write fails; email after commit only | High — resolved before Batch 3.3 begins | Confirmed — see Batch 3.3 notes and `wave-02-prerequisites.md §3` |
| **Admin review queue race condition** — two admins actioning the same application simultaneously could produce conflicting state (e.g., both attempt to approve) | Medium — unlikely at Phase 2 scale, but a double-approve or approve/reject split state is incorrect | Use optimistic locking (check `CreatorProfile.status = pending_review` as a precondition inside the transaction; return 409 if precondition fails) |
| **Rejection resubmit flow** — rejected creator's `status = rejected`; resubmit CTA must route back to onboarding wizard; API must allow `creator:rejected` actor to write onboarding endpoints | Medium — if the resubmit path is not built, rejected creators have no recovery path | `api-surface.md` already specifies `creator:rejected` as an allowed actor on onboarding endpoints; confirm this permission is enforced in the guard |

---

## §6 — Implementation Batches

### Batch 3.1 — Onboarding Backend: Steps 1–3

**What:** API layer for onboarding steps 1 through 3 and step-resume.

**Endpoints:**
- `GET /onboarding/status` — returns `onboarding_last_step` and all saved fields for
  resume; returns 200 for `status ∈ {onboarding, rejected}`
- `PUT /onboarding/profile` — saves display name, bio; returns presigned PUT URL for
  avatar upload to object storage; updates `onboarding_last_step = 1`
- `PUT /onboarding/category` — saves category selection; updates `onboarding_last_step = 2`
- `POST /onboarding/plans` — creates `MembershipPlan` with `status = draft`; returns
  plan ID; `onboarding_last_step = 3`
- `PUT /onboarding/plans/[plan-id]` — updates draft plan fields

**Guards:** `JwtAuthGuard` + `CreatorOnboardingGuard` (requires `CreatorProfile.status
∈ {onboarding, rejected}`)

**DB writes:** `CreatorProfile` (profile fields, `onboarding_last_step`); `MembershipPlan`
(draft, scoped to this creator)

**Not included:** IBAN, submission, admin queue. Avatar file itself is uploaded directly
by the browser to object storage via the presigned PUT URL — the backend only issues the URL.

**Depends on:** Wave 01 Checkpoint A (schema + object storage service layer)

**Unblocks:** Batch 3.2 (submission); Batch 3.5 (onboarding wizard frontend)

---

### Batch 3.2 — Onboarding Backend: Steps 4–6 + Application Submission

**What:** IBAN capture, Creator Agreement consent, and application submission.

**Endpoints:**
- `PUT /onboarding/payout` — accepts IBAN string; validates format (`iban_format_valid`);
  encrypts full IBAN at rest; stores only `iban_last_four` and `iban_format_valid` in
  queryable columns; raw IBAN never returned; `onboarding_last_step = 4`
- `POST /onboarding/submit` — single atomic transaction:
  1. Validates `onboarding_last_step = 5` (all steps complete)
  2. Creates `ConsentRecord` for `creator_agreement` with current `LegalDocumentVersion`
  3. Creates `CreatorApplication` (`decision = pending`)
  4. Transitions `CreatorProfile.status → pending_review`
  5. If any step fails: full rollback; `CreatorProfile.status` unchanged

**IBAN encryption — confirmed 2026-03-27:** AES-256-GCM. Key delivered via
`IBAN_ENCRYPTION_KEY` environment variable, injected at deploy time through the same
secret management used for `JWT_SECRET` and `DB_URL`. Store `iv + ciphertext` as the
`iban_encrypted` column value. Raw IBAN must never appear in any API response, log
line, error message, or DB column other than `iban_encrypted`. No API-layer decryption
path exists at Phase 1 — `iban_encrypted` is stored for future payout processing only.

**Side effects on submit:** no email sent at submission (email is sent by WS7 on
approve/reject); no fan-visible state change.

**Guards:** same as Batch 3.1

**Depends on:** Batch 3.1

**Unblocks:** Batch 3.3 (admin queue can now find `pending_review` records); Batch 3.4
(route gates require approved creator); Batch 3.5 (step 4–6 frontend)

---

### Batch 3.3 — Admin Review Queue Backend (WS7 Phase 2)

**What:** All backend for admin review and actioning of creator applications.

**Endpoints:**
- `GET /admin/creator-applications` — paginated list of applications; filterable by
  status (`pending_review` default); returns creator display name, submission timestamp,
  category
- `GET /admin/creator-applications/[id]` — full application detail: profile fields,
  category, tier configuration summary, `iban_last_four`, `iban_format_valid`; full
  IBAN never returned
- `POST /admin/creator-applications/[id]/approve` — single DB transaction:
  1. Precondition: `CreatorProfile.status = pending_review` (409 if not)
  2. `CreatorProfile.status → approved`
  3. `CreatorApplication.decision = approved`, `decided_at = now()`
  4. `ModerationAction` created (action_type = approve, admin_user_id, target)
  5. Approval email queued (dashboard link included)
  6. Rollback all if any step fails
- `POST /admin/creator-applications/[id]/reject` — body: `{ reason: string }` — same
  transaction pattern; `status → rejected`; `ModerationAction` created; rejection email
  with reason queued
- `POST /admin/creator-applications/[id]/suspend` — same pattern; `status → suspended`;
  `ModerationAction` created; suspension email queued

**Admin overview counters:** `GET /admin/overview` updated to include
`pending_applications_count` from `CreatorProfile` where `status = pending_review`

**Guards:** `JwtAuthGuard` + `AdminGuard` (`is_admin = true` AND `scope: admin` claim)

**ModerationAction atomicity — confirmed 2026-03-27:** every admin action endpoint
uses a single DB transaction: (1) precondition check inside the transaction —
`CreatorProfile.status = pending_review` required, 409 returned if not; (2) status
change; (3) `ModerationAction` write; (4) commit. If the `ModerationAction` write
fails, the entire transaction rolls back — `CreatorProfile.status` is unchanged. No
silent admin action is possible. Notification email is queued only after commit;
email delivery failure does not roll back DB state.

**Emails:** transactional emails for approval, rejection, and suspension are sent after
the transaction commits. If email delivery fails, the DB state is already correct —
email failure does not roll back the action. Log the failure.

**Depends on:** Wave 01 Checkpoint A (schema, admin auth gate); Batch 3.2 (application
records must exist to develop and test against — can begin against DB directly before
3.2 is complete, but full test requires 3.2)

**Unblocks:** Batch 3.4 (approve action must work before dashboard gate can be
verified); Batch 3.6 (admin frontend)

**Note:** Batches 3.1 and 3.3 can begin in parallel. Both depend only on Wave 01.

---

### Batch 3.4 — Route Gates + Dashboard Shell Backend

**What:** Enforce all access control gates that depend on `CreatorProfile.status`; wire
the creator dashboard shell endpoint.

**Route gates to enforce:**
- `GET /dashboard/*` — requires `CreatorProfile.status = approved`; returns 403 for
  any other status (frontend handles the informational views for pending/rejected by
  reading a separate status endpoint, not by accessing dashboard routes directly)
- `GET /creators/[username]` (public page) — 404 if `status ≠ approved`
- `POST /content/*`, `POST /plans/*`, `POST /products/*` — 403 if `status ≠ approved`
  (WS4 endpoints; gates must be in place before WS4 begins)

**Dashboard shell endpoint:**
- `GET /dashboard/overview` — returns creator status, display name, and a minimal
  scaffold response; no real content data; approved status required

**Creator status endpoint (for pending/rejected views):**
- `GET /creator/status` — returns `CreatorProfile.status`, `rejection_reason` (if
  rejected); accessible for all creator statuses

**Depends on:** Batch 3.2 (approved creator must exist to test gate pass); Batch 3.3
(approve action must function to create a testable approved creator)

**Unblocks:** Batch 3.7 (frontend dashboard shell + state views)

---

### Batch 3.5 — Onboarding Wizard Frontend (Family 7) + Creator Entry Handoff (Family 5)

**What:** Full 6-step onboarding wizard in the browser; creator signup entry point
handoff.

**Family 5 handoff:**
- Creator signup success → route to `/onboarding` (wizard entry); creator's `status =
  onboarding` confirmed before entering wizard

**Wizard implementation:**
- On mount: call `GET /onboarding/status`; rehydrate all previously saved step data from
  server — do not rely on client-side state alone
- Step 1 — Profile: display name and bio form; avatar upload using presigned PUT URL
  (direct browser → object storage); show avatar preview after upload
- Step 2 — Category: category selection UI
- Step 3 — Tier configuration: create/edit initial draft plans; price and name fields
- Step 4 — IBAN: IBAN input with client-side format feedback; submit to backend for
  server-side validation and encryption
- Step 5 — Creator Agreement: render link to Family 24 (`/legal/yaratici-sozlesmesi`);
  require explicit checkbox confirmation before step can proceed; acceptance passed to
  submit endpoint
- Step 6 — Confirmation: summary of submitted data; submit button calls
  `POST /onboarding/submit`; on success: redirect to pending state view
- Back navigation: each step calls the step-save endpoint before navigating back; data
  is always persisted server-side
- Pending state view: shown after successful submission; displays "application under
  review" messaging; no action available

**Family 5 adjustment:** creator entry point (already rendered from Wave 01 as a
registration form) must confirm it routes to the wizard, not to a generic dashboard

**Depends on:** Batch 3.1 (steps 1–3 API); Batch 3.2 (steps 4–6 API)

**Can start:** Steps 1–3 frontend can begin as soon as Batch 3.1 is complete; steps
4–6 frontend follows after Batch 3.2.

**Unblocks:** Batch 3.7 (onboarding frontend must be functional for full E2E test)

---

### Batch 3.6 — Admin Creator Review Queue Frontend (Family 20)

**What:** Admin-facing UI for reviewing and actioning creator applications.

**Admin overview dashboard `/admin`:**
- Loads operational counters (pending applications count sourced from
  `GET /admin/overview`)
- Entry point to review queue

**Creator review queue `/admin/yaraticilar/inceleme`:**
- Paginated list of `pending_review` applications; each row shows display name,
  category, submission timestamp
- Clicking a row opens the inline review panel

**Inline review panel:**
- Creator profile: display name, bio, avatar
- Category
- Tier configuration summary (plan names and prices)
- IBAN info: `iban_last_four` and `iban_format_valid` badge only — never full IBAN
- Action buttons: Approve / Reject / Suspend
- Reject requires a reason input before the action can be submitted
- After action: application removed from queue; success/failure feedback

**Depends on:** Batch 3.3 (admin review backend)

**Unblocks:** Batch 3.7 (full E2E requires admin UI to be functional)

---

### Batch 3.7 — Dashboard Shell + Pending / Rejected State Views + E2E Wiring

**What:** Creator-facing views for all non-approved statuses; dashboard shell for
approved creators; full frontend integration.

**Pending state view (`/dashboard` for `status = pending_review`):**
- "Application under review" message; no action; link to support or FAQ

**Rejected state view (`/dashboard` for `status = rejected`):**
- Rejection reason displayed
- Resubmit CTA — routes back to onboarding wizard (Family 7); wizard resumes from
  the beginning; `status = rejected` actor is allowed on onboarding write endpoints

**Approved creator dashboard shell (`/dashboard` for `status = approved`):**
- Structural scaffold: navigation sidebar, header, empty content area
- No real content data — data is WS4
- Approved state confirmed from `GET /dashboard/overview`

**Route gate enforcement (frontend):**
- Unapproved creator attempting to navigate to `/dashboard/*` directly: redirected
  to the correct status view
- Unauthenticated user: redirected to login

**Depends on:** Batch 3.4 (backend gates); Batch 3.5 (onboarding wizard); Batch 3.6
(admin frontend)

**Unblocks:** Batch 3.8 (E2E integration and Milestone 2 verification)

---

### Batch 3.8 — E2E Integration + Milestone 2 Verification

**What:** End-to-end integration test of the full Phase 2 vertical slice; Milestone 2
sign-off.

**Full flow to verify:**
1. Creator registers at Family 5 → receives verification email → verifies email
2. Creator completes all 6 onboarding steps (all form fields, avatar upload, IBAN,
   agreement)
3. Creator submits application → `CreatorProfile.status = pending_review` in DB;
   `ConsentRecord` for `creator_agreement` present; `CreatorApplication` row exists
4. Admin logs in via `/admin/auth/login` → navigates to review queue → application
   visible
5. Admin approves → `CreatorProfile.status = approved` in DB; `ModerationAction` row
   created; approval email delivered to creator
6. Creator logs in → `/dashboard` returns 200; dashboard shell renders
7. `GET /@[username]` returns 200 for approved creator; 404 for a pending creator
8. Repeat step 5 with reject: `status = rejected`; rejection email with reason
   delivered; creator sees rejection reason and resubmit CTA in dashboard
9. `ModerationAction` records: verify one row per admin action (approve, reject)
10. IBAN: confirm full IBAN never appears in any API response; only `iban_last_four`
    and `iban_format_valid` in admin detail

**Milestone 2 pass conditions (all must be true):**
- [ ] Creator completed all 6 steps and submitted — DB state correct
- [ ] Admin viewed application in review queue with correct data
- [ ] Admin approve/reject/suspend — each creates `ModerationAction` record
- [ ] Approved creator: `/dashboard` → 200; pending/rejected → status views; suspended → blocked
- [ ] Approval and rejection emails delivered
- [ ] `/@[username]` → 404 for `status ≠ approved`; → 200 for `status = approved`

**Depends on:** All previous batches

---

## §7 — Dependency Map

```
Wave 01 Checkpoint C (all prerequisites confirmed)
  │
  ├─── Batch 3.1 (onboarding API steps 1–3)
  │         │
  │         ├─── Batch 3.2 (onboarding API steps 4–6 + submission)
  │         │         │
  │         │         └─── Batch 3.4 (route gates + dashboard shell backend)
  │         │                   │
  │         │                   └─── Batch 3.7 (dashboard shell + state views frontend)
  │         │                             │
  │         └─── Batch 3.5 (onboarding wizard frontend)     │
  │               [steps 1–3 frontend starts after 3.1]     │
  │               [steps 4–6 frontend starts after 3.2]     │
  │                             │                           │
  └─── Batch 3.3 (admin review queue backend)  ← parallel with 3.1
            │
            ├─── Batch 3.4 (route gates — approve action must work)
            │
            └─── Batch 3.6 (admin review queue frontend)
                        │
                        └─────────────────────────────────────┘
                                                              │
                                              Batch 3.7 (all frontend converges)
                                                              │
                                              Batch 3.8 (E2E + Milestone 2)
```

**Parallel work available:**
- Batch 3.1 and Batch 3.3 can start simultaneously — both depend only on Wave 01
- Batch 3.5 steps 1–3 frontend can begin as soon as Batch 3.1 is complete
- Batch 3.6 admin frontend can begin as soon as Batch 3.3 is complete
- The longest critical path is: 3.1 → 3.2 → 3.4 → 3.7 → 3.8

---

## §8 — Validation Checkpoints

### Checkpoint D — Backend Integration Complete

Both WS3 and WS7 Phase 2 backend APIs are functional and verified against the DB.
Frontend is not required to pass this checkpoint.

**Pass conditions:**
- [ ] `GET /onboarding/status` returns correct state for a creator in each status
- [ ] All 6 onboarding step endpoints save correctly; `onboarding_last_step` updates
- [ ] IBAN encrypted at rest; `GET /admin/creator-applications/[id]` returns only
  `iban_last_four` and `iban_format_valid`; full IBAN absent from all API responses
- [ ] `POST /onboarding/submit` atomically creates `ConsentRecord` +
  `CreatorApplication` + transitions `status → pending_review`; rolls back on failure
- [ ] `GET /admin/creator-applications` lists pending applications; `GET .../[id]`
  returns correct detail
- [ ] Approve/reject/suspend actions each: transition status correctly; create
  `ModerationAction`; queue email; rollback on failure
- [ ] `GET /@[username]` — 404 for non-approved; 200 for approved (enforced at API)
- [ ] `GET /dashboard/*` — 403 for non-approved creator (enforced at API)
- [ ] DB inspection: `ConsentRecord` for `creator_agreement` present for every
  submitted application — zero exceptions

---

### Checkpoint E — Frontend Integration Complete

All frontend surfaces functional in staging with real API data.

**Pass conditions:**
- [ ] Onboarding wizard: all 6 steps complete without error in a browser; step data
  persists on refresh (server-side rehydration)
- [ ] Avatar upload: presigned PUT URL flow works end-to-end; avatar visible after upload
- [ ] Step 5: Creator Agreement link opens Family 24; checkbox required before submit
- [ ] Submission: success redirects to pending state view
- [ ] Admin queue: loads in browser; application visible with correct data
- [ ] Admin actions: approve/reject (with reason)/suspend each work from the UI; queue
  updates after action
- [ ] Approved creator: `/dashboard` shell renders; non-approved states show correct
  informational views; rejected creator sees rejection reason and resubmit CTA
- [ ] `/@[username]` behavior correct in browser: 404 for non-approved, 200 for approved

---

### Checkpoint F — Milestone 2 (Wave 02 Complete)

Full end-to-end verification of the Phase 2 vertical slice. This is the Milestone 2
gate defined in `implementation-phasing.md §9`. Milestone 2 sign-off is required
before WS4 can begin.

**Pass conditions:**
- [ ] Creator completed all 6 onboarding steps and submitted — `CreatorProfile.status
  = pending_review`; `ConsentRecord` for `creator_agreement` present; `CreatorApplication`
  exists
- [ ] Admin saw the application in the review queue with correct profile, category,
  tier config, and masked IBAN
- [ ] Admin approve: `status = approved`; `ModerationAction` created; approval email
  delivered to creator with dashboard link
- [ ] Admin reject: `status = rejected`; `ModerationAction` created; rejection email
  with reason delivered; creator sees rejection reason and resubmit CTA
- [ ] Admin suspend: `status = suspended`; `ModerationAction` created; suspension email
  delivered; `/@[username]` immediately returns 404
- [ ] Approved creator: `/dashboard` returns 200 and shell renders
- [ ] `/@[username]` → 200 for approved creator; 404 for pending, rejected, suspended
- [ ] IBAN: full IBAN absent from all API responses including admin detail endpoint
- [ ] ModerationAction: one row per admin action; zero silent admin writes

---

## §9 — What Must Be True Before WS4 Can Begin

WS4 (Content, Memberships & Commerce Domain) requires all of the following to be true:

| Condition | Verified by |
|---|---|
| At least one creator with `CreatorProfile.status = approved` exists in the environment | Checkpoint F |
| `/@[username]` 404 gate active for non-approved creators | Checkpoint D |
| `/dashboard` route gate enforced — WS4 will build dashboard content behind this gate | Checkpoint D |
| `ModerationAction` entity operational — WS4 dual-status layer will reference it | Checkpoint D |
| `MembershipPlan` entity exists with `status = draft` records — WS4 adds publish/archive lifecycle | Checkpoint D |
| Object storage CORS configured for production domain — WS4 uses file uploads for posts and products | Wave 01 Checkpoint A |
| OD-06 (tier-gated access model) confirmed — WS4 Phase 3 gate; must be resolved before Phase 3 begins | Open — Decision Closeout Session 02 |
| OD-01 (unpublish access policy) confirmed — WS4 Phase 3 gate; must be resolved before Phase 3 begins | Open — Decision Closeout Session 02 |

**Open decisions for WS4:** OD-06 and OD-01 are Phase 3 gate items. WS4 can begin its
backend scaffold before they are resolved, but the dual-status authorization layer and
content access control cannot be finalized without them. Confirm both before Phase 3
implementation is underway.
