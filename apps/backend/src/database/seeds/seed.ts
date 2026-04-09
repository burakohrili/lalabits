/**
 * Minimal bootstrap seed — local development only.
 *
 * Inserts:
 *   - 3 LegalDocumentVersion records (terms_of_service, privacy_policy, creator_agreement)
 *   - 1 admin User record (is_admin = true, has_fan_role = false)
 *
 * Idempotent: safe to run multiple times.
 * Do NOT run in staging or production.
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  entities: [path.resolve(__dirname, '../../**/*.entity.ts')],
  migrations: [],
});

const VERSION_DATE = '2026-03-01';
const ADMIN_EMAIL = 'admin@lalabits.local';
const ADMIN_DEV_PASSWORD = 'LocalAdmin1!';

async function run(): Promise<void> {
  await AppDataSource.initialize();
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // ── 1. Legal document versions ─────────────────────────────────────────

    const legalDocs = [
      {
        document_type: 'terms_of_service',
        version_identifier: VERSION_DATE,
        effective_date: VERSION_DATE,
        is_current: true,
      },
      {
        document_type: 'privacy_policy',
        version_identifier: VERSION_DATE,
        effective_date: VERSION_DATE,
        is_current: true,
      },
      {
        document_type: 'creator_agreement',
        version_identifier: VERSION_DATE,
        effective_date: VERSION_DATE,
        is_current: true,
      },
    ];

    for (const doc of legalDocs) {
      const existing = await queryRunner.query(
        `SELECT id FROM legal_document_versions WHERE document_type = $1 AND is_current = true`,
        [doc.document_type],
      );

      if (existing.length > 0) {
        console.log(
          `  SKIP  legal_document_versions: ${doc.document_type} (already exists, id=${existing[0].id})`,
        );
        continue;
      }

      const result = await queryRunner.query(
        `INSERT INTO legal_document_versions (document_type, version_identifier, effective_date, is_current)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [doc.document_type, doc.version_identifier, doc.effective_date, doc.is_current],
      );

      console.log(
        `  INSERT legal_document_versions: ${doc.document_type} v${doc.version_identifier} (id=${result[0].id})`,
      );
    }

    // ── 2. Admin user ──────────────────────────────────────────────────────

    const existingAdmin = await queryRunner.query(
      `SELECT id FROM users WHERE email = $1`,
      [ADMIN_EMAIL],
    );

    if (existingAdmin.length > 0) {
      console.log(
        `  SKIP  users: ${ADMIN_EMAIL} (already exists, id=${existingAdmin[0].id})`,
      );
    } else {
      const passwordHash = await bcrypt.hash(ADMIN_DEV_PASSWORD, 12);

      const result = await queryRunner.query(
        `INSERT INTO users (email, password_hash, display_name, has_fan_role, is_admin, account_status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [ADMIN_EMAIL, passwordHash, 'System Admin', false, true, 'active'],
      );

      console.log(
        `  INSERT users: ${ADMIN_EMAIL} is_admin=true (id=${result[0].id})`,
      );
      console.log(`  DEV PASSWORD: ${ADMIN_DEV_PASSWORD}  ← change before any shared environment`);
    }

    await queryRunner.commitTransaction();
    console.log('\nSeed completed successfully.');
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error('\nSeed failed — transaction rolled back.', err);
    process.exit(1);
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

run();
