# Wave 02 Prerequisites Brief
## lalabits.art Phase 1

> **Status:** Confirmed — both prerequisites approved 2026-03-27
> **Version:** v1.0
> **Scope:** Wave 02 (WS3 + WS7 Phase 2) — implementation prerequisites only
> **Authority level:** Supporting
>
> **Derived from:** execution-wave-02.md §5 (risks flagged for pre-implementation action)

---

## §1 — Document Purpose

Two implementation decisions must be made before Wave 02 coding begins. Neither
is a product scope question — both are engineering approach questions with no
ambiguity in the planning documents about what the outcome must be. The only
open question is *how* to achieve the required outcome.

This document states the required outcome, the recommended approach, and the
alternatives. It does not introduce new product scope or reopen any closed decision.

Both items must be confirmed before Batch 3.2 (IBAN) and Batch 3.3
(ModerationAction) begin. Neither blocks Batch 3.1, which can start immediately
once Wave 01 Checkpoint C passes.

---

## §2 — Prerequisite 1: IBAN Encryption Key Management

### Why this is a prerequisite

`data-model.md` requires that the full IBAN string is encrypted at rest. The
`CreatorApplication` entity stores `iban_encrypted` (the ciphertext),
`iban_last_four`, and `iban_format_valid`. The raw IBAN must never appear in
any column, log line, API response, or error message.

Before `PUT /onboarding/payout` (Batch 3.2) can be written, the team must know
*where the encryption key lives* and *how the application reads it*. Choosing the
wrong mechanism and shipping it creates a migration problem: every stored IBAN
must be re-encrypted if the key management approach changes after the fact.

### What must be confirmed before Batch 3.2 begins

The key management mechanism: how is the encryption key made available to the
NestJS backend, and how is it rotated if needed?

### Recommended default

**Environment variable holding the key directly** — `IBAN_ENCRYPTION_KEY` as a
hex or base64-encoded AES-256 key, injected at deploy time via the secrets
manager already used for other credentials (database URL, JWT secret, etc.).

- Symmetric AES-256-GCM encryption; store `iv + ciphertext` as the `iban_encrypted`
  column value
- Key is never logged, never returned, never written to the DB
- Key rotation: re-encrypt all stored IBANs with the new key before retiring the old
  one (a one-time migration job, not a launch concern)
- This is consistent with how `JWT_SECRET` and `DB_URL` are already handled in WS1

### Alternatives

| Alternative | Trade-off |
|---|---|
| Cloud KMS (AWS KMS, GCP CKMS, Azure Key Vault) | Stronger key protection and audit trail; adds a network call per IBAN read/write; worthwhile if the deployment environment already uses a KMS |
| Envelope encryption (KMS wraps a data key stored in DB) | Standard enterprise pattern for large-scale PII; adds complexity not justified at Phase 1 scale |

### Exact implementation consequence

The `PUT /onboarding/payout` endpoint encrypts the IBAN before writing.
The `GET /admin/creator-applications/[id]` endpoint never decrypts — it reads only
`iban_last_four` and `iban_format_valid`. No decryption path exists in the API
layer at Phase 1; the encrypted value is for future payout processing only.

If the key management approach is not confirmed before Batch 3.2:
- The team either hardcodes the key (security failure) or delays the batch
- Either outcome is avoidable

### Batch affected

**Batch 3.2** — `PUT /onboarding/payout` and `POST /onboarding/submit`

### Docs to update after confirmation

- `execution-wave-02.md` — add a note to Batch 3.2 confirming the mechanism chosen
- `data-model.md` — add a note to the `CreatorApplication` entity confirming the
  encryption algorithm and key storage approach (no schema change required)

---

## §3 — Prerequisite 2: ModerationAction Atomicity

### Why this is a prerequisite

`workstream-breakdown.md` (WS7) states explicitly:

> *"`ModerationAction` entity: ships with the first admin action in Phase 2;
> non-deferrable; every admin write creates a `ModerationAction` record or the
> entire transaction rolls back."*

This is not a soft requirement. An admin action that succeeds without a
`ModerationAction` record is an integrity failure — the platform has a changed
entity state with no audit trail entry. The `launch-readiness-checklist.md`
item LG-14 will fail if this is not correctly implemented.

The implementation consequence must be locked in before Batch 3.3 is written,
because the atomicity guarantee determines the transaction structure of every
admin action endpoint.

### What must be confirmed before Batch 3.3 begins

The transaction pattern: how is atomicity between the status change and the
`ModerationAction` write enforced at the database level?

### Recommended default

**Single DB transaction wrapping both the entity write and the `ModerationAction`
write** — using the ORM's transaction API (TypeORM `QueryRunner` or
`DataSource.transaction()`).

Pattern for every admin action (approve, reject, suspend):

1. Begin transaction
2. Precondition check inside the transaction: confirm `CreatorProfile.status =
   pending_review` — if not, throw 409 and abort (handles race condition)
3. Write the status change to `CreatorProfile` and `CreatorApplication`
4. Write `ModerationAction` record
5. Commit — both writes visible atomically
6. After commit: queue notification email (email failure does not roll back the
   DB state; log the failure)

If step 4 fails, the transaction rolls back. Step 2 (precondition inside the
transaction) prevents two admins from both succeeding on the same application.

### Alternatives

There are no acceptable alternatives to DB-level atomicity for this requirement.
Application-level sequencing (write status first, then write audit record) is
explicitly rejected — a crash between the two writes leaves the system in an
inconsistent state.

The only implementation variable is which ORM transaction API is used, not
whether to use a transaction.

### Exact implementation consequence

Every admin action endpoint in Batch 3.3 must be written with this pattern from
the start. Retrofitting atomicity after the fact requires rewriting all three
action endpoints (approve, reject, suspend). Writing it correctly in Batch 3.3
costs nothing extra.

The race condition protection (precondition check inside the transaction) also
addresses the `CR-12` SOFT BLOCK item in `launch-readiness-checklist.md` —
concurrent admin actions on the same application produce exactly one outcome.

### Batch affected

**Batch 3.3** — `POST /admin/creator-applications/[id]/approve`,
`POST .../reject`, `POST .../suspend`

### Docs to update after confirmation

- `execution-wave-02.md` — add a note to Batch 3.3 confirming the transaction
  pattern and precondition check mechanism

---

## §4 — Resolution Order

Resolve in this order — both must be confirmed before their respective batch begins.
Neither blocks Batch 3.1.

| Order | Item | Must be confirmed before | Blocks Wave 02 start? |
|---|---|---|---|
| 1 | IBAN encryption key management | Batch 3.2 | No — Batch 3.1 and 3.3 can start first |
| 2 | ModerationAction atomicity pattern | Batch 3.3 | No — Batch 3.1 can start first |

Both can be confirmed in parallel. Neither requires the other.

---

## §5 — Ready-to-Build Criteria for Wave 02

Wave 02 implementation can begin (Batch 3.1 and Batch 3.3 in parallel) when:

- [ ] Wave 01 Checkpoint C confirmed — fan can register, verify email, log in;
  creator entry point (Family 5) renders; all 25 entities in DB
- [ ] IBAN encryption mechanism confirmed (required before Batch 3.2)
- [ ] ModerationAction transaction pattern confirmed (required before Batch 3.3)
- [ ] iyzico onboarding initiated — not a Wave 02 gate, but should be underway
  to avoid a Wave 04 (WS6 checkout) blocker

---

## §6 — Validation Checklist

**Coverage:**
- [ ] Both prerequisites are traceable to `execution-wave-02.md §5` risks
- [ ] No new product scope introduced
- [ ] No new open decisions created — these are implementation approach confirmations,
  not product decisions
- [ ] No code in this document

**Completeness:**
- [ ] Each prerequisite states the required outcome (not just the concern)
- [ ] Each prerequisite names the exact batch it affects
- [ ] Each prerequisite names the docs to update after confirmation
- [ ] Recommended default provided for each; no item left without a clear path forward

**Operability:**
- [ ] Resolution order is clear; neither prerequisite blocks Batch 3.1
- [ ] Ready-to-build criteria are binary — each is either true or not
- [ ] After both items are confirmed, no further planning is required before
  Wave 02 implementation begins
