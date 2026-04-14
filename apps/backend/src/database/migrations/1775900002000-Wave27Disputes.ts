import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wave27Disputes1775900002000 implements MigrationInterface {
  name = 'Wave27Disputes1775900002000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_disputes_status_enum') THEN
          CREATE TYPE payment_disputes_status_enum AS ENUM (
            'open', 'under_review', 'resolved_refund', 'resolved_no_action', 'closed'
          );
        END IF;
      END $$
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS payment_disputes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        fan_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
        subscription_id UUID REFERENCES membership_subscriptions(id) ON DELETE SET NULL,
        reason TEXT NOT NULL,
        status payment_disputes_status_enum NOT NULL DEFAULT 'open',
        admin_notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_payment_disputes_fan_user_id
        ON payment_disputes (fan_user_id, created_at DESC)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_payment_disputes_status
        ON payment_disputes (status, created_at DESC)
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS payment_disputes`);
    await queryRunner.query(`DROP TYPE IF EXISTS payment_disputes_status_enum`);
  }
}
