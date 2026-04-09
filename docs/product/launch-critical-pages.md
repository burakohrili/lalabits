# Launch-Critical Pages for lalabits.art MVP

This document identifies the minimum set of pages required for a realistic, stable, and viable MVP launch. It is derived from the full `sitemap.md` but has been strictly scoped down to between 18-24 core pages. The goal is to achieve the fastest path to a functional creator monetization loop.

---

## 1. Launch-Critical Pages

The following **23 pages/flows** are considered essential for the MVP launch.

### Public (4 pages)

| Route | Page Name | Why it's Required for MVP | Primary User | Dependency Level |
|---|---|---|---|---|
| `/` | Ana Sayfa | Explains the value proposition to visitors and serves as the primary entry point for acquisition. | Ziyaretçi | High |
| `/baslangic` | Başlangıç | Critical path decision point for a visitor to become a fan or apply to be a creator. | Ziyaretçi | High |
| `/kesfet` | Keşfet | Core discovery mechanism. Fans cannot subscribe to creators they cannot find. | Ziyaretçi / Fan | High |
| `/@[username]` | Yaratıcı Ana Sayfası | The main conversion page for a creator. Displays their bio, posts, and membership tiers. | Ziyaretçi / Fan | High |

### Auth (4 pages)

| Route | Page Name | Why it's Required for MVP | Primary User | Dependency Level |
|---|---|---|---|---|
| `/auth/giris` | Giriş Yap | Allows existing users to access their accounts. A fundamental requirement. | Ziyaretçi | High |
| `/auth/kayit/fan` | Fan Kaydı | The primary entry point for the "fan" side of the marketplace. | Ziyaretçi | High |
| `/auth/kayit/yaratici` | Yaratıcı Başvurusu | The primary entry point for the "creator" side of the marketplace. Kicks off onboarding. | Ziyaretçi | High |
| `/auth/sifre-sifirla` | Şifre Sıfırla | Essential user support flow. Launching without it creates a support bottleneck and damages trust. | Fan / Creator | High |

### Creator (5 pages/flows)

| Route | Page Name | Why it's Required for MVP | Primary User | Dependency Level |
|---|---|---|---|---|
| `/onboarding/...` | Creator Onboarding Flow | A guided flow to collect profile, payment, and tier information is required before an admin can approve a creator. | Creator | High |
| `/dashboard` | Genel Bakış | The creator's home base after login for a high-level view of their status. | Creator | High |
| `/dashboard/gonderiler/yeni` | Yeni Gönderi Oluştur | The core value creation tool. Creators must be able to publish content for their members. | Creator | High |
| `/dashboard/uyelik-planlari` | Üyelik Planları | Creators must be able to create and manage the membership tiers they offer. | Creator | High |
| `/dashboard/odeme` | Ödeme ve Kazanç | Creators must be able to connect their bank info and see their earnings to build trust. | Creator | High |

### Fan/Member (3 pages)

| Route | Page Name | Why it's Required for MVP | Primary User | Dependency Level |
|---|---|---|---|---|
| `/account/kutuphane` | Kütüphanem | Delivers the core value to a paying member: access to the content they've paid for. | Fan | High |
| `/account/uyeliklerim` | Üyeliklerim | Allows fans to see and manage their active subscriptions. | Fan | High |
| `/uyelik/[id]/iptal` | Üyelik İptal | A clear, self-service cancellation flow is a legal and trust requirement. | Fan | High |

### Checkout/Billing (2 pages/flows)

| Route | Page Name | Why it's Required for MVP | Primary User | Dependency Level |
|---|---|---|---|---|
| `/checkout/uyelik/...` | Üyelik Ödeme | The primary monetization event. This flow is where the platform generates revenue. | Fan | High |
| `/checkout/onay` | Ödeme Onayı | Provides essential confirmation to the user that their payment was successful and explains next steps. | Fan | High |

### Admin/Operations (2 pages)

| Route | Page Name | Why it's Required for MVP | Primary User | Dependency Level |
|---|---|---|---|---|
| `/admin/yaraticilar/inceleme` | Yaratıcı İnceleme Kuyruğu | Core operational process to vet and approve new creators before they go live on the platform. | Admin | High |
| `/admin/moderasyon/raporlar` | Rapor Kuyruğu | Foundational trust and safety tool. Admins must be able to review and act on user-submitted reports. | Admin | Medium |

### Legal/Trust (3 pages)

| Route | Page Name | Why it's Required for MVP | Primary User | Dependency Level |
|---|---|---|---|---|
| `/legal/kullanim-kosullari` | Kullanım Koşulları | Legally required for operating a service. | Ziyaretçi | High |
| `/legal/gizlilik-politikasi` | Gizlilik Politikası | Legally required (KVKK) for handling user data. | Ziyaretçi | High |
| `/legal/yaratici-sozlesmesi` | Yaratıcı Sözleşmesi | Legally required to define the relationship and terms between the platform and its creators. | Creator | High |

---

## 2. Pages Explicitly Deferred

To meet the lean MVP scope, the following features and their associated pages are **explicitly deferred** until post-launch.

- **One-Time Products & Collections:** The entire `/magaza` (shop) and `/koleksiyonlar` (collections) functionality for both creators and fans is deferred. The MVP will focus exclusively on recurring memberships.
- **Community & Chat:** All 1:1 and group chat features (`/mesajlar`, `/grup-sohbet`) are deferred.
- **Advanced Creator Analytics:** Deferring `/dashboard/analitik/uyeler` and `/dashboard/analitik/icerik`. The basic revenue view is sufficient for launch.
- **Detailed Public Marketing Pages:** Pages like `/ozellikler`, `/fiyatlar`, and `/yaraticilar` are "nice-to-have" and can be added post-launch to improve marketing.
- **Content Marketing:** The `/kaynaklar` (resources/blog) section is not launch-critical.
- **Advanced Membership Management:** Tier upgrades (`/yuksel`) and downgrades (`/dusur`) can be deferred. Cancellation is the only mandatory management flow for launch.

---

## 3. Launch Blockers

The successful implementation of the pages above is dependent on several critical backend and infrastructure components. These are the primary launch blockers:

1.  **Payment Gateway Integration:** A fully functional, production-ready integration with a Turkish payment provider is the highest priority. Without it, no transactions can occur.
2.  **Email Delivery Service:** Transactional emails for signup, password resets, and payment confirmations are non-negotiable. An integrated service (e.g., SendGrid, Mailgun) is required.
3.  **File Storage:** A solution for storing creator-uploaded assets (avatars, post images) is required.
4.  **Defined Admin Processes:** The operational workflow for reviewing creator applications and handling moderation reports must be clearly defined and agreed upon. The tools are useless without a process.
5.  **Production-Ready Hosting:** A scalable, secure hosting environment for the web application and database.

---

## 4. Pages That Can Wait Until Post-Launch

This section outlines the pages from the full sitemap that can be implemented in the first few sprints following the MVP launch to round out the Phase 1 feature set.

- `/@[username]/gonderi/[post-id]`: (Post Detail View) For MVP, the feed might be enough.
- `/checkout/urun/[product-id]`: (Product Checkout)
- `/checkout/koleksiyon/[collection-id]`: (Collection Checkout)
- `/account/satin-almalar`: (Purchase History)
- `/dashboard/mesajlar`: (Creator DMs)
- `/dashboard/analitik/gelir`: (Revenue Analytics)
- `/admin/kullanicilar`: (User Management List)
- All other pages marked as "Faz 1" in `sitemap.md` but not included in the critical list above.
