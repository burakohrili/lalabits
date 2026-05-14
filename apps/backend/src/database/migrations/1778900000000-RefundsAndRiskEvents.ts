import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefundsAndRiskEvents1778900000000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    // refund_requests
    await queryRunner.query(`
      CREATE TYPE refund_status AS ENUM ('open', 'approved', 'rejected', 'processed')
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS refund_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subscription_id UUID REFERENCES membership_subscriptions(id) ON DELETE SET NULL,
        invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
        reason TEXT NOT NULL,
        status refund_status NOT NULL DEFAULT 'open',
        amount_try NUMERIC(12,2),
        processed_by UUID REFERENCES users(id) ON DELETE SET NULL,
        processed_at TIMESTAMPTZ,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_refund_requests_user_id ON refund_requests(user_id)
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_refund_requests_status ON refund_requests(status)
    `);

    // risk_events
    await queryRunner.query(`
      CREATE TYPE risk_event_type AS ENUM ('chargeback', 'fraud_flag', 'dispute', 'suspicious_login', 'payout_hold')
    `);
    await queryRunner.query(`
      CREATE TYPE risk_severity AS ENUM ('low', 'medium', 'high', 'critical')
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS risk_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        creator_profile_id UUID REFERENCES creator_profiles(id) ON DELETE SET NULL,
        event_type risk_event_type NOT NULL,
        severity risk_severity NOT NULL DEFAULT 'medium',
        description TEXT,
        resolved BOOLEAN NOT NULL DEFAULT false,
        resolved_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_risk_events_user_id ON risk_events(user_id)
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_risk_events_resolved ON risk_events(resolved)
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_risk_events_severity ON risk_events(severity)
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS risk_events`);
    await queryRunner.query(`DROP TYPE IF EXISTS risk_severity`);
    await queryRunner.query(`DROP TYPE IF EXISTS risk_event_type`);
    await queryRunner.query(`DROP TABLE IF EXISTS refund_requests`);
    await queryRunner.query(`DROP TYPE IF EXISTS refund_status`);
  }
}
