# Page Requirements: Fan & Billing — lalabits.art

> **Scope:** This document covers page families 13–19 from the approved outline:
> Library, Memberships & Billing, Notifications (Fan/Member group) and Membership Checkout,
> Product Checkout, Collection Checkout, Cancellation Flow (Checkout/Billing group).
>
> **Excluded from this document:** Public (families 1–2), Auth (3–6), Creator (7–12),
> Admin/Operations (20–21), Legal/Trust (22–24).
> Those families are documented in separate sibling files.
>
> **Authority:** [page-requirements-outline.md](./page-requirements-outline.md) ·
> [sitemap.md](./sitemap.md) · [vision.md](./vision.md) · [CLAUDE.md](../../CLAUDE.md)

---

## Assumptions

The following product decisions are assumed for this document. If any assumption changes,
the affected fields must be revisited.

1. **Payment gateway embeds.** The checkout payment form embeds the Turkish payment
   gateway's hosted UI (iframe or hosted fields). The platform never handles raw card data.
   PCI compliance is the gateway's responsibility. Specific gateway provider is not named
   in this document.

2. **Email verification gate at checkout.** A fan with an unverified email address cannot
   complete any checkout flow. This is consistent with auth family assumption 2. The checkout
   page shows a "E-posta adresinizi doğrulayın" banner with a resend-verification-email link
   if the fan is unverified.

3. **Cancellation is end-of-period.** Cancelling a membership never revokes access
   immediately. Access continues until the last day of the current billing period. No
   prorated refund for any billing interval at MVP.

4. **Annual cancellation.** Annual memberships follow the same end-of-period policy —
   access continues to the annual period end date. No prorated refund at MVP. Flag for
   legal and product review before launch (KVKK / Turkish consumer rights implications).

5. **Renewal failure grace period.** When a recurring billing charge fails, the membership
   enters a grace-period state during which the fan retains access and is prompted to update
   their payment method. If not resolved within the grace period, the membership is
   cancelled. Grace period duration (e.g., 3–7 days) is a billing module decision and is
   not defined in this document.

6. **Retention offers on cancellation.** Whether a retention offer (e.g., a discount coupon)
   is shown during the cancellation consequence-disclosure step is undecided. The flow
   accommodates it as an optional conditional section. Offer logic and business rules are
   deferred.

7. **Shared checkout confirmation/error routes.** `/checkout/onay/[order-id]` and
   `/checkout/hata/[order-id]` serve all three checkout types (membership, product,
   collection). Copy and CTAs vary by `order.type`. These are not a separate page family;
   each checkout family in this document defines its own variant of these states.

---

## Fan / Member

---

### Family 13 — Library

**Routes:**
`/account/kutuphane` (Kütüphanem — membership-unlocked content) ·
`/account/satin-almalar` (Satın Almalarım — one-time purchases)

Both routes are part of one family, presented as tabs or sub-navigation within a shared
library shell.

**Page Name:** Kütüphanem / Satın Almalarım (Library)

**Page Goal:** Give the fan a single place to access all content they have unlocked —
whether through active memberships or one-time purchases — and to download purchased
digital files.

**Primary User:** Authenticated fan

**Access Level:** Auth-required; fan role. A creator with no fan memberships or purchases
can reach this page but will see empty states. Admin cannot access fan account routes.

**Primary CTA:** Content cards link to their respective destinations — post cards navigate
back to the creator public page post view; file/product cards trigger a signed-URL download
or show a download button. Browse CTA ("Yaratıcıları Keşfet" → `/kesfet`) shown in empty
states.

---

**Core Sections**

The library uses a shared shell with two tabs: **Kütüphanem** and **Satın Almalarım**.
A creator filter (by creator name) and content type filter apply to the active tab.

**Kütüphanem (`/account/kutuphane`):**

Shows all content the fan currently has access to through active memberships:
- Member-only posts (access level: Üye or higher) from subscribed creators
- Tier-gated posts (access level: Katman-Kilitli) that fall within the fan's active tier
- Downloadable files attached to unlocked posts
- Tier-gated collections the fan has access to via an active membership tier

Entitlement is evaluated at render time. If a membership has been cancelled but the billing
period has not yet ended, the content remains visible and accessible. Once the billing period
ends, entitlement lapses and content cards are removed from this view (or shown as locked,
depending on product decision — flag as a policy item).

Content card format: creator avatar, content title, content type badge (Gönderi / Dosya /
Koleksiyon), creator name, publish date. Clicking a post card navigates to the creator
public page. Clicking a file card initiates a download via signed URL.

Filter options: creator (dropdown from fan's active subscriptions), content type (all /
gönderi / dosya / koleksiyon).

**Satın Almalarım (`/account/satin-almalar`):**

Shows all one-time purchase items the fan has bought:
- Digital products: product cover, title, creator, file format badge, download button
  (signed URL, regenerated on request). Download availability is governed by the product
  unpublish policy (see creator family assumption 3).
- Purchased collections: collection cover, title, creator, item count, access link
  (navigates to creator public page collections tab).

This view is a receipt-level summary of what was purchased and how to access it. It is not
a full billing log. Receipt links (PDF) per purchase are shown inline. Full billing history
(`/account/fatura/gecmis`) is deferred; the billing summary at `/account/fatura` covers
recent transactions.

---

**Key Components**

`LibraryShell` (tab navigation wrapper), `LibraryFilterBar` (creator + content type filters),
`ContentCard` (post, file, product, collection variants), `DownloadButton` (triggers signed
URL resolution), `EmptyLibraryState`, `EmptySatinAlmalarState`

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Fan's active memberships and tier entitlements | Yes — determines which content is shown | Membership / entitlement API |
| Unlocked post list (paginated) | Yes — Kütüphanem content | Posts API (filtered by entitlement) |
| One-time purchase list | Yes — Satın Almalarım content | Orders / purchases API |
| Signed download URLs for files and products | Yes — download functionality | Storage API |
| Creator filter list (fan's subscriptions) | No — filter degrades gracefully | Membership API |

---

**Empty States**

- **Kütüphanem — no active memberships:** "Henüz aktif üyeliğiniz yok." + "Yaratıcıları
  Keşfet" CTA → `/kesfet`.
- **Kütüphanem — active memberships but no content yet:** "Abone olduğunuz yaratıcılar
  henüz içerik paylaşmadı." No browse CTA needed.
- **Satın Almalarım — no purchases:** "Henüz bir satın alma yapmadınız." + "Yaratıcıları
  Keşfet" CTA → `/kesfet`.
- **Filtered view returns nothing:** "Bu filtreyle eşleşen içerik bulunamadı." + clear filter
  link.

---

**Loading States**

- Initial page load: skeleton cards for both tabs while entitlement and content data are fetched.
- Download initiation: download button shows a brief spinner while the signed URL is resolved.
  Button text changes to "Hazırlanıyor..." during resolution.
- Pagination: loading indicator at the bottom of the list when the next page is fetching.

---

**Error States**

- **Entitlement API unavailable:** Page-level error banner. "İçerikleriniz şu anda
  yüklenemiyor. Lütfen daha sonra tekrar deneyin." Tab content is blank; filters are hidden.
- **Download URL resolution fails:** Inline error below the download button. "Dosya
  şu anda indirilemedi. Lütfen tekrar deneyin." Retry button shown.
- **Signed URL expired on revisit:** Trigger URL regeneration silently on click; if
  regeneration fails, show the download error inline.

---

**Edge Cases**

- **Membership cancelled mid-billing-period:** Content remains accessible until period end.
  No visual indicator on content cards that access is pending expiry (unless a product
  decision is made to add a warning badge — flag as optional).
- **Creator deletes a post the fan has in their library:** Post card is removed from the
  library view. No "deleted" tombstone is shown.
- **Product unpublished after purchase:** Governed by creator family assumption 3 (policy
  undecided — Option A revokes download access, Option B preserves it for prior purchasers).
  Document here flagged as dependent on that decision.
- **Fan holds both fan and creator roles:** Library shows only fan-role content. Creator
  content management is in `/dashboard`, not here.
- **Very large library (100+ items):** Pagination or infinite scroll required. Page size TBD
  (engineering decision).

---

**Permissions / Entitlement Rules**

- `/account/kutuphane` and `/account/satin-almalar` require an authenticated session.
- Content displayed is strictly scoped to the authenticated fan's entitlements. No fan
  can see another fan's library.
- Tier-gated content is only visible if the fan's active tier on the relevant creator
  matches or exceeds the required tier. Downgraded or cancelled memberships reduce access
  accordingly, effective at period end.
- Admins do not access fan libraries through these routes.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `library_viewed` | `fan_id`, `tab: 'kutuphane' \| 'satin-almalar'` |
| `library_filter_applied` | `fan_id`, `filter_type: 'creator' \| 'content_type'`, `value` |
| `library_content_clicked` | `fan_id`, `content_type: 'post' \| 'file' \| 'product' \| 'collection'`, `content_id` |
| `library_download_initiated` | `fan_id`, `product_id`, `content_type: 'file' \| 'product'` |
| `library_download_failed` | `fan_id`, `product_id`, `error_reason` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Auth session (fan role) | Required — guards both routes |
| Membership / entitlement API | Required — determines Kütüphanem content |
| Posts API (entitlement-filtered) | Required — post cards in Kütüphanem |
| Orders / purchases API | Required — Satın Almalarım content |
| Object storage (signed URLs) | Required — file and product downloads |
| [`/kesfet`](./page-requirements-public-auth.md) | CTA destination in empty states |
| Creator public page (Family 8) | Destination for post card and collection access clicks |

---

---

### Family 14 — Memberships & Billing

**Routes:**
`/account/uyeliklerim` (Üyeliklerim — membership list) ·
`/account/uyeliklerim/[membership-id]` (Üyelik Detayı — single membership detail) ·
`/account/fatura` (Fatura ve Ödeme — payment method + billing summary)

All three routes are part of one family, accessible via sub-navigation in the account area.

**Page Name:** Üyeliklerim / Üyelik Detayı / Fatura ve Ödeme (Memberships & Billing)

**Page Goal:** Allow the fan to review all their memberships (active and historical), manage
a specific membership, and review their payment method and recent billing activity.

**Primary User:** Authenticated fan

**Access Level:** Auth-required; fan role. The membership detail route requires the fan to
own the referenced membership — direct-linking to another fan's membership detail returns a
404 or redirect to `/account/uyeliklerim`.

**Primary CTA:**
- List view: "İptal Et" on active membership cards → `/uyelik/[membership-id]/iptal`
- Detail view: "İptal Et" → `/uyelik/[membership-id]/iptal`
- Billing view: "Yöntemi Güncelle" (opens payment method update flow, scope TBD)

---

**Core Sections**

**Üyeliklerim (`/account/uyeliklerim`):**

A card list of all memberships the fan has ever had — active, cancelled, and expired.

Per card:
- Creator avatar and name
- Tier name
- Status badge: `Aktif` / `İptal Edilmiş` / `Süresi Dolmuş` / `Ödeme Başarısız`
- Next billing date (active memberships only)
- Last charge amount (TRY)
- "İptal Et" CTA (active memberships only) → `/uyelik/[membership-id]/iptal`
- "Detaylar" link → `/account/uyeliklerim/[membership-id]`

Renewal failure state: card shows "Ödeme Başarısız" badge. An inline alert beneath the card
reads "Son ödemeniz alınamadı. Ödeme yönteminizi güncelleyin." with a "Ödeme Yöntemini
Güncelle" CTA → `/account/fatura`.

Sort order: active memberships first, then cancelled/expired in reverse end-date order.

**Üyelik Detayı (`/account/uyeliklerim/[membership-id]`):**

Full detail view for a single membership:
- Creator avatar, name, and link to creator public page
- Tier name and full perk list
- Billing interval: Aylık / Yıllık
- Price (TRY / interval)
- Start date
- Next billing date (active) or access end date (cancelled)
- Status badge
- Last 5 charges for this membership: date, amount (TRY), receipt link (PDF download or
  inline link)
- "İptal Et" CTA (active memberships only) → `/uyelik/[membership-id]/iptal`

Renewal failure state: inline error block above the charge history. "Son ödemeniz
[tarih] tarihinde başarısız oldu. Üyeliğiniz [bitiş-tarihi] tarihine kadar aktif kalacaktır.
Ödeme yönteminizi güncelleyin." + "Ödeme Yöntemini Güncelle" CTA → `/account/fatura`.

Already-cancelled view: "İptal Et" CTA is hidden; status badge shows "İptal Edilmiş";
access end date is shown prominently.

**Fatura ve Ödeme (`/account/fatura`):**

Two sections on one page:

*Ödeme Yöntemi:*
- Saved payment method summary: card type (Visa / Mastercard / etc.), last 4 digits, expiry
  month/year.
- "Yöntemi Güncelle" CTA (scope of update flow TBD — likely gateway-hosted update page).
- If no payment method saved: "Kayıtlı ödeme yönteminiz yok." with an "Ekle" CTA.

*Son İşlemler:*
- Last 10 transactions across all memberships and one-time purchases: date, description
  (tier name + creator or product title), amount (TRY), receipt link.
- Note: Full billing history (`/account/fatura/gecmis`) is deferred. This summary covers
  recent activity only.

---

**Key Components**

`MembershipCard` (list item with status badge and CTA), `MembershipDetailView`,
`ChargeHistoryList`, `PaymentMethodSummary`, `RecentTransactionsList`,
`RenewalFailureAlert`, `EmptyMembershipsState`

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Fan's membership list (all statuses) | Yes — list view | Membership API |
| Membership detail (tier, billing, charge history) | Yes — detail view | Membership API |
| Saved payment method summary | Yes — billing view | Billing / payment gateway API |
| Recent transactions (last 10) | Yes — billing view | Orders / billing API |
| Receipt URLs | No — degrades to no receipt link | Billing API |

---

**Empty States**

- **Üyeliklerim — no memberships ever:** "Henüz hiçbir yaratıcıya üye olmadınız." +
  "Yaratıcıları Keşfet" CTA → `/kesfet`.
- **Üyeliklerim — all memberships cancelled/expired:** List shows cancelled cards normally.
  No empty state needed — the list is populated.
- **Fatura — no transactions:** "Henüz bir işlem kaydınız yok."

---

**Loading States**

- List view initial load: skeleton cards.
- Detail view initial load: skeleton layout for the detail fields and charge history.
- Billing view initial load: skeleton for payment method block and transactions list.

---

**Error States**

- **Membership API unavailable (list view):** Page-level error. "Üyelikleriniz şu anda
  yüklenemiyor. Lütfen daha sonra tekrar deneyin."
- **Invalid or unowned membership-id in detail URL:** Redirect to `/account/uyeliklerim`
  with a toast: "Üyelik bulunamadı."
- **Billing API unavailable (billing view):** Inline error per section. Payment method block
  and transaction list each show a "Yüklenemedi" message with a retry option.
- **Receipt download fails:** Inline error next to the receipt link. "Makbuz şu anda
  indirilemedi."

---

**Edge Cases**

- **Fan cancels from the list and then navigates to detail:** Detail view reflects the
  cancelled state immediately. "İptal Et" CTA is hidden.
- **Membership renewal failure during active session:** Status badge updates on next page
  load or after a real-time event if the platform supports push notifications. No live
  polling required at MVP.
- **Annual membership cancelled:** Access end date is the annual period end, not the day of
  cancellation. No proration (assumption 3 and 4).
- **Fan has both active and expired memberships with the same creator (re-subscribed):**
  Each subscription is a separate card with its own membership-id and status.
- **Grace period expiry:** When the grace period lapses and a membership is cancelled by the
  system (not the fan), the card status updates to "İptal Edilmiş" on next load. A
  notification is sent (Family 15 event: `ödeme başarısız` → `üyelik iptal edildi`).

---

**Permissions / Entitlement Rules**

- All three routes require an authenticated session with a fan role.
- The detail route (`/account/uyeliklerim/[membership-id]`) enforces ownership: the
  membership must belong to the authenticated fan. Any other membership-id returns a 404
  or redirects to the list.
- Payment method data is fetched through the billing API, not stored directly by the
  platform — display is a summary proxy only (card type + last 4 + expiry).
- Admins cannot access fan billing pages through these routes.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `memberships_list_viewed` | `fan_id`, `active_count`, `cancelled_count` |
| `membership_detail_viewed` | `fan_id`, `membership_id`, `status` |
| `billing_page_viewed` | `fan_id` |
| `cancel_cta_clicked` | `fan_id`, `membership_id`, `billing_interval: 'monthly' \| 'annual'` |
| `payment_method_update_initiated` | `fan_id` |
| `renewal_failure_alert_seen` | `fan_id`, `membership_id` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Auth session (fan role) | Required — guards all routes |
| Membership API | Required — all three views |
| Billing / payment gateway API | Required — payment method and transactions |
| Orders API | Required — recent transactions on `/account/fatura` |
| [`/uyelik/[membership-id]/iptal`](#family-19--cancellation-flow) | CTA destination |
| [`/kesfet`](./page-requirements-public-auth.md) | CTA in empty state |
| Family 15 (Notifications) | Downstream — renewal failure and cancellation events |

---

---

### Family 15 — Notifications

**Routes:**
`/account/bildirimler`

**Page Name:** Bildirimler (Notifications)

**Page Goal:** Provide a central, chronological log of all platform events relevant to the
authenticated user — covering both fan-role events (membership activity, new content) and
creator-role events (new members, sales) on the same account.

**Primary User:** Authenticated fan or authenticated creator (or both roles on one account)

**Access Level:** Auth-required. The page serves whichever role(s) the authenticated user
holds. No separate notification URLs per role — role context is surfaced in the content of
each notification item.

**Primary CTA:** Individual notification items are themselves the CTA — clicking navigates
to the relevant content or account section. "Tümünü Okundu Say" bulk-mark action available
at the top of the list.

---

**Core Sections**

A single reverse-chronological notification list. Unread items are visually distinguished
(e.g., bold text, unread dot, or background tint — design decision). Read items remain in
the list; no auto-archiving at MVP.

**Fan-role notification types:**

| Type | Trigger | Navigation target |
|---|---|---|
| Yeni Gönderi | Creator the fan subscribes to publishes a new post | Creator public page (Family 8) |
| Üyelik Yenilendi | Recurring billing charge succeeds | `/account/uyeliklerim/[membership-id]` |
| Ödeme Başarısız | Recurring billing charge fails | `/account/fatura` |
| Üyelik İptal Edildi | Membership cancelled (fan-initiated or system-cancelled after grace) | `/account/uyeliklerim/[membership-id]` |
| Yeni Ürün / Koleksiyon | Creator the fan subscribes to publishes a new product or collection | Creator public page (Family 8) |
| Platform Mesajı | Admin broadcast | No navigation or a platform-defined destination |

**Creator-role notification types:**

| Type | Trigger | Navigation target |
|---|---|---|
| Yeni Üye Katıldı | A fan subscribes to any of the creator's tiers | `/dashboard` or member list (post-launch) |
| Üye İptal Etti | A fan cancels a subscription | `/dashboard` |
| Yeni Satın Alma | A fan purchases a product or collection | `/dashboard/magaza` or `/dashboard/koleksiyonlar` |
| Gönderi Yayınlandı | System confirmation after a post is published | `/dashboard/gonderiler` |
| Platform Mesajı | Admin broadcast | No navigation or a platform-defined destination |

**Dual-role labeling:** When the authenticated user holds both fan and creator roles,
notifications from each role are tagged with a role context label (e.g., "Yaratıcı" /
"Fan") so the user can distinguish them in the combined list.

**Actions:**
- Clicking a notification marks it as read and navigates to the target.
- "Tümünü Okundu Say" marks all notifications as read without navigation.
- No delete action at MVP.

**Notification preferences:** Preference management (which notification types to receive,
and by which channel) is a post-launch feature. This page does not include a link to a
preferences settings route. A neutral, non-committal note is shown at the bottom of the
page: "Bildirim tercihlerini yönetme özelliği yakında kullanıma sunulacaktır."

---

**Key Components**

`NotificationList`, `NotificationItem` (with role-label variant, read/unread variant),
`MarkAllReadButton`, `EmptyNotificationsState`

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Notification list for authenticated user (paginated, desc) | Yes | Notifications API |
| Unread count (for badge in nav) | No — nav badge degrades gracefully | Notifications API |
| Role(s) of authenticated user | Yes — dual-role labeling | Auth session |

---

**Empty States**

- **No notifications at all:** "Henüz bildiriminiz yok." No CTA needed.
- **All notifications read and list is paginated:** No special state; list scrolls normally.

---

**Loading States**

- Initial page load: skeleton list items (5–10 placeholders) while notification data fetches.
- Pagination: loading indicator at the bottom of the list.
- "Tümünü Okundu Say": button enters loading state; items update to read style on success.

---

**Error States**

- **Notifications API unavailable:** Page-level error. "Bildirimler şu anda yüklenemiyor.
  Lütfen daha sonra tekrar deneyin."
- **Mark-as-read action fails:** Silent failure at item level (optimistic update reverts).
  Toast error for bulk mark-all action: "İşlem gerçekleştirilemedi. Lütfen tekrar deneyin."

---

**Edge Cases**

- **Notification target content deleted:** Clicking the notification navigates to a page
  that no longer exists. The target page handles the 404; this page makes no special
  accommodation.
- **Very large notification backlog (100+ unread):** Pagination is required. Unread count
  badge in navigation caps display at "99+" if over 99.
- **Admin broadcast to all users:** Platform mesajı type is delivered to all authenticated
  users regardless of role. No special rendering beyond the standard notification item.
- **Real-time delivery:** Whether new notifications appear in-session without a page
  refresh (via WebSocket or polling) is a backend/infrastructure decision and is not defined
  here.

---

**Permissions / Entitlement Rules**

- `/account/bildirimler` requires an authenticated session.
- Notifications are strictly scoped to the authenticated user's identity. No user can view
  another user's notifications.
- Fan-role events are only generated if the user holds a fan role; creator-role events only
  if they hold a creator role. A fan-only account never receives creator-role notifications.
- Admin broadcast notifications are generated and delivered by the platform operations team,
  not by individual users.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `notifications_page_viewed` | `user_id`, `unread_count` |
| `notification_clicked` | `user_id`, `notification_type`, `notification_id`, `role_context: 'fan' \| 'creator'` |
| `notifications_mark_all_read` | `user_id`, `count_marked` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Auth session | Required — guards route |
| Notifications API | Required — list and read-state management |
| Notification delivery system (backend) | Required — events must be generated upstream |
| Family 8 (Creator Public Page) | Navigation target for fan-side content notifications |
| Family 9 (Creator Dashboard Overview) | Navigation target for creator-side notifications |
| Family 14 (Memberships & Billing) | Navigation target for billing event notifications |

---

---

## Checkout / Billing

---

### Family 16 — Membership Checkout

**Routes:**
`/checkout/uyelik/[creator-username]/[tier-id]` (checkout form) ·
`/checkout/onay/[order-id]` (shared success state — see assumption 7) ·
`/checkout/hata/[order-id]` (shared error state — see assumption 7)

**Page Name:** Üyelik Ödeme / Ödeme Onayı / Ödeme Hatası (Membership Checkout)

**Page Goal:** Convert a fan's intent to subscribe into a completed recurring billing
agreement and provide immediate confirmation or a clear error recovery path.

**Primary User:** Authenticated fan with a verified email address

**Access Level:** Auth-required with email verification. Unauthenticated visitors who reach
the checkout URL are redirected to `/auth/giris?return=[checkout-url]`. Fans with an
unverified email see a verification banner (assumption 2) and cannot submit the payment form
until verified. A fan who already has an active membership to the same tier is shown a
"Zaten bu plana üyesiniz" message instead of the checkout form.

**Primary CTA:** "Üyeliği Tamamla" (submit payment on checkout form); "Kütüphaneme Git"
(primary on success state); "Tekrar Dene" (primary on error state).

---

**Core Sections**

**Checkout form (`/checkout/uyelik/[creator-username]/[tier-id]`):**

Two-panel layout (desktop: side-by-side; mobile: stacked):

*Order summary panel:*
- Creator avatar and display name
- Tier name
- Condensed perk list (up to 5 perks; "ve X daha fazlası" overflow if more)
- Billing interval selector: Aylık / Yıllık (shown only if creator offers both; if only
  one interval is configured, the selector is hidden and the interval is shown as static text)
- Selected price (TRY / interval); if Yıllık is selected, show annual total and monthly
  equivalent with savings callout (e.g., "Aylık ödemeye göre %17 tasarruf edin")
- Terms note: "Ödeme yaparak [Kullanım Koşulları](/legal/kullanim-kosullari)'nı kabul
  etmiş olursunuz."

*Payment panel:*
- Email verification banner (assumption 2): shown if fan's email is unverified. Resend
  verification link included. "Üyeliği Tamamla" is disabled until email is verified.
- Embedded payment gateway UI (iframe or hosted fields). Platform never handles raw card
  data (assumption 1).
- "Üyeliği Tamamla" primary submit CTA.

**Success state (`/checkout/onay/[order-id]` — membership variant):**

- Headline: "Üyeliğiniz Aktif!"
- Summary block: tier name, creator name, next billing date, price per interval.
- CTAs: "Kütüphaneme Git" (primary → `/account/kutuphane`), "Yaratıcı Sayfasına Dön"
  (secondary → creator public page).
- Page is URL-addressable and can be revisited; state is derived from order-id. If the
  order-id does not belong to the authenticated fan, return 404.

**Error state (`/checkout/hata/[order-id]` — membership variant):**

- Headline: "Ödeme Tamamlanamadı"
- Reason text: gateway-provided error message if available (e.g., "Kartınız reddedildi."),
  otherwise a generic "Ödemeniz işlenemedi." message.
- CTAs: "Tekrar Dene" (returns to checkout form, pre-filled with the same tier/interval
  selection) and "Destek Al" (mailto link to support email address).

---

**Key Components**

`CheckoutShell`, `OrderSummaryPanel`, `BillingIntervalSelector`, `SavingsCallout`,
`PaymentGatewayEmbed`, `EmailVerificationBanner`, `CheckoutSubmitButton`,
`CheckoutSuccessCard` (membership variant), `CheckoutErrorCard`

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Creator profile (avatar, name) | Yes — order summary | Creator API |
| Tier detail (name, perks, price, intervals) | Yes — order summary + form | Membership / tiers API |
| Fan email verification status | Yes — verification gate | Auth session |
| Payment gateway embed URL or config | Yes — payment panel | Gateway integration |
| Order record (for success/error states) | Yes — confirmation pages | Orders API |

---

**Empty States**

No empty state scenarios; the page either renders with data or shows an error state.

---

**Loading States**

- Checkout form initial load: skeleton for order summary and gateway embed while tier
  data and gateway config are fetched.
- Submit in progress: "Üyeliği Tamamla" button enters loading state ("İşleniyor...") while
  payment is being processed. Form becomes non-interactive. Timeout handling TBD.
- Success/error pages load instantly from order-id once the order record is written.

---

**Error States**

- **Tier not found or creator inactive:** Full-page error. "Bu üyelik planı artık mevcut
  değil." + "Yaratıcı Sayfasına Git" link.
- **Fan already subscribed to this tier:** Inline notice replacing the checkout form.
  "Zaten bu plana üyesiniz." + "Üyeliğimi Görüntüle" → `/account/uyeliklerim`.
- **Gateway embed fails to load:** Inline error in the payment panel. "Ödeme formu
  yüklenemedi. Lütfen sayfayı yenileyin."
- **Payment submission fails:** Redirect to `/checkout/hata/[order-id]` with the gateway
  error reason.
- **Session expires during checkout:** On return, user is re-authenticated via the
  `?return=` redirect and lands back on the checkout form. Order is not created until
  the fan submits.

---

**Edge Cases**

- **Fan navigates back from success page to checkout:** A new order would be created on
  re-submission. The checkout form should detect an existing active membership and block
  re-submission (duplicate subscription guard).
- **Creator disables a tier between page load and submission:** Submission returns a tier-
  inactive error; redirect to the error state page.
- **Annual interval not offered:** Billing interval selector is hidden. The form shows the
  monthly price as static text.
- **Guest visits the checkout URL and logs in:** After login, the `?return=` redirect
  brings them back to the exact checkout URL with the correct tier pre-selected.

---

**Permissions / Entitlement Rules**

- Auth-required with email verification (assumption 2).
- Only a fan role can complete membership checkout. A creator-only account without a fan
  role is not expected at MVP (dual-role coexistence assumed per creator family assumption 1),
  but if one exists, they must register as a fan first.
- The success and error pages are auth-required; order-id must belong to the authenticated
  fan. Other users see a 404.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `checkout_membership_started` | `fan_id`, `creator_username`, `tier_id`, `billing_interval` |
| `checkout_interval_changed` | `fan_id`, `tier_id`, `from_interval`, `to_interval` |
| `checkout_membership_submitted` | `fan_id`, `tier_id`, `price_try`, `billing_interval` |
| `checkout_membership_success` | `fan_id`, `order_id`, `tier_id`, `price_try`, `billing_interval` |
| `checkout_membership_failed` | `fan_id`, `order_id`, `tier_id`, `error_reason` |
| `checkout_email_verification_banner_shown` | `fan_id` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Auth session (fan role, email verified) | Required — access guard |
| Creator API (profile) | Required — order summary |
| Membership / tiers API | Required — tier detail |
| Payment gateway integration | Required — embedded payment form |
| Orders API | Required — order creation and confirmation/error states |
| [`/auth/giris`](./page-requirements-public-auth.md) | Redirect destination for unauthenticated visitors |
| [`/account/kutuphane`](#family-13--library) | CTA on success page |
| [`/legal/kullanim-kosullari`](./page-requirements-legal.md) | Linked in terms note |
| Family 8 (Creator Public Page) | Entry point (CTA) + secondary CTA on success |

---

---

### Family 17 — Product Checkout

**Routes:**
`/checkout/urun/[product-id]` (checkout form) ·
`/checkout/onay/[order-id]` (shared success state — see assumption 7) ·
`/checkout/hata/[order-id]` (shared error state — see assumption 7)

**Page Name:** Ürün Satın Alma / Ödeme Onayı / Ödeme Hatası (Product Checkout)

**Page Goal:** Convert a fan's intent to purchase a digital product into a completed
one-time payment and immediately deliver download access.

**Primary User:** Authenticated fan with a verified email address

**Access Level:** Auth-required with email verification (same guards as Family 16). A fan
who has already purchased the same product is shown a "Bu ürünü zaten satın aldınız"
notice instead of the checkout form, with a link to their library.

**Primary CTA:** "Satın Almayı Tamamla" (submit payment); "Şimdi İndir" (primary on success);
"Tekrar Dene" (primary on error).

---

**Core Sections**

**Checkout form (`/checkout/urun/[product-id]`):**

Two-panel layout (same responsive pattern as membership checkout):

*Order summary panel:*
- Product cover image
- Product title
- Creator name
- File format badge(s) (e.g., PDF, ZIP, MP3)
- Price (TRY — one-time)
- No billing interval selector (this is a one-time purchase)
- Terms note: "Ödeme yaparak [Kullanım Koşulları](/legal/kullanim-kosullari)'nı kabul
  etmiş olursunuz."

*Payment panel:*
- Email verification banner (assumption 2) if applicable.
- Embedded payment gateway UI (same embed as membership checkout).
- "Satın Almayı Tamamla" primary CTA.

**Success state (`/checkout/onay/[order-id]` — product variant):**

- Headline: "Satın Alma Başarılı!"
- Product title and creator name.
- "Şimdi İndir" primary CTA: triggers a signed-URL download. If the signed URL resolves
  within a short timeout, download begins immediately. If it fails or times out:
  "Kütüphane'den indir" fallback note with a link to `/account/satin-almalar`.
- "Kütüphaneme Git" secondary CTA → `/account/satin-almalar`.
- Page is URL-addressable (order-id based); download link can be re-triggered on revisit
  (signed URL is regenerated per request).

**Error state (`/checkout/hata/[order-id]` — product variant):**

- Headline: "Ödeme Tamamlanamadı"
- Same gateway error message pattern as membership checkout error state.
- CTAs: "Tekrar Dene" (returns to checkout form) and "Destek Al" (mailto support).

---

**Key Components**

`CheckoutShell`, `ProductOrderSummaryPanel`, `PaymentGatewayEmbed`,
`EmailVerificationBanner`, `CheckoutSubmitButton`, `ProductSuccessCard`
(with download trigger), `CheckoutErrorCard`

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Product detail (title, creator, cover, formats, price) | Yes — order summary | Products API |
| Fan email verification status | Yes — verification gate | Auth session |
| Payment gateway embed URL or config | Yes — payment panel | Gateway integration |
| Order record | Yes — confirmation pages | Orders API |
| Signed download URL | Yes — "Şimdi İndir" CTA on success | Storage API |

---

**Empty States**

No empty state scenarios; the page either renders with data or shows an error state.

---

**Loading States**

- Checkout form initial load: skeleton for order summary and gateway embed.
- Submit in progress: "Satın Almayı Tamamla" enters loading state; form becomes non-interactive.
- Download initiation on success page: brief spinner on "Şimdi İndir" while the signed URL
  is resolved.

---

**Error States**

- **Product not found or unpublished:** Full-page error. "Bu ürün artık mevcut değil."
  + link back to the creator public page shop tab.
- **Fan already purchased this product:** Inline notice. "Bu ürünü zaten satın aldınız."
  + "Kütüphaneme Git" → `/account/satin-almalar`.
- **Gateway embed fails to load:** Same as membership checkout.
- **Payment submission fails:** Redirect to `/checkout/hata/[order-id]`.
- **Download URL fails on success page:** "Kütüphane'den indir" fallback shown inline.

---

**Edge Cases**

- **Creator unpublishes product between page load and submission:** Submission returns a
  product-unavailable error; redirect to error state.
- **Fan revisits success page and re-triggers download:** Signed URL is regenerated on each
  request. No limit on download count at MVP (product decision — flag if limits are needed).
- **Product has multiple file formats:** All formats listed in the order summary. On the
  success page, if multiple files are attached, each has its own "İndir" button.

---

**Permissions / Entitlement Rules**

- Auth-required with email verification.
- The success and error pages are auth-required; order-id must belong to the authenticated
  fan.
- Download URLs are signed and time-limited. Sharing a download URL directly grants
  temporary access — signed URL expiry policy is a storage/infrastructure decision.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `checkout_product_started` | `fan_id`, `product_id`, `price_try` |
| `checkout_product_submitted` | `fan_id`, `product_id`, `price_try` |
| `checkout_product_success` | `fan_id`, `order_id`, `product_id`, `price_try` |
| `checkout_product_failed` | `fan_id`, `order_id`, `product_id`, `error_reason` |
| `checkout_product_download_initiated` | `fan_id`, `order_id`, `product_id` |
| `checkout_product_download_failed` | `fan_id`, `order_id`, `product_id` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Auth session (fan role, email verified) | Required |
| Products API | Required — product detail |
| Payment gateway integration | Required |
| Orders API | Required |
| Object storage (signed URLs) | Required — download on success page |
| [`/auth/giris`](./page-requirements-public-auth.md) | Redirect destination for unauthenticated visitors |
| [`/account/satin-almalar`](#family-13--library) | CTA on success page and duplicate-purchase notice |
| [`/legal/kullanim-kosullari`](./page-requirements-legal.md) | Linked in terms note |
| Family 8 (Creator Public Page) | Entry point (CTA from shop tab) |

---

---

### Family 18 — Collection Checkout

**Routes:**
`/checkout/koleksiyon/[collection-id]` (checkout form) ·
`/checkout/onay/[order-id]` (shared success state — see assumption 7) ·
`/checkout/hata/[order-id]` (shared error state — see assumption 7)

**Page Name:** Koleksiyon Satın Alma / Ödeme Onayı / Ödeme Hatası (Collection Checkout)

**Page Goal:** Allow a fan to purchase access to a purchase-type collection (as distinct from
tier-gated collections, which are unlocked via membership and do not use this checkout).

**Primary User:** Authenticated fan with a verified email address

**Access Level:** Auth-required with email verification (same guards as Families 16 and 17).
If the fan already has access to the collection (via prior purchase or an active qualifying
membership tier), show a notice instead of the checkout form.

**Primary CTA:** "Satın Almayı Tamamla" (submit payment); "Koleksiyona Git" (primary on
success); "Tekrar Dene" (primary on error).

---

**Core Sections**

**Checkout form (`/checkout/koleksiyon/[collection-id]`):**

Two-panel layout (same responsive pattern as product checkout):

*Order summary panel:*
- Collection cover image
- Collection title
- Creator name
- Item count (e.g., "14 içerik")
- Price (TRY — one-time)
- No billing interval selector.
- Terms note: "Ödeme yaparak [Kullanım Koşulları](/legal/kullanim-kosullari)'nı kabul
  etmiş olursunuz."

*Payment panel:*
- Email verification banner (assumption 2) if applicable.
- Embedded payment gateway UI.
- "Satın Almayı Tamamla" primary CTA.

**Success state (`/checkout/onay/[order-id]` — collection variant):**

- Headline: "Koleksiyon Kilidi Açıldı!"
- Collection title and creator name.
- CTAs: "Koleksiyona Git" (primary — navigates to the creator public page collections tab),
  "Kütüphaneme Git" (secondary → `/account/satin-almalar`).
- Page is URL-addressable (order-id based).

**Error state (`/checkout/hata/[order-id]` — collection variant):**

- Headline: "Ödeme Tamamlanamadı"
- Same gateway error pattern as Families 16 and 17.
- CTAs: "Tekrar Dene" and "Destek Al".

---

**Key Components**

`CheckoutShell`, `CollectionOrderSummaryPanel`, `PaymentGatewayEmbed`,
`EmailVerificationBanner`, `CheckoutSubmitButton`, `CollectionSuccessCard`,
`CheckoutErrorCard`

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Collection detail (title, creator, cover, item count, price, access type) | Yes — order summary and access guard | Collections API |
| Fan's existing access to this collection | Yes — duplicate-access guard | Collections / membership entitlement API |
| Fan email verification status | Yes — verification gate | Auth session |
| Payment gateway embed URL or config | Yes | Gateway integration |
| Order record | Yes — confirmation pages | Orders API |

---

**Empty States**

No empty state scenarios; the page either renders with data or shows an error state.

---

**Loading States**

- Checkout form initial load: skeleton for order summary and gateway embed.
- Submit in progress: same loading pattern as product checkout.

---

**Error States**

- **Collection not found or unpublished:** Full-page error. "Bu koleksiyon artık mevcut
  değil." + link to creator public page.
- **Fan already has access (via prior purchase or membership):** Inline notice. "Bu
  koleksiyona zaten erişiminiz var." + "Kütüphaneme Git" → `/account/satin-almalar` or
  "Koleksiyona Git" → creator public page collections tab.
- **Tier-gated collection reached via checkout URL:** Should not be reachable normally
  (the CTA should not appear for tier-gated collections on the creator public page), but
  if a fan navigates directly: "Bu koleksiyona erişmek için uygun bir üyelik planı gereklidir."
  + creator public page link.
- **Gateway embed fails:** Same inline error as membership checkout.
- **Payment submission fails:** Redirect to `/checkout/hata/[order-id]`.

---

**Edge Cases**

- **Creator removes items from collection after fan purchases:** Fan retains access to the
  collection. Content availability within the collection is governed by the creator's
  content management actions — outside the scope of the checkout page.
- **Collection item count changes between page load and submission:** The order summary
  may be stale. On submission, the order is created against the collection-id at the time
  of submission. No refund or adjustment flow for count changes at MVP.

---

**Permissions / Entitlement Rules**

- Auth-required with email verification.
- This checkout route is only valid for purchase-type collections. Tier-gated collections
  are not purchasable via this route; access is granted through membership checkout.
- The success and error pages are auth-required; order-id must belong to the authenticated
  fan.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `checkout_collection_started` | `fan_id`, `collection_id`, `price_try` |
| `checkout_collection_submitted` | `fan_id`, `collection_id`, `price_try` |
| `checkout_collection_success` | `fan_id`, `order_id`, `collection_id`, `price_try` |
| `checkout_collection_failed` | `fan_id`, `order_id`, `collection_id`, `error_reason` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Auth session (fan role, email verified) | Required |
| Collections API | Required — collection detail and access type |
| Membership / entitlement API | Required — existing-access guard |
| Payment gateway integration | Required |
| Orders API | Required |
| [`/auth/giris`](./page-requirements-public-auth.md) | Redirect destination for unauthenticated visitors |
| [`/account/satin-almalar`](#family-13--library) | CTA on success page |
| [`/legal/kullanim-kosullari`](./page-requirements-legal.md) | Linked in terms note |
| Family 8 (Creator Public Page) | Entry point (CTA from collections tab) + "Koleksiyona Git" destination |

---

---

### Family 19 — Cancellation Flow

**Routes:**
`/uyelik/[membership-id]/iptal`

**Page Name:** Üyelik İptal (Cancellation Flow)

**Page Goal:** Allow a fan to cancel an active membership through a two-step flow that
discloses the consequences of cancellation (access loss, billing end date) and requires
an explicit final confirmation before the cancellation is submitted.

**Primary User:** Authenticated fan who owns the referenced membership

**Access Level:** Auth-required. The fan must own the membership identified by
`[membership-id]`. Any other membership-id (including one belonging to a different fan)
returns a 404 or redirects to `/account/uyeliklerim`. A creator account cannot cancel
a fan's membership through this route.

**Primary CTA:** "Üyeliği İptal Et" (advance from step 1 to step 2); "Evet, İptal Et"
(confirm and submit cancellation in step 2); "Vazgeç" (abandon the flow; return to
membership detail).

---

**Core Sections**

The flow is two steps rendered within the same route. No URL changes between steps —
step state is managed client-side.

**Step 1 — Consequence Disclosure:**

- Tier name and creator name (heading context).
- Billing interval and current price (TRY / interval).
- Consequences list — what the fan will lose:
  - Access to tier-gated posts and downloads
  - Access to tier-gated collections (if any)
  - Community or chat access (if applicable to the tier)
- Access end date notice (prominent): "Erişiminiz [tarih] tarihine kadar devam eder."
  The end date is the last day of the current billing period, never the date of cancellation.
- Optional retention offer (assumption 6): if a retention offer is configured by the
  platform for this creator or tier, it is shown here as a conditional block (e.g.,
  "Üyeliğinizi sürdürmek ister misiniz? Bir sonraki ay için %50 indirim sunuyoruz.").
  If no offer is configured, this block is not shown.
- CTA: "Üyeliği İptal Et" — advances to step 2. "Vazgeç" — returns to
  `/account/uyeliklerim/[membership-id]`.

**Step 2 — Final Confirmation:**

- Single confirmation question: "Bu üyeliği iptal etmek istediğinizden emin misiniz?"
- Reminder of access end date: "Erişiminiz [tarih] tarihine kadar devam eder."
- Two CTAs side by side:
  - "Evet, İptal Et" — submits cancellation; enters loading state while the API call is
    in flight.
  - "Vazgeç" — abandons the flow; returns to `/account/uyeliklerim/[membership-id]`.

**Post-cancellation:**

On successful submission:
- Redirect to `/account/uyeliklerim`.
- Success toast: "Üyeliğiniz iptal edildi. Erişiminiz [tarih] tarihine kadar devam eder."

**Already-cancelled state:**

If the fan navigates to this URL for a membership that is already cancelled or expired,
step 1 is not shown. Instead, a notice is displayed: "Bu üyelik zaten iptal edildi."
with a "Üyeliklerime Dön" link → `/account/uyeliklerim`.

---

**Key Components**

`CancellationShell`, `ConsequenceDisclosureStep` (with optional retention offer block),
`FinalConfirmationStep`, `CancellationSubmitButton`, `AlreadyCancelledState`

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Membership detail (tier name, creator, billing interval, price, status) | Yes — step 1 cannot render without it | Membership API |
| Access end date (current billing period end) | Yes — end date notice in both steps | Membership / billing API |
| Fan ownership of the membership | Yes — access guard | Membership API + auth session |
| Retention offer configuration (if any) | No — step renders without it | Platform config / promotions API (optional) |

---

**Empty States**

No empty state. The page renders with membership data or shows the already-cancelled state.

---

**Loading States**

- Page initial load: skeleton layout for step 1 content while membership data is fetched.
- "Evet, İptal Et" submission: button enters loading state; both CTAs in step 2 become
  non-interactive. Redirect on success.

---

**Error States**

- **Membership not found or not owned by fan:** Redirect to `/account/uyeliklerim` with
  a toast: "Üyelik bulunamadı."
- **Membership already cancelled (navigate to URL directly):** Already-cancelled notice
  shown (see above). No form is rendered.
- **Cancellation API call fails:** Error toast in step 2. "İptal işlemi gerçekleştirilemedi.
  Lütfen tekrar deneyin." Step 2 CTAs become interactive again.
- **Access end date unavailable:** End date notice shows "Mevcut fatura döneminizin sonuna
  kadar" as a fallback if the exact date cannot be resolved.

---

**Edge Cases**

- **Fan double-submits (taps "Evet, İptal Et" twice):** The button must be disabled after
  the first tap to prevent duplicate API calls. If the second call does reach the server,
  the endpoint should be idempotent.
- **Annual membership cancellation:** End date is the annual period end — potentially
  months away. The end-date notice must display the full calendar date, not a relative
  phrase, to avoid confusion. No proration (assumption 4).
- **Membership transitions into grace period while fan is on this page:** If the fan
  initiates cancellation on a membership that is in a renewal-failure grace period, the
  cancellation is still valid and follows the same end-of-period logic.
- **Creator deletes their account or tier while fan is mid-flow:** Cancellation API call
  should still succeed — the membership exists as a billing record even if the tier/creator
  is no longer active.
- **Fan abandons mid-flow and returns later:** Client-side step state is reset. Fan starts
  from step 1 on return. No server-side step persistence needed.

---

**Permissions / Entitlement Rules**

- Auth-required; fan must own the membership being cancelled.
- The cancellation is submitted as the fan's own action. Creator-side cancellation (e.g.,
  an admin or creator revoking a specific fan's membership) is a separate operation not
  accessible via this route.
- Post-cancellation access is governed by the billing period end date, not this page.
  The membership module enforces access lapse at the correct moment.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `cancellation_flow_started` | `fan_id`, `membership_id`, `billing_interval: 'monthly' \| 'annual'`, `price_try` |
| `cancellation_step1_viewed` | `fan_id`, `membership_id`, `retention_offer_shown: boolean` |
| `cancellation_retention_offer_accepted` | `fan_id`, `membership_id`, `offer_type` |
| `cancellation_step2_viewed` | `fan_id`, `membership_id` |
| `cancellation_confirmed` | `fan_id`, `membership_id`, `access_end_date` |
| `cancellation_abandoned` | `fan_id`, `membership_id`, `abandoned_at_step: 1 \| 2` |
| `cancellation_failed` | `fan_id`, `membership_id`, `error_reason` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Auth session (fan role) | Required — access guard |
| Membership API | Required — detail data and cancellation submission |
| Billing API | Required — access end date (billing period end) |
| Promotions / platform config API | Optional — retention offer |
| [`/account/uyeliklerim`](#family-14--memberships--billing) | Post-cancellation redirect + "Vazgeç" destination |
| [`/account/uyeliklerim/[membership-id]`](#family-14--memberships--billing) | "Vazgeç" destination from step 1 |
| Family 15 (Notifications) | Downstream — delivers cancellation confirmation notification |
