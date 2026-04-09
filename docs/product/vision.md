# Product Vision — lalabits.art

> This document is the product vision for lalabits.art. It defines what the platform is, who it
> serves, the problems it solves, and what success looks like at MVP. All feature planning,
> architecture, and UX decisions should be grounded in this document.

---

## 1. What lalabits.art Is

lalabits.art is a **Turkey-first, web-only creator monetization platform** that enables content
creators to earn recurring and one-time revenue directly from their audience.

Creators can:
- publish free and premium content to a structured feed
- offer multiple paid membership tiers with distinct perks
- sell digital products and curated content collections
- run gated community chats tied to membership levels
- deliver files, audio, video, and digital resources to paying members

Fans can:
- discover and follow creators
- compare membership tiers and subscribe
- purchase individual digital products and collections
- access a personal library of all unlocked content
- participate in community chat rooms based on their membership tier

The platform is not a Patreon clone. It is designed from the ground up for Turkish creators and
fans, with product decisions that reflect local payment realities, language, culture, and
operational context.

Brand meaning:
- **Lala** — artistic heritage, cultural depth, creative identity
- **Bits** — small units of digital value, content, and production
- Together: a digital growth space where creators share, sell, and grow through meaningful work

---

## 2. Who It Is For

### Creators

lalabits.art targets Turkish content creators across all formats:

- writers (fiction, essays, journalism, educational content)
- visual artists and illustrators
- designers and creative professionals
- educators and course creators
- podcasters and audio producers
- musicians and composers
- video creators (documentary, tutorial, commentary)
- prompt engineers and AI workflow creators
- developers sharing tools, templates, or technical knowledge

The common thread: creators who produce regularly, have or want to build an audience, and need a
reliable, direct channel to earn from that audience without depending entirely on ad revenue,
platform algorithms, or intermediaries.

### Fans and Members

lalabits.art targets Turkish internet users who:

- follow and actively support creators in any of the above categories
- want to access premium content, files, or community spaces
- prefer to pay directly to support creators they trust
- want a single place to manage all their creator subscriptions and purchases
- expect billing, cancellation, and support experiences in Turkish

---

## 3. Creator Problems Solved in Turkey

**Payment and currency barriers**
Patreon operates in USD. Turkish creators face currency volatility (TRY/USD), limited Stripe
access, tax reporting complexity, and friction in receiving payouts. lalabits.art is built to
operate natively in the Turkish financial context.

**No all-in-one platform for Turkish creators**
No dominant Turkish platform combines memberships, digital product delivery, a premium content
feed, and community chat in one place. Creators cobble together Patreon, Gumroad, Telegram, and
Instagram — losing control, brand consistency, and revenue clarity.

**No structured tier-based access**
Creators on general social platforms cannot gate content by membership tier. Defining what each
tier includes and enforcing that access requires a dedicated platform.

**No clean digital product delivery**
There is no Turkish-native platform for selling and delivering PDFs, design files, ZIP archives,
audio packs, prompt libraries, or any downloadable digital resource in a structured storefront
format.

**Recurring revenue is hard to build**
Annual and monthly membership structures with managed renewal, upsell paths, and clear
subscription management do not exist for Turkish creators in a local product.

**Creator pages do not convert**
Instagram bio links and YouTube channel pages are not optimized for membership conversion.
Creators need a profile page built to clearly show tiers, perks, and a path to subscribe or buy.

---

## 4. Fan / Member Problems Solved

**No single place to manage subscriptions**
Fans supporting multiple Turkish creators manage subscriptions across Patreon, direct bank
transfers, and informal Telegram payments. There is no unified dashboard.

**No content library**
Purchased content — files, premium posts, collections — is scattered. Fans have no library that
consolidates everything they have unlocked across all creators they support.

**Opaque membership terms**
Fans often do not know exactly what they get per tier until after subscribing. Tier comparison and
perk clarity is consistently weak on current alternatives.

**Community access is fragmented**
Creator communities live on Telegram groups, WhatsApp groups, and Discord servers — separate
from the content, not tied to paid membership, and unmoderated by the creator's platform.

**Billing and cancellation are frustrating**
International platform billing (Patreon, Ko-fi) is in English with USD amounts. Turkish fans face
currency conversion confusion and English-language cancellation flows. A Turkish-native billing
experience reduces friction and increases trust.

---

## 5. How lalabits.art Differs from Patreon

Patreon is a reference point for the product category, not a clone target. The differences are
intentional and structural:

| Dimension | Patreon | lalabits.art |
|---|---|---|
| Primary market | Global, USD | Turkey-first, TRY |
| Language | English | Turkish |
| Membership tier focus | Flexible but complex | Concrete, perk-explicit |
| Digital product delivery | Basic, add-on feel | First-class, structured storefront |
| Collections | Not a core format | Native content format |
| Community / chat | External (Discord) | Built-in, tier-gated |
| Admin and moderation | US-centric | Turkey-specific operational tooling |
| Brand | Orange-dominant, playful | Premium, calm, turquoise anchor |
| Creator page | Discovery + subscribe | Conversion-focused profile |
| Billing UX | English, USD | Turkish, TRY, localized |

lalabits.art does not reproduce Patreon's information architecture, navigation structure, or
visual design. It solves the same product category problem with decisions appropriate for its
market.

---

## 6. Phase 1 Scope

Phase 1 is web-only. The following features are in scope:

**Public Marketing Website**
- Home page
- Creators showcase
- Features page
- Pricing page
- Resources / blog
- Find a Creator (discovery)
- Log in
- Get Started (user/creator registration entry point)

**Creator Experience**
- Creator onboarding flow (application, review, profile setup)
- Creator profile page (public-facing, conversion-optimized)
- Feed management (create, edit, schedule, delete posts)
- Post types: public, free-member, tier-gated, premium
- Membership plan management (create tiers, set prices, define perks)
- Collection management (bundle content, set access rules, sell)
- Shop / digital product management (upload files, set price, manage delivery)
- Audience and member management
- Chat management (1:1 messages, group room management)
- Notification settings
- Creator dashboard (revenue overview, member stats, content performance)
- Analytics foundation (views, subscriber counts, revenue by source)

**Fan / Member Experience**
- User registration and onboarding
- Creator discovery and browsing
- Creator profile page (view tiers, perks, posts preview)
- Membership checkout (tier selection, payment, confirmation)
- Shop and collection browsing and purchase
- Content access (feed, gated posts, collections, files)
- 1:1 chat with creator
- Group chat access (based on membership tier)
- Notifications center
- User library (purchased files, active memberships, unlocked posts)
- Billing management (payment method, receipts, membership status)
- Cancellation flow

**Admin / Operations**
- Creator review and approval queue
- User and creator moderation tools
- Reports and abuse queue
- Copyright claim handling
- Billing operations and dispute handling
- Audit logs
- CMS for resources and platform updates

**Platform Infrastructure**
- Membership billing lifecycle (creation, renewal, failure, cancellation)
- File storage and secure delivery for digital products
- In-app, email, and browser push notifications
- Trust and safety foundation (reporting flows, content flagging)

---

## 7. Excluded from Phase 1

The following features are explicitly out of scope for Phase 1 and must not be introduced unless
the user explicitly requests a scope change:

- **Mobile apps** — iOS and Android are post-Phase 1
- **Livestream** — no live video or audio streaming of any kind
- **Physical product fulfillment** — no inventory, shipping, or physical goods marketplace
- **Advanced recommendation engine** — no ML-based content or creator discovery
- **Brand sponsorship marketplace** — no tools for brand-creator deal matching
- **Affiliate or referral network** — no multi-level creator referral programs
- **Creator co-authoring** — no multi-creator collaborative pages or shared revenue splits

---

## 8. Core Monetization Models

**Free membership / follow**
A fan follows a creator for free. They see public posts and free-tier content only. This is the
entry point for the upsell funnel to paid membership.

**Monthly membership**
A fan pays a recurring monthly fee to access a specific tier. Billed each month. Creator sets
the price per tier.

**Annual membership**
A fan pays a one-time annual fee for a full year of access to a specific tier. Offered at a
discount versus monthly. Reduces churn and improves creator revenue predictability.

**One-time digital product purchase**
A fan pays a single price to own and download a digital product: PDF, ZIP, audio file, design
resource, prompt pack, or similar. No recurring commitment.

**Collection purchase**
A fan pays a single price to unlock a curated bundle of content (posts, files, or both). A
collection can also be tier-gated rather than sold separately.

**Platform fee**
lalabits.art charges a platform percentage on all transactions. The exact rate is defined in the
business model document, not here.

**Upsell paths**
- Free follower → paid monthly or annual membership
- One-time purchase → recurring membership (surface after purchase)
- Lower tier → higher tier (upsell from within creator page or post preview)

---

## 9. Product Principles

These principles apply to all planning and implementation decisions:

1. **Clarity before code**
   Define the problem, scope, user roles, permissions, and flows before any implementation work
   begins. Do not write code for undefined behavior.

2. **Modularity**
   Each product module has clean boundaries. Memberships, feed, shop, chat, and notifications are
   separate systems that integrate through well-defined interfaces. Avoid tight coupling.

3. **Turkey-first**
   Product decisions default to Turkish language, Turkish payment and billing expectations, local
   operational realities, and Turkish user mental models. Do not treat Turkish context as an
   internationalization add-on.

4. **No feature sprawl**
   Build only what is on the roadmap. Do not introduce speculative features, clever extras, or
   "while we're at it" additions. Scope discipline is a product quality measure.

5. **Access control is critical**
   Every content type, product, and community space must have explicitly defined rules for who can
   see, access, purchase, or download it. Access logic must be deterministic and auditable.

6. **Admin is first-class**
   Every user-facing feature should have corresponding admin visibility, operational controls, or
   support tooling where operationally necessary. Do not build user features in isolation.

7. **Trust by design**
   Moderation, reporting, abuse prevention, copyright handling, and audit trails are built in from
   the start — not retrofitted. The platform's credibility depends on it.

8. **MVP first, production-minded**
   Build lean. Avoid premature complexity. But do not take architectural shortcuts that make future
   scaling, compliance, or operational maturity painful to achieve.

---

## 10. MVP Success Criteria

The MVP is considered functionally successful when all of the following are true:

**Creator experience**
- A creator can complete onboarding and publish their first post within 15 minutes of starting
- A creator can create at least 3 membership tiers with distinct names, prices, and perk lists
- A creator can upload a digital product, set a price, and have it available for purchase
- A creator can create a collection, assign content to it, and set access rules

**Fan / member experience**
- A fan can find a creator via the discovery page, view their profile, compare tiers, and complete
  a membership checkout end-to-end without creator involvement
- A fan can purchase and download a digital product without creator intervention
- A fan can access their full library of purchased content and active memberships in one view
- Group chat rooms are accessible only to fans who hold the qualifying membership tier

**Admin / operations**
- An admin can review a new creator application, approve or reject it, and leave a reason
- An admin can action a moderation report (warn, restrict, or remove content or account)
- Billing renewal, failure, and cancellation events are visible in the admin billing operations view

**Billing and compliance**
- Billing, renewal, and cancellation flows complete correctly and surface clear confirmation to the
  user at every step
- At least one successful real-money transaction is processed in a Turkish payment context (TRY)
- Receipts and billing history are accessible to both the fan and the creator

**Cross-device**
- All critical flows (membership checkout, content access, library, billing, chat) work correctly
  on desktop browsers, tablet browsers, and mobile browsers
- No critical feature is gated behind desktop-only interaction patterns

---

*This document is part of the lalabits.art product documentation. Root project context lives in
[CLAUDE.md](../../CLAUDE.md). Detailed module specifications live in sibling documents within
`docs/product/`.*
