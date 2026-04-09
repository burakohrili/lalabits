# Page Requirements: Creator — lalabits.art

> **Scope:** This document covers page families 7–12 from the approved outline:
> Creator Onboarding, Creator Public Page, and Creator Dashboard (Overview, Posts,
> Membership Plans, Products & Collections).
>
> **Excluded from this document:** Public (families 1–2), Auth (3–6), Fan/Member (13–15),
> Checkout/Billing (16–19), Admin/Operations (20–21), Legal/Trust (22–24).
> Those families are documented in separate sibling files.
>
> **Authority:** [page-requirements-outline.md](./page-requirements-outline.md) ·
> [sitemap.md](./sitemap.md) · [vision.md](./vision.md) · [CLAUDE.md](../../CLAUDE.md)

---

## Assumptions

The following product decisions are assumed for this document. If any assumption changes,
the affected fields must be revisited.

1. **Dual-role accounts.** A user registered as a fan can begin creator onboarding on the
   same account. Fan and creator roles coexist on a single identity. If separate accounts
   are required instead, the onboarding entry point and redirect logic change significantly.

2. **IBAN validation at MVP.** The onboarding payout step validates IBAN format only. Actual
   bank account verification is deferred. Flag for compliance review before launch.

3. **Product unpublish policy.** When a creator unpublishes a digital product, the access
   policy for prior purchasers is undecided. Option A: prior purchasers lose download access
   (stricter enforcement). Option B: prior purchasers retain access; only new purchases are
   blocked (fan-friendly). Policy decision required before launch. This document does not
   assume a default — the edge case is flagged wherever it surfaces.

4. **Tier price changes.** Price changes on active membership tiers take effect at the next
   billing cycle. No proration. Existing subscribers are not grandfathered at the old price.

5. **Post access level changes.** Changing a published post's access level from free to gated
   immediately revokes access for viewers who no longer qualify. No grace period. Flag for
   policy review.

6. **Creator approval notification channel.** Admin approval triggers a transactional email
   to the creator. An in-app notification for the same event is a dependency on the
   Notifications module (Family 15) — it is not assumed to be available at the time this
   page family ships.

7. **Maximum tiers.** No hard system cap is defined at MVP. The tier list UI should indicate
   a practical limit (e.g., "en fazla 5 plan ekleyebilirsiniz") to prevent abuse and manage
   UI complexity.

---

## Creator Onboarding

---

### Family 7 — Creator Onboarding Flow

**Routes:**
`/onboarding` (entry) →
`/onboarding/profil` (step 1) →
`/onboarding/kategori` (step 2) →
`/onboarding/uyelik-planlari` (step 3) →
`/onboarding/odeme` (step 4) →
`/onboarding/sozlesme` (step 5) →
`/onboarding/inceleme` (step 6 — submitted state)

**Page Name:** Creator Onboarding Flow (Yaratıcı Başvuru Sihirbazı)

**Page Goal:** Guide a newly registered creator through six structured steps to collect the
minimum required data — profile, content category, at least one membership tier, payout
method, and legal agreement acceptance — so that an admin can review and approve their
application.

**Primary User:** Authenticated creator account; unapproved status

**Access Level:** Auth-required; creator role only. An unapproved creator who logs in is
immediately redirected to their last saved onboarding step. An approved creator who visits
any `/onboarding/` route is redirected to `/dashboard`. A fan without a creator role cannot
access this route group.

**Primary CTA:** "Devam Et" (advance to next step) on steps 1–5; "Kabul Et ve Gönder"
(accept and submit) on step 5 (sozlesme); "Dashboard'a Git" (inactive until approval) on
step 6 (inceleme).

---

**Core Sections**

The flow uses a persistent wizard shell: step indicator (1–6 with labels) visible at the
top of every step, back navigation available within the current session, progress
auto-saved on advance.

**Entry (`/onboarding`):**
A brief welcome screen. Explains what the onboarding covers and approximately how long it
takes. No form fields. Single "Başla" CTA advances to step 1.

**Step 1 — Profil Kurulumu (`/onboarding/profil`):**
- Display name (required; shown on creator public page)
- Short bio (required; 1–3 sentences; character limit ~300; shown on creator public page)
- Avatar image upload (required; shown as profile photo; cropped to square)
- Cover image upload (optional at MVP; shown as banner on creator public page)
- All uploads go to object storage; a pre-signed URL is returned before the form can advance
- Cannot advance if display name, bio, or avatar are missing

**Step 2 — Kategori ve Format (`/onboarding/kategori`):**
- Category selector: single-select from taxonomy list (Yazar, İllüstratör, Eğitimci, Podcast,
  Müzisyen, Tasarımcı, Geliştirici, Diğer). Required.
- Content format checkboxes: multi-select from a fixed list (Metin, Görsel, Ses, Video, Dosya/
  Kaynak, Prompt / AI içeriği). At least one required.
- These selections are surfaced on the creator public page as category badge and format tags.

**Step 3 — Üyelik Planları (`/onboarding/uyelik-planlari`):**
- Create at least one membership tier before advancing. Multiple tiers can be added.
- Per tier: name (required), short description (optional), price in TRY (required; > 0),
  billing interval(s) (monthly required; annual optional), perk list (at least one item required).
- Tiers added here are saved to the membership module immediately. They can be edited later
  via `/dashboard/uyelik-planlari`.
- Cannot advance with zero tiers saved.

**Step 4 — Ödeme Bilgileri (`/onboarding/odeme`):**
- IBAN input (required): validated for Turkish IBAN format (TR + 24 digits).
- Account holder name (required): must match the name on the bank account.
- Informational note: "Bu bilgiler yalnızca kazançlarınızı almak için kullanılır. Hiçbir
  ödeme bu hesaptan çekilmez."
- On advance: IBAN saved; no real-time bank verification at MVP.

**Step 5 — Sözleşme Onayı (`/onboarding/sozlesme`):**
- Summary of key creator obligations (3–5 bullet points; not a replacement for the full text).
- Link to full creator agreement at `/legal/yaratici-sozlesmesi` (opens in new tab).
- Acceptance checkbox: "Yaratıcı Sözleşmesi'ni okudum ve kabul ediyorum." Required.
- Acceptance timestamp and version number stored server-side on submission.
- Cannot submit without checkbox checked.
- Primary CTA changes to "Kabul Et ve Gönder" on this step.

**Step 6 — Başvuru Gönderildi (`/onboarding/inceleme`):**
- Confirmation state — not an editable step.
- "Başvurunuz incelemede" headline.
- Explanation of what happens next: admin reviews application; creator will receive an email
  when approved; typical review time (e.g., 1–3 iş günü) if defined.
- "Profilini önizle" link: shows the creator's profile as it will appear (read-only preview).
- "Dashboard'a Git" button: shown but visually disabled and labelled "Onay bekleniyor" until
  admin approves. After approval, button becomes active.

---

**Key Components**

`OnboardingShell` (wizard wrapper with step indicator and back navigation),
`StepProgressBar`, `AvatarUploader`, `CoverImageUploader`, `CategorySelector`,
`ContentFormatCheckboxGroup`, `TierBuilderForm`, `TierPerkList`, `IBANInput`,
`AgreementAcceptanceCheckbox`, `SubmittedStateCard`, `DashboardPendingButton`

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Creator's last saved step (for resume) | Yes — determines initial redirect | Auth / creator profile API |
| Category taxonomy list | Yes — step 2 cannot render without it | Static config or taxonomy API |
| Content format list | No (can fallback to preset hardcoded list) | Static config |
| Creator agreement version / URL | Yes — step 5 must link to correct version | Legal module |
| Object storage pre-signed upload URL | Yes — step 1 cannot complete without it | Storage API |

---

**Empty States**

- **Step 3 — no tiers yet:** Show a "Henüz plan eklemediniz" message with the tier builder
  form immediately visible. The "Devam Et" button remains disabled until at least one tier
  is saved.
- **Step 6 — no preview available:** If step 1 data is incomplete (edge case), the
  "Profilini önizle" link is hidden. This should not be reachable under normal flow.

---

**Loading States**

- Avatar and cover image uploads: show an upload progress indicator in place of the image
  preview. "Devam Et" is disabled until the upload completes or fails.
- On "Kabul Et ve Gönder" submission (step 5): button enters loading state while the
  application is submitted to the backend. Redirect to step 6 on success.
- Each step loads instantly from saved state; no per-step loading skeleton needed unless
  the category taxonomy API is slow (show skeleton chips in that case).

---

**Error States**

- **File upload fails (step 1):** Inline error below the upload zone. "Dosya yüklenemedi.
  Lütfen tekrar deneyin." Retry without leaving the step.
- **IBAN format invalid (step 4):** Inline field error. "Geçerli bir IBAN girin (TR + 24 hane)."
- **Submission fails (step 5):** Toast error. "Başvuru gönderilemedi. Lütfen tekrar deneyin."
  Form remains intact; no data lost.
- **Session expires mid-flow:** On return, creator is redirected to their last saved step.
  Unsaved changes to the current step are lost.
- **Storage service unavailable (step 1):** Inline error on upload zone. Cannot advance.
  Page does not fail globally.

---

**Edge Cases**

- **Creator returns after partial completion:** Redirected to last saved step. Steps
  before the saved step are locked (cannot go back to re-edit them in a new session
  unless a "Geri Dön" flow is defined — flag as a product decision).
- **Creator completes step 3 with one tier then wants to add more:** Can add more tiers
  within the same step before advancing. Tiers are saved incrementally.
- **Creator submits application and admin rejects it:** A rejection state for step 6 is
  needed (distinct from "pending"). Rejection reason (if provided by admin) should be shown.
  Creator can amend and re-submit. This state is dependent on admin moderation tooling
  (Family 20).
- **Creator refreshes on step 6:** Page reloads correctly. Approval status is checked
  on load; if approved in the meantime, dashboard button becomes active.
- **Fan-role user navigates to `/onboarding` without a creator role:** Redirected to
  `/auth/kayit/yaratici` to initiate creator registration first.
- **Approved creator accidentally navigates to `/onboarding`:** Redirected to `/dashboard`.

---

**Permissions / Entitlement Rules**

- All `/onboarding/*` routes require an authenticated session with a creator role.
- A creator in `approved` status must not be able to access or re-submit the onboarding
  flow. Redirect to `/dashboard`.
- A creator in `rejected` status sees step 6 with a rejection state and can re-submit.
- Admin cannot access creator onboarding routes (separate namespace).
- Avatar and cover images stored in object storage must be served via authenticated
  pre-signed URLs or public CDN URLs — defined by storage policy, not this page.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `onboarding_started` | `creator_id`, `step: 'entry'` |
| `onboarding_step_completed` | `creator_id`, `step: 'profil' \| 'kategori' \| 'uyelik-planlari' \| 'odeme' \| 'sozlesme'` |
| `onboarding_step_back` | `creator_id`, `from_step`, `to_step` |
| `onboarding_tier_added` | `creator_id`, `tier_price_try`, `billing_interval: 'monthly' \| 'annual' \| 'both'` |
| `onboarding_submitted` | `creator_id`, `tier_count`, `category` |
| `onboarding_upload_failed` | `creator_id`, `step`, `file_type` |
| `onboarding_resumed` | `creator_id`, `resumed_at_step` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Auth / creator role session | Required — guards all routes |
| Object storage (file upload) | Required — step 1 cannot complete without it |
| Category taxonomy API | Required — step 2 content |
| Membership module | Required — step 3 saves tiers |
| Payout / banking module | Required — step 4 saves IBAN |
| [`/legal/yaratici-sozlesmesi`](./page-requirements-legal.md) | Linked from step 5 |
| Admin review queue (Family 20) | Downstream — receives submitted application |
| Email delivery service | Downstream — approval notification to creator |
| [`/dashboard`](#family-9--creator-dashboard-overview) | Post-approval destination |

---

## Creator Public-Facing

---

### Family 8 — Creator Public Page

**Routes:**
`/@[username]` (default tab: feed) ·
`/@[username]/gonderi` (feed tab) ·
`/@[username]/gonderi/[post-id]` (post detail sub-state) ·
`/@[username]/uyelik` (membership tab) ·
`/@[username]/magaza` (shop tab) ·
`/@[username]/magaza/[product-id]` (product detail sub-state) ·
`/@[username]/koleksiyonlar` (collections tab) ·
`/@[username]/koleksiyonlar/[collection-id]` (collection detail sub-state)

All routes above are sub-states of the same page family. Post detail, product detail, and
collection detail are routed sub-states (not modals); they share the same page shell and
tab navigation. They are **not** separate page family entries.

**Page Name:** Yaratıcı Sayfası

**Page Goal:** Convert visitors and fans into paying members or product purchasers by
clearly presenting the creator's identity, content, and membership tiers in a single
unified profile. Secondary goal: retain existing members by giving them a familiar home
for the creator's content.

**Primary User:** Unauthenticated visitor / authenticated fan. Authenticated creator sees
their own page with edit affordances.

**Access Level:** Fully public — no authentication required to view public content, browse
tiers, or read public posts. Subscribing, purchasing, or accessing gated content requires
an authenticated session. A visitor who clicks a gated CTA is redirected to login with
`?return=` pointing back to the relevant checkout or content URL.

**Primary CTA:**
- For visitor / logged-out user: "Üye Ol" on the membership tab or tier cards; "Satın Al"
  on product and collection items.
- For a fan with no active membership: "Üye Ol" (primary); "Takip Et" (free follow, secondary).
- For an active member: "İçeriklere Git" (goes to gonderi tab); tier badge shown on profile.
- For the creator viewing their own page: "Düzenle" (links to dashboard profile settings);
  "Sayfanı Paylaş" (copy link).

---

**Core Sections**

**Profile Header (all tabs):**
Persistent across all tabs. Contains: cover image (full-width banner), avatar (overlapping
the cover), display name, category badge, short bio, social links (if set), member count,
and starting tier price (or "Ücretsiz Takip Et" if no paid tiers). Primary CTA button
always visible in header.

**Tab Navigation (all tabs):**
Horizontal tab bar: Gönderiler · Üyelik · Mağaza · Koleksiyonlar.
Active tab reflected in URL path. Tabs with no content (zero published items) are shown
but display empty state, not hidden.

**Gönderiler Tab (`/@[username]` and `/@[username]/gonderi`):**
Reverse-chronological feed of all posts the creator has published.
Each post card shows: title, excerpt (truncated), access level badge (Herkese Açık / Üye /
Katman Adı / Premium), publish date, and media thumbnail if applicable.
- Public post: fully readable as a card; click expands to post detail.
- Member-only post: title and excerpt visible; body replaced by paywall card with "Üye Ol" CTA.
- Tier-gated post: same paywall treatment; shows the specific tier name required.
- Premium post: shows price; "Satın Al (X TL)" CTA.
- A fan holding the required tier sees the full post without a paywall card.

**Post Detail Sub-state (`/@[username]/gonderi/[post-id]`):**
Full post view within the creator page shell. Renders the post body, media, file attachments
(as download links for entitled users), and comments section (if implemented). Gated content
shows the paywall in place of the body. Back navigation returns to the feed tab.

**Üyelik Tab (`/@[username]/uyelik`):**
Full tier comparison layout. Each tier card shows: tier name, price per month and/or per
year, perk list (full, not truncated), member count for that tier, and "Üye Ol" CTA.
If the visitor is already a member of a tier, that tier card is marked "Aktif Üyeliğiniz"
with a "Yönet" link → `/account/uyeliklerim/[membership-id]`.

**Mağaza Tab (`/@[username]/magaza`):**
Grid of digital product cards. Each card: preview image, title, file format badge(s),
price (TRY), "Satın Al" CTA. Click → product detail sub-state.

**Product Detail Sub-state (`/@[username]/magaza/[product-id]`):**
Full product view: cover image, title, full description, file format details, price, "Satın Al"
CTA → `/checkout/urun/[product-id]`. If already purchased: "İndir" replaces the purchase CTA.
Back navigation returns to the shop tab.

**Koleksiyonlar Tab (`/@[username]/koleksiyonlar`):**
Grid of collection cards. Each card: cover image, title, item count, access type (purchase
price or tier name), "Satın Al" / "Üye Ol" CTA depending on access rule.

**Collection Detail Sub-state (`/@[username]/koleksiyonlar/[collection-id]`):**
Full collection view: cover image, title, description, item list (each item shown with its
title and a lock icon if not accessible to the viewer), access rule summary, purchase or
membership CTA. Entitled viewers see all items unlocked. Back to collections tab.

---

**Key Components**

`CreatorProfileHeader`, `TabNavigation`, `PostFeedList`, `PostCard`, `PaywallCard`,
`PostDetailView`, `TierComparisonGrid`, `TierCard`, `ActiveMemberBadge`, `ProductGrid`,
`ProductCard`, `ProductDetailView`, `CollectionGrid`, `CollectionCard`,
`CollectionDetailView`, `CollectionItemList`, `DownloadLink`, `SocialLinksRow`,
`ShareButton`, `EditAffordanceBar` (creator-only overlay)

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Creator profile (display name, bio, avatar, cover, category, social links) | Yes | Creator profile API |
| Creator status (approved / suspended) | Yes | Creator profile API |
| Published posts list (paginated) | Yes (for feed tab) | Feed API |
| Tier list (published, visible tiers) | Yes (for membership tab) | Membership API |
| Products list (published) | Yes (for shop tab) | Store API |
| Collections list (published) | Yes (for collections tab) | Collections API |
| Viewer's membership entitlements (if authenticated) | No — page renders without; content gating applied | Membership / entitlement API |
| Viewer's purchase history (if authenticated) | No — determines "İndir" vs "Satın Al" | Purchase API |
| Member count (total + per tier) | No — renders without; skeleton fallback | Creator stats API |

---

**Empty States**

- **Feed tab — no published posts:** "Henüz gönderi yok. Yakında içerik gelecek." No feed
  items. CTA to membership tab if tiers exist.
- **Shop tab — no published products:** "Henüz ürün yok." No product cards shown.
- **Collections tab — no published collections:** "Henüz koleksiyon yok." No cards shown.
- **Membership tab — no published tiers:** "Bu yaratıcı henüz üyelik planı oluşturmadı."
  Free follow option still available.
- Empty tabs are shown with their tab label visible; they do not disappear from the tab bar.

---

**Loading States**

- Profile header: skeleton for avatar, name, bio while creator profile loads. Cover image
  has a background color placeholder.
- Tab content: skeleton cards (post cards, product cards) while list data loads.
- Post detail, product detail, collection detail: skeleton layout while item data loads.
- All skeleton states render within the existing tab shell; layout does not shift on load.

---

**Error States**

- **Creator not found (`/@[username]` for an unknown username):** 404 page. "Bu yaratıcı
  bulunamadı." Link back to `/kesfet`.
- **Creator suspended:** Page renders header with creator name but body shows: "Bu yaratıcı
  şu anda erişilemez." No posts, tiers, products, or collections shown. No purchase CTAs.
- **Creator unapproved (pending or rejected):** Page returns 404 to all visitors except
  the creator themselves. The creator sees a preview of their page with an "Onay Bekleniyor"
  banner at the top.
- **Feed / API partial failure:** If a specific tab's data fails to load, show an inline
  error within that tab ("İçerik yüklenemedi. Yenile.") with a retry button. Other tabs
  remain functional.
- **Post detail not found:** If `[post-id]` does not exist under that creator, show an
  inline "Bu gönderi bulunamadı" message within the feed tab view. Do not 404 the whole page.

---

**Edge Cases**

- **Visitor clicks a gated post CTA while not logged in:** Redirected to `/auth/giris` with
  `?return=/@[username]/gonderi/[post-id]`. After login, returned to the post. After
  membership checkout if required, content is unlocked.
- **Creator views their own page:** Edit affordances appear (e.g., "Profilini Düzenle" button
  linking to dashboard settings). The page otherwise looks identical to the public view.
  The creator does not see paywalls on their own content.
- **Fan is a member but visits a post gated to a higher tier:** Paywall card shows the
  required tier name and an "Yükselt" link → `/uyelik/[membership-id]/yuksel` (post-launch).
  At MVP (no tier upgrade flow), paywall card shows a "Bu katmana üye ol" CTA instead.
- **Creator has tiers but no published posts:** Feed tab shows empty state. Membership tab
  is functional. Visitor can still subscribe.
- **Creator changes username:** The old `/@oldusername` URL must return a redirect to
  `/@newusername`. Username changes are admin-only; this redirect is a backend concern.
- **Fan has purchased a product and creator unpublishes it:** Download link remains
  accessible to the purchaser (if policy is to retain access for prior purchasers — see
  assumption 3). If conservative policy, product page shows "Bu ürün artık mevcut değil"
  with no purchase option; existing purchasers lose the download.

---

**Permissions / Entitlement Rules**

| Content Type | Visitor (no auth) | Authenticated fan (no membership) | Active member (correct tier) | Creator (own page) |
|---|---|---|---|---|
| Public post | Full access | Full access | Full access | Full access |
| Member-only post | Paywall card | Paywall card | Full access | Full access |
| Tier-gated post | Paywall card | Paywall card | Full access if tier matches; paywall if not | Full access |
| Premium post | Paywall card (price shown) | Paywall card | Paywall (unless also purchased) | Full access |
| Product listing | Visible, "Satın Al" CTA | Visible, "Satın Al" CTA | Visible, "Satın Al" CTA | Visible |
| Purchased product | — | "İndir" after purchase | "İndir" after purchase | "İndir" |
| Collection (purchase type) | Visible, "Satın Al" | Visible, "Satın Al" | Visible, "Satın Al" | Visible |
| Collection (tier-gated) | Locked summary | Locked summary | Full access if tier matches | Full access |

- Suspended creator: no content visible to any visitor regardless of entitlement.
- Unapproved creator: content not visible to anyone except the creator themselves.
- Member count and tier prices: always visible to everyone.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `creator_page_viewed` | `creator_id`, `username`, `viewer_role: 'visitor' \| 'fan' \| 'member' \| 'creator'`, `active_tab` |
| `creator_tab_switched` | `creator_id`, `from_tab`, `to_tab` |
| `tier_card_cta_clicked` | `creator_id`, `tier_id`, `tier_price_try`, `billing_interval`, `viewer_role` |
| `free_follow_clicked` | `creator_id`, `viewer_role` |
| `post_opened` | `creator_id`, `post_id`, `access_level`, `viewer_entitled: true \| false` |
| `paywall_card_shown` | `creator_id`, `post_id`, `access_level`, `required_tier_id` (if tier-gated) |
| `paywall_cta_clicked` | `creator_id`, `post_id`, `cta_type: 'subscribe' \| 'purchase'` |
| `product_card_clicked` | `creator_id`, `product_id`, `price_try` |
| `product_purchase_cta_clicked` | `creator_id`, `product_id`, `price_try` |
| `collection_card_clicked` | `creator_id`, `collection_id`, `access_type: 'purchase' \| 'tier'` |
| `creator_page_share_clicked` | `creator_id` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Creator profile API | Required — page cannot render without it |
| Feed / posts API | Required — gonderi tab content |
| Membership API | Required — uyelik tab content |
| Store API | Required — magaza tab content |
| Collections API | Required — koleksiyonlar tab content |
| Entitlement / access control service | Required — determines which content is gated |
| Auth session | Non-blocking — page renders without auth |
| [`/auth/giris`](./page-requirements-public-auth.md) | Destination for unauthenticated gated CTAs |
| [`/checkout/uyelik/...`](./page-requirements-checkout.md) | Destination for "Üye Ol" CTAs |
| [`/checkout/urun/...`](./page-requirements-checkout.md) | Destination for product "Satın Al" CTAs |
| [`/checkout/koleksiyon/...`](./page-requirements-checkout.md) | Destination for collection "Satın Al" CTAs |
| [`/kesfet`](./page-requirements-public-auth.md) | Back-link from 404 state |
| Creator profile edit destination (TBD — `/dashboard/ayarlar/profil` is post-launch; edit affordance links to an in-scope route to be determined) | Edit affordance on creator's own page view |

---

## Creator Dashboard

---

### Family 9 — Creator Dashboard Overview

**Route:** `/dashboard`

**Page Name:** Genel Bakış

**Page Goal:** Give an approved creator an at-a-glance view of their platform health —
revenue, membership activity, and recent events — and route them quickly to the most
common creation and management tasks.

**Primary User:** Authenticated creator; approved status

**Access Level:** Auth-required; creator role; approved status required. An unapproved
creator who navigates to `/dashboard` is redirected to their last saved onboarding step.
A fan without a creator role cannot access `/dashboard/*` routes.

**Primary CTA:** "Gönderi Oluştur" → `/dashboard/gonderiler/yeni`

---

**Core Sections**

1. **Revenue Summary Widget** — Current month earnings (TRY), all-time total (TRY), next
   scheduled payout date. These figures are approximate/estimated pending settlement.
   If payout method is not connected: widget shows "Ödeme yöntemi bağlı değil" in place
   of the earnings figures.

2. **Member Stats Widget** — Total active members, new members this month (count + trend
   indicator vs. previous month), tier breakdown (list of tier names with subscriber
   counts). Collapsed to summary if more than 3 tiers; expandable.

3. **Quick Actions Bar** — Three primary action shortcuts:
   - "Gönderi Oluştur" → `/dashboard/gonderiler/yeni`
   - "Plan Ekle" → `/dashboard/uyelik-planlari/yeni`
   - "Ürün Ekle" → `/dashboard/magaza/yeni`

4. **Recent Activity Feed** — Last 10 platform events in reverse chronological order.
   Event types: yeni üye (new membership), üyelik iptali (cancellation), yeni satın alma
   (product purchase), gönderi yayınlandı (post published). Each event shows a brief label
   and a timestamp. Links to the relevant management page where applicable.

5. **Payout Method Missing Banner** — Shown only if the creator has not connected a payout
   method. Prominent inline warning above the revenue widget: "Kazançlarınızı almak için
   ödeme bilgilerinizi ekleyin." The banner is informational at MVP — it surfaces the missing
   payout method state without linking to a dedicated management page, since
   `/dashboard/odeme` is a deferred route. No CTA link at launch. Payout information is
   collected during onboarding step 4 (`/onboarding/odeme`); updating it post-onboarding
   has no in-scope route at MVP.

---

**Key Components**

`RevenueSummaryWidget`, `MemberStatsWidget`, `TierBreakdownList`, `QuickActionsBar`,
`QuickActionButton`, `ActivityFeedList`, `ActivityFeedItem`, `PayoutMissingBanner`,
`WelcomeHeroCard` (first-visit only), `DashboardLayout` (sidebar nav + content area)

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Creator's approved status | Yes — guards the page | Creator profile API |
| Current month earnings (TRY) | No — widget shows skeleton then data | Revenue / billing API |
| All-time total earnings (TRY) | No | Revenue / billing API |
| Next payout date | No | Payout schedule API |
| Total active members | No | Membership API |
| New members this month | No | Membership API |
| Tier breakdown (name + count) | No | Membership API |
| Recent activity events (last 10) | No | Activity / event log API |
| Payout method connected status | No | Payout module |

---

**Empty States**

- **First-visit (day 1 after approval):** Replace the recent activity feed and quick actions
  bar with a welcome card: "Yaratıcı sayfanız hazır! İlk gönderinizi oluşturun ve kitlenizle
  paylaşın." Primary CTA: "İlk Gönderini Oluştur" → `/dashboard/gonderiler/yeni`.
  Revenue and member widgets show zeros — do not hide them.
- **Zero active members:** Member stats widget shows "0 aktif üye" with a "Sayfanı Paylaş"
  shortcut (copies `/@username` to clipboard).
- **No recent activity:** Activity feed shows "Henüz aktivite yok."
- **No earnings yet:** Revenue widget shows "₺0,00" — not hidden.

---

**Loading States**

- Revenue widget: skeleton numbers while API loads. Widget shell and labels render
  immediately.
- Member stats widget: skeleton counts and tier rows.
- Activity feed: 5–10 skeleton rows.
- Quick actions bar: renders immediately (static links; no data dependency).

---

**Error States**

- **Revenue API fails:** Widget shows "Gelir bilgisi yüklenemedi. Yenile." with a retry
  button. Other widgets are unaffected.
- **Membership API fails:** Member stats widget shows the same inline error + retry.
- **Activity feed fails:** "Aktivite geçmişi yüklenemedi. Yenile." Other widgets unaffected.
- **Creator status check fails on load:** Redirect to login if session is invalid.

---

**Edge Cases**

- **Creator has no published tiers:** Member stats widget still shows. Payout method banner
  is irrelevant but can appear if IBAN is missing.
- **Creator is suspended after previously being approved:** Dashboard access is blocked.
  Creator redirected to a "Hesabınız askıya alındı" page (a state within the dashboard shell
  or a standalone suspension notice page — flag as a product decision).
- **Dashboard accessed from a mobile browser:** Sidebar nav collapses to a hamburger menu.
  Widgets stack vertically. Quick actions bar remains accessible. All widgets readable.
- **Revenue data has a processing delay:** Show a footnote "Son güncelleme: [timestamp]"
  below the revenue widget to set expectations.

---

**Permissions / Entitlement Rules**

- Only authenticated users with a creator role AND approved status can access `/dashboard`.
- Unapproved creator → redirect to `/onboarding` last step.
- Fan role without creator role → redirect to `/account/kutuphane` or deny with 403.
- Revenue and payout data visible only to the creator who owns it. Never exposed to fans
  or other creators.
- Member count and tier breakdown on the dashboard are the creator's own data only.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `dashboard_overview_viewed` | `creator_id`, `active_member_count`, `has_payout_method: true \| false` |
| `quick_action_clicked` | `creator_id`, `action: 'new_post' \| 'new_plan' \| 'new_product'` |
| `payout_missing_banner_cta_clicked` | `creator_id` |
| `welcome_card_cta_clicked` | `creator_id` |
| `activity_feed_item_clicked` | `creator_id`, `event_type`, `event_id` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Auth session + creator role + approved status | Required — page guard |
| Revenue / billing API | Non-blocking — widget data |
| Membership API | Non-blocking — member stats |
| Payout schedule API | Non-blocking — next payout date |
| Activity / event log API | Non-blocking — recent activity |
| Payout module (IBAN status) | Non-blocking — banner condition |
| [`/dashboard/gonderiler/yeni`](#family-10--posts-management) | Quick action destination |
| [`/dashboard/uyelik-planlari/yeni`](#family-11--membership-plans) | Quick action destination |
| [`/dashboard/magaza/yeni`](#family-12--products--collections-management) | Quick action destination |
| [`/onboarding`](#family-7--creator-onboarding-flow) | Redirect destination for unapproved creators |

---

### Family 10 — Posts Management

**Routes:**
`/dashboard/gonderiler` (list) ·
`/dashboard/gonderiler/yeni` (new post) ·
`/dashboard/gonderiler/[post-id]/duzenle` (edit post)

**Page Name:** Gönderiler Yönetimi (Gönderilerim · Yeni Gönderi · Gönderiyi Düzenle)

**Page Goal:** Allow a creator to manage their full content output — list, create, edit,
publish, schedule, draft, and delete posts — with full control over access levels and
content types.

**Primary User:** Authenticated creator; approved status

**Access Level:** Auth-required; creator role; approved status required. Same guard as
dashboard overview.

**Primary CTA:** "Yeni Gönderi" → `/dashboard/gonderiler/yeni` (from list page);
"Yayınla" (from editor, when publishing immediately)

---

**Core Sections**

**List Page (`/dashboard/gonderiler`):**

1. **Page Header** — "Gönderilerim" title + "Yeni Gönderi" primary action button.

2. **Filter Bar** — Two filter groups:
   - Status: Tümü / Yayınlı / Taslak / Planlanmış
   - Access level: Tümü / Herkese Açık / Üye / Katman-Kilitli / Premium
   Filters are applied as AND logic. Active filters shown with clear/reset option.

3. **Post List** — One row per post. Each row: title, access level badge (color-coded),
   publish date or "Taslak" / "Planlanmış: [date]", view count (published posts only),
   edit button, delete button. Clicking the title previews the post on the creator public
   page (opens in new tab).

4. **Bulk Actions** — Checkbox per row; bulk delete with confirmation modal.

5. **Pagination** — Page-based navigation; default 20 posts per page.

---

**New Post Editor (`/dashboard/gonderiler/yeni`) and Edit Post (`/dashboard/gonderiler/[post-id]/duzenle`):**

1. **Editor Toolbar** — Rich text formatting: bold, italic, headings (H2, H3), bullet list,
   numbered list, blockquote, link, inline image insertion.

2. **Post Title Field** — Plain text, required. Character limit: 200.

3. **Rich Text Body** — Main content area. Supports inline images (uploaded to storage).
   No minimum length required.

4. **Media and File Attachments Panel** — Separate from inline body images.
   Upload files of any type (PDF, ZIP, audio, video, etc.). Each file is listed as a named
   downloadable attachment. Entitled viewers see download links; others see locked icons.
   Maximum upload size defined by storage policy (not this document).

5. **Access Level Picker** — Required. Options:
   - Herkese Açık: visible and readable by all visitors
   - Üye: any active member (any paid tier) can read
   - Katman-Kilitli: dropdown appears to select which tier is required; only members of
     that tier or higher can read
   - Premium: price input (TRY, > 0); fans purchase one-time access

6. **Schedule Controls** — Toggle: "Şimdi Yayınla" (default) vs. "Planla". When planned,
   a date-time picker appears (Turkey timezone, Europe/Istanbul). A scheduled post is saved
   with status `planned`; it publishes automatically at the set time via a background job.

7. **Auto-save Indicator** — Shows "Kaydediliyor..." during auto-save and "Taslak kaydedildi [time]"
   after. Auto-save triggers 5 seconds after the last keystroke on any field.

8. **Preview Toggle** — "Ziyaretçi olarak gör" shows the post as a logged-out visitor would
   see it (respects access level — shows paywall if tier-gated). "Üye olarak gör" shows the
   full post body.

9. **Publish / Save Actions** — Primary button: "Yayınla" (publishes immediately or schedules
   if a future date is set). Secondary button: "Taslak Kaydet" (saves without publishing).

---

**Key Components**

`PostListTable`, `PostStatusBadge`, `PostAccessBadge`, `PostFilterBar`, `BulkDeleteControl`,
`RichTextEditor`, `PostTitleInput`, `FileAttachmentUploader`, `FileAttachmentList`,
`AccessLevelPicker`, `TierSelectDropdown`, `PremiumPriceInput`, `ScheduleToggle`,
`DateTimePicker`, `AutoSaveIndicator`, `PostPreviewToggle`, `PublishButton`,
`CollectionMembershipWarningModal`, `DeleteConfirmModal`

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Post list (paginated, filtered) | Yes — list page | Feed API |
| Creator's tier list (for tier-gated option) | Yes — editor cannot show tier picker without it | Membership API |
| Existing post data (for edit) | Yes — edit page | Feed API (single post) |
| Collections that contain the post being edited | No — needed for warning | Collections API |
| Object storage pre-signed upload URL | Yes — file attachments | Storage API |

---

**Empty States**

- **No posts yet (list page):** "Henüz gönderi oluşturmadınız." Full-width CTA card:
  "İlk Gönderini Oluştur" → `/dashboard/gonderiler/yeni`.
- **Filtered result is empty:** "Bu filtrelere uyan gönderi bulunamadı." Clear filters link.
- **No tiers created (tier-gated option in editor):** The Katman-Kilitli option is
  disabled in the access level picker with a tooltip: "Üyelik planı oluşturun." Link to
  `/dashboard/uyelik-planlari/yeni`.

---

**Loading States**

- Post list: skeleton rows while paginated data loads.
- Editor (edit mode): skeleton form while existing post data loads. Title and body fields
  show placeholder skeleton blocks. Access level picker shows a spinner until tier list loads.
- File upload: per-file progress indicator in the attachment list. Upload completes before
  the post can be published (file URL must be resolved).

---

**Error States**

- **File upload fails:** Inline error below the attachment. "Dosya yüklenemedi. Tekrar deneyin."
  Other fields and the rest of the post are unaffected.
- **Publish fails:** Toast error. "Gönderi yayınlanamadı. Lütfen tekrar deneyin." Post
  remains in draft state. Form is intact.
- **Auto-save fails:** Auto-save indicator changes to "Kaydedilemedi — [Tekrar dene]" link.
  No data is lost from the current editor state.
- **Post not found (edit route):** "Bu gönderi bulunamadı." Link back to post list.
- **Scheduled publish background job fails:** Post remains in `planned` status. Creator
  receives an email notification ("Planlanmış gönderiniz yayınlanamadı"). Dashboard shows
  the post in an error state in the list.

---

**Edge Cases**

- **Creator changes access level on a post that is in a collection:** A modal warning appears:
  "Bu gönderi bir koleksiyonda yer alıyor. Erişim seviyesini değiştirmek koleksiyonun
  görünürlüğünü etkileyebilir. Devam etmek istiyor musunuz?" Confirm proceeds; cancel aborts.
- **Creator deletes a post that is in a collection:** Confirmation modal adds: "Bu gönderi
  X koleksiyonunda yer alıyor. Silerseniz koleksiyondan da kaldırılacak." Confirm proceeds.
- **Tier-gated post references a tier that is later deleted:** Post becomes inaccessible to
  all (no tier matches). Creator receives an email warning. Post should be surfaced in the
  list with a "Tier silinmiş — Güncelle" badge.
- **Creator has no active tiers and tries to create a tier-gated post:** Access level picker
  disables the Katman-Kilitli option with a tooltip as described in empty states.
- **Scheduled post time passes while creator is in the editor:** The post publishes in the
  background. Next time the creator views the list, the post shows as `Yayınlı`.
- **Creator unpublishes a post:** Post status changes to `taslak`. Members immediately lose
  access. The post is no longer visible on the creator public page.

---

**Permissions / Entitlement Rules**

- Only the post's owning creator can create, edit, or delete their posts.
- Posts with status `taslak` are not visible on the creator public page to any viewer.
- Posts with status `planlanmış` are not visible until the scheduled publish time.
- Premium posts require a valid price > 0. The platform fee applies to premium post purchases
  (same as product purchases — billing module concern, not this page).
- File attachments are served as authenticated download URLs to entitled users only. The
  storage layer enforces this; the page surfaces the link or a lock icon based on entitlement.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `post_list_viewed` | `creator_id`, `filter_status`, `filter_access_level`, `post_count` |
| `post_editor_opened` | `creator_id`, `mode: 'new' \| 'edit'`, `post_id` (edit only) |
| `post_published` | `creator_id`, `post_id`, `access_level`, `has_attachments: true \| false`, `scheduled: true \| false` |
| `post_draft_saved` | `creator_id`, `post_id`, `access_level` |
| `post_deleted` | `creator_id`, `post_id`, `was_published: true \| false` |
| `post_unpublished` | `creator_id`, `post_id` |
| `post_access_level_changed` | `creator_id`, `post_id`, `old_level`, `new_level` |
| `post_attachment_uploaded` | `creator_id`, `file_type`, `file_size_kb` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Auth session + creator role + approved status | Required — page guard |
| Feed API | Required — list and editor |
| Membership API | Required — tier list for access level picker |
| Collections API | Non-blocking — collection membership warning in editor |
| Object storage | Required — file attachment uploads |
| Scheduling background job | Required — planned posts |
| Email delivery service | Required — scheduled publish failure notification |
| [`/dashboard`](#family-9--creator-dashboard-overview) | Back-link from editor |
| [`/dashboard/uyelik-planlari/yeni`](#family-11--membership-plans) | Tooltip link when no tiers exist |

---

### Family 11 — Membership Plans

**Routes:**
`/dashboard/uyelik-planlari` (list) ·
`/dashboard/uyelik-planlari/yeni` (new tier) ·
`/dashboard/uyelik-planlari/[tier-id]/duzenle` (edit tier)

**Page Name:** Üyelik Planları (Planlarım · Yeni Plan · Planı Düzenle)

**Page Goal:** Allow a creator to define, manage, and adjust the membership tiers they
offer — including names, prices, billing intervals, perks, and visibility — and to
understand how each tier is performing in terms of subscriber count and revenue.

**Primary User:** Authenticated creator; approved status

**Access Level:** Auth-required; creator role; approved status required.

**Primary CTA:** "Yeni Plan Ekle" → `/dashboard/uyelik-planlari/yeni` (from list page);
"Planı Kaydet" (from new/edit form)

---

**Core Sections**

**List Page (`/dashboard/uyelik-planlari`):**

1. **Page Header** — "Üyelik Planlarım" title + "Yeni Plan Ekle" primary action button.

2. **Tier Card List** — One card per tier in the creator's current display order.
   Each card: tier name, visibility badge (Görünür / Gizli), monthly price (TRY),
   annual price (TRY) if set, active subscriber count, monthly revenue from this tier,
   edit link, delete button (blocked if active subscribers exist).

3. **Reorder Controls** — Up/down arrow controls per card (or drag handle for drag-to-reorder).
   Order determines display sequence on the creator public page (`/@[username]/uyelik` tab).
   Order is saved immediately on change.

4. **Plan Limit Notice** — If creator has reached the practical tier limit (e.g., 5), show
   "En fazla 5 plan ekleyebilirsiniz." and disable the "Yeni Plan Ekle" button.

---

**New Tier Form (`/dashboard/uyelik-planlari/yeni`) and Edit Tier Form (`/dashboard/uyelik-planlari/[tier-id]/duzenle`):**

1. **Tier Name** — Required. Shown on creator public page. Character limit: 60.

2. **Short Description** — Optional. Shown below tier name on public page. Character limit: 200.

3. **Monthly Price (TRY)** — Required; must be > 0. Displayed as the primary price on the
   creator public page.

4. **Annual Price (TRY)** — Optional. If provided, shown as an alternative billing option
   alongside the monthly price. Should be less than 12× the monthly price to be shown as
   a discount.

5. **Perk List** — One or more perk items (plain text, each ≤ 100 characters). At least one
   required. Add/remove items dynamically. Rendered as a bulleted list on the creator public
   page.

6. **Visibility** — Toggle: Görünür (appears on creator public page) vs. Gizli (hidden from
   public; accessible by direct link only). Default: Görünür.

7. **Save Action** — "Planı Kaydet" (new) / "Değişiklikleri Kaydet" (edit). Redirects to
   list page on success.

**Edit-specific additions:**
- If active subscribers exist and the price is changed: an impact warning modal appears before
  saving: "Bu değişiklik X aktif aboneyi etkiler. Yeni fiyat, bir sonraki fatura döneminde
  geçerli olur. Devam etmek istiyor musunuz?" Confirm proceeds; cancel keeps the previous
  price.
- Name, description, and perk changes: take effect immediately without a warning. Existing
  subscribers are not shown a notification (platform concern, not this page).

---

**Key Components**

`TierCardList`, `TierCard`, `TierOrderControls`, `TierLimitNotice`,
`TierNameInput`, `TierDescriptionInput`, `TierPriceInput` (monthly + annual),
`TierPerkListEditor`, `TierPerkItem`, `VisibilityToggle`, `PriceChangeWarningModal`,
`DeleteTierButton`, `DeleteBlockedTooltip`

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Creator's tier list (for list page) | Yes | Membership API |
| Active subscriber count per tier (for list page) | No — renders without; shows "–" if unavailable | Membership API |
| Revenue per tier (for list page) | No | Revenue / billing API |
| Existing tier data (for edit form) | Yes | Membership API (single tier) |
| Creator's current tier count (for limit check) | No — renders "Yeni Plan Ekle" regardless; check on submit | Membership API |

---

**Empty States**

- **No tiers yet (list page):** "Henüz üyelik planı oluşturmadınız." Full-width CTA card:
  "İlk Planını Oluştur" → `/dashboard/uyelik-planlari/yeni`.

---

**Loading States**

- Tier card list: skeleton cards while data loads. 2–3 skeleton cards shown.
- Edit form: skeleton fields while tier data loads. Save button disabled until data is ready.

---

**Error States**

- **Save fails (new or edit):** Toast error. "Plan kaydedilemedi. Lütfen tekrar deneyin."
  Form remains intact with all entered data preserved.
- **Delete fails:** Toast error. "Plan silinemedi. Lütfen tekrar deneyin."
- **Tier not found (edit route):** "Bu plan bulunamadı." Link back to list.
- **Tier limit reached on submit:** If the limit is checked server-side, return an inline
  error at the top of the form: "En fazla 5 plan ekleyebilirsiniz."

---

**Edge Cases**

- **Creator tries to delete a tier with active subscribers:** Delete button is disabled with
  a tooltip: "Bu planın X aktif abonesi var. Tüm abonelikler sona erene kadar silemezsiniz."
- **Creator hides a tier with active subscribers:** Allowed without a warning at MVP (hidden
  tiers do not surface in public tier comparison; existing subscribers continue to be billed
  and retain access until they cancel).
- **Creator sets annual price higher than 12× monthly:** Validate and show inline warning:
  "Yıllık fiyat aylık fiyatın 12 katından yüksek. İndirim gösterilmeyecek." Allow save but
  do not show the annual option as discounted on the public page.
- **Creator reduces price below a previous paid level:** Same impact warning modal as price
  increase. The new (lower) price takes effect at the next billing cycle.
- **All tiers are hidden:** Creator public page membership tab shows no visible tiers.
  Display "Bu yaratıcı şu anda aktif üyelik planı sunmuyor." to visitors.

---

**Permissions / Entitlement Rules**

- A creator can only manage their own tiers.
- Tiers in `gizli` (hidden) status are not shown on the creator public page but existing
  subscriptions to hidden tiers remain active.
- Deleting a tier requires zero active subscribers. The membership module enforces this.
- Price changes take effect at the next billing cycle; the billing module handles proration
  (or absence of it) — not this page.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `tier_list_viewed` | `creator_id`, `tier_count` |
| `tier_create_started` | `creator_id` |
| `tier_created` | `creator_id`, `tier_id`, `price_monthly_try`, `price_annual_try` (if set), `perk_count`, `visibility` |
| `tier_edited` | `creator_id`, `tier_id`, `fields_changed: string[]` |
| `tier_price_change_confirmed` | `creator_id`, `tier_id`, `old_price_try`, `new_price_try`, `active_subscriber_count` |
| `tier_deleted` | `creator_id`, `tier_id` |
| `tier_visibility_toggled` | `creator_id`, `tier_id`, `new_visibility: 'visible' \| 'hidden'` |
| `tier_reordered` | `creator_id`, `tier_id`, `new_position` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Auth session + creator role + approved status | Required — page guard |
| Membership API | Required — list and forms |
| Revenue / billing API | Non-blocking — revenue per tier on list |
| Membership billing module | Downstream — executes price change on next cycle |
| [`/dashboard`](#family-9--creator-dashboard-overview) | Back-link and quick action source |
| [`/@[username]/uyelik`](#family-8--creator-public-page) | Public display of tiers (affected by reorder and visibility) |

---

### Family 12 — Products & Collections Management

**Routes:**

*Mağaza sub-section:*
`/dashboard/magaza` (shop list) ·
`/dashboard/magaza/yeni` (new product) ·
`/dashboard/magaza/[product-id]/duzenle` (edit product)

*Koleksiyonlar sub-section:*
`/dashboard/koleksiyonlar` (collections list) ·
`/dashboard/koleksiyonlar/yeni` (new collection) ·
`/dashboard/koleksiyonlar/[collection-id]/duzenle` (edit collection)

**Page Name:** Ürünler ve Koleksiyonlar (Mağazam · Yeni Ürün · Ürünü Düzenle ·
Koleksiyonlarım · Yeni Koleksiyon · Koleksiyonu Düzenle)

**Page Goal:** Allow a creator to upload and manage digital products for sale, and to
curate content collections that can be purchased or gated by membership tier. Both are
managed from a single dashboard section with two sub-areas accessible via the sidebar.

**Primary User:** Authenticated creator; approved status

**Access Level:** Auth-required; creator role; approved status required.

**Primary CTA:** "Yeni Ürün Ekle" → `/dashboard/magaza/yeni` (shop list);
"Yeni Koleksiyon" → `/dashboard/koleksiyonlar/yeni` (collections list);
"Ürünü Yayınla" (new/edit product); "Koleksiyonu Yayınla" (new/edit collection)

---

**Core Sections**

---

**Shop List (`/dashboard/magaza`):**

1. **Page Header** — "Mağazam" title + "Yeni Ürün Ekle" primary action.

2. **Product List** — One row per product. Each row: cover image thumbnail, title,
   file format badge(s) (PDF, ZIP, MP3, etc.), price (TRY), sales count, download count,
   status badge (Yayınlı / Taslak), edit button, unpublish/republish toggle, delete button.

3. **Filter** — Status filter: Tümü / Yayınlı / Taslak. Single filter; no multi-filter needed
   at MVP.

---

**New Product Form (`/dashboard/magaza/yeni`) and Edit Product Form (`/dashboard/magaza/[product-id]/duzenle`):**

1. **Primary File Upload** — Required. Accepts any file type. Drag-and-drop or file picker.
   The uploaded file is what purchasers download. Stored in object storage with authenticated
   access. Shows file name, size, and format after upload.

2. **Additional Files** — Optional. Up to 5 additional files (e.g., source file + export + license).
   Each shows as a named downloadable in the product detail view.

3. **Cover / Preview Image** — Optional. Shown as the product card image in the shop.
   If not provided, a generic file-type icon is shown instead.

4. **Title** — Required. Character limit: 120. Shown on product card and detail view.

5. **Description** — Required. Rich text minimal (bold, lists, links). Shown on product
   detail page. Character limit: 2000.

6. **Price (TRY)** — Required; must be > 0. Free products are not supported at MVP.

7. **Status Toggle** — Publish immediately or save as draft.

8. **Save Actions** — "Ürünü Yayınla" (publish) or "Taslak Olarak Kaydet".

---

**Collections List (`/dashboard/koleksiyonlar`):**

1. **Page Header** — "Koleksiyonlarım" title + "Yeni Koleksiyon" primary action.

2. **Collection List** — One row per collection. Each row: cover image thumbnail, title,
   item count, access type badge (Satın Alma: X TL / Katman: [tier name]), revenue (if
   purchasable; sum of completed purchases), status badge (Yayınlı / Taslak), edit button,
   delete button.

---

**New Collection Form (`/dashboard/koleksiyonlar/yeni`) and Edit Collection Form (`/dashboard/koleksiyonlar/[collection-id]/duzenle`):**

1. **Title** — Required. Character limit: 120.

2. **Short Description** — Optional. Character limit: 400. Shown on collection card.

3. **Cover Image** — Optional. Shown on collection card. Fallback to first assigned item's
   thumbnail if not provided.

4. **Content Assignment** — Multi-select from the creator's existing published posts and
   published products. Each assigned item shows its title and its own access level as an
   informational note (e.g., "Bu gönderi zaten Üye katmanına kilitli — koleksiyona eklenmesi
   erişimi genişletmez"). Items can be reordered within the collection.
   Cannot publish with zero items assigned.

5. **Access Rule** — Mutually exclusive selection:
   - **Satın Alma:** Fans pay a one-time price (TRY, > 0) to unlock all items in the
     collection. Price input required.
   - **Katman Kapısı:** Select a tier from a dropdown (creator's published tiers only).
     Members of the selected tier or any higher-priced tier get access.
   When "Katman Kapısı" is selected, the price input disappears. When "Satın Alma" is
   selected, the tier dropdown disappears.

6. **Status Toggle** — Publish immediately or save as draft.

7. **Save Actions** — "Koleksiyonu Yayınla" or "Taslak Olarak Kaydet".

---

**Key Components**

`ProductListTable`, `ProductStatusBadge`, `FileFormatBadge`, `ProductFilterBar`,
`FileUploadZone`, `AdditionalFilesUploader`, `CoverImageUploader`, `ProductTitleInput`,
`ProductDescriptionEditor`, `ProductPriceInput`, `ProductStatusToggle`,
`CollectionListTable`, `CollectionItemCountBadge`, `CollectionAccessTypeBadge`,
`CollectionTitleInput`, `CollectionDescriptionInput`, `CollectionContentSelector`,
`CollectionItemList`, `CollectionItemOrderControls`, `AccessRuleSelector`,
`CollectionPriceInput`, `TierGateSelector`, `DeleteProductWarningModal`,
`DeleteCollectionConfirmModal`, `ProductInCollectionWarningModal`

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Product list (paginated) | Yes — shop list | Store API |
| Collection list (paginated) | Yes — collections list | Collections API |
| Existing product data (edit form) | Yes | Store API (single product) |
| Existing collection data (edit form) | Yes | Collections API (single collection) |
| Creator's published posts (for content assignment) | Yes — collections new/edit | Feed API |
| Creator's published products (for content assignment) | Yes — collections new/edit | Store API |
| Creator's published tiers (for tier gate selector) | Yes — collections new/edit | Membership API |
| Collections that contain a product (for delete warning) | No | Collections API |
| Object storage pre-signed upload URL | Yes — file uploads | Storage API |

---

**Empty States**

- **No products yet (shop list):** "Henüz ürün eklemediniz." CTA card: "İlk Ürününü Ekle"
  → `/dashboard/magaza/yeni`.
- **No collections yet (collections list):** "Henüz koleksiyon oluşturmadınız." CTA card:
  "İlk Koleksiyonunu Oluştur" → `/dashboard/koleksiyonlar/yeni`.
- **Content assignment — no published posts or products exist:** "Koleksiyona ekleyebileceğiniz
  yayınlanmış içerik bulunamadı. Önce bir gönderi veya ürün yayınlayın." Cannot save collection
  until items are assigned.
- **No tiers for tier-gate selector:** Tier gate option is disabled with tooltip: "Üyelik planı
  oluşturun." Link to `/dashboard/uyelik-planlari/yeni`.

---

**Loading States**

- Product list: skeleton rows while data loads.
- Collections list: skeleton rows while data loads.
- New/edit forms: form fields render immediately for new forms. For edit forms, skeleton
  fields while existing data loads.
- File upload: per-file progress bar. Publish button disabled until primary file upload
  completes.
- Content assignment picker: skeleton list while post/product/tier data loads.

---

**Error States**

- **File upload fails (product form):** Inline error below upload zone. "Dosya yüklenemedi.
  Tekrar deneyin." Cannot publish until primary file upload succeeds.
- **Product save/publish fails:** Toast error. Form intact with all data preserved.
- **Collection save/publish fails:** Toast error. Form intact.
- **Product not found (edit route):** "Bu ürün bulunamadı." Link to shop list.
- **Collection not found (edit route):** "Bu koleksiyon bulunamadı." Link to collections list.
- **Tier gate selector: referenced tier deleted after collection was created:** Collection
  edit form shows inline warning: "Seçili üyelik katmanı artık mevcut değil. Lütfen
  güncelleyin." Cannot re-publish without selecting a valid tier.

---

**Edge Cases**

- **Creator deletes a product that is assigned to a collection:** Confirmation modal: "Bu ürün
  X koleksiyonunda yer alıyor. Silerseniz koleksiyondan da kaldırılacak." Confirm proceeds;
  collection item count decreases. If the collection becomes empty as a result, it is
  automatically moved to draft status.
- **Creator unpublishes a product:** Product no longer appears in the shop tab on the creator
  public page. The effect on prior purchasers is a pending policy decision (see assumption 3
  — Option A: prior purchasers lose download access; Option B: prior purchasers retain
  access). Access to downloaded files is enforced at the storage layer depending on the
  chosen policy.
- **Creator assigns a member-only post to a "Satın Alma" collection:** The content
  assignment form shows a note: "Bu gönderi zaten üye kitlesi gerektiriyor. Koleksiyona
  eklenmesi erişim kuralını değiştirmez; gönderi yalnızca aktif üyelerin koleksiyonu
  satın almasıyla erişilebilir olur." This is a flag for product decision — the interaction
  between post-level gating and collection-level gating needs explicit policy.
- **Creator changes access rule from "Satın Alma" to "Katman Kapısı" on a published collection:**
  Existing purchasers retain access (their purchase record grants entitlement regardless of
  the current rule). New visitors see the tier gate. Warn the creator before saving.
- **Collection has only one item and that item is deleted:** Collection becomes empty and
  auto-moves to draft (see delete edge case above).

---

**Permissions / Entitlement Rules**

- A creator can only manage their own products and collections.
- Draft products and collections are not visible on the creator public page to any visitor.
- Purchaser entitlement for products and collections is managed by the purchase/entitlement
  service, not by this page directly. This page manages the content metadata and access rules;
  the entitlement service enforces them.
- File downloads are served via authenticated storage URLs. The storage layer checks
  purchase records or membership status before granting a download URL.
- A "Katman Kapısı" collection must reference a valid, published tier at all times. If the
  tier is deleted, the collection cannot remain published — it must be updated.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `shop_list_viewed` | `creator_id`, `product_count` |
| `product_create_started` | `creator_id` |
| `product_published` | `creator_id`, `product_id`, `price_try`, `file_count`, `primary_file_type` |
| `product_draft_saved` | `creator_id`, `product_id` |
| `product_unpublished` | `creator_id`, `product_id` |
| `product_deleted` | `creator_id`, `product_id`, `was_in_collection: true \| false` |
| `product_file_uploaded` | `creator_id`, `file_type`, `file_size_kb`, `is_primary: true \| false` |
| `collections_list_viewed` | `creator_id`, `collection_count` |
| `collection_create_started` | `creator_id` |
| `collection_published` | `creator_id`, `collection_id`, `item_count`, `access_type: 'purchase' \| 'tier'`, `price_try` (if purchase) |
| `collection_draft_saved` | `creator_id`, `collection_id` |
| `collection_deleted` | `creator_id`, `collection_id` |
| `collection_access_rule_changed` | `creator_id`, `collection_id`, `old_rule`, `new_rule` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Auth session + creator role + approved status | Required — page guard |
| Store API | Required — product list and forms |
| Collections API | Required — collections list and forms |
| Feed API | Required — post list for content assignment |
| Membership API | Required — tier list for tier gate selector |
| Object storage | Required — file uploads |
| Entitlement / purchase service | Downstream — enforces access rules on creator public page |
| [`/dashboard`](#family-9--creator-dashboard-overview) | Quick action source |
| [`/@[username]/magaza`](#family-8--creator-public-page) | Public display of products |
| [`/@[username]/koleksiyonlar`](#family-8--creator-public-page) | Public display of collections |
| [`/checkout/urun/...`](./page-requirements-checkout.md) | Purchase flow for products |
| [`/checkout/koleksiyon/...`](./page-requirements-checkout.md) | Purchase flow for collections |

---

*This document covers families 7–12 (Creator). Remaining families are documented in:
`page-requirements-public-auth.md` (1–6), `page-requirements-fan.md` (13–15),
`page-requirements-checkout.md` (16–19), `page-requirements-admin.md` (20–21),
`page-requirements-legal.md` (22–24).*
