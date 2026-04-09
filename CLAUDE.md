# CLAUDE.md

## Project Identity

**Project name:** `lalabits.art`

This repository is for building **lalabits.art**, a **Turkey-first, web-only creator platform** inspired by Patreon, but **not a clone**.

Brand meaning:
- “Lala” evokes artistic heritage, culture, and creative depth.
- “Bits” represents small digital pieces of value, content, products, and creative output.
- Together, **lalabits.art** means a digital growth laboratory where artists and creators share, sell, and grow through small pieces of meaningful production.

The name should be treated as:
- easy to pronounce
- global-friendly
- brandable
- creative but structured
- suitable for premium positioning in both Turkish and international contexts.

The product helps creators earn recurring and one-time revenue from their audience through memberships, premium posts, collections, shop products, private content access, chat/community features, and structured digital product delivery.

This project is being developed with a **planning-first workflow** using **Claude Code + VS Code extension + strong project context**.

---

## Primary Goal

Build this platform from **MVP to production-grade quality** in a structured, modular, and maintainable way.

The platform must feel:
- modern
- premium
- creator-first
- Turkey-compatible
- legally and operationally serious
- scalable from MVP to production

---

## Market and Product Positioning

Target market:
- Turkey first
- Turkish language first
- localized product decisions
- local payment, legal, and operational expectations

Positioning:
- inspired by Patreon’s memberships, feed, shop, and creator page structure
- improved for Turkish users and creators
- not a UI or feature-by-feature clone
- should solve gaps left by platforms that do not directly help creators monetize effectively in Turkey

Core value proposition:
- creators can earn from memberships
- creators can sell digital products
- creators can publish premium posts and collections
- creators can deliver files, videos, podcasts, prompts, and digital resources
- fans can easily discover creators, subscribe, purchase, manage memberships, and access their library

---

## Phase 1 Scope

This product is **web-only** in phase 1.

### Included in phase 1
- public marketing website
- creator onboarding
- user onboarding
- creator profile pages
- creator feed
- posts
- memberships
- collections
- shop / digital products
- chat
- group chat
- notifications
- user library / purchases / memberships
- creator dashboard
- admin dashboard
- moderation / trust & safety foundation
- billing and membership management
- cancellation flow
- analytics foundation

### Explicitly excluded from phase 1
- mobile apps
- livestream features
- full marketplace for physical products
- advanced recommendation engine
- brand sponsorship marketplace
- complex affiliate network

Do not introduce excluded features unless explicitly requested.

---

## Core Product Modules

The core modules of this platform are:

1. **Public Marketing Site**
   - Home
   - Creators
   - Features
   - Pricing
   - Resources
   - Updates
   - Find a Creator
   - Log in
   - Get Started

2. **Creator Experience**
   - creator onboarding
   - creator dashboard
   - feed management
   - post creation
   - membership plan management
   - collection management
   - shop/product management
   - audience/member management
   - chat/community management
   - notifications and settings
   - revenue / analytics

3. **Fan / Member Experience**
   - creator discovery
   - creator profiles
   - membership comparison and checkout
   - shop and collections browsing
   - content access
   - chat and group chat
   - notifications center
   - purchases / library / active memberships
   - billing and cancellation

4. **Admin / Operations**
   - creator review
   - moderation
   - reports and abuse queue
   - billing operations
   - membership disputes
   - copyright claims
   - audit logs
   - CMS / resources / updates management

---

## Core Content Types

The platform should be designed to support these content types:
- text posts
- rich posts
- premium posts
- public posts
- tier-gated posts
- collections
- digital products
- prompts
- PDF files
- ZIP files
- design/resource files
- audio files
- podcast episodes
- premium video
- downloadable files

Always design content systems with access control, ownership, and entitlement in mind.

---

## Membership Philosophy

Membership is a core product layer, not a side feature.

The system should support:
- free membership / follow model
- monthly memberships
- annual memberships
- multiple paid tiers
- perk-based differentiation
- content gating by tier
- chat/group access by tier
- cancellation and downgrade logic
- upsell from free to paid
- upsell from one-time purchase to membership

Membership rules must be explicit and deterministic.

---

## Product Principles

When planning or implementing any part of the project, follow these principles:

1. **Clarity before code**
   - Define the problem, scope, roles, permissions, and user flow before implementation.

2. **Modularity**
   - Build separate modules with clean boundaries.
   - Avoid tightly coupled architecture.

3. **Turkey-first decisions**
   - Prefer Turkish UX, Turkish terminology, Turkey-compatible product assumptions, and local operational realism.

4. **No feature sprawl**
   - Do not add speculative features outside the defined roadmap.

5. **Access control is critical**
   - Every content or membership feature must define who can see, buy, download, or interact with it.

6. **Admin and support are first-class**
   - Any user-facing system should eventually have admin visibility or operational control if needed.

7. **Trust matters**
   - Plan for moderation, reporting, copyright handling, abuse prevention, and auditability.

8. **MVP first, but production-minded**
   - Build lean first, but avoid shortcuts that make future production scaling painful.

---

## UX Principles

The product must be **fully responsive**.

Responsive design is a non-negotiable requirement:
- desktop-first planning is acceptable for complex dashboards
- but all public pages, creator pages, fan pages, and core account flows must work cleanly across desktop, laptop, tablet, and mobile browsers
- no critical feature may depend on desktop-only interaction patterns
- layouts must degrade gracefully across breakpoints
- navigation, cards, pricing tables, feed layouts, chats, and billing flows must remain usable on smaller screens
- responsive behavior should be considered from the start, not treated as a later polish task

The product should feel:
- clean
- modern
- premium
- calm
- readable
- conversion-focused
- not crowded
- not visually noisy

General UX rules:
- prioritize simple navigation
- reduce confusion around memberships and access levels
- clearly show what the user gets at each tier
- make cancellation and billing understandable
- give creators strong control without overwhelming them
- keep creator pages conversion-focused

---

## Brand Direction

Default brand palette for planning and design decisions:

- **Primary color:** Lala Turquoise `#008080`
  - rooted, artistic, trustworthy, culturally resonant
- **Accent color:** Neon Bit Orange `#FF5722`
  - energetic, digital, action-oriented, ideal for CTAs
- **Background color:** Pearl White `#F8F9FA`
  - clean gallery-like foundation that keeps content central
- **Text color:** Charcoal Black `#212121`
  - strong readability, premium and serious tone

Brand design interpretation:
- the visual system should balance artistic heritage with digital modernity
- use turquoise as the system anchor, not as an overwhelming flood color
- use orange selectively for conversion-focused moments such as CTA buttons, highlights, active states, and monetization cues
- keep overall interfaces clean, airy, and content-forward
- avoid overly playful or childish visual language
- the brand should feel premium, calm, intelligent, and creator-centric

Whenever UI is designed, this palette should be treated as the current default unless explicitly changed by the user.

## Technical Direction

Default technical assumptions for planning:
- frontend: Next.js
- backend: NestJS
- database: PostgreSQL
- cache/queues: Redis
- storage: object storage
- search: initially simple, scalable later
- notifications: in-app + email + browser push

These are planning defaults unless the user changes them.

---

## Architecture Expectations

Every technical plan should define:
- module boundaries
- major entities
- permissions
- API surface
- state transitions
- background jobs
- failure states
- admin visibility
- analytics events

Avoid vague architecture suggestions.

---

## API Expectations

Whenever APIs are planned, include:
- route group
- auth requirement
- actor roles
- request/response shape
- pagination/filtering rules
- error cases
- side effects
- analytics implications

Do not produce hand-wavy API plans.

---

## Planning Workflow

This repository uses a **planning-first workflow**.

Before building any major module:
1. define scope
2. define user roles
3. define user flows
4. define page responsibilities
5. define data model
6. define permissions
7. define API requirements
8. define admin/support requirements
9. define analytics and edge cases
10. only then move to implementation

Do not jump straight into code for large features.

---

## Output Rules for Claude Code

When asked to plan a module, Claude should:
- stay within scope
- avoid unnecessary extra features
- be concrete and structured
- break work into implementation-ready steps
- identify assumptions clearly
- define edge cases
- define actor permissions
- define backend and frontend needs separately when useful

When asked to implement:
- preserve architecture consistency
- avoid rewriting unrelated modules
- keep code modular
- prefer readable and maintainable code
- document important decisions

---

## Non-Negotiable Constraints

These constraints must always be respected unless explicitly changed by the user:

- web-only in phase 1
- no livestream
- planning-first workflow
- Turkey-first product decisions
- Patreon is a reference, not a clone target
- memberships, feed, collections, shop, chat, and notifications are core
- creator and fan experiences are equally important
- admin and moderation must be considered early

---

## What Claude Should Optimize For

Claude should optimize for:
- product clarity
- system consistency
- modular architecture
- implementation order
- scalable information architecture
- creator monetization clarity
- fan usability
- maintainability
- operational realism

---

## What Claude Should Avoid

Claude should avoid:
- random feature expansion
- mobile-first assumptions
- livestream assumptions
- vague enterprise overengineering in MVP planning
- copying Patreon literally
- ignoring admin, moderation, support, or billing flows
- unclear membership access logic
- inconsistent naming

---

## Future Documentation Structure

Detailed planning should later be split into separate docs such as:
- product vision
- sitemap
- page requirements
- memberships
- feed
- collections
- shop
- chat
- notifications
- backend architecture
- API inventory
- admin operations
- trust and safety
- analytics

This CLAUDE.md file should remain the **root project constitution**, not the full product spec.
