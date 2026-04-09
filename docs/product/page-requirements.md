# Page Requirements — lalabits.art

> **Status:** Approved
> **Version:** v1.0
> **Scope:** Phase 1 MVP
> **Authority level:** Supporting
>
> **Purpose:** This is the canonical, merged page requirements document for lalabits.art Phase 1 MVP. It consolidates all four detailed requirements files into one authoritative reference. The four source files (`page-requirements-public-auth.md`, `page-requirements-creator.md`, `page-requirements-fan-billing.md`, `page-requirements-admin-legal.md`) remain as working documents; this file is the primary authority for implementation.
>
> **Scope:** 24 page families across 7 groups — Public (1–2), Auth (3–6), Creator (7–12), Fan/Member (13–15), Checkout/Billing (16–19), Admin/Operations (20–21), Legal/Trust (22–24).
>
> **Authority:** [page-requirements-outline.md](./page-requirements-outline.md) · [sitemap.md](./sitemap.md) · [vision.md](./vision.md) · [CLAUDE.md](../../CLAUDE.md)

---

## Launch-Critical Page Summary

| # | Family Name | Primary Route(s) | Group |
|---|---|---|---|
| 1 | Ana Sayfa | `/` | Public |
| 2 | Keşfet | `/kesfet` | Public |
| 3 | Giriş | `/auth/giris` | Auth |
| 4 | Fan Kaydı | `/auth/kayit/fan` | Auth |
| 5 | Yaratıcı Başvurusu | `/auth/kayit/yaratici` | Auth |
| 6 | Parola Sıfırlama | `/auth/parola-sifirla` | Auth |
| 7 | Creator Onboarding Flow | `/onboarding` → `/onboarding/inceleme` | Creator |
| 8 | Creator Public Page | `/@[username]` (+ tab sub-routes) | Creator |
| 9 | Creator Dashboard Overview | `/dashboard` | Creator |
| 10 | Posts Management | `/dashboard/gonderiler` (+ new + edit) | Creator |
| 11 | Membership Plans | `/dashboard/uyelik-planlari` (+ new + edit) | Creator |
| 12 | Products & Collections Management | `/dashboard/magaza` · `/dashboard/koleksiyonlar` | Creator |
| 13 | Library | `/account/kutuphane` · `/account/satin-almalar` | Fan / Member |
| 14 | Memberships & Billing | `/account/uyeliklerim` · `/account/uyeliklerim/[membership-id]` · `/account/fatura` | Fan / Member |
| 15 | Notifications | `/account/bildirimler` | Fan / Member |
| 16 | Membership Checkout | `/checkout/uyelik/[creator-username]/[tier-id]` | Checkout / Billing |
| 17 | Product Checkout | `/checkout/urun/[product-id]` | Checkout / Billing |
| 18 | Collection Checkout | `/checkout/koleksiyon/[collection-id]` | Checkout / Billing |
| 19 | Cancellation Flow | `/uyelik/[membership-id]/iptal` | Checkout / Billing |
| 20 | Creator Review Queue | `/admin` · `/admin/yaraticilar/inceleme` | Admin / Operations |
| 21 | Moderation & Reports | `/admin/moderasyon/raporlar` · `/admin/moderasyon/raporlar/[report-id]` · `/admin/moderasyon/icerik` | Admin / Operations |
| 22 | Terms of Service | `/legal/kullanim-kosullari` | Legal / Trust |
| 23 | Privacy Policy | `/legal/gizlilik-politikasi` | Legal / Trust |
| 24 | Creator Agreement | `/legal/yaratici-sozlesmesi` | Legal / Trust |

---

## Intentionally Deferred Pages

These routes exist in the sitemap but are not documented in the page requirements for Phase 1 launch.

| Route(s) | Family / Name | Defer Reason |
|---|---|---|
| `/baslangic` | Routing splash | Home handles fan/creator routing split; separate page is unnecessary |
| `/iletisim` | Contact | Not required to complete any transaction at launch |
| `/@[username]/gonderi/[post-id]` | Post detail (standalone) | Modelled as a sub-state of Creator Public Page; not a separate entry |
| `/@[username]/magaza/[product-id]` | Product detail (standalone) | Sub-state of Creator Public Page |
| `/@[username]/koleksiyonlar/[collection-id]` | Collection detail (standalone) | Sub-state of Creator Public Page |
| `/account` | Account hub | Fan lands on Library directly; hub is redundant at launch |
| `/account/ayarlar` | Account settings | Post-launch; billing and auth settings are sufficient at MVP |
| `/account/ayarlar/bildirimler`, `/gizlilik` | Account sub-settings | Post-launch |
| `/account/fatura/gecmis` | Billing history | Covered by Memberships & Billing family |
| `/dashboard/kitle`, `/dashboard/kitle/[fan-id]` | Audience management | Post-launch; not required to ship the monetization loop |
| `/dashboard/analitik`, `/dashboard/analitik/gelir` | Analytics | Post-launch; payout view in onboarding is sufficient for launch trust |
| `/dashboard/analitik/uyeler`, `/icerik` | Advanced analytics | Post-launch |
| `/dashboard/odeme` | Payout operations | Post-launch; payout method captured during onboarding |
| `/dashboard/ayarlar/profil`, `/hesap` | Creator settings | Post-launch; profile established during onboarding |
| `/dashboard/ayarlar/sayfa`, `/uyumluluk`, `/bildirimler` | Dashboard sub-settings | Post-launch |
| `/admin/yaraticilar/[creator-id]` | Creator detail (admin) | Post-launch; queue + inline approve/reject actions are sufficient |
| `/admin/fatura` | Admin billing ops | Post-launch; payment gateway handles disputes directly |
| `/admin/denetim-gunlugu` | Audit log | Post-launch; logging infrastructure ships before the UI |
| `/admin/kullanicilar` | User management | Post-launch |
| `/admin/telif-hakki` | Copyright claims | Post-launch; email-based DMCA process covers launch |
| `/admin/fatura/anlasmmazliklar`, `/odemeler` | Admin billing sub-pages | Post-launch |
| `/admin/icerik-yonetimi` and sub-pages | CMS | Post-launch |
| `/legal/cerez-politikasi` | Cookie policy | Post-launch; consent banner covers MVP |
| `/legal/telif-hakki` | Copyright / DMCA policy | Post-launch; email process covers MVP |
| `/legal/guven-ve-guvenlik` | Trust & Safety policy | Post-launch; moderation queue covers operational needs |
| All chat routes | Chat (1:1 and group) | Explicitly excluded from Phase 1 launch |
| `/uyelik/[id]/yuksel`, `/dusur`, `/yenile` | Tier change flows | Post-launch; cancellation only at MVP |
| `/ozellikler`, `/fiyatlar`, `/yaraticilar`, `/hakkimizda` | Marketing pages | Post-launch polish |
| `/kaynaklar`, `/kaynaklar/[slug]`, `/guncellemeler` | Blog / changelog | Post-launch content marketing |

---

## Assumptions

The following product decisions apply across the entire platform. All field-level references within family entries use these global assumption numbers. If any assumption changes, the affected family fields must be revisited.

1. **Dual-role accounts.** A user registered as a fan can begin creator onboarding on the same account. Fan and creator roles coexist on a single identity. If separate accounts are required instead, the onboarding entry point and redirect logic change significantly.

2. **Email verification required.** A fan cannot complete checkout or access gated content until their email is verified. Verification happens asynchronously after signup. Checkout pages show a "E-posta adresinizi doğrulayın" banner with a resend link if the fan is unverified.

3. **Google OAuth at launch.** Login, Fan Signup, and Creator Signup include Google OAuth as an alternative auth method. If Google OAuth is deferred to post-launch, remove all social auth references from these pages and simplify error states.

4. **Account enumeration protection.** Password Reset (State A) and Fan Signup email-exists errors must not confirm whether a given email is registered. This is a security constraint, not a UX preference.

5. **Return URL behavior.** Any page that triggers a redirect to login (e.g., clicking a gated subscribe button) passes the intended destination as `?return=` in the login URL. The login page validates this URL is same-origin before redirecting. No open redirect.

6. **Google OAuth on password reset.** If a user submits a reset request for an email registered only via Google OAuth, the current assumption is to show a clarifying message ("bu hesap Google ile bağlı") after submission. This is a minor enumeration risk — it reveals that a Google account exists for that email. Flag for security review before launch.

7. **IBAN validation at MVP.** The onboarding payout step validates IBAN format only. Actual bank account verification is deferred. Flag for compliance review before launch.

8. **Product unpublish policy.** When a creator unpublishes a digital product, the access policy for prior purchasers is undecided. Option A: prior purchasers lose download access (stricter enforcement). Option B: prior purchasers retain access; only new purchases are blocked (fan-friendly). Policy decision required before launch. This document does not assume a default — the edge case is flagged wherever it surfaces.

9. **Tier price changes.** Price changes on active membership tiers take effect at the next billing cycle. No proration. Existing subscribers are not grandfathered at the old price.

10. **Post access level changes.** Changing a published post's access level from free to gated immediately revokes access for viewers who no longer qualify. No grace period. Flag for policy review.

11. **Creator approval notification channel.** Admin approval triggers a transactional email to the creator. An in-app notification for the same event is a dependency on the Notifications module (Family 15) — it is not assumed to be available at the time this page family ships.

12. **Maximum tiers.** No hard system cap is defined at MVP. The tier list UI should indicate a practical limit (e.g., "en fazla 5 plan ekleyebilirsiniz") to prevent abuse and manage UI complexity.

13. **Payment gateway embeds.** The checkout payment form embeds the Turkish payment gateway's hosted UI (iframe or hosted fields). The platform never handles raw card data. PCI compliance is the gateway's responsibility. Specific gateway provider is not named in this document.

14. **Cancellation is end-of-period.** Cancelling a membership never revokes access immediately. Access continues until the last day of the current billing period. No prorated refund for any billing interval at MVP.

15. **Annual cancellation.** Annual memberships follow the same end-of-period policy — access continues to the annual period end date. No prorated refund at MVP. Flag for legal and product review before launch (KVKK / Turkish consumer rights implications).

16. **Renewal failure grace period.** When a recurring billing charge fails, the membership enters a grace-period state during which the fan retains access and is prompted to update their payment method. If not resolved within the grace period, the membership is cancelled. Grace period duration (e.g., 3–7 days) is a billing module decision and is not defined in this document.

17. **Retention offers on cancellation.** Whether a retention offer (e.g., a discount coupon) is shown during the cancellation consequence-disclosure step is undecided. The flow accommodates it as an optional conditional section. Offer logic and business rules are deferred.

18. **Shared checkout confirmation/error routes.** `/checkout/onay/[order-id]` and `/checkout/hata/[order-id]` serve all three checkout types (membership, product, collection). Copy and CTAs vary by `order.type`. These are not a separate page family; each checkout family in this document defines its own variant of these states.

19. **Admin account separation.** Admin accounts are not created through the public signup flow. They are provisioned directly by the platform operator. The admin login mechanism (separate route, separate session scope, or role elevation on a verified identity) is an infrastructure decision not defined in this document.

20. **Inline creator review.** Since `/admin/yaraticilar/[creator-id]` (full creator detail admin view) is deferred, the review queue must present sufficient data inline — profile, tiers, IBAN format status, agreement acceptance — for an admin to approve, reject, or suspend a creator without navigating away from the queue.

21. **Audit trail exists before admin actions ship.** All admin actions (approve, reject, suspend, warn, remove, restrict, dismiss) must be logged server-side before admin tools are used in production. The audit log UI (`/admin/denetim-gunlugu`) is deferred; the logging infrastructure is not.

22. **Report reason taxonomy.** The categories a user can select when submitting a report (e.g., "Spam", "Yanıltıcı İçerik", "Hakaret / Taciz", "Telif Hakkı İhlali", "Yasa Dışı İçerik") are a product and operational decision. The exact taxonomy must be defined before the moderation module ships. This document uses placeholder labels.

23. **Flagged content sources.** The flagged content queue may receive items from user report escalations, system-triggered flags (e.g., automated keyword detection), or manual admin flags. The mechanism for system-triggered flagging is a backend and infrastructure decision. This document defines the queue UI and admin actions only.

24. **Legal page content authority.** The legal pages (Terms, Privacy, Creator Agreement) contain legally binding text. Content is authored and maintained by the platform operator's legal team. This document defines delivery requirements (structure, versioning, consent record dependencies) — not the legal text itself.

25. **Legal page versioning.** Each legal page displays a "Son güncelleme: [tarih]" label and a machine-readable version identifier. Consent records in auth and onboarding flows reference this version. How existing consent records are handled when a policy updates (re-acceptance prompt vs. notification) is a legal and backend decision not defined in this document.

---

## Public

---

### Family 1 — Ana Sayfa

**Route:** `/`

**Page Name:** Ana Sayfa

**Page Goal:** Communicate the platform's value proposition to first-time visitors and convert
them into fan registrations or creator applications.

**Primary User:** Unauthenticated visitor

**Access Level:** Public — no authentication required. Page is always accessible regardless of
auth state. Authenticated users see adapted CTAs but are not redirected away.

**Primary CTA:**
- For visitors: "Başla" → `/auth/kayit/fan` (fan path, primary) and "Yaratıcı Ol" →
  `/auth/kayit/yaratici` (creator path, secondary)
- For authenticated fans: "Kütüphaneme Git" → `/account/kutuphane`
- For authenticated creators: "Dashboard'a Git" → `/dashboard`

---

**Core Sections**

1. **Hero** — Full-width section with primary headline, sub-headline, and dual CTA buttons
   (fan and creator paths). Accompanied by a visual that communicates the creator/audience
   relationship. This is the primary acquisition surface.

2. **Creator Value Proposition** — Three to four benefit statements targeting creators:
   earn from recurring memberships, sell digital products, publish premium content, keep
   direct control of your audience. Each statement is brief (one line + icon).

3. **Fan Value Proposition** — Three to four benefit statements targeting fans: discover
   creators you love, access exclusive content, manage all subscriptions in one place,
   support creators directly in Turkish lira.

4. **Featured Creators Strip** — Horizontally scrollable row of curated creator cards.
   Social proof. Pulls from a curated list managed via admin CMS (post-launch) or a
   hardcoded seed list at MVP. Non-blocking — page renders without it.

5. **How It Works** — Two-column section (one column per user type). Three numbered steps
   each: creator side (sign up → publish → earn) and fan side (discover → subscribe → access).

6. **Final CTA Banner** — Bottom-of-page conversion push. Single large headline + primary
   CTA button. Same routing as hero CTA.

---

**Key Components**

`HeroSection`, `ValuePropList`, `ValuePropItem`, `CreatorTeaserCard`,
`FeaturedCreatorsStrip`, `HowItWorksGrid`, `HowItWorksStep`, `CTABanner`,
`AuthAdaptiveCTA` (renders different label/destination based on auth state)

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Featured creators list (avatar, name, category, slug) | No | Creator API — curated list endpoint |
| Auth session state | No | Session/cookie — determines which CTA variant renders |

Page shell (hero, value props, how it works, final CTA) is fully static and renders
immediately without any API calls.

---

**Empty States**

- **Featured creators strip — no curated creators exist:** Render a fallback "Yaratıcıları
  Keşfet" link button pointing to `/kesfet` in place of the creator card row. Do not show
  an empty row or broken layout.

---

**Loading States**

- Featured creators strip renders skeleton cards (e.g., 4–6 placeholder cards) while the
  API response loads. All other sections are static and do not have loading states.

---

**Error States**

- **Featured creators API fails:** Replace strip with fallback "Keşfet" CTA (same as empty
  state above). Do not show an error message to the visitor — this section is not critical.
- **Page itself never fully fails** — static sections are always renderable.

---

**Edge Cases**

- **Authenticated fan visits `/`:** Page renders normally. Hero CTA changes to
  "Kütüphaneme Git." No forced redirect. Fan may be browsing for another creator.
- **Authenticated creator visits `/`:** Hero CTA changes to "Dashboard'a Git."
- **Zero approved creators in the system (very early launch):** Featured strip shows fallback
  CTA. `/kesfet` will also show the empty-state. This is expected during seeding period.
- **Visitor arrives via a shared creator link:** They may land here only if the creator's URL
  was wrong or the creator was suspended. The home page should not be the default fallback for
  a bad `/@username` — that 404 is handled by the creator profile page.

---

**Permissions / Entitlement Rules**

- No permissions. Page is fully public.
- CTA destination adapts based on session state but no content is gated or hidden.
- Featured creators listed must be in `approved` status. Backend query must filter by status.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `home_page_viewed` | `source`, `referrer_domain`, `is_authenticated`, `user_role` |
| `hero_cta_clicked` | `cta_variant: 'fan_signup' \| 'creator_signup' \| 'library' \| 'dashboard'` |
| `featured_creator_clicked` | `creator_id`, `position` (0-indexed), `creator_category` |
| `how_it_works_section_viewed` | `user_type_tab: 'creator' \| 'fan'` (if tabs are used) |
| `footer_cta_clicked` | `cta_variant` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Featured creators API | Non-blocking data |
| Auth session | Non-blocking session state |
| [`/auth/kayit/fan`](#family-4--fan-kaydı) | CTA destination |
| [`/auth/kayit/yaratici`](#family-5--yaratıcı-başvurusu) | CTA destination |
| [`/kesfet`](#family-2--keşfet) | Fallback link from empty featured strip |
| `/account/kutuphane` | Authenticated fan CTA destination |
| `/dashboard` | Authenticated creator CTA destination |

---

### Family 2 — Keşfet

**Route:** `/kesfet`

**Page Name:** Keşfet

**Page Goal:** Allow any visitor or fan to browse, search, and filter all approved creators
to find one they want to follow or subscribe to.

**Primary User:** Unauthenticated visitor / authenticated fan

**Access Level:** Public — no authentication required to browse. Following or subscribing
from this page requires auth (redirects to login with return URL).

**Primary CTA:** Creator card click → `/@[username]`

---

**Core Sections**

1. **Page Header** — Page title ("Yaratıcıları Keşfet"), brief descriptor line.

2. **Search Bar** — Full-width text input. Searches by creator display name, username, and
   bio keywords. Debounced (300ms). Clears filter chips when a search is active (or applies
   alongside them — see edge cases).

3. **Filter Bar** — Horizontal row of filter chips:
   - Category (Yazar, İllüstratör, Eğitimci, Podcast, Müzisyen, Tasarımcı, Geliştirici,
     Diğer — sourced from category taxonomy)
   - Sort (Popüler, Yeni Katılanlar)
   Active filters are visually highlighted. Filters are combinable.

4. **Creator Grid** — Responsive grid of `CreatorCard` components. Each card shows:
   avatar, display name, username (`@handle`), category badge, short bio (truncated to 2
   lines), member count, and starting membership price (or "Ücretsiz Takip Et" if no paid
   tiers). Card is fully clickable → `/@[username]`.

5. **Pagination / Load More** — "Daha Fazla Yükle" button or infinite scroll trigger at
   bottom of grid. Default page size: 24 creators per load.

6. **Results Summary** — Below filter bar, above grid: "X yaratıcı bulundu" text. Updates
   as filters/search change.

---

**Key Components**

`SearchBar`, `FilterChipGroup`, `FilterChip`, `CreatorCard`, `CreatorGrid`,
`ResultsSummaryText`, `LoadMoreButton` / `InfiniteScrollTrigger`, `EmptySearchResult`,
`CategoryBadge`

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| Creator list with pagination (filtered/sorted) | Yes — page is empty without it | Creator search API |
| Category taxonomy list | No (can fallback to no filter chips) | Static config or taxonomy API |
| Total result count | No (renders without it but useful) | Same API response |

---

**Empty States**

- **No creators in system:** Full-page empty state: illustration + "Henüz yaratıcı yok.
  Çok yakında yeni yaratıcılar bu sayfada görünecek." No search bar visible.
- **No results for search/filter combination:** Grid-level empty state: "Aradığınız kriterlere
  uyan yaratıcı bulunamadı." with "Filtreleri Temizle" button.

---

**Loading States**

- **Initial page load:** Grid renders 12 skeleton `CreatorCard` placeholders while API loads.
- **Filter/search change:** Skeleton overlay replaces grid immediately on filter change;
  do not clear and show blank — maintain approximate grid dimensions.
- **Load more trigger:** Spinner row appears below existing grid cards while next page loads.

---

**Error States**

- **Creator list API failure:** Full-page error state: "Yaratıcılar yüklenirken bir sorun
  oluştu." with a "Tekrar Dene" button. Do not show a broken empty grid.
- **Category taxonomy API failure:** Filter bar renders without category chips. Search and
  sort remain functional.

---

**Edge Cases**

- **Search + category filter simultaneously:** Both applied with AND logic. If a creator
  matches the search term but not the active category, they do not appear.
- **Filter state in URL querystring:** `/kesfet?kategori=yazar&siralama=yeni` — filters are
  URL-encoded and applied on load. URL updates as filters change. This enables shareable
  filter links.
- **Creator in approved status with no published content yet:** Still appears in discovery
  (they may have tiers and a bio). Their card shows 0 posts, which is valid.
- **Suspended creator:** Must not appear in results. The query must be `status = approved`.
  This is a backend enforcement requirement, not a frontend filter.
- **Very long bio:** Truncated to 2 lines in card, full text visible on `/@[username]`.
- **Creator with no paid tiers:** Starting price displays "Ücretsiz Takip Et" instead of
  a price.
- **Creator with no avatar:** Fallback to initials avatar (e.g., "AY" for "Ayşe Yıldız").

---

**Permissions / Entitlement Rules**

- Page is fully public. No auth required to browse.
- Suspended and pending creators must not appear. Enforced server-side on query.
- If a visitor clicks "Takip Et" or "Üye Ol" from a creator card CTA (if exposed on card),
  redirect to `/auth/giris?return=/@[username]` if not authenticated.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `discovery_page_viewed` | `source`, `initial_filter_state` (from URL params) |
| `search_performed` | `query_length`, `result_count`, `has_active_filters` |
| `filter_applied` | `filter_type: 'category' \| 'sort'`, `filter_value`, `result_count` |
| `filter_cleared` | `cleared_type: 'single' \| 'all'` |
| `creator_card_clicked` | `creator_id`, `position` (0-indexed), `creator_category`, `source: 'grid' \| 'search_result'` |
| `load_more_triggered` | `page_number`, `current_result_count` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Creator search + filter API | Blocking data |
| Category taxonomy | Non-blocking config |
| `/@[username]` | Navigation destination |
| [`/auth/giris`](#family-3--giriş-yap) | Auth redirect for gated actions |

---

## Auth

---

### Family 3 — Giriş Yap

**Route:** `/auth/giris`

**Page Name:** Giriş Yap

**Page Goal:** Authenticate an existing user (fan or creator) and route them to their
appropriate destination after successful login.

**Primary User:** Existing user (fan or creator) returning to their account

**Access Level:** Public — but authenticated users are immediately redirected away.

**Primary CTA:** "Giriş Yap" button — submits email/password credentials

---

**Core Sections**

1. **Brand Mark** — Platform logo, centered. Keeps context clear when arriving via a
   redirect from a third-party link.

2. **Login Form** — Two fields: email address and password. "Beni Hatırla" checkbox below
   the password field (extends session to 30 days if checked).

3. **Forgot Password Link** — Inline link below the password field: "Şifremi unuttum" →
   `/auth/sifre-sifirla`. Does not submit the form.

4. **Submit CTA** — Full-width "Giriş Yap" button. Disabled while request is in-flight.

5. **Social Auth Separator** — Horizontal divider with "veya" label. Only rendered if Google
   OAuth is enabled at launch (see assumption 3).

6. **Google Auth Button** — "Google ile Giriş Yap" — initiates OAuth flow. Full-width,
   below the separator.

7. **Registration Links** — Below the form: "Hesabınız yok mu?" with two inline links:
   "Fan olarak kaydol" → `/auth/kayit/fan` and "Yaratıcı başvurusu" →
   `/auth/kayit/yaratici`.

---

**Key Components**

`AuthCard`, `BrandMark`, `EmailInput`, `PasswordInput`, `RememberMeCheckbox`,
`ForgotPasswordLink`, `AuthSubmitButton`, `SocialAuthDivider`, `GoogleAuthButton`,
`InlineFormError`, `RegistrationLinks`

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| None — page renders statically | — | — |
| On submit: `POST /auth/login` with `email`, `password`, `remember_me` | — | Auth API |
| On Google auth: OAuth redirect flow | — | Google OAuth |

---

**Empty States**

Not applicable — form always renders.

---

**Loading States**

- Submit button shows inline spinner and is disabled during the authentication request.
- Both the email and password fields are disabled during the request to prevent modification.
- Google auth button shows spinner and is disabled while OAuth redirect is preparing.

---

**Error States**

| Error | Message | Action Offered |
|---|---|---|
| Invalid credentials (wrong email or password) | "E-posta veya şifre hatalı." | None — do not indicate which field is wrong. This is a deliberate security measure. |
| Account not yet verified | "Hesabınızı doğrulamak için e-postanıza gönderilen bağlantıya tıklayın." | Inline link: "Yeniden gönder" → triggers resend verification email |
| Account suspended | "Hesabınız askıya alınmıştır. Destek için iletişime geçin." | No redirect. Display only. |
| Google OAuth account attempts email login | "Bu e-posta bir Google hesabıyla kayıtlıdır. Google ile giriş yapın." | Google auth button highlighted |
| Rate limit exceeded (too many failed attempts) | "Çok fazla başarısız deneme. Birkaç dakika sonra tekrar deneyin." | No action button. Retry timer if implementable. |
| Network / server error | "Bağlantı hatası. Lütfen tekrar deneyin." | "Tekrar Dene" button re-enables the form |

---

**Edge Cases**

- **Authenticated user visits `/auth/giris`:** Redirect immediately without rendering the
  form. Destination: fan → `/account/kutuphane`, creator (approved) → `/dashboard`,
  creator (pending/onboarding incomplete) → `/onboarding` at last completed step.
- **Login with return URL** (`/auth/giris?return=/checkout/uyelik/.../...`): After successful
  authentication, redirect to the `return` value. The `return` parameter must be validated:
  only same-origin relative paths are accepted. Reject and ignore any absolute URLs or
  cross-origin paths (redirect to default home instead).
- **Creator account registered but onboarding not started:** Login succeeds, redirect to
  `/onboarding` step 1.
- **Creator account onboarding partially completed:** Login succeeds, redirect to the
  last incomplete onboarding step.
- **Creator account onboarding complete, pending admin review:** Login succeeds, redirect
  to `/onboarding/inceleme` (the confirmation/waiting screen).
- **Creator account approved but profile has no published content:** Login succeeds, redirect
  to `/dashboard`. This is a valid state.
- **Admin user logs in:** Admin accounts are not addressed in this document. Flag as a
  separate auth flow requirement.

---

**Permissions / Entitlement Rules**

- Page is public. No entitlement gating.
- Authenticated users must be redirected before the login form renders.
- Return URL must be validated server-side (or at minimum client-side with an allowlist of
  same-origin paths) before redirect is performed.
- "Beni Hatırla" extends session lifetime to 30 days (configurable). Default session without
  checkbox: browser session only.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `login_page_viewed` | `source`, `has_return_url: boolean`, `referrer` |
| `login_attempted` | `method: 'email' \| 'google'` |
| `login_succeeded` | `method`, `user_role: 'fan' \| 'creator' \| 'admin'`, `redirect_destination` |
| `login_failed` | `method`, `error_type: 'invalid_credentials' \| 'unverified' \| 'suspended' \| 'rate_limited' \| 'network'` |
| `forgot_password_clicked` | — |
| `signup_cta_clicked` | `target: 'fan' \| 'creator'` |
| `resend_verification_clicked` | — |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Auth API (`POST /auth/login`) | Blocking on submit |
| Google OAuth provider | Blocking on social submit |
| Session management service | Required for session creation |
| [`/auth/sifre-sifirla`](#family-6--şifre-sıfırlama) | Forgot password link |
| [`/auth/kayit/fan`](#family-4--fan-kaydı) | Registration link |
| [`/auth/kayit/yaratici`](#family-5--yaratıcı-başvurusu) | Registration link |
| `/account/kutuphane` | Fan post-login destination |
| `/dashboard` | Creator post-login destination |
| `/onboarding` | Pending creator post-login destination |

---

### Family 4 — Fan Kaydı

**Route:** `/auth/kayit/fan`

**Page Name:** Fan Kaydı

**Page Goal:** Register a new fan account and initiate email address verification.

**Primary User:** New visitor who wants to follow and support creators

**Access Level:** Public — authenticated users are redirected away.

**Primary CTA:** "Hesap Oluştur" — submits registration form

---

**Core Sections**

1. **Brand Mark** — Platform logo.

2. **Registration Form** — Four fields: display name, email address, password, confirm
   password. Fields validated inline on blur (not on every keystroke).

3. **Terms Acceptance Checkbox** — Required. Label: "Kullanım Koşullarını ve Gizlilik
   Politikasını kabul ediyorum." Both terms link inline to their respective legal pages,
   opening in a new tab. Form cannot be submitted without this checkbox.

4. **Submit CTA** — Full-width "Hesap Oluştur" button. Disabled while request is in-flight
   or terms checkbox is unchecked.

5. **Social Auth Separator + Google Button** — "Google ile Devam Et" as an alternative path.
   Inline terms acceptance note: "Google ile kaydolarak Kullanım Koşullarını kabul
   etmiş olursunuz."

6. **Sign In Link** — Below form: "Zaten hesabınız var mı? Giriş yapın" → `/auth/giris`.

7. **Creator Path Hint** — Tertiary, low-prominence text link at the bottom of the card:
   "Yaratıcı mısınız? Başvuru için buraya tıklayın" → `/auth/kayit/yaratici`. Not a CTA.

---

**Key Components**

`AuthCard`, `BrandMark`, `DisplayNameInput`, `EmailInput`, `PasswordInput`,
`PasswordConfirmInput`, `TermsCheckbox`, `AuthSubmitButton`, `SocialAuthDivider`,
`GoogleAuthButton`, `InlineFormError`, `PasswordStrengthIndicator` (optional),
`SignInLink`, `CreatorHintLink`

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| None — page renders statically | — | — |
| On submit: `POST /auth/register` with `display_name`, `email`, `password` | — | Auth API |

---

**Empty States**

Not applicable — form always renders.

---

**Loading States**

- Submit button shows spinner, is disabled, and all form fields are disabled during request.
- Google button disabled and shows spinner while OAuth flow initiates.

---

**Error States**

| Error | Message | Action |
|---|---|---|
| Email already registered (email/password account) | "Bu e-posta zaten kayıtlı. Giriş yapmak ister misiniz?" | Inline link to `/auth/giris` |
| Email already registered (Google OAuth account) | "Bu e-posta bir Google hesabıyla kayıtlıdır. Google ile giriş yapın." | Google button highlighted |
| Password too short (min 8 chars) | "Şifreniz en az 8 karakter olmalıdır." | Inline field error |
| Password missing required character class | "Şifreniz en az bir rakam içermelidir." | Inline field error |
| Passwords do not match | "Şifreler eşleşmiyor." | Inline on confirm-password field |
| Terms checkbox unchecked on submit | "Devam etmek için koşulları kabul etmeniz gerekiyor." | Inline below checkbox |
| Display name too short / empty | "Lütfen bir görünen ad girin." | Inline field error |
| Network / server error | "Bir hata oluştu. Lütfen tekrar deneyin." | "Tekrar Dene" re-enables form |

---

**Edge Cases**

- **Authenticated user visits fan signup:** Redirect to `/account/kutuphane`. Do not render
  the registration form.
- **Successful registration:** Redirect to `/auth/e-posta-dogrula` (email verification
  pending screen). Do not auto-login. User must verify before accessing gated content.
- **Google OAuth registration:** After OAuth callback, if email is new, account is created
  and marked as verified. Redirect to `/account/kutuphane` (no email verification step
  needed for OAuth accounts since Google has already verified the email).
- **Profanity or reserved display name:** Server returns 422 with a field-level error. Display
  name validation must be done server-side. Do not block on client alone.
- **User registered via fan signup then wants to apply as creator:** Can initiate creator
  signup while already logged in as a fan. The creator application flow attaches a creator
  profile to the existing account (see assumption 1).
- **Return URL preserved through verification:** If the user arrived at signup with a
  `?return=` URL (e.g., from a gated subscribe button), that URL should survive the email
  verification step and be applied after verification completes.
- **Registered but verification email not received:** The `/auth/e-posta-dogrula` screen
  provides a "Yeniden gönder" option. Rate-limit resend requests.

---

**Permissions / Entitlement Rules**

- Public page.
- Unverified fans can log in but cannot complete checkout, access tier-gated posts, or
  download purchased content until email is verified.
- Email verification is not required to browse public creator pages or the discovery feed.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `fan_signup_page_viewed` | `source`, `has_return_url: boolean`, `referrer` |
| `fan_signup_attempted` | `method: 'email' \| 'google'` |
| `fan_signup_succeeded` | `method` |
| `fan_signup_failed` | `method`, `error_type: 'email_exists' \| 'email_exists_google' \| 'validation' \| 'network'` |
| `terms_link_clicked` | `target: 'terms' \| 'privacy'` |
| `creator_hint_clicked` | — |
| `signin_link_clicked` | — |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Auth API (`POST /auth/register`) | Blocking on submit |
| Google OAuth provider | Blocking on social submit |
| Email delivery service | Required — sends verification email |
| `/auth/e-posta-dogrula` | Post-registration redirect destination |
| [`/auth/giris`](#family-3--giriş-yap) | Sign-in link and error state link |
| `/legal/kullanim-kosullari` | Linked from terms checkbox |
| `/legal/gizlilik-politikasi` | Linked from terms checkbox |

---

### Family 5 — Yaratıcı Başvurusu

**Route:** `/auth/kayit/yaratici`

**Page Name:** Yaratıcı Başvurusu

**Page Goal:** Register a new creator account with a unique username and route them into the
onboarding wizard.

**Primary User:** New visitor who wants to publish content and earn as a creator on the platform

**Access Level:** Public — authenticated fans can also reach this page to initiate a creator
application. Authenticated creators who have already started onboarding are redirected to
`/onboarding`.

**Primary CTA:** "Başvuruyu Başlat" — submits registration form

---

**Core Sections**

1. **Brand Mark + Creator Headline** — Logo + brief creator-oriented tagline:
   "Yaratıcılığınızı gelire dönüştürün."

2. **Creator Value Proposition** — Three short bullets before the form:
   - Üyelik geliri kazan
   - Dijital ürün sat
   - İçeriklerini tam kontrol et
   These are reassurance, not the primary content — keep brief.

3. **Registration Form** — Five fields:
   - Display name (görünen ad — shown to fans on the public profile)
   - Username (kullanıcı adı — defines `/@username`; shown with `@` prefix inline; note about
     permanence displayed below the field)
   - Email address
   - Password
   - Confirm password
   Username availability is checked in real-time (debounced 300ms) with an inline indicator.

4. **Terms + Creator Agreement Acceptance** — Combined single checkbox:
   "Kullanım Koşullarını ve Yaratıcı Sözleşmesini okudum, kabul ediyorum." Both documents
   linked inline. This is required before submission.

5. **Submit CTA** — "Başvuruyu Başlat" — full-width, disabled if checkbox unchecked or
   username is unavailable or check is pending.

6. **Sign In Link** — "Zaten hesabınız var mı? Giriş yapın" → `/auth/giris`.

7. **Fan Path Hint** — Low-prominence text: "Yaratıcı değil misiniz? Fan olarak kaydolun"
   → `/auth/kayit/fan`. Not a CTA.

---

**Key Components**

`AuthCard`, `BrandMark`, `CreatorValuePropList`, `DisplayNameInput`, `UsernameInput`,
`UsernameAvailabilityIndicator`, `UsernameFormatNote`, `UsernamePermanenceNote`,
`EmailInput`, `PasswordInput`, `PasswordConfirmInput`, `TermsCreatorCheckbox`,
`AuthSubmitButton`, `InlineFormError`, `SignInLink`, `FanHintLink`

---

**Required Data**

| Data | Blocking | Source |
|---|---|---|
| None — page renders statically | — | — |
| Username availability: `GET /auth/check-username?username=...` | No (non-blocking check; submit blocked until check completes) | Auth API |
| On submit: `POST /auth/register/creator` with `display_name`, `username`, `email`, `password` | — | Auth API |

---

**Empty States**

Not applicable.

---

**Loading States**

- Username field: spinner icon inside the field (right-aligned) while availability check is
  in-flight. Field is not disabled during check — user can keep typing (debounced).
- Submit button: spinner + disabled during form submission. All fields disabled.

---

**Error States**

| Error | Message | Location |
|---|---|---|
| Username taken | "Bu kullanıcı adı zaten alınmış." | Inline below username field |
| Username invalid format | "Kullanıcı adı yalnızca harf, rakam ve alt çizgi (_) içerebilir." | Inline below username field |
| Username too short (min 3 chars) | "Kullanıcı adı en az 3 karakter olmalıdır." | Inline |
| Username too long (max 30 chars) | "Kullanıcı adı en fazla 30 karakter olabilir." | Inline |
| Username is a reserved word | "Bu kullanıcı adı kullanılamaz." | Inline (same message as taken — do not reveal which words are reserved) |
| Email already registered | "Bu e-posta zaten kayıtlı. Giriş yapmak ister misiniz?" | Inline form error + link |
| Password too weak | "Şifreniz en az 8 karakter olmalı ve bir rakam içermelidir." | Inline |
| Passwords do not match | "Şifreler eşleşmiyor." | Inline on confirm field |
| Terms unchecked | "Devam etmek için koşulları kabul etmeniz gerekiyor." | Inline below checkbox |
| Network error | "Bir hata oluştu. Lütfen tekrar deneyin." | Form-level error |

---

**Edge Cases**

- **Username permanence:** The username set here defines the public `/@username` URL and
  cannot be changed by the creator after registration. It can only be changed by an admin
  via a support request. Display a clear, persistent note below the username field:
  "Bu kullanıcı adı değiştirilemez. Dikkatli seçin."

- **Reserved username list:** The backend must maintain a blocklist of reserved paths that
  would conflict with system routes (e.g., `admin`, `legal`, `kesfet`, `dashboard`, `api`,
  `auth`, `onboarding`, `account`, `checkout`, `uyelik`, `about`, `help`, etc.). Client-side
  does not maintain this list — the server returns an availability-check response of
  `available: false` for reserved words.

- **Authenticated fan initiates creator application:** The form renders normally. On
  successful submission, the existing fan account gains a creator identity attached to it.
  The fan's existing memberships and library are unaffected. Post-submission, redirect to
  `/onboarding` step 1 as a creator.

- **Authenticated creator (already in onboarding) visits this page:** Redirect to
  `/onboarding` at the last completed step. Do not show the registration form again.

- **Registered creator closes browser before completing onboarding:** On next login, the
  system detects creator status = `onboarding_incomplete` and redirects to the last saved
  step. The registration data (username, email) is already saved.

- **Username availability check network failure:** Show a neutral "kullanılabilirlik
  kontrol edilemiyor" indicator. Do not block form submission — server performs final
  uniqueness check on submit. If taken, show a form-level error after submission.

- **Creator registers, onboarding completes, admin rejects the application:** Creator is
  notified via email. On next login, redirect to `/onboarding/inceleme` with rejection reason
  displayed and option to reapply or appeal. This state is handled in the Onboarding family
  (family 7), not here.

---

**Permissions / Entitlement Rules**

- Public page.
- Creator accounts require admin approval before appearing in discovery, publishing content,
  or receiving payments.
- Until approved, creator cannot access `/dashboard`. Post-registration, they are in
  `onboarding` state.
- Creator role does not revoke fan capabilities. A creator can still subscribe to other
  creators using the fan side of their account.

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `creator_signup_page_viewed` | `source`, `referrer`, `is_authenticated_fan` |
| `username_availability_checked` | `is_available: boolean`, `username_length` |
| `creator_signup_attempted` | — |
| `creator_signup_succeeded` | — |
| `creator_signup_failed` | `error_type: 'username_taken' \| 'username_reserved' \| 'email_exists' \| 'validation' \| 'network'` |
| `creator_agreement_link_clicked` | — |
| `terms_link_clicked` | `target: 'terms' \| 'creator_agreement'` |
| `fan_hint_clicked` | — |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Auth API (`POST /auth/register/creator`) | Blocking on submit |
| Username availability API (`GET /auth/check-username`) | Non-blocking async check |
| Email delivery service | Required — sends verification email |
| `/onboarding` | Post-registration redirect |
| [`/auth/giris`](#family-3--giriş-yap) | Sign-in link |
| [`/auth/kayit/fan`](#family-4--fan-kaydı) | Fan hint link |
| `/legal/kullanim-kosullari` | Linked from combined terms checkbox |
| `/legal/yaratici-sozlesmesi` | Linked from combined terms checkbox |

---

### Family 6 — Şifre Sıfırlama

**Route:**
- State A: `/auth/sifre-sifirla` — email input, request a reset link
- State B: `/auth/sifre-sifirla/[token]` — set new password using the token from email

**Page Name:** Şifre Sıfırlama

**Page Goal:** Allow a user who has lost access to their account to regain it by resetting
their password via a time-limited email token.

**Primary User:** Fan or creator who cannot log in with their current password

**Access Level:** Public — both states are accessible without authentication.

**Primary CTA:**
- State A: "E-posta Gönder" — submits email address
- State B: "Şifremi Güncelle" — submits new password

---

**Core Sections**

**State A — Request Step** (`/auth/sifre-sifirla`)

1. **Brand Mark**
2. **Instruction Text** — "Şifrenizi mi unuttunuz? E-posta adresinizi girin, size bir
   sıfırlama bağlantısı gönderelim."
3. **Email Input** — Single email field.
4. **Submit CTA** — "E-posta Gönder"
5. **Confirmation Banner (post-submit)** — Replaces the form after submission:
   "E-posta adresinize bir sıfırlama bağlantısı gönderdik. Lütfen gelen kutunuzu kontrol
   edin." This banner shows regardless of whether the email exists (see edge cases).
6. **Back to Login Link** — "Giriş sayfasına dön" → `/auth/giris`

**State B — New Password Step** (`/auth/sifre-sifirla/[token]`)

1. **Brand Mark**
2. **Instruction Text** — "Yeni şifrenizi belirleyin."
3. **New Password Input** — With strength requirements note.
4. **Confirm Password Input**
5. **Submit CTA** — "Şifremi Güncelle"
6. **Success State (post-submit)** — Replaces the form: "Şifreniz güncellendi. Giriş
   yapabilirsiniz." with "Giriş Yap" button → `/auth/giris`.

---

**Key Components**

`AuthCard`, `BrandMark`, `EmailInput`, `PasswordInput`, `PasswordConfirmInput`,
`AuthSubmitButton`, `ConfirmationBanner`, `SuccessStateBanner`, `InlineFormError`,
`BackToLoginLink`

---

**Required Data**

| State | Data | Blocking |
|---|---|---|
| A | None to render | — |
| A (on submit) | `POST /auth/password-reset/request` with `email` | — |
| B | Token from URL validated server-side | Yes — renders error state if token invalid |
| B (on submit) | `POST /auth/password-reset/confirm` with `token`, `new_password` | — |

---

**Empty States**

Not applicable.

---

**Loading States**

- State A: Submit button shows spinner + disabled during request.
- State B: Submit button shows spinner + disabled; both password fields disabled during
  request.

---

**Error States**

**State A:**

| Error | Message | Notes |
|---|---|---|
| Email not registered | (same as success) "E-posta adresinize bir sıfırlama bağlantısı gönderdik." | Account enumeration protection — do not confirm or deny |
| Rate limit: too many requests | "Kısa sürede çok fazla istek gönderildi. Lütfen birkaç dakika bekleyin." | Shown instead of the standard success banner |
| Network error | "Bir hata oluştu. Lütfen tekrar deneyin." | Re-enables form |

**State B:**

| Error | Message | Action |
|---|---|---|
| Token expired (over 1 hour) | "Bu bağlantının süresi dolmuş. Yeni bir sıfırlama bağlantısı isteyin." | Link to `/auth/sifre-sifirla` (State A) |
| Token already used | "Bu bağlantı daha önce kullanıldı. Giriş yapmayı deneyin." | Link to `/auth/giris` |
| Token malformed / invalid | Same message as expired | Link to `/auth/sifre-sifirla` |
| Password too weak | "Şifreniz en az 8 karakter olmalı ve bir rakam içermelidir." | Inline |
| Passwords do not match | "Şifreler eşleşmiyor." | Inline |
| Network error | "Bir hata oluştu. Lütfen tekrar deneyin." | Re-enables form |

---

**Edge Cases**

- **Account enumeration protection (State A):** The response after submitting State A always
  shows the confirmation banner regardless of whether the email is in the system. This
  prevents an attacker from using the reset form to enumerate which emails have accounts.

- **Google OAuth account requests reset (State A):** After submission, show a slightly
  different confirmation: "Eğer bu e-posta bir Google hesabıyla kayıtlıysa, lütfen Google
  ile giriş yapmayı deneyin." This reveals that a Google account may exist for that email.
  This is a minor enumeration risk — flag for security review per assumption 6.

- **Suspended account requests reset:** Same success banner as any other submission. Do not
  reveal that the account is suspended via the password reset flow.

- **Multiple reset requests in a short window:** Each new request generates a new token and
  invalidates all previous tokens for that account. Only the most recent token is valid.

- **Token used successfully:** After password update, invalidate all existing sessions for
  that account. The user must log in again with their new password. Do not auto-login.

- **User arrives at State B with an expired token and submits anyway:** Server returns a
  `400` or `422` with token-expired error. Show the appropriate error banner (not a blank page).

- **Authenticated user visits State A:** Allow them to proceed. A logged-in user may want
  to change their password proactively. Do not redirect away. (Note: if a proper
  "change password" flow is added in settings post-launch, this use case is better served
  there — but at MVP, the reset flow serves this purpose.)

---

**Permissions / Entitlement Rules**

- Both states are fully public.
- Token in the reset URL is single-use and expires in 1 hour. These constraints are
  enforced server-side only.
- After successful password update, all active sessions for the account must be invalidated.
- The reset flow must not expose whether a given email address has an account (State A).

---

**Analytics Events**

| Event | Key Properties |
|---|---|
| `password_reset_request_viewed` | — |
| `password_reset_requested` | (no email logged — only hash or nothing for privacy) |
| `password_reset_token_viewed` | `token_valid: boolean` |
| `password_reset_completed` | — |
| `password_reset_failed` | `state: 'request' \| 'confirm'`, `error_type: 'rate_limited' \| 'expired' \| 'used' \| 'invalid' \| 'validation' \| 'network'` |
| `back_to_login_clicked` | `state: 'request' \| 'confirm'` |

---

**Dependencies**

| Dependency | Type |
|---|---|
| Auth API (`POST /auth/password-reset/request`) | Blocking on State A submit |
| Auth API (`POST /auth/password-reset/confirm`) | Blocking on State B submit |
| Token validation (server-side, on State B page load) | Blocking — determines which UI to show |
| Email delivery service | Required — sends reset email with token URL |
| Session invalidation service | Required on successful reset |
| [`/auth/giris`](#family-3--giriş-yap) | Back-to-login links and post-reset CTA |


---

## Creator

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
| [`/legal/yaratici-sozlesmesi`](#family-24--creator-agreement) | Linked from step 5 |
| Admin review queue (Family 20) | Downstream — receives submitted application |
| Email delivery service | Downstream — approval notification to creator |
| [`/dashboard`](#family-9--creator-dashboard-overview) | Post-approval destination |

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
  assumption 8). If conservative policy, product page shows "Bu ürün artık mevcut değil"
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
| [`/auth/giris`](#family-3--giriş-yap) | Destination for unauthenticated gated CTAs |
| [`/checkout/uyelik/...`](#family-16--membership-checkout) | Destination for "Üye Ol" CTAs |
| [`/checkout/urun/...`](#family-17--product-checkout) | Destination for product "Satın Al" CTAs |
| [`/checkout/koleksiyon/...`](#family-18--collection-checkout) | Destination for collection "Satın Al" CTAs |
| [`/kesfet`](#family-2--keşfet) | Back-link from 404 state |
| Creator profile edit destination (TBD — `/dashboard/ayarlar/profil` is post-launch; edit affordance links to an in-scope route to be determined) | Edit affordance on creator's own page view |

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
  public page. The effect on prior purchasers is a pending policy decision (see assumption 8
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
| [`/checkout/urun/...`](#family-17--product-checkout) | Purchase flow for products |
| [`/checkout/koleksiyon/...`](#family-18--collection-checkout) | Purchase flow for collections |


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
  unpublish policy (see assumption 8).
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
- **Product unpublished after purchase:** Governed by assumption 8 (policy undecided —
  Option A revokes download access, Option B preserves it for prior purchasers).
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
| [`/kesfet`](#family-2--keşfet) | CTA destination in empty states |
| Creator public page (Family 8) | Destination for post card and collection access clicks |

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
  cancellation. No proration (assumptions 14 and 15).
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
| [`/kesfet`](#family-2--keşfet) | CTA in empty state |
| Family 15 (Notifications) | Downstream — renewal failure and cancellation events |

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

## Checkout / Billing

---

### Family 16 — Membership Checkout

**Routes:**
`/checkout/uyelik/[creator-username]/[tier-id]` (checkout form) ·
`/checkout/onay/[order-id]` (shared success state — see assumption 18) ·
`/checkout/hata/[order-id]` (shared error state — see assumption 18)

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
  data (assumption 13).
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
  role is not expected at MVP (dual-role coexistence assumed per assumption 1),
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
| [`/auth/giris`](#family-3--giriş-yap) | Redirect destination for unauthenticated visitors |
| [`/account/kutuphane`](#family-13--library) | CTA on success page |
| [`/legal/kullanim-kosullari`](#family-22--terms-of-service) | Linked in terms note |
| Family 8 (Creator Public Page) | Entry point (CTA) + secondary CTA on success |

---

### Family 17 — Product Checkout

**Routes:**
`/checkout/urun/[product-id]` (checkout form) ·
`/checkout/onay/[order-id]` (shared success state — see assumption 18) ·
`/checkout/hata/[order-id]` (shared error state — see assumption 18)

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
| [`/auth/giris`](#family-3--giriş-yap) | Redirect destination for unauthenticated visitors |
| [`/account/satin-almalar`](#family-13--library) | CTA on success page and duplicate-purchase notice |
| [`/legal/kullanim-kosullari`](#family-22--terms-of-service) | Linked in terms note |
| Family 8 (Creator Public Page) | Entry point (CTA from shop tab) |

---

### Family 18 — Collection Checkout

**Routes:**
`/checkout/koleksiyon/[collection-id]` (checkout form) ·
`/checkout/onay/[order-id]` (shared success state — see assumption 18) ·
`/checkout/hata/[order-id]` (shared error state — see assumption 18)

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
| [`/auth/giris`](#family-3--giriş-yap) | Redirect destination for unauthenticated visitors |
| [`/account/satin-almalar`](#family-13--library) | CTA on success page |
| [`/legal/kullanim-kosullari`](#family-22--terms-of-service) | Linked in terms note |
| Family 8 (Creator Public Page) | Entry point (CTA from collections tab) + "Koleksiyona Git" destination |

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
- Optional retention offer (assumption 17): if a retention offer is configured by the
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
  phrase, to avoid confusion. No proration (assumption 15).
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
page (separate from the public `/auth/giris` — see assumption 19).

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
- Note: no real-time bank verification at MVP (consistent with assumption 7)

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

All actions are logged server-side (assumption 21). Admin identity and action are included
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
| Audit logging infrastructure | Required — all actions must be logged (assumption 21) |
| Family 7 (Creator Onboarding) | Upstream — generates applications that enter this queue |
| Family 21 (Moderation & Reports) | Navigation target from overview |

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
- Reason category (see assumption 22): placeholder taxonomy — Spam, Yanıltıcı İçerik,
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
see assumption 23).

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
- The action notes field is Admin-only — it is never surfaced to the reporter or the
  target of moderation.
- All moderation actions are logged with the admin's identity (assumption 21).

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
| Audit logging infrastructure | Required — all actions logged (assumption 21) |
| Family 20 (Creator Review Queue) | Navigation sibling — both reached via `/admin` |

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
  re-accept — this is governed by assumption 25 and is a backend concern.
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
  Potentially triggers re-consent requirement (assumption 25).
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

---

## Consistency Checklist

The following items confirm scope compliance for this document.

1. **24 total families documented.** Families 1–24 are present across 7 groups (Public,
   Auth, Creator, Fan/Member, Checkout/Billing, Admin/Operations, Legal/Trust).

2. **Web-only.** No mobile app screens, native UI patterns, or device-specific requirements
   are introduced in any family entry.

3. **No livestream features.** No livestream-related pages, routes, states, or components
   appear in any family entry.

4. **No mobile-specific screens.** Responsive behavior is documented at the component and
   layout level where relevant (e.g., dashboard, checkout, creator public page), but no
   family is mobile-only.

5. **No chat in launch scope.** No chat, direct messaging, or group chat routes appear in
   any family entry. All chat routes are explicitly listed in the Intentionally Deferred
   Pages table.

6. **Products and collections included (minimum viable).** Digital product management
   (Family 12), product checkout (Family 17), collection management (Family 12),
   collection checkout (Family 18), and library access for purchased products (Family 13)
   are all documented at launch scope.

7. **Notifications included (minimum viable).** Family 15 covers the fan-role and
   creator-role notification feed, dual-role labeling, mark-as-read, and the full set of
   supported notification types for MVP. Notification preferences management is explicitly
   deferred to post-launch.
