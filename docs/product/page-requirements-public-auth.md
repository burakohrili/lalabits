# Page Requirements: Public & Auth — lalabits.art

> **Scope:** This document covers page families 1–6 from the approved outline:
> Public (Home, Discovery) and Auth (Login, Fan Signup, Creator Signup, Password Reset).
>
> **Excluded from this document:** Creator (families 7–12), Fan/Member (13–15),
> Checkout/Billing (16–19), Admin/Operations (20–21), Legal/Trust (22–24).
> Those families are documented in separate sibling files.
>
> **Authority:** [page-requirements-outline.md](./page-requirements-outline.md) ·
> [sitemap.md](./sitemap.md) · [vision.md](./vision.md) · [CLAUDE.md](../../CLAUDE.md)

---

## Assumptions

The following product decisions are assumed for this document. If any assumption changes,
the affected fields in this document must be revisited.

1. **Google OAuth at launch.** Login, Fan Signup, and Creator Signup include Google OAuth as
   an alternative auth method. If Google OAuth is deferred to post-launch, remove all social
   auth references from these pages and simplify error states.

2. **Email verification is required.** A fan cannot complete checkout or access gated content
   until their email is verified. Verification happens asynchronously after signup.

3. **Fan and creator are roles on a single account.** A user can hold both a fan role and a
   creator role simultaneously. Creator registration creates a new pending creator profile
   attached to the same authenticated identity. This is flagged as a product decision —
   if they are always separate accounts, the Creator Signup flow changes.

4. **Account enumeration protection.** Password Reset (State A) and Fan Signup email-exists
   errors must not confirm whether a given email is registered. This is a security constraint,
   not a UX preference.

5. **Return URL behavior.** Any page that triggers a redirect to login (e.g., clicking a
   gated subscribe button) passes the intended destination as `?return=` in the login URL.
   The login page validates this URL is same-origin before redirecting. No open redirect.

6. **Revealing Google OAuth on password reset.** If a user submits a reset request for an
   email registered only via Google OAuth, the current assumption is to show a clarifying
   message ("bu hesap Google ile bağlı") after submission. This is a minor enumeration risk —
   it reveals that a Google account exists for that email. Flag for security review before
   launch.

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
   OAuth is enabled at launch (see Assumptions).

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
  profile to the existing account (see Assumption 3).
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
  This is a minor enumeration risk — flag for security review per the Assumptions section.

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

*This document covers families 1–6 (Public and Auth). Remaining families are documented in:*
*`page-requirements-creator.md` (7–12), `page-requirements-fan.md` (13–15),*
*`page-requirements-checkout.md` (16–19), `page-requirements-admin.md` (20–21),*
*`page-requirements-legal.md` (22–24).*
