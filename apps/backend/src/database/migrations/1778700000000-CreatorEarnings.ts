import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatorEarnings1778700000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE earning_source_type AS ENUM ('subscription', 'product', 'collection')
    `);
    await queryRunner.query(`
      CREATE TYPE earning_status AS ENUM ('pending', 'confirmed', 'paid')
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS creator_earnings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
        source_type earning_source_type NOT NULL,
        source_id UUID NOT NULL,
        gross_amount_try NUMERIC(12,2) NOT NULL,
        commission_rate NUMERIC(5,4) NOT NULL DEFAULT 0.2000,
        commission_amount NUMERIC(12,2) NOT NULL,
        net_amount_try NUMERIC(12,2) NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'TRY',
        period_month SMALLINT,
        period_year SMALLINT,
        status earning_status NOT NULL DEFAULT 'pending',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_creator_earnings_creator_profile_id
        ON creator_earnings(creator_profile_id)
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_creator_earnings_status
        ON creator_earnings(status)
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_creator_earnings_period
        ON creator_earnings(period_year, period_month)
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS creator_earnings`);
    await queryRunner.query(`DROP TYPE IF EXISTS earning_status`);
    await queryRunner.query(`DROP TYPE IF EXISTS earning_source_type`);
  }
}
