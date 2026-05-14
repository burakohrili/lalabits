import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatorBillingFields1778100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "creator_profiles"
        ADD COLUMN IF NOT EXISTS "legal_full_name" character varying,
        ADD COLUMN IF NOT EXISTS "tc_identity_number_encrypted" character varying,
        ADD COLUMN IF NOT EXISTS "tax_number" character varying,
        ADD COLUMN IF NOT EXISTS "phone_number" character varying,
        ADD COLUMN IF NOT EXISTS "full_address" text,
        ADD COLUMN IF NOT EXISTS "city" character varying,
        ADD COLUMN IF NOT EXISTS "postal_code" character varying,
        ADD COLUMN IF NOT EXISTS "entity_type" character varying NOT NULL DEFAULT 'individual',
        ADD COLUMN IF NOT EXISTS "company_name" character varying,
        ADD COLUMN IF NOT EXISTS "billing_info_completed_at" timestamptz,
        ADD COLUMN IF NOT EXISTS "billing_descriptor" character varying
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "creator_profiles"
        DROP COLUMN IF EXISTS "legal_full_name",
        DROP COLUMN IF EXISTS "tc_identity_number_encrypted",
        DROP COLUMN IF EXISTS "tax_number",
        DROP COLUMN IF EXISTS "phone_number",
        DROP COLUMN IF EXISTS "full_address",
        DROP COLUMN IF EXISTS "city",
        DROP COLUMN IF EXISTS "postal_code",
        DROP COLUMN IF EXISTS "entity_type",
        DROP COLUMN IF EXISTS "company_name",
        DROP COLUMN IF EXISTS "billing_info_completed_at",
        DROP COLUMN IF EXISTS "billing_descriptor"
    `);
  }
}
