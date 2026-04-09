# Page Requirements: Admin & Legal — lalabits.art

> **Scope:** This document covers page families 20–24 from the approved outline:
> Creator Review Queue and Moderation & Reports (Admin/Operations group) and
> Terms of Service, Privacy Policy, and Creator Agreement (Legal/Trust group).
>
> **Excluded from this document:** Public (families 1–2), Auth (3–6), Creator (7–12),
> Fan/Member (13–15), Checkout/Billing (16–19).
> Those families are documented in separate sibling files.
>
> **Deferred admin routes (not documented here):**
> `/admin/yaraticilar/[creator-id]`, `/admin/kullanicilar`, `/admin/fatura`,
> `/admin/denetim-gunlugu`, `/admin/telif-hakki`, `/admin/icerik-yonetimi`
>
> **Deferred legal routes (not documented here):**
> `/legal/cerez-politikasi`, `/legal/telif-hakki`, `/legal/guven-ve-guvenlik`
>
> **Authority:** [page-requirements-outline.md](./page-requirements-outline.md) ·
> [sitemap.md](./sitemap.md) · [vision.md](./vision.md) · [CLAUDE.md](../../CLAUDE.md)

---

## Assumptions

The following product decisions are assumed for this document. If any assumption changes,
the affected fields must be revisited.

1. **Admin account separation.** Admin accounts are not created through the public signup
   flow. They are provisioned directly by the platform operator. The admin login mechanism
   (separate route, separate session scope, or role elevation on a verified identity) is an
   infrastructure decision not defined in this document.

2. **Inline review without creator detail page.** Since `/admin/yaraticilar/[creator-id]`
   (full creator detail admin view) is deferred, the review queue must present sufficient
   data inline — profile, tiers, IBAN format status, agreement acceptance — for an admin to
   approve, reject, or suspend a creator without navigating away from the queue.

3. **Audit trail exists before admin actions ship.** All admin actions (approve, reject,
   suspend, warn, remove, restrict, dismiss) must be logged server-side before admin tools
   are used in production. The audit log UI (`/admin/denetim-gunlugu`) is deferred; the
   logging infrastructure is not.

4. **Report reason taxonomy.** The categories a user can select when submitting a report
   (e.g., "Spam", "Yanıltıcı İçerik", "Hakaret / Taciz", "Telif Hakkı İhlali",
   "Yasa Dışı İçerik") are a product and operational decision. The exact taxonomy must be
   defined before the moderation module ships. This document uses placeholder labels.

5. **Flagged content sources.** The flagged content queue may receive items from user
   report escalations, system-triggered flags (e.g., automated keyword detection), or
   manual admin flags. The mechanism for system-triggered flagging is a backend and
   infrastructure decision. This document defines the queue UI and admin actions only.

6. **Legal page content authority.** The legal pages (Terms, Privacy, Creator Agreement)
   contain legally binding text. Content is authored and maintained by the platform
   operator's legal team. This document defines delivery requirements (structure,
   versioning, consent record dependencies) — not the legal text itself.

7. **Legal page versioning.** Each legal page displays a "Son güncelleme: [tarih]" label
   and a machine-readable version identifier. Consent records in auth and onboarding flows
   reference this version. How existing consent records are handled when a policy updates
   (re-acceptance prompt vs. notification) is a legal and backend decision not defined here.

---

## Admin / Operations

---

### Family 20 — Creator Review Queue

**Routes:**
`/admin` (Admin Genel Bakış — entry point and navigation hub) ·
`/admin/yaraticilar/inceleme` (İnceleme Kuyruğu — pending creator applications)

Both routes are part of one family. The admin overview is the navigation entry point to
the review queue and the moderation section.

**Page Name:** Admin Genel Bakış / İnceleme Kuyruğu (Creator Review Queue)

**Page Goal:** Give the admin operator a fast status read on the platform's operational
health and an efficient tool to review, approve, reject, or suspend pending creator
applications without requiring a separate creator detail page.

**Primary User:** Admin (platform operator)

**Access Level:** Admin-only. Non-admin authenticated users are redirected to their
role-appropriate home route. Unauthenticated requests are redirected to an admin login
page (separate from the public `/auth/giris` — see assumption 1).

**Primary CTA:**
- Overview: navigation links to "İnceleme Kuyruğu" and "Raporlar" sections; no
  transaction CTA
- Review queue: "İncele" (opens inline review panel per application); "Onayla" /
  "Reddet" / "Askıya Al" (actions within the inline panel)

---

**Core Sections**

**Admin Genel Bakış (`/admin`):**

A summary dashboard with four stat counters:
- Bekleyen İncelemeler: count of creator applications awaiting admin review
- Açık Raporlar: count of unresolved user-submitted reports
- İşaretlenmiş İçerik: count of flagged content items in the moderation queue
- Bugünkü Yeni Kayıtlar: count of new user accounts registered today

If any counter exceeds a defined operational threshold (threshold values are a product/ops
decision), the relevant counter is shown with a warning state (e.g., highlighted border or
badge) to prompt immediate action.

Navigation links to:
- Creator Review Queue: `/admin/yaraticilar/inceleme`
- Report Queue: `/admin/moderasyon/raporlar`
- Flagged Content Queue: `/admin/moderasyon/icerik`

No analytics charts, billing data, or revenue figures on this page — those are in
deferred modules.

**İnceleme Kuyruğu (`/admin/yaraticilar/inceleme`):**

A table of creator applications with status `pending` (submitted but not yet reviewed).
Default sort: submission date ascending (oldest first — to prevent applications from
aging unnoticed).

Per table row:
- Creator display name
- Username
- Submission date and time
- Category (single-select from taxonomy)
- Tier count (number of tiers created in onboarding step 3)
- "İncele" CTA — expands an inline review panel for that row

**Inline review panel:**

Opens below or alongside the table row (design decision). Contains:

*Profil:*
- Avatar, display name, bio
- Category badge
- Content format tags (multi-select choices from onboarding step 2)

*Üyelik Planları:*
- List of tiers: tier name, price (TRY), billing interval(s) (Aylık / Yıllık), perk count
- Full perk text is not shown inline — perk count is sufficient for review; perk details
  available if creator detail page is implemented post-launch

*Ödeme Bilgileri:*
- IBAN format status: "Geçerli format" (TR + 24 digits) or "Geçersiz format"
- Note: no real-time bank verification at MVP (consistent with onboarding assumption 2
  in `page-requirements-creator.md`)

*Sözleşme:*
- Agreement acceptance status: "Kabul Edildi" + timestamp + version number
- If not accepted: "Kabul Edilmedi" (should not be reachable in normal flow — flag if seen)

**Actions in inline panel:**

- "Onayla" — sets creator status to `approved`; triggers approval email to creator;
  creator can now access `/dashboard`; row is removed from the queue
- "Reddet" — sets creator status to `rejected`; optional rejection reason text field
  (text is sent to creator via email); creator can amend their application and re-submit;
  row is removed from the queue
- "Askıya Al" — sets creator status to `suspended` (distinct from rejected — used when
  review is inconclusive and additional information is needed before a final decision);
  creator is notified; row is removed from the pending queue
- "Vazgeç" — closes the inline panel without taking action; row remains in the queue

All actions are logged server-side (assumption 3). Admin identity and action are included
in the log entry.

Empty queue state: "Bekleyen başvuru yok." — no action required.

---

**Key Components**

`AdminOverviewDashboard` (stat counters with alert states), `AdminNavLinks`,
`ReviewQueueTable`, `InlineReviewPanel` (profile / tiers / payout / agreement sections),
`ReviewActionButtons` (approve / reject / suspend), `RejectionReasonInput`,
`EmptyQueueState`

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Platform health counters (pending, reports, flagged, signups) | Yes — overview cannot render without them | Admin stats API |
| Creator application list (status: pending) | Yes — queue table | Creator / onboarding API |
| Creator application detail (profile, tiers, IBAN status, agreement) | Yes — inline panel | Creator / onboarding API |
| Admin identity (for action logging) | Yes — all actions | Auth session |

---

**Empty States**

- **Review queue — no pending applications:** "Bekleyen başvuru yok. Tüm başvurular
  incelendi." No action required.
- **Overview — all counters at zero:** Normal state; counters display 0 without alert
  styling.

---

**Loading States**

- Overview initial load: skeleton counters while stats are fetched.
- Review queue initial load: skeleton table rows.
- Inline panel open: brief skeleton for profile/tier/payout data while the detail is
  fetched for that application.
- Action submission ("Onayla" / "Reddet" / "Askıya Al"): button enters loading state;
  panel becomes non-interactive until the API response returns. Row is removed from the
  table on success.

---

**Error States**

- **Stats API unavailable (overview):** Each counter shows a "—" placeholder with a
  "Yüklenemedi" label. Navigation links remain functional.
- **Queue API unavailable:** Page-level error. "Başvurular şu anda yüklenemiyor. Lütfen
  daha sonra tekrar deneyin."
- **Inline panel data fetch fails:** Error in the panel area. "Başvuru detayları
  yüklenemedi." Retry link shown; action buttons are hidden until data loads successfully.
- **Action submission fails:** Toast error. "İşlem gerçekleştirilemedi. Lütfen tekrar
  deneyin." Panel remains open; buttons become interactive again.

---

**Edge Cases**

- **Two admins review the same application simultaneously:** The second admin to submit an
  action receives a conflict error: "Bu başvuru zaten işleme alındı." The row is removed
  from their queue on refresh. Optimistic locking or similar concurrency guard is required
  (backend concern).
- **Creator re-submits after rejection:** A new application record is created. It appears
  in the queue as a new pending row with the previous rejection visible in history (if
  admin detail page is eventually built). At MVP, the admin sees a fresh pending entry.
- **Creator deletes their account while application is pending:** Row should be removed
  from the queue automatically. If not, submitting an action on a deleted account returns
  an error; admin dismisses and refreshes.
- **IBAN format is invalid:** "Geçersiz format" is shown in the inline panel. Admin can
  still approve, reject, or suspend — the IBAN format status is informational, not a
  blocking gate on the admin side.
- **Agreement version mismatch:** If the creator accepted an older version of the creator
  agreement, the version number in the panel reflects what was accepted. Admin can still
  act; compliance with the current version is a post-launch concern.

---

**Permissions / Entitlement Rules**

- All `/admin` routes require an authenticated session with the admin role.
- Admin actions are irreversible through the UI at MVP (approve, reject, suspend cannot
  be undone via this interface — changes require direct database intervention or a future
  admin account management tool).
- The inline review panel does not expose full IBAN numbers — only format validity status.
  IBAN values are stored encrypted and are not returned to the frontend.
- Admin actions are logged with the admin's identity. Admins cannot act anonymously.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `admin_overview_viewed` | `admin_id`, `pending_count`, `open_reports_count`, `flagged_count` |
| `admin_review_queue_viewed` | `admin_id`, `queue_depth` |
| `admin_review_panel_opened` | `admin_id`, `creator_id` |
| `admin_creator_approved` | `admin_id`, `creator_id`, `category` |
| `admin_creator_rejected` | `admin_id`, `creator_id`, `reason_provided: boolean` |
| `admin_creator_suspended` | `admin_id`, `creator_id` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Auth session (admin role) | Required — guards all routes |
| Admin stats API | Required — overview counters |
| Creator / onboarding API | Required — queue list and inline detail |
| Email delivery service | Required — approval and rejection notification emails to creators |
| Audit logging infrastructure | Required — all actions must be logged (assumption 3) |
| Family 7 (Creator Onboarding) | Upstream — generates applications that enter this queue |
| Family 21 (Moderation & Reports) | Navigation target from overview |

---

---

### Family 21 — Moderation & Reports

**Routes:**
`/admin/moderasyon` (Moderasyon Merkezi — navigation hub) ·
`/admin/moderasyon/raporlar` (Rapor Kuyruğu — user-submitted reports) ·
`/admin/moderasyon/raporlar/[report-id]` (Rapor Detayı — single report detail) ·
`/admin/moderasyon/icerik` (İçerik Moderasyonu — flagged content queue)

The moderation overview hub (`/admin/moderasyon`) is the navigation entry point to the
three sub-views, treated as part of this family (consistent with `/admin` in Family 20).

**Page Name:** Moderasyon Merkezi / Rapor Kuyruğu / Rapor Detayı / İçerik Moderasyonu
(Moderation & Reports)

**Page Goal:** Provide admin operators with a complete toolset for reviewing user-submitted
complaints, acting on flagged content, and maintaining a clear record of all moderation
decisions — supporting the platform's trust and safety obligations.

**Primary User:** Admin (platform operator)

**Access Level:** Admin-only (same redirect behavior as Family 20).

**Primary CTA:**
- Moderation hub: navigation links to sub-sections; open-count badges on each link
- Report queue: "İncele" → report detail
- Report detail: action buttons (Uyarı Gönder / İçeriği Kaldır / Hesabı Kısıtla / Yok
  Say / Raporu Kapat)
- Flagged content queue: "Kaldır" / "Temizle" inline per row

---

**Core Sections**

**Moderasyon Merkezi (`/admin/moderasyon`):**

Navigation hub with three links, each showing an open-item count badge:
- Rapor Kuyruğu → `/admin/moderasyon/raporlar` (count: unresolved reports)
- İçerik Moderasyonu → `/admin/moderasyon/icerik` (count: unreviewed flagged items)
- Back to Admin Overview → `/admin`

No action forms on this page; it exists only to orient the admin.

**Rapor Kuyruğu (`/admin/moderasyon/raporlar`):**

A table of all user-submitted reports.

Per row:
- Report type: İçerik (a specific post, product, or collection) or Hesap (a user account)
- Reason category (see assumption 4): placeholder taxonomy — Spam, Yanıltıcı İçerik,
  Hakaret / Taciz, Telif Hakkı İhlali, Yasa Dışı İçerik, Diğer
- Reporter: username
- Target: content title + creator name (for content reports), or username (for account
  reports)
- Submitted date
- Status: Bekliyor / İnceleniyor / Çözüldü

Filter controls: by status (Bekliyor / İnceleniyor / Çözüldü), by report type (İçerik /
Hesap), by date range (from–to). Default filter: Bekliyor only, sorted ascending by
submitted date.

"İncele" CTA → `/admin/moderasyon/raporlar/[report-id]`

**Rapor Detayı (`/admin/moderasyon/raporlar/[report-id]`):**

A full view of a single report with enough context to make a moderation decision.

*Reporter:*
- Username and account creation date
- Prior reports submitted count (how many times this user has reported others)
- Note: if this count is high, admin may weigh context accordingly; no automated scoring

*Target content or account:*
- If content report: content type badge (Gönderi / Ürün / Koleksiyon), content title,
  creator display name, current visibility status (Yayında / Kaldırıldı)
- If account report: reported user's display name, account type (Fan / Yaratıcı), account
  status (Aktif / Kısıtlı / Askıya Alınmış)
- "İçeriği/Profili Görüntüle" link (opens in new tab — links to the creator public page
  or the relevant content context; for content that has already been removed, link is
  disabled)

*Rapor İçeriği:*
- Reason category
- Additional context text submitted by the reporter (if any)

*Geçmiş Eylemler:*
- Prior moderation actions taken on this same target (not this report — actions taken on
  the content or account in any previous moderation event). Displayed as a reverse-
  chronological log: date, action type, admin identity (username only).

*Eylemler (action options):*

| Action | Label | Effect |
|---|---|---|
| Uyarı Gönder | "Uyarı Gönder" | Sends a platform warning message to the creator/user. Content remains live. Logged. |
| İçeriği Kaldır | "İçeriği Kaldır" | Removes the specific piece of content from the platform. Creator is notified. Logged. |
| Hesabı Kısıtla | "Hesabı Kısıtla" | Restricts the account: prevents new content publishing and new purchases. Existing member access is not immediately revoked. Creator/user is notified. Logged. |
| Yok Say | "Yok Say" | Dismisses the report with no action on the target. Logged. |
| Raporu Kapat | "Raporu Kapat" | Marks the report as resolved; no further action. Logged. |

*Eylem Notu (action notes):*
- Optional free-text field for the admin to record decision rationale.
- Stored server-side in the audit trail.
- Not visible to the reporter or the target.

After an action is submitted, the report status updates to Çözüldü and the admin is
returned to the report queue. Back navigation also available.

**İçerik Moderasyonu (`/admin/moderasyon/icerik`):**

A table of content items that have been flagged for admin review (from any source —
see assumption 5).

Per row:
- Content title
- Creator display name
- Content type: Gönderi / Ürün / Koleksiyon
- Flag reason (source label: Kullanıcı Raporu Tırmanması / Sistem Bayrağı / Manuel Bayrak)
- Flag date
- Current visibility: Yayında / Kaldırıldı / İncelemede

Actions per row:
- "İncele" — view the content in context (opens creator public page or content view in
  new tab; for admin-only previews of unpublished content, this requires a separate admin
  content view — flag as a post-launch refinement; at MVP, "İncele" links to the
  creator public page)
- "Kaldır" — removes the content immediately; creator is notified; logged
- "Temizle" — clears the flag; marks content as reviewed and acceptable; content remains
  live; logged

Default sort: flag date ascending (oldest flagged first).

---

**Key Components**

`ModerationHubNav` (with count badges), `ReportQueueTable`, `ReportFilterBar`,
`ReportDetailView` (reporter info, target info, history, action panel), `ActionNoteInput`,
`ModerationActionButtons`, `FlaggedContentTable`, `FlaggedContentActionBar`,
`EmptyQueueState`

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Report list (filterable) | Yes — queue table | Reports API |
| Report detail (reporter, target, reason, history) | Yes — detail view | Reports API |
| Target content/account status | Yes — determines action options | Content API / Users API |
| Flagged content list | Yes — flagged content queue | Moderation API |
| Admin identity | Yes — action logging | Auth session |

---

**Empty States**

- **Report queue — no unresolved reports:** "Açık rapor yok." with a "Tüm raporları
  görüntüle" link (shows resolved reports too).
- **Report queue — filter returns no results:** "Bu filtreyle eşleşen rapor yok." + clear
  filter link.
- **Flagged content queue — no flagged items:** "İncelenecek işaretlenmiş içerik yok."
- **Report detail — no prior actions on target:** "Bu hedef için önceki eylem kaydı yok."
  (shown in the history section).

---

**Loading States**

- Queue initial load: skeleton table rows.
- Report detail initial load: skeleton layout for reporter info, target info, and history
  sections.
- Action submission: action buttons enter loading state; panel becomes non-interactive.
  Redirect to queue on success.
- Flagged content queue initial load: skeleton table rows.

---

**Error States**

- **Reports API unavailable:** Page-level error. "Raporlar şu anda yüklenemiyor."
- **Invalid report-id in URL:** Redirect to `/admin/moderasyon/raporlar` with toast:
  "Rapor bulunamadı."
- **Target content already removed (action: İçeriği Kaldır):** API returns a conflict
  indicating content is already removed. Toast: "Bu içerik zaten kaldırılmış." Report
  can still be closed.
- **Action submission fails:** Toast error. "İşlem gerçekleştirilemedi. Lütfen tekrar
  deneyin." Panel remains interactive.
- **Flagged content API unavailable:** Inline error in the flagged content section.
  "İşaretlenmiş içerik yüklenemedi."

---

**Edge Cases**

- **Report submitted for content that was already deleted by the creator:** Target section
  shows "Bu içerik yaratıcı tarafından kaldırılmış." "İncele" link is disabled. Admin
  can still dismiss or close the report.
- **Same content has multiple pending reports:** Each report is a separate entry in the
  queue. Acting on one report (e.g., removing the content) does not auto-close the other
  reports — admin must close or resolve each one. Flag this as a workflow inefficiency to
  address post-launch (bulk-close related reports).
- **Account restriction and active memberships:** Restricting an account does not
  immediately revoke fan members' access to the creator's existing content. This is a
  policy decision — the platform's trust and safety team must define whether restriction
  includes content de-listing.
- **Admin views their own account in the report detail (edge case — admin was reported):**
  At MVP, there is no guard on this. Flag as a governance concern post-launch.
- **Report submitted in bad faith (serial reporter):** The prior report count is visible
  in the report detail. No automated bad-faith detection at MVP — admin judgment only.

---

**Permissions / Entitlement Rules**

- All `/admin/moderasyon/` routes require an authenticated session with the admin role.
- Admin actions are irreversible through the UI at MVP: content removal and account
  restriction cannot be undone via this interface.
- The action notes field is admin-only — it is never surfaced to the reporter or the
  target of moderation.
- All moderation actions are logged with the admin's identity (assumption 3).

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `moderation_hub_viewed` | `admin_id`, `open_reports_count`, `flagged_content_count` |
| `report_queue_viewed` | `admin_id`, `filter_status`, `queue_depth` |
| `report_detail_viewed` | `admin_id`, `report_id`, `report_type`, `reason_category` |
| `moderation_action_taken` | `admin_id`, `report_id`, `action: 'warn' \| 'remove_content' \| 'restrict_account' \| 'dismiss' \| 'close'`, `note_provided: boolean` |
| `flagged_content_queue_viewed` | `admin_id`, `queue_depth` |
| `flagged_content_action_taken` | `admin_id`, `content_id`, `content_type`, `action: 'remove' \| 'clear'` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Auth session (admin role) | Required — guards all routes |
| Reports API | Required — queue and detail |
| Content API (posts, products, collections) | Required — target content status and view |
| Users API | Required — target account status for account reports |
| Moderation API | Required — flagged content queue and actions |
| Email delivery service | Required — warning and restriction notifications to users/creators |
| Audit logging infrastructure | Required — all actions logged (assumption 3) |
| Family 20 (Creator Review Queue) | Navigation sibling — both reached via `/admin` |

---

---

## Legal / Trust

---

### Family 22 — Terms of Service

**Routes:**
`/legal/kullanim-kosullari`

**Page Name:** Kullanım Koşulları (Terms of Service)

**Page Goal:** Provide the legally binding terms governing all users' use of the platform.
Required reading before any user account is created; linked from consent checkboxes in
auth and onboarding flows.

**Primary User:** Any visitor (unauthenticated or authenticated)

**Access Level:** Public — no auth required.

**Primary CTA:** None. This is a read-only document. Consent is given via the checkbox in
the referring flow (signup, checkout), not on this page.

---

**Core Sections**

A single long-form document with titled sections and in-page anchor links. Sections include:

- Platformun Tanımı (what the platform is and what it provides)
- Kullanıcı Uygunluğu (eligibility: age, identity, legal capacity)
- Yasaklanan İçerik ve Davranışlar (prohibited content categories and behaviors)
- Yaratıcı Yükümlülükleri (creator obligations: content accuracy, platform compliance)
- Fan Yükümlülükleri (fan obligations: account security, payment responsibility)
- Ödeme ve Faturalama (billing terms summary: recurring charges, refund policy reference)
- Hesap Sonlandırma (termination: platform's right to terminate, user's right to close)
- Anlaşmazlık Çözümü (dispute resolution procedure)
- Geçerli Hukuk (governing law: Republic of Turkey)
- İletişim Bilgileri (platform operator contact)

Page header:
- "Son güncelleme: [tarih]" (last updated date)
- Version identifier (e.g., "v2025.1" or a date-based version string)

Navigation:
- In-page anchor links to each section (a table of contents or jump links near the top)
- No sidebar — linear document flow
- Print-friendly CSS (no interactive elements that break print rendering)

Note on anchor linking: auth signup flows and the membership checkout page link to
specific sections of this document (e.g., the billing terms section) using anchor URLs.
All section headings must have stable, defined anchor IDs.

---

**Key Components**

`LegalPageShell` (shared layout for all `/legal/` pages), `LegalSectionAnchor`,
`LegalVersionHeader` (version + last updated), `TableOfContentsLinks`

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Document content (legal text) | Yes | Legal team — static content |
| Version identifier and last updated date | Yes — required for consent records | Legal team / CMS or hardcoded |

---

**Empty States**

Not applicable — page always renders from static content.

---

**Loading States**

Static page — no async data fetching. Renders immediately. No skeleton needed.

---

**Error States**

- **Page fails to render (infrastructure failure):** Generic fallback. "Sayfa şu anda
  yüklenemiyor. Lütfen daha sonra tekrar deneyin." The platform's general error handling
  covers this case.

---

**Edge Cases**

- **Fan links directly to a section anchor (e.g., `#faturalama`) from a notification
  email:** Page must load and scroll to the anchor correctly. Anchors must be stable across
  minor content updates.
- **Legal text is updated (new version published):** The version identifier and last
  updated date must change. Existing users who accepted a prior version may need to
  re-accept — this is governed by the policy update assumption (assumption 7) and is a
  backend concern.
- **User prints the page:** Print layout must be clean. No navigation bars, modals, or
  interactive elements should appear in print output.

---

**Permissions / Entitlement Rules**

- Publicly accessible — no auth required.
- No user-specific content; the same document is served to all visitors.
- The page must not be behind any authentication gate — it is linked from pre-auth flows.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `legal_page_viewed` | `page: 'kullanim-kosullari'`, `referrer` (which flow or page directed the user here) |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Legal team content | Required — document text and versioning |
| Family 3 (Login), 4 (Fan Signup), 5 (Creator Signup) | Downstream — consent checkboxes link here |
| Family 16 (Membership Checkout) | Downstream — terms note links here |
| Family 7 (Creator Onboarding) | Downstream — referenced in step 5 agreement flow |

---

---

### Family 23 — Privacy Policy

**Routes:**
`/legal/gizlilik-politikasi`

**Page Name:** Gizlilik Politikası (Privacy Policy)

**Page Goal:** Disclose to all users what personal data the platform collects, how it is
used, and what rights users hold under Turkish data protection law (KVKK). Required before
any user data is collected.

**Primary User:** Any visitor (unauthenticated or authenticated)

**Access Level:** Public — no auth required.

**Primary CTA:** None (read-only). A "Veri Talebi Gönder" link in the user rights section
points to a contact email or form for exercising KVKK rights.

---

**Core Sections**

A single long-form document. Sections include:

- Veri Sorumlusu (data controller: platform operator name, address, contact email)
- Toplanan Kişisel Veriler (data categories: kayıt verileri, ödeme verileri,
  kullanım/davranış verileri, cihaz ve tarayıcı verileri, çerezler ve izleme)
- İşlemenin Hukuki Dayanağı (legal basis under KVKK madde 5 and 6)
- İşleme Amaçları (service delivery, billing, customer support, security, product
  improvement)
- Veri Paylaşımı (data sharing: payment gateway, email delivery provider, analytics
  provider — no sale of personal data to third parties; list named categories of
  recipients, not specific provider names)
- Veri Saklama Süreleri (retention periods per data category)
- KVKK Kapsamındaki Haklarınız (user rights: erişim, düzeltme, silme, taşınabilirlik,
  kısıtlama, itiraz; how to exercise each right; contact point for data requests)
- Çerezler Hakkında (brief cookie summary; note that a full cookie policy at
  `/legal/cerez-politikasi` will be available in a future update)

Page header:
- "Son güncelleme: [tarih]" (last updated date)
- Version identifier

In-page anchor links to major sections near the top.

The "Veri Talebi Gönder" link under the rights section opens a mailto or links to a
contact form. The specific mechanism (email vs. form) is an operational decision.

---

**Key Components**

`LegalPageShell`, `LegalSectionAnchor`, `LegalVersionHeader`, `TableOfContentsLinks`,
`DataRequestLink` (mailto or form link in rights section)

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Document content (privacy policy text) | Yes | Legal team — static content |
| Version identifier and last updated date | Yes | Legal team / CMS or hardcoded |
| Contact email or form URL for data requests | Yes — rights section | Ops / legal team |

---

**Empty States**

Not applicable — static content page.

---

**Loading States**

Static page — no async fetching. Renders immediately.

---

**Error States**

- **Page fails to render:** Same generic fallback as Terms of Service.

---

**Edge Cases**

- **KVKK update (Turkish regulation changes):** Policy content and legal basis sections
  must be reviewed and updated. The version identifier and last updated date must change.
  Potentially triggers re-consent requirement (assumption 7).
- **Third-party provider names change (e.g., email provider is switched):** Data sharing
  section references categories of recipients, not specific company names — this reduces
  the frequency of required legal updates. Specific providers are documented in internal
  operational records, not on this public page.
- **User submits a data deletion request:** The platform must have an operational process
  to receive, verify, and action the request within KVKK deadlines. The data request link
  on this page initiates the process — the process itself is outside the scope of this
  document.

---

**Permissions / Entitlement Rules**

- Publicly accessible — no auth required.
- Must not be behind any authentication gate.
- Page is a static read; no user-specific content is injected.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `legal_page_viewed` | `page: 'gizlilik-politikasi'`, `referrer` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Legal team content | Required — KVKK-compliant text |
| Operational contact for data requests | Required — rights section link |
| Family 3 (Login), 4 (Fan Signup), 5 (Creator Signup) | Downstream — privacy acceptance checkpoint |

---

---

### Family 24 — Creator Agreement

**Routes:**
`/legal/yaratici-sozlesmesi`

**Page Name:** Yaratıcı Sözleşmesi (Creator Agreement)

**Page Goal:** Provide the full legal agreement between the platform operator and any
creator who operates on the platform. Required to be accepted (via checkbox in onboarding
step 5) before a creator application can be submitted.

**Primary User:** Creator (during onboarding and as an ongoing reference); also accessible
to any visitor for transparency

**Access Level:** Public — no auth required. The document is readable by anyone.
Acceptance is gated in the onboarding flow, not on this page.

**Primary CTA:** None. Read-only document. Acceptance action is the checkbox in onboarding
step 5 (`/onboarding/sozlesme`), which links here.

---

**Core Sections**

A single long-form document. Sections include:

- Taraflar (parties: the creator — individual or legal entity — and the platform operator)
- Yaratıcı Uygunluğu (eligibility requirements: age, identity, residency)
- İçerik Sahipliği ve Lisans (content ownership: creator retains full IP rights; grants
  the platform a non-exclusive, worldwide license to host, display, and deliver content
  to paying members for the duration of the agreement)
- Platform Ücreti ve Gelir Paylaşımı (fee terms: reference to the "platform ücreti
  tarifesi" — specific percentage is legal content defined by the legal team, not set in
  this document)
- Ödeme ve Kazanç Transferi (payout terms: payment schedule, minimum payout threshold,
  currency TRY, IBAN requirement, payout timing)
- Yasaklanan İçerik Kategorileri (explicit list of prohibited content types)
- Yaratıcı Yükümlülükleri (accuracy, no deceptive practices, compliance with applicable
  Turkish law and platform rules)
- Platformun Hakları (platform's right to remove content, suspend, or terminate creator
  accounts; notice requirements where applicable)
- Üçüncü Taraf Fikri Mülkiyet (creator's obligation not to infringe third-party IP;
  DMCA-equivalent process reference)
- Sorumluluk Sınırlaması (limitation of liability)
- Sözleşme Değişiklikleri (amendment procedure: platform may update with advance notice
  to creators; continued use of the platform after the notice period constitutes acceptance)
- Geçerli Hukuk (governing law: Republic of Turkey)

Page header:
- "Son güncelleme: [tarih]" (last updated date)
- Version identifier

In-page anchor links to major sections near the top.

---

**Key Components**

`LegalPageShell`, `LegalSectionAnchor`, `LegalVersionHeader`, `TableOfContentsLinks`

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Document content (agreement text) | Yes | Legal team — static content |
| Version identifier and last updated date | Yes — consent records reference this version | Legal team / CMS or hardcoded |

---

**Empty States**

Not applicable — static content page.

---

**Loading States**

Static page — no async fetching. Renders immediately.

---

**Error States**

- **Page fails to render:** Same generic fallback as Terms of Service.

---

**Edge Cases**

- **Creator returns to this page after completing onboarding:** Viewable at any time.
  The agreement version on screen may differ from the version they accepted if an update
  has been published. A note at the top may indicate if a new version is in effect (product
  decision — not required at MVP).
- **Agreement is updated after a creator has accepted it:** Creators who accepted a prior
  version remain bound by that version until a re-acceptance is required under the
  amendment procedure. The re-acceptance flow is a post-launch concern — the amendment
  clause in the agreement text covers the requirement.
- **Creator links to a specific section (anchor) from an onboarding or support context:**
  Section anchors must be stable across content updates. Major structural changes to the
  document may require anchor ID review.

---

**Permissions / Entitlement Rules**

- Publicly accessible — no auth required.
- Must not be behind any authentication gate.
- Acceptance of this agreement is recorded server-side during onboarding submission
  (step 5) — the page itself contains no acceptance mechanism.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `legal_page_viewed` | `page: 'yaratici-sozlesmesi'`, `referrer` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Legal team content | Required — agreement text and versioning |
| Family 7 (Creator Onboarding) | Primary entry point — step 5 links here; consent record is created on step 5 submission |
