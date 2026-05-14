import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatorPayouts1778800000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'paid', 'failed')
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS creator_payouts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
        period_month SMALLINT NOT NULL,
        period_year SMALLINT NOT NULL,
        total_earnings_try NUMERIC(12,2) NOT NULL,
        total_commission_try NUMERIC(12,2) NOT NULL,
        net_payout_try NUMERIC(12,2) NOT NULL,
        status payout_status NOT NULL DEFAULT 'pending',
        paid_at TIMESTAMPTZ,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (creator_profile_id, period_month, period_year)
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_creator_payouts_creator_profile_id
        ON creator_payouts(creator_profile_id)
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_creator_payouts_status
        ON creator_payouts(status)
    `);

    await queryRunner.query(`
      CREATE TYPE payout_document_type AS ENUM ('e_fatura', 'e_arsiv', 'e_smm', 'other')
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS payout_documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        payout_id UUID NOT NULL REFERENCES creator_payouts(id) ON DELETE CASCADE,
        creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
        document_type payout_document_type NOT NULL,
        file_key VARCHAR NOT NULL,
        uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        verified_at TIMESTAMPTZ,
        verified_by UUID REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_payout_documents_payout_id
        ON payout_documents(payout_id)
    `);

    // creator_profiles'a yeni alanlar
    await queryRunner.query(`
      ALTER TABLE creator_profiles
        ADD COLUMN IF NOT EXISTS paid_sales_enabled BOOLEAN NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS tax_document_status VARCHAR(30) NOT NULL DEFAULT 'pending'
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE creator_profiles DROP COLUMN IF EXISTS paid_sales_enabled`);
    await queryRunner.query(`ALTER TABLE creator_profiles DROP COLUMN IF EXISTS tax_document_status`);
    await queryRunner.query(`DROP TABLE IF EXISTS payout_documents`);
    await queryRunner.query(`DROP TABLE IF EXISTS creator_payouts`);
    await queryRunner.query(`DROP TYPE IF EXISTS payout_document_type`);
    await queryRunner.query(`DROP TYPE IF EXISTS payout_status`);
  }
}
