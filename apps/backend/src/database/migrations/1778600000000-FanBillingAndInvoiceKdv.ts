import { MigrationInterface, QueryRunner } from 'typeorm';

export class FanBillingAndInvoiceKdv1778600000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    // fan_billing_profiles
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS fan_billing_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        legal_full_name VARCHAR(200),
        tax_number VARCHAR(20),
        billing_address TEXT,
        city VARCHAR(100),
        postal_code VARCHAR(10),
        billing_email VARCHAR(200),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_fan_billing_profiles_user_id ON fan_billing_profiles(user_id)
    `);

    // checkout_consents
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS checkout_consents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subscription_id UUID REFERENCES membership_subscriptions(id) ON DELETE SET NULL,
        product_id UUID,
        consent_version VARCHAR(50) NOT NULL,
        consented_at TIMESTAMPTZ NOT NULL,
        billing_descriptor VARCHAR(500),
        ip_address VARCHAR(50),
        user_agent TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_checkout_consents_user_id ON checkout_consents(user_id)
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_checkout_consents_subscription_id ON checkout_consents(subscription_id)
    `);

    // KDV alanları invoices tablosuna ekleniyor
    await queryRunner.query(`
      ALTER TABLE invoices
        ADD COLUMN IF NOT EXISTS vat_rate NUMERIC(5,2) DEFAULT 20,
        ADD COLUMN IF NOT EXISTS vat_amount NUMERIC(12,2),
        ADD COLUMN IF NOT EXISTS subtotal_excl_vat NUMERIC(12,2)
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE invoices DROP COLUMN IF EXISTS vat_rate`);
    await queryRunner.query(`ALTER TABLE invoices DROP COLUMN IF EXISTS vat_amount`);
    await queryRunner.query(`ALTER TABLE invoices DROP COLUMN IF EXISTS subtotal_excl_vat`);
    await queryRunner.query(`DROP TABLE IF EXISTS checkout_consents`);
    await queryRunner.query(`DROP TABLE IF EXISTS fan_billing_profiles`);
  }
}
