# Local Development Bootstrap — lalabits.art

> **Status:** Active
> **Version:** v1.0
> **Scope:** Wave 01 local developer setup
> **Authority level:** Operational

---

## 1. What Is Being Installed Locally

The local environment mirrors the four production infrastructure services using Docker containers. Nothing runs in the cloud during local development. Everything runs on your own machine.

| Service | Container name | What it is |
|---|---|---|
| PostgreSQL 16 | `lalabits_postgres` | The main relational database. All 25 entities live here. |
| Redis 7 | `lalabits_redis` | In-memory key/value store. Used for refresh token storage and later for job queues. |
| MinIO | `lalabits_minio` | S3-compatible object storage. Stores uploaded files (avatars, content assets, digital products). |
| Mailpit | `lalabits_mailpit` | Local email catcher. Intercepts all outgoing emails so they never reach a real inbox. You view them in a browser. |

---

## 2. What Each Service Does

### PostgreSQL
The primary database. Holds all user data, creator profiles, memberships, posts, orders, consent records, and every other entity in the data model. The backend connects to it via TypeORM. Migrations are run manually — the database never auto-syncs in any environment.

### Redis
A fast in-memory store. In Wave 01, it stores refresh tokens using short-lived keys. Later it will also power job queues for email sending, notification delivery, and subscription renewal tasks.

### MinIO
A local S3-compatible object storage server. The backend generates presigned PUT URLs (for direct browser upload) and signed GET URLs (for protected download). In production this is replaced by a real object storage provider (Cloudflare R2, AWS S3, or equivalent) — no code changes required, only environment variable changes.

### Mailpit
A local SMTP server with a web UI. The backend sends emails to it using SMTP on port `1025`. Mailpit catches every email and shows it in a web interface at `http://localhost:8025`. No emails escape to real inboxes. Used for testing registration, email verification, and password reset emails during Wave 01.

---

## 3. Startup Order

Services are independent and can all start together. Docker Compose handles this. You do not need to start them in a specific order — the `healthcheck` entries in `docker-compose.yml` ensure each service is ready before the backend tries to connect.

Recommended startup sequence for a full local session:

1. Start Docker containers (`docker compose up -d`)
2. Create the MinIO bucket (`mc` command — see First Run below)
3. Copy and fill the env files
4. Start the backend (`npm run start:dev` inside `apps/backend`)
5. Start the frontend (`npm run dev` inside `apps/frontend`)

---

## 4. First-Run Commands

Run these once, in order, the first time you set up the project.

### Step 1 — Start all containers

```bash
docker compose up -d
```

Starts PostgreSQL, Redis, MinIO, and Mailpit in the background. Verify all four are running:

```bash
docker compose ps
```

All four services should show `healthy` or `running`.

### Step 2 — Create the MinIO bucket

MinIO starts empty. You need to create a bucket named `lalabits` before the backend can upload files.

Open the MinIO web console at `http://localhost:9001`.

- Username: `lalabits`
- Password: `lalabits123`

Click **Buckets → Create Bucket → name it `lalabits` → Create**.

Alternatively, use the MinIO CLI if you have `mc` installed:

```bash
mc alias set local http://localhost:9000 lalabits lalabits123
mc mb local/lalabits
```

**After creating the bucket, configure CORS** so the Next.js frontend can upload files directly via presigned PUT URLs. This is required for WS3 (file uploads in creator onboarding).

Create a file named `cors.json`:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "GET"],
    "AllowedOrigins": ["http://localhost:3000"],
    "ExposeHeaders": ["ETag"]
  }
]
```

Apply it with `mc`:

```bash
mc anonymous set-json cors.json local/lalabits
```

Or in the MinIO console: **Buckets → lalabits → Anonymous → Add Access Rule** and set prefix `*` to `readonly`, then configure CORS manually under the bucket's settings tab.

### Step 3 — Copy environment files

**Backend:**

```bash
cp apps/backend/.env.example apps/backend/.env
```

Open `apps/backend/.env` and fill in:
- `JWT_SECRET` — generate with `openssl rand -hex 64`
- `IBAN_ENCRYPTION_KEY` — generate with `openssl rand -hex 32`

Everything else is already pre-filled for local Docker services. Do not change the database, Redis, storage, or email values unless you know what you are doing.

**Frontend:**

```bash
cp apps/frontend/.env.local.example apps/frontend/.env.local
```

No changes needed. The default `http://localhost:3001` is correct.

### Step 4 — Install dependencies (if not already done)

```bash
npm install --workspace=apps/backend
npm install --workspace=apps/frontend
```

Or from the repo root if you have a root-level `package.json` with workspaces:

```bash
npm install
```

### Step 5 — Start the backend

```bash
cd apps/backend
npm run start:dev
```

The backend starts on port `3001`. You should see NestJS module initialization logs and no connection errors.

### Step 6 — Start the frontend

```bash
cd apps/frontend
npm run dev
```

The frontend starts on port `3000`.

---

## 5. Verification Steps

After completing first-run setup, verify each service is working.

### PostgreSQL
```bash
docker exec -it lalabits_postgres psql -U lalabits -d lalabits -c "\l"
```
Should show the `lalabits` database in the list.

### Redis
```bash
docker exec -it lalabits_redis redis-cli ping
```
Should respond with `PONG`.

### MinIO
Open `http://localhost:9001` in your browser. Log in with `lalabits` / `lalabits123`. The `lalabits` bucket should be visible.

### Mailpit
Open `http://localhost:8025` in your browser. The inbox should load (empty at this point).

### Backend health check
```bash
curl http://localhost:3001/health
```
Should return `{"status":"ok","timestamp":"..."}`.

### Frontend
Open `http://localhost:3000` in your browser. The Next.js app should load.

---

## 6. What Stays Local

These services are local-only during development and should never be used in production:

| Local service | Reason it is local-only |
|---|---|
| MinIO | Not production-grade at scale; no global CDN; credentials are placeholders |
| Mailpit | Designed to catch emails — it deliberately prevents real delivery |
| Local PostgreSQL | No backups, replication, or managed failover |
| Local Redis | No persistence configuration, no auth, no TLS |

---

## 7. What Will Be Replaced in Production

When you move to a production (or staging) environment, you replace local services by changing environment variables only. No code changes are required.

| Local | Production replacement | Env vars to change |
|---|---|---|
| MinIO | Cloudflare R2 / AWS S3 / Backblaze B2 | `STORAGE_ENDPOINT`, `STORAGE_REGION`, `STORAGE_ACCESS_KEY_ID`, `STORAGE_SECRET_ACCESS_KEY`, `STORAGE_BUCKET` |
| Mailpit | Resend (or Postmark / SES) | `EMAIL_PROVIDER=resend`, `EMAIL_API_KEY` |
| Local PostgreSQL | Managed PostgreSQL (Supabase, Railway, Neon, RDS) | `DATABASE_URL` |
| Local Redis | Managed Redis (Upstash, Railway, ElastiCache) | `REDIS_URL` |

The backend `StorageService` uses `forcePathStyle: true` which is required for non-AWS S3 providers (MinIO, R2). This setting is safe to keep in production when using R2 or similar providers. AWS S3 does not require it but tolerates it.

The email service will need a small change to support real SMTP vs. Resend SDK — this is addressed in Batch 1.2 output gate verification.

---

## 8. Next Step After Bootstrap Is Complete

Once all six verification steps above pass, you are ready to begin **Batch 1.3 — Database Schema Migration and Seed Data**.

Batch 1.3 requires:
- PostgreSQL running and reachable at `localhost:5432` ✓
- The `lalabits` database present ✓
- TypeORM migration tooling configured (part of Batch 1.2) ✓

Batch 1.3 will:
1. Create TypeORM entity files for all 25 approved entities
2. Generate and run the initial migration
3. Seed three `LegalDocumentVersion` records (ToS, Privacy Policy, Creator Agreement)
4. Seed one admin `User` record (`is_admin = true`)

Do not start Batch 1.3 until bootstrap verification passes.

---

## Quick Reference — Local Service URLs

| Service | URL | Credentials |
|---|---|---|
| Backend API | `http://localhost:3001` | — |
| Frontend | `http://localhost:3000` | — |
| PostgreSQL | `localhost:5432` | `lalabits` / `lalabits` |
| Redis | `localhost:6379` | — (no auth) |
| MinIO S3 API | `http://localhost:9000` | `lalabits` / `lalabits123` |
| MinIO Console | `http://localhost:9001` | `lalabits` / `lalabits123` |
| Mailpit SMTP | `localhost:1025` | — (no auth) |
| Mailpit Web UI | `http://localhost:8025` | — |
