import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wave29MembershipPause1775900003000 implements MigrationInterface {
  name = 'Wave29MembershipPause1775900003000';

  async up(queryRunner: QueryRunner): Promise<void> {
    // Add 'paused' to the membership_subscriptions status enum
    await queryRunner.query(`
      ALTER TYPE membership_subscriptions_status_enum ADD VALUE IF NOT EXISTS 'paused'
    `);

    // Add pause-related columns
    await queryRunner.query(`
      ALTER TABLE membership_subscriptions
        ADD COLUMN IF NOT EXISTS paused_at TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS pause_resumes_at TIMESTAMPTZ
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE membership_subscriptions
        DROP COLUMN IF EXISTS paused_at,
        DROP COLUMN IF EXISTS pause_resumes_at
    `);
    // Note: cannot remove enum value in PostgreSQL without recreating type
  }
}
