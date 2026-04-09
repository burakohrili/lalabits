# Page Requirements Outline — lalabits.art

> This outline defines the launch-critical page families for the lalabits.art Phase 1 MVP.
> It is the scope authority for the full `page-requirements.md` document.
>
> Entries use a **page family** model: one entry covers all related routes within a functional
> unit (list + detail + create + edit). This is not a route inventory — see `sitemap.md` for
> the full route list.
>
> Authority files: [CLAUDE.md](../../CLAUDE.md) · [vision.md](./vision.md) ·
> [sitemap.md](./sitemap.md) · [launch-critical-pages.md](./launch-critical-pages.md)

---

## 1. Selected Launch-Critical Page Families

### Public

| # | Family Name | Primary Route(s) | Notes |
|---|---|---|---|
| 1 | Home | `/` | Platform hero; acquisition and conversion entry point |
| 2 | Discovery | `/kesfet` | Browse and filter all creators by category |

### Auth

| # | Family Name | Primary Route(s) | Notes |
|---|---|---|---|
| 3 | Login | `/auth/giris` | Email/password + social auth options |
| 4 | Fan Signup | `/auth/kayit/fan` | Fan account registration |
| 5 | Creator Signup | `/auth/kayit/yaratici` | Creator registration; entry point to onboarding |
| 6 | Password Reset | `/auth/sifre-sifirla` + `/[token]` | Two-step flow treated as one family |

### Creator

| # | Family Name | Primary Route(s) | Notes |
|---|---|---|---|
| 7 | Creator Onboarding Flow | `/onboarding/` (6-step wizard) | Profile → category → plans → payout → agreement → confirmation |
| 8 | Creator Public Page | `/@[username]` | Unified profile; feed, tiers, shop, collections are tabs/sub-states — not separate entries |
| 9 | Creator Dashboard Overview | `/dashboard` | Revenue summary, member stats, quick actions |
| 10 | Posts Management | `/dashboard/gonderiler` + `/yeni` + `/[id]/duzenle` | List, create, and edit as one family |
| 11 | Membership Plans | `/dashboard/uyelik-planlari` + `/yeni` + `/[id]/duzenle` | Tier list, create, and edit as one family |
| 12 | Products & Collections Management | `/dashboard/magaza` + editors + `/dashboard/koleksiyonlar` + editors | Min-viable digital content management as one family |

### Fan / Member

| # | Family Name | Primary Route(s) | Notes |
|---|---|---|---|
| 13 | Library | `/account/kutuphane` + `/account/satin-almalar` | Unlocked posts, downloaded files, purchased items in one view |
| 14 | Memberships & Billing | `/account/uyeliklerim` + `/[membership-id]` + `/account/fatura` | Active subscriptions, billing history, payment method |
| 15 | Notifications | `/account/bildirimler` | In-app notification center; shared surface for fans and creators |

### Checkout / Billing

| # | Family Name | Primary Route(s) | Notes |
|---|---|---|---|
| 16 | Membership Checkout | `/checkout/uyelik/[creator-username]/[tier-id]` + `/onay` + `/hata` | Recurring billing; includes confirmation and error states |
| 17 | Product Checkout | `/checkout/urun/[product-id]` + `/onay` + `/hata` | One-time purchase; digital product delivery |
| 18 | Collection Checkout | `/checkout/koleksiyon/[collection-id]` + `/onay` + `/hata` | One-time purchase; collection access unlock |
| 19 | Cancellation Flow | `/uyelik/[membership-id]/iptal` | Self-service cancel with consequence disclosure and confirmation |

### Admin / Operations

| # | Family Name | Primary Route(s) | Notes |
|---|---|---|---|
| 20 | Creator Review Queue | `/admin` + `/admin/yaraticilar/inceleme` | Admin overview is the entry point to the review queue; treated as one family |
| 21 | Moderation & Reports | `/admin/moderasyon/raporlar` + `/[report-id]` + `/admin/moderasyon/icerik` | Report queue, report detail, flagged content queue |

### Legal / Trust

| # | Family Name | Primary Route(s) | Notes |
|---|---|---|---|
| 22 | Terms of Service | `/legal/kullanim-kosullari` | Required before any user account is created |
| 23 | Privacy Policy | `/legal/gizlilik-politikasi` | KVKK compliance; required at launch |
| 24 | Creator Agreement | `/legal/yaratici-sozlesmesi` | Required before creator onboarding can be completed |

---

## 2. Intentionally Deferred Pages

These routes exist in the sitemap but are not documented in the page requirements for launch.

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

## 3. Grouping

| Group | Families |
|---|---|
| Public | 1, 2 |
| Auth | 3, 4, 5, 6 |
| Creator | 7, 8, 9, 10, 11, 12 |
| Fan / Member | 13, 14, 15 |
| Checkout / Billing | 16, 17, 18, 19 |
| Admin / Operations | 20, 21 |
| Legal / Trust | 22, 23, 24 |

---

## 4. Per-Group Entry Count

| Group | Entries | Notes |
|---|---|---|
| Public | 2 | Home + Discovery |
| Auth | 4 | Login, Fan Signup, Creator Signup, Password Reset |
| Creator | 6 | Onboarding, Public Page, Dashboard, Posts, Membership Plans, Products & Collections |
| Fan / Member | 3 | Library, Memberships & Billing, Notifications |
| Checkout / Billing | 4 | Membership, Product, Collection, Cancellation |
| Admin / Operations | 2 | Creator Review Queue, Moderation & Reports |
| Legal / Trust | 3 | Terms, Privacy, Creator Agreement |
| **Total** | **24** | |

---

## 5. Recommended Implementation Sequence

Each sprint builds on the previous and produces a testable increment.

| Sprint | Focus | Families |
|---|---|---|
| 1 — Trust Foundation | Auth + Legal | 3, 4, 5, 6, 22, 23, 24 |
| 2 — Creator Path | Onboarding + Public Profile | 7, 8 |
| 3 — Creator Dashboard Core | Posts + Membership Plans | 9, 10, 11 |
| 4 — Fan Core + Membership Revenue | Library, Memberships & Billing, Membership Checkout, Cancellation | 13, 14, 16, 19 |
| 5 — Digital Content | Products & Collections (creator) + Product & Collection Checkout (fan) | 12, 17, 18 |
| 6 — Discovery + Notifications + Admin | Home, Discovery, Notifications, Admin | 1, 2, 15, 20, 21 |

**Rationale:**
- Sprint 1 first because legal pages are referenced in auth flows and onboarding agreement steps.
- Sprint 2 before Sprint 3 because the public creator page is what fans interact with; it must exist as read-only before dashboard management tools are built.
- Sprint 4 before Sprint 5 because membership is the primary monetization model; it must work end-to-end before digital products are layered on.
- Admin and Discovery are Sprint 6 because they require existing creator and content data to be meaningful.

---

*Next step: use this outline as the scope authority for `docs/product/page-requirements.md`,
where each of the 24 families is documented with full field detail.*
